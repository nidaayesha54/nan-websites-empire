'use strict';
/* True annual cost = 12 x monthly premium + patient share of medical bills.
   patient share = min(OOPmax, min(bills, deductible) + coinsurance% x max(0, bills - deductible)) */
var SCENARIOS = [
  { name: 'Low usage', bills: 1500, note: 'checkups + one minor issue' },
  { name: 'Medium usage', bills: 8000, note: 'ER visit or outpatient surgery' },
  { name: 'High usage', bills: 30000, note: 'hospitalization / chronic care' }
];
function patientCost(bills, ded, oop, coinPct) {
  var c = Math.max(0, Math.min(100, coinPct)) / 100;
  return Math.min(oop, Math.min(bills, ded) + c * Math.max(0, bills - ded));
}
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('pcForm');
  var result = document.getElementById('pcResult');
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function readPlan(i) {
    function n(id, dflt) {
      var v = parseFloat(document.getElementById(id).value);
      return (isNaN(v) || v < 0) ? dflt : v;
    }
    return {
      name: document.getElementById('pc' + i + 'name').value.trim() || ('Plan ' + 'ABC'[i]),
      prem: n('pc' + i + 'prem', 0),
      ded: n('pc' + i + 'ded', 0),
      oop: n('pc' + i + 'oop', 0),
      coin: n('pc' + i + 'coin', 20)
    };
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var plans = [readPlan(0), readPlan(1), readPlan(2)];
    var totals = plans.map(function (p) {
      return SCENARIOS.map(function (s) {
        return 12 * p.prem + patientCost(s.bills, p.ded, p.oop, p.coin);
      });
    });
    var winners = SCENARIOS.map(function (s, si) {
      var best = 0;
      for (var pi = 1; pi < plans.length; pi++) {
        if (totals[pi][si] < totals[best][si]) best = pi;
      }
      return best;
    });
    var winCount = [0, 0, 0];
    winners.forEach(function (w) { winCount[w]++; });
    var overall = winCount.indexOf(Math.max.apply(null, winCount));
    var head = '<tr><th>Plan</th>' + SCENARIOS.map(function (s) {
      return '<th>' + s.name + '<br><span style="font-weight:400;font-size:.8rem">(' + fmt(s.bills) + ' in bills)</span></th>';
    }).join('') + '</tr>';
    var rows = plans.map(function (p, pi) {
      var cells = totals[pi].map(function (t, si) { return '<td>' + fmt(t) + '</td>'; }).join('');
      return '<tr class="' + (pi === overall ? 'winner' : '') + '"><td><strong>' + p.name + '</strong><br>'
        + '<span style="font-size:.8rem;color:var(--muted)">' + fmt(p.prem) + '/mo · ' + fmt(p.ded)
        + ' ded · ' + fmt(p.oop) + ' OOP max</span></td>' + cells + '</tr>';
    }).join('');
    var verdict = '<p><strong>Winner overall: ' + plans[overall].name + '</strong> — cheapest in '
      + winCount[overall] + ' of 3 scenarios. ';
    var perScenario = SCENARIOS.map(function (s, si) {
      return s.name + ': <strong>' + plans[winners[si]].name + '</strong> (' + fmt(totals[winners[si]][si]) + ')';
    }).join(' · ');
    verdict += 'By scenario — ' + perScenario + '.</p>'
      + '<p class="meta">Estimates assume all care is in-network and copays are folded into the bill totals. Real costs vary by plan details and providers.</p>';
    result.innerHTML = '<h2>True annual cost comparison</h2>'
      + '<div class="table-wrap"><table><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>'
      + verdict;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
