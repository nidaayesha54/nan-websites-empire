// Amortization schedule generator
document.getElementById('amcalc').addEventListener('submit', function(e){
  e.preventDefault();
  var loan = MH.get('loan');
  var rate = MH.get('rate');
  var years = MH.get('term');
  var extra = MH.get('extra');

  var r = rate/100/12;
  var basePay = MH.monthlyPI(loan, rate, years);
  var pay = basePay + extra;

  var bal = loan, totalInterest = 0, month = 0;
  var yearly = {}; // year -> {principal, interest, endBal}
  var rows = [];

  while(bal > 0.005 && month < 1200){
    month++;
    var interest = bal * r;
    var principal = Math.min(pay - interest, bal);
    if(principal < 0) principal = 0;
    bal -= principal;
    totalInterest += interest;
    var yr = Math.ceil(month/12);
    if(!yearly[yr]) yearly[yr] = {p:0, i:0, end:0};
    yearly[yr].p += principal;
    yearly[yr].i += interest;
    yearly[yr].end = Math.max(bal,0);
    if(month <= 12 || month % 12 === 0){
      rows.push({m:month, pay:principal+interest, pr:principal, in:interest, bal:Math.max(bal,0)});
    }
  }

  var yearsToPay = (month/12);
  var payoffYear = Math.ceil(month/12);

  // Summary
  document.getElementById('r-basepay').textContent = MH.money2(basePay);
  document.getElementById('r-totalpay').textContent = MH.money(basePay*Math.round(years*12));
  document.getElementById('r-interest').textContent = MH.money(totalInterest);
  document.getElementById('r-months').textContent = month + ' months (' + yearsToPay.toFixed(1) + ' years)';
  if(extra > 0){
    var baseInterest = basePay*Math.round(years*12) - loan;
    document.getElementById('r-saved').textContent = MH.money(Math.max(baseInterest - totalInterest, 0));
    document.getElementById('extra-row').style.display = '';
  } else {
    document.getElementById('extra-row').style.display = 'none';
  }

  // Yearly table
  var html = '<table class="sched"><thead><tr><th>Year</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>';
  Object.keys(yearly).forEach(function(y){
    var d = yearly[y];
    html += '<tr><td>'+y+'</td><td>'+MH.money(d.p)+'</td><td>'+MH.money(d.i)+'</td><td>'+MH.money(d.end)+'</td></tr>';
  });
  html += '</tbody></table>';
  document.getElementById('sched').innerHTML = html;
  document.getElementById('out').classList.add('show');
  document.getElementById('out').scrollIntoView({behavior:'smooth',block:'start'});
});
