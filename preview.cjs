const http=require('http');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
http.createServer((req,res)=>{let file;try{file=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end();}if(file==='/')file='/index.html';const target=path.resolve(root,'.'+file);if(!target.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(target,(err,body)=>{if(err){res.writeHead(404);return res.end('Not found');}res.setHeader('Content-Type',types[path.extname(target)]||'application/octet-stream');res.end(body);});}).listen(4173,'127.0.0.1',()=>console.log('Local: http://localhost:4173'));
