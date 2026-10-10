import assert from 'node:assert/strict';
import {execFileSync,spawn} from 'node:child_process';
import {mkdirSync,writeFileSync,openSync,closeSync} from 'node:fs';
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
  const path='/sdcard/robot-pulse-window.xml';
  adb('shell','rm','-f',path);
  try{adb('shell','uiautomator','dump',path);}catch(error){
    // Android 15 UiAutomation can throw Bad file descriptor while tearing down
    // its Binder after successfully writing the hierarchy (run 38029967166).
    // Only that completed-dump exit is usable; all other failures still abort.
    if(error.status!==137||!String(error.stdout).includes(`UI hierchary dumped to: ${path}`))throw error;
    console.log('UiAutomation exited during teardown; validating its fresh completed hierarchy');
  }
  const xml=adb('shell','cat','/sdcard/robot-pulse-window.xml');
  assert.ok(xml.startsWith('<?xml')&&xml.trim().endsWith('</hierarchy>'),'Native UI dump must be complete');
  writeFileSync('test-results/android/native-window.xml',xml);
  return xml;
}
function bounds(node) {
  const m=node?.match(/bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
  return m?m.slice(1).map(Number):null;
}
async function dismissFullscreenTip() {
  // Handle Android's education dialog and an observed cold-boot Pixel Launcher ANR.
  // A Robot Pulse ANR is never dismissed or treated as a passing test.
  for(let attempt=0;attempt<3;attempt++){
    const xml=nativeWindow();
    if(/Robot Pulse[^<]*responding/.test(xml))throw new Error('Robot Pulse is not responding');
    const launcher=xml.includes('Pixel Launcher')&&xml.includes('responding');
    const text=launcher?'Close app':'Got it';
    const node=[...xml.matchAll(/<node\b[^>]*>/g)].map(m=>m[0]).find(n=>n.includes(`text="${text}"`));
    const b=bounds(node);if(!b)return;
    console.log(launcher?'Closing emulator launcher ANR':'Dismissing Android fullscreen education');
    adb('shell','input','tap',String(Math.round((b[0]+b[2])/2)),String(Math.round((b[1]+b[3])/2)));
    await delay(500);
  }
}

let webViewBounds;
async function nativeBounds(){
  // This run stays in portrait/fullscreen. Repeated UIAutomator scans of the
  // continuously animated canvas can block waiting for accessibility to idle.
  if(webViewBounds)return webViewBounds;
  await dismissFullscreenTip();
  const node=nativeWindow().match(/<node\b[^>]*class="android.webkit.WebView"[^>]*>/)?.[0];
  const b=bounds(node);assert.ok(b,'Native WebView bounds are available');
  webViewBounds=b;return b;
}
async function nativeTap(page,selector) {
  const b=await nativeBounds();
  const point=await page.locator(selector).evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,width:innerWidth,height:innerHeight};});
  adb('shell','input','tap',String(Math.round(b[0]+point.x*(b[2]-b[0])/point.width)),String(Math.round(b[1]+point.y*(b[3]-b[1])/point.height)));
}
async function nativeDrag(page,fromSelector,toSelector){
 const b=await nativeBounds();
 const point=async selector=>page.locator(selector).evaluate(el=>{const r=el.getBoundingClientRect();return {x:(r.x+r.width/2)/innerWidth,y:(r.y+r.height/2)/innerHeight};});
 const from=await point(fromSelector),to=await point(toSelector),x=p=>String(Math.round(b[0]+p.x*(b[2]-b[0]))),y=p=>String(Math.round(b[1]+p.y*(b[3]-b[1])));
 adb('shell','input','swipe',x(from),y(from),x(to),y(to),'1200');
}
let device,logcat;
try{
  const logFd=openSync('test-results/android/live-logcat.txt','w');
  logcat=spawn('adb',['logcat','-v','threadtime','*:W'],{stdio:['ignore',logFd,logFd]});
  closeSync(logFd);
  // The entire installed-app test runs offline, including audio and artwork.
  adb('shell','svc','wifi','disable');
  adb('shell','svc','data','disable');
  await delay(15000);
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
    await nativeBounds();
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
  assert.equal(await page.locator('.ui-energy-number').innerText(),'5');
  await nativeTap(page,'.bottom-nav [data-action=leaderboard]');
  await page.locator('.leader-tabs').waitFor();
  await capture('06-leaderboard-en');
  await page.locator('[data-tab=master]').click();
  await capture('09-master-history');
  assert.equal(await page.locator('.history-month').count(),2);
  await page.locator('[data-tab=monthly]').click();
  await page.locator('[data-region=country]').click();
  assert.equal(await page.locator('[data-tab=monthly]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('[data-region=country]').getAttribute('aria-pressed'),'true');
  await page.locator('.personal-row').click();
  assert.match(await page.locator('.modal-body').innerText(),/sample opponents/);
  await page.locator('[data-action=close-modal]').click();
  await nativeTap(page,'.bottom-nav [data-action=shop]');
  await page.locator('[data-action=pack]').first().waitFor();
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
  assert.ok(Math.abs(wav-.291655)<.001,'The supplied button WAV is packaged unchanged');
  assert.equal(await page.locator('#menu-music').evaluate(a=>a.volume),.34*.75);
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
  await nativeTap(page,'.bottom-nav [data-action=home]');
  await capture('07-home-es');
  await page.locator('.campaign-node.node-2').click();
  await page.locator('[data-action=close-modal]').click();
  await nativeTap(page,'.bottom-nav [data-action=leaderboard]');
  await capture('08-leaderboard-es');
  await nativeTap(page,'.bottom-nav [data-action=home]');
  await nativeTap(page,'.play-button');
  await page.locator('[data-action=modal-action]').first().click();
  await capture('10-first-level');
  assert.equal(await page.locator('.queue-unit').count(),6);
  await nativeTap(page,'[data-tool=bay]');
  await settleArt(page);await assertControlsVisible(page,'.modal button');
  writeFileSync('test-results/android/11-tool.png',execFileSync('adb',['exec-out','screencap','-p'],{maxBuffer:20*1024*1024}));
  await page.locator('[data-action=modal-action]').first().click();
  assert.equal(await page.locator('#waiting-bays>div').count(),6);
  await nativeTap(page,'[data-action=launch-queue][data-column="0"]');
  await delay(1000);await capture('12-real-shot');
  await page.locator('[data-action=pause]').last().click();
  const pausedBoard=await page.locator('#board').evaluate(c=>c.toDataURL());await delay(500);
  assert.equal(await page.locator('#board').evaluate(c=>c.toDataURL()),pausedBoard);
  await settleArt(page);await assertControlsVisible(page,'.modal button');
  writeFileSync('test-results/android/13-pause.png',execFileSync('adb',['exec-out','screencap','-p'],{maxBuffer:20*1024*1024}));
  await page.locator('[data-action=modal-action]').nth(2).click();await page.locator('[data-action=modal-action]').nth(1).click();
  checks.push('Installed APK: six visible queue robots, extra waiting bay, native launch, rendered shots and pause work offline');
  checks.push('Illustrated Home and Leaderboard fit native display; battery number, native navigation, ranking filters, profile rows and locked levels respond in EN/ES');
  await nativeBounds();
  adb('shell','input','keyevent','KEYCODE_BACK');
  await page.locator('[data-action=enter]').waitFor();
  assert.equal((await page.locator('#app').innerText()).trim(),'JUGAR');
  await capture('05-opening-es');
  console.log("Completed native stage",checks.length+1);
  checks.push('Spanish buttons and Shop; English brand remains artwork; music setting and Android Back work');
  // Upgrade an existing v0.5 winning save; first-level victory itself is exercised in Chromium.
  await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('robot-pulse-v1'));p.wins=1;delete p.mining;p.session=null;localStorage.setItem('robot-pulse-v1',JSON.stringify(p));});
  await page.reload();await nativeTap(page,'[data-action=enter]');
  console.log('Native mining: waiting for the first card');
  await page.locator('.mining-card-scrim').waitFor();
  console.log('Native mining: composition',JSON.stringify(await page.evaluate(()=>({reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,visible:document.visibilityState,images:[...document.querySelectorAll('#app img,#modal-root img')].map(i=>({src:i.getAttribute('src'),complete:i.complete,w:i.naturalWidth,h:i.naturalHeight}))}))));
  await settleArt(page);await delay(1000);
  await assertControlsVisible(page,'.mining-card-scrim button');
  writeFileSync('test-results/android/14-mining-card.png',execFileSync('adb',['exec-out','screencap','-p'],{maxBuffer:20*1024*1024}));
  console.log('Native mining: card rendered; opening the base');
  await nativeTap(page,'[data-action=claim-mining]');await page.locator('.mining-scene[data-loaded=true]').waitFor();
  await capture('15-empty-mine');assert.equal(await page.locator('.build-option.locked').count(),4);
  await nativeDrag(page,'#mine-build','#mine-target');
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('robot-pulse-v1')).mining.built);await delay(2500);
  assert.equal(await page.locator('#mine-build').isDisabled(),true);await capture('16-built-mine');
  console.log('Native mining: construction passed; waiting for one minute of production');
  // Let the installed APK produce its first real minute of gold; no test hook.
  await page.locator('[data-action=collect-mining]:not([disabled])').waitFor({timeout:75000});
  const coinsBefore=await page.evaluate(()=>JSON.parse(localStorage.getItem('robot-pulse-v1')).coins);
  await nativeTap(page,'[data-action=collect-mining]');
  await page.waitForFunction(n=>JSON.parse(localStorage.getItem('robot-pulse-v1')).coins>n,coinsBefore);
  console.log('Native mining: real gold production and collection passed');
  await nativeTap(page,'#mine-focus');await capture('17-mining-closeup');
  // Reload the installed WebView, retaining only its persistent save, then verify the constructed scene.
  await page.reload();await nativeTap(page,'[data-action=enter]');
  assert.equal(await page.locator('.mining-card-scrim').count(),0);await nativeTap(page,'[data-action=mining]');
  await page.locator('.mining-scene[data-loaded=true].mine-built').waitFor();await capture('18-mine-restored');
  adb('shell','input','keyevent','KEYCODE_BACK');await page.locator('.home-screen').waitFor();
  checks.push('Installed APK offline: upgrade card, Spanish mine assets, native finger drag into cave, construction, production, collection, closeup, saved mine after reload and Android Back');
  assert.doesNotMatch(adb('logcat','-d','-s','ActivityManager:E'),/ANR in com\.manureymar\.robotpulse/,'Robot Pulse must never become unresponsive');
  assert.deepEqual(errors,[]);
  writeFileSync('test-results/android/results.json',JSON.stringify({passed:true,checks,errors,viewport:await page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio}))},null,2));
  console.log('Installed Android APK checks passed:',checks);
}catch(error){
  writeFileSync('test-results/android/results.json',JSON.stringify({passed:false,checks,errors,error:String(error)},null,2));
  try{writeFileSync('test-results/android/failure.png',execFileSync('adb',['exec-out','screencap','-p'],{maxBuffer:20*1024*1024}));}catch{}
  try{writeFileSync('test-results/android/logcat.txt',adb('logcat','-d','-t','5000'));}catch{}
  throw error;
}finally{logcat?.kill();await device?.close();}
