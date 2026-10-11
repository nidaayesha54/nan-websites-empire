/* Credit score simulator — EDUCATIONAL estimate only, not a FICO score.
   Pure math (testable). Weights mirror the well-known FICO factor mix:
   payment history 35%, utilization 30%, length 15%, new credit 10%, mix 10%. */
function scoreBand(s){
  if(s>=800) return 'Exceptional';
  if(s>=740) return 'Very Good';
  if(s>=670) return 'Good';
  if(s>=580) return 'Fair';
  return 'Poor';
}

function estimateScore(ontimePct, utilPct, ageYears, inquiries, mixTypes){
  var pay  = Math.min(1, Math.max(0, ontimePct/100));
  var util = Math.min(1, Math.max(0, 1 - utilPct/100));
  var age  = Math.min(1, Math.max(0, ageYears/15));
  var inq  = Math.min(1, Math.max(0, 1 - inquiries/10));
  var mix  = Math.min(1, Math.max(0, mixTypes/4));
  var w = 0.35*pay + 0.30*util + 0.15*age + 0.10*inq + 0.10*mix;
  var score = Math.round(300 + 550*w);
  return { score:score, band:scoreBand(score),
           factors:{ pay:pay, util:util, age:age, inq:inq, mix:mix } };
}

function scoreTips(ontimePct, utilPct, ageYears, inquiries, mixTypes){
  var tips = [];
  if(ontimePct < 100) tips.push('Payment history is the biggest factor (35%). Even one 30-day late payment can cost 60–110 points — set up autopay for at least the minimum.');
  if(utilPct > 30) tips.push('Your utilization is high. Paying balances below 30% — ideally under 10% — of each limit usually lifts scores within 1–2 billing cycles.');
  else tips.push('Nice — utilization under 30% helps. Keeping it under 10% on each card is even better for your score.');
  if(ageYears < 7) tips.push('A short credit history limits your score. Keep your oldest card open (even unused) to grow your average age of accounts.');
  if(inquiries >= 3) tips.push('Several recent hard inquiries are dragging your score. Avoid new applications for 6–12 months; inquiries stop hurting after about a year.');
  if(mixTypes < 2) tips.push('Adding a second type of credit (e.g., a credit-builder loan alongside cards) can help your credit mix over time — only if you need it.');
  tips.push('Remember: this simulator is educational. Real FICO and VantageScore models use your actual bureau data.');
  return tips;
}

/* ==== DOM wiring ==== */
document.addEventListener('DOMContentLoaded', function(){
  var form = $('csForm');
  if(!form) return;
  var fields = ['ontime','util','ageYears','inquiries','mixTypes'];
  function render(){
    var vals = fields.map(function(id){ return num(id); });
    if(vals.some(function(v){ return isNaN(v); })){ return; }
    vals.forEach(function(v,i){ $(fields[i]+'Val').textContent = v + (i<2?'%':(i===2?' yrs':'')); });
    var r = estimateScore(vals[0], vals[1], vals[2], vals[3], vals[4]);
    var tips = scoreTips(vals[0], vals[1], vals[2], vals[3], vals[4]);
    var html = '<div class="result-hero"><div class="lbl">Estimated score range</div>' +
      '<div class="big">'+r.score+'</div><div class="lbl">'+r.band+'</div></div>' +
      '<p class="hint"><strong>Educational estimate only</strong> — this is not your real FICO score. It shows how each factor moves a score, using the standard 35/30/15/10/10 factor weights.</p>' +
      '<h3>What to improve</h3><ul class="tips">';
    tips.forEach(function(t){ html += '<li>'+t+'</li>'; });
    html += '</ul>';
    $('csResults').innerHTML = html;
  }
  fields.forEach(function(id){ $(id).addEventListener('input', render); });
  form.addEventListener('submit', function(e){ e.preventDefault(); render(); });
  render();
});
