import { readdirSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { GAME_ART } from '../game/src/game-art-data.js';
import { MENU_ART } from '../game/src/menu-art.js';
function walk(dir){return readdirSync(dir).flatMap(n=>{const p=`${dir}/${n}`;return statSync(p).isDirectory()?walk(p):[p];});}
const files=[...walk('game/src'),...walk('scripts')].filter(p=>/\.m?js$/.test(p));
for(const f of files)execFileSync(process.execPath,['--check',f]);
const html=readFileSync('game/index.html','utf8');
for(const path of ['styles.css','art-ui.css','src/app.js','assets/audio/menu-theme.mp3','assets/audio/button-tap.wav','assets/fonts/Tektur.ttf','assets/app-icon.png','gameplay-ui.css','assets/hero.png','assets/splash.png'])if(!statSync('game/'+path).size)throw Error(`Missing asset: ${path}`);
if(!html.includes('type="module"'))throw Error('Module entry missing');
if(!html.includes('menu-ui.css')||!statSync('game/menu-ui.css').size)throw Error('New menu stylesheet missing');
for(const [name,a] of Object.entries(MENU_ART)){
  if(!statSync(`game/assets/ui-v3/${a.file}.png`).size)throw Error(`Missing menu atlas: ${name}`);
  if(a.x<0||a.y<0||a.w<=0||a.h<=0||a.x+a.w>a.width||a.y+a.h>a.height)throw Error(`Sprite outside atlas: ${name}`);
}
for(const name of Object.keys(JSON.parse(readFileSync('game/assets/ui/manifest.json','utf8'))))if(!statSync(`game/assets/ui/${name}.png`).size)throw Error(`Missing art: ${name}`);
console.log(`Syntax and assets checked: ${files.length} scripts.`);

for(const [name,a] of Object.entries(GAME_ART)){
 if(!statSync('game/assets/gameplay/'+a.file).size)throw Error('Missing gameplay asset '+name);
 const [x,y,w,h]=a.rect,[sw,sh]=a.sourceSize;
 if(x<0||y<0||w<=0||h<=0||x+w>sw||y+h>sh)throw Error('Gameplay sprite outside atlas '+name);
}

for(const name of ['background-built','background-empty','parts','drill','card-en','card-es','buildings'])if(!statSync(`game/assets/mining/${name}.png`).size)throw Error('Missing mining asset '+name);
if(!html.includes('mining-ui.css')||!statSync('game/mining-ui.css').size)throw Error('Mining stylesheet missing');
// Preserve the approved mining motion verbatim, including irregular dust and fixed wagon.
for(const name of ['engine','renderer','particles'])if(!readFileSync(`game/src/mining/${name}.js`).equals(readFileSync(`previews/mining/${name}.js`)))throw Error('Approved mining animation changed: '+name);

for(const name of ['mine-portal','mine-preview'])if(!statSync(`game/assets/polish/${name}.png`).size)throw Error('Missing polish asset '+name);
if(!html.includes('polish-ui.css'))throw Error('Polish stylesheet missing');
if(!readFileSync('game/assets/audio/button-tap.wav').equals(readFileSync('art/audio/2026-10-10-button-tap/game-ball-tap-2073.wav')))throw Error('Owner button sound must be packaged unchanged');
