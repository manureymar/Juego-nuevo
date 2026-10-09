import { GameEngine } from './engine.js';
import { COLORS } from './level.js';
import { SaveStore, SKINS, PACKS, MAX_ENERGY, RECHARGE_MS, refreshEnergy, winRun, loseRun, refillEnergy, buySkin, claimDaily, localDate } from './profile.js';
import { icon, robotIcon, coinStack } from './icons.js';
import { translator } from './i18n.js';
import { BoardRenderer } from './renderer.js';
import { art } from './art.js';
import { GameAudio } from './audio.js';

const root = document.querySelector('#app');
const modalRoot = document.querySelector('#modal-root');
let storage;
try { storage = localStorage; } catch { storage = { getItem(){throw new Error('Unavailable');}, setItem(){throw new Error('Unavailable');} }; }
const store = new SaveStore(storage);
const profile = store.load();
const gameAudio = new GameAudio(profile);
let t = translator(profile.language);
let screen = 'splash', engine = null, renderer = null, runId = '', modal = null;
let rankingTab = 'monthly', rankingRegion = 'global', lastSaved = 0, toastTimer = 0, audio = null, lastShot = 0;
const escapeHTML = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = number => new Intl.NumberFormat(profile.language === 'es' ? 'es-ES' : 'en-US').format(number);
const skinColor = () => SKINS.find(s => s.id === profile.skin)?.color || '#2edbff';
const button = (action,label,cls='secondary',extra='') => `<button class="${cls}" data-action="${action}" ${extra}>${label}</button>`;
const brand = (compact=false) => `<div class="brand ${compact?'compact':''}" aria-label="Robot Pulse"><span>ROBOT</span><i aria-hidden="true"></i><strong>PULSE</strong></div>`;

function save() {
  if (!store.save(profile) && !document.body.dataset.storageWarning) { document.body.dataset.storageWarning='1'; toast(t('saveUnavailable')); }
}

function persistSession(force=false) {
  if (!engine || !['ready','playing','paused'].includes(engine.status)) return;
  if (!force && Date.now()-lastSaved<1000) return;
  profile.session={id:runId,engine:engine.snapshot()};lastSaved=Date.now();save();
}

function toast(message) {
  const el=document.querySelector('#toast');el.textContent=message;el.classList.add('visible');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3200);
}

function sound(kind='tap') {
  if(kind==='tap'){gameAudio.tap();return;}
  if(!profile.sound)return;
  try{
    if(!audio)audio=new (window.AudioContext||window.webkitAudioContext)();
    if(audio.state==='suspended')audio.resume();
    if(kind==='shot'&&audio.currentTime-lastShot<.06)return;
    if(kind==='shot')lastShot=audio.currentTime;
    const o=audio.createOscillator(), g=audio.createGain();
    const frequency={tap:500,launch:350,shot:850,win:880,loss:160,claim:660}[kind]||500;
    o.type=kind==='shot'?'triangle':'sine';o.frequency.setValueAtTime(frequency,audio.currentTime);
    o.frequency.exponentialRampToValueAtTime(frequency*(kind==='loss'?.45:1.5),audio.currentTime+.12);
    g.gain.setValueAtTime(.0001,audio.currentTime);g.gain.exponentialRampToValueAtTime(kind==='shot'?.025:.075,audio.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+.2);
    o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.21);
  }catch{/* Sound is optional; all gameplay remains available. */}
}

function hud() {
  refreshEnergy(profile);
  return `<header class="hud art-hud">
    ${button('profile',art('avatar'),'art-avatar',`aria-label="${t('profile')}"`)}
    ${button('energy',`${art('hud-meter')}<span class="art-battery">${art('battery')}<b>${profile.energy}</b></span><span class="art-energy-label">${profile.energy===MAX_ENERGY?t('max'):t('energy')}</span>`,'art-energy',`aria-label="${t('energy')} ${profile.energy} / 5"`)}
    ${button('coins',`${art('hud-meter')}<span class="art-coin">${art('coin')}</span><b>${fmt(profile.coins)}</b><span class="art-add">${art('add')}</span>`,'art-currency',`aria-label="${t('coins')}: ${profile.coins}"`)}
    ${button('settings',art('settings'),'art-settings',`aria-label="${t('settings')}"`)}
  </header>`;
}

