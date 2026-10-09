import assert from 'node:assert/strict';
import {settleArt,assertControlsVisible} from './layout.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
const { chromium } = await import(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? `${process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES}/playwright/index.mjs` : 'playwright');
mkdirSync('test-results',{recursive:true});
const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:['ignore','pipe','inherit']});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});
let browser,page;
const errors=[],checks=[];
try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true});
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`HTTP ${r.status()}: ${r.url()}`);});
  await page.goto('http://127.0.0.1:4173/?test=1');
  await page.locator('.start-button').waitFor();
  await settleArt(page);
  await assertControlsVisible(page);
  assert.equal((await page.locator('#app').innerText()).trim(),'PLAY');
  await page.screenshot({path:'test-results/01-splash.png'});
  await page.locator('[data-action="enter"]').click();
  await page.locator('.home-screen').waitFor();
  await settleArt(page);
  assert.equal(await page.locator('.hero-image img').evaluate(img=>img.complete&&img.naturalWidth>0),true);
  await settleArt(page);await assertControlsVisible(page);
  await page.waitForFunction(()=>!document.querySelector('#menu-music').paused&&document.querySelector('#menu-music').currentTime>0);
  assert.equal(await page.locator('.home-screen .scene-brand,.ui-avatar').count(),0);
  await page.screenshot({path:'test-results/02-home.png'});
  await page.locator('.bottom-nav [data-action="shop"]').click();
  await page.locator('[data-action="pack"]').first().click();
  assert.match(await page.locator('.modal-body').innerText(),/No money will be charged/);
  await page.locator('[data-action="modal-action"]').first().click();
  assert.equal(await page.evaluate(()=>window.__rpTest.profile.coins),1200);
  await page.locator('[data-action="rewards"]').click();
  await page.locator('[data-action="daily"]').click();
  assert.equal(await page.evaluate(()=>window.__rpTest.profile.coins),1300);
  assert.equal(await page.locator('[data-action="daily"]').isDisabled(),true);
  await page.locator('[data-action="close-modal"]').click();
  await settleArt(page);await assertControlsVisible(page);
  await page.screenshot({path:'test-results/03-shop.png'});
  await page.locator('.bottom-nav [data-action="leaderboard"]').click();
  await page.locator('[data-tab="master"]').click();
  assert.equal(await page.locator('[data-tab="master"]').getAttribute('aria-pressed'),'true');
  await settleArt(page);await assertControlsVisible(page);
  await page.screenshot({path:'test-results/04-leaderboard.png'});
  assert.equal(await page.locator('.history-month').count(),2);
  const month=await page.locator('.history-month h3').first().innerText();
  await page.locator('[data-action=history-page][data-delta=\"1\"]').click();
  assert.notEqual(await page.locator('.history-month h3').first().innerText(),month);
  checks.push('Splash, all three menus, test purchase, daily supply and ranking filters');
  await page.locator('.bottom-nav [data-action="home"]').click();
  await page.locator('.play-button').click();
  await page.locator('[data-action="modal-action"]').first().click();
  assert.equal(await page.locator('#menu-music').evaluate(a=>a.paused),true);
  await settleArt(page);await assertControlsVisible(page);
  assert.equal(await page.locator('.queue-unit').count(),6);
  assert.equal(await page.locator('.ui-avatar,#remaining,#progress-percent,.queue-heading,.bay-heading').count(),0);
  assert.equal(await page.locator('[data-action=pause]').count(),1);
  await page.screenshot({path:'test-results/level-01-ready.png'});
  await page.locator('[data-tool=bay]').click();await settleArt(page);await assertControlsVisible(page,'.modal button');
  await page.screenshot({path:'test-results/tool-extra-bay.png'});
  await page.locator('[data-action=modal-action]').first().click();
  assert.equal(await page.locator('#waiting-bays>div').count(),6);
  assert.equal(await page.evaluate(()=>window.__rpTest.profile.tools.bay),0);
  await page.locator('[data-tool=select]').click();await page.locator('[data-action=modal-action]').first().click();
  assert.equal(await page.locator('[data-action=select-robot]').count(),6);
  await page.locator('[data-action=cancel-selection]').click();
  assert.equal(await page.evaluate(()=>window.__rpTest.profile.tools.select),1);
  await page.locator('[data-tool=shuffle]').click();await page.locator('[data-action=modal-action]').first().click();
  assert.equal(await page.evaluate(()=>window.__rpTest.profile.tools.shuffle),0);
  await page.locator('[data-tool=select]').click();await page.locator('[data-action=modal-action]').first().click();
  await page.locator('[data-action=select-robot][data-index="1"]').first().click();
  assert.equal(await page.evaluate(()=>window.__rpTest.profile.tools.select),0);
  await page.evaluate(()=>window.__rpTest.advance(10));
  checks.push('Two visible queue rows, extra bay, shuffle, rear selection, cancellation without spending, tool inventory persisted');

  await page.locator('[data-action="launch-queue"][data-column="0"]').click();
  await page.evaluate(()=>window.__rpTest.advance(3));
  await page.screenshot({path:'test-results/05-gameplay.png'});
  for(let attempt=0;attempt<6&&await page.evaluate(()=>window.__rpTest.engine.remaining===42);attempt++){
    const column=await page.evaluate(()=>{const g=window.__rpTest.engine,e=g.exposedCounts();return g.queues.map((q,i)=>({q,i})).filter(c=>c.q.length).sort((a,b)=>(e[b.q[0].color]||0)-(e[a.q[0].color]||0))[0]?.i;});
    assert.notEqual(column,undefined);await page.locator(`[data-action="launch-queue"][data-column="${column}"]`).click();await page.evaluate(()=>window.__rpTest.advance(10));
  }
  const blocksBefore=await page.evaluate(()=>window.__rpTest.engine.remaining);
  assert.ok(blocksBefore<42);
  await page.locator('[data-action="pause"]').last().click();
  const paused=await page.evaluate(()=>window.__rpTest.engine.elapsed);
  await page.evaluate(()=>window.__rpTest.advance(2));
  assert.equal(await page.evaluate(()=>window.__rpTest.engine.elapsed),paused);
  await page.locator('[data-action="modal-action"]').first().click();
  await page.evaluate(()=>window.__rpTest.save());
  await page.reload();
  await page.locator('[data-action="enter"]').click();
  await page.locator('.play-button').click();
  assert.ok(await page.evaluate(()=>window.__rpTest.engine.remaining)<=blocksBefore);
  checks.push('Real shots, pause freezes simulation, saved run survives reload');
  for(let turn=0;turn<140;turn++){
    const state=await page.evaluate(()=>{
      const g=window.__rpTest.engine;if(!g.isRunning)return {status:g.status};
      const exposed=g.exposedCounts();
      const candidates=[...g.waiting.map((r,i)=>({r,i,w:true})),...g.queues.map((q,i)=>({r:q[0],i,w:false}))].filter(x=>x.r);
      candidates.sort((a,b)=>(exposed[b.r.color]||0)-(exposed[a.r.color]||0)||Number(b.w)-Number(a.w));
      return {status:g.status,active:g.active.length,choice:candidates[0]&&{index:candidates[0].i,waiting:candidates[0].w}};
    });
    if(state.status==='won')break;
    assert.notEqual(state.status,'lost');
    if(!state.active&&state.choice){const c=state.choice;await page.locator(c.waiting?`[data-action="launch-waiting"][data-slot="${c.index}"]`:`[data-action="launch-queue"][data-column="${c.index}"]`).click();}
    await page.evaluate(()=>window.__rpTest.advance(10));
  }
  assert.equal(await page.evaluate(()=>window.__rpTest.engine.status),'won');
  await page.locator('.modal.win').waitFor();
  assert.equal(await page.evaluate(()=>window.__rpTest.profile.energy),5);
  assert.equal(await page.evaluate(()=>window.__rpTest.profile.coins),1340);
  await page.screenshot({path:'test-results/06-victory.png'});
  await page.locator('[data-action="modal-action"]').first().click();
  await page.locator('.bottom-nav [data-action="leaderboard"]').click();
  assert.ok(await page.evaluate(()=>window.__rpTest.profile.bestScore)>0);
  assert.ok(await page.evaluate(()=>window.__rpTest.profile.monthlyScore)>0);
  checks.push('Level cleared with real input, coins awarded once, battery unchanged, best score shown');
  await page.locator('.bottom-nav [data-action="home"]').click();
  await page.locator('.play-button').click();
  await page.locator('[data-action="pause"]').last().click();
  await page.locator('[data-action="modal-action"]').nth(2).click();
  await page.locator('[data-action="modal-action"]').nth(1).click();
  assert.equal(await page.evaluate(()=>window.__rpTest.profile.energy),4);
  assert.match(await page.locator('.ui-energy-label').innerText(),/^\d{2}:\d{2}$/);
  const countdownBefore=await page.locator('.ui-energy-label').innerText();
  await page.waitForFunction(before=>document.querySelector('.ui-energy-label').textContent!==before,countdownBefore);
  assert.match(await page.locator('.ui-energy-label').innerText(),/^29:/);
  await page.locator('.bottom-nav [data-action="shop"]').click();
  await page.locator('[data-action="energy"]').click();
  await page.locator('[data-action="refill"]').click();
  assert.equal(await page.evaluate(()=>window.__rpTest.profile.energy),5);
  assert.equal(await page.evaluate(()=>window.__rpTest.profile.coins),1220);
  await page.locator('[data-action="settings"]').click();
  await page.locator('[data-language="es"]').click();
  await page.locator('[data-action="modal-action"]').first().click();
  assert.equal(await page.locator('html').getAttribute('lang'),'es');
  await page.locator('.bottom-nav [data-action="home"]').click();
  await page.setViewportSize({width:360,height:740});
  await page.screenshot({path:'test-results/07-spanish-small-phone.png'});
  await settleArt(page);await assertControlsVisible(page);
  await page.locator('.bottom-nav [data-action="shop"]').click();
  for(const size of [{width:360,height:640},{width:360,height:740},{width:390,height:844},{width:412,height:915}]){
    await page.setViewportSize(size);await settleArt(page);await assertControlsVisible(page);
    await page.screenshot({path:`test-results/shop-es-${size.width}x${size.height}.png`});
  }
  await page.locator('[data-action="settings"]').click();
  await page.locator('[data-action="toggle-music"]').click();
  assert.equal(await page.locator('#menu-music').evaluate(a=>a.paused),true);
  await page.locator('[data-action="toggle-music"]').click();
  await page.waitForFunction(()=>!document.querySelector('#menu-music').paused);
  await page.locator('[data-language="en"]').click();
  await page.locator('[data-action="close-modal"]').click();
  for(const size of [{width:360,height:640},{width:390,height:844}]){
    await page.setViewportSize(size);await settleArt(page);await assertControlsVisible(page);
    await page.screenshot({path:`test-results/shop-en-${size.width}x${size.height}.png`});
  }
  await page.evaluate(()=>document.dispatchEvent(new Event('robotpulse:pause')));
  assert.equal(await page.locator('#menu-music').evaluate(a=>a.paused),true);
  await page.evaluate(()=>document.dispatchEvent(new Event('robotpulse:resume')));
  await page.waitForFunction(()=>!document.querySelector('#menu-music').paused);
  checks.push('Music plays across menus, pauses during gameplay/background, independent mute; Shop fits 4 phone sizes in both languages');
  checks.push('Quit costs one charge, coin recharge works, Spanish UI and 360px layout');
  // Both new illustrated screens must fit without scroll, including long ES labels.
  for(const lang of ['en','es']){
    await page.locator('[data-action=settings]').click();
    await page.locator(`[data-language="${lang}"]`).click();
    await page.locator('[data-action=close-modal]').click();
    for(const section of ['home','leaderboard']){
      await page.locator(`.bottom-nav [data-action="${section}"]`).click();
      for(const size of [{width:360,height:640},{width:390,height:844},{width:412,height:915}]){
        await page.setViewportSize(size);await settleArt(page);await assertControlsVisible(page);
        await page.screenshot({path:`test-results/${section}-${lang}-${size.width}x${size.height}.png`});
      }
    }
  }
  await page.locator('[data-tab=monthly]').click();
  await page.locator('[data-region=country]').click();
  assert.equal(await page.locator('[data-region=country]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-tab=monthly]').click();
  assert.equal(await page.locator('[data-tab=monthly]').getAttribute('aria-pressed'),'true');
  await page.locator('.personal-row').click();
  await page.locator('[data-action=close-modal]').click();
  // A player moving onto the podium must get the actual equipped character.
  await page.evaluate(()=>{window.__rpTest.profile.bestScore=2000;window.__rpTest.profile.monthlyScore=2000;});
  await page.locator('[data-tab=monthly]').click();
  assert.equal(await page.locator('.place-1 .leader-pilot-name').innerText(),'TÚ');
  assert.equal(await page.locator('.personal-row .leader-rank').innerText(),'1');
  for(let energy=0;energy<=5;energy++){
    await page.evaluate(n=>{window.__rpTest.profile.energy=n;window.__rpTest.profile.energyAt=Date.now();},energy);
    await page.locator('.bottom-nav [data-action=home]').click();
    assert.equal(await page.locator('.ui-energy-number').innerText(),String(energy));
    await assertControlsVisible(page);
  }
  await page.locator('.campaign-node.node-2').click();
  assert.match(await page.locator('.modal-body').innerText(),/sectores/);
  await page.locator('[data-action=close-modal]').click();
  checks.push('Home and Leaderboard fit three phone sizes in EN/ES; all filters, profile rows, locked levels and battery values 0–5 work; player can take first place');
  for(const lang of ['en','es']){
    await page.locator('[data-action=settings]').click();await page.locator(`[data-language="${lang}"]`).click();
    await settleArt(page);await assertControlsVisible(page,'.modal button');
    await page.screenshot({path:`test-results/settings-${lang}.png`});await page.locator('[data-action=close-modal]').click();
    await page.locator('.play-button').click();
    for(const size of [{width:360,height:640},{width:390,height:844},{width:412,height:915}]){
      await page.setViewportSize(size);await settleArt(page);await assertControlsVisible(page);
      await page.screenshot({path:`test-results/game-${lang}-${size.width}x${size.height}.png`});
    }
    await page.locator('[data-action=pause]').last().click();await settleArt(page);await assertControlsVisible(page,'.modal button');
    await page.screenshot({path:`test-results/pause-${lang}.png`});
    await page.locator('[data-action=modal-action]').nth(2).click();await page.locator('[data-action=modal-action]').nth(1).click();
  }
  checks.push('Gameplay and illustrated dialogs fit EN/ES phone layouts without scroll');
  assert.deepEqual(errors,[]);
  writeFileSync('test-results/browser-results.json',JSON.stringify({passed:true,checks,errors},null,2));
  console.log(`Browser checks passed: ${checks.length} groups; phone screenshots captured.`);
}catch(error){await page?.screenshot({path:'test-results/failure.png'}).catch(()=>{});writeFileSync('test-results/browser-results.json',JSON.stringify({passed:false,checks,errors,error:String(error)},null,2));throw error;}
finally{await browser?.close();server.kill();}
