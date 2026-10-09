import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import {_android as android} from 'playwright';
import {settleArt,assertControlsVisible} from './layout.mjs';

const pkg='com.manureymar.robotpulse.preview';
const adb=(...args)=>execFileSync('adb',args,{encoding:'utf8',timeout:60000});
const checks=[],errors=[];
mkdirSync('test-results/android',{recursive:true});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(fn,seconds=30){
  const end=Date.now()+seconds*1000;
  let last;
  while(Date.now()<end){try{const result=await fn();if(result)return result;}catch(e){last=e;}await delay(250);}
  throw new Error('Android condition timed out: '+(last||''));
}
function nativeWindow() {
  adb('shell','uiautomator','dump','/sdcard/robot-pulse-window.xml');
  return adb('shell','cat','/sdcard/robot-pulse-window.xml');
}
function bounds(node) {
  const m=node?.match(/bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
  return m?m.slice(1).map(Number):null;
}
async function dismissFullscreenTip() {
  // Android's first-run fullscreen education is outside the WebView.
  const xml=nativeWindow();
  const node=xml.match(/<node\b[^>]*text="Got it"[^>]*>/)?.[0];
  const b=bounds(node);
  if(b){adb('shell','input','tap',String(Math.round((b[0]+b[2])/2)),String(Math.round((b[1]+b[3])/2)));await delay(300);}
}
async function nativeTap(page,selector) {
  await dismissFullscreenTip();
  const node=nativeWindow().match(/<node\b[^>]*class="android.webkit.WebView"[^>]*>/)?.[0];
  const b=bounds(node);assert.ok(b,'Native WebView bounds are available');
  const point=await page.locator(selector).evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,width:innerWidth,height:innerHeight};});
  adb('shell','input','tap',String(Math.round(b[0]+point.x*(b[2]-b[0])/point.width)),String(Math.round(b[1]+point.y*(b[3]-b[1])/point.height)));
}
let device;
try{
  adb('shell','settings','put','system','font_scale','1.4');
  adb('install','-r','android/app/build/outputs/apk/debug/app-debug.apk');
  adb('shell','am','force-stop',pkg);
  adb('shell','am','start','-W','-n',pkg+'/com.manureymar.robotpulse.MainActivity');
  [device]=await android.devices();
  assert.ok(device,'Android device is connected');
  const webview=await device.webView({pkg});
  const page=await webview.page();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`HTTP ${r.status()}: ${r.url()}`);});
  page.setDefaultTimeout(20000);
  const capture=async name=>{
    await settleArt(page);
    await dismissFullscreenTip();
    await assertControlsVisible(page);
    writeFileSync(`test-results/android/${name}.png`,execFileSync('adb',['exec-out','screencap','-p'],{maxBuffer:20*1024*1024}));
  };
  await page.locator('[data-action=enter]').waitFor();
  assert.equal((await page.locator('#app').innerText()).trim(),'PLAY');
  await until(()=>page.locator('#menu-music').evaluate(a=>a.currentTime>0&&!a.paused));
  await capture('01-opening');
  console.log("Completed native stage",checks.length+1);
  checks.push('APK installed and opened; music autoplays before any touch; only title and Play over background');
  const time=await page.locator('#menu-music').evaluate(a=>a.currentTime);
  await nativeTap(page,'[data-action=enter]');
  await page.locator('.home-screen').waitFor();
  await capture('02-home');
  await nativeTap(page,'.bottom-nav [data-action=shop]');
  await page.locator('.shop-screen').waitFor();
  await capture('03-shop-en');
  assert.ok(await page.locator('#menu-music').evaluate(a=>a.currentTime)>=time,'Navigation must not restart music');
  assert.equal(await page.locator('[data-action=pack]').count(),6);
  for(let i=0;i<6;i++){
    await page.locator(`[data-pack="${i}"]`).click();
    assert.match(await page.locator('.modal-body').innerText(),/No money will be charged/);
    await page.locator('[data-action=close-modal]').click();
  }
  await page.locator('[data-action=rewards]').click();
  await page.locator('[data-action=daily]').click();
  assert.equal(await page.locator('[data-action=daily]').isDisabled(),true);
  await page.locator('[data-action=close-modal]').click();
  console.log("Completed native stage",checks.length+1);
  checks.push('Shop fits native WebView with enlarged Android font setting; all six packs, rewards and navigation respond');
  const wav=await page.evaluate(async()=>{
    const a=new AudioContext();const bytes=await (await fetch('assets/audio/button-tap.wav')).arrayBuffer();
    const data=await a.decodeAudioData(bytes);await a.close();return data.duration;
  });
  assert.ok(wav>.1&&wav<.15);
  await page.locator('#menu-music').evaluate(a=>{a.currentTime=a.duration-.3;});
  await until(()=>page.locator('#menu-music').evaluate(a=>a.currentTime<2&&!a.paused));
  adb('shell','input','keyevent','KEYCODE_HOME');
  await until(()=>page.locator('#menu-music').evaluate(a=>a.paused));
  adb('shell','am','start','-W','-n',pkg+'/com.manureymar.robotpulse.MainActivity');
  await until(()=>page.locator('#menu-music').evaluate(a=>!a.paused));
  console.log("Completed native stage",checks.length+1);
  checks.push('Button WAV decodes; menu song loops, pauses in background and resumes on return');
  await page.locator('[data-action=settings]').click();
  await page.locator('[data-language=es]').click();
  await page.locator('[data-action=toggle-music]').click();
  assert.equal(await page.locator('#menu-music').evaluate(a=>a.paused),true);
  await page.locator('[data-action=toggle-music]').click();
  await page.locator('[data-action=close-modal]').click();
  await capture('04-shop-es');
  await dismissFullscreenTip();
  adb('shell','input','keyevent','KEYCODE_BACK');
  await page.locator('[data-action=enter]').waitFor();
  assert.equal((await page.locator('#app').innerText()).trim(),'JUGAR');
  await capture('05-opening-es');
  console.log("Completed native stage",checks.length+1);
  checks.push('Spanish buttons and Shop; English brand remains artwork; music setting and Android Back work');
  assert.deepEqual(errors,[]);
  writeFileSync('test-results/android/results.json',JSON.stringify({passed:true,checks,errors,viewport:await page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio}))},null,2));
  console.log('Installed Android APK checks passed:',checks);
}catch(error){
  writeFileSync('test-results/android/results.json',JSON.stringify({passed:false,checks,errors,error:String(error)},null,2));
  try{writeFileSync('test-results/android/failure.png',execFileSync('adb',['exec-out','screencap','-p'],{maxBuffer:20*1024*1024}));}catch{}
  try{writeFileSync('test-results/android/logcat.txt',adb('logcat','-d','-t','5000'));}catch{}
  throw error;
}finally{await device?.close();}
