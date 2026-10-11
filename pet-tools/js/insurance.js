// Pet insurance calculator + break-even analyzer
var BASE={small:38,medium:48,large:62};
function calcInsurance(){
  var size=document.getElementById('petSize').value;
  var age=parseFloat(document.getElementById('petAge').value);
  var plan=document.getElementById('plan').value;
  if(isNaN(age)||age<0||age>20){ alert('Please enter a valid age (0-20).'); return; }
  var ageF=age<1?0.9:(age<7?1.0:(age<11?1.35:1.7));
  var planF=plan==='accident'?0.45:(plan==='full'?1.25:1.0);
  var monthly=Math.round(BASE[size]*ageF*planF);
  var annual=monthly*12;
  var deductible=plan==='accident'?250:500;
  // expected annual vet spend model (US averages)
  var routine=size==='small'?280:(size==='medium'?340:420);
  var emergencyRisk=age<7?0.18:(age<11?0.32:0.5);
  var emergencyCost=2800;
  var expected=routine+emergencyRisk*emergencyCost;
  var covered=Math.max(0,expected-deductible)*0.8; // 80% reimbursement typical
  var net=covered-annual;
  var verdict=net>200?'✅ <strong>Likely worth it</strong> — expected payouts beat premiums.':
    (net>-200?'⚖️ <strong>Borderline</strong> — mainly peace-of-mind value.':
    '❌ <strong>Probably skip</strong> — expected costs are lower than premiums. Consider a savings fund instead.');
  var r=document.getElementById('result');
  r.classList.add('show');
  r.innerHTML='<h3>🛡️ Result</h3>'
    +'<p class="big-num">'+money(monthly)+'/mo</p>'
    +'<p>Estimated premium for a '+age+'-year-old '+size+' dog ('+plan+' plan). That\'s <strong>'+money(annual)+'/year</strong> + '+money(deductible)+' deductible.</p>'
    +'<table><tr><th>Metric</th><th>Value</th></tr>'
    +'<tr><td>Annual premium</td><td>'+money(annual)+'</td></tr>'
    +'<tr><td>Expected annual vet bills</td><td>~'+money(expected)+'</td></tr>'
    +'<tr><td>Est. insurance payout (80% after deductible)</td><td>~'+money(covered)+'</td></tr>'
    +'<tr><td><strong>Net value</strong></td><td><strong>'+(net>=0?'+':'')+money(net)+'</strong></td></tr></table>'
    +'<p style="margin-top:12px">'+verdict+'</p>'
    +'<p class="disclaimer" style="margin-top:14px">Estimates based on US averages — real quotes vary by insurer, breed, and zip code. Not financial advice.</p>';
}
