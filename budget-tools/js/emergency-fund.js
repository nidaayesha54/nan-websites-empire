// Emergency fund calculator
(function () {
  'use strict';
  var fmt = function (n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  var parse = function (v) { var n = parseFloat(v); return isNaN(n) || n < 0 ? 0 : n; };

  function monthName(date) {
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  function calc() {
    var expenses = parse(document.getElementById('expenses').value);
    var monthsSel = parseInt(document.getElementById('monthsSel').value, 10) || 6;
    var saved = parse(document.getElementById('saved').value);
    var monthly = parse(document.getElementById('monthly').value);
    var err = document.getElementById('err');
    var res = document.getElementById('results');
    err.textContent = '';

    if (expenses <= 0) { err.textContent = 'Please enter your monthly essential expenses.'; res.classList.remove('show'); return; }
    if (monthly <= 0) { err.textContent = 'Please enter how much you can save per month.'; res.classList.remove('show'); return; }

    var target = expenses * monthsSel;
    var gap = Math.max(0, target - saved);
    var monthsToGo = gap <= 0 ? 0 : Math.ceil(gap / monthly);
    var done = new Date();
    done.setMonth(done.getMonth() + monthsToGo);

    var html = '<h3>Your Emergency Fund Plan</h3>' +
      '<div class="kv"><span>Monthly essential expenses</span><b>' + fmt(expenses) + '</b></div>' +
      '<div class="kv"><span>Target (' + monthsSel + ' months)</span><b>' + fmt(target) + '</b></div>' +
      '<div class="kv"><span>Already saved</span><b>' + fmt(saved) + '</b></div>' +
      '<div class="kv"><span>Still needed</span><b>' + fmt(gap) + '</b></div>';
    if (monthsToGo === 0) {
      html += '<div class="verdict">🎉 <b>Congratulations — your emergency fund is fully funded!</b> Keep it in a high-yield savings account and only touch it for true emergencies.</div>';
    } else {
      html += '<div class="kv"><span>Monthly savings</span><b>' + fmt(monthly) + '</b></div>' +
        '<div class="kv"><span>Months to reach target</span><b>' + monthsToGo + ' months</b></div>' +
        '<div class="kv"><span>Estimated completion</span><b>' + monthName(done) + '</b></div>' +
        '<div class="verdict">Saving <b>' + fmt(monthly) + '/month</b>, you will hit your <b>' + fmt(target) + '</b> goal in about <b>' + monthsToGo + ' months</b> (' + monthName(done) + ').</div>';
    }
    res.innerHTML = html;
    res.classList.add('show');
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('calcBtn').addEventListener('click', calc);
  });
})();