function nav() {
  return `<nav class="bottom-nav art-nav" aria-label="${t('home')}">${['shop','home','leaderboard'].map(page=>button(page,`${art(screen===page?'nav-active':'nav-idle')}<span class="nav-art-icon">${art(page==='home'?'home-icon':page==='shop'?'shop-icon':'trophy')}</span><span class="nav-label">${t(page)}</span>`,`nav-item ${screen===page?'active':''}`,screen===page?'aria-current="page"':'')).join('')}</nav>`;
}

function fitScenes() {
  root.querySelectorAll('[data-scene-width]').forEach(el=>{
    const w=Number(el.dataset.sceneWidth), h=Number(el.dataset.sceneHeight);
    const scale=Math.min(root.clientWidth/w,root.clientHeight/h);
    el.style.transform=`translate(-50%,-50%) scale(${scale})`;
  });
}
new ResizeObserver(fitScenes).observe(root);
window.addEventListener('resize',fitScenes);
window.visualViewport?.addEventListener('resize',fitScenes);

function pageHeading(title,sub='') { return `<div class="page-heading"><p class="eyebrow">ROBOT PULSE</p><h1>${title}</h1>${sub?`<p>${sub}</p>`:''}</div>`; }

function render() {
  renderer?.stop();renderer=null;
  t=translator(profile.language);document.documentElement.lang=profile.language;
  root.dataset.screen=screen;
  gameAudio.setScreen(screen);
  if(screen==='splash'){
    root.innerHTML=`<section class="splash"><div class="splash-art" aria-hidden="true"></div><div class="splash-scene" data-scene-width="941" data-scene-height="1672"><div class="splash-logo" role="img" aria-label="Robot Pulse">${art('logo')}</div>${button('enter',`${art('play-blank')}<span>${t('play')}</span>`,'start-button art-play',`aria-label="${t('play')}"`)}</div></section>`;
    fitScenes();return;
  }
  if(screen==='shop'){
    root.innerHTML=`<section class="shop-backdrop"><div class="shop-scene" data-scene-width="768" data-scene-height="1536">${hud()}${shopView()}${nav()}</div></section>`;
    fitScenes();return;
  }
  root.innerHTML=hud()+(screen==='home'?homeView():screen==='leaderboard'?leaderboardView():gameView())+(screen==='game'?'':nav());
  if(screen==='game'){
    renderer=new BoardRenderer(document.querySelector('#board'),engine,processEvents);
    renderGameControls();updateGameStats();renderer.start();
  }
}

function homeView() {
  return `<section class="screen home-screen">${pageHeading(t('campaign'),t('sector'))}
    <div class="campaign-map">
      <div class="unlock-card unlock-left">${icon('cube')}<span>${t('nextUnlock')}</span><b>${icon('lock')} ${t('level')} 2</b></div>
      <div class="route"><div class="route-line"></div>${[3,2,1].map(n=>button(n===1?'start':'locked',`<span>${n===1&&profile.wins?icon('check'):n}</span>${n>1?icon('lock'):''}`,`level-node ${n===1?'current':'locked'}`,`aria-label="${t('level')} ${n}${n>1?' '+t('locked'):''}"`)).join('')}</div>
      <div class="unlock-card unlock-right">${icon('shield')}<span>${t('nextUnlock')}</span><b>${icon('lock')} ${t('level')} 3</b></div>
    </div>
    <div class="hero-stage"><div class="stage-halo"></div><img src="assets/hero.png" alt="Robot Pulse" class="hero-image skin-${profile.skin}"><div class="stage-platform"></div><span class="level-tag">${t('level')} 01 <i>·</i> ${t('firstContact')}</span></div>
    <div class="home-action">${profile.wins?`<div class="star-row">${[1,2,3].map(n=>icon('star',n<=profile.bestStars?'earned':'')).join('')}<span>${t('best')} ${fmt(profile.bestScore)}</span></div>`:`<p class="home-hint">${profile.session?t('savedRun'):t('ready')}</p>`}${button('start',`${profile.session?t('continue'):profile.wins?t('replay'):t('play')}${icon('play')}`,'primary play-button')}${button('help',`${icon('help')} ${t('how')}`,'text-button help-link')}</div>
  </section>`;
}

