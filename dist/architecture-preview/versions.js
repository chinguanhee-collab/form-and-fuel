// Three independent visual compositions; all use the same in-memory preview model.
const design=document.body.dataset.design;
document.querySelector('#designSwitch').addEventListener('change',e=>{location.href=e.target.value+'.html'+location.hash;});
const header=document.querySelector('.app-header');header.querySelector('#account').setAttribute('aria-label','Sample profile');
const context=document.createElement('div');context.className='version-context';context.innerHTML=design==='journal'?'<strong class="context-goal">A stronger everyday.</strong><p>Two gym sessions.<br>Two days on court.<br>Room to recover.</p>':'<strong>Your training plan</strong><p>2 strength sessions<br>2 badminton sessions<br>3 recovery days</p>';
header.insertBefore(context,header.querySelector('.account'));
if(design==='performance'){
  document.querySelector('#todayTitle').textContent='Build strength. Connect the rest.';
  document.querySelector('#today .page-title p').textContent='Monday, 2 November · Strength, fuel and recovery';
}
if(design==='journal'){
  const left=document.createElement('div'),right=document.createElement('div'),workspace=document.createElement('div');left.className='daily-agenda';right.className='agenda-rail';workspace.className='agenda-columns';
  left.append(document.querySelector('.workout-panel'),document.querySelector('.week-panel'));
  right.append(document.querySelector('.fuel-panel'),document.querySelector('.recovery-panel'));
  workspace.append(left,right);document.querySelector('#today .main-pair').replaceWith(workspace);document.querySelector('#today .lower-pair').remove();
}
if(design==='planner'){
  const week=document.querySelector('.week-panel');week.classList.add('planner-week');week.querySelector('h2').textContent='2–8 November';
  const mainPair=document.querySelector('#today .main-pair');mainPair.before(week);
  const summary=document.querySelector('.summary-strip');mainPair.after(summary);summary.classList.add('planner-summary');
  const lower=document.querySelector('#today .lower-pair');lower.classList.add('planner-recovery');lower.append(document.querySelector('.learning-link'));
}
