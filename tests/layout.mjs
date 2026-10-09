import assert from 'node:assert/strict';
export async function settleArt(page) {
  await page.waitForFunction(()=>!document.querySelector('#toast')?.classList.contains('visible')); 
  await page.evaluate(async()=>{
    await document.fonts.ready;
    await Promise.all([...document.querySelectorAll('#app img')].map(img=>img.decode().catch(()=>{})));
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  });
  const failed=await page.locator('#app img').evaluateAll(imgs=>imgs.filter(x=>!x.complete||!x.naturalWidth).map(x=>x.src));
  assert.deepEqual(failed,[],'All artwork must load');
}
export async function assertControlsVisible(page,selector='#app button') {
  const failures=await page.locator(selector).evaluateAll(buttons=>buttons.filter(b=>!b.disabled).flatMap(b=>{
    const r=b.getBoundingClientRect(),name=b.dataset.action+':'+(b.dataset.pack||'');
    const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
    const bad=r.width<20||r.height<20||r.left<-.5||r.top<-.5||r.right>innerWidth+.5||r.bottom>innerHeight+.5||!(hit===b||b.contains(hit));
    return bad?[{name,rect:{x:r.x,y:r.y,w:r.width,h:r.height},hit:hit?.outerHTML.slice(0,150)}]:[];
  }));
  assert.deepEqual(failures,[],'Controls must fit the viewport and receive touches');
  for(const label of await page.locator('.art-currency > b').all()){
    const contained=await label.evaluate(b=>{const r=b.getBoundingClientRect(),p=b.parentElement.getBoundingClientRect();return r.top>=p.top-.5&&r.bottom<=p.bottom+.5;});
    assert.equal(contained,true,'Coin balance must stay inside its frame');
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight),true,'Document must not scroll');
}
