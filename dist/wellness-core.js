(function(root){
const validDate=d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&CalendarCore.dayKey(CalendarCore.parse(d))===d;
function setTargets(db,date,burn,sleep){if(!validDate(date)||!Number.isFinite(burn)||burn<1||burn>3000||!Number.isFinite(sleep)||sleep<1||sleep>24)throw Error('Invalid target values');return {...db,targets:[...db.targets.filter(t=>t.from!==date),{from:date,burn,sleep}].sort((a,b)=>a.from.localeCompare(b.from))};}
function setDay(db,date,key,value){if(!validDate(date)||!['sleep','totalBurn'].includes(key))throw Error('Invalid day');const days={...db.days},record={...days[date]};if(value===null)delete record[key];else {if(!Number.isFinite(value)||value<0||value>(key==='sleep'?24:15000))throw Error('Invalid value');record[key]=value;}days[date]=record;return {...db,days};}
const api={setTargets,setDay};if(typeof module!=='undefined')module.exports=api;else root.WellnessCore=api;
})(typeof window==='undefined'?globalThis:window);
