'use strict';
/* Monthly premium range estimator: base monthly rate per $100k by age band,
   adjusted by smoker, health class and term length multipliers. */
var BASE_MONTHLY_PER_100K = { '20s': 12, '30s': 15, '40s': 25, '50s': 45, '60s': 85 };
var SMOKER_F = { no: 1.0, yes: 2.2 };
var HEALTH_F = { preferred: 0.9, standard: 1.0, substandard: 1.4 };
var TERM_F = { '10': 0.7, '20': 1.0, '30': 1.35 };

function ageGroup(age) {
  if (age < 30) return '20s';
  if (age < 40) return '30s';
  if (age < 50) return '40s';
  if (age < 60) return '50s';
  return '60s';
}
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('qForm');
  var result = document.getElementById('qResult');
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var age = Math.max(18, Math.min(75, parseInt(document.getElementById('qAge').value, 10) || 35));
    var coverage = parseFloat(document.getElementById('qCoverage').value) || 250000;
    var avg = BASE_MONTHLY_PER_100K[ageGroup(age)]
      * (coverage / 100000)
      * SMOKER_F[document.getElementById('qSmoker').value]
      * HEALTH_F[document.getElementById('qHealth').value]
      * TERM_F[document.getElementById('qTerm').value];
    var low = avg * 0.8, high = avg * 1.25;
    result.innerHTML = '<h2>Estimated monthly premium range</h2>'
      + '<p class="big">' + fmt(low) + ' – ' + fmt(high) + '<span style="font-size:1rem;font-weight:400">/mo</span></p>'
      + '<div class="table-wrap"><table><thead><tr><th>Estimate</th><th>Monthly</th><th>Annual</th></tr></thead><tbody>'
      + '<tr><td>Low</td><td>' + fmt(low) + '</td><td>' + fmt(low * 12) + '</td></tr>'
      + '<tr><td>Average</td><td>' + fmt(avg) + '</td><td>' + fmt(avg * 12) + '</td></tr>'
      + '<tr><td>High</td><td>' + fmt(high) + '</td><td>' + fmt(high * 12) + '</td></tr>'
      + '</tbody></table></div>'
      + '<p class="meta">Labeled estimates, not quotes. Real premiums depend on the insurer, your exact health profile, state, and underwriting.</p>';
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
