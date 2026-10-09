import assert from 'node:assert/strict';
export async function settleArt(page) {
  await page.waitForFunction(()=>!document.querySelector('#toast')?.classList.contains('visible')); 
  await page.evaluate(async()=>{
    await document.fonts.ready;
    await Promise.all([...document.querySelectorAll('#app img,#modal-root img')].map(img=>img.decode().catch(()=>{})));
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  });
  const failed=await page.locator('#app img,#modal-root img').evaluateAll(imgs=>imgs.filter(x=>!x.complete||!x.naturalWidth).map(x=>x.src));
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
  for(const label of await page.locator('.ui-coin-number,.ui-energy-number').all()){
    const contained=await label.evaluate(b=>{const r=b.getBoundingClientRect(),p=b.parentElement.getBoundingClientRect();return r.top>=p.top-.5&&r.bottom<=p.bottom+.5;});
    assert.equal(contained,true,'Currency and battery values must stay inside their frames');
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight),true,'Document must not scroll');
  if(await page.locator('.modal-header').count()){
    const failures=await page.evaluate(()=>{
      const header=document.querySelector('.modal-header').getBoundingClientRect(),title=document.querySelector('#dialog-title').getBoundingClientRect(),close=document.querySelector('.modal-close')?.getBoundingClientRect();
      const out=[];
      if(title.top<header.top||title.bottom>header.bottom||close&&title.right>close.left)out.push('Header title overlaps its edge or the close button');
      if(close&&(close.top<header.top||close.right>header.right||close.bottom>header.bottom))out.push('Close button leaves its fixed header socket');
      const body=document.querySelector('.modal-body').getBoundingClientRect(),actions=document.querySelector('.modal-actions').getBoundingClientRect();
      if(body.bottom>actions.top+1)out.push('Dialog content overlaps actions');
      const panel=document.querySelector('.modal').getBoundingClientRect();
      for(const node of document.querySelectorAll('.modal-body p,.settings-row')){const r=node.getBoundingClientRect();if(r.left<panel.left+panel.width*.16||r.right>panel.right-panel.width*.16)out.push('Body content overlaps the decorative side rails');}
      for(const label of document.querySelectorAll('.modal .button-label'))if(label.scrollWidth>label.clientWidth+1)out.push('Action text exceeds its button');
      return out;
    });
    assert.deepEqual(failures,[],'Dialog titles, close sockets and action labels must stay aligned');
  }
}
