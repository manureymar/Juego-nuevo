import { GAME_ART } from './game-art-data.js';
export { GAME_ART };
export const robotColor={C:'cyan',P:'violet',A:'amber'};
for(const color of ['cyan','violet','amber'])GAME_ART['robot-'+color+'-queue'].file='robots-live-atlas.png';
GAME_ART['robot-platform']={file:'robots-platforms.png',rect:[16,648,506,174],sourceSize:[1536,1024]};
const images=new Map();
export const artReady=Promise.all([...new Set(Object.values(GAME_ART).map(a=>a.file))].map(file=>new Promise(resolve=>{
  const img=new Image();images.set(file,img);img.onload=()=>resolve();img.onerror=()=>resolve();img.src='assets/gameplay/'+file;
})));

function region(a,rect,cls=''){
  const [x,y,w,h]=rect,[width,height]=a.sourceSize;
  return `<span class="gp-sprite ${cls}" aria-hidden="true"><img src="assets/gameplay/${a.file}" alt="" draggable="false" style="left:${-100*x/w}%;top:${-100*y/h}%;width:${100*width/w}%;height:${100*height/h}%"></span>`;
}
export function sprite(name,cls='',{noClose=false}={}){
  const a=GAME_ART[name];if(!a)throw Error('Unknown gameplay sprite: '+name);
  if(name.startsWith('modal-')){
    const [x,y,w,h]=a.rect,dx=90,top=190,bottom=100;
    const xs=[x,x+dx,x+w-dx],ys=[y,y+top,y+h-bottom],ws=[dx,w-2*dx,dx],hs=[top,h-top-bottom,bottom];
    return `<span class="modal-sliced ${cls}" aria-hidden="true">${ys.flatMap((yy,j)=>xs.map((xx,i)=>region(a,[noClose&&j===0&&i===2?x:xx,yy,ws[i],hs[j]],noClose&&j===0&&i===2?'mirror':''))).join('')}</span>`;
  }
  if(['button-primary','button-secondary','button-danger','button-selected','level-plaque','section-plaque'].includes(name)){
    const [x,y,w,h]=a.rect,dx=Math.round(Math.min(w*.22,h*.48)),dy=Math.round(h*.34);
    const xs=[x,x+dx,x+w-dx],ys=[y,y+dy,y+h-dy],ws=[dx,w-2*dx,dx],hs=[dy,h-2*dy,dy];
    return `<span class="gp-sliced ${cls}" aria-hidden="true">${ys.flatMap((yy,j)=>xs.map((xx,i)=>region(a,[xx,yy,ws[i],hs[j]]))).join('')}</span>`;
  }
  return region(a,a.rect,cls);
}

export function drawSprite(ctx,name,x,y,w,h){
  const a=GAME_ART[name],img=a&&images.get(a.file);
  if(!img?.complete||!img.naturalWidth)return false;
  ctx.drawImage(img,...a.rect,x,y,w,h);return true;
}

export function gameRobot(color,pose='queue',cls=''){
  if(pose!=='queue')return sprite(`robot-${robotColor[color]||color}-${pose}`,cls);
  return `<span class="live-robot ${cls}">${sprite(`robot-${robotColor[color]||color}-${pose}`)}<svg class="robot-eyes" viewBox="0 0 418 460" aria-hidden="true"><g class="open-eyes"><rect x="239" y="240" width="26" height="39" rx="7"/><rect x="315" y="234" width="26" height="39" rx="7"/></g><g class="happy-eyes"><path d="M240 263 Q252 240 264 263 M316 257 Q328 234 340 257"/></g></svg></span>`;
}

const iconMap={globe:'language',reload:'shuffle',help:'select',battery:'battery-full',check:'star'};
export function gameIcon(name){
  const key=iconMap[name]||name;
  return sprite(key==='battery-full'?key:'icon-'+key,'game-icon');
}
