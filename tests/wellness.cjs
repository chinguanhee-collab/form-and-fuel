const assert=require('node:assert/strict');global.CalendarCore=require('../dist/calendar-core.js');const W=require('../dist/wellness-core.js');
const original={schema:1,targets:[{from:'2026-10-31',burn:310,sleep:8}],days:{'2026-10-30':{sleep:5.5,totalBurn:3000}}};
const updated=W.setTargets(original,'2026-10-30',300,8);
assert.equal(CalendarCore.versionAt(updated.targets,'2026-10-30').burn,300);assert.equal(CalendarCore.versionAt(updated.targets,'2026-10-31').burn,310);assert.equal(CalendarCore.versionAt(updated.targets,'2026-10-29'),null);assert.equal(original.targets.length,1);
let next=W.setDay(updated,'2026-10-30','sleep',7.5);assert.equal(next.days['2026-10-30'].totalBurn,3000);next=W.setDay(next,'2026-10-30','sleep',null);assert.equal(next.days['2026-10-30'].totalBurn,3000);next=W.setDay(next,'2026-10-30','sleep',8);next=W.setDay(next,'2026-10-30','totalBurn',null);assert.equal(next.days['2026-10-30'].sleep,8);assert.equal(original.days['2026-10-30'].sleep,5.5);
assert.throws(()=>W.setTargets(updated,'2026-02-30',300,8));assert.throws(()=>W.setDay(updated,'2026-10-30','totalBurn',-1));
console.log('Wellness checks passed: selected-day inclusive targets, later targets preserved, invalid dates rejected, independent sleep and total-burn edits/removals.');
