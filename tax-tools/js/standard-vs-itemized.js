/* Standard Deduction vs Itemized comparison (SALT capped at $10,000) */
(function () {
  'use strict';

  var STANDARD = {
    single: 15500, married_joint: 31000,
    married_separate: 15500, head_household: 23250
  };

  function fmt(n) {
    return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  function compare(status, mortgage, propTax, stateTax, charity) {
    var salt = Math.min(propTax + stateTax, 10000); // SALT cap
    var itemized = mortgage + salt + charity;
    var standard = STANDARD[status];
    return {
      salt: salt, itemized: itemized, standard: standard,
      better: itemized > standard ? 'itemized' : 'standard',
      savings: Math.abs(itemized - standard)
    };
  }

  function init() {
    var btn = document.getElementById('calcBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var status = document.getElementById('filingStatus').value;
      var mortgage = parseFloat(document.getElementById('mortgage').value) || 0;
      var propTax = parseFloat(document.getElementById('propTax').value) || 0;
      var stateTax = parseFloat(document.getElementById('stateTax').value) || 0;
      var charity = parseFloat(document.getElementById('charity').value) || 0;
      var r = compare(status, mortgage, propTax, stateTax, charity);

      var html = '<div class="stat-grid">';
      html += '<div class="stat"><div class="v">' + fmt(r.standard) + '</div><div class="l">Standard deduction</div></div>';
      html += '<div class="stat"><div class="v">' + fmt(Math.round(r.itemized)) + '</div><div class="l">Your itemized total</div></div>';
      html += '</div>';
      if (r.better === 'itemized') {
        html = '<div class="result-big">Itemize</div>' +
          '<p><strong>Itemizing saves you ' + fmt(Math.round(r.savings)) + ' more</strong> in deductions than the standard deduction.</p>' + html;
      } else {
        html = '<div class="result-big">Take the standard</div>' +
          '<p>The standard deduction beats your itemized total by <strong>' + fmt(Math.round(r.savings)) + '</strong> — itemizing is not worth it.</p>' + html;
      }
      html += '<div class="result-row"><span>Mortgage interest</span><strong>' + fmt(mortgage) + '</strong></div>';
      html += '<div class="result-row"><span>SALT (capped at $10,000)</span><strong>' + fmt(Math.round(r.salt)) + '</strong></div>';
      html += '<div class="result-row"><span>Charitable donations</span><strong>' + fmt(charity) + '</strong></div>';
      html += '<p class="note">2026 estimated standard deductions. SALT cap $10,000 per federal law. ' +
        'Educational purposes only — not financial advice.</p>';
      document.getElementById('results').innerHTML = html;
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  if (typeof window !== 'undefined') window.__itemizedCompare = compare;
})();
