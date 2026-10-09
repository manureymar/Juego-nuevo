import { LEVEL_ONE, COLORS, blockCounts } from './level.js';

/** Pure deterministic game state. Rendering, payments and the DOM never enter here. */
export class GameEngine {
  constructor(level = LEVEL_ONE) {
    this.level = level;
    this.grid = level.grid.map(row => [...row].map(c => c === '.' ? null : c));
    this.queues = level.queues.map((q, col) => q.map((r, i) => ({ ...r, id: `q${col}-${i}`, initialAmmo: r.ammo })));
    this.active = [];
    this.waiting = Array(level.parkingCapacity).fill(null);
    this.status = 'ready';
    this.reason = '';
    this.elapsed = 0;
    this.shots = 0;
    this.launches = 0;
    this.destroyed = 0;
    this.total = Object.values(blockCounts(level.grid)).reduce((a, b) => a + b, 0);
    this.events = [];
  }

  get remaining() { return this.total - this.destroyed; }
  get isRunning() { return this.status === 'ready' || this.status === 'playing'; }

  canLaunch(robot) {
    if (!this.isRunning) return 'not_playing';
    if (!robot || robot.ammo <= 0) return 'empty';
    if (this.active.length >= this.level.beltCapacity) return 'belt_full';
    return null;
  }

  launchQueue(column) {
    const robot = this.queues[column]?.[0];
    const error = this.canLaunch(robot);
    if (error) return { ok: false, error };
    this.queues[column].shift();
    return this.launch(robot);
  }

  launchWaiting(slot) {
    const robot = this.waiting[slot];
    const error = this.canLaunch(robot);
    if (error) return { ok: false, error };
    this.waiting[slot] = null;
    return this.launch(robot);
  }

  selectQueue(column, index) {
    const queue=this.queues[column], robot=queue?.[index];
    const error=this.canLaunch(robot);
    if(error)return {ok:false,error};
    queue.splice(index,1);
    return this.launch(robot);
  }

  addWaitingBay() {
    if(!this.isRunning)return {ok:false,error:'not_playing'};
    if(this.waiting.length>=this.level.parkingCapacity+1)return {ok:false,error:'bay_limit'};
    this.waiting.push(null);
    this.events.push({type:'bay-added'});
    return {ok:true};
  }

  shuffleQueues(random=Math.random) {
    if(!this.isRunning)return {ok:false,error:'not_playing'};
    const robots=this.queues.flat();
    if(robots.length<2)return {ok:false,error:'no_queue'};
    const before=robots.map(r=>r.id).join(',');
    for(let i=robots.length-1;i>0;i--){const j=Math.floor(Math.max(0,Math.min(.999999,random()))*(i+1));[robots[i],robots[j]]=[robots[j],robots[i]];}
    if(robots.map(r=>r.id).join(',')===before)robots.push(robots.shift());
    let offset=0;
    this.queues=this.queues.map(q=>{const next=robots.slice(offset,offset+q.length);offset+=q.length;return next;});
    this.events.push({type:'shuffled'});
    return {ok:true};
  }

  launch(robot) {
    // A small launch queue keeps all five units visually separated at the entry.
    const earliest = Math.min(0, ...this.active.map(r => r.progress));
    const progress = this.active.length && earliest < 3 ? earliest - 3 : -0.01;
    this.active.push({ ...robot, progress });
    this.status = 'playing';
    this.launches++;
    this.events.push({ type: 'launch', color: robot.color });
    return { ok: true };
  }

  /** Side order is bottom, right, top, left: counterclockwise on screen. */
  lane(step) {
    const n = this.level.size;
    const side = Math.floor(step / n);
    const offset = step % n;
    return { side, index: side === 1 || side === 2 ? n - 1 - offset : offset };
  }

  exposed(side, index) {
    const n = this.level.size;
    for (let depth = 0; depth < n; depth++) {
      const row = side === 0 ? n - 1 - depth : side === 2 ? depth : index;
      const col = side === 1 ? n - 1 - depth : side === 3 ? depth : index;
      if (this.grid[row]?.[col]) return { row, col, color: this.grid[row][col] };
    }
    return null;
  }

  exposedCounts() {
    const seen = new Set();
    const counts = {};
    for (let side = 0; side < 4; side++) for (let lane = 0; lane < this.level.size; lane++) {
      const t = this.exposed(side, lane);
      if (t && !seen.has(`${t.row}:${t.col}`)) {
        seen.add(`${t.row}:${t.col}`);
        counts[t.color] = (counts[t.color] || 0) + 1;
      }
    }
    return counts;
  }

