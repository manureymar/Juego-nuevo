import { COLORS } from './level.js';
import { drawSprite, robotColor, artReady } from './game-art.js';

const SIZE=512, GRID=108, FIELD=296, TOP=72, BOTTOM=430, LEFT=79, RIGHT=433;
export class BoardRenderer {
  constructor(canvas,engine,onEvents){
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.engine=engine;this.onEvents=onEvents;
    this.cell=FIELD/engine.level.size;this.effects=[];this.raf=0;this.last=0;this.acc=0;this.visual=0;this.ready=false;
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
      this.effects=this.effects.filter(e=>(e.age+=dt)<.62);
    }
    const events=this.engine.drainEvents();
    for(const e of events)if(e.type==='shot')this.effects.push({...e,age:0});
    this.draw();if(events.length)this.onEvents(events);
    if(this.raf)this.raf=requestAnimationFrame(this.frame);
  }
  point(step){
    const n=this.engine.level.size,d=((step%(4*n))+4*n)%(4*n),lane=this.engine.lane(Math.floor(d));
    const v=GRID+(lane.index+.5)*this.cell;
    return lane.side===0?{x:v,y:BOTTOM,side:0}:lane.side===1?{x:RIGHT,y:v,side:1}:lane.side===2?{x:v,y:TOP,side:2}:{x:LEFT,y:v,side:3};
  }
  position(progress){
    const d=Math.max(0,progress),f=d-Math.floor(d),a=this.point(Math.floor(d)),b=this.point(Math.floor(d)+1);
    return{x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,side:a.side,angle:-Math.PI/2*(a.side+(b.side!==a.side?f:0))};
  }
  muzzle(point){
    const angle=point.angle??[0,-Math.PI/2,Math.PI,Math.PI/2][point.side];
    const ox=-15,oy=-28;
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
    drawSprite(c,'tile-'+robotColor[color],GRID+col*this.cell,GRID+row*this.cell,this.cell,this.cell);c.restore();
  }
  draw(){
    const c=this.ctx,g=this.engine;c.clearRect(0,0,SIZE,SIZE);
    if(!this.ready){c.fillStyle='#081a2b';c.fillRect(0,0,SIZE,SIZE);return;}
    drawSprite(c,'arena',0,0,SIZE,SIZE);
    c.strokeStyle='#174659';c.lineWidth=.65;
    for(let i=0;i<=g.level.size;i++){
      c.beginPath();c.moveTo(GRID+i*this.cell,GRID);c.lineTo(GRID+i*this.cell,GRID+g.level.size*this.cell);c.stroke();
      c.beginPath();c.moveTo(GRID,GRID+i*this.cell);c.lineTo(GRID+g.level.size*this.cell,GRID+i*this.cell);c.stroke();
    }
    this.arrows();
    for(let r=0;r<g.grid.length;r++)for(let col=0;col<g.grid[r].length;col++)if(g.grid[r][col])this.tile(r,col,g.grid[r][col]);
    for(const r of g.active){
      if(r.progress<-.35)continue;
      const p=this.position(r.progress);this.robot(p.x,p.y,p.angle,r.color,r.ammo,Math.min(1,(r.progress+.35)*3));
    }
    for(const e of this.effects){
      const p=this.point(e.step),from=this.muzzle(p),tx=GRID+(e.target.col+.5)*this.cell,ty=GRID+(e.target.row+.5)*this.cell;
      const hex=COLORS[e.color].hex,flight=.19;
      if(e.age<flight){
        this.tile(e.target.row,e.target.col,e.color);
        // The last shot keeps its robot visible until the muzzle pulse ends.
        if(!g.active.some(r=>r.id===e.id)&&e.age<.10)this.robot(p.x,p.y,-Math.PI/2*p.side,e.color,0,1-e.age/.12);
        const f=e.age/flight,px=from.x+(tx-from.x)*f,py=from.y+(ty-from.y)*f,tail=Math.max(0,f-.30);
        c.save();c.globalCompositeOperation='lighter';c.lineCap='round';c.shadowColor=hex;c.shadowBlur=16;
        c.strokeStyle=hex;c.lineWidth=7;c.beginPath();c.moveTo(from.x+(tx-from.x)*tail,from.y+(ty-from.y)*tail);c.lineTo(px,py);c.stroke();
        c.strokeStyle='#f4ffff';c.lineWidth=2.7;c.shadowBlur=6;c.stroke();
        c.fillStyle='#fff';c.beginPath();c.arc(px,py,3.8,0,Math.PI*2);c.fill();
        if(e.age<.09){drawSprite(c,'muzzle-'+robotColor[e.color],from.x-20,from.y-20,40,40);}
        c.restore();
      }else{
        const age=e.age-flight,q=age/(.62-flight);
        c.save();c.globalCompositeOperation='lighter';c.globalAlpha=1-q;
        c.shadowColor=hex;c.shadowBlur=13;c.strokeStyle=hex;c.lineWidth=2;
        c.beginPath();c.arc(tx,ty,4+q*this.cell*.85,0,Math.PI*2);c.stroke();
        drawSprite(c,'impact-'+robotColor[e.color],tx-26,ty-26,52,52);
        for(let k=0;k<8;k++){
          const a=k*Math.PI/4+(e.target.col+e.target.row)*.19,d=(8+q*34)*(k%2?.8:1);
          c.save();c.translate(tx+Math.cos(a)*d,ty+Math.sin(a)*d);c.rotate(a+q*2);c.fillStyle=k%2?hex:'#eeffff';const size=(4-k%2)*(1-q*.65);c.fillRect(-size/2,-size/2,size,size);c.restore();
        }
        c.restore();
      }
    }
  }

  robot(x,y,angle,color,ammo,opacity){
    const c=this.ctx;c.save();c.globalAlpha=opacity;c.translate(x,y);c.rotate(angle);
    c.shadowColor='#001020';c.shadowBlur=7;c.shadowOffsetY=3;
    drawSprite(c,'robot-'+robotColor[color]+'-overhead',-44,-35,88,70);c.restore();
    c.save();c.globalAlpha=opacity;c.translate(x,y);drawSprite(c,'ammo-badge',-17,25,34,22);c.font='800 15px Tektur, sans-serif';c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.fillText(String(ammo),0,36);c.restore();
  }
}