function shopView() {
  return `<section class="shop-screen" aria-label="${t('shop')}">
    <div class="shop-logo" role="img" aria-label="Robot Pulse">${art('logo')}</div>
    <div class="shop-title">${art('shop-header')}<h1 class="metal-text">${t('shop')}</h1></div>
    <div class="shop-section-title">${art('section-bar')}<h2>${t('packs')}</h2></div>
    <div class="shop-products">${PACKS.map((p,i)=>button('pack',`${art('product-card')}<span class="product-image">${art('pack-'+p.coins)}</span><strong class="product-amount">${fmt(p.coins)}</strong><span class="product-price">${art('buy-button')}<span>${p.price}</span></span>`,'shop-product',`data-pack="${i}" aria-label="${t('testPurchase')}: ${fmt(p.coins)} ${t('coins')}, ${p.price}"`)).join('')}</div>
    <div class="shop-reward">${art('reward-panel')}<div class="reward-illustration">${art('reward-chest')}</div><div class="reward-copy"><h2>${t('freeCoins')}</h2><p>${t('rewardBody')}</p></div>${button('rewards',`${art('buy-button')}<span>${t('explore')}</span>`,'reward-explore')}</div>
  </section>`;
}

function showRewards() {
  const daily=profile.dailyClaim===localDate();
  openModal(t('freeCoins'),`<div class="reward-modal-art">${art('reward-chest')}</div><h3>${t('daily')}</h3><p>${t('dailyBody')}</p>${button('daily',daily?t('claimed'):'+100 '+t('coins'),'primary',daily?'disabled':'')}`,[{label:t('close')}]);
}

function showProfile() {
  openModal(t('skins'),`<div class="skin-grid">${SKINS.map(s=>`<article class="skin-card ${profile.skin===s.id?'selected':''}">${robotIcon(s.color)}<h3>${t(s.id)}</h3>${button('skin',profile.skin===s.id?t('equipped'):profile.ownedSkins.includes(s.id)?t('owned'):`${icon('coin')} ${s.cost}`,'skin-button',`data-skin="${s.id}" ${profile.skin===s.id?'disabled':''}`)}</article>`).join('')}</div>`,[{label:t('close')}]);
}

function rankingRows() {
  const sample=rankingRegion==='global'?[['NOVA',1280,'#2edbff'],['VOLT',1150,'#b890ff'],['ECHO',1080,'#ffc443'],['PIXEL',1040,'#ff696e'],['ORBIT',980,'#72dfaa'],['AXIS',940,'#c68aff']]:[['NOVA',1100,'#2edbff'],['PIXEL',900,'#ff696e'],['ORBIT',820,'#72dfaa'],['VECTOR',680,'#ffc443'],['ION',610,'#b890ff'],['AXIS',540,'#c68aff']];
  const offset=rankingTab==='master'?240:0;
  return [...sample.map(([name,score,color])=>({name,score:score+offset,color,player:false})),{name:t('you'),score:profile.bestScore,color:skinColor(),player:true}].sort((a,b)=>b.score-a.score).map((r,i)=>({...r,rank:i+1}));
}

function leaderboardView() {
  const rows=rankingRows(), podium=[rows[1],rows[0],rows[2]], player=rows.find(r=>r.player);
  return `<section class="screen leaderboard-screen">${pageHeading(t('leaderboard'))}
    <div class="segmented" role="group" aria-label="${t('leaderboard')}">${['monthly','master'].map(k=>button('rank-tab',t(k),rankingTab===k?'selected':'',`data-tab="${k}" aria-pressed="${rankingTab===k}"`)).join('')}</div>
    <div class="region-filter">${['global','country'].map(k=>button('rank-region',`${k==='global'?icon('globe'):''}${t(k)}`,rankingRegion===k?'selected':'',`data-region="${k}" aria-pressed="${rankingRegion===k}"`)).join('')}</div>
    <p class="ranking-note">${t('rankingNote')}</p>
    <div class="podium">${podium.map(r=>`<div class="podium-pilot place-${r.rank}">${r.rank===1?`<span class="winner-crown">♛</span>`:''}<div class="portrait">${robotIcon(r.color)}</div><div class="podium-column"><span class="medal">${r.rank}</span><b>${r.name}</b><span class="podium-score">${icon('trophy')}${fmt(r.score)}</span></div></div>`).join('')}</div>
    <div class="ranking-list">${rows.slice(3).map(r=>`<div class="ranking-row ${r.player?'player-row':''}"><b class="rank-number">${r.rank}</b>${robotIcon(r.color)}<strong>${r.name}</strong><span>${icon('trophy')}${fmt(r.score)}</span></div>`).join('')}</div>
    ${!profile.bestScore?`<p class="ranking-empty">${t('noScore')}</p>`:''}
    <div class="your-rank"><span class="rank-number">${player.rank}</span>${robotIcon(skinColor())}<div><small>${t('best')}</small><strong>${t('you')}</strong></div><b>${icon('trophy')}${fmt(profile.bestScore)}</b></div>
    ${button('ranking-info',`${icon('help')} ${t('local')}`,'text-button ranking-info')}
  </section>`;
}

