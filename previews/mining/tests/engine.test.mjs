import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Mine,CAPACITY,VALUE} from '../engine.js';
import {ik,drillingParticles} from '../renderer.js';

test('Each pickup is loaded once; continuous production keeps belt and arm valid',()=>{
 const m=new Mine(),picked=new Set(),loaded=new Set();let cursor=0;
 for(let i=0;i<60*20;i++){
  m.update(1/20);assert.ok(m.belt.length<=4);assert.ok(m.cargo.length<=CAPACITY);
  for(let j=1;j<m.belt.length;j++)assert.ok(m.belt[j-1].t-m.belt[j].t>=.289999);
  const elbow=ik(m.arm);assert.ok(Math.abs(Math.hypot(elbow.x-229,elbow.y-502)-110)<.001);assert.ok(Math.abs(Math.hypot(elbow.x-m.arm.x,elbow.y-m.arm.y)-110)<.001);
  const ids=[...m.belt,...m.cargo,...(m.holding?[m.holding]:[])].map(x=>x.id);assert.equal(ids.length,new Set(ids).size);
  for(const e of m.events.slice(cursor)){
   if(e.type==='pickup'){assert.ok(!picked.has(e.id));picked.add(e.id);}
   if(e.type==='load'){assert.ok(picked.has(e.id));assert.ok(!loaded.has(e.id));loaded.add(e.id);}
  }
  cursor=m.events.length;assert.equal(m.gold,loaded.size);assert.equal(m.goldValue,m.gold*VALUE);
 }
 assert.ok(m.gold>CAPACITY*2);
});

test('Full wagon stays parked with an unchanged pile while gold keeps growing',()=>{
 const m=new Mine();m.update(32);const pile=m.snapshot().cargo;assert.equal(pile.length,CAPACITY);const firstGold=m.gold;
 for(let i=0;i<300;i++){
  m.update(1);assert.equal(m.cart,'parked');assert.deepEqual(m.snapshot().cargo,pile);assert.equal(m.goldValue,m.gold*VALUE);
 }
 assert.ok(m.gold>firstGold+60);assert.ok(m.events.length<=200);
 assert.equal(m.events.some(e=>['depart','delivered','returned'].includes(e.type)),false);
});

test('Gold is credited at deposit, not while the gripper holds it',()=>{
 const m=new Mine();m.update(5);assert.ok(m.holding);const gold=m.gold;
 while(m.phase!=='release')m.update(.01);
 assert.equal(m.gold,gold);while(m.phase==='release')m.update(.01);
 assert.equal(m.gold,gold+1);assert.equal(m.holding,null);m.update(.3);assert.equal(m.gold,gold+1);
});

test('Contact particles stay small and local, animate with time and freeze on the same clock',()=>{
 const kinds=new Set();let maxY=382;
 for(let t=0;t<10;t+=.05){const particles=drillingParticles(t);assert.ok(particles.length<=26);
  assert.deepEqual(particles,drillingParticles(t));
  for(const p of particles){kinds.add(p.kind);assert.ok(p.x>=380&&p.x<=417);assert.ok(p.y>370&&p.y<453);assert.ok(p.alpha>=0&&p.alpha<=1);assert.ok(p.size<=4.2);maxY=Math.max(maxY,p.y);}
 }
 assert.equal(kinds.size,3);assert.ok(maxY>430);assert.notDeepEqual(drillingParticles(2),drillingParticles(2.1));
});

test('Reset clears gold, fill stages and animation state',()=>{
 const m=new Mine();m.update(70);m.reset();assert.deepEqual(m.snapshot(),new Mine().snapshot());
});
