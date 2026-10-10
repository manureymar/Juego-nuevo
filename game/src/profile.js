import {miningState,unlockMining} from './mining-state.js';
import { monthKey } from './ranking.js';
export const SAVE_KEY = 'robot-pulse-v1';
export const MAX_ENERGY = 5;
export const RECHARGE_MS = 30 * 60 * 1000;
export function energyCountdown(p, now = Date.now()) {
  if (p.energy >= MAX_ENERGY) return 'MAX';
  const seconds = Math.max(0, Math.ceil((RECHARGE_MS - Math.max(0, now - p.energyAt)) / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
export const TOOL_PACKS={bay:{count:1,cost:300},select:{count:3,cost:1900},shuffle:{count:3,cost:1500}};
export const PACKS = [
  { coins: 1000, price: '$1.99' }, { coins: 3000, price: '$4.99' }, { coins: 7500, price: '$9.99' },
  { coins: 16000, price: '$19.99' }, { coins: 40000, price: '$39.99' }, { coins: 90000, price: '$79.99' },
];
export const SKINS = [
  { id: 'cyan', color: '#2edbff', cost: 0 },
  { id: 'amber', color: '#ffc443', cost: 250 },
  { id: 'violet', color: '#b890ff', cost: 350 },
];

export function defaultProfile(now = Date.now()) {
  return { mining:miningState(null,0,now), version: 1, tools:{bay:1,select:1,shuffle:1}, coins: 200, energy: 5, energyAt: now, bestScore: 0, monthlyKey: monthKey(now), monthlyScore: 0, bestStars: 0, wins: 0, language: 'en', sound: true, music: true, skin: 'cyan', ownedSkins: ['cyan'], dailyClaim: '', rewardedRuns: [], lostRuns: [], session: null, tutorialSeen: false };
}

const bounded = (v, max, fallback = 0) => Number.isFinite(v) ? Math.max(0, Math.min(max, Math.floor(v))) : fallback;
export function sanitizeProfile(raw, now = Date.now()) {
  const p = defaultProfile(now);
  if (!raw || raw.version !== 1) return p;
  p.coins = bounded(raw.coins, 9999999, 200);
  for(const key of Object.keys(TOOL_PACKS))p.tools[key]=bounded(raw.tools?.[key],999,1);
  p.energy = bounded(raw.energy, MAX_ENERGY, 5);
  p.energyAt = Number.isFinite(raw.energyAt) ? Math.min(now, Math.max(0, raw.energyAt)) : now;
  p.bestScore = bounded(raw.bestScore, 1000000);
  p.monthlyKey = monthKey(now);
  p.monthlyScore = raw.monthlyKey === p.monthlyKey ? bounded(raw.monthlyScore, 1000000) : 0;
  p.bestStars = bounded(raw.bestStars, 3);
  p.wins = bounded(raw.wins, 1000000);
  p.mining=miningState(raw.mining,p.wins,now);
  p.language = raw.language === 'es' ? 'es' : 'en';
  p.sound = raw.sound !== false;
  p.music = raw.music !== false;
  p.ownedSkins = Array.isArray(raw.ownedSkins) ? [...new Set(['cyan', ...raw.ownedSkins.filter(id => SKINS.some(s => s.id === id))])] : ['cyan'];
  p.skin = p.ownedSkins.includes(raw.skin) ? raw.skin : 'cyan';
  p.dailyClaim = typeof raw.dailyClaim === 'string' ? raw.dailyClaim.slice(0, 10) : '';
  p.rewardedRuns = Array.isArray(raw.rewardedRuns) ? raw.rewardedRuns.filter(x => typeof x === 'string').slice(-50) : [];
  p.lostRuns = Array.isArray(raw.lostRuns) ? raw.lostRuns.filter(x => typeof x === 'string').slice(-50) : [];
  p.session = raw.session && typeof raw.session.id === 'string' && raw.session.engine ? raw.session : null;
  p.tutorialSeen = raw.tutorialSeen === true;
  return refreshEnergy(p, now);
}

export function refreshEnergy(p, now = Date.now()) {
  if (p.energy >= MAX_ENERGY) { p.energyAt = now; return p; }
  const added = Math.floor(Math.max(0, now - p.energyAt) / RECHARGE_MS);
  if (added) { p.energy = Math.min(MAX_ENERGY, p.energy + added); p.energyAt = p.energy === MAX_ENERGY ? now : p.energyAt + added * RECHARGE_MS; }
  return p;
}

export function loseRun(p, id, now = Date.now()) {
  if (p.lostRuns.includes(id) || p.rewardedRuns.includes(id)) return false;
  refreshEnergy(p, now);
  if (p.energy === MAX_ENERGY) p.energyAt = now;
  p.energy = Math.max(0, p.energy - 1);
  p.lostRuns = [...p.lostRuns.slice(-49), id];
  p.session = null;
  return true;
}

export function winRun(p, id, result, now = Date.now()) {
  if (p.rewardedRuns.includes(id) || p.lostRuns.includes(id)) return 0;
  const reward = p.wins ? 10 : 40;
  p.coins += reward;
  p.wins++;
  unlockMining(p);
  p.bestScore = Math.max(p.bestScore, result.score);
  if (p.monthlyKey !== monthKey(now)) { p.monthlyKey = monthKey(now); p.monthlyScore = 0; }
  p.monthlyScore = Math.max(p.monthlyScore || 0, result.score);
  p.bestStars = Math.max(p.bestStars, result.stars);
  p.rewardedRuns = [...p.rewardedRuns.slice(-49), id];
  p.session = null;
  return reward;
}

export function refillEnergy(p, now = Date.now()) {
  refreshEnergy(p, now);
  if (p.energy === MAX_ENERGY) return 'full';
  if (p.coins < 120) return 'funds';
  p.coins -= 120; p.energy = MAX_ENERGY; p.energyAt = now;
  return 'ok';
}

export function buySkin(p, id) {
  const skin = SKINS.find(s => s.id === id);
  if (!skin) return 'invalid';
  if (!p.ownedSkins.includes(id)) {
    if (p.coins < skin.cost) return 'funds';
    p.coins -= skin.cost; p.ownedSkins.push(id);
  }
  p.skin = id;
  return 'ok';
}

export function buyTools(p,key){
  const pack=TOOL_PACKS[key];
  if(!pack)return 'invalid';
  if(p.tools[key]+pack.count>999)return 'full';
  if(p.coins<pack.cost)return 'funds';
  p.coins-=pack.cost;p.tools[key]+=pack.count;
  return 'ok';
}

export function useTool(p,key,apply){
  if(!TOOL_PACKS[key]||!p.tools[key])return {ok:false,error:'no_tools'};
  const result=apply();
  if(result.ok)p.tools[key]--;
  return result;
}

export function localDate(now = new Date()) { return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; }
export function claimDaily(p, today = localDate()) {
  if (p.dailyClaim === today) return false;
  p.dailyClaim = today; p.coins += 100;
  return true;
}

export class SaveStore {
  constructor(storage = globalThis.localStorage) { this.storage = storage; this.available = true; }
  load() {
    try { return sanitizeProfile(JSON.parse(this.storage.getItem(SAVE_KEY))); }
    catch { this.available = false; return defaultProfile(); }
  }
  save(p) {
    try { this.storage.setItem(SAVE_KEY, JSON.stringify(p)); return true; }
    catch { this.available = false; return false; }
  }
}
