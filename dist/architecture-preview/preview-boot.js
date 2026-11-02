(async()=>{
  // This separate localhost origin never loads Firebase or account synchronization.
  const scripts=['data.js','nutrition-core.js','profile-core.js','extra-exercises.js','body-map.js','exercise-media.js','exercise-visuals.js','app.js','routines.js','meal-composer.js','motion.js','calendar-core.js','calendar.js','routine-popup.js','wellness-core.js','wellness.js','workout-hub.js','mobile-nav.js','fuel-history.js'];
  try{
    for(const src of scripts) await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.append(s);});
    const art=document.createElement('script');art.type='module';art.src='dumbbell-3d.js';document.body.append(art);
    const account=document.querySelector('#accountButton');account.textContent='Preview account';account.onclick=()=>{document.querySelector('#accountIdentity').textContent='Local design preview';document.querySelector('#accountStatus').textContent='Preview only — account sync is disabled.';document.querySelector('.account-dialog>p:not([id])').textContent='Try the layout and motion. Your live account is separate.';document.querySelector('.account-actions').hidden=true;document.querySelector('#accountDialog').showModal();};
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-revealed');observer.unobserve(e.target);}}),{threshold:.1,rootMargin:'0px 0px -25px 0px'});
    document.querySelectorAll('main>.journey,main .section-heading,main>.knowledge-strip,main .routine-launch,main .my-workout-card,main>.reminder-section').forEach(el=>{el.classList.add('scroll-reveal');observer.observe(el);});
    let pending=false;
    function paint(){pending=false;document.documentElement.style.setProperty('--preview-scroll',reduce.matches?'0px':`${scrollY*.08}px`);}
    addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(paint);}},{passive:true});paint();
  }catch(error){console.error(error);}finally{document.querySelector('#accountBoot').hidden=true;}
})();
