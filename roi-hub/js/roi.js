/* ROIHub — ROI calculator logic (vanilla JS, auto-runs on load) */
(function () {
  'use strict';

  function fmtMoney(n) {
    if (!isFinite(n)) return '—';
    var sign = n < 0 ? '−' : '';
    return sign + '$' + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }
  function fmtPct(n) {
    if (!isFinite(n)) return '—';
    return n.toLocaleString('en-US', { maximumFractionDigits: 2 }) + '%';
  }
  function num(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) ? 0 : v;
  }

  function calcROI() {
    var invested = num('invested');
    var returned = num('returned');
    var years = num('years');
    var extra = num('extra'); // additional costs

    var totalCost = invested + extra;
    var profit = returned - totalCost;
    var roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    var ann = (years > 0 && totalCost > 0 && returned > 0)
      ? (Math.pow(returned / totalCost, 1 / years) - 1) * 100
      : 0;
    var multiple = totalCost > 0 ? returned / totalCost : 0;

    document.getElementById('r-roi').textContent = fmtPct(roi);
    document.getElementById('r-profit').textContent = fmtMoney(profit);
    document.getElementById('r-ann').textContent = years > 0 ? fmtPct(ann) : '—';
    document.getElementById('r-mult').textContent = isFinite(multiple) ? multiple.toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'x' : '—';

    var verdict = document.getElementById('r-verdict');
    if (totalCost <= 0) {
      verdict.textContent = 'Enter your investment amount to see the verdict.';
    } else if (roi < 0) {
      verdict.textContent = 'Negative ROI — this investment lost money. Reconsider before repeating it.';
    } else if (roi < 10) {
      verdict.textContent = 'Low ROI. It beat nothing much — a basic index fund averages ~10%/year historically.';
    } else if (roi < 50) {
      verdict.textContent = 'Solid ROI. A respectable return on your money.';
    } else {
      verdict.textContent = 'Excellent ROI! This investment significantly outperformed typical market returns.';
    }
  }

  function calcCAGR() {
    var start = num('c-start');
    var end = num('c-end');
    var yrs = num('c-years');

    var cagr = (start > 0 && end > 0 && yrs > 0)
      ? (Math.pow(end / start, 1 / yrs) - 1) * 100
      : 0;
    var growth = end - start;
    var totalPct = start > 0 ? (growth / start) * 100 : 0;

    document.getElementById('c-roi').textContent = fmtPct(cagr);
    document.getElementById('c-growth').textContent = fmtMoney(growth);
    document.getElementById('c-total').textContent = fmtPct(totalPct);
  }

  function bind(ids, fn) {
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', fn);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    bind(['invested', 'returned', 'years', 'extra'], calcROI);
    bind(['c-start', 'c-end', 'c-years'], calcCAGR);
    if (document.getElementById('invested')) calcROI();
    if (document.getElementById('c-start')) calcCAGR();
  });
})();
