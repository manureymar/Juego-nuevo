import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import {settleArt,assertControlsVisible} from './layout.mjs';
mkdirSync('test-results/dialogs',{recursive:true});
const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:['ignore','pipe','inherit']});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const errors=[],checked=[];let page;
try{
 for(const language of ['en','es'])for(const viewport of [{width:390,height:844},{width:360,height:640}]){
  page=await browser.newPage({viewport,deviceScaleFactor:1,hasTouch:true,isMobile:true});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/?test=1');
  await page.evaluate(async language=>{const {defaultProfile}=await import('/src/profile.js');const p=defaultProfile();p.language=language;p.tutorialSeen=true;p.energy=4;p.energyAt=Date.now()-1000;p.coins=10000;localStorage.setItem('robot-pulse-v1',JSON.stringify(p));},language);
  await page.reload();await page.locator('[data-action=enter]').click();
  const capture=async name=>{await settleArt(page);await assertControlsVisible(page,await page.locator('.modal').count()?'.modal button':'#app button');const id=`${name}-${language}-${viewport.width}`;await page.screenshot({path:`test-results/dialogs/${id}.png`});checked.push(id);};
  const close=()=>page.locator('[data-action=close-modal]').click();
  const modal=async(selector,name)=>{await page.locator(selector).click();await capture(name);await close();};
  await capture('home');assert.equal(await page.locator('.ui-avatar,.home-screen .scene-brand').count(),0);
  await page.locator('[data-action=settings]').click();
  assert.equal(await page.locator('.settings-row').count(),3);
  assert.equal(await page.locator('.settings-battery').count(),0);
  await capture('settings');await close();
  await modal('[data-action=energy]','energy');await modal('.campaign-node.node-2','locked-level');
  await page.locator('.bottom-nav [data-action=shop]').click();
  for(let i=0;i<6;i++)await modal(`[data-pack="${i}"]`,`purchase-${i}`);
  await modal('[data-action=rewards]','daily-reward');
  await page.locator('.bottom-nav [data-action=leaderboard]').click();await modal('.personal-row','pilot');await modal('[data-action=ranking-info].leader-info','ranking-info');
  await page.locator('.bottom-nav [data-action=home]').click();await page.locator('.play-button').click();
  await capture('level-01');assert.equal(await page.locator('.queue-unit').count(),6);assert.equal(await page.locator('[data-action=pause]').count(),1);
  assert.equal(await page.locator('#remaining,#progress-percent,.queue-heading,.bay-heading').count(),0);
  const ratio=await page.locator('#board').evaluate(c=>c.getBoundingClientRect().width/innerWidth);assert.ok(ratio>.84,'Arena occupies most of the phone width');
  for(const tool of ['bay','select','shuffle','future'])await modal(`[data-tool="${tool}"]`,`tool-${tool}`);
  await modal('[data-action=coins]','coins');await modal('[data-action=settings]','settings-in-game');await modal('[data-action=pause]','pause');
  // Keyed queue advance must preserve the next robot and finish its movement.
  const next=await page.locator('.launch-column').first().locator('.depth-1').getAttribute('data-robot-id');
  await page.locator('[data-action=launch-queue][data-column="0"]').click();
  assert.equal(await page.locator('.launch-column').first().locator('.depth-0').getAttribute('data-robot-id'),next);
  await page.waitForTimeout(500);await capture('energy-shot');
  await page.close();
 }
 // Short recording of the actual renderer, including orbit, muzzle and impacts.
 page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,recordVideo:{dir:'test-results/motion',size:{width:390,height:844}}});
 await page.goto('http://127.0.0.1:4173/?test=1');
 await page.evaluate(()=>{window.__rpTest.profile.tutorialSeen=true;});
 await page.locator('[data-action=enter]').click();await page.locator('.play-button').click();await settleArt(page);
 await page.locator('[data-action=launch-queue][data-column="0"]').click();await page.waitForTimeout(1500);
 await page.locator('[data-action=launch-queue][data-column="2"]').click();await page.waitForTimeout(1500);
 await page.locator('[data-action=launch-queue][data-column="1"]').click();await page.waitForTimeout(5000);
 const video=page.video();await page.close();await video.saveAs('test-results/level-01-motion.webm');
 assert.deepEqual(errors,[]);writeFileSync('test-results/dialogs/results.json',JSON.stringify({passed:true,checked,errors},null,2));console.log('Dialog/layout cases passed:',checked.length);
}catch(e){await page?.screenshot({path:'test-results/dialogs/failure.png'}).catch(()=>{});writeFileSync('test-results/dialogs/results.json',JSON.stringify({passed:false,checked,errors,error:String(e)},null,2));throw e;}
finally{await browser.close();server.kill();}
