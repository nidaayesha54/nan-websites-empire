/* Refinance break-even analyzer — pure math (testable).
   mortgagePayment() comes from js/main.js */
function refinanceAnalysis(curBalance, curRatePct, remainYears, newRatePct, newTermYears, closingCosts){
  var curPay = mortgagePayment(curBalance, curRatePct, remainYears);
  var newPay = mortgagePayment(curBalance, newRatePct, newTermYears);
  var monthlySavings = curPay - newPay;
  var breakEven = monthlySavings > 0 ? closingCosts/monthlySavings : Infinity;
  var totalOld = curPay * remainYears * 12;
  var totalNew = newPay * newTermYears * 12 + closingCosts;
  return { curPay:curPay, newPay:newPay, monthlySavings:monthlySavings,
           breakEvenMonths:breakEven, lifetimeSavings:totalOld - totalNew };
}

/* ==== DOM wiring ==== */
document.addEventListener('DOMContentLoaded', function(){
  var form = $('refiForm');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var bal = num('curBalance'), cRate = num('curRate'), rem = num('remainYears'),
        nRate = num('newRate'), nTerm = parseFloat($('newTerm').value), costs = num('closingCosts')||0;
    if(!(bal>0)||!(cRate>=0)||!(rem>0)||!(nRate>=0)||!(costs>=0)){
      setError('refiResults','Please enter valid numbers for all fields.');
      return;
    }
    var r = refinanceAnalysis(bal, cRate, rem, nRate, nTerm, costs);
    var html = '<div class="result-hero"><div class="lbl">Monthly savings</div><div class="big">'+money(r.monthlySavings)+'</div></div>' +
      '<div class="stat-row"><span class="k">Current payment</span><span class="v">'+money(r.curPay)+'/mo</span></div>' +
      '<div class="stat-row"><span class="k">New payment</span><span class="v">'+money(r.newPay)+'/mo</span></div>' +
      '<div class="stat-row"><span class="k">Break-even point</span><span class="v">'+(isFinite(r.breakEvenMonths) ? r.breakEvenMonths.toFixed(1)+' months' : 'Never — payment does not drop')+'</span></div>' +
      '<div class="stat-row"><span class="k">Lifetime savings (net of closing costs)</span><span class="v">'+money(r.lifetimeSavings)+'</span></div>';
    if(r.monthlySavings > 0 && isFinite(r.breakEvenMonths)){
      var verdictCls = r.lifetimeSavings > 0 ? 'good' : 'caution';
      var verdictTxt = r.lifetimeSavings > 0
        ? 'Refinancing looks worthwhile: you recover closing costs in about '+r.breakEvenMonths.toFixed(0)+' months and save '+money(r.lifetimeSavings)+' over the life of the loan.'
        : 'Your payment drops, but extending the term to '+nTerm+' years costs more in total interest than you save. Consider a shorter new term.';
      html += '<div class="verdict '+verdictCls+'">'+verdictTxt+'</div>';
    } else {
      html += '<div class="verdict bad">The new loan does not lower your payment, so refinancing does not pay off with these numbers.</div>';
    }
    $('refiResults').innerHTML = html;
  });
});
