(function(root){
function calculate(data){const {weight,height,age,sex,activity,goal}=data;const maintenance=(10*weight+6.25*height-5*age+(sex==='male'?5:-161))*activity;const calories=Math.round(maintenance*(goal==='gain'?1.05:goal==='lose'?.85:1));const protein=Math.round(weight*(goal==='lose'?2:1.8)),fat=Math.round(calories*.25/9),carbs=Math.max(0,Math.round((calories-4*protein-9*fat)/4));return {...data,calories,protein,fat,carbs,maintenance:Math.round(maintenance),savedAt:new Date().toISOString()};}
const api={calculate};if(typeof module!=='undefined')module.exports=api;else root.NutritionCore=api;
})(typeof window==='undefined'?globalThis:window);
