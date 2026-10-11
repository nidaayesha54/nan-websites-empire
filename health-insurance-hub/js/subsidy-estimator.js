'use strict';
/* ACA premium tax credit estimator (2026 estimates).
   FPL (approx 2026): $15,650 single + $5,490 per extra household member.
   Contribution rate: 2.07% at 133% FPL sliding to 9.83% at 400% FPL; 8.5% cap above 400%.
   subsidy = max(0, benchmark premium - income x rate / 12). */
var STATE_F = { AK: 1.4, HI: 1.2, NY: 1.1, NJ: 1.1, CT: 1.1, MA: 1.1, WY: 1.15 };
var BENCHMARK = 550;
function fplAmount(size) { return 15650 + (size - 1) * 5490; }
function contribRate(p) {
  if (p < 1.33) return 0.0207;
  if (p <= 4.0) return 0.0207 + ((p - 1.33) / (4.0 - 1.33)) * (0.0983 - 0.0207);
  return 0.085;
}
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('seForm');
  var result = document.getElementById('seResult');
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var size = parseInt(document.getElementById('seSize').value, 10) || 1;
    var income = parseFloat(document.getElementById('seIncome').value);
    income = (isNaN(income) || income < 0) ? 0 : income;
    var state = document.getElementById('seState').value;
    var fpl = fplAmount(size);
    var p = income / fpl;
    var benchmark = BENCHMARK * (STATE_F[state] || 1.0);
    var html;
    if (p < 1.0) {
      html = '<h2>Estimated subsidy</h2>'
        + '<p class="big">$0 <span style="font-size:1rem;font-weight:400">marketplace subsidy</span></p>'
        + '<p>At about <strong>' + Math.round(p * 100) + '% of the federal poverty level</strong> (' + fmt(income)
        + ' for a household of ' + size + '), you’d likely qualify for <strong>Medicaid</strong> instead of marketplace subsidies in most states that expanded Medicaid. Check your state’s Medicaid program.</p>';
    } else {
      var rate = contribRate(p);
      var contribMo = income * rate / 12;
      var subsidy = Math.max(0, benchmark - contribMo);
      var note = p > 4.0
        ? ' Above 400% of FPL, this uses the extended rule capping your benchmark-plan cost at 8.5% of income — confirm 2026 rules at enrollment, as subsidy law can change.'
        : '';
      html = '<h2>Estimated monthly subsidy (2026)</h2>'
        + '<p class="big">' + fmt(subsidy) + '<span style="font-size:1rem;font-weight:400">/mo ≈ ' + fmt(subsidy * 12) + '/yr</span></p>'
        + '<div class="table-wrap"><table><tbody>'
        + '<tr><td>Household income vs poverty level</td><td><strong>' + Math.round(p * 100) + '% of FPL</strong></td></tr>'
        + '<tr><td>Benchmark plan (est.)</td><td>' + fmt(benchmark) + '/mo</td></tr>'
        + '<tr><td>Your expected contribution (' + (rate * 100).toFixed(2) + '% of income)</td><td>' + fmt(contribMo) + '/mo</td></tr>'
        + '<tr><td><strong>Estimated subsidy</strong></td><td><strong>' + fmt(subsidy) + '/mo</strong></td></tr>'
        + '</tbody></table></div>'
        + '<p class="meta">2026 estimates for education only — not an official determination.' + note
        + ' Final credits depend on the actual benchmark plan in your ZIP code and your finalized income.</p>';
    }
    result.innerHTML = html;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
