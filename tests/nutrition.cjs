const assert=require('node:assert/strict'),{calculate}=require('../dist/nutrition-core.js');
const base={weight:70,height:175,age:30,sex:'male',activity:1.55};
const plans=Object.fromEntries(['gain','maintain','lose','strength'].map(goal=>[goal,calculate({...base,goal})]));
assert.equal(plans.strength.calories,plans.maintain.calories);assert(plans.gain.calories>plans.strength.calories);assert(plans.lose.calories<plans.maintain.calories);assert.equal(plans.lose.protein,140);
for(const p of Object.values(plans)){assert(p.fat>0&&p.carbs>0);assert(Math.abs(p.calories-(p.protein*4+p.carbs*4+p.fat*9))<=3);assert(Math.abs(p.fat*9/p.calories-.25)<.01);}
console.log('Nutrition checks passed: strength baseline, goal energy ordering, fat-loss protein, macro-energy consistency.');
