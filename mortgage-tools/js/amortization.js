/* Amortization schedule generator — pure math (testable).
   mortgagePayment() comes from js/main.js */
function amortizationSchedule(principal, annualRatePct, years){
  var r = annualRatePct/100/12;
  var n = Math.round(years*12);
  var pay = mortgagePayment(principal, annualRatePct, years);
  var bal = principal, rows = [], tI = 0;
  for(var k=1; k<=n; k++){
    var interest = bal * r;
    var princ = pay - interest;
    if(k === n || princ >= bal){ princ = bal; }   // final-payment adjustment
    bal = Math.max(0, bal - princ);
    tI += interest;
    rows.push({ n:k, payment:princ+interest, principal:princ, interest:interest, balance:bal });
    if(bal <= 0.005) break;
  }
  return { rows:rows, payment:pay, totalInterest:tI, totalPaid:principal + tI };
}

/* ==== DOM wiring ==== */
document.addEventListener('DOMContentLoaded', function(){
  var form = $('amortForm');
  if(!form) return;
  var lastCsv = '';
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var principal = num('loanAmount'), rate = num('amortRate'), yrs = num('amortTerm');
    if(!(principal>0)||!(rate>=0)||!(yrs>0)||yrs>50){
      setError('amortResults','Please enter a valid loan amount, rate, and term (max 50 years).');
      return;
    }
    var s = amortizationSchedule(principal, rate, yrs);
    var html = '<div class="result-hero"><div class="lbl">Monthly payment</div><div class="big">'+money(s.payment)+'</div></div>' +
      '<div class="stat-row"><span class="k">Total interest</span><span class="v">'+money(s.totalInterest)+'</span></div>' +
      '<div class="stat-row"><span class="k">Total paid</span><span class="v">'+money(s.totalPaid)+'</span></div>' +
      '<div class="stat-row"><span class="k">Number of payments</span><span class="v">'+s.rows.length+'</span></div>' +
      '<p style="margin-top:14px"><button type="button" class="btn btn-small" id="csvBtn">Download CSV</button></p>' +
      '<div class="table-wrap"><table><thead><tr><th>#</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>';
    s.rows.forEach(function(row){
      html += '<tr><td>'+row.n+'</td><td>'+money(row.payment,2)+'</td><td>'+money(row.principal,2)+'</td><td>'+money(row.interest,2)+'</td><td>'+money(row.balance,2)+'</td></tr>';
    });
    html += '</tbody></table></div>';
    $('amortResults').innerHTML = html;
    /* Build CSV */
    var csv = 'Payment,Payment Amount,Principal,Interest,Balance\n';
    s.rows.forEach(function(row){
      csv += row.n+','+row.payment.toFixed(2)+','+row.principal.toFixed(2)+','+row.interest.toFixed(2)+','+row.balance.toFixed(2)+'\n';
    });
    lastCsv = csv;
    $('csvBtn').addEventListener('click', function(){
      var blob = new Blob([lastCsv], {type:'text/csv'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'amortization-schedule.csv';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    });
  });
});
