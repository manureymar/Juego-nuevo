import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Mine,CAPACITY,VALUE} from '../engine.js';
import {ik} from '../renderer.js';
import {drillingParticles,particlePosition} from '../particles.js';

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

test('Emission has quiet, medium and intense moments and varied directions',()=>{
 const counts=[],directions=new Set(),sizes=new Set(),drags=new Set();
 for(let t=0;t<30;t+=.1){
  const particles=drillingParticles(t);assert.ok(particles.length<=180);
  counts.push(particles.filter(p=>p.kind==='spark').length);
  for(const p of particles){
   assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));assert.ok(p.alpha>0&&p.alpha<=1);
   assert.ok(p.x>=285&&p.x<=492&&p.y>=315&&p.y<=500);
   if(p.kind==='spark'){directions.add(`${Math.sign(p.vx)},${Math.sign(p.vy)}`);sizes.add(p.size.toFixed(1));drags.add(p.drag.toFixed(1));}
  }
 }
 assert.ok(Math.min(...counts)<5);assert.ok(Math.max(...counts)>40);assert.ok(counts.some(n=>n>=12&&n<=25));
 assert.equal(directions.size,4);assert.ok(sizes.size>8);assert.ok(drags.size>8);
});

test('Fragments have gravity and air resistance; dust drifts independently',()=>{
 const particles=drillingParticles(.5);let checked=0;
 for(const p of particles.filter(p=>p.kind!=='dust')){
  const t=.2,h=.001,a=particlePosition(t-h,p),b=particlePosition(t,p),c=particlePosition(t+h,p);
  const vy=(c.y-a.y)/(2*h),ay=(c.y-2*b.y+a.y)/(h*h);
  assert.ok(Math.abs(ay-(p.gravity-p.drag*vy))<.01,'gravity opposed by air resistance');
  for(let age=0;age<=p.life;age+=.05)assert.ok(particlePosition(age,p).y<=484.001,'ledge collision bounds falling chips');
  checked++;
 }
 assert.ok(checked>5);
 const dust=particles.filter(p=>p.kind==='dust');assert.ok(dust.length>2);
 assert.ok(new Set(dust.map(p=>p.stretch.toFixed(1))).size>2);
 assert.ok(dust.every(p=>p.lobes.length===4));
});

test('Particles freeze at the same clock and replay identically after cache eviction',()=>{
 const first=drillingParticles(2.5);assert.deepEqual(first,drillingParticles(2.5));
 drillingParticles(1000);assert.deepEqual(first,drillingParticles(2.5));
 assert.notDeepEqual(first,drillingParticles(2.6));
});

test('Reset clears gold, fill stages and animation state',()=>{
 const m=new Mine();m.update(70);m.reset();assert.deepEqual(m.snapshot(),new Mine().snapshot());
});
