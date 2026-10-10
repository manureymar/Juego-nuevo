import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import {settleArt,assertControlsVisible} from './layout.mjs';
mkdirSync('test-results/mining',{recursive:true});
const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:['ignore','pipe','inherit']});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});
let browser,page;const errors=[],checks=[];
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:1,recordVideo:{dir:'test-results/mining/motion',size:{width:390,height:844}}});
 page=await context.newPage();page.setDefaultTimeout(15000);
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.goto('http://127.0.0.1:4173/?test=1');await page.locator('[data-action=enter]').click();
 assert.equal(await page.locator('[data-action=mining]').count(),0,'Portal appears only after its card is earned');
 assert.equal(await page.locator('.campaign-unlock.unlock-cube').count(),1);
 // Simulate the existing v0.5 save on a real user's phone: victory already earned, no mining fields yet.
 await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('robot-pulse-v1'));p.wins=1;delete p.mining;p.tutorialSeen=true;Object.assign(window.__rpTest.profile,p);localStorage.setItem('robot-pulse-v1',JSON.stringify(p));});
 await page.reload();await page.locator('[data-action=enter]').click();
 await page.locator('.mining-card-scrim').waitFor();await settleArt(page);await page.waitForTimeout(1200);
 await assertControlsVisible(page,'.mining-card-scrim button');
 assert.equal(await page.locator('.mining-card-button img').getAttribute('src'),'assets/mining/card-en.png');
 assert.equal(await page.locator('.reward-sheen').evaluate(e=>getComputedStyle(e).animationName),'reward-sheen');
 const sheen=await page.locator('.reward-sheen').evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(700);
 assert.notEqual(await page.locator('.reward-sheen').evaluate(e=>getComputedStyle(e).transform),sheen);
 await page.screenshot({path:'test-results/mining/01-earned-card.png'});
 await page.locator('[data-action=claim-mining]').tap();await page.locator('.mining-scene[data-loaded=true]').waitFor();
 await settleArt(page);await assertControlsVisible(page);
 assert.equal(await page.evaluate(()=>window.__rpTest.profile.mining.built),false);
 assert.equal(await page.locator('.build-option.locked').count(),4);
 assert.ok((await page.locator('.build-option.locked .building-art').first().evaluate(e=>getComputedStyle(e).filter)).includes('grayscale(1)'));
 assert.equal(await page.locator('.mining-guide').isVisible(),true);
 await page.screenshot({path:'test-results/mining/02-empty-base.png'});
 checks.push('Existing winners receive the animated English card; tap opens an empty cave with one enabled building and four grayscale locks');
 const cdp=await context.newCDPSession(page);
 const center=async selector=>page.locator(selector).evaluate(el=>{const r=el.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};});
 const world=async(x,y)=>page.locator('#mine-canvas').evaluate((el,p)=>{const r=el.getBoundingClientRect();return{x:r.x+p.x*r.width/887,y:r.y+(p.y-135)*r.height/1190};},{x,y});
 const touch=async(type,p)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:p?[{x:p.x,y:p.y,id:1,radiusX:5,radiusY:5,force:1}]:[]});
 const dragStart=async target=>{const from=await center('#mine-build');await touch('touchStart',from);for(let i=1;i<=6;i++)await touch('touchMove',{x:from.x+(target.x-from.x)*i/6,y:from.y+(target.y-from.y)*i/6});await page.waitForTimeout(180);};
 await dragStart(await world(700,950));assert.equal(await page.locator('.mining-scene').getAttribute('data-placement'),'invalid');
 await page.screenshot({path:'test-results/mining/03-invalid-red.png'});await touch('touchEnd');
 assert.equal(await page.evaluate(()=>window.__rpTest.profile.mining.built),false);await settleArt(page);
 await dragStart(await world(265,433));await touch('touchCancel');
 assert.equal(await page.evaluate(()=>window.__rpTest.profile.mining.built),false);
 assert.equal(await page.locator('.mining-scene').getAttribute('data-placement'),'idle');
 await page.locator('#mine-build').focus();await page.keyboard.press('Enter');
 assert.equal(await page.locator('#mine-target').evaluate(e=>e===document.activeElement),true);await page.keyboard.press('Escape');
 assert.equal(await page.locator('.mining-scene').getAttribute('data-placement'),'idle');
 await page.setViewportSize({width:360,height:640});await settleArt(page);await assertControlsVisible(page);await page.screenshot({path:'test-results/mining/empty-small-phone.png'});
 await page.setViewportSize({width:390,height:844});await settleArt(page);
 await dragStart(await world(265,433));assert.equal(await page.locator('.mining-scene').getAttribute('data-placement'),'valid');
 await page.screenshot({path:'test-results/mining/04-valid-green.png'});await touch('touchEnd');
 await page.waitForFunction(()=>window.__rpTest.profile.mining.built);await page.waitForTimeout(2500);
 assert.equal(await page.locator('#mine-build').isDisabled(),true);assert.equal(await page.locator('.mining-guide').isVisible(),false);
 await assertControlsVisible(page);await page.screenshot({path:'test-results/mining/05-built.png'});
 const frame=await page.locator('#mine-canvas').evaluate(c=>c.toDataURL());await page.waitForTimeout(600);
 assert.notEqual(await page.locator('#mine-canvas').evaluate(c=>c.toDataURL()),frame);
 await page.evaluate(async()=>{const {ORE_MS}=await import('/src/mining-state.js');window.__rpTest.profile.mining.producedAt-=ORE_MS;});
 await page.waitForFunction(()=>window.__rpTest.profile.mining.storedGold>0);
 const before=await page.evaluate(()=>window.__rpTest.profile.coins);await page.locator('[data-action=collect-mining]').tap();
 assert.ok(await page.evaluate(()=>window.__rpTest.profile.coins)>before);
 assert.equal(await page.evaluate(()=>window.__rpTest.mining.model.cart),'parked');
 checks.push('Real touch drag: red invalid zone rejects; pointer cancellation and Escape cancel; green cave snaps and installs once; animation produces collectible coins');
 await page.locator('[data-action=home]').click();
 await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('robot-pulse-v1'));p.mining.producedAt-=15*60000;Object.assign(window.__rpTest.profile,p);localStorage.setItem('robot-pulse-v1',JSON.stringify(p));});
 await page.reload();await page.locator('[data-action=enter]').click();assert.equal(await page.locator('.mining-card-scrim').count(),0);
 await page.locator('[data-action=mining]').click();await page.locator('.mining-scene[data-loaded=true]').waitFor();
 await page.waitForFunction(()=>window.__rpTest.mining.model.cargo.length===6);
 assert.ok(await page.evaluate(()=>window.__rpTest.profile.mining.storedGold)>=15);
 await page.locator('#mine-focus').tap();await page.waitForTimeout(1000);await page.screenshot({path:'test-results/mining/06-full-wagon-closeup.png'});
 assert.equal(await page.evaluate(()=>window.__rpTest.mining.model.cart),'parked');
 await page.locator('[data-action=settings]').click();const paused=await page.evaluate(()=>window.__rpTest.mining.model.time);await page.waitForTimeout(300);
 assert.equal(await page.evaluate(()=>window.__rpTest.mining.model.time),paused);await page.locator('[data-action=close-modal]').click();
 await page.waitForFunction(t=>window.__rpTest.mining.model.time>t,paused);await page.locator('#mine-focus').tap();
 for(const language of ['en','es']){
  await page.locator('[data-action=settings]').click();await page.locator(`[data-language=${language}]`).click();await page.locator('[data-action=close-modal]').click();
  await page.locator('.mining-scene[data-loaded=true]').waitFor();
  for(const size of [{width:360,height:640},{width:390,height:844},{width:412,height:915}]){
   await page.setViewportSize(size);await settleArt(page);await assertControlsVisible(page);
   await page.screenshot({path:`test-results/mining/built-${language}-${size.width}.png`});
  }
 }
 checks.push('Built mine and consumed card survive reload; elapsed offline time produces gold; full wagon remains parked; modal pauses motion; English and Spanish fit three phone sizes');
 // A pending Spanish card must also survive an app close before it was claimed.
 await page.locator('[data-action=home]').click();await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('robot-pulse-v1'));p.mining={rewardSeen:false};Object.assign(window.__rpTest.profile,p);localStorage.setItem('robot-pulse-v1',JSON.stringify(p));});
 await page.reload();await page.locator('[data-action=enter]').click();await page.locator('.mining-card-scrim').waitFor();await settleArt(page);await page.waitForTimeout(950);
 assert.equal(await page.locator('.mining-card-button img').getAttribute('src'),'assets/mining/card-es.png');
 await assertControlsVisible(page,'.mining-card-scrim button');await page.screenshot({path:'test-results/mining/card-es.png'});
 assert.deepEqual(errors,[]);const video=page.video();await context.close();await video.saveAs('test-results/mining/mining-flow.webm');
 writeFileSync('test-results/mining/results.json',JSON.stringify({passed:true,checks,errors},null,2));console.log('Mining flow passed:',checks);
}catch(e){await page?.screenshot({path:'test-results/mining/failure.png'}).catch(()=>{});writeFileSync('test-results/mining/results.json',JSON.stringify({passed:false,checks,errors,error:String(e)},null,2));throw e;}
finally{await browser?.close();server.kill();}
