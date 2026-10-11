// Medical code reference database (educational sample — verify with AMA CPT / CMS ICD-10 before billing)
var CODES = [
  // ---- CPT: Evaluation & Management ----
  {code:'99202',type:'CPT',desc:'Office/outpatient visit, new patient, straightforward (15-29 min)'},
  {code:'99203',type:'CPT',desc:'Office/outpatient visit, new patient, low complexity (30-44 min)'},
  {code:'99204',type:'CPT',desc:'Office/outpatient visit, new patient, moderate complexity (45-59 min)'},
  {code:'99205',type:'CPT',desc:'Office/outpatient visit, new patient, high complexity (60-74 min)'},
  {code:'99212',type:'CPT',desc:'Office/outpatient visit, established patient, straightforward (10-19 min)'},
  {code:'99213',type:'CPT',desc:'Office/outpatient visit, established patient, low complexity (20-29 min)'},
  {code:'99214',type:'CPT',desc:'Office/outpatient visit, established patient, moderate complexity (30-39 min)'},
  {code:'99215',type:'CPT',desc:'Office/outpatient visit, established patient, high complexity (40-54 min)'},
  {code:'99281',type:'CPT',desc:'Emergency department visit, straightforward'},
  {code:'99282',type:'CPT',desc:'Emergency department visit, low complexity'},
  {code:'99283',type:'CPT',desc:'Emergency department visit, moderate complexity'},
  {code:'99284',type:'CPT',desc:'Emergency department visit, high complexity'},
  {code:'99285',type:'CPT',desc:'Emergency department visit, high complexity with threat to function'},
  {code:'99291',type:'CPT',desc:'Critical care, first 30-74 minutes'},
  {code:'99381',type:'CPT',desc:'Preventive visit, new patient, infant (<1 yr)'},
  {code:'99386',type:'CPT',desc:'Preventive visit, new patient, 40-64 years'},
  {code:'99396',type:'CPT',desc:'Preventive visit, established patient, 40-64 years'},
  {code:'99397',type:'CPT',desc:'Preventive visit, established patient, 65+ years'},
  // ---- CPT: Surgery / procedures ----
  {code:'10060',type:'CPT',desc:'Incision and drainage of abscess (simple)'},
  {code:'11042',type:'CPT',desc:'Debridement, subcutaneous tissue (first 20 sq cm)'},
  {code:'12001',type:'CPT',desc:'Simple wound repair, scalp/neck/hands/feet/trunk, 2.5 cm or less'},
  {code:'12002',type:'CPT',desc:'Simple wound repair, 2.6-7.5 cm'},
  {code:'20550',type:'CPT',desc:'Injection, tendon sheath or ligament'},
  {code:'20610',type:'CPT',desc:'Arthrocentesis/aspiration and/or injection, major joint (knee, hip, shoulder)'},
  {code:'20600',type:'CPT',desc:'Arthrocentesis/aspiration and/or injection, small joint (fingers, toes)'},
  {code:'11750',type:'CPT',desc:'Excision of nail and nail matrix, partial or complete'},
  {code:'17110',type:'CPT',desc:'Destruction of benign lesions, up to 14 (e.g. warts)'},
  // ---- CPT: Lab ----
  {code:'36415',type:'CPT',desc:'Venipuncture (routine blood draw)'},
  {code:'80053',type:'CPT',desc:'Comprehensive metabolic panel'},
  {code:'80061',type:'CPT',desc:'Lipid panel'},
  {code:'85025',type:'CPT',desc:'Complete blood count (CBC) with differential'},
  {code:'80048',type:'CPT',desc:'Basic metabolic panel (Chem 8)'},
  {code:'81002',type:'CPT',desc:'Urinalysis, non-automated, without microscopy'},
  {code:'81003',type:'CPT',desc:'Urinalysis, automated, without microscopy'},
  {code:'87491',type:'CPT',desc:'Chlamydia test, amplified probe'},
  {code:'87624',type:'CPT',desc:'HPV high-risk test'},
  {code:'80076',type:'CPT',desc:'Hepatic function panel'},
  {code:'84443',type:'CPT',desc:'TSH (thyroid stimulating hormone)'},
  {code:'80069',type:'CPT',desc:'Renal function panel'},
  // ---- CPT: Radiology ----
  {code:'71046',type:'CPT',desc:'Chest X-ray, 2 views'},
  {code:'73030',type:'CPT',desc:'X-ray, shoulder, minimum 2 views'},
  {code:'73130',type:'CPT',desc:'X-ray, hand, minimum 3 views'},
  {code:'73562',type:'CPT',desc:'X-ray, knee, 3 views'},
  {code:'73721',type:'CPT',desc:'MRI, lower extremity joint (e.g. knee), without contrast'},
  {code:'74177',type:'CPT',desc:'CT, abdomen and pelvis, with contrast'},
  {code:'76700',type:'CPT',desc:'Ultrasound, abdomen, complete'},
  {code:'76856',type:'CPT',desc:'Ultrasound, pelvis, complete'},
  {code:'77067',type:'CPT',desc:'Screening mammography, bilateral (2-view each breast)'},
  {code:'72148',type:'CPT',desc:'MRI, lumbar spine, without contrast'},
  // ---- CPT: Medicine ----
  {code:'93000',type:'CPT',desc:'ECG, with interpretation and report'},
  {code:'94010',type:'CPT',desc:'Spirometry, including graphic record'},
  {code:'90471',type:'CPT',desc:'Immunization administration, first vaccine'},
  {code:'90472',type:'CPT',desc:'Immunization administration, each additional vaccine'},
  {code:'96372',type:'CPT',desc:'Therapeutic injection, subcutaneous or intramuscular'},
  {code:'96365',type:'CPT',desc:'IV infusion, first hour'},
  {code:'90715',type:'CPT',desc:'Tdap vaccine'},
  {code:'90686',type:'CPT',desc:'Influenza vaccine, quadrivalent'},
  {code:'90791',type:'CPT',desc:'Psychiatric diagnostic evaluation'},
  {code:'90837',type:'CPT',desc:'Psychotherapy, 60 minutes'},
  {code:'90834',type:'CPT',desc:'Psychotherapy, 45 minutes'},
  {code:'94640',type:'CPT',desc:'Nebulizer treatment (inhalation)'},
  {code:'97110',type:'CPT',desc:'Therapeutic exercises (physical therapy, per 15 min)'},
  {code:'97140',type:'CPT',desc:'Manual therapy (per 15 min)'},
  {code:'97530',type:'CPT',desc:'Therapeutic activities (per 15 min)'},
  // ---- HCPCS ----
  {code:'G0438',type:'HCPCS',desc:'Annual wellness visit, initial (Medicare)'},
  {code:'G0439',type:'HCPCS',desc:'Annual wellness visit, subsequent (Medicare)'},
  {code:'J3301',type:'HCPCS',desc:'Injection, triamcinolone acetonide (Kenalog), per 10 mg'},
  {code:'A0429',type:'HCPCS',desc:'Ambulance, basic life support, emergency transport'},
  // ---- ICD-10: common diagnoses ----
  {code:'I10',type:'ICD-10',desc:'Essential (primary) hypertension'},
  {code:'E11.9',type:'ICD-10',desc:'Type 2 diabetes mellitus without complications'},
  {code:'E78.5',type:'ICD-10',desc:'Hyperlipidemia, unspecified'},
  {code:'J06.9',type:'ICD-10',desc:'Acute upper respiratory infection, unspecified'},
  {code:'J02.9',type:'ICD-10',desc:'Acute pharyngitis, unspecified'},
  {code:'J00',type:'ICD-10',desc:'Acute nasopharyngitis (common cold)'},
  {code:'J01.90',type:'ICD-10',desc:'Acute sinusitis, unspecified'},
  {code:'J20.9',type:'ICD-10',desc:'Acute bronchitis, unspecified'},
  {code:'J45.909',type:'ICD-10',desc:'Asthma, uncomplicated'},
  {code:'J44.9',type:'ICD-10',desc:'COPD, unspecified'},
  {code:'F32.9',type:'ICD-10',desc:'Major depressive disorder, single episode, unspecified'},
  {code:'F41.1',type:'ICD-10',desc:'Generalized anxiety disorder'},
  {code:'G43.909',type:'ICD-10',desc:'Migraine, unspecified, not intractable'},
  {code:'M54.5',type:'ICD-10',desc:'Low back pain'},
  {code:'M25.561',type:'ICD-10',desc:'Pain in right knee'},
  {code:'M25.562',type:'ICD-10',desc:'Pain in left knee'},
  {code:'M25.511',type:'ICD-10',desc:'Pain in right shoulder'},
  {code:'R51',type:'ICD-10',desc:'Headache'},
  {code:'R10.9',type:'ICD-10',desc:'Abdominal pain, unspecified'},
  {code:'R07.9',type:'ICD-10',desc:'Chest pain, unspecified'},
  {code:'R50.9',type:'ICD-10',desc:'Fever, unspecified'},
  {code:'R05',type:'ICD-10',desc:'Cough'},
  {code:'R06.02',type:'ICD-10',desc:'Shortness of breath'},
  {code:'K21.9',type:'ICD-10',desc:'GERD without esophagitis'},
  {code:'K59.00',type:'ICD-10',desc:'Constipation, unspecified'},
  {code:'N39.0',type:'ICD-10',desc:'Urinary tract infection, site not specified'},
  {code:'L30.9',type:'ICD-10',desc:'Dermatitis, unspecified'},
  {code:'H10.9',type:'ICD-10',desc:'Conjunctivitis, unspecified'},
  {code:'Z00.00',type:'ICD-10',desc:'General adult medical exam without abnormal findings'},
  {code:'Z12.31',type:'ICD-10',desc:'Encounter for screening mammogram'},
  {code:'Z13.1',type:'ICD-10',desc:'Encounter for screening for diabetes mellitus'},
  {code:'Z23',type:'ICD-10',desc:'Encounter for immunization'},
  {code:'Z01.00',type:'ICD-10',desc:'Eye exam without abnormal findings'},
  {code:'Z30.09',type:'ICD-10',desc:'Encounter for other contraceptive management'},
  {code:'S83.241A',type:'ICD-10',desc:'Sprain of medial collateral ligament, right knee, initial encounter'},
  {code:'M19.90',type:'ICD-10',desc:'Osteoarthritis, unspecified site'},
  {code:'E03.9',type:'ICD-10',desc:'Hypothyroidism, unspecified'}
];

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function runLookup(){
  var q = document.getElementById('q').value.trim().toLowerCase();
  var typeFilter = document.getElementById('typeFilter').value;
  var box = document.getElementById('results');
  if(!q && typeFilter==='ALL'){ box.innerHTML='<p class="sub">Type a code or keyword (e.g. "99213", "knee", "diabetes") or pick a category.</p>'; return; }
  var hits = CODES.filter(function(c){
    var okType = (typeFilter==='ALL') || (c.type===typeFilter);
    var okQ = !q || c.code.toLowerCase().indexOf(q)>-1 || c.desc.toLowerCase().indexOf(q)>-1;
    return okType && okQ;
  });
  if(!hits.length){ box.innerHTML='<p>No matches. Try a broader keyword (e.g. "visit", "x-ray", "pain").</p>'; return; }
  var html = '<p><strong>'+hits.length+'</strong> result'+(hits.length===1?'':'s')+' found:</p>';
  hits.slice(0,100).forEach(function(c){
    var cls = c.type==='CPT'?'cpt':(c.type==='ICD-10'?'icd':'hcpcs');
    html += '<div class="code-row"><span class="code-num">'+esc(c.code)+'</span><span class="code-type '+cls+'">'+c.type+'</span> '+esc(c.desc)+'</div>';
  });
  if(hits.length>100) html += '<p class="sub">Showing first 100 — refine your search.</p>';
  box.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function(){
  var q = document.getElementById('q');
  if(q){ q.addEventListener('input', runLookup); runLookup(); }
  var tf = document.getElementById('typeFilter');
  if(tf){ tf.addEventListener('change', runLookup); }
});
