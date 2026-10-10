import {chromium} from 'playwright';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import {mkdirSync,writeFileSync} from 'node:fs';
const out='mining-test-results';mkdirSync(out,{recursive:true});const errors=[],checks=[];const server=spawn(process.execPath,['previews/mining/serve.mjs'],{stdio:'inherit'});let browser;
try{
 await new Promise(r=>setTimeout(r,1000));browser=await chromium.launch();
 for(const [width,height] of [[1440,1050],[390,844],[360,640]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+': '+r.status());});
  await page.goto('http://127.0.0.1:4174/');await page.waitForSelector('body[data-ready=true]');await page.evaluate(()=>{minePreview.pause();minePreview.reset();minePreview.step(2.6);});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'no horizontal overflow');
  await page.screenshot({path:`${out}/mine-${width}.png`,fullPage:true});
  const before=await page.evaluate(()=>minePreview.snapshot());const frozen=await page.locator('#mine').evaluate(c=>c.toDataURL());await page.waitForTimeout(300);assert.equal((await page.evaluate(()=>minePreview.snapshot())).time,before.time);assert.equal(await page.locator('#mine').evaluate(c=>c.toDataURL()),frozen,'particles and scene freeze on pause');
  await page.locator('[data-speed="2"]').click();assert.equal((await page.evaluate(()=>minePreview.snapshot())).speed,2);
  await page.locator('#pause').click();await page.waitForTimeout(350);assert.ok((await page.evaluate(()=>minePreview.snapshot())).time>before.time);await page.locator('#pause').click();
  await page.locator('#reset').click();assert.equal((await page.evaluate(()=>minePreview.snapshot())).gold,0);
  assert.equal(await page.locator('#collect').count(),0,'no wagon dispatch control');
  await page.evaluate(()=>minePreview.step(32));const full=await page.evaluate(()=>minePreview.snapshot());
  assert.equal(full.cargo.length,6);assert.equal(full.cart,'parked');assert.ok(full.gold>6);assert.equal(full.goldValue,full.gold*5);
  assert.equal(await page.locator('#gold').textContent(),String(full.gold));assert.equal(await page.locator('#fill-percent').textContent(),'100%');
  await page.screenshot({path:`${out}/full-${width}.png`,fullPage:true});
  // Compare actual isolated wagon pixels after later production, including all pile layers.
  const renderChecks=await page.evaluate(async()=>{
   const {Renderer,ASSETS}=await import('./renderer.js');const {Mine}=await import('./engine.js');
   const images={};for(const [key,src] of Object.entries(ASSETS)){const image=new Image();image.src=src;await image.decode();images[key]=image;}
   const canvas=document.createElement('canvas');canvas.width=610;canvas.height=676;
   const renderer=new Renderer(canvas,images),m=new Mine();m.update(32);renderer.cart(m);const first=canvas.toDataURL();
   m.update(32);renderer.ctx.clearRect(0,0,610,676);renderer.cart(m);const later=canvas.toDataURL();
   const contact=document.createElement('canvas');contact.width=80;contact.height=100;const fx=new Renderer(contact,images);
   fx.ctx.translate(-370,-365);fx.drill({time:2});const a=contact.toDataURL();fx.ctx.clearRect(370,365,80,100);fx.drill({time:2.1});
   return {fixed:first===later,contactMoves:a!==contact.toDataURL()};
  });assert.ok(renderChecks.fixed,'full wagon pixels remain identical');assert.ok(renderChecks.contactMoves,'drill contact animates');
  await page.evaluate(()=>minePreview.step(32));const later=await page.evaluate(()=>minePreview.snapshot());
  assert.deepEqual(later.cargo,full.cargo);assert.equal(later.cart,'parked');assert.ok(later.gold>full.gold);assert.equal(later.goldValue,later.gold*5);
  assert.equal(await page.locator('#gold').textContent(),String(later.gold));assert.equal(await page.locator('#coins').textContent(),String(later.goldValue));
  await page.locator('[data-view=map]').click();assert.equal((await page.evaluate(()=>minePreview.snapshot())).view,'map');await page.screenshot({path:`${out}/map-${width}.png`,fullPage:true});
  await page.locator('#assets-open').click();assert.equal(await page.locator('.asset-tile').count(),14);assert.equal(await page.locator('#assets-close').isVisible(),true);await page.screenshot({path:`${out}/assets-${width}.png`});await page.locator('#assets-close').click();
  checks.push(`${width}x${height}: assets, no overflow, pause/resume, speed, reset, fixed full wagon (pixel comparison), continuing gold accumulation, contact particles, map and 14-piece gallery`);await context.close();
 }
 const videoContext=await browser.newContext({viewport:{width:1100,height:900},recordVideo:{dir:out,size:{width:1100,height:900}}});const p=await videoContext.newPage();await p.goto('http://127.0.0.1:4174/');await p.waitForSelector('body[data-ready=true]');await p.locator('[data-speed="2"]').click();await p.waitForTimeout(17000);await videoContext.close();
 // Verify the publicly reachable preview document and all local assets from the exact commit.
 if(process.env.GITHUB_SHA){const url=`https://raw.githack.com/manureymar/Juego-nuevo/${process.env.GITHUB_SHA}/previews/mining/index.html`;const response=await fetch(url);assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/text\/html/);const html=await response.text();assert.match(html,/De la roca/);for(const file of ['app.js','styles.css','assets/background.png','assets/parts.png','assets/drill.png']){const res=await fetch(new URL(file,url));assert.equal(res.status,200,file);await res.arrayBuffer();}checks.push('Public preview URL and all source assets respond successfully');writeFileSync(`${out}/url.txt`,url+'\n');}
 assert.deepEqual(errors,[]);writeFileSync(`${out}/results.json`,JSON.stringify({passed:true,errors,checks},null,2));console.log(checks);
}catch(e){writeFileSync(`${out}/results.json`,JSON.stringify({passed:false,errors,error:String(e),checks},null,2));throw e;}finally{await browser?.close();server.kill();}
