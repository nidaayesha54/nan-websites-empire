/* Debt-to-income ratio calculator — pure math (testable) */
function calcDTI(debts, grossIncome){
  var total = 0, k;
  for(k in debts){ if(debts.hasOwnProperty(k)) total += debts[k]; }
  var dti = grossIncome > 0 ? total/grossIncome*100 : 0;
  var verdict, cls;
  if(dti < 36){ verdict = 'Good — under 36%. Most mortgage lenders see this as a healthy debt load.'; cls = 'good'; }
  else if(dti <= 43){ verdict = 'Caution — 36–43%. This is the upper limit for many qualified mortgages. Paying down debt before applying helps.'; cls = 'caution'; }
  else { verdict = 'High — over 43%. Most conventional lenders will decline at this level. Focus on paying down balances first.'; cls = 'bad'; }
  return { totalDebts:total, dti:dti, verdict:verdict, cls:cls };
}

/* ==== DOM wiring ==== */
document.addEventListener('DOMContentLoaded', function(){
  var form = $('dtiForm');
  if(!form) return;
  var fields = ['dHousing','dCar','dCards','dStudent','dOther'];
  function render(){
    var vals = fields.map(function(id){ return num(id)||0; });
    var income = num('grossIncome');
    var box = $('dtiResults');
    if(!(income>0)){ box.innerHTML = '<p class="hint">Enter your gross monthly income to see your DTI.</p>'; return; }
    var debts = { housing:vals[0], car:vals[1], cards:vals[2], student:vals[3], other:vals[4] };
    var r = calcDTI(debts, income);
    var w = Math.min(100, r.dti);
    var barColor = r.cls==='good' ? 'var(--good)' : (r.cls==='caution' ? 'var(--warn)' : 'var(--bad)');
    box.innerHTML =
      '<div class="result-hero"><div class="lbl">Your debt-to-income ratio</div><div class="big">'+r.dti.toFixed(1)+'%</div></div>' +
      '<div class="bar-row"><span>DTI</span><div class="bar-track"><div class="bar-seg" style="width:'+w.toFixed(1)+'%;background:'+barColor+'"></div></div><span>'+money(r.totalDebts)+' / '+money(income)+'</span></div>' +
      '<div class="verdict '+r.cls+'">'+r.verdict+'</div>' +
      '<p class="hint">Lenders generally want DTI under 36% (ideal) and cap qualified mortgages at 43%. This uses gross (pre-tax) monthly income and minimum monthly debt payments.</p>';
  }
  fields.concat(['grossIncome']).forEach(function(id){ $(id).addEventListener('input', render); });
  form.addEventListener('submit', function(e){ e.preventDefault(); render(); });
  render();
});
