const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const elements=new Map(),values=new Map();
const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};
const document={createElement:()=>({append(){},replaceChildren(){}}),createTextNode:x=>x,querySelector:s=>{if(!elements.has(s))elements.set(s,{textContent:'',hidden:false,replaceChildren(){},append(){},querySelector:()=>({}),showModal(){},close(){}});return elements.get(s)}};
const ctx=vm.createContext({console,document,localStorage:storage,Storage:function(){},setTimeout:()=>1,clearTimeout(){},window:{addEventListener(){}},navigator:{},location:{reload(){}},Blob,URL});
vm.runInContext(fs.readFileSync('dist/account-store.js','utf8'),ctx);
ctx.AccountStore=ctx.window.AccountStore;
let src=fs.readFileSync('dist/account.js','utf8');src=src.slice(0,src.indexOf('boot().catch'))+`globalThis.test={flush,pull,connect,meta,setMeta,setup(uid,backend){user={uid};store=AccountStore.create(localStorage,uid);F=backend;db={};ready=true;conflict=false;},snapshot:()=>store.snapshot(),replace:d=>store.replace(d),conflict:()=>conflict};`;
vm.runInContext(src,ctx);const t=ctx.test,cloud=new Map();let fail=false,during=null;
const backend={doc:(_, ...parts)=>parts.join('/'),serverTimestamp:()=>0,runTransaction:async(_,fn)=>{if(fail)throw Object.assign(Error('offline'),{code:'unavailable'});const writes=[];const result=await fn({get:async key=>({exists:()=>cloud.has(key),data:()=>cloud.get(key)}),set:(key,val)=>writes.push([key,val])});if(during){during();during=null;}writes.forEach(([k,v])=>cloud.set(k,v));return result;}};
(async()=>{
 t.setup('alice',backend);t.setMeta({revision:0,dirty:true});const initial=t.snapshot();initial['form-fuel-v1']=JSON.stringify({meals:[{id:'meal',photo:'data:image/jpeg;base64,'+'a'.repeat(500000)}]});t.replace(initial);await t.flush();assert.equal(t.meta().dirty,false);assert.equal(cloud.get('users/alice/progress/manifest').parts>1,true);
 t.setup('bob',backend);assert.equal(t.snapshot()['form-fuel-v1'],null);await t.pull();assert.equal(t.meta().revision,0);assert.equal(t.snapshot()['form-fuel-v1'],null);
 t.setup('alice',backend);t.replace(Object.fromEntries(ctx.AccountStore.keys.map(k=>[k,null])));await t.pull();assert.equal(t.snapshot()['form-fuel-v1'],initial['form-fuel-v1']);
 t.setMeta({revision:0,dirty:true});await t.flush();assert.equal(t.conflict(),true);assert.equal(t.meta().dirty,true);assert.equal(cloud.get('users/alice/progress/manifest').revision,1);
 t.setup('alice',backend);t.setMeta({revision:1,dirty:true});fail=true;await t.flush();assert.equal(t.meta().dirty,true);fail=false;
 during=()=>{const d=t.snapshot();d['form-fuel-routines-v1']='{"new":true}';t.replace(d);};await t.flush();assert.equal(t.meta().dirty,true);assert.equal(t.meta().revision,2);await t.flush();assert.equal(t.meta().dirty,false);
 // Unknown baseline with pending local work must never be overwritten.
 t.setMeta({revision:null,dirty:true});const before=JSON.stringify(t.snapshot());await t.connect();assert.equal(t.conflict(),true);assert.equal(JSON.stringify(t.snapshot()),before);
 console.log('PASS: account isolation, photo chunk roundtrip, revision conflict, offline retention, concurrent edits, unknown-baseline recovery');
})().catch(e=>{console.error(e);process.exitCode=1});

