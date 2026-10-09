// Reproduce the reviewed motion previews using Canvas and FFmpeg.
// Usage: NODE_PATH=<runtime node_modules> node render-motion.cjs
const { createCanvas,loadImage }=require('@napi-rs/canvas');
const {spawnSync}=require('node:child_process');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
(async()=>{const root=__dirname,frames=path.join(root,'.motion-frames');fs.mkdirSync(frames,{recursive:true});
 const code=fs.readFileSync(path.join(root,'motion-preview.html'),'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
 for(const mode of ['eyes','queue']){const canvas=createCanvas(1,1);canvas.addEventListener=()=>{};
  const atlas=await loadImage(path.join(root,'robots-blank-faces.png'));Object.defineProperty(atlas,'src',{get:()=>'',set:()=>{}});atlas.decode=async()=>{};
  const button={},context={URLSearchParams,Image:function(){return atlas},performance:{now:()=>0},requestAnimationFrame:()=>{},window:{},location:{search:`?capture=1&mode=${mode}`},document:{body:{classList:{add:()=>{}}},querySelector:s=>s==='canvas'?canvas:button}};
  vm.createContext(context);vm.runInContext(code,context);await context.window.motionReady;
  const count=mode==='eyes'?120:144,fps=20;
  for(let i=0;i<count;i++){context.window[mode==='eyes'?'renderAt':'renderDemo'](i/fps);fs.writeFileSync(path.join(frames,`${mode}-${String(i).padStart(4,'0')}.png`),canvas.toBuffer('image/png'));}
  const input=path.join(frames,`${mode}-%04d.png`),output=path.join(root,`${mode}-motion.gif`);
  const encode=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-framerate',String(fps),'-i',input,'-vf','split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3','-loop','0',output],{encoding:'utf8'});if(encode.status!==0)throw Error(encode.stderr);
  console.log(output);}
})().catch(e=>{console.error(e);process.exit(1)});
