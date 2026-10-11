/* NurseResumeHub — cover letter generator */
(function(){
  "use strict";
  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function val(id){var el=document.getElementById(id);return el?el.value.trim():"";}
  function cap(s){return s? s.charAt(0).toUpperCase()+s.slice(1):s;}

  function buildLetter(){
    var name=val('c-name')||'[Your Name]',
        city=val('c-city')||'[City, ST]',
        email=val('c-email')||'[email]',
        phone=val('c-phone')||'[phone]',
        date=new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}),
        mgr=val('c-manager'),
        role=val('c-role')||'[Position Title]',
        facility=val('c-facility')||'[Facility Name]',
        years=val('c-years'),specialty=val('c-specialty')||'nursing',
        ach=val('c-achievements'),why=val('c-why');

    var salutation=mgr?('Dear '+mgr+','):('Dear Hiring Manager,');
    var isNewGrad=(years===''||parseInt(years,10)===0);

    var p1=isNewGrad
      ? 'As a recent nursing graduate'+(val('c-school')?(' from '+val('c-school')):'')+' with strong clinical preparation in '+specialty+', I am excited to apply for the '+role+' position at '+facility+'. My clinical rotations and capstone experience have prepared me to deliver safe, compassionate, patient-centered care from day one.'
      : 'With '+years+' years of experience as a '+specialty+' nurse, I am excited to apply for the '+role+' position at '+facility+'. My background in high-acuity, team-based care has prepared me to contribute immediately to your unit\'s clinical excellence and patient outcomes.';

    var p2;
    if(ach){
      var items=ach.split('\n').map(function(s){return s.trim();}).filter(Boolean);
      p2='Highlights from my clinical background include:\n'+items.map(function(i){return '• '+i;}).join('\n');
    }else{
      p2=isNewGrad
        ? 'During my clinical rotations I earned strong preceptor evaluations for assessment accuracy, therapeutic communication, and calm performance under pressure. I completed rotations across medical-surgical, obstetric, pediatric, and critical care settings, giving me a well-rounded foundation for practice.'
        : 'I consistently receive strong evaluations for clinical judgment, communication with patients and families, and collaboration with interdisciplinary teams. I am known for staying calm under pressure, mentoring junior staff, and advocating fiercely for my patients\' safety and dignity.';
    }

    var p3=why
      ? 'What draws me to '+facility+' specifically: '+why+' I would be proud to bring my skills and compassion to your team.'
      : 'What draws me to '+facility+' is your reputation for clinical excellence and a culture that truly supports both patients and nurses. I would be proud to bring my skills, work ethic, and compassion to your team.';

    var letter=name+'\n'+city+' | '+email+' | '+phone+'\n\n'+date+'\n\n'+salutation+'\n\n'+p1+'\n\n'+p2+'\n\n'+p3+'\n\nThank you for your time and consideration. I would welcome the opportunity to discuss how my background aligns with your needs and am available for an interview at your convenience.\n\nSincerely,\n'+name;
    return letter;
  }

  document.getElementById('gen-letter').addEventListener('click',function(){
    var out=document.getElementById('letter-output');
    out.textContent=buildLetter();
    out.style.display='block';
    document.getElementById('letter-actions').style.display='flex';
    out.scrollIntoView({behavior:'smooth'});
  });
  document.getElementById('letter-print').addEventListener('click',function(){window.print();});
  document.getElementById('letter-copy').addEventListener('click',function(){
    var t=buildLetter();
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(function(){alert('Cover letter copied — paste it into Word, Google Docs, or your application.');});
    }else{
      var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();
      try{document.execCommand('copy');alert('Cover letter copied.');}catch(e){alert('Copy failed — select the text manually.');}
      document.body.removeChild(ta);
    }
  });
  document.getElementById('letter-sample').addEventListener('click',function(){
    document.getElementById('c-name').value='Maria Delgado, RN, BSN';
    document.getElementById('c-city').value='Austin, TX';
    document.getElementById('c-email').value='maria.delgado.rn@email.com';
    document.getElementById('c-phone').value='(512) 555-0147';
    document.getElementById('c-role').value='Registered Nurse — Intensive Care Unit (Night Shift)';
    document.getElementById('c-facility').value='St. David\'s Medical Center';
    document.getElementById('c-years').value='5';
    document.getElementById('c-specialty').value='critical care';
    document.getElementById('c-achievements').value='Reduced CLABSI rates by 30% through central-line care audits\nPrecepted 6 new graduate nurses; charge nurse for night shift\nCCRN certified with 98% patient satisfaction scores';
    document.getElementById('c-why').value='your Magnet-recognized ICU and your unit\'s nurse-led quality improvement culture.';
    alert('Sample data loaded — click "Generate my cover letter" to see it.');
  });
})();
