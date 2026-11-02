(function(root){
function ageAt(dob,today){if(!/^\d{4}-\d{2}-\d{2}$/.test(dob||'')||!/^\d{4}-\d{2}-\d{2}$/.test(today||''))return null;const [y,m,d]=dob.split('-').map(Number),check=new Date(y,m-1,d,12);if(check.getFullYear()!==y||check.getMonth()!==m-1||check.getDate()!==d||dob>today)return null;const [ty,tm,td]=today.split('-').map(Number);return ty-y-Number(tm<m||(tm===m&&td<d));}
const api={ageAt};if(typeof module!=='undefined')module.exports=api;else root.ProfileCore=api;
})(typeof window==='undefined'?globalThis:window);
