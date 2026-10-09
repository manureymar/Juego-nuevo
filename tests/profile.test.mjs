import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultProfile, sanitizeProfile, loseRun, winRun, refreshEnergy, RECHARGE_MS, refillEnergy, claimDaily, buySkin, SaveStore } from '../game/src/profile.js';

test('a defeat takes exactly one battery charge; duplicate callbacks cannot double-charge',()=>{
  const p=defaultProfile(1000);assert.ok(loseRun(p,'run1',1000));assert.equal(p.energy,4);
  assert.equal(loseRun(p,'run1',1000),false);assert.equal(p.energy,4);
  for(let i=2;i<10;i++)loseRun(p,'run'+i,1000);assert.equal(p.energy,0);
});
test('energy recovers with elapsed time, is capped, and cannot accelerate with a backward clock',()=>{
  const p=defaultProfile(1000);loseRun(p,'1',1000);loseRun(p,'2',1000);
  refreshEnergy(p,1000+RECHARGE_MS-1);assert.equal(p.energy,3);
  refreshEnergy(p,1000+RECHARGE_MS);assert.equal(p.energy,4);
  refreshEnergy(p,100);assert.equal(p.energy,4);
  refreshEnergy(p,1000+20*RECHARGE_MS);assert.equal(p.energy,5);
});
test('winning rewards once and never consumes energy; personal best is persistent',()=>{
  const p=defaultProfile();assert.equal(winRun(p,'win',{score:900,stars:3}),40);
  assert.equal(winRun(p,'win',{score:900,stars:3}),0);assert.equal(p.energy,5);assert.equal(p.coins,240);
  assert.equal(loseRun(p,'win'),false);winRun(p,'win2',{score:700,stars:2});assert.equal(p.bestScore,900);assert.equal(p.bestStars,3);assert.equal(p.coins,250);
});
test('recharge and skins reject insufficient funds; full battery does not cost coins',()=>{
  const p=defaultProfile(1000);assert.equal(refillEnergy(p,1000),'full');assert.equal(p.coins,200);
  loseRun(p,'lose',1000);assert.equal(refillEnergy(p,1000),'ok');assert.equal(p.coins,80);assert.equal(p.energy,5);
  assert.equal(buySkin(p,'violet'),'funds');assert.equal(p.coins,80);p.coins=500;
  assert.equal(buySkin(p,'violet'),'ok');assert.equal(p.coins,150);assert.equal(buySkin(p,'cyan'),'ok');assert.equal(buySkin(p,'violet'),'ok');assert.equal(p.coins,150);
});
test('daily supply cannot be repeatedly claimed on the same day',()=>{
  const p=defaultProfile();assert.equal(claimDaily(p,'2026-10-09'),true);assert.equal(claimDaily(p,'2026-10-09'),false);assert.equal(p.coins,300);
  assert.equal(claimDaily(p,'2026-10-10'),true);assert.equal(p.coins,400);
});
test('invalid stored values are bounded and storage failures do not break the game',()=>{
  const p=sanitizeProfile({version:1,coins:-9,energy:999,language:'xx',ownedSkins:['evil'],skin:'evil'});assert.equal(p.coins,0);assert.equal(p.energy,5);assert.equal(p.language,'en');assert.equal(p.skin,'cyan');
  const store=new SaveStore({getItem(){throw Error('blocked');},setItem(){throw Error('quota');}});assert.equal(store.load().energy,5);assert.equal(store.save(defaultProfile()),false);
});
