// Take-home pay estimator (federal brackets + FICA). All figures labeled estimates.
(function () {
  'use strict';
  var fmt$ = function (n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  var parse = function (v) { var n = parseFloat(v); return isNaN(n) || n < 0 ? 0 : n; };

  // 2025 federal brackets (2026 similar) — labeled as estimates
  var BRACKETS = {
    single: [[11925, 0.10], [48475, 0.12], [103350, 0.22], [197300, 0.24], [250525, 0.32], [626350, 0.35], [Infinity, 0.37]],
    married: [[23850, 0.10], [96950, 0.12], [206700, 0.22], [394600, 0.24], [501050, 0.32], [751600, 0.35], [Infinity, 0.37]]
  };
  var STD_DED = { single: 15000, married: 30000 };
  var PERIODS = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };
  var PERIOD_LABEL = { weekly: 'week', biweekly: '2 weeks', semimonthly: 'half-month', monthly: 'month' };

  function federalTax(taxable, status) {
    var brackets = BRACKETS[status];
    var tax = 0, prev = 0;
    for (var i = 0; i < brackets.length; i++) {
      var cap = brackets[i][0], rate = brackets[i][1];
      if (taxable <= prev) break;
      tax += (Math.min(taxable, cap) - prev) * rate;
      prev = cap;
    }
    return tax;
  }

  function calc() {
    var gross = parse(document.getElementById('gross').value);
    var status = document.getElementById('status').value;
    var freq = document.getElementById('freq').value;
    var state = document.getElementById('state').value;
    var err = document.getElementById('err');
    var res = document.getElementById('results');
    err.textContent = '';

    if (gross <= 0) { err.textContent = 'Please enter your gross annual pay.'; res.classList.remove('show'); return; }

    var periods = PERIODS[freq];
    var taxable = Math.max(0, gross - STD_DED[status]);
    var fed = federalTax(taxable, status);
    var fica = gross * 0.0765; // 6.2% Social Security + 1.45% Medicare (cap ignored — estimate)
    var net = gross - fed - fica;
    var effRate = (fed + fica) / gross * 100;

    var html = '<h3>Estimated Take-Home Pay</h3>' +
      '<div class="kv"><span>Gross annual pay</span><b>' + fmt$(gross) + '</b></div>' +
      '<div class="kv"><span>Federal income tax (est.)</span><b>−' + fmt$(fed) + '</b></div>' +
      '<div class="kv"><span>FICA — Social Security + Medicare (est.)</span><b>−' + fmt$(fica) + '</b></div>' +
      '<div class="kv"><span>Net annual take-home (est.)</span><b>' + fmt$(net) + '</b></div>' +
      '<div class="kv"><span>Net per paycheck (' + freq + ', est.)</span><b>' + fmt$(net / periods) + '</b></div>' +
      '<div class="kv"><span>Gross per paycheck</span><b>' + fmt$(gross / periods) + '</b></div>' +
      '<div class="kv"><span>Effective tax rate (fed + FICA)</span><b>' + effRate.toFixed(1) + '%</b></div>' +
      '<div class="verdict">On <b>' + fmt$(gross) + '/year</b> (' + status + ' filer, paid ' + freq + '), your estimated take-home is <b>' + fmt$(net / periods) + ' per ' + PERIOD_LABEL[freq] + '</b>.</div>' +
      '<p style="color:var(--muted);font-size:.9rem">Estimates use 2025 federal brackets & standard deduction (' + fmt$(STD_DED[status]) + ' ' + status + '), plus 7.65% FICA. ' +
      (state === 'none' ? 'You selected a no-income-tax state.' : 'State income tax is NOT included — actual take-home will be lower in states with income tax.') +
      ' Pre-tax deductions (401k, health insurance) also reduce take-home. Not tax advice.</p>';
    res.innerHTML = html;
    res.classList.add('show');
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('calcBtn').addEventListener('click', calc);
  });
})();
