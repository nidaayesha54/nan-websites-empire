/* Personal Loan Calculator: amortization formula + schedule */
(function () {
  'use strict';

  function monthlyPayment(principal, apr, n) {
    var r = apr / 12;
    if (n <= 0) return 0;
    if (r === 0) return principal / n;
    var f = Math.pow(1 + r, n);
    return principal * r * f / (f - 1);
  }

  function schedule(principal, apr, n, payment) {
    var r = apr / 12, bal = principal, rows = [];
    for (var y = 1; y <= Math.ceil(n / 12); y++) {
      var intPaid = 0, prinPaid = 0;
      for (var m = 0; m < 12 && (y - 1) * 12 + m < n; m++) {
        var interest = bal * r;
        var prin = Math.min(payment - interest, bal);
        intPaid += interest; prinPaid += prin; bal -= prin;
      }
      rows.push({ year: y, interest: intPaid, principal: prinPaid, balance: Math.max(0, bal) });
    }
    return rows;
  }

  function fmt(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function init() {
    var btn = document.getElementById('calcBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var principal = parseFloat(document.getElementById('amount').value) || 0;
      var apr = (parseFloat(document.getElementById('apr').value) || 0) / 100;
      var years = parseFloat(document.getElementById('term').value) || 0;
      var n = Math.round(years * 12);
      if (principal <= 0 || n <= 0) {
        document.getElementById('results').innerHTML = '<p>Enter a loan amount and term.</p>';
        return;
      }
      var pmt = monthlyPayment(principal, apr, n);
      var total = pmt * n;
      var interest = total - principal;

      var html = '<div class="result-big">' + fmt(pmt) + '<span class="note"> /month</span></div>';
      html += '<div class="stat-grid">';
      html += '<div class="stat"><div class="v">' + fmt(total) + '</div><div class="l">Total paid</div></div>';
      html += '<div class="stat"><div class="v">' + fmt(interest) + '</div><div class="l">Total interest</div></div>';
      html += '</div>';
      html += '<h3>Amortization schedule</h3>';
      html += '<table class="data"><tr><th>Year</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>';
      schedule(principal, apr, n, pmt).forEach(function (row) {
        html += '<tr><td>' + row.year + '</td><td>' + fmt(row.principal) + '</td><td>' +
          fmt(row.interest) + '</td><td>' + fmt(row.balance) + '</td></tr>';
      });
      html += '</table>';
      html += '<p class="note">Fixed-rate estimate before fees. Actual offers vary by credit score. ' +
        'Educational purposes only — not financial advice.</p>';
      document.getElementById('results').innerHTML = html;
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  if (typeof window !== 'undefined') window.__loanPayment = monthlyPayment;
})();
