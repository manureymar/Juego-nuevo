import {art} from './art.js';
import {sprite} from './game-art.js';
import {pulseCoin,guideArrow} from './ui-pieces.js';
import {Mine,CAPACITY} from './mining/engine.js';
import {Renderer} from './mining/renderer.js';
import {validMinePosition,buildMine,accrueGold,ORE_VALUE,ORE_MS,STORAGE_GOLD} from './mining-state.js';
export const MINING_ASSETS={background:'background-built.png',empty:'background-empty.png',parts:'parts.png',drill:'drill.png',preview:'../polish/mine-preview.png'};
export const MAP_VIEW={x:0,y:135,w:887,h:1190};
const FOCUS_VIEW={x:0,y:188,w:610,h:819};
const lock='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 13V9a7 7 0 0 1 14 0v4M7 13h18v16H7z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M16 19v4" stroke="currentColor" stroke-width="3"/></svg>';
export const buildingArt=(name,extra='')=>`<span class="building-art building-${name} ${extra}" aria-hidden="true"></span>`;
export function miningView({t,profile,hud,button}){
 const built=profile.mining.built;
 return `<section class="menu-scene mining-scene" data-scene-width="887" data-scene-height="1774" aria-label="${t('miningBase')}">
 ${hud()}<div class="mining-heading">${sprite('level-plaque','mining-title-art')}${button('home',sprite('icon-button-frame')+'<span>‹</span>','mining-back',`aria-label="${t('toHome')}"`)}<h1>${t('miningBase')}</h1><button id="mine-focus" aria-label="${t('focusMine')}" ${built?'':'disabled'}>${sprite('icon-button-frame')}<span class="mine-focus-label">＋</span></button></div>
 <div class="mining-map"><canvas id="mine-canvas" aria-label="${t('miningBase')}"></canvas><button id="mine-target" aria-label="${t('placeMine')}" disabled></button><div class="mining-load" role="status">${t('miningLoading')}</div></div>
 <div class="mining-status" role="status" aria-live="polite">${sprite('section-plaque')}<span class="mining-status-label">${built?t('mineWorking'):t('dragMine')}</span></div>
 <div class="mining-yield" ${built?'':'hidden'}>${sprite('level-plaque','yield-frame')}<div class="gold-balance"><span class="ore-symbol" aria-hidden="true">◆</span><span><small>${t('storedCapacity')}</small><b id="mining-gold">${profile.mining.storedGold}</b><small id="mining-rate">${t('mineRate')}</small></span></div>${button('collect-mining',`<span class="collect-label">${t('collectGold')}</span><span class="collect-amount">${pulseCoin()}<b id="mining-value">+${profile.mining.storedGold*ORE_VALUE}</b></span>`,'primary mining-collect',profile.mining.storedGold?'':'disabled')}</div>
 <div class="mining-guide" aria-hidden="true">${guideArrow()}</div>
 <div class="construction-tray" aria-label="${t('constructionCatalog')}"><div class="tray-heading">${sprite('section-plaque')}<span>${t('constructionCatalog')}</span></div>${['mine','power','trucks','fuel','storage'].map((name,i)=>`<button class="build-option ${i?'locked':built?'installed':'available'}" ${i?'data-action="mining-locked" aria-disabled="true"':`id="mine-build" ${built?'disabled':''}`} aria-label="${t(name)} · ${i?t('tool_future'):built?t('mineInstalled'):t('dragMine')}">${art('product-card','build-card-edge')}${name==='mine'?'<img class="mine-catalog-art" src="assets/polish/mine-preview.png" alt="" draggable="false">':buildingArt(name)}<span class="build-name">${t(name)}</span>${i?`<span class="build-lock">${lock}</span>`:`<span class="build-badge">${built?'✓':'＋'}</span><small>${built?t('mineInstalled'):t('mineAvailable')}</small>`}</button>`).join('')}</div>
 <button id="mine-cancel" class="mine-cancel art-button secondary" hidden disabled>${sprite('button-secondary','button-art')}<span class="button-label">${t('cancelBuild')}</span></button>
 </section>`;
}
export class MineSceneRenderer {
 constructor(canvas,images){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.images=images;this.parts=new Renderer(canvas,images);this.view=MAP_VIEW;this.transform={scale:1,ox:0,oy:0};}
 setView(focus){this.view=focus?FOCUS_VIEW:MAP_VIEW;}
 toWorld(clientX,clientY){const rect=this.canvas.getBoundingClientRect(),{scale,ox,oy}=this.transform;
  return {x:((clientX-rect.left)*this.canvas.width/rect.width-ox)/scale+this.view.x,y:((clientY-rect.top)*this.canvas.height/rect.height-oy)/scale+this.view.y};}
 drawMine(model,alpha=1,dx=0,dy=0,progress=1){
  const c=this.ctx;c.save();c.translate(dx,dy);c.globalAlpha=alpha;
  // The existing animated installation is revealed only inside its cave footprint.
  c.save();c.beginPath();c.moveTo(0,234);c.lineTo(145,195);c.lineTo(400,225);c.lineTo(511,337);c.lineTo(532,495);c.lineTo(468,570);c.lineTo(319,670);c.lineTo(0,659);c.closePath();c.clip();
  c.globalAlpha=alpha*Math.min(1,progress*2);c.drawImage(this.images.background,0,0,887,1774);c.restore();
  c.globalAlpha=alpha*Math.min(1,progress*3);this.parts.drill(model);
  c.globalAlpha=alpha*Math.max(0,Math.min(1,(progress-.15)*3));this.parts.belt(model);
  c.globalAlpha=alpha*Math.max(0,Math.min(1,(progress-.3)*3));this.parts.cart(model);
  c.globalAlpha=alpha*Math.max(0,Math.min(1,(progress-.4)*3));this.parts.arm(model);c.restore();
 }
 assemblyEffect(progress){
  const c=this.ctx,fade=Math.sin(Math.PI*progress),cx=270,cy=540;
  c.save();c.globalCompositeOperation='lighter';
  // Elliptical energy circuits climb around the installation, with a grounded pulse.
  for(let ring=0;ring<3;ring++){
   const phase=(progress*1.4+ring*.3)%1,y=650-phase*405;
   c.beginPath();c.ellipse(cx,y,220*(.8+.2*phase),58,0,0,Math.PI*2);
   c.strokeStyle=`rgba(89,239,255,${fade*(1-phase)*.75})`;c.lineWidth=3;c.shadowColor='#55eaff';c.shadowBlur=18;c.stroke();
  }
  for(let i=0;i<44;i++){
   const angle=i*2.399963,x=cx+Math.cos(angle)*(65+(i%7)*25),phase=(progress*1.35+i*.087)%1;
   const y=650-phase*(240+(i%5)*38),size=2+(i%4)*1.6;
   c.globalAlpha=fade*Math.sin(Math.PI*phase);c.fillStyle=i%4?'#b6ffff':'#ffd46b';
   c.shadowColor=c.fillStyle;c.shadowBlur=10;c.fillRect(x,y,size,size);
   if(i%3===0){c.strokeStyle='#52d8f8';c.lineWidth=1.4;c.beginPath();c.moveTo(x,y+20);c.lineTo(x,y+5);c.stroke();}
  }
  c.globalAlpha=fade*.65;c.strokeStyle='#dbffff';c.lineWidth=2;
  for(const [x,y]of [[75,590],[440,565],[280,270]]){c.beginPath();c.moveTo(x-16,y);c.lineTo(x+16,y);c.moveTo(x,y-16);c.lineTo(x,y+16);c.stroke();}
  c.restore();this.footprint('#58efff');
 }
 footprint(color,dx=0,dy=0){const c=this.ctx;c.save();c.translate(dx,dy);c.beginPath();c.moveTo(45,556);c.lineTo(270,446);c.lineTo(489,557);c.lineTo(275,669);c.closePath();c.fillStyle=color+'29';c.fill();c.strokeStyle=color;c.lineWidth=5;c.shadowColor=color;c.shadowBlur=14;c.stroke();c.restore();}
 draw(model,{built=false,placing=false,ghost=null,construction=1}={}){
  const c=this.ctx,W=this.canvas.width,H=this.canvas.height,v=this.view;
  c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);c.fillStyle='#071522';c.fillRect(0,0,W,H);
  const scale=Math.min(W/v.w,H/v.h),ox=(W-v.w*scale)/2,oy=(H-v.h*scale)/2;this.transform={scale,ox,oy};
  c.translate(ox-v.x*scale,oy-v.y*scale);c.scale(scale,scale);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(this.images.empty,0,0,887,1774);
  if(built){this.drawMine(model,1,0,0,construction);
   if(construction<1)this.assemblyEffect(construction);
  }else if(placing){
   const valid=ghost&&validMinePosition(ghost.x,ghost.y),dx=valid?0:(ghost?.x??265)-265,dy=valid?0:(ghost?.y??433)-433;
   const color=valid?'#63ffad':'#ff6868';
   this.footprint(color,dx,dy);
   c.save();c.translate(dx,dy);c.globalAlpha=.68;c.shadowColor=color;c.shadowBlur=12;
   c.drawImage(this.images.preview,18,192,505,505);c.restore();

  }else{this.footprint('#54dff5');}
 }
}
let assetPromise;
function loadAssets(){if(!assetPromise)assetPromise=Promise.all(Object.entries(MINING_ASSETS).map(async([key,name])=>{const image=new Image();image.src='assets/mining/'+name;await image.decode();return [key,image];})).then(Object.fromEntries).catch(error=>{assetPromise=null;throw error;});return assetPromise;}
export class MiningController {
 constructor(root,{profile,t,save,sound,toast}){
  Object.assign(this,{root,profile,t,save,sound,toast});this.canvas=root.querySelector('#mine-canvas');this.model=new Mine();this.placing=false;this.ghost=null;this.pointer=null;this.raf=0;this.previous=0;this.dead=false;this.blocked=false;this.nativePaused=false;this.buildStarted=0;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.lastSaved=0;this.lastUI=0;this.focus=false;
  this.abort=new AbortController();const on=(el,event,fn,opts={})=>el.addEventListener(event,fn,{...opts,signal:this.abort.signal});
  const source=root.querySelector('#mine-build');
  on(source,'pointerdown',e=>{if(e.button!==0||!e.isPrimary||this.profile.mining.built||!this.renderer||this.blocked)return;e.preventDefault();this.pointer=e.pointerId;source.setPointerCapture(e.pointerId);this.placing=true;this.sound('tap');this.move(e);});
  on(source,'pointermove',e=>{if(this.pointer===e.pointerId)this.move(e);});
  on(source,'pointerup',e=>{if(this.pointer!==e.pointerId)return;e.preventDefault();this.move(e);this.pointer=null;if(source.hasPointerCapture(e.pointerId))source.releasePointerCapture(e.pointerId);this.commit();});
  on(source,'pointercancel',()=>this.cancel());on(source,'lostpointercapture',()=>{if(this.pointer!==null)this.cancel();});
  on(source,'click',e=>{if(e.detail===0&&!this.profile.mining.built&&this.renderer){this.sound('tap');this.placing=true;this.ghost={x:265,y:433};this.updateUI();root.querySelector('#mine-target').focus();}});
  on(root.querySelector('#mine-target'),'click',()=>{if(this.placing){this.sound('tap');this.ghost={x:265,y:433};this.commit();}});
  on(root.querySelector('#mine-cancel'),'click',()=>{this.sound('tap');this.cancel();});
  on(root.querySelector('#mine-focus'),'click',()=>{if(!this.profile.mining.built)return;this.sound('tap');this.focus=!this.focus;this.renderer?.setView(this.focus);this.resize();this.updateUI();});
  on(document,'keydown',e=>{if(e.key==='Escape'&&this.placing){e.preventDefault();e.stopImmediatePropagation();this.cancel();}}, {capture:true});
  on(document,'visibilitychange',()=>{if(document.hidden){this.cancel();this.previous=0;this.save();}});
  on(document,'robotpulse:pause',()=>{this.nativePaused=true;this.cancel();this.save();});on(document,'robotpulse:resume',()=>{this.nativePaused=false;this.previous=0;});
  on(window,'pagehide',()=>{accrueGold(profile);this.save();});
  this.observer=new ResizeObserver(()=>{this.cancel(false);this.resize();});this.observer.observe(this.canvas);
  loadAssets().then(images=>{if(this.dead)return;this.renderer=new MineSceneRenderer(this.canvas,images);this.root.querySelector('.mining-load').hidden=true;this.root.dataset.loaded='true';this.resize();this.updateUI();this.raf=requestAnimationFrame(t=>this.frame(t));}).catch(()=>{if(this.dead)return;const el=root.querySelector('.mining-load');el.textContent=t('miningError');const b=document.createElement('button');b.textContent=t('retry');b.onclick=()=>location.reload();el.append(b);});
  this.updateUI();
 }
 move(e){if(!this.renderer)return;this.ghost=this.renderer.toWorld(e.clientX,e.clientY);this.updateUI();}
 commit(){if(!this.ghost)return;const {x,y}=this.ghost;
  if(buildMine(this.profile,x,y)){this.model.reset();this.buildStarted=performance.now();this.save();this.sound('claim');this.cancel(false);this.updateUI();}
  else{this.cancel(false);this.toast(this.t('invalidMine'));}
 }
 cancel(update=true){this.pointer=null;this.placing=false;this.ghost=null;if(update)this.updateUI();}
 setBlocked(value){this.blocked=value;if(value)this.cancel();this.previous=0;}
 resize(){if(!this.renderer)return;const rect=this.canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.max(1,Math.round(rect.width*d));this.canvas.height=Math.max(1,Math.round(rect.height*d));this.draw();}
 draw(){if(!this.renderer)return;const construction=this.buildStarted?Math.min(1,(performance.now()-this.buildStarted)/(this.reduced?180:2300)):1;this.renderer.draw(this.model,{built:this.profile.mining.built,placing:this.placing,ghost:this.ghost,construction});}
 updateUI(){if(this.dead)return;const m=this.profile.mining,built=m.built,valid=this.ghost&&validMinePosition(this.ghost.x,this.ghost.y);
  // Avoid repeated live-region announcements and accessibility-tree updates on Android.
  const text=(el,value)=>{if(el.textContent!==value)el.textContent=value;};
  const flag=(el,key,value)=>{if(el[key]!==value)el[key]=value;};
  this.root.classList.toggle('mine-built',built);this.root.classList.toggle('placing',this.placing);this.root.classList.toggle('placement-valid',!!valid);this.root.dataset.placement=this.placing?(valid?'valid':'invalid'):'idle';
  text(this.root.querySelector('.mining-status-label'),built?(this.buildStarted&&performance.now()-this.buildStarted<(this.reduced?180:2300)?this.t('buildingMine'):this.t('mineWorking')):this.placing?this.t(valid?'releaseMine':'invalidMine'):this.t('dragMine'));
  flag(this.root.querySelector('.mining-yield'),'hidden',!built);
  const amount=n=>new Intl.NumberFormat(this.profile.language,n>=10000?{notation:'compact',maximumFractionDigits:1}:{}).format(n);
  text(this.root.querySelector('#mining-gold'),amount(m.storedGold));
  const remaining=Math.max(0,Math.ceil((ORE_MS-(Date.now()-m.producedAt)%ORE_MS)/1000));
  text(this.root.querySelector('#mining-rate'),m.storedGold>=STORAGE_GOLD?this.t('goldCapacity'):this.t('nextOre')+' '+Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0'));
  this.root.querySelector('.mining-collect').setAttribute('aria-label',this.t('collectGold')+' '+amount(m.storedGold*ORE_VALUE)+' '+this.t('coins'));
  this.root.querySelector('.mining-yield').setAttribute('title',this.t('mineRate')+' · '+this.t('coinConversion'));
  text(this.root.querySelector('#mining-value'),'+'+amount(m.storedGold*ORE_VALUE));
  flag(this.root.querySelector('[data-action=collect-mining]'),'disabled',!m.storedGold);
  const source=this.root.querySelector('#mine-build');flag(source,'disabled',built);source.classList.toggle('installed',built);source.classList.toggle('available',!built);text(source.querySelector('.build-badge'),built?'✓':'＋');text(source.querySelector('small'),this.t(built?'mineInstalled':'mineAvailable'));
  flag(this.root.querySelector('#mine-target'),'disabled',!this.placing||built);
  flag(this.root.querySelector('#mine-focus'),'disabled',!built);text(this.root.querySelector('.mine-focus-label'),this.focus?'−':'＋');this.root.querySelector('#mine-focus').setAttribute('aria-label',this.t(this.focus?'mapBase':'focusMine'));
  flag(this.root.querySelector('#mine-cancel'),'hidden',!this.placing);flag(this.root.querySelector('#mine-cancel'),'disabled',!this.placing);
 }
 frame(now){if(this.dead)return;const dt=this.previous?Math.min((now-this.previous)/1000,.1):0;this.previous=now;
  if(!document.hidden&&!this.nativePaused&&!this.blocked){
   accrueGold(this.profile);
   if(this.profile.mining.built){this.model.update(dt);this.model.cargo=Array.from({length:Math.min(CAPACITY,Math.floor(Math.max(0,Date.now()-this.profile.mining.builtAt)/4000))},(_,i)=>({id:i+1}));}
   this.draw();if(now-this.lastUI>180){this.updateUI();this.lastUI=now;}if(now-this.lastSaved>5000&&this.profile.mining.built){this.save();this.lastSaved=now;}
  }
  this.raf=requestAnimationFrame(t=>this.frame(t));
 }
 stop(){this.dead=true;cancelAnimationFrame(this.raf);this.abort.abort();this.observer.disconnect();accrueGold(this.profile);this.save();}
}
