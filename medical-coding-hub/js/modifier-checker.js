// CPT modifier reference (educational — verify with payer policies before billing)
var MODIFIERS = [
  {mod:'25',name:'Significant, separately identifiable E/M',use:'E/M on the same day as a procedure, when the E/M is above and beyond the procedure itself. Document medical necessity separately.',example:'99213-25 with 20610 (joint injection) when the visit addressed a distinct problem.'},
  {mod:'59',name:'Distinct procedural service',use:'Two procedures that would normally bundle, performed at different sites, sessions, or encounters. Use XU/XS/XP/XE subsets when payer requires.',example:'97140-59 with 97110 on a different body region in the same session.'},
  {mod:'24',name:'Unrelated E/M during post-op period',use:'E/M service during a surgical global period that is unrelated to the original surgery.',example:'99213-24 during a 90-day global period for an unrelated URI.'},
  {mod:'57',name:'Decision for surgery',use:'E/M on the day before or day of a major surgery where the decision to operate was made.',example:'99244-57 when the surgeon decides on the day of evaluation that major surgery is needed.'},
  {mod:'50',name:'Bilateral procedure',use:'Same procedure performed on both sides of a paired organ/structure in the same session. Bill once with -50 (payers often pay 150%).',example:'20610-50 for bilateral knee injections.'},
  {mod:'LT / RT',name:'Left side / Right side',use:'Identifies which side of a paired structure. Required by many payers instead of -50 when only one side is treated.',example:'20610-RT for right knee injection only.'},
  {mod:'26',name:'Professional component',use:'Physician interpretation only (no equipment). Pairs with -TC.',example:'71046-26 for the radiologist read of a chest X-ray.'},
  {mod:'TC',name:'Technical component',use:'Equipment/facility portion only (no interpretation).',example:'71046-TC billed by the imaging facility.'},
  {mod:'51',name:'Multiple procedures',use:'Second and subsequent procedures in the same session. Many payers auto-reduce; check if -51 is required or exempt.',example:'12001-51 with 10060.'},
  {mod:'76',name:'Repeat procedure, same physician',use:'Same procedure repeated on the same day by the same physician.',example:'81002-76 for a second urinalysis the same day.'},
  {mod:'77',name:'Repeat procedure, different physician',use:'Same procedure repeated on the same day by a different physician.',example:'81002-77 read by a different provider.'},
  {mod:'91',name:'Repeat lab test',use:'Repeat clinical diagnostic lab test on the same day to obtain subsequent results.',example:'80053-91 for repeat metabolic panel.'},
  {mod:'95',name:'Synchronous telemedicine',use:'Real-time audio-video telehealth service. Append to the CPT code for the service delivered.',example:'99213-95 with place of service 02 or 10.'},
  {mod:'GT',name:'Via interactive audio/video telehealth',use:'Older telehealth modifier; some payers still require GT instead of 95.',example:'Check payer preference between 95 and GT.'},
  {mod:'33',name:'Preventive service',use:'Evidence-based preventive service (ACA) — cost-sharing waived.',example:'45378-33 for screening colonoscopy.'},
  {mod:'PT',name:'Screening turned diagnostic',use:'Colorectal screening that became diagnostic/therapeutic during the encounter.',example:'45378-PT when a polyp is removed during screening.'},
  {mod:'GA',name:'Waiver of liability on file',use:'ABN signed; service expected to be denied as not reasonable/necessary.',example:'G0438-GA when patient signed ABN for non-covered wellness add-on.'},
  {mod:'GY',name:'Non-covered service',use:'Item statutorily excluded from Medicare — no ABN needed.',example:'Routine foot care billed with GY.'},
  {mod:'QW',name:'CLIA-waived test',use:'Lab test performed in a CLIA-waived facility.',example:'81002-QW for waived urinalysis.'},
  {mod:'XU',name:'Unusual non-overlapping service',use:'Subset of -59: service does not overlap usual components of the main service.',example:'Used instead of 59 where payers require X-modifiers.'},
  {mod:'XS',name:'Separate structure',use:'Subset of -59: distinct anatomic structure.',example:'XS on the second of two same-day procedures at different sites.'},
  {mod:'XP',name:'Separate practitioner',use:'Subset of -59: different practitioner.',example:'XP when two providers perform bundled services same day.'},
  {mod:'XE',name:'Separate encounter',use:'Subset of -59: different patient encounter same day.',example:'XE for AM and PM visits.'}
];

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function renderModifiers(list){
  var box = document.getElementById('modResults');
  if(!list.length){ box.innerHTML='<p>No modifiers match. Try "telehealth", "bilateral", "repeat".</p>'; return; }
  var html='';
  list.forEach(function(m){
    html += '<div class="code-row"><span class="code-num">'+esc(m.mod)+'</span><strong>'+esc(m.name)+'</strong><br><span class="sub">When to use:</span> '+esc(m.use)+'<br><span class="sub">Example:</span> '+esc(m.example)+'</div>';
  });
  box.innerHTML = html;
}

function runModSearch(){
  var q = document.getElementById('mq').value.trim().toLowerCase();
  if(!q){ renderModifiers(MODIFIERS); return; }
  var hits = MODIFIERS.filter(function(m){
    return m.mod.toLowerCase().indexOf(q)>-1 || m.name.toLowerCase().indexOf(q)>-1 || m.use.toLowerCase().indexOf(q)>-1;
  });
  renderModifiers(hits);
}

document.addEventListener('DOMContentLoaded', function(){
  var mq = document.getElementById('mq');
  if(mq){ mq.addEventListener('input', runModSearch); renderModifiers(MODIFIERS); }
});
