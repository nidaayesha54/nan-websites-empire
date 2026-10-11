'use strict';
/* 6-month premium estimator. Factors multiply a $800 national base 6-month premium. */
var STATE_F = { AL:1.00, AK:1.10, AZ:1.10, AR:1.00, CA:1.22, CO:1.08, CT:1.08, DE:1.10, DC:1.25,
  FL:1.35, GA:1.12, HI:1.05, ID:0.85, IL:1.08, IN:0.95, IA:0.85, KS:0.95, KY:1.00, LA:1.30,
  ME:0.82, MD:1.10, MA:1.05, MI:1.45, MN:0.95, MS:1.05, MO:0.98, MT:0.92, NE:0.92, NV:1.25,
  NH:0.88, NJ:1.28, NM:1.05, NY:1.32, NC:0.95, ND:0.90, OH:0.92, OK:1.05, OR:1.02, PA:1.00,
  RI:1.12, SC:1.05, SD:0.90, TN:0.98, TX:1.15, UT:0.95, VT:0.80, VA:0.95, WA:1.05,
  WV:0.95, WI:0.92, WY:0.95 };
var STATE_NAMES = { AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California', CO:'Colorado',
  CT:'Connecticut', DE:'Delaware', DC:'District of Columbia', FL:'Florida', GA:'Georgia', HI:'Hawaii',
  ID:'Idaho', IL:'Illinois', IN:'Indiana', IA:'Iowa', KS:'Kansas', KY:'Kentucky', LA:'Louisiana',
  ME:'Maine', MD:'Maryland', MA:'Massachusetts', MI:'Michigan', MN:'Minnesota', MS:'Mississippi',
  MO:'Missouri', MT:'Montana', NE:'Nebraska', NV:'Nevada', NH:'New Hampshire', NJ:'New Jersey',
  NM:'New Mexico', NY:'New York', NC:'North Carolina', ND:'North Dakota', OH:'Ohio', OK:'Oklahoma',
  OR:'Oregon', PA:'Pennsylvania', RI:'Rhode Island', SC:'South Carolina', SD:'South Dakota',
  TN:'Tennessee', TX:'Texas', UT:'Utah', VT:'Vermont', VA:'Virginia', WA:'Washington',
  WV:'West Virginia', WI:'Wisconsin', WY:'Wyoming' };
var AGE_F = { under25: 1.6, a25to39: 1.0, a40to64: 0.9, senior: 1.1 };
var RECORD_F = { clean: 1.0, ticket: 1.15, accident: 1.30, dui: 1.80 };
var COV_F = { liability: 0.55, standard: 1.0, full: 1.45 };
var BASE_6MO = 800;

function vehFactor(v) {
  if (v < 10000) return 0.85;
  if (v < 25000) return 1.0;
  if (v < 50000) return 1.15;
  return 1.3;
}
document.addEventListener('DOMContentLoaded', function () {
  var stateSel = document.getElementById('peState');
  Object.keys(STATE_F).sort().forEach(function (abbr) {
    var o = document.createElement('option');
    o.value = abbr; o.textContent = STATE_NAMES[abbr];
    if (abbr === 'TX') o.selected = true;
    stateSel.appendChild(o);
  });
  var form = document.getElementById('peForm');
  var result = document.getElementById('peResult');
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = parseFloat(document.getElementById('peValue').value);
    v = (isNaN(v) || v < 0) ? 20000 : v;
    var est = BASE_6MO
      * (STATE_F[stateSel.value] || 1.0)
      * AGE_F[document.getElementById('peAge').value]
      * vehFactor(v)
      * RECORD_F[document.getElementById('peRecord').value]
      * COV_F[document.getElementById('peCoverage').value];
    var low = est * 0.85, high = est * 1.2;
    result.innerHTML = '<h2>Estimated 6-month premium</h2>'
      + '<p class="big">' + fmt(low) + ' – ' + fmt(high) + '</p>'
      + '<div class="table-wrap"><table><thead><tr><th>Estimate</th><th>Per 6 months</th><th>Per month</th></tr></thead><tbody>'
      + '<tr><td>Low</td><td>' + fmt(low) + '</td><td>' + fmt(low / 6) + '</td></tr>'
      + '<tr><td>Average</td><td>' + fmt(est) + '</td><td>' + fmt(est / 6) + '</td></tr>'
      + '<tr><td>High</td><td>' + fmt(high) + '</td><td>' + fmt(high / 6) + '</td></tr>'
      + '</tbody></table></div>'
      + '<p class="meta">Labeled estimate, not a quote. Your real premium depends on the insurer, exact vehicle, mileage, credit (where allowed), and underwriting.</p>';
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
