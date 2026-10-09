import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../game');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.ttf':'font/ttf','.mp3':'audio/mpeg','.wav':'audio/wav'};
const port=Number(process.env.PORT||4173);
const server=http.createServer((req,res)=>{
  let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
  if(name==='/')name='/index.html';
  const file=path.resolve(root,'.'+name);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.stat(file,(err,stat)=>{
    if(err||!stat.isFile()){res.writeHead(404).end('Not found');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    fs.createReadStream(file).pipe(res);
  });
});
server.listen(port,'0.0.0.0',()=>console.log(`Robot Pulse http://127.0.0.1:${port}`));
