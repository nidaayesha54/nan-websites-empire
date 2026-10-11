/* NurseResumeHub — resume builder logic */
(function(){
  "use strict";
  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function val(id){var el=document.getElementById(id);return el?el.value.trim():"";}

  /* ---- dynamic experience entries ---- */
  var expWrap=document.getElementById('exp-list');
  var expCount=0;
  function addExp(){
    expCount++;
    var d=document.createElement('div');
    d.className='exp-block';
    d.style.cssText='border:1px solid var(--line);border-radius:8px;padding:14px;margin-bottom:12px;background:var(--bg)';
    d.innerHTML=
      '<div class="form-grid">'+
      '<div><label>Job title</label><input type="text" class="e-title" placeholder="Registered Nurse — ICU"></div>'+
      '<div><label>Facility</label><input type="text" class="e-facility" placeholder="City General Hospital"></div>'+
      '<div><label>Location</label><input type="text" class="e-location" placeholder="Austin, TX"></div>'+
      '<div><label>Dates</label><input type="text" class="e-dates" placeholder="Jun 2021 – Present"></div>'+
      '<div class="full"><label>Achievements (one per line — start each with a strong verb)</label><textarea class="e-bullets" placeholder="Managed 4:1 patient ratios in a 24-bed surgical ICU&#10;Reduced CLABSI rates by 30% via line-care audits&#10;Precepted 6 new graduate nurses"></textarea></div>'+
      '</div><button type="button" class="btn remove-exp" style="background:#b91c1c;color:#fff">Remove</button>';
    d.querySelector('.remove-exp').addEventListener('click',function(){d.remove();});
    expWrap.appendChild(d);
  }
  document.getElementById('add-exp').addEventListener('click',addExp);
  addExp();

  function collectExp(){
    var out=[];
    var blocks=expWrap.querySelectorAll('.exp-block');
    for(var i=0;i<blocks.length;i++){
      var b=blocks[i];
      var t=b.querySelector('.e-title').value.trim();
      var f=b.querySelector('.e-facility').value.trim();
      if(!t&&!f)continue;
      var bullets=b.querySelector('.e-bullets').value.split('\n').map(function(s){return s.trim();}).filter(Boolean);
      out.push({title:t,facility:f,location:b.querySelector('.e-location').value.trim(),dates:b.querySelector('.e-dates').value.trim(),bullets:bullets});
    }
    return out;
  }

  function bulletList(items){
    if(!items.length)return '';
    return '<ul>'+items.map(function(b){
      var t=esc(b); if(!/[.!?]$/.test(t))t+='.';
      return '<li>'+t+'</li>';
    }).join('')+'</ul>';
  }

  function buildResume(){
    var name=val('f-name'),cred=val('f-cred'),email=val('f-email'),phone=val('f-phone'),
        city=val('f-city'),summary=val('f-summary'),edu=val('f-edu'),certs=val('f-certs'),skills=val('f-skills');
    var exps=collectExp();
    var h='<div class="resume-doc">';
    h+='<div class="r-head"><h2>'+esc(name||'Your Name')+(cred?' <span style="font-size:16px">'+esc(cred)+'</span>':'')+'</h2>';
    var contact=[email,phone,city].filter(Boolean).map(esc).join(' &nbsp;|&nbsp; ');
    if(contact)h+='<div class="r-contact">'+contact+'</div>';
    h+='</div>';
    if(summary)h+='<div class="r-sec"><h3>Professional Summary</h3><p style="margin:0">'+esc(summary)+'</p></div>';
    if(exps.length){
      h+='<div class="r-sec"><h3>Professional Experience</h3>';
      exps.forEach(function(e){
        h+='<div class="r-job"><div class="r-jobhead">'+(e.dates?'<span class="r-dates">'+esc(e.dates)+'</span>':'')+esc(e.title)+'</div>';
        h+='<div><span>'+esc(e.facility)+'</span>'+(e.location?', '+esc(e.location):'')+'</div><div class="clear"></div>';
        h+=bulletList(e.bullets)+'</div>';
      });
      h+='</div>';
    }
    if(edu)h+='<div class="r-sec"><h3>Education</h3><p style="margin:0">'+esc(edu).replace(/\n/g,'<br>')+'</p></div>';
    if(certs)h+='<div class="r-sec"><h3>Licenses &amp; Certifications</h3><p style="margin:0">'+esc(certs).replace(/\n/g,'<br>')+'</p></div>';
    if(skills)h+='<div class="r-sec"><h3>Clinical Skills</h3><p style="margin:0">'+esc(skills)+'</p></div>';
    h+='</div>';
    return h;
  }

  function buildPlain(){
    var L=[];
    var line=function(s){L.push(s||'');};
    line((val('f-name')+' '+val('f-cred')).trim().toUpperCase());
    line([val('f-email'),val('f-phone'),val('f-city')].filter(Boolean).join(' | '));
    line();
    if(val('f-summary')){line('PROFESSIONAL SUMMARY');line(val('f-summary'));line();}
    var exps=collectExp();
    if(exps.length){line('PROFESSIONAL EXPERIENCE');exps.forEach(function(e){
      line(e.title+' — '+e.facility+(e.location?', '+e.location:'')+(e.dates?' ('+e.dates+')':''));
      e.bullets.forEach(function(b){line('  • '+b);});
      line();
    });}
    if(val('f-edu')){line('EDUCATION');line(val('f-edu'));line();}
    if(val('f-certs')){line('LICENSES & CERTIFICATIONS');line(val('f-certs'));line();}
    if(val('f-skills')){line('CLINICAL SKILLS');line(val('f-skills'));}
    return L.join('\n');
  }

  document.getElementById('generate').addEventListener('click',function(){
    var prev=document.getElementById('resume-preview');
    prev.innerHTML=buildResume();
    prev.style.display='block';
    document.getElementById('result-actions').style.display='flex';
    prev.scrollIntoView({behavior:'smooth'});
    try{localStorage.setItem('nrh-resume',JSON.stringify({html:buildPlain()}));}catch(e){}
  });

  document.getElementById('print-btn').addEventListener('click',function(){window.print();});

  document.getElementById('copy-btn').addEventListener('click',function(){
    var t=buildPlain();
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(function(){alert('Resume copied as plain text — paste it into Word or Google Docs.');});
    }else{
      var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();
      try{document.execCommand('copy');alert('Resume copied as plain text.');}catch(e){alert('Copy failed — select the text manually.');}
      document.body.removeChild(ta);
    }
  });

  document.getElementById('sample-btn').addEventListener('click',function(){
    document.getElementById('f-name').value='Maria Delgado';
    document.getElementById('f-cred').value='RN, BSN';
    document.getElementById('f-email').value='maria.delgado.rn@email.com';
    document.getElementById('f-phone').value='(512) 555-0147';
    document.getElementById('f-city').value='Austin, TX';
    document.getElementById('f-summary').value='Compassionate ICU Registered Nurse with 5 years of experience in a 24-bed surgical intensive care unit. Proven record of reducing hospital-acquired infections, mentoring new graduates, and delivering evidence-based, patient-centered care to critically ill adults.';
    document.getElementById('f-edu').value='Bachelor of Science in Nursing (BSN) — University of Texas at Austin, 2020';
    document.getElementById('f-certs').value='Registered Nurse License — Texas Board of Nursing, #987654\nBLS, ACLS, CCRN (Adult)';
    document.getElementById('f-skills').value='Ventilator management, hemodynamic monitoring, central line care, arterial lines, vasoactive drips, CRRT, Epic EHR, rapid response leadership';
    while(expWrap.firstChild)expWrap.removeChild(expWrap.firstChild);
    addExp();
    var b=expWrap.querySelector('.exp-block');
    b.querySelector('.e-title').value='Registered Nurse — Surgical ICU';
    b.querySelector('.e-facility').value='City General Hospital';
    b.querySelector('.e-location').value='Austin, TX';
    b.querySelector('.e-dates').value='Jun 2021 – Present';
    b.querySelector('.e-bullets').value='Managed 4:1 patient ratios in a 24-bed surgical ICU with 98% patient satisfaction scores\nLed central-line care audits that reduced CLABSI rates by 30% over 12 months\nPrecepted and mentored 6 new graduate nurses through unit orientation\nServed as charge nurse for night shift, coordinating admissions and staffing for 12 RNs';
    addExp();
    var b2=expWrap.querySelectorAll('.exp-block')[1];
    b2.querySelector('.e-title').value='Registered Nurse — Medical-Surgical Unit';
    b2.querySelector('.e-facility').value='Riverside Medical Center';
    b2.querySelector('.e-location').value='Austin, TX';
    b2.querySelector('.e-dates').value='Jul 2020 – May 2021';
    b2.querySelector('.e-bullets').value='Delivered direct care to 5–6 patients per shift on a 32-bed telemetry unit\nRecognized with DAISY nomination for exceptional bedside manner and family communication\nMaintained 100% compliance with hourly rounding and fall-prevention protocols';
    alert('Sample RN resume loaded — click "Generate my resume" to see it.');
  });
})();
