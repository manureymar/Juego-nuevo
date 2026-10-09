import { COLORS } from './level.js';

export class BoardRenderer {
  constructor(canvas, engine, onEvents) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.engine = engine; this.onEvents = onEvents;
    this.effects = []; this.raf = 0; this.last = 0; this.acc = 0; this.visual = 0;
    this.reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
    canvas.width = 512 * dpr; canvas.height = 512 * dpr;
    this.ctx.scale(dpr, dpr);
    this.frame = this.frame.bind(this);
  }
  start() { this.last = performance.now(); this.raf = requestAnimationFrame(this.frame); }
  stop() { cancelAnimationFrame(this.raf); this.raf = 0; }
  frame(now) {
    const dt = Math.min((now - this.last) / 1000, 0.05); this.last = now;
    this.visual += dt;
    this.acc += dt;
    while (this.acc >= 1 / 60) { this.engine.tick(1 / 60); this.acc -= 1 / 60; }
    const events = this.engine.drainEvents();
    for (const e of events) if (e.type === 'shot') this.effects.push({ ...e, age: 0 });
    this.effects = this.effects.filter(e => (e.age += dt) < 0.32);
    this.draw();
    if (events.length) this.onEvents(events);
    if (this.raf) this.raf = requestAnimationFrame(this.frame);
  }
  point(step) {
    const n = this.engine.level.size, d = ((step % (4 * n)) + 4 * n) % (4 * n);
    const lane = this.engine.lane(Math.floor(d));
    const v = 105 + lane.index * 25 + 12.5;
    return lane.side === 0 ? { x: v, y: 443, side: 0 } : lane.side === 1 ? { x: 443, y: v, side: 1 } : lane.side === 2 ? { x: v, y: 69, side: 2 } : { x: 69, y: v, side: 3 };
  }
  position(progress) {
    const d = Math.max(0, progress), f = d - Math.floor(d);
    const a = this.point(Math.floor(d)), b = this.point(Math.floor(d) + 1);
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, side: a.side };
  }
  rounded(x, y, w, h, r, fill, stroke) {
    const c = this.ctx; c.beginPath(); c.roundRect(x, y, w, h, r);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.stroke(); }
  }
  track() {
    const c = this.ctx;
    c.beginPath(); c.moveTo(117.5,443); c.lineTo(392.5,443); c.lineTo(443,392.5); c.lineTo(443,117.5); c.lineTo(392.5,69); c.lineTo(117.5,69); c.lineTo(69,117.5); c.lineTo(69,392.5); c.closePath();
  }
  draw() {
    const c = this.ctx, e = this.engine;
    c.clearRect(0,0,512,512);
    const bg = c.createLinearGradient(0,0,512,512); bg.addColorStop(0,'#152b40'); bg.addColorStop(1,'#081525');
    c.lineWidth = 1; this.rounded(25,25,462,462,35,bg,'#26485d');
    c.strokeStyle = '#1f4054'; c.lineWidth = 1;
    for(let i=0;i<=12;i++){c.beginPath();c.moveTo(105+i*25,105);c.lineTo(105+i*25,405);c.stroke();c.beginPath();c.moveTo(105,105+i*25);c.lineTo(405,105+i*25);c.stroke();}
    this.track(); c.lineWidth = 35; c.strokeStyle = '#030d19'; c.stroke();
    this.track(); c.lineWidth = 27; c.strokeStyle = '#25394d'; c.stroke();
    this.track(); c.lineWidth = 24; c.strokeStyle = '#102639'; c.stroke();
    this.track(); c.lineWidth = 2; c.setLineDash([5,14]); c.lineDashOffset = -this.visual * 22; c.strokeStyle = '#2e8caf'; c.stroke(); c.setLineDash([]);
    c.fillStyle = '#64e5ff';
    for(const x of [30,476])for(const y of [105,255,400]){c.fillRect(x,y,4,14);}
    for(let r=0;r<e.grid.length;r++)for(let col=0;col<e.grid[r].length;col++){
      const color = e.grid[r][col]; if(!color) continue;
      const p = COLORS[color], x=106+col*25,y=106+r*25;
      c.fillStyle = p.dark;c.fillRect(x,y+3,23,22);
      c.fillStyle = p.hex;c.fillRect(x,y,23,20);
      c.fillStyle = '#ffffff60';c.fillRect(x+2,y+1,19,2);
      c.fillStyle = '#00000015';c.fillRect(x+20,y+3,3,17);
      c.fillStyle = '#06203560'; c.font = 'bold 10px sans-serif';c.textAlign='center';c.fillText(p.symbol,x+11,y+14);
    }
    for(const effect of this.effects){
      const alpha = 1-effect.age/.32, from=this.point(effect.step), tx=117.5+effect.target.col*25,ty=117.5+effect.target.row*25;
      c.globalAlpha=alpha;
      if(effect.age<.13){c.beginPath();c.moveTo(from.x,from.y);c.lineTo(tx,ty);c.lineWidth=3;c.strokeStyle=COLORS[effect.color].hex;c.stroke();}
      if(!this.reduced)for(let k=0;k<5;k++){const angle=k*1.256,dist=effect.age*100;c.fillStyle=COLORS[effect.color].hex;c.fillRect(tx+Math.cos(angle)*dist-2,ty+Math.sin(angle)*dist-2,5,5);}
      c.globalAlpha=1;
    }
    for(const robot of e.active){ const p=this.position(robot.progress);this.robot(p.x,p.y,p.side,robot.color,robot.ammo,robot.progress<0?.6:1); }
  }
  robot(x,y,side,color,ammo,opacity){
    const c=this.ctx,p=COLORS[color];c.save();c.globalAlpha=opacity;c.translate(x,y);c.rotate([0,-Math.PI/2,Math.PI,Math.PI/2][side]);
    c.lineWidth=2;this.rounded(-19,-16,35,33,9,'#091521','#7d9dac');this.rounded(-15,-13,27,26,7,p.hex,p.dark);
    this.rounded(-10,-7,17,14,4,'#152535','#9aa9b5');
    c.fillStyle='#fff2c7';c.fillRect(-7,-3,4,6);c.fillRect(1,-3,4,6);
    this.rounded(11,-27,10,30,3,'#26394b','#aac2ce');c.fillStyle=p.hex;c.fillRect(13,-26,6,14);c.fillStyle='#fff';c.fillRect(14,-26,4,2);
    c.fillStyle='#ffd05d';c.fillRect(-15,-20,5,7);c.restore();
    c.save();c.translate(x,y);c.font='bold 14px sans-serif';c.textAlign='center';c.lineWidth=1;this.rounded(-15,15,30,20,6,'#081422','#4d7086');c.fillStyle='#f3faff';c.fillText(String(ammo),0,30);c.restore();
  }
}
