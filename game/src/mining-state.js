// First-mine tuning: 300 coins/hour, two hours of storage. Existing saved gold
// above the new production capacity is retained and remains fully collectible.
export const ORE_MS=60000,ORE_VALUE=5,STORAGE_GOLD=120,MAX_GOLD=9999999;
export function miningState(raw,wins,now=Date.now()){
 const unlocked=wins>0,built=unlocked&&raw?.built===true;
 const integer=n=>Number.isFinite(n)?Math.max(0,Math.min(MAX_GOLD,Math.floor(n))):0;
 const total=built?integer(raw?.totalGold):0;
 return {unlocked,rewardSeen:unlocked&&raw?.rewardSeen===true,built,
  builtAt:built&&Number.isFinite(raw.builtAt)?Math.min(now,Math.max(0,raw.builtAt)):built?now:null,
  producedAt:built&&Number.isFinite(raw.producedAt)?Math.min(now,Math.max(0,raw.producedAt)):built?now:null,
  totalGold:total,storedGold:built?Math.min(total,integer(raw.storedGold)):0};
}
export function unlockMining(profile){
 if(profile.wins<1||profile.mining.unlocked)return false;
 profile.mining.unlocked=true;return true;
}
export function claimMiningCard(profile){
 if(!profile.mining.unlocked||profile.mining.rewardSeen)return false;
 profile.mining.rewardSeen=true;return true;
}
export function validMinePosition(x,y){return Number.isFinite(x)&&Number.isFinite(y)&&((x-265)/210)**2+((y-433)/172)**2<=1;}
export function buildMine(profile,x,y,now=Date.now()){
 const m=profile.mining;
 if(!m.unlocked||!m.rewardSeen||m.built||!validMinePosition(x,y))return false;
 Object.assign(m,{built:true,builtAt:now,producedAt:now,totalGold:0,storedGold:0});return true;
}
export function accrueGold(profile,now=Date.now()){
 const m=profile.mining;if(!m?.built||!Number.isFinite(now)||now<m.producedAt)return 0;
 const units=Math.floor((now-m.producedAt)/ORE_MS);if(!units)return 0;
 m.producedAt+=units*ORE_MS;
 const added=Math.max(0,Math.min(units,STORAGE_GOLD-m.storedGold));
 m.totalGold=Math.min(MAX_GOLD,m.totalGold+added);m.storedGold+=added;return added;
}
export function collectGold(profile,now=Date.now()){
 accrueGold(profile,now);const m=profile.mining;
 const units=Math.min(m.storedGold,Math.floor((9999999-profile.coins)/ORE_VALUE));
 if(!m.built||units<=0)return 0;
 m.storedGold-=units;profile.coins+=units*ORE_VALUE;return units*ORE_VALUE;
}
