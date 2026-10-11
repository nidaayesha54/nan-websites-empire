/* 2026 Federal Income Tax Estimator
   Uses 2026 ESTIMATED brackets (inflation-adjusted 2025 brackets). For education only. */
(function () {
  'use strict';

  var BRACKETS = {
    single: [
      { upTo: 12300, rate: 0.10 }, { upTo: 50000, rate: 0.12 },
      { upTo: 106500, rate: 0.22 }, { upTo: 203500, rate: 0.24 },
      { upTo: 258000, rate: 0.32 }, { upTo: 645000, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 }
    ],
    married_joint: [
      { upTo: 24600, rate: 0.10 }, { upTo: 100000, rate: 0.12 },
      { upTo: 213000, rate: 0.22 }, { upTo: 407000, rate: 0.24 },
      { upTo: 516000, rate: 0.32 }, { upTo: 1290000, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 }
    ],
    head_household: [
      { upTo: 17500, rate: 0.10 }, { upTo: 66800, rate: 0.12 },
      { upTo: 109000, rate: 0.22 }, { upTo: 204000, rate: 0.24 },
      { upTo: 259000, rate: 0.32 }, { upTo: 645000, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 }
    ]
  };
  // Married filing separately = half of joint thresholds
  BRACKETS.married_separate = BRACKETS.married_joint.map(function (b) {
    return { upTo: b.upTo === Infinity ? Infinity : Math.round(b.upTo / 2), rate: b.rate };
  });

  var STANDARD = {
    single: 15500, married_joint: 31000,
    married_separate: 15500, head_household: 23250
  };

  function fmt(n) {
    return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  function calcTax(status, income, deductions) {
    var taxable = Math.max(0, income - deductions);
    var tax = 0, remaining = taxable, prev = 0, marginal = 0;
    var rows = [];
    BRACKETS[status].forEach(function (b) {
      if (remaining <= 0) return;
      var inBracket = Math.min(remaining, b.upTo - prev);
      if (inBracket > 0) {
        tax += inBracket * b.rate;
        marginal = b.rate;
        rows.push({ rate: b.rate, amount: inBracket, tax: inBracket * b.rate });
        remaining -= inBracket;
        prev = b.upTo;
      }
    });
    return {
      taxable: taxable, tax: tax, marginal: marginal,
      effective: income > 0 ? tax / income : 0, rows: rows
    };
  }

  function init() {
    var btn = document.getElementById('calcBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var status = document.getElementById('filingStatus').value;
      var income = parseFloat(document.getElementById('income').value) || 0;
      var deductions = parseFloat(document.getElementById('deductions').value) || 0;
      var r = calcTax(status, income, deductions);

      var html = '<div class="result-big">' + fmt(Math.round(r.tax)) + '</div>';
      html += '<p class="note">Estimated 2026 federal income tax</p>';
      html += '<div class="stat-grid">';
      html += '<div class="stat"><div class="v">' + fmt(Math.round(r.taxable)) + '</div><div class="l">Taxable income</div></div>';
      html += '<div class="stat"><div class="v">' + (r.marginal * 100).toFixed(0) + '%</div><div class="l">Marginal rate</div></div>';
      html += '<div class="stat"><div class="v">' + (r.effective * 100).toFixed(2) + '%</div><div class="l">Effective rate</div></div>';
      html += '<div class="stat"><div class="v">' + fmt(Math.round(income - r.tax)) + '</div><div class="l">After-tax income</div></div>';
      html += '</div>';
      if (r.rows.length) {
        html += '<h3>How your tax was calculated</h3>';
        html += '<table class="data"><tr><th>Bracket</th><th>Income in bracket</th><th>Tax</th></tr>';
        r.rows.forEach(function (row) {
          html += '<tr><td>' + (row.rate * 100).toFixed(0) + '%</td><td>' +
            fmt(Math.round(row.amount)) + '</td><td>' + fmt(Math.round(row.tax)) + '</td></tr>';
        });
        html += '</table>';
      }
      html += '<p class="note">Uses 2026 estimated brackets (inflation-adjusted 2025 IRS figures). ' +
        'Does not include state tax, FICA, AMT, or credits. Educational purposes only — not financial advice.</p>';
      document.getElementById('results').innerHTML = html;
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  // Expose for testing
  if (typeof window !== 'undefined') window.__taxCalc = calcTax;
})();
