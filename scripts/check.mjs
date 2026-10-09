import { readdirSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
function walk(dir){return readdirSync(dir).flatMap(n=>{const p=`${dir}/${n}`;return statSync(p).isDirectory()?walk(p):[p];});}
const files=[...walk('game/src'),...walk('scripts')].filter(p=>/\.m?js$/.test(p));
for(const f of files)execFileSync(process.execPath,['--check',f]);
const html=readFileSync('game/index.html','utf8');
for(const path of ['styles.css','src/app.js','assets/app-icon.svg','assets/hero.png','assets/splash.png'])if(!statSync('game/'+path).size)throw Error(`Missing asset: ${path}`);
if(!html.includes('type="module"'))throw Error('Module entry missing');
console.log(`Syntax and assets checked: ${files.length} scripts.`);
