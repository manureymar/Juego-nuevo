import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultProfile,winRun,sanitizeProfile} from '../game/src/profile.js';
import {leaderboardRows,monthKey,monthRemaining} from '../game/src/ranking.js';

test('monthly scores roll over without erasing career best, including restored saves',()=>{
  const october=Date.UTC(2026,9,31,23,58), november=Date.UTC(2026,10,1);
  const p=defaultProfile(october);
  winRun(p,'oct',{score:2000,stars:3},october);
  assert.equal(p.monthlyScore,2000);
  assert.equal(leaderboardRows(p,'monthly','global','YOU',november).find(r=>r.player).score,0);
  assert.equal(leaderboardRows(p,'master','global','YOU',november).find(r=>r.player).score,2000);
  const restored=sanitizeProfile(p,november);
  assert.equal(restored.bestScore,2000);assert.equal(restored.monthlyScore,0);
  winRun(restored,'nov',{score:1200,stars:2},november);
  assert.equal(restored.monthlyScore,1200);assert.equal(restored.bestScore,2000);
  assert.equal(winRun(restored,'nov',{score:9999,stars:3},november),0);
  assert.equal(restored.monthlyScore,1200);
});

test('ranking orders player and fixtures with consistent ranks, filters and robot identity',()=>{
  const now=Date.UTC(2026,9,9),p=defaultProfile(now);
  p.bestScore=2000;p.monthlyScore=1250;p.skin='violet';
  const career=leaderboardRows(p,'master','global','YOU',now);
  assert.equal(career[0].player,true);assert.equal(career[0].skin,'violet');
  const month=leaderboardRows(p,'monthly','global','YOU',now);
  assert.equal(month.find(r=>r.player).rank,4);
  assert.deepEqual(month.map(r=>r.rank),[1,2,3,4,5,6,7]);
  assert.equal(month.filter(r=>r.player).length,1);
  assert.notDeepEqual(month,leaderboardRows(p,'monthly','country','YOU',now));
});

test('monthly calendar countdown handles December, leap years and exact UTC boundaries',()=>{
  assert.equal(monthKey(Date.UTC(2026,11,31,23)), '2026-12');
  assert.equal(monthRemaining(Date.UTC(2026,11,31,23)), '0d 1h');
  assert.equal(monthRemaining(Date.UTC(2028,1,1)), '29d 0h');
  assert.equal(monthRemaining(Date.UTC(2026,10,1)), '30d 0h');
});
