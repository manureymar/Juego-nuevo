export const CAPACITY = 6;
export const VALUE = 5;
export const BELT_START = {x:270,y:474};
export const BELT_END = {x:417,y:516};
export const REST = {x:296,y:434};
export const DROP = {x:132,y:525};
export const lerp=(a,b,t)=>a+(b-a)*t;
export const ease=t=>t*t*(3-2*t);
export const mix=(a,b,t)=>({x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t)});
export const beltPoint=t=>mix(BELT_START,BELT_END,t);
export class Mine {
 constructor(){this.reset();}
 reset(){this.time=0;this.nextId=4;this.belt=[{id:1,t:1},{id:2,t:.58},{id:3,t:.16}];this.cargo=[];this.gold=0;this.phase='idle';this.phaseTime=0;this.arm={...REST};this.from={...REST};this.target={...REST};this.holding=null;this.grip=0;this.cart='parked';this.events=[];}
 get goldValue(){return this.gold*VALUE;}
 emit(type,id){this.events.push({type,id,time:this.time});if(this.events.length>200)this.events.shift();}
 enter(phase,target,duration){this.phase=phase;this.phaseTime=0;this.from={...this.arm};this.target=target;this.duration=duration;}
 update(dt){
  if(!Number.isFinite(dt)||dt<0)throw new Error('Invalid dt');
  while(dt>1e-8){const step=Math.min(dt,1/60);this.tick(step);dt-=step;}
 }
 tick(dt){
  this.time+=dt;
  for(let i=0;i<this.belt.length;i++){const limit=i===0?1:this.belt[i-1].t-.29;this.belt[i].t=Math.min(limit,this.belt[i].t+dt*.15);}
  if(this.belt.length<4&&(!this.belt.length||this.belt.at(-1).t>.29)){this.belt.push({id:this.nextId++,t:0});this.emit('spawn',this.nextId-1);}
  if(this.phase==='idle'){
   if(this.belt[0]?.t>=.999){const p=beltPoint(1);this.enter('approach',{x:p.x,y:p.y-24},.7);}
   return;
  }
  this.phaseTime+=dt;const p=Math.min(1,this.phaseTime/this.duration);this.arm=mix(this.from,this.target,ease(p));
  if(this.phase==='grab')this.grip=ease(p);
  if(this.phase==='release')this.grip=1-ease(p);
  if(p<1)return;
  switch(this.phase){
   case 'approach':this.enter('grab',this.arm,.24);break;
   case 'grab':this.holding=this.belt.shift();this.emit('pickup',this.holding.id);this.enter('lift',{x:this.arm.x,y:this.arm.y-55},.48);break;
   case 'lift':this.enter('carry',{x:DROP.x,y:DROP.y-60},1);break;
   case 'carry':this.enter('lower',DROP,.5);break;
   case 'lower':this.enter('release',this.arm,.25);break;
   case 'release':
    // Visual capacity is independent of production. A full pile never stops loading.
    if(this.cargo.length<CAPACITY)this.cargo.push(this.holding);
    this.gold++;this.emit('load',this.holding.id);this.holding=null;this.enter('return',REST,.65);break;
   case 'return':this.phase='idle';this.grip=0;break;
  }
 }
 snapshot(){return {time:this.time,phase:this.phase,arm:{...this.arm},holding:this.holding?.id??null,grip:this.grip,belt:this.belt.map(x=>({...x})),cargo:this.cargo.map(x=>x.id),gold:this.gold,goldValue:this.goldValue,cart:this.cart};}
}