function gameView() {
  return `<section class="screen game-screen"><div class="game-heading">${button('pause',icon('back'),'icon-button',`aria-label="${t('back')}"`)}<div><p class="eyebrow">${t('level')} 01</p><h1>${t('firstContact')}</h1></div>${button('pause',icon('pause'),'icon-button',`aria-label="${t('pause')}"`)}</div>
    <div class="mission-progress"><span id="remaining"></span><span id="progress-percent"></span><div class="progress-track"><i id="progress-bar"></i></div></div>
    <div class="board-wrap"><canvas id="board" role="img" aria-label="${t('clear')}"></canvas><div class="belt-label">${icon('reload')} <span>${t('conveyor')}</span> <b id="belt-count">0 / 5</b></div></div>
    <div class="bay-heading"><h2>${t('waiting')}</h2><span id="bay-count">0 / 5</span></div><div id="waiting-bays" class="waiting-bays"></div>
    <div class="bay-heading queue-heading"><h2>${t('queue')}</h2>${button('help',icon('help'),'text-button',`aria-label="${t('how')}"`)}</div><div id="launch-queues" class="launch-queues"></div>
    <p class="game-instruction" id="game-instruction">${t('tapCyan')}</p>
  </section>`;
}

function renderGameControls() {
  if(screen!=='game'||!engine)return;
  const unit=r=>`<span class="color-dot" style="--unit:${COLORS[r.color].hex}">${COLORS[r.color].symbol}</span>${robotIcon(COLORS[r.color].hex,true)}<b class="ammo-badge">${r.ammo}</b>`;
  document.querySelector('#waiting-bays').innerHTML=engine.waiting.map((r,i)=>r?button('launch-waiting',unit(r),'waiting-robot',`data-slot="${i}" data-color="${r.color}" aria-label="${t('launch')} ${COLORS[r.color].name}, ${r.ammo} ${t('ammo')}"`):`<div class="empty-bay" aria-label="${t('waiting')} ${i+1}"><span>${String(i+1).padStart(2,'0')}</span></div>`).join('');
  document.querySelector('#launch-queues').innerHTML=engine.queues.map((q,col)=>`<div class="launch-column">${q[0]?button('launch-queue',unit(q[0]),'queue-robot',`data-column="${col}" data-color="${q[0].color}" aria-label="${t('launch')} ${COLORS[q[0].color].name}, ${q[0].ammo} ${t('ammo')}"`):`<div class="queue-empty">${icon('check')}</div>`}<div class="queued-tail" aria-hidden="true">${q.slice(1).map(r=>`<span style="--unit:${COLORS[r.color].hex}">${COLORS[r.color].symbol} ${r.ammo}</span>`).join('')}</div></div>`).join('');
  updateGameStats();
}

function updateGameStats() {
  if(screen!=='game'||!engine)return;
  document.querySelector('#remaining').textContent=`${engine.remaining} ${t('remaining')}`;
  const progress=Math.round(engine.destroyed/engine.total*100);
  document.querySelector('#progress-percent').textContent=`${progress}%`;
  document.querySelector('#progress-bar').style.width=`${progress}%`;
  document.querySelector('#belt-count').textContent=`${engine.active.length} / 5`;
  document.querySelector('#bay-count').textContent=`${engine.waiting.filter(Boolean).length} / 5`;
  document.querySelector('#game-instruction').textContent=engine.waiting.some(Boolean)?t('tapWaiting'):engine.launches?t('helpShort'):t('tapCyan');
}

