/* Account namespaces keep the existing application stores isolated. */
(function(root){
  const keys=['form-fuel-v1','form-fuel-routines-v1','form-fuel-calendar-v1','form-fuel-wellness-v1'];
  function create(storage,uid){
    const native={get:storage.getItem.bind(storage),set:storage.setItem.bind(storage),remove:storage.removeItem.bind(storage)};
    const prefix=uid?'ff-account:'+uid+':':'';
    const mapped=k=>keys.includes(k)?prefix+k:k;
    const snapshot=()=>Object.fromEntries(keys.map(k=>[k,native.get(mapped(k))]));
    function replace(data){for(const k of keys){if(data[k]!==null&&typeof data[k]!=='string')throw Error('Invalid cloud backup');if(data[k])JSON.parse(data[k]);}for(const k of keys){data[k]===null?native.remove(mapped(k)):native.set(mapped(k),data[k]);}}
    return {keys,native,prefix,mapped,snapshot,replace};
  }
  function pack(data){const s=JSON.stringify(data),parts=[];for(let i=0;i<s.length;i+=150000)parts.push(s.slice(i,i+150000));if(parts.length>50)throw Error('Backup too large. Export your progress to keep a copy.');return parts;}
  root.AccountStore={keys,create,pack};
})(typeof window==='undefined'?globalThis:window);
