import {beltPoint} from './engine.js';
export const ASSETS={background:'assets/background.png',parts:'assets/parts.png',drill:'assets/drill.png'};
export const PARTS={
 upper:[10,170,458,195],fore:[500,175,450,174],palm:[1020,88,268,335],jaw:[1488,88,212,335],
 ore:[44,499,379,344],belt:[503,556,366,220],wagon:[908,465,420,362]
};
const FRAMES=[[29,210,473,183],[534,210,473,183],[1037,210,474,183],[29,690,473,183],[534,690,473,183],[1037,690,474,183]];
const BASE={x:229,y:502};
// Bounded emitters use simulation time, so pause and replay include the entire effect.
const noise=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
export function particlePosition(age,vx,vy,gravity){
 return {x:417+vx*age,y:382+vy*age+.5*gravity*age*age};
}
export function drillingParticles(time){
 const particles=[];
 for(let i=0;i<94;i++){
  const kind=i<48?'spark':i<72?'dust':'grit';
  const cycle=kind==='spark'?1.7:kind==='dust'?3.2:1.6;
  const elapsed=time+noise(i+1)*cycle,age=elapsed%cycle,turn=Math.floor(elapsed/cycle);
  const a=noise(i+turn*97),b=noise(i*3+turn*131+17);
  const life=kind==='dust'?2.5:kind==='spark'?1.18+a*.25:1.35;
  if(age>life)continue;
  const vx=kind==='spark'?-(18+a*52):kind==='dust'?-(15+a*18):-(8+a*31);
  const vy=kind==='spark'?-70+b*80:kind==='dust'?-8+b*12:-28+b*37;
  const gravity=kind==='dust'?36:190;
  const pos=particlePosition(age,vx,vy,gravity),progress=age/life;
  if(pos.y>496)continue;
  const fadeIn=Math.min(1,age/.07),fadeOut=Math.min(1,(1-progress)/(kind==='dust'?.55:.35));
  const trail=kind==='spark'?Array.from({length:4},(_,j)=>particlePosition(Math.max(0,age-j*.026),vx,vy,gravity)):[];
  particles.push({kind,...pos,age,vx,vy,gravity,trail,
   alpha:fadeIn*fadeOut*(kind==='dust'?.74:kind==='spark'?.98:.85),
   size:kind==='dust'?7+progress*22:kind==='grit'?1+a*1.1:1.1+a*.65,
   angle:a*6.28+age*(a-.5)*9});
 }
 return particles;
}
export function ik(end){const dx=end.x-BASE.x,dy=end.y-BASE.y;const L=110,d=Math.min(219.9,Math.max(.1,Math.hypot(dx,dy)));const angle=Math.atan2(dy,dx)+Math.acos(d/(2*L));return {x:BASE.x+L*Math.cos(angle),y:BASE.y+L*Math.sin(angle)};}
export class Renderer {
 constructor(canvas,images){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.images=images;this.view='detail';this.drawCount=0;}
 setView(view){this.view=view;}
 sprite(name,x,y,w,h){this.ctx.drawImage(this.images.parts,...PARTS[name],x,y,w,h);}
 ore(x,y,w=29,angle=0){const c=this.ctx;c.save();c.translate(x,y);c.rotate(angle);this.sprite('ore',-w/2,-w*.77,w,w*.88);c.restore();}
 link(name,a,b,srcA,srcB){const c=this.ctx,r=PARTS[name],v={x:srcB.x-srcA.x,y:srcB.y-srcA.y};const scale=Math.hypot(b.x-a.x,b.y-a.y)/Math.hypot(v.x,v.y);c.save();c.translate(a.x,a.y);c.rotate(Math.atan2(b.y-a.y,b.x-a.x)-Math.atan2(v.y,v.x));c.scale(scale,scale);c.drawImage(this.images.parts,...r,r[0]-srcA.x,r[1]-srcA.y,r[2],r[3]);c.restore();}
 draw(m){
  const c=this.ctx,W=this.canvas.width,H=this.canvas.height;this.drawCount++;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);
  const view=this.view==='map'?{x:0,y:0,w:887,h:1774}:{x:0,y:208,w:610,h:468};
  const scale=Math.min(W/view.w,H/view.h),ox=(W-view.w*scale)/2,oy=(H-view.h*scale)/2;
  c.fillStyle='#061321';c.fillRect(0,0,W,H);c.translate(ox-view.x*scale,oy-view.y*scale);c.scale(scale,scale);
  c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(this.images.background,0,0,887,1774);
  this.drill(m);this.belt(m);this.cart(m);this.arm(m);
 }
 drill(m){const c=this.ctx;const f=FRAMES[Math.floor(m.time*14)%6];c.save();c.translate(298,367);c.rotate(.13);c.drawImage(this.images.drill,...f,-5,-23,126,47);c.restore();
  this.contact(m.time);
 }
 contact(time){
  const c=this.ctx,particles=drillingParticles(time);
  // Soft layered dust is darker than the lit rock, keeping it visible on a phone.
  for(const p of particles.filter(p=>p.kind==='dust')){
   c.save();c.translate(p.x,p.y);c.rotate(-.25);c.scale(1,.78);c.globalAlpha=p.alpha;
   const cloud=c.createRadialGradient(-p.size*.2,-p.size*.15,0,0,0,p.size);
   cloud.addColorStop(0,'#e2d5c2ef');cloud.addColorStop(.3,'#b5a58ed0');cloud.addColorStop(.65,'#85796b88');cloud.addColorStop(1,'#85796b00');
   c.fillStyle=cloud;c.beginPath();c.arc(0,0,p.size,0,Math.PI*2);c.fill();c.restore();
  }
  c.save();const flash=c.createRadialGradient(417,382,1,417,382,14);
  flash.addColorStop(0,'#fff6d8bb');flash.addColorStop(.3,'#ffc24b66');flash.addColorStop(1,'#ff900000');
  c.globalAlpha=.55+.25*Math.sin(time*29)**2;c.fillStyle=flash;c.fillRect(403,368,28,28);c.restore();
  for(const p of particles.filter(p=>p.kind!=='dust')){
   c.save();c.globalAlpha=p.alpha;
   if(p.kind==='spark'){
    // Tails follow previous ballistic positions; the arc bends down under gravity.
    c.lineCap='round';c.lineJoin='round';c.beginPath();
    p.trail.forEach((point,i)=>i?c.lineTo(point.x,point.y):c.moveTo(point.x,point.y));
    c.strokeStyle='#bf501966';c.lineWidth=p.size*3;c.stroke();
    c.strokeStyle='#ffae34';c.lineWidth=p.size*2;c.stroke();
    c.strokeStyle='#fff5cc';c.lineWidth=p.size*.8;c.stroke();
    c.fillStyle='#fffce4';c.beginPath();c.arc(p.x,p.y,p.size*.8,0,Math.PI*2);c.fill();
   }else{
    c.translate(p.x,p.y);c.rotate(p.angle);c.fillStyle='#554336';c.fillRect(-p.size,-p.size,p.size*2,p.size*1.5);
    c.fillStyle='#e1b375';c.fillRect(-p.size,-p.size,p.size*1.4,p.size*.65);
   }
   c.restore();
  }
 }

 belt(m){const c=this.ctx;const A={x:199,y:457},B={x:439,y:517},D={x:190,y:471};
  c.save();c.beginPath();c.moveTo(A.x,A.y);c.lineTo(B.x,B.y);c.lineTo(430,531);c.lineTo(D.x,D.y);c.closePath();c.clip();
  // Map the generated rubber tile to the belt's surface, then shift it along its length.
  c.transform((B.x-A.x)/220,(B.y-A.y)/220,(D.x-A.x)/24,(D.y-A.y)/24,A.x,A.y);
  c.globalAlpha=.32;const offset=m.time*32%90;for(let x=-90+offset;x<310;x+=90)this.sprite('belt',x,0,90,24);c.restore();
  for(const s of [...m.belt].reverse()){const p=beltPoint(s.t);c.save();c.globalAlpha=Math.min(1,s.t*9+.12);this.ore(p.x,p.y,30,(s.id%3-1)*.15);c.restore();}
 }
 cart(m){const c=this.ctx;
  c.save();c.fillStyle='#01070c66';c.beginPath();c.ellipse(140,620,70,13,.2,0,Math.PI*2);c.fill();this.sprite('wagon',62,523,150,115);
  // Six visual stages fill the entire opening, then form a shallow heap at the rim.
  // No time-based offsets: the wagon and completed pile remain absolutely stationary.
  c.save();c.beginPath();c.moveTo(84,548);c.lineTo(105,528);c.lineTo(137,521);c.lineTo(170,542);c.lineTo(183,565);c.lineTo(151,581);c.closePath();c.clip();
  const layers=[[[112,555,27],[129,562,28]],[[147,569,28],[165,564,26]],[[100,550,26],[124,551,29]],[[147,556,29],[165,554,25]],[[111,543,27],[135,545,29]],[[133,536,29],[152,547,26]]];
  m.cargo.forEach((o,i)=>{for(const [x,y,w] of layers[i])this.ore(x,y,w,(o.id%3-1)*.12);});c.restore();c.restore();
 }
 arm(m){const c=this.ctx,joint=ik(m.arm);
  // The arm stays connected: both metal links share the same computed elbow.
  this.link('upper',BASE,joint,{x:64,y:266},{x:401,y:309});
  this.link('fore',joint,m.arm,{x:548,y:280},{x:888,y:290});
  c.save();c.translate(m.arm.x,m.arm.y);this.sprite('palm',-13,-10,26,33);
  if(m.holding)this.ore(0,29,28);
  for(const side of [-1,1]){c.save();c.translate(side*8,13);c.scale(side,1);c.rotate((1-m.grip)*-.38);this.sprite('jaw',-4,-3,17,30);c.restore();}
  c.restore();
 }
}
