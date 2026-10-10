// Reproducible irregular emission, independent of frame rate and tied to the mine clock.
// Birth records are cached only for the recent window; no particle history grows forever.
const STEP=.6,WINDOW=4.8,cache=new Map();
export const CONTACT={x:417,y:382};
const G=205,FLOOR=484;
export function random(seed){let n=Math.imul((seed|0)^0x9e3779b9,0x85ebca6b);n^=n>>>13;n=Math.imul(n,0xc2b2ae35);return ((n^(n>>>16))>>>0)/4294967296;}
const smooth=t=>t*t*(3-2*t);
function air(t,seed){const n=Math.floor(t),f=smooth(t-n);return (random(n+seed)*(1-f)+random(n+1+seed)*f)*2-1;}
export function pressure(t){
 const n=Math.floor(t/2.7),f=smooth(t/2.7-n);
 const a=random(n+7301),b=random(n+7302);
 return .05+.95*(a*(1-f)+b*f)**2;
}
function displacement(age,v,a,drag){const k=(1-Math.exp(-drag*age))/drag;return v*k+a/drag*(age-k);}
function velocity(age,v,a,drag){const e=Math.exp(-drag*age);return v*e+a/drag*(1-e);}
export function particlePosition(age,p){
 const dx=displacement(age,p.vx,0,p.drag),dy=displacement(age,p.vy,p.gravity,p.drag);
 let x=p.ox+dx,y=p.oy+dy;
 if(p.kind==='dust'){
  // Fine suspended dust follows changing air currents; heavier dust settles.
  x+=age*air(p.birth+age*.65,p.seed+210)*p.turbulence;
  y+=age*air(p.birth+age*.48,p.seed+420)*p.turbulence*.48;
 }else if(y>FLOOR){
  // One inelastic impact on the rock ledge; chips lose most of their energy.
  let lo=0,hi=age;for(let i=0;i<12;i++){const mid=(lo+hi)/2;if(p.oy+displacement(mid,p.vy,p.gravity,p.drag)<FLOOR)lo=mid;else hi=mid;}
  const hit=(lo+hi)/2,after=age-hit;
  x=p.ox+displacement(hit,p.vx,0,p.drag)+velocity(hit,p.vx,0,p.drag)*after*.43;
  y=FLOOR-displacement(after,velocity(hit,p.vy,p.gravity,p.drag)*p.rebound,-p.gravity,p.drag*2);
  y=Math.min(FLOOR,y);
 }
 return {x,y};
}
function make(seed,kind,birth,strength){
 const r=n=>random(seed+n*101),dust=kind==='dust';
 // The visible face of the contact ejects fragments in a broad, uneven fan.
 const angle=(r(1)<.65?Math.PI:0)+(r(2)-.5)*Math.PI*1.25;
 const speed=dust?9+r(3)*22:20+r(3)**1.5*(70+strength*65);
 const size=dust?4+r(4)*8:kind==='grit'?.55+r(4)*1.7:.65+r(4)**2*1.15;
 const drag=dust?1.1+r(5)*1.4:.35+r(5)*1.4+(1.6-Math.min(size,1.6))*.7;
 const p={seed,kind,birth,ox:CONTACT.x+(r(6)-.5)*5,oy:CONTACT.y+(r(7)-.5)*6,
  vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-(dust?4:12),size,drag,
  gravity:dust?(r(8)<.35?-5-r(9)*8:12+r(9)*18):G,
  life:dust?1.7+r(10)*2.2:kind==='grit'?1.1+r(10)*1.1:.4+r(10)*1.45,
  rebound:.12+r(11)*.28,turbulence:3+r(12)*9,opacity:dust?.2+r(13)*.3:.55+r(13)*.45,
  stretch:.5+r(14)*.9,rotation:r(15)*6.28,spin:(r(16)-.5)*3,
  exposure:.013+r(17)**2*.065,hot:r(18),strength};
 p.lobes=Array.from({length:4},(_,i)=>({x:(r(20+i*3)-.5)*1.1,y:(r(21+i*3)-.5)*.9,size:.5+r(22+i*3)*.55}));
 return p;
}
function births(block){
 if(cache.has(block))return cache.get(block);
 const records=[],seed=block*977+91073,time=block*STEP,strength=pressure(time);
 // A small trickle plus short clusters, with longer quiet and busy periods.
 const burst=random(seed+1)<.12+strength*.78;
 const count=burst?4+Math.floor((10+strength*34)*random(seed+2)):random(seed+3)<.65?1:0;
 const start=time+random(seed+4)*STEP*.7;
 for(let i=0;i<count;i++)records.push(make(seed+i*31,'spark',start+random(seed+i+5)*(.025+random(seed+8)*.16),strength));
 const dustCount=burst?2+Math.floor(random(seed+10)*(2+strength*6)):random(seed+11)<.32?1:0;
 for(let i=0;i<dustCount;i++)records.push(make(seed+400+i*31,'dust',start+random(seed+i+15)*.26,strength));
 const gritCount=burst?1+Math.floor(random(seed+20)*(3+strength*7)):0;
 for(let i=0;i<gritCount;i++)records.push(make(seed+800+i*31,'grit',start+random(seed+i+25)*.15,strength));
 cache.set(block,records);return records;
}
export function drillingParticles(time){
 const first=Math.floor((time-WINDOW)/STEP),last=Math.floor(time/STEP),result=[];
 for(const key of cache.keys())if(key<first||key>last)cache.delete(key);
 for(let block=first;block<=last;block++)for(const p of births(block)){
  const age=time-p.birth;if(age<0||age>=p.life)continue;
  const progress=age/p.life,pos=particlePosition(age,p);
  if(pos.x<285||pos.x>492||pos.y<315||pos.y>500)continue;
  const fadeIn=Math.min(1,age/(p.kind==='dust'?.16:.018));
  const fadeOut=(1-smooth(Math.max(0,(progress-.28)/.72)));
  const alpha=p.opacity*fadeIn*fadeOut;if(alpha<.005)continue;
  const trail=p.kind==='spark'?Array.from({length:4},(_,j)=>particlePosition(Math.max(0,age-j*p.exposure/3),p)):[];
  result.push({...p,...pos,age,alpha,trail,progress,
   size:p.kind==='dust'?p.size+age*(4+random(p.seed+33)*6):p.size*(1-progress*.42),
   rotation:p.rotation+age*p.spin});
 }
 return result.slice(-180);
}
