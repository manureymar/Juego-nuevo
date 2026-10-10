import {beltPoint} from './engine.js';
export const ASSETS={background:'assets/background.png',parts:'assets/parts.png',drill:'assets/drill.png'};
export const PARTS={
 upper:[10,170,458,195],fore:[500,175,450,174],palm:[1020,88,268,335],jaw:[1488,88,212,335],
 ore:[44,499,379,344],belt:[503,556,366,220],wagon:[908,465,420,362]
};
const FRAMES=[[29,210,473,183],[534,210,473,183],[1037,210,474,183],[29,690,473,183],[534,690,473,183],[1037,690,474,183]];
const BASE={x:229,y:502};
// Fixed-size, deterministic particles share the simulation clock: pause freezes everything.
export function drillingParticles(time){
 const particles=[];
 for(let i=0;i<26;i++){
  const kind=i<10?'spark':i<18?'dust':'grit';
  const cycle=kind==='spark'?.72:kind==='dust'?1.7:1.2;
  const elapsed=time+(i*.137),age=elapsed%cycle,turn=Math.floor(elapsed/cycle);
  const seed=(Math.sin(i*127.1+turn*311.7)*43758.5453)%1;
  const noise=Math.abs(seed),life=cycle*(kind==='spark'?.5:.78);
  if(age>life)continue;
  const p=age/life;
  const vx=kind==='spark'?-(24+noise*42):-(5+noise*14);
  const vy=kind==='spark'?-24+noise*45:kind==='dust'?7+noise*7:noise*12;
  const gravity=kind==='spark'?55:kind==='dust'?24:70;
  particles.push({kind,x:417+vx*age,y:382+vy*age+gravity*age*age,
   alpha:Math.sin(Math.PI*p)*(kind==='dust'?.2:kind==='spark'?.9:.65),
   size:kind==='dust'?1.2+p*3:kind==='grit'?.6+noise*.6:.6,
   dx:vx*.022,dy:(vy+2*gravity*age)*.022});
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
  // Stationary contact point: the wall never erodes or changes geometry.
  const glow=.12+.12*Math.sin(m.time*21)**2;c.save();c.globalAlpha=glow;c.fillStyle='#ffce68';c.beginPath();c.ellipse(417,382,6,10,-.2,0,Math.PI*2);c.fill();c.restore();
  for(const p of drillingParticles(m.time)){
   c.save();c.globalAlpha=p.alpha;
   if(p.kind==='spark'){
    c.strokeStyle='#ffc25e';c.lineWidth=1.4;c.lineCap='round';c.beginPath();c.moveTo(p.x-p.dx,p.y-p.dy);c.lineTo(p.x,p.y);c.stroke();
    c.fillStyle='#fff1b9';c.beginPath();c.arc(p.x,p.y,.55,0,Math.PI*2);c.fill();
   }else if(p.kind==='dust'){
    c.fillStyle='#c4b398';c.beginPath();c.ellipse(p.x,p.y,p.size,p.size*.65,.3,0,Math.PI*2);c.fill();
   }else{c.fillStyle='#baa37c';c.fillRect(p.x,p.y,p.size,p.size*1.2);}
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
