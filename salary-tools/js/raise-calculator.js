// Raise impact calculator: new salary, differences, real raise after inflation
(function () {
  'use strict';
  var fmt$ = function (n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  var parse = function (v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; };

  function calc() {
    var salary = parse(document.getElementById('salary').value);
    var raisePct = parse(document.getElementById('raisePct').value);
    var inflation = parse(document.getElementById('inflation').value);
    var err = document.getElementById('err');
    var res = document.getElementById('results');
    err.textContent = '';

    if (salary <= 0) { err.textContent = 'Please enter your current annual salary.'; res.classList.remove('show'); return; }

    var newSalary = salary * (1 + raisePct / 100);
    var annualDiff = newSalary - salary;
    var monthlyDiff = annualDiff / 12;
    var biweeklyDiff = annualDiff / 26;
    var realRaise = ((1 + raisePct / 100) / (1 + inflation / 100) - 1) * 100;

    var verdict;
    if (realRaise > 0.05) {
      verdict = '🎉 That\'s a <b>real raise</b> — your purchasing power grows by about <b>' + realRaise.toFixed(2) + '%</b> after inflation.';
    } else if (realRaise < -0.05) {
      verdict = '⚠️ After ' + inflation + '% inflation, this is effectively a <b>pay cut of ' + Math.abs(realRaise).toFixed(2) + '%</b> in purchasing power. Consider negotiating higher — see our <a href="../guides/negotiate-raise-2026.html">raise negotiation guide</a>.';
    } else {
      verdict = '➖ This raise roughly <b>matches inflation</b> — your purchasing power stays flat at about ' + realRaise.toFixed(2) + '% real growth.';
    }

    res.innerHTML = '<h3>Your Raise Impact</h3>' +
      '<div class="kv"><span>Current salary</span><b>' + fmt$(salary) + '</b></div>' +
      '<div class="kv"><span>New salary (' + raisePct + '%)</span><b>' + fmt$(newSalary) + '</b></div>' +
      '<div class="kv"><span>Annual difference</span><b>+' + fmt$(annualDiff) + '</b></div>' +
      '<div class="kv"><span>Monthly difference</span><b>+' + fmt$(monthlyDiff) + '</b></div>' +
      '<div class="kv"><span>Per-paycheck difference (biweekly)</span><b>+' + fmt$(biweeklyDiff) + '</b></div>' +
      '<div class="kv"><span>Real raise after ' + inflation + '% inflation</span><b>' + realRaise.toFixed(2) + '%</b></div>' +
      '<div class="verdict">' + verdict + '</div>';
    res.classList.add('show');
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('calcBtn').addEventListener('click', calc);
    calc();
  });
})();
