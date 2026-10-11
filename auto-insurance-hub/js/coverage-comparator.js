'use strict';
/* Liability-only vs full coverage break-even.
   annualExtra = extra 6-month premium for full coverage x 2.
   paybackYears = vehicleValue / annualExtra  (years of extra premiums to equal the car's value). */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('ccForm');
  var result = document.getElementById('ccResult');
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = parseFloat(document.getElementById('ccValue').value);
    var extra = parseFloat(document.getElementById('ccExtra').value);
    v = (isNaN(v) || v < 0) ? 0 : v;
    extra = (isNaN(extra) || extra < 0) ? 0 : extra;
    var annualExtra = extra * 2;
    var fiveYr = annualExtra * 5;
    var payback = annualExtra > 0 ? v / annualExtra : Infinity;
    var verdict, cls = '';
    if (annualExtra <= 0) {
      verdict = 'Enter the extra amount full coverage costs per 6 months to see the break-even math.';
    } else if (payback <= 4) {
      verdict = 'Full coverage costs you the value of your car every <strong>' + payback.toFixed(1)
        + ' years</strong>. <strong>Consider liability-only</strong> and self-insuring — bank the savings instead.';
      cls = 'winner';
    } else if (payback >= 8) {
      verdict = 'It would take <strong>' + payback.toFixed(1)
        + ' years</strong> of extra premiums to equal your car’s value. <strong>Keep full coverage</strong> — one accident could wipe out the car’s worth.';
      cls = 'winner';
    } else {
      verdict = 'Break-even is <strong>' + payback.toFixed(1) + ' years</strong> — the <strong>borderline zone</strong>. '
        + 'Keep full coverage if you couldn’t comfortably replace the car out of pocket; drop it if you have a solid emergency fund.';
    }
    result.innerHTML = '<h2>Break-even analysis</h2>'
      + '<div class="table-wrap"><table><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>'
      + '<tr><td>Vehicle value</td><td>' + fmt(v) + '</td></tr>'
      + '<tr><td>Extra cost of full coverage (annual)</td><td>' + fmt(annualExtra) + '</td></tr>'
      + '<tr class="' + cls + '"><td><strong>Break-even (years of premiums = car value)</strong></td><td><strong>'
      + (isFinite(payback) ? payback.toFixed(1) + ' years' : '—') + '</strong></td></tr>'
      + '<tr><td>Extra premiums paid over 5 years</td><td>' + fmt(fiveYr) + '</td></tr>'
      + '</tbody></table></div>'
      + '<p><strong>Verdict:</strong> ' + verdict + '</p>'
      + '<p class="meta">Rule of thumb: when annual full-coverage surcharge exceeds ~10% of the car’s value, liability-only usually wins. Estimates only.</p>';
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
