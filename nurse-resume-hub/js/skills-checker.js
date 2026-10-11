/* NurseResumeHub — skills checker */
(function(){
  "use strict";
  var DATA={
    "Medical-Surgical":["Head-to-toe assessment","Medication administration (PO, IV, IM, SQ)","IV insertion & maintenance","Wound care & dressing changes","Foley catheter insertion & care","NG tube insertion & management","Blood transfusion administration","Telemetry monitoring","Pain management","Discharge planning & patient education","Fall prevention protocols","SBAR handoff communication"],
    "ICU / Critical Care":["Hemodynamic monitoring (arterial lines, CVP)","Ventilator management & weaning","Vasoactive & titratable drips","Central line & PICC care","CRRT / dialysis basics","Sedation & delirium management (RASS, CAM-ICU)","Code blue / rapid response leadership","Post-operative critical care","ABG interpretation","Sepsis bundle compliance","Intra-aortic balloon pump (IABP) awareness","Family conferences & goals-of-care discussions"],
    "Emergency Department":["Triage (ESI levels)","Primary & secondary trauma survey","IV/IO access under pressure","EKG acquisition & rhythm interpretation","Stroke & STEMI protocol activation","Conscious sedation monitoring","Wound closure assistance & splinting","De-escalation & crisis intervention","Mass casualty triage basics","Pediatric emergency assessment","Behavioral health holds & safety","Rapid, accurate documentation"],
    "Labor & Delivery":["Fetal monitoring strip interpretation","Labor support & coaching","Vaginal delivery assistance","C-section circulating & recovery","Postpartum hemorrhage management","Neonatal resuscitation (NRP)","Epidural monitoring & management","OB triage assessment","Breastfeeding support & education","Preterm labor management","Magnesium sulfate administration","Bereavement & loss support"],
    "Pediatrics":["Pediatric assessment (age-appropriate)","Weight-based medication dosing","Pediatric IV insertion","Family-centered care","Developmental milestone awareness","Pediatric pain scales (FLACC, Wong-Baker)","Asthma & croup management","Pediatric code / PALS","Child life collaboration","Immunization administration","Adolescent communication","Parent education & discharge teaching"],
    "Oncology":["Chemotherapy administration & safety (ONS)","Central line & port management","Neutropenic precautions","Oncologic emergency recognition","Pain & symptom management","Palliative care principles","Blood product administration","Patient & family counseling","Clinical trial basics","Radiation safety awareness","End-of-life care","Survivorship education"],
    "Operating Room / Perioperative":["Sterile technique & surgical counts","Patient positioning & safety","Pre-op assessment & verification","Anesthesia monitoring assistance","Specimen handling & labeling","Time-out protocol leadership","Post-anesthesia (PACU) recovery","Surgical site infection prevention","Instrument & equipment knowledge","Emergency intra-op response","Documentation of intra-op events","Patient advocacy under anesthesia"],
    "Home Health":["Independent clinical assessment","Wound care in home settings","Medication reconciliation","Chronic disease management teaching","OASIS documentation","Fall & home safety assessment","Caregiver training & support","Telehealth visit skills","Hospice & palliative basics","Time management across caseload","Community resource referrals","Infection control in the home"],
    "Psychiatric / Behavioral Health":["Therapeutic communication","De-escalation techniques","Suicide risk assessment","Mental status examination","Crisis intervention","Group facilitation basics","Psychotropic medication knowledge","Trauma-informed care","Seclusion & restraint protocols","Dual diagnosis awareness","Safety planning","Milieu management"],
    "New Grad / General":["Head-to-toe physical assessment","Vital signs & early warning scores","Medication rights & safe administration","SBAR communication","Infection control & hand hygiene","Basic wound care","IV therapy fundamentals","Patient & family education","Accurate, timely documentation (EHR)","Time management & prioritization","Cultural competence","Self-care & resilience practices"]
  };

  var sel=document.getElementById('spec-select');
  var listWrap=document.getElementById('skills-list');
  var countEl=document.getElementById('skill-count');
  var fillEl=document.getElementById('skill-fill');

  Object.keys(DATA).forEach(function(k){
    var o=document.createElement('option');o.value=k;o.textContent=k;sel.appendChild(o);
  });

  function render(){
    var spec=sel.value;
    listWrap.innerHTML='';
    var group=document.createElement('div');
    group.className='skill-group';
    var h=document.createElement('h3');h.textContent='Must-have '+spec+' skills';group.appendChild(h);
    var ul=document.createElement('ul');ul.className='skill-list';
    DATA[spec].forEach(function(skill){
      var li=document.createElement('li');
      var lab=document.createElement('label');
      var cb=document.createElement('input');cb.type='checkbox';cb.value=skill;
      cb.addEventListener('change',update);
      lab.appendChild(cb);
      lab.appendChild(document.createTextNode(skill));
      li.appendChild(lab);ul.appendChild(li);
    });
    group.appendChild(ul);listWrap.appendChild(group);
    update();
  }

  function update(){
    var boxes=listWrap.querySelectorAll('input[type=checkbox]');
    var checked=listWrap.querySelectorAll('input[type=checkbox]:checked');
    var pct=boxes.length?Math.round(checked.length/boxes.length*100):0;
    fillEl.style.width=pct+'%';
    countEl.textContent=checked.length+' of '+boxes.length+' skills checked ('+pct+'%)';
  }

  sel.addEventListener('change',render);
  render();

  document.getElementById('copy-skills').addEventListener('click',function(){
    var checked=listWrap.querySelectorAll('input[type=checkbox]:checked');
    if(!checked.length){alert('Check some skills first, then copy them.');return;}
    var t=Array.prototype.map.call(checked,function(c){return c.value;}).join(', ');
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(function(){alert('Skills copied — paste them into your resume Skills section.');});
    }else{alert('Your checked skills:\n\n'+t);}
  });
  document.getElementById('print-skills').addEventListener('click',function(){window.print();});
})();