  tick(dt) {
    if (this.status !== 'playing' || !Number.isFinite(dt) || dt <= 0) return;
    // Fixed simulation steps in the renderer and a clamp avoid background jumps.
    dt = Math.min(dt, 0.1);
    this.elapsed += dt;
    const perimeter = this.level.size * 4;
    for (const robot of [...this.active]) {
      if (!this.isRunning) break;
      const previous = robot.progress;
      robot.progress += dt * this.level.speed;
      for (let step = Math.max(0, Math.floor(previous) + 1); step <= Math.min(perimeter - 1, Math.floor(robot.progress)); step++) {
        if (robot.ammo <= 0) break;
        const lane = this.lane(step);
        const target = this.exposed(lane.side, lane.index);
        if (target?.color === robot.color) {
          this.grid[target.row][target.col] = null;
          robot.ammo--;
          this.shots++;
          this.destroyed++;
          this.events.push({ type: 'shot', color: robot.color, id:robot.id, step, target });
          if (!this.remaining) { this.status = 'won'; this.events.push({ type: 'won' }); break; }
        }
      }
      if (robot.ammo <= 0) {
        this.active = this.active.filter(r => r.id !== robot.id);
        this.events.push({ type: 'spent', id: robot.id });
      } else if (robot.progress >= perimeter && this.isRunning) {
        const slot = this.waiting.indexOf(null);
        if (slot < 0) { this.fail('parking_full'); break; }
        const { progress, ...parked } = robot;
        this.waiting[slot] = parked;
        this.active = this.active.filter(r => r.id !== robot.id);
        this.events.push({ type: 'park', slot, color: robot.color });
      }
    }
    if (this.isRunning && !this.active.length && !this.waiting.some(Boolean) && this.queues.every(q => !q.length) && this.remaining) this.fail('no_ammo');
  }

  fail(reason = 'abandoned') {
    if (!this.isRunning && this.status !== 'paused') return false;
    this.status = 'lost'; this.reason = reason;
    this.events.push({ type: 'lost', reason });
    return true;
  }

  pause() { if (this.isRunning) { this.beforePause = this.status; this.status = 'paused'; } }
  resume() { if (this.status === 'paused') this.status = this.beforePause === 'ready' ? 'ready' : 'playing'; }
  drainEvents() { return this.events.splice(0); }
  result() {
    const stars = this.elapsed < 100 ? 3 : this.elapsed < 180 ? 2 : 1;
    const score = Math.max(100, Math.round(1200 - this.elapsed * 3 - Math.max(0, this.launches - 8) * 8));
    return { stars, score, seconds: Math.round(this.elapsed), shots: this.shots };
  }

  snapshot() {
    return JSON.parse(JSON.stringify({ version: 2, levelId: this.level.id, levelRevision:this.level.revision||1, grid: this.grid, queues: this.queues, active: this.active, waiting: this.waiting, status: this.status, beforePause: this.beforePause, elapsed: this.elapsed, shots: this.shots, launches: this.launches, destroyed: this.destroyed, reason: this.reason }));
  }

  static restore(s, level = LEVEL_ONE) {
    const fresh = new GameEngine(level);
    if (!s || s.version !== 2 || s.levelId !== level.id || s.levelRevision !== (level.revision||1)) return null;
    if (!Array.isArray(s.grid) || s.grid.length !== level.size || s.grid.some(row => !Array.isArray(row) || row.length !== level.size || row.some(c => c !== null && !COLORS[c]))) return null;
    if (!Array.isArray(s.queues) || s.queues.length !== 3 || s.queues.some(q => !Array.isArray(q))) return null;
    if (!Array.isArray(s.active) || s.active.length > level.beltCapacity || !Array.isArray(s.waiting) || ![level.parkingCapacity,level.parkingCapacity+1].includes(s.waiting.length)) return null;
    const robots = [...s.active, ...s.waiting.filter(Boolean), ...s.queues.flat()];
    if (new Set(robots.map(r => r?.id)).size !== robots.length) return null;
    if (robots.some(r => !r || !COLORS[r.color] || !Number.isInteger(r.ammo) || r.ammo < 1 || r.ammo > 100 || typeof r.id !== 'string')) return null;
    if (s.active.some(r => !Number.isFinite(r.progress) || r.progress < -20 || r.progress > level.size * 4)) return null;
    if (!['ready', 'playing', 'paused', 'won', 'lost'].includes(s.status)) return null;
    if (!['elapsed', 'shots', 'launches', 'destroyed'].every(k => Number.isFinite(s[k]) && s[k] >= 0)) return null;
    const remaining = Object.values(blockCounts(s.grid)).reduce((a, b) => a + b, 0);
    if (s.destroyed !== fresh.total - remaining) return null;
    Object.assign(fresh, s);
    fresh.level = level;
    fresh.events = [];
    if (fresh.status === 'paused') fresh.resume();
    return fresh;
  }
}
