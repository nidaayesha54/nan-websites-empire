/* Payment Plan Calculator logic */
(function () {
  'use strict';

  function init() {
    var btn = document.getElementById('calcBtn');
    if (!btn) return;
    btn.addEventListener('click', calculate);
  }

  function calculate() {
    var balance = parseFloat(document.getElementById('pBalance').value);
    var apr = parseFloat(document.getElementById('pApr').value);
    var monthly = parseFloat(document.getElementById('pMonthly').value);
    var box = document.getElementById('planResult');

    if (!balance || balance <= 0 || !monthly || monthly <= 0 || isNaN(apr) || apr < 0) {
      box.className = 'result-box show result-warn';
      box.innerHTML = '<h3>⚠️ Check your numbers</h3><p>Enter a balance above $0, a monthly payment above $0, and an APR of 0 or more.</p>';
      return;
    }

    var r = apr / 100 / 12; // monthly rate
    var months, totalInterest, totalPaid;

    if (r === 0) {
      months = Math.ceil(balance / monthly);
      totalInterest = 0;
      totalPaid = balance;
    } else {
      var minPayment = balance * r;
      if (monthly <= minPayment) {
        box.className = 'result-box show result-bad';
        box.innerHTML = '<h3>🚨 This payment never pays off the debt</h3>' +
          '<p>At ' + apr + '% APR, interest alone is ' + window.mbhMoney(minPayment) + ' per month. ' +
          'Your payment of ' + window.mbhMoney(monthly) + ' doesn\'t cover the interest, so the balance would grow forever.</p>' +
          '<p><strong>You need to pay more than ' + window.mbhMoney(minPayment) + '/month</strong> just to make progress. Ask the provider for a 0% interest plan.</p>';
        return;
      }
      // n = -ln(1 - r*P/A) / ln(1 + r)
      months = Math.ceil(-Math.log(1 - (r * balance) / monthly) / Math.log(1 + r));
      // Simulate to get exact totals
      var bal = balance, interest = 0, m = 0;
      while (bal > 0 && m < 1200) {
        var intPortion = bal * r;
        interest += intPortion;
        bal = bal + intPortion - monthly;
        m++;
      }
      months = m;
      totalInterest = interest;
      totalPaid = balance + interest;
    }

    var payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + months);
    var dateStr = payoffDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    var years = Math.floor(months / 12);
    var remMonths = months % 12;
    var timeStr = years > 0
      ? years + ' year' + (years === 1 ? '' : 's') + (remMonths ? ' and ' + remMonths + ' month' + (remMonths === 1 ? '' : 's') : '')
      : months + ' month' + (months === 1 ? '' : 's');

    box.className = 'result-box show result-ok';
    box.innerHTML =
      '<h3>📅 Your payoff plan</h3>' +
      '<ul>' +
      '<li><strong>Time to pay off:</strong> ' + timeStr + ' (' + months + ' payments)</li>' +
      '<li><strong>Debt-free by:</strong> ' + dateStr + '</li>' +
      '<li><strong>Total interest paid:</strong> ' + window.mbhMoney(totalInterest) + '</li>' +
      '<li><strong>Total paid:</strong> ' + window.mbhMoney(totalPaid) + '</li>' +
      '</ul>' +
      (totalInterest > 0
        ? '<p>💡 <strong>Tip:</strong> ask your provider for a 0% interest plan — at 0% you\'d save ' + window.mbhMoney(totalInterest) + ' and finish at the same monthly payment.</p>'
        : '<p>💡 <strong>Great:</strong> at 0% interest every dollar goes to the balance. Keep it up!</p>') +
      '<p class="disclaimer">Estimates for planning only — not financial advice.</p>';

    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
