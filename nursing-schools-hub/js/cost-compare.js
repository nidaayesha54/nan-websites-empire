/* Nursing School Cost Comparator logic */
(function () {
  'use strict';

  function fmt(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function monthlyPayment(principal, annualRate, months) {
    var r = annualRate / 100 / 12;
    if (r === 0) return principal / months;
    var f = Math.pow(1 + r, months);
    return principal * r * f / (f - 1);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('cost-form');
    var out = document.getElementById('cost-results');
    if (!form || !out) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var tuition = parseFloat(document.getElementById('tuition').value) || 0;
      var years = parseFloat(document.getElementById('years').value) || 0;
      var fees = parseFloat(document.getElementById('fees').value) || 0;
      var rate = parseFloat(document.getElementById('rate').value) || 0;
      var salary = parseFloat(document.getElementById('salary').value) || 0;

      var totalCost = tuition * years + fees;
      var months = 120; // standard 10-year repayment
      var monthly = monthlyPayment(totalCost, rate, months);
      var totalRepaid = monthly * months;
      var debtToIncome = salary > 0 ? (monthly / (salary / 12)) * 100 : 0;
      var paybackYears = salary > 0 ? totalCost / salary : 0;

      var verdict, vclass;
      if (salary > 0 && totalCost <= salary) {
        verdict = 'Excellent value — your total cost is under one year of expected salary.';
        vclass = 'good';
      } else if (salary > 0 && totalCost <= salary * 1.5) {
        verdict = 'Reasonable — the debt is manageable on an RN salary, especially with employer tuition help.';
        vclass = 'good';
      } else {
        verdict = 'Expensive — compare cheaper programs or check scholarships before committing to this level of debt.';
        vclass = 'warn';
      }

      out.innerHTML =
        '<div class="verdict ' + vclass + '">' +
        '<div class="big-number">' + fmt(totalCost) + '</div>' +
        '<p><strong>Total program cost</strong> (tuition × years + fees)</p>' +
        '<div class="stat-grid">' +
        '<div class="stat"><div class="val">' + fmt(monthly) + '</div><div class="lbl">Est. monthly payment (10-yr loan)</div></div>' +
        '<div class="stat"><div class="val">' + fmt(totalRepaid) + '</div><div class="lbl">Total repaid with interest</div></div>' +
        '<div class="stat"><div class="val">' + debtToIncome.toFixed(1) + '%</div><div class="lbl">Payment as % of monthly pay</div></div>' +
        '<div class="stat"><div class="val">' + paybackYears.toFixed(1) + ' yrs</div><div class="lbl">Cost ÷ one year of salary</div></div>' +
        '</div>' +
        '<p>' + verdict + '</p>' +
        '<p style="color:var(--muted);font-size:.9rem">Estimates only — not financial advice. Actual aid, scholarships, and in-state discounts can change these numbers a lot.</p>' +
        '</div>';
      out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
