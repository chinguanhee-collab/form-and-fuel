/* Deterministic, browser-local routine planning. No account data is overwritten. */
(()=>{
'use strict';
const KEY='form-fuel-routines-v1';
const exercise=(id,name,equipment,pattern,area,tags=[],unilateral=false)=>({id,name,equipment,pattern,area,tags,unilateral});
const movements=[
 exercise('bodySquat','Controlled bodyweight squat','bodyweight','knee','legs',['knee']),
 exercise('reverseLunge','Supported reverse lunge','bodyweight','knee','legs',['knee'],true),
 exercise('wallPushup','Wall push-up','bodyweight','push','chest',['push']),
 exercise('floorPushup','Push-up from knees or toes','bodyweight','push','chest',['push']),
 exercise('bridge','Floor glute bridge','bodyweight','hinge','hips',['hinge']),
 exercise('bridgeHold','Glute bridge with a brief pause','bodyweight','hinge','hips',['hinge']),
 exercise('deadBug','Dead bug','bodyweight','core','trunk',['core'],true),
 exercise('birdDog','Bird dog','bodyweight','core','trunk',['core'],true),
 exercise('sidePlank','Side plank from knees','bodyweight','core','trunk',['core'],true),
 exercise('calfRaise','Standing calf raise','bodyweight','calf','calves',[]),
 exercise('dbSquat','Goblet squat','dumbbells','knee','legs',['knee']),
 exercise('dbSplitSquat','Dumbbell split squat','dumbbells','knee','legs',['knee'],true),
 exercise('dbRdl','Dumbbell Romanian deadlift','dumbbells','hinge','hips',['hinge']),
 exercise('dbBridge','Dumbbell glute bridge','dumbbells','hinge','hips',['hinge']),
 exercise('dbFloorPress','Dumbbell floor press','dumbbells','push','chest',['push']),
 exercise('dbNeutralPress','Neutral-grip dumbbell floor press','dumbbells','push','chest',['push']),
 exercise('dbRow','One-arm dumbbell row, forearm supported on thigh','dumbbells','pull','back',['pull','hinge'],true),
 exercise('dbBentRow','Dumbbell bent-over row','dumbbells','pull','back',['pull','hinge']),
 exercise('dbPress','Standing dumbbell shoulder press','dumbbells','shoulder','shoulders',['push','overhead']),
 exercise('lateralRaise','Dumbbell lateral raise','dumbbells','shoulder','shoulders',[]),
 exercise('hammerCurl','Hammer curl','dumbbells','arm','arms',[]),
 exercise('dbCurl','Standing dumbbell curl','dumbbells','arm','arms',[]),
 exercise('machineSquat','Leg press','gym','knee','legs',['knee']),
 exercise('legExtension','Leg extension','gym','knee','legs',['knee']),
 exercise('machineCurl','Seated leg curl','gym','hinge','hips',['hinge']),
 exercise('hipThrust','Padded machine hip thrust','gym','hinge','hips',['hinge']),
 exercise('chestPress','Machine chest press','gym','push','chest',['push']),
 exercise('cablePress','Standing cable chest press','gym','push','chest',['push']),
 exercise('pulldown','Lat pulldown','gym','pull','back',['pull','overhead']),
 exercise('seatedRow','Seated cable row','gym','pull','back',['pull']),
 exercise('machineRow','Chest-supported machine row','gym','pull','back',['pull']),
 exercise('machineShoulder','Machine shoulder press','gym','shoulder','shoulders',['push','overhead']),
 exercise('cableRaise','Cable lateral raise','gym','shoulder','shoulders',[]),
 exercise('pushdown','Cable triceps pushdown','gym','arm','arms',['push']),
 exercise('cableCurl','Standing cable curl','gym','arm','arms',[]),
 exercise('machineCalf','Seated calf raise','gym','calf','calves',[])
];
const valid={goals:['muscle','strength','general','fitness'],experience:['beginner','intermediate','experienced'],equipment:['bodyweight','dumbbells','gym'],focus:['balanced','upper','lower'],exclude:['knee','hinge','overhead','push','pull','core','impact']};
const names={muscle:'Build muscle',strength:'Build strength',general:'General fitness',fitness:'Fitness & weight-management support',beginner:'Beginner',intermediate:'Intermediate',experienced:'Experienced',bodyweight:'Bodyweight only',dumbbells:'Dumbbells + bodyweight',gym:'Full gym',balanced:'Balanced',upper:'Upper-body emphasis',lower:'Lower-body emphasis'};
function normalize(p){return {goal:p?.goal,experience:p?.experience,equipment:p?.equipment,focus:p?.focus,days:Number(p?.days),minutes:Number(p?.minutes),adult:p?.adult===true,exclude:Array.isArray(p?.exclude)?[...new Set(p.exclude)]:[]};}
function validate(p){const errors=[];for(const field of ['goal','experience','equipment','focus'])if(!valid[field==='goal'?'goals':field].includes(p[field]))errors.push('Choose a valid '+field+'.');if(![2,3,4,5].includes(p.days))errors.push('Choose 2–5 training days.');if(![20,30,45,60,75].includes(p.minutes))errors.push('Choose a session length from the list.');if(!p.adult)errors.push('Confirm that you are 18 or older to use this adult training planner.');if(p.exclude.some(x=>!valid.exclude.includes(x)))errors.push('An excluded movement is not recognized.');return errors;}
function settings(p,m){const compound=['knee','hinge','push','pull','shoulder'].includes(m.pattern);const beginner=p.experience==='beginner';let sets=beginner||p.goal==='general'||p.goal==='fitness'?2:3;const strength=p.goal==='strength'&&!beginner&&compound;const rest=strength?150:compound?90:60;const reps=m.id==='sidePlank'?'15–25 sec per side':strength?'6–8':compound?'8–12':'10–15';const work=m.id==='sidePlank'?50:m.unilateral?80:45;return {sets,reps,rest,work};}
function duration(item){return item.sets*item.work+(item.sets-1)*item.rest+45;}
const schedules={2:['Mon','Thu'],3:['Mon','Wed','Fri'],4:['Mon','Tue','Thu','Sat'],5:['Mon','Tue','Wed','Fri','Sat']};
function templates(p){if(p.equipment==='bodyweight'&&p.days===5)return [
 ['Upper & core A',['push','core','core']],['Lower A',['knee','hinge','calf','core']],
 ['Upper & core B',['push','core','core']],['Lower B',['hinge','knee','calf','core']],
 ['Upper & core C',['push','core','core']]
 ];if(p.days<=3)return [
 ['Full body A',['knee','push','pull','hinge','core','calf']],
 ['Full body B',['hinge','pull','push','knee','core','shoulder']],
 ['Full body C',['knee','pull','push','hinge','core','arm']]
 ].slice(0,p.days);if(p.days===4)return [
 ['Upper A',['push','pull','shoulder','arm','core']],['Lower A',['knee','hinge','calf','core']],
 ['Upper B',['pull','push','shoulder','arm','core']],['Lower B',['hinge','knee','calf','core']]
 ];return [
 ['Push',['push','shoulder','arm','core']],['Pull',['pull','pull','arm','core']],
 ['Legs',['knee','hinge','calf','core']],['Upper',['pull','push','shoulder','arm']],['Lower',['hinge','knee','calf','core']]
 ];}
function generate(raw,variant=0){const p=normalize(raw),errors=validate(p);if(errors.length)return {ok:false,errors};const warnings=[];const equipment=p.equipment==='bodyweight'?['bodyweight']:p.equipment==='dumbbells'?['bodyweight','dumbbells']:['bodyweight','dumbbells','gym'];const available=movements.filter(m=>equipment.includes(m.equipment)&&!m.tags.some(t=>p.exclude.includes(t)));
 const days=templates(p).map(([title,base],dayIndex)=>{
  let patterns=[...base];if(p.focus==='upper')patterns.splice(Math.max(3,patterns.length-1),0,'arm');if(p.focus==='lower')patterns.splice(Math.max(3,patterns.length-1),0,'calf');
  const items=[],used=new Set();let usedSeconds=420;const missing=[];
  for(const pattern of patterns){let pool=available.filter(m=>m.pattern===pattern&&!used.has(m.id));if(!pool.length){if(!['arm','shoulder','calf'].includes(pattern))missing.push(pattern);continue;}
   // Prefer the selected equipment while keeping bodyweight core movements available.
   pool.sort((a,b)=>equipment.indexOf(b.equipment)-equipment.indexOf(a.equipment));
   const top=pool.filter(m=>m.equipment===pool[0].equipment);let m=top[(dayIndex+Math.max(0,Math.floor(variant)))%top.length];
   let item={...m,...settings(p,m)};let seconds=duration(item);
   if(usedSeconds+seconds>p.minutes*60){if(item.sets===3){item={...item,sets:2};seconds=duration(item);}if(usedSeconds+seconds>p.minutes*60)continue;}
   used.add(m.id);items.push(item);usedSeconds+=seconds;
  }
  return {id:'day-'+(dayIndex+1),weekday:schedules[p.days][dayIndex],title,exercises:items,warmupMinutes:5,cooldownMinutes:2,estimatedMinutes:Math.ceil(usedSeconds/60),seconds:usedSeconds,missing:[...new Set(missing)]};
 });
 if(days.some(d=>d.exercises.length<2))return {ok:false,errors:['These preferences leave too few suitable movements for a useful weekly plan. Try fewer exclusions, more equipment, or a longer session. Do not reintroduce a movement you need to avoid; a qualified trainer can help with alternatives.']};
 const patterns=new Set(days.flatMap(d=>d.exercises.map(m=>m.pattern)));
 if(!patterns.has('pull'))warnings.push('This plan has no loaded pulling exercise. With bodyweight-only equipment, the planner does not pretend floor drills replace rows or pulldowns. Consider suitable pulling equipment or a trainer’s alternative when appropriate.');
 if(!patterns.has('knee')||!patterns.has('hinge'))warnings.push('Your time or movement preferences limit lower-body coverage. This is a partial strength plan rather than complete all-muscle coverage.');
 if(!patterns.has('push'))warnings.push('Your time or exclusions remove pressing movements; chest and triceps coverage is limited.');
 if(p.minutes===20)warnings.push('Short sessions prioritize a few movements. They offer a starting routine, not a guarantee of optimal weekly volume for every muscle.');
 if(p.experience==='beginner'&&p.days>=4)warnings.push('Four or five days is a high starting frequency. Begin with fewer days if recovery or consistency suffers.');
 if(p.goal==='strength'&&p.equipment==='bodyweight')warnings.push('Bodyweight strength progress depends on exercise difficulty. Heavier-load strength work will need appropriate resistance equipment.');
 if(p.goal==='fitness')warnings.push('This is the strength portion of a weight-management plan. It does not predict fat loss or replace your nutrition targets and regular aerobic activity.');
 const plan={schema:1,profile:p,variant:Math.max(0,Math.floor(variant)),days,warnings,rationale:`${p.days<=3?'Alternating full-body sessions':p.days===4?'An upper/lower split repeated twice':p.equipment==='bodyweight'?'Alternating upper-body/core and lower-body sessions':'Push, pull, legs, upper and lower sessions'} matches your ${p.days}-day schedule. ${names[p.equipment]} filters the exercise library; excluded patterns are removed before scheduling. Your ${p.minutes}-minute limit includes 5 minutes of warm-up, 2 minutes to wind down, 45-second exercise transitions, work sets and all prescribed between-set rests.`,progression:p.experience==='beginner'?'Start with a manageable resistance and controlled technique. Finish most sets with around 2–3 good repetitions still possible. When all sets reach the top of the range comfortably, increase resistance by the smallest available step, or progress the bodyweight variation.':'Keep around 1–3 controlled repetitions in reserve. When every set reaches the top of its range with consistent form, add the smallest practical resistance increase and return toward the lower end. Reduce load or volume if performance and recovery decline.',recovery:'The weekdays are suggested slots, not appointments. Keep rest days between repeated hard sessions for the same muscles when arranging your week. Allow longer rests than estimated if you need them; the real session may then take longer.'};return {ok:true,plan};
}
function validateSaved(record){if(!record||record.schema!==1||!Number.isInteger(record.variant)||record.variant<0||record.variant>100000||typeof record.savedAt!=='string')return false;return validate(normalize(record.profile)).length===0;}
const api={generate,validateSaved,movements:movements.map(m=>({...m})),storageKey:KEY};
if(typeof window!=='undefined')window.RoutineBuilder=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
if(typeof document==='undefined')return;
const root=document.getElementById('routines');if(!root)return;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let current=null,currentDay=0,variant=0,saved=null,storageMessage='';
try{const value=localStorage.getItem(KEY);if(value){const parsed=JSON.parse(value);if(validateSaved(parsed))saved=parsed;else storageMessage='The saved routine could not be read. Your nutrition plan and meal journal are unaffected.';}}catch{storageMessage='Routine storage is unavailable in this browser. You can still generate and export a plan.';}
const options=(list)=>list.map(([v,l])=>`<option value="${v}">${l}</option>`).join('');
root.innerHTML=`<div class="section-heading routine-section-heading"><div class="section-heading-copy"><p class="eyebrow">02 / BUILT AROUND YOUR WEEK</p><h2 id="routinesHeading">A routine that fits your life.</h2><p class="section-intro">Choose your goal, equipment and schedule. Build a practical starting plan you can keep and adjust.</p></div></div><div class="routine-workspace"><form class="routine-form" id="routineForm"><div class="routine-card-heading"><h3>Your training preferences</h3><span>Start here</span></div><div class="routine-form-grid"><label>Training goal<select name="goal">${options([['muscle','Build muscle'],['strength','Build strength'],['general','General fitness'],['fitness','Fitness & weight-management support']])}</select></label><label>Experience<select name="experience">${options([['beginner','Beginner · starting or returning'],['intermediate','Intermediate · consistent training'],['experienced','Experienced · established technique']])}</select></label><label>Available equipment<select name="equipment">${options([['bodyweight','Bodyweight only'],['dumbbells','Dumbbells + bodyweight'],['gym','Full gym']])}</select></label><label>Training days per week<select name="days">${options([[2,'2 days'],[3,'3 days'],[4,'4 days'],[5,'5 days']])}</select></label><label>Time per session<select name="minutes">${options([[20,'20 minutes'],[30,'30 minutes'],[45,'45 minutes'],[60,'60 minutes'],[75,'75 minutes']])}</select></label><label>Extra emphasis<select name="focus">${options([['balanced','Balanced foundation'],['upper','Upper body'],['lower','Lower body']])}</select></label></div><details class="routine-preferences"><summary>Movement preferences <span>Optional</span></summary><p>Exclude patterns you do not want in this routine. This is a preference filter, not an injury or rehabilitation assessment.</p><fieldset><legend>Leave these movements out</legend>${[['knee','Squats & lunges'],['hinge','Hip hinges & bridges'],['overhead','Overhead movements'],['push','Pressing & push-ups'],['pull','Rows & pulldowns'],['core','Direct core work'],['impact','Jumping / impact']].map(([v,l])=>`<label><input type="checkbox" name="exclude" value="${v}"><span>${l}</span></label>`).join('')}</fieldset><p class="routine-small">No jumping is included in this strength library. If a movement is painful or restricted, get individual advice before adding it back.</p></details><label class="routine-adult"><input type="checkbox" name="adult" required><span>I’m 18 or older and I’ve reviewed these preferences.</span></label><button class="primary routine-generate" type="submit">Build my routine <span aria-hidden="true">↗</span></button><p class="routine-small">Editable defaults are shown; no personal training details have been assumed.</p><div class="routine-message" role="status" aria-live="polite"></div></form><div class="routine-output" id="routineOutput"><div class="routine-empty"><span class="routine-empty-mark" aria-hidden="true">↗</span><p class="eyebrow">YOUR NEXT STEP, MADE CLEAR</p><h3>Your week starts with a plan.</h3><p>Confirm your preferences to see training days, movements, sets, reps and recovery guidance.</p><div class="routine-empty-points"><span>Equipment-aware</span><span>Time-budgeted</span><span>Saved on your device</span></div></div></div></div><details class="routine-evidence"><summary>How recommendations are made</summary><p>Starting suggestions only. Adjust to your ability and equipment; review any coverage limits shown.</p><p><a href="https://acsm.org/resistance-training-guidelines-update-2026/" target="_blank" rel="noopener">ACSM · 2026 resistance training guidance ↗</a><a href="https://www.cdc.gov/physical-activity-basics/adding-adults/what-counts.html" target="_blank" rel="noopener">CDC · adult strength activity ↗</a></p></details>`;
const form=root.querySelector('#routineForm'),output=root.querySelector('#routineOutput'),message=root.querySelector('.routine-message');
form.elements.days.value='3';form.elements.minutes.value='45';
if(saved){for(const field of ['goal','experience','equipment','focus','days','minutes'])form.elements[field].value=String(saved.profile[field]);form.elements.adult.checked=saved.profile.adult;form.querySelectorAll('[name="exclude"]').forEach(c=>c.checked=saved.profile.exclude.includes(c.value));variant=saved.variant;current=generate(saved.profile,variant).plan;}
else{try{const profile=JSON.parse(localStorage.getItem('form-fuel-v1')||'null')?.plan;if(profile?.goal)form.elements.goal.value=profile.goal==='gain'?'muscle':profile.goal==='lose'?'fitness':'general';}catch{/* No existing nutrition profile. */}}
function readForm(){const f=new FormData(form);return {goal:f.get('goal'),experience:f.get('experience'),equipment:f.get('equipment'),focus:f.get('focus'),days:Number(f.get('days')),minutes:Number(f.get('minutes')),adult:f.get('adult')==='on',exclude:f.getAll('exclude')};}
function renderDay(){const day=current.days[currentDay];const panel=output.querySelector('#routineDayPanel');panel.setAttribute('aria-labelledby','routineTab'+currentDay);panel.innerHTML=`<div class="routine-day-heading"><div><p class="eyebrow">${escape(day.weekday)} · SESSION ${currentDay+1}</p><h4>${escape(day.title)}</h4></div><span>≈ ${day.estimatedMinutes} min <small>/ ${current.profile.minutes} min budget</small></span></div><div class="routine-warmup"><strong>Before you begin · 5 min</strong><span>Easy movement and light rehearsal of today’s patterns. Use extra warm-up sets when needed.</span></div><ol class="routine-exercises">${day.exercises.map((m,i)=>`<li><span class="routine-exercise-number">${String(i+1).padStart(2,'0')}</span><div><h5><button type="button" class="routine-demo" data-demo="${m.id}" data-name="${escape(m.name)}">${escape(m.name)} <span>View demonstration ↗</span></button></h5><p>${m.sets} sets × ${escape(m.reps)} <span>·</span> ${m.rest} sec rest</p><small>${escape(m.area)} · ${escape(names[m.equipment]||m.equipment)}${m.unilateral?' · both sides':''}</small></div></li>`).join('')}</ol><div class="routine-warmup"><strong>Finish · 2 min</strong><span>Wind down with easy movement. Estimated times include transitions and prescribed rest; setup and additional rest may take longer.</span></div>`;output.querySelectorAll('[data-routine-day]').forEach(b=>{const selected=Number(b.dataset.routineDay)===currentDay;b.setAttribute('aria-selected',selected);b.tabIndex=selected?0:-1;});}
function renderPlan(){output.innerHTML=`<div class="routine-plan-heading"><div><p class="eyebrow">YOUR WEEKLY BLUEPRINT</p><h3>${escape(names[current.profile.goal])}</h3><p>${current.profile.days} days · ${escape(names[current.profile.equipment])} · ${escape(names[current.profile.experience])}</p></div><span class="routine-save-label">${saved&&saved.variant===variant&&JSON.stringify(saved.profile)===JSON.stringify(current.profile)?'Saved on this device':'Unsaved plan'}</span></div><div class="routine-day-tabs" role="tablist" aria-label="Training day">${current.days.map((d,i)=>`<button id="routineTab${i}" type="button" role="tab" aria-controls="routineDayPanel" aria-selected="${i===currentDay}" data-routine-day="${i}"><span>${escape(d.weekday)}</span>${escape(d.title)}</button>`).join('')}</div><div id="routineDayPanel" role="tabpanel"></div><div class="routine-plan-actions"><button type="button" class="primary" data-save-routine>Save routine & add to calendar</button><button type="button" class="secondary" data-export-routine>Export plan ↓</button><button type="button" class="text-button" data-regenerate-routine>Try another arrangement ↻</button></div>${current.warnings.length?`<div class="routine-limitations"><h4>Plan notes</h4><ul>${current.warnings.map(w=>`<li>${escape(w)}</li>`).join('')}</ul></div>`:''}<div class="routine-guidance"><details><summary>Why this plan fits</summary><p>${escape(current.rationale)}</p></details><details><summary>How to progress</summary><p>${escape(current.progression)}</p></details><details><summary>Recovery & scheduling</summary><p>${escape(current.recovery)}</p></details></div>`;
 output.querySelectorAll('[data-routine-day]').forEach(b=>{b.onclick=()=>{currentDay=Number(b.dataset.routineDay);renderDay();};b.onkeydown=e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();currentDay=e.key==='Home'?0:e.key==='End'?current.days.length-1:(currentDay+(e.key==='ArrowLeft'?-1:1)+current.days.length)%current.days.length;renderDay();output.querySelector('#routineTab'+currentDay).focus();};});
 output.querySelector('[data-save-routine]').onclick=()=>{const record={schema:1,profile:current.profile,variant:current.variant,savedAt:new Date().toISOString()};try{localStorage.setItem(KEY,JSON.stringify(record));saved=record;document.dispatchEvent(new Event('routine:saved'));output.querySelector('.routine-save-label').textContent='Saved on this device';message.textContent='Your routine is saved and its training days are in the calendar. Export a copy for reference.';}catch{message.textContent='This browser could not save the routine. Export a copy to keep it.';}};
 output.querySelector('[data-export-routine]').onclick=()=>{const blob=new Blob([JSON.stringify({app:'Form & Fuel',exportedAt:new Date().toISOString(),...current},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='form-and-fuel-routine.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000);message.textContent='Your routine has been exported.';};
 output.querySelector('[data-regenerate-routine]').onclick=()=>{const result=generate(current.profile,++variant);if(result.ok){current=result.plan;currentDay=0;renderPlan();message.textContent='Another equipment-matched arrangement is ready. Save it if you want to keep this version.';}};
 renderDay();
}
form.onsubmit=e=>{e.preventDefault();if(!form.reportValidity())return;const result=generate(readForm(),0);if(!result.ok){message.textContent=result.errors.join(' ');message.setAttribute('role','alert');return;}variant=0;current=result.plan;currentDay=0;message.setAttribute('role','status');message.textContent='Your starting routine is ready. Review its plan notes, then save it for reference.';renderPlan();};
if(current)renderPlan();if(storageMessage)message.textContent=storageMessage;
})();
