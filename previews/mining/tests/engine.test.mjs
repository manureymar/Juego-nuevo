import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Mine,CAPACITY,VALUE} from '../engine.js';
import {ik} from '../renderer.js';
test('Every ore identity is picked up and loaded exactly once; bounded belt, connected arm and cart capacity',()=>{
 const m=new Mine();const picked=new Set(),loaded=new Set();let cursor=0;
 for(let i=0;i<60*20;i++){
  m.update(1/20);assert.ok(m.belt.length<=4);assert.ok(m.cargo.length<=CAPACITY);
  for(let j=1;j<m.belt.length;j++)assert.ok(m.belt[j-1].t-m.belt[j].t>=.289999);
  const elbow=ik(m.arm);assert.ok(Math.abs(Math.hypot(elbow.x-229,elbow.y-502)-110)<.001);assert.ok(Math.abs(Math.hypot(elbow.x-m.arm.x,elbow.y-m.arm.y)-110)<.001);
  const ids=[...m.belt,...m.cargo,...(m.holding?[m.holding]:[])].map(x=>x.id);assert.equal(ids.length,new Set(ids).size);
  for(const e of m.events.slice(cursor)){if(e.type==='pickup'){assert.ok(!picked.has(e.id));picked.add(e.id);}if(e.type==='load'){assert.ok(picked.has(e.id));assert.ok(!loaded.has(e.id));loaded.add(e.id);}}cursor=m.events.length;
 }
 assert.ok(m.trips>=2);assert.equal(m.coins,m.delivered*VALUE);
});
test('Full wagon departs, pays once, and returns empty before the next load',()=>{
 const m=new Mine();while(m.cart==='parked')m.update(.1);assert.equal(m.cargo.length,CAPACITY);assert.equal(m.phase,'idle');const first=m.coins;m.update(3.25);assert.equal(m.cart,'returning');assert.equal(m.cargo.length,0);assert.equal(m.coins,first+CAPACITY*VALUE);const balance=m.coins;m.update(2);assert.equal(m.coins,balance);assert.equal(m.cargo.length,0);m.update(2);assert.equal(m.cart,'parked');
});
test('Partial collection waits for held ore, never drops a load into a departed cart',()=>{
 const m=new Mine();m.update(5);assert.ok(m.holding);assert.ok(m.collect());while(m.cart==='parked')m.update(.05);assert.equal(m.holding,null);assert.equal(m.phase,'idle');assert.equal(m.cargo.length,2);assert.equal(m.collect(),false);m.update(3.3);assert.equal(m.coins,2*VALUE);
});
test('Reset clears the complete run and empty collection does nothing',()=>{
 const m=new Mine();assert.equal(m.collect(),false);m.update(70);m.reset();assert.deepEqual(m.snapshot(),new Mine().snapshot());
});
