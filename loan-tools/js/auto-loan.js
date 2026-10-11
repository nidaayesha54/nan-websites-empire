/* Auto Loan Calculator: monthly payment + total cost of ownership */
(function () {
  'use strict';

  function monthlyPayment(principal, apr, n) {
    var r = apr / 12;
    if (n <= 0) return 0;
    if (r === 0) return principal / n;
    var f = Math.pow(1 + r, n);
    return principal * r * f / (f - 1);
  }

  function fmt(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function init() {
    var btn = document.getElementById('calcBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var price = parseFloat(document.getElementById('price').value) || 0;
      var down = parseFloat(document.getElementById('down').value) || 0;
      var trade = parseFloat(document.getElementById('trade').value) || 0;
      var apr = (parseFloat(document.getElementById('apr').value) || 0) / 100;
      var months = parseInt(document.getElementById('term').value, 10) || 0;
      var insYear = parseFloat(document.getElementById('insurance').value) || 0;
      var fuelMile = parseFloat(document.getElementById('fuel').value) || 0;
      var milesYear = parseFloat(document.getElementById('miles').value) || 0;

      var financed = Math.max(0, price - down - trade);
      if (financed <= 0 || months <= 0) {
        document.getElementById('results').innerHTML = '<p>Enter a vehicle price and loan term.</p>';
        return;
      }
      var pmt = monthlyPayment(financed, apr, months);
      var loanTotal = pmt * months;
      var loanInterest = loanTotal - financed;
      var yrs = months / 12;
      var insTotal = insYear * yrs;
      var fuelTotal = fuelMile * milesYear * yrs;
      var ownership = loanTotal + insTotal + fuelTotal;

      var html = '<div class="result-big">' + fmt(pmt) + '<span class="note"> /month</span></div>';
      html += '<div class="stat-grid">';
      html += '<div class="stat"><div class="v">' + fmt(financed) + '</div><div class="l">Amount financed</div></div>';
      html += '<div class="stat"><div class="v">' + fmt(loanInterest) + '</div><div class="l">Loan interest</div></div>';
      html += '<div class="stat"><div class="v">' + fmt(insTotal) + '</div><div class="l">Insurance (' + yrs.toFixed(1) + ' yrs)</div></div>';
      html += '<div class="stat"><div class="v">' + fmt(ownership) + '</div><div class="l">Total cost of ownership</div></div>';
      html += '</div>';
      html += '<div class="result-row"><span>Vehicle price</span><strong>' + fmt(price) + '</strong></div>';
      html += '<div class="result-row"><span>Down payment + trade-in</span><strong>' + fmt(down + trade) + '</strong></div>';
      html += '<div class="result-row"><span>Total loan payments</span><strong>' + fmt(loanTotal) + '</strong></div>';
      html += '<div class="result-row"><span>Est. fuel cost</span><strong>' + fmt(fuelTotal) + '</strong></div>';
      html += '<p class="note">Ownership estimate excludes maintenance, taxes, and registration. ' +
        'Educational purposes only — not financial advice.</p>';
      document.getElementById('results').innerHTML = html;
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  if (typeof window !== 'undefined') window.__autoPayment = monthlyPayment;
})();
