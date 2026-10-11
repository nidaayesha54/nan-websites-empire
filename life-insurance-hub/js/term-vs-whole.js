'use strict';
/* Term vs whole life 30-year cost comparison.
   termRatePer1k = estimated ANNUAL term premium per $1,000 of coverage (healthy non-smoker).
   Whole life estimated at ~11x the term annual premium (industry rule of thumb: 10-15x). */
var TERM_RATE_PER_1K = { '20s': 0.60, '30s': 0.75, '40s': 1.50, '50s': 3.60, '60s': 9.00 };
var WHOLE_MULT = 11;

function ageGroup(age) {
  if (age < 30) return '20s';
  if (age < 40) return '30s';
  if (age < 50) return '40s';
  if (age < 60) return '50s';
  return '60s';
}
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('twForm');
  var result = document.getElementById('twResult');
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var age = Math.max(18, Math.min(75, parseInt(document.getElementById('twAge').value, 10) || 35));
    var coverage = parseFloat(document.getElementById('twCoverage').value) || 500000;
    var termYears = parseInt(document.getElementById('twTerm').value, 10) || 20;
    var rate = TERM_RATE_PER_1K[ageGroup(age)];
    var termAnnual = (coverage / 1000) * rate;
    var wholeAnnual = termAnnual * WHOLE_MULT;
    var termTotal = termAnnual * termYears;
    var wholeTotal = wholeAnnual * 30;
    var ratio = termTotal > 0 ? wholeTotal / termTotal : 0;
    var verdict;
    if (termYears < 30) {
      verdict = 'For <strong>' + termYears + ' years of coverage</strong>, term costs about <strong>' + fmt(termTotal)
        + '</strong> total vs <strong>' + fmt(wholeTotal) + '</strong> for 30 years of whole life — roughly <strong>'
        + ratio.toFixed(1) + '× cheaper</strong>. Term wins on price; whole life wins on permanence (it never expires and builds cash value).';
    } else {
      verdict = 'Even over a full 30 years, term totals about <strong>' + fmt(termTotal) + '</strong> vs <strong>'
        + fmt(wholeTotal) + '</strong> for whole life — roughly <strong>' + ratio.toFixed(1)
        + '× cheaper</strong>. Choose whole life only if you specifically want lifelong coverage plus a cash-value component.';
    }
    result.innerHTML = '<h2>30-year cost comparison (estimates)</h2>'
      + '<div class="table-wrap"><table><thead><tr><th>Policy type</th><th>Est. annual premium</th><th>Years covered</th><th>Est. 30-yr total</th></tr></thead><tbody>'
      + '<tr><td><strong>Term life</strong> (' + termYears + '-yr)</td><td>' + fmt(termAnnual) + '/yr</td><td>' + termYears + '</td><td>' + fmt(termTotal) + '</td></tr>'
      + '<tr><td><strong>Whole life</strong></td><td>' + fmt(wholeAnnual) + '/yr</td><td>Permanent</td><td>' + fmt(wholeTotal) + '</td></tr>'
      + '</tbody></table></div>'
      + '<p><strong>Verdict:</strong> ' + verdict + '</p>'
      + '<p class="meta">Estimates for a healthy non-smoker; actual premiums vary by insurer, health class, and state. Term premiums shown assume level premiums for the full term length.</p>';
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
