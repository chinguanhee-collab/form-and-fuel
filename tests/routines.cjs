const assert=require('node:assert/strict');
const {generate,validateSaved}=require('../dist/routines.js');
const base={goal:'muscle',experience:'beginner',equipment:'gym',focus:'balanced',days:3,minutes:45,adult:true,exclude:[]};
for(const equipment of ['bodyweight','dumbbells','gym'])for(const days of [2,3,4,5])for(const minutes of [20,30,45,60,75]){
 const result=generate({...base,equipment,days,minutes},3);assert.equal(result.ok,true,JSON.stringify({equipment,days,minutes,result}));assert.equal(result.plan.days.length,days);assert.equal(new Set(result.plan.days.map(d=>d.id)).size,days);
 for(const day of result.plan.days){assert(day.exercises.length>=2);assert(day.seconds<=minutes*60);assert(day.estimatedMinutes<=minutes);assert.equal(new Set(day.exercises.map(e=>e.id)).size,day.exercises.length);if(equipment==='bodyweight')assert(day.exercises.every(e=>e.equipment==='bodyweight'));if(equipment==='dumbbells')assert(day.exercises.every(e=>e.equipment!=='gym'));}
}
for(const exclusion of ['knee','hinge','overhead','push','pull','core','impact']){const result=generate({...base,exclude:[exclusion]});assert(result.ok);assert(result.plan.days.every(d=>d.exercises.every(e=>!e.tags.includes(exclusion))));}
const limited=generate({...base,equipment:'bodyweight',exclude:['knee','hinge','push','pull','core','overhead']});assert.equal(limited.ok,false);
assert.equal(generate({...base,adult:false}).ok,false);assert.equal(generate({...base,days:7}).ok,false);
assert.equal(validateSaved({schema:1,profile:base,variant:1,savedAt:new Date().toISOString()}),true);assert.equal(validateSaved({schema:1,profile:{...base,exclude:['unknown']},variant:1,savedAt:'today'}),false);assert.equal(validateSaved({schema:2,profile:base,variant:0,savedAt:'today'}),false);
assert.notDeepEqual(generate({...base,equipment:'gym'},0).plan.days[0].exercises.map(e=>e.id),generate({...base,equipment:'gym'},1).plan.days[0].exercises.map(e=>e.id));
assert.deepEqual(generate(base,2),generate(base,2));
console.log('Routine checks passed: 60 equipment/day/budget combinations, exclusions, impossible preferences, schema guards and deterministic variation.');
