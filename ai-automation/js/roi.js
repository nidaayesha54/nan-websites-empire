/* AI automation ROI calculator */
function aiRoiCalc() {
  var hourly = parseFloat(document.getElementById('roi-hourly').value) || 0;
  var hrsWeek = parseFloat(document.getElementById('roi-hours').value) || 0;
  var automatable = parseFloat(document.getElementById('roi-auto').value) || 0;
  var toolCost = parseFloat(document.getElementById('roi-toolcost').value) || 0;
  var setupHrs = parseFloat(document.getElementById('roi-setup').value) || 0;

  var out = document.getElementById('roi-result');
  if (hourly <= 0 || hrsWeek <= 0) {
    out.innerHTML = '<p>Enter your hourly cost and weekly repetitive hours to see the numbers.</p>';
    return;
  }
  var savedHrsWeek = hrsWeek * (automatable / 100);
  var savedHrsYear = savedHrsWeek * 52;
  var grossYear = savedHrsYear * hourly;
  var toolYear = toolCost * 12;
  var setupCost = setupHrs * hourly;
  var netYear1 = grossYear - toolYear - setupCost;
  var netYearly = grossYear - toolYear;
  var paybackWeeks = netYearly > 0 ? Math.max(1, Math.ceil((setupCost + toolCost) / (netYearly / 52))) : Infinity;
  var roiPct = (toolYear + setupCost) > 0 ? Math.round((netYear1 / (toolYear + setupCost)) * 100) : 0;

  function money(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }
  var verdict = netYear1 > 0
    ? '✅ Worth automating — first-year net gain of <b>' + money(netYear1) + '</b>.'
    : '⚠️ Tight case — reduce setup time or tool cost, or pick a higher-volume task first.';
  out.innerHTML =
    '<p>' + verdict + '</p>' +
    '<table><tr><th>Metric</th><th>Value</th></tr>' +
    '<tr><td>Hours saved / week</td><td><b>' + savedHrsWeek.toFixed(1) + 'h</b></td></tr>' +
    '<tr><td>Hours saved / year</td><td><b>' + Math.round(savedHrsYear).toLocaleString() + 'h</b></td></tr>' +
    '<tr><td>Gross value of time saved / year</td><td><b>' + money(grossYear) + '</b></td></tr>' +
    '<tr><td>Tool cost / year</td><td>' + money(toolYear) + '</td></tr>' +
    '<tr><td>One-time setup cost</td><td>' + money(setupCost) + '</td></tr>' +
    '<tr><td>Net gain year 1</td><td><b>' + money(netYear1) + '</b></td></tr>' +
    '<tr><td>Net gain / year after</td><td><b>' + money(netYearly) + '</b></td></tr>' +
    '<tr><td>First-year ROI</td><td><b>' + roiPct + '%</b></td></tr>' +
    '<tr><td>Payback period</td><td><b>' + (isFinite(paybackWeeks) ? paybackWeeks + ' weeks' : '—') + '</b></td></tr></table>' +
    '<p style="color:var(--muted);font-size:.88rem">Estimates only — not financial advice. Real savings depend on adoption and task variability.</p>';
}
document.addEventListener('DOMContentLoaded', function () {
  ['roi-hourly', 'roi-hours', 'roi-auto', 'roi-toolcost', 'roi-setup'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', aiRoiCalc);
  });
  var rng = document.getElementById('roi-auto');
  var lbl = document.getElementById('roi-auto-lbl');
  if (rng && lbl) rng.addEventListener('input', function () { lbl.textContent = rng.value + '%'; });
});
