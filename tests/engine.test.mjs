import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine } from '../game/src/engine.js';
import { LEVEL_ONE, blockCounts } from '../game/src/level.js';

function advance(engine,seconds){for(let i=0;i<seconds*60&&engine.isRunning;i++)engine.tick(1/60);}
function choose(engine){
  const exposed=engine.exposedCounts();
  const candidates=[...engine.waiting.map((robot,index)=>({robot,index,waiting:true})),...engine.queues.map((q,index)=>({robot:q[0],index,waiting:false}))].filter(x=>x.robot);
  candidates.sort((a,b)=>(exposed[b.robot.color]||0)-(exposed[a.robot.color]||0)||Number(b.waiting)-Number(a.waiting));
  return candidates[0];
}

test('level has exact ammunition for every color and five independent capacities',()=>{
  const counts=blockCounts(LEVEL_ONE.grid),ammo={};
  for(const r of LEVEL_ONE.queues.flat())ammo[r.color]=(ammo[r.color]||0)+r.ammo;
  assert.deepEqual(ammo,counts);assert.equal(new GameEngine().total,78);
  assert.equal(LEVEL_ONE.beltCapacity,5);assert.equal(LEVEL_ONE.parkingCapacity,5);
});
test('only queue heads can launch; belt never accepts a sixth robot',()=>{
  const g=new GameEngine();
  for(const col of [0,1,2,0,1])assert.equal(g.launchQueue(col).ok,true);
  assert.equal(g.active.length,5);
  const before=g.queues[0].length;
  assert.deepEqual(g.launchQueue(0),{ok:false,error:'belt_full'});
  assert.equal(g.queues[0].length,before);
});
test('enclosed violet pixels block a violet robot: no ammo wasted; it parks and relaunches',()=>{
  const g=new GameEngine();g.launchQueue(2);advance(g,10);
  assert.equal(g.destroyed,0);assert.equal(g.active.length,0);
  assert.equal(g.waiting[0].color,'P');assert.equal(g.waiting[0].ammo,4);
  assert.equal(g.launchWaiting(0).ok,true);assert.equal(g.waiting[0],null);
});
test('level one can be won through actual conveyor simulation without altering blocks',()=>{
  const g=new GameEngine();
  for(let turn=0;turn<100&&g.isRunning;turn++){
    const c=choose(g);assert.ok(c,'a launchable robot exists');
    assert.ok((c.waiting?g.launchWaiting(c.index):g.launchQueue(c.index)).ok);
    advance(g,10);
  }
  assert.equal(g.status,'won');assert.equal(g.remaining,0);assert.equal(g.shots,78);assert.ok(g.result().score>0);
});
test('a full waiting area causes a loss when a robot returns, not just when five park',()=>{
  const level={...LEVEL_ONE,size:1,grid:['A'],speed:4,queues:[Array.from({length:6},()=>({color:'C',ammo:1})),[],[]]};
  const g=new GameEngine(level);
  for(let i=0;i<5;i++){g.launchQueue(0);advance(g,2);}
  assert.equal(g.status,'playing');assert.equal(g.waiting.filter(Boolean).length,5);
  g.launchQueue(0);advance(g,2);assert.equal(g.status,'lost');assert.equal(g.reason,'parking_full');
});
test('pausing freezes simulation and restoring a run preserves grid, ammo and time',()=>{
  const g=new GameEngine();g.launchQueue(0);advance(g,2);g.pause();
  const before=g.snapshot();g.tick(.1);assert.deepEqual(g.snapshot(),before);
  const restored=GameEngine.restore(before);assert.equal(restored.status,'playing');
  assert.deepEqual(restored.grid,g.grid);assert.equal(restored.active[0].ammo,g.active[0].ammo);
  g.resume();advance(g,3);advance(restored,3);assert.deepEqual(restored.snapshot(),g.snapshot());
});
test('malformed saves fail safely instead of crashing or launching invalid robots',()=>{
  for(const bad of [null,{}, {version:1,levelId:1,queues:4}, {...new GameEngine().snapshot(),active:'bad'}])assert.equal(GameEngine.restore(bad),null);
  const bad=new GameEngine().snapshot();bad.grid[0][0]='X';assert.equal(GameEngine.restore(bad),null);
});
test('a terminal result cannot be changed by a second failure or ticking',()=>{
  const g=new GameEngine();assert.equal(g.fail(),true);const before=g.snapshot();
  assert.equal(g.fail(),false);g.tick(.1);assert.deepEqual(g.snapshot(),before);
});
