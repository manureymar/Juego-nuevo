import { COLORS } from './level.js';
import { drawSprite, robotColor, artReady } from './game-art.js';

const SIZE=512, GRID=112, CELL=24, TOP=72, BOTTOM=430, LEFT=79, RIGHT=433;
export class BoardRenderer {
  constructor(canvas,engine,onEvents){
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.engine=engine;this.onEvents=onEvents;
    this.effects=[];this.raf=0;this.last=0;this.acc=0;this.visual=0;this.ready=false;
    this.reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const dpr=Math.min(globalThis.devicePixelRatio||1,3);
    canvas.width=SIZE*dpr;canvas.height=SIZE*dpr;this.ctx.scale(dpr,dpr);
    this.frame=this.frame.bind(this);
    artReady.then(()=>{this.ready=true;this.last=performance.now();this.draw();});
  }
  start(){this.last=performance.now();this.raf=requestAnimationFrame(this.frame);}
  stop(){cancelAnimationFrame(this.raf);this.raf=0;}
  frame(now){
    const dt=Math.min((now-this.last)/1000,.05);this.last=now;
    if(this.ready&&this.engine.status!=='paused'){
      this.visual+=dt;this.acc+=dt;
      while(this.acc>=1/60){this.engine.tick(1/60);this.acc-=1/60;}
      this.effects=this.effects.filter(e=>(e.age+=dt)<.36);
    }
    const events=this.engine.drainEvents();
    for(const e of events)if(e.type==='shot')this.effects.push({...e,age:0});
    this.draw();if(events.length)this.onEvents(events);
    if(this.raf)this.raf=requestAnimationFrame(this.frame);
  }
  point(step){
    const n=this.engine.level.size,d=((step%(4*n))+4*n)%(4*n),lane=this.engine.lane(Math.floor(d));
    const v=GRID+(lane.index+.5)*CELL;
    return lane.side===0?{x:v,y:BOTTOM,side:0}:lane.side===1?{x:RIGHT,y:v,side:1}:lane.side===2?{x:v,y:TOP,side:2}:{x:LEFT,y:v,side:3};
  }
  position(progress){
    const d=Math.max(0,progress),f=d-Math.floor(d),a=this.point(Math.floor(d)),b=this.point(Math.floor(d)+1);
    return{x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,side:a.side};
  }
  muzzle(point){
    const angle=[0,-Math.PI/2,Math.PI,Math.PI/2][point.side];
    const ox=-8,oy=-19;
    return{x:point.x+ox*Math.cos(angle)-oy*Math.sin(angle),y:point.y+ox*Math.sin(angle)+oy*Math.cos(angle)};
  }
  arrows(){
    const c=this.ctx,n=this.engine.level.size*4,phase=this.reduced?0:this.visual*1.5;
    for(let k=0;k<16;k++){
      const s=(k*n/16+phase)%n,a=this.position(s),b=this.position((s+.04)%n);
      c.save();c.translate(a.x,a.y);c.rotate(Math.atan2(b.y-a.y,b.x-a.x));
      c.beginPath();c.moveTo(-4,-5);c.lineTo(2,0);c.lineTo(-4,5);
      c.strokeStyle='#53e8ff';c.shadowColor='#00bfff';c.shadowBlur=7;c.lineWidth=2.5;c.stroke();c.restore();
    }
  }
  tile(row,col,color,alpha=1){
    const c=this.ctx;c.save();c.globalAlpha=alpha;
    drawSprite(c,'tile-'+robotColor[color],GRID+col*CELL,GRID+row*CELL,CELL,CELL);c.restore();
  }
  draw(){
    const c=this.ctx,g=this.engine;c.clearRect(0,0,SIZE,SIZE);
    if(!this.ready){c.fillStyle='#081a2b';c.fillRect(0,0,SIZE,SIZE);return;}
    drawSprite(c,'arena',0,0,SIZE,SIZE);
    c.strokeStyle='#174659';c.lineWidth=.65;
    for(let i=0;i<=g.level.size;i++){
      c.beginPath();c.moveTo(GRID+i*CELL,GRID);c.lineTo(GRID+i*CELL,GRID+g.level.size*CELL);c.stroke();
      c.beginPath();c.moveTo(GRID,GRID+i*CELL);c.lineTo(GRID+g.level.size*CELL,GRID+i*CELL);c.stroke();
    }
    this.arrows();
    for(let r=0;r<g.grid.length;r++)for(let col=0;col<g.grid[r].length;col++)if(g.grid[r][col])this.tile(r,col,g.grid[r][col]);
    for(const e of this.effects){
      const color=robotColor[e.color],from=this.muzzle(this.point(e.step)),tx=GRID+(e.target.col+.5)*CELL,ty=GRID+(e.target.row+.5)*CELL;
      const flight=.13;
      if(e.age<flight){
        this.tile(e.target.row,e.target.col,e.color);
        const f=e.age/flight,px=from.x+(tx-from.x)*f,py=from.y+(ty-from.y)*f;
        c.save();c.strokeStyle=COLORS[e.color].hex;c.shadowColor=c.strokeStyle;c.shadowBlur=10;c.lineWidth=2.5;
        c.beginPath();c.moveTo(px-(tx-from.x)*.08,py-(ty-from.y)*.08);c.lineTo(px,py);c.stroke();
        c.translate(px,py);c.rotate(Math.atan2(ty-from.y,tx-from.x)+Math.PI/2);drawSprite(c,'projectile-'+color,-7,-14,14,28);c.restore();
        drawSprite(c,'muzzle-'+color,from.x-10,from.y-10,20,20);
      }else{
        c.save();c.globalAlpha=1-(e.age-flight)/(.36-flight);
        drawSprite(c,'impact-'+color,tx-19,ty-19,38,38);c.restore();
      }
    }
    for(const r of g.active){const p=this.position(r.progress);this.robot(p.x,p.y,p.side,r.color,r.ammo,r.progress<0?.5:1);}
  }
  robot(x,y,side,color,ammo,opacity){
    const c=this.ctx;c.save();c.globalAlpha=opacity;c.translate(x,y);c.rotate([0,-Math.PI/2,Math.PI,Math.PI/2][side]);
    drawSprite(c,'robot-'+robotColor[color]+'-overhead',-30,-26,60,48);c.restore();
    c.save();c.translate(x,y);drawSprite(c,'ammo-badge',-13,19,26,17);c.font='800 12px Tektur, sans-serif';c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.fillText(String(ammo),0,27);c.restore();
  }
}
