/* CAGR Calculator with Rule of 72 doubling time */
(function () {
  'use strict';

  function calcCagr(start, end, years) {
    if (start <= 0 || end <= 0 || years <= 0) return null;
    var cagr = Math.pow(end / start, 1 / years) - 1;
    return {
      cagr: cagr,
      totalGrowth: (end - start) / start,
      doublingYears: cagr > 0 ? 72 / (cagr * 100) : Infinity
    };
  }

  function init() {
    var btn = document.getElementById('calcBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var start = parseFloat(document.getElementById('startVal').value) || 0;
      var end = parseFloat(document.getElementById('endVal').value) || 0;
      var years = parseFloat(document.getElementById('years').value) || 0;
      var r = calcCagr(start, end, years);
      if (!r) {
        document.getElementById('results').innerHTML = '<p>Enter positive values for start, end, and years.</p>';
        return;
      }
      var html = '<div class="result-big">' + (r.cagr * 100).toFixed(2) + '%</div>';
      html += '<p class="note">Compound annual growth rate</p>';
      html += '<div class="stat-grid">';
      html += '<div class="stat"><div class="v">' + (r.totalGrowth * 100).toFixed(1) + '%</div><div class="l">Total growth</div></div>';
      html += '<div class="stat"><div class="v">' + (isFinite(r.doublingYears) ? r.doublingYears.toFixed(1) + ' yrs' : '—') + '</div><div class="l">Doubling time (Rule of 72)</div></div>';
      html += '</div>';
      html += '<div class="result-row"><span>Start value</span><strong>$' + start.toLocaleString('en-US') + '</strong></div>';
      html += '<div class="result-row"><span>End value</span><strong>$' + end.toLocaleString('en-US') + '</strong></div>';
      html += '<div class="result-row"><span>Period</span><strong>' + years + ' years</strong></div>';
      html += '<p class="note">Rule of 72: divide 72 by your annual return % to estimate years to double your money. ' +
        'Educational purposes only — not financial advice.</p>';
      document.getElementById('results').innerHTML = html;
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  if (typeof window !== 'undefined') window.__cagrCalc = calcCagr;
})();
