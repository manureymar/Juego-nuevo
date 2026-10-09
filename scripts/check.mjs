import { readdirSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
function walk(dir){return readdirSync(dir).flatMap(n=>{const p=`${dir}/${n}`;return statSync(p).isDirectory()?walk(p):[p];});}
const files=[...walk('game/src'),...walk('scripts')].filter(p=>/\.m?js$/.test(p));
for(const f of files)execFileSync(process.execPath,['--check',f]);
const html=readFileSync('game/index.html','utf8');
for(const path of ['styles.css','art-ui.css','src/app.js','assets/audio/menu-theme.mp3','assets/audio/button-tap.wav','assets/fonts/Tektur.ttf','assets/app-icon.svg','assets/hero.png','assets/splash.png'])if(!statSync('game/'+path).size)throw Error(`Missing asset: ${path}`);
if(!html.includes('type="module"'))throw Error('Module entry missing');
for(const name of Object.keys(JSON.parse(readFileSync('game/assets/ui/manifest.json','utf8'))))if(!statSync(`game/assets/ui/${name}.png`).size)throw Error(`Missing art: ${name}`);
console.log(`Syntax and assets checked: ${files.length} scripts.`);
