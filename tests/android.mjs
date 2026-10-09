import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
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
let browser;
try{
  adb('shell','settings','put','system','font_scale','1.4');
  adb('install','-r','android/app/build/outputs/apk/debug/app-debug.apk');
  adb('shell','am','force-stop',pkg);
  adb('shell','am','start','-W','-n',pkg+'/com.manureymar.robotpulse.MainActivity');
  const pid=await until(()=>adb('shell','pidof',pkg).trim());
  await until(()=>adb('shell','cat','/proc/net/unix').includes('webview_devtools_remote_'+pid));
  adb('forward','tcp:9222','localabstract:webview_devtools_remote_'+pid);
  await until(async()=>{const r=await fetch('http://127.0.0.1:9222/json/version');return r.ok;});
  browser=await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page=await until(()=>browser.contexts()[0]?.pages().find(p=>p.url().includes('appassets.androidplatform.net')));
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`HTTP ${r.status()}: ${r.url()}`);});
  page.setDefaultTimeout(20000);
  const capture=async name=>{
    await settleArt(page);
    await assertControlsVisible(page);
    writeFileSync(`test-results/android/${name}.png`,execFileSync('adb',['exec-out','screencap','-p'],{maxBuffer:20*1024*1024}));
  };
  await page.locator('[data-action=enter]').waitFor();
  assert.equal((await page.locator('#app').innerText()).trim(),'PLAY');
  await until(()=>page.locator('#menu-music').evaluate(a=>a.currentTime>0&&!a.paused));
  await capture('01-opening');
  checks.push('APK installed and opened; music autoplays before any touch; only title and Play over background');
  const time=await page.locator('#menu-music').evaluate(a=>a.currentTime);
  await page.locator('[data-action=enter]').click();
  await capture('02-home');
  await page.locator('.bottom-nav [data-action=shop]').click();
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
  checks.push('Button WAV decodes; menu song loops, pauses in background and resumes on return');
  await page.locator('[data-action=settings]').click();
  await page.locator('[data-language=es]').click();
  await page.locator('[data-action=toggle-music]').click();
  assert.equal(await page.locator('#menu-music').evaluate(a=>a.paused),true);
  await page.locator('[data-action=toggle-music]').click();
  await page.locator('[data-action=close-modal]').click();
  await capture('04-shop-es');
  adb('shell','input','keyevent','KEYCODE_BACK');
  await page.locator('[data-action=enter]').waitFor();
  assert.equal((await page.locator('#app').innerText()).trim(),'JUGAR');
  await capture('05-opening-es');
  checks.push('Spanish buttons and Shop; English brand remains artwork; music setting and Android Back work');
  assert.deepEqual(errors,[]);
  writeFileSync('test-results/android/results.json',JSON.stringify({passed:true,checks,errors,viewport:await page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio}))},null,2));
  console.log('Installed Android APK checks passed:',checks);
}catch(error){
  writeFileSync('test-results/android/results.json',JSON.stringify({passed:false,checks,errors,error:String(error)},null,2));
  try{writeFileSync('test-results/android/failure.png',execFileSync('adb',['exec-out','screencap','-p'],{maxBuffer:20*1024*1024}));}catch{}
  try{writeFileSync('test-results/android/logcat.txt',adb('logcat','-d','-t','1000'));}catch{}
  throw error;
}finally{await browser?.close();}
