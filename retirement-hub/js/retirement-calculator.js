/* Retirement nest-egg calculator — pure math (testable) */
var PLAN_TO_AGE = 95;

function calcRetirement(currentAge, retireAge, annualExpenses, inflationPct, returnPct){
  var n = retireAge - currentAge;                 // years until retirement
  var i = inflationPct/100, r = returnPct/100;
  var expensesAtRet = annualExpenses * Math.pow(1+i, n);   // first-year retirement spending
  var m = PLAN_TO_AGE - retireAge;               // years in retirement
  var nestEgg;
  if(r === 0){ nestEgg = expensesAtRet * m; }
  else { nestEgg = expensesAtRet * (1 - Math.pow(1+r, -m)) / r; }  // PV of annuity
  var months = n*12, rm = r/12, monthly;
  if(months <= 0){ monthly = 0; }
  else if(rm === 0){ monthly = nestEgg/months; }
  else { monthly = nestEgg * rm / (Math.pow(1+rm, months) - 1); }  // PMT to reach FV
  return { yearsToRetire:n, expensesAtRet:expensesAtRet, nestEgg:nestEgg,
           monthly:monthly, retireYears:m };
}

/* ==== DOM wiring ==== */
document.addEventListener('DOMContentLoaded', function(){
  var form = $('retForm');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var age = num('curAge'), rAge = num('retAge'), exp = num('expenses'),
        inf = num('inflation'), ret = num('retReturn');
    var box = $('retResults');
    if(!(age>0)||!(rAge>age)||rAge>=PLAN_TO_AGE||!(exp>0)||!(inf>=0)||!(ret>=0)){
      setError('retResults','Please enter valid numbers: retirement age must be above your current age and below '+PLAN_TO_AGE+', expenses above $0.');
      return;
    }
    var c = calcRetirement(age, rAge, exp, inf, ret);
    box.innerHTML =
      '<div class="result-hero"><div class="lbl">Nest egg needed</div><div class="big">'+money(c.nestEgg)+'</div>' +
      '<div class="lbl">Save this much per month, starting now</div><div class="big" style="font-size:1.7rem">'+money(c.monthly)+'/mo</div></div>' +
      '<div class="stat-row"><span class="k">Years until retirement</span><span class="v">'+c.yearsToRetire+'</span></div>' +
      '<div class="stat-row"><span class="k">Annual spending in retirement (year 1, inflated)</span><span class="v">'+money(c.expensesAtRet)+'</span></div>' +
      '<div class="stat-row"><span class="k">Retirement funded through age</span><span class="v">'+PLAN_TO_AGE+' ('+c.retireYears+' years)</span></div>' +
      '<p class="hint" style="margin-top:12px">Assumes you start from $0 saved and earn a steady '+ret+'% annual return. Existing savings are not included — treat the monthly figure as a target on top of what you already have.</p>';
  });
});