function processEvents(events) {
  if(events.some(e=>['launch','park','spent'].includes(e.type)))renderGameControls();
  if(events.some(e=>e.type==='shot')){updateGameStats();sound('shot');}
  if(events.some(e=>e.type==='launch'))sound('launch');
  if(events.some(e=>e.type==='won'||e.type==='lost'))finishRun();
  else persistSession(events.some(e=>e.type==='launch'||e.type==='park'));
}

function navigate(page) {
  closeModal();screen=page;render();
  if(page!=='splash')save();
}

function startLevel() {
  refreshEnergy(profile);
  if(profile.session){
    try{engine=GameEngine.restore(profile.session.engine);}catch{engine=null;}
    if(engine&&['ready','playing'].includes(engine.status))runId=profile.session.id;
    else{profile.session=null;engine=null;save();}
  }else engine=null;
  if(!engine){
    if(profile.energy<1){openModal(t('noEnergy'),`<div class="modal-symbol">${icon('battery')}</div><p>${t('noEnergyBody')}</p>`,[{label:t('toShop'),primary:true,run:()=>navigate('shop')}]);return;}
    engine=new GameEngine();runId=globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
  screen='game';render();persistSession(true);
  if(!profile.tutorialSeen)showTutorial();
}

function finishRun() {
  if(!engine||!['won','lost'].includes(engine.status))return;
  renderer?.stop();
  if(engine.status==='won'){
    const result=engine.result(),newBest=result.score>profile.bestScore,reward=winRun(profile,runId,result);save();sound('win');
    openModal(t('victory'),`<div class="result-stars">${[1,2,3].map(n=>icon('star',n<=result.stars?'earned':'')).join('')}</div><p>${t('victoryBody')}</p>${newBest?`<span class="new-best">${t('newBest')}</span>`:''}<div class="result-grid"><div><small>${t('score')}</small><b>${fmt(result.score)}</b></div><div><small>${t('time')}</small><b>${result.seconds}s</b></div><div><small>${t('reward')}</small><b class="gold-text">+${reward} ${icon('coin')}</b></div></div>`,[{label:t('toHome'),primary:true,run:()=>navigate('home')},{label:t('resultReplay'),run:startLevel}],{closable:false,result:'win'});
  }else{
    loseRun(profile,runId);save();sound('loss');
    const why=engine.reason==='parking_full'?'parkingFull':engine.reason==='no_ammo'?'noAmmo':'abandoned';
    openModal(t('defeat'),`<div class="modal-symbol danger-symbol">${icon('battery')}</div><p>${t(why)}</p><p class="energy-used">${t('energyUsed')} · ${profile.energy}/5</p>`,[{label:t('tryAgain'),primary:true,run:startLevel},{label:t('toHome'),run:()=>navigate('home')}],{closable:false,result:'loss'});
  }
}

function showPause() {
  if(!engine?.isRunning)return;
  engine.pause();persistSession(true);
  openModal(t('paused'),`<div class="modal-symbol">${icon('pause')}</div><p>${t('level')} 01 · ${t('firstContact')}</p>`,[{label:t('resume'),primary:true},{label:t('restart'),run:()=>confirmEnd(true)},{label:t('quit'),run:()=>confirmEnd(false)}],{onClose:()=>engine?.resume()});
}

function confirmEnd(restart) {
  engine?.pause();
  openModal(t('quitTitle'),`<p>${t('quitBody')}</p>`,[{label:t('cancel'),primary:true},{label:restart?t('restartConfirm'):t('confirmQuit'),danger:true,run:()=>{
    engine?.fail();loseRun(profile,runId);save();renderer?.stop();engine=null;
    if(restart)startLevel();else navigate('home');
  }}],{onClose:()=>engine?.resume()});
}

function showTutorial() {
  const wasRunning=engine?.isRunning&&screen==='game';if(wasRunning)engine.pause();
  openModal(t('helpTitle'),`<ol class="tutorial-list">${['help1','help2','help3','help4'].map((key,i)=>`<li><b>${i+1}</b><p>${t(key)}</p></li>`).join('')}</ol><p class="color-key">${t('hint')}</p>`,[{label:t('gotIt'),primary:true}],{onClose:()=>{profile.tutorialSeen=true;save();if(wasRunning)engine?.resume();}});
}

function showSettings() {
  const wasRunning=engine?.isRunning&&screen==='game';if(wasRunning)engine.pause();
  openModal(t('settings'),`<div class="settings-row"><span>${icon('globe')}${t('language')}</span><div>${button('set-language','EN',profile.language==='en'?'selected':'',`data-language="en"`)}${button('set-language','ES',profile.language==='es'?'selected':'',`data-language="es"`)}</div></div><div class="settings-row"><span>${icon('sound')}${t('sound')}</span>${button('toggle-sound',t(profile.sound?'on':'off'),'toggle-button',`aria-pressed="${profile.sound}"`)}</div><div class="settings-row"><span>${icon('sound')}${t('music')}</span>${button('toggle-music',t(profile.music?'on':'off'),'toggle-button',`aria-pressed="${profile.music}"`)}</div><p class="settings-note">${t('energyInfo')}</p><p class="build-note">${t('about')}</p>`,[{label:t('close'),primary:true}],{onClose:()=>{if(wasRunning)engine?.resume();}});
}

function showEnergy() {
  refreshEnergy(profile);
  const ms=Math.max(0,RECHARGE_MS-(Date.now()-profile.energyAt)),minutes=Math.ceil(ms/60000);
  const wasRunning=engine?.isRunning&&screen==='game';if(wasRunning)engine.pause();
  openModal(t('energy'),`<div class="energy-display">${icon('battery')}<b>${profile.energy} / 5</b></div><p>${t('energyInfo')}</p>${profile.energy<5?`<p>${t('nextCharge')}: ${minutes} min</p>`:`<p>${t('full')}</p>`}${profile.energy<5?button('refill',`${t('recharge')} · 120 ${t('coins')}`,'primary'):''}`,[{label:t('gotIt'),primary:true}],{onClose:()=>{if(wasRunning)engine?.resume();}});
}

function openModal(title,body,actions,options={}) {
  if(modal)closeModal();
  modal={actions,options,previous:document.activeElement};
  modalRoot.innerHTML=`<div class="modal-scrim"><section class="modal ${options.result||''}" role="dialog" aria-modal="true" aria-labelledby="dialog-title">${options.closable!==false?button('close-modal',icon('close'),'modal-close',`aria-label="${t('close')}"`):''}<h2 id="dialog-title">${escapeHTML(title)}</h2><div class="modal-body">${body}</div><div class="modal-actions">${actions.map((a,i)=>button('modal-action',escapeHTML(a.label),a.primary?'primary':a.danger?'danger-button':'secondary',`data-index="${i}"`)).join('')}</div></section></div>`;
  root.inert=true;
  requestAnimationFrame(()=>modalRoot.querySelector('.modal-actions button')?.focus());
}

function closeModal() {
  if(!modal)return;
  const old=modal;modal=null;modalRoot.innerHTML='';root.inert=false;
  old.options.onClose?.();old.previous?.focus?.();
}

function handleAction(target) {
  const action=target.dataset.action;
  sound('tap');
  switch(action){
    case 'enter':navigate('home');break;
    case 'home':case 'shop':case 'leaderboard':navigate(action);break;
    case 'coins':if(screen==='game'){const wasRunning=engine?.isRunning;if(wasRunning)engine.pause();openModal(t('coins'),`<div class="modal-symbol">${icon('coin')}</div><p>${fmt(profile.coins)} ${t('coins')}</p><p>${t('insufficient')}</p>`,[{label:t('gotIt'),primary:true}],{onClose:()=>{if(wasRunning)engine?.resume();}});}else navigate('shop');break;
    case 'profile':if(screen==='game')showSettings();else showProfile();break;
    case 'rewards':showRewards();break;
    case 'start':startLevel();break;
    case 'locked':openModal(t('locked'),`<div class="modal-symbol">${icon('lock')}</div><p>${t('lockedBody')}</p>`,[{label:t('gotIt'),primary:true}]);break;
    case 'settings':showSettings();break;
    case 'energy':showEnergy();break;
    case 'help':showTutorial();break;
    case 'pause':showPause();break;
    case 'rank-tab':rankingTab=target.dataset.tab;render();break;
    case 'rank-region':rankingRegion=target.dataset.region;render();break;
    case 'ranking-info':openModal(t('leaderboard'),`<p>${t('rankingBody')}</p>`,[{label:t('gotIt'),primary:true}]);break;
    case 'close-modal':closeModal();break;
    case 'modal-action':{const a=modal?.actions[Number(target.dataset.index)];closeModal();a?.run?.();break;}
    case 'language':profile.language=profile.language==='en'?'es':'en';save();render();break;
    case 'set-language':closeModal();profile.language=target.dataset.language;save();render();showSettings();break;
    case 'toggle-music':profile.music=!profile.music;gameAudio.sync();save();target.textContent=t(profile.music?'on':'off');target.setAttribute('aria-pressed',String(profile.music));break;
    case 'toggle-sound':profile.sound=!profile.sound;save();if(modal){target.textContent=t(profile.sound?'on':'off');target.setAttribute('aria-pressed',String(profile.sound));}else render();break;
    case 'launch-queue':case 'launch-waiting':{
      if(!engine?.isRunning)return;
      const result=action==='launch-queue'?engine.launchQueue(Number(target.dataset.column)):engine.launchWaiting(Number(target.dataset.slot));
      if(!result.ok&&result.error==='belt_full')toast(t('beltFull'));
      else if(result.ok){renderGameControls();persistSession(true);}break;
    }
    case 'pack':{
      const pack=PACKS[Number(target.dataset.pack)];if(!pack)return;
      openModal(t('testPurchase'),`<div class="modal-coins">${coinStack(3)}<strong>+${fmt(pack.coins)}</strong></div><p>${t('testBody')}</p>`,[{label:t('addCoins'),primary:true,run:()=>{profile.coins=Math.min(9999999,profile.coins+pack.coins);save();render();sound('claim');toast(t('added'));}},{label:t('cancel')}]);break;
    }
    case 'daily':if(claimDaily(profile)){closeModal();save();render();showRewards();sound('claim');toast(t('claimSuccess'));}break;
    case 'refill':{
      const result=refillEnergy(profile);if(result==='ok'){closeModal();save();render();sound('claim');toast(t('refilled'));}else toast(t(result));break;
    }
    case 'skin':{
      const result=buySkin(profile,target.dataset.skin);if(result==='ok'){closeModal();save();render();showProfile();toast(t('skinAdded'));}else toast(t(result));break;
    }
  }
}

document.addEventListener('click',event=>{const target=event.target.closest('button[data-action]');if(target&&!target.disabled)handleAction(target);});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();if(modal){if(modal.options.closable!==false)closeModal();}else if(screen==='game')showPause();else if(screen!=='splash')navigate('home');}
  if(event.key==='Tab'&&modal){const focusable=[...modalRoot.querySelectorAll('button:not([disabled])')];const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
});

document.addEventListener('visibilitychange',()=>{
  if(document.hidden&&screen==='game'&&engine?.isRunning){showPause();persistSession(true);}
});
window.addEventListener('pagehide',()=>persistSession(true));
window.robotPulseBack=()=>{if(modal){if(modal.options.closable!==false)closeModal();}else if(screen==='game')showPause();else if(screen!=='splash')navigate('splash');else return false;return true;};
document.addEventListener('robotpulse:pause',()=>{if(screen==='game'&&engine?.isRunning){showPause();persistSession(true);}});
setInterval(()=>{
  const previous=profile.energy;refreshEnergy(profile);
  if(previous!==profile.energy){save();if(screen!=='game'&&!modal)render();}
  persistSession();
},1000);

// Explicit local test mode; never enabled by the installed Android app.
if(location.hostname==='127.0.0.1'&&new URLSearchParams(location.search).has('test')){
  window.__rpTest={get engine(){return engine;},get profile(){return profile;},advance(seconds){for(let i=0;i<seconds*60;i++)engine?.tick(1/60);if(engine)processEvents(engine.drainEvents());},save:()=>persistSession(true)};
}
render();
