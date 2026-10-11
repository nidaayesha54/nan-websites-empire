// Refinance break-even analyzer
document.getElementById('rcalc').addEventListener('submit', function(e){
  e.preventDefault();
  var balance = MH.get('balance');
  var curRate = MH.get('currate');
  var remYears = MH.get('remyears');
  var newRate = MH.get('newrate');
  var newYears = MH.get('newterm');
  var costs = MH.get('costs');

  var curPay = MH.monthlyPI(balance, curRate, remYears);
  var newPay = MH.monthlyPI(balance, newRate, newYears);
  var savings = curPay - newPay;

  var n1 = Math.round(remYears*12);
  var n2 = Math.round(newYears*12);
  var curTotalInterest = curPay*n1 - balance;
  var newTotalInterest = newPay*n2 - balance;
  var interestDiff = curTotalInterest - newTotalInterest;

  var breakeven = savings > 0 ? costs/savings : Infinity;

  document.getElementById('r-curpay').textContent = MH.money2(curPay);
  document.getElementById('r-newpay').textContent = MH.money2(newPay);
  document.getElementById('r-savings').textContent = MH.money2(Math.max(savings,0));
  document.getElementById('r-break').textContent = isFinite(breakeven) ? breakeven.toFixed(1)+' months' : 'Never (no savings)';
  document.getElementById('r-interest').textContent = (interestDiff>=0?'+':'') + MH.money(interestDiff).replace('$-','-$');
  var verdict = document.getElementById('r-verdict');
  if(savings > 0 && isFinite(breakeven)){
    verdict.textContent = breakeven <= 24
      ? 'Worth it: you break even in '+breakeven.toFixed(0)+' months.'
      : 'Marginal: break-even takes '+breakeven.toFixed(0)+' months — only refinance if you will stay that long.';
  } else {
    verdict.textContent = 'Not worth it: the new loan does not lower your payment.';
  }
  document.getElementById('out').classList.add('show');
  document.getElementById('out').scrollIntoView({behavior:'smooth',block:'start'});
});
