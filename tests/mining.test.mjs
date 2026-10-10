import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultProfile,sanitizeProfile,winRun,loseRun,SaveStore} from '../game/src/profile.js';
import {claimMiningCard,buildMine,accrueGold,collectGold,ORE_MS,MAX_GOLD} from '../game/src/mining-state.js';
import {Mine,CAPACITY} from '../game/src/mining/engine.js';
const time=100000;
function unlocked(){const p=defaultProfile(time);winRun(p,'first',{score:1000,stars:3},time);return p;}
function installed(){const p=unlocked();claimMiningCard(p);assert.ok(buildMine(p,265,433,time));return p;}

test('first victory earns one mining card; defeat and duplicate callbacks cannot unlock or charge it',()=>{
 const p=defaultProfile(time);loseRun(p,'loss',time);assert.equal(p.mining.unlocked,false);
 assert.equal(claimMiningCard(p),false);winRun(p,'win',{score:1000,stars:3},time);
 assert.equal(p.mining.unlocked,true);assert.equal(p.mining.rewardSeen,false);
 assert.ok(claimMiningCard(p));assert.equal(claimMiningCard(p),false);
 assert.equal(winRun(p,'win',{score:1000,stars:3},time),0);
 winRun(p,'second',{score:500,stars:1},time);assert.equal(p.mining.rewardSeen,true);
});
test('older winners receive the pending card; unlocked status cannot be forged without a win',()=>{
 const older=defaultProfile(time);delete older.mining;older.wins=2;
 const migrated=sanitizeProfile(older,time);assert.equal(migrated.mining.unlocked,true);assert.equal(migrated.mining.built,false);assert.equal(migrated.mining.rewardSeen,false);
 older.wins=0;older.mining={unlocked:true,built:true,rewardSeen:true,totalGold:20,storedGold:20};
 assert.equal(sanitizeProfile(older,time).mining.built,false);
});
test('placement requires the earned card and cave; duplicate construction never resets production',()=>{
 const p=unlocked();assert.equal(buildMine(p,265,433,time),false);claimMiningCard(p);
 for(const [x,y] of [[800,900],[-10,-10],[NaN,433],[265,Infinity]])assert.equal(buildMine(p,x,y,time),false);
 assert.equal(p.mining.built,false);assert.equal(p.coins,240);
 assert.ok(buildMine(p,265,433,time));accrueGold(p,time+ORE_MS*3);
 const before=structuredClone(p);assert.equal(buildMine(p,265,433,time+100000),false);assert.deepEqual(p,before);
});
test('idle production includes offline time, preserves partial intervals and cannot double-count',()=>{
 const p=unlocked();assert.equal(accrueGold(p,time+9999999),0);
 claimMiningCard(p);buildMine(p,265,433,time);
 assert.equal(accrueGold(p,time+ORE_MS-1),0);assert.equal(accrueGold(p,time+ORE_MS+2000),1);
 assert.equal(accrueGold(p,time+ORE_MS+2000),0);assert.equal(accrueGold(p,time-1),0);
 const saved=sanitizeProfile(JSON.parse(JSON.stringify(p)),time+10*ORE_MS+2000);
 assert.equal(accrueGold(saved,time+10*ORE_MS+2000),9);assert.equal(saved.mining.storedGold,10);
 assert.equal(accrueGold(saved,time+11*ORE_MS),1);
});
test('collection pays once, preserves a full wagon and resumes after the storage cap is collected',()=>{
 const p=installed();accrueGold(p,time+ORE_MS*8);
 assert.equal(collectGold(p,time+ORE_MS*8),40);assert.equal(collectGold(p,time+ORE_MS*8),0);
 assert.equal(p.coins,280);assert.equal(p.mining.totalGold,8);assert.equal(p.mining.storedGold,0);
 p.mining.totalGold=MAX_GOLD;p.mining.storedGold=MAX_GOLD;
 assert.equal(accrueGold(p,time+ORE_MS*9),0);p.coins=9999997;
 assert.equal(collectGold(p,time+ORE_MS*9),0);p.coins=0;
 assert.equal(collectGold(p,time+ORE_MS*9),9999995);
 assert.equal(accrueGold(p,time+ORE_MS*10),1);
 assert.ok(p.mining.storedGold<=MAX_GOLD);assert.ok(p.mining.totalGold<=MAX_GOLD);
});
test('built base, consumed card and uncollected gold survive the actual save store',()=>{
 let value=null;const store=new SaveStore({getItem:()=>value,setItem:(_,v)=>{value=v;}});
 const p=installed();accrueGold(p,time+ORE_MS*7);store.save(p);const restored=store.load();
 assert.deepEqual(restored.mining,p.mining);assert.equal(buildMine(restored,265,433),false);
});
test('approved wagon stays parked and full while the arm keeps delivering indefinitely',()=>{
 const mine=new Mine();mine.update(80);assert.equal(mine.cart,'parked');assert.equal(mine.cargo.length,CAPACITY);
 const gold=mine.gold,ids=mine.cargo.map(x=>x.id);mine.update(40);
 assert.equal(mine.cart,'parked');assert.deepEqual(mine.cargo.map(x=>x.id),ids);assert.ok(mine.gold>gold);
 assert.ok(mine.events.some(e=>e.type==='load'));
});
