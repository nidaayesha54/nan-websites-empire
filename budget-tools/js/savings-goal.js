// Savings goal tracker with localStorage persistence
(function () {
  'use strict';
  var KEY = 'budgettools_savings_goal_v1';
  var fmt = function (n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  var parse = function (v) { var n = parseFloat(v); return isNaN(n) || n < 0 ? 0 : n; };
  var ids = ['goal', 'current', 'monthly', 'apy'];

  function readInputs() {
    var o = {};
    ids.forEach(function (id) { o[id] = parse(document.getElementById(id).value); });
    return o;
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(readInputs())); } catch (e) { /* storage unavailable */ }
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return;
      var o = JSON.parse(raw);
      ids.forEach(function (id) {
        if (typeof o[id] === 'number') document.getElementById(id).value = o[id];
      });
    } catch (e) { /* ignore */ }
  }

  function monthName(date) {
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  function calc() {
    var d = readInputs();
    var err = document.getElementById('err');
    var res = document.getElementById('results');
    err.textContent = '';

    if (d.goal <= 0) { err.textContent = 'Please enter your savings goal amount.'; res.classList.remove('show'); return; }
    if (d.monthly <= 0) { err.textContent = 'Please enter a monthly contribution greater than $0.'; res.classList.remove('show'); return; }

    var r = d.apy / 100 / 12;
    var balance = d.current;
    var months = 0;
    while (balance < d.goal && months < 1200) {
      balance = (balance + d.monthly) * (1 + r);
      months++;
    }
    var done = new Date();
    done.setMonth(done.getMonth() + months);
    var progress = Math.min(100, (d.current / d.goal) * 100);
    var interestEarned = Math.max(0, balance - d.current - d.monthly * months);

    var html = '<h3>Your Savings Timeline</h3>' +
      '<div class="kv"><span>Goal</span><b>' + fmt(d.goal) + '</b></div>' +
      '<div class="kv"><span>Current progress</span><b>' + progress.toFixed(1) + '%</b></div>' +
      '<div class="progress"><div style="width:' + progress.toFixed(1) + '%"></div></div>' +
      '<div class="kv"><span>Months to goal</span><b>' + months + ' months</b></div>' +
      '<div class="kv"><span>Estimated goal date</span><b>' + monthName(done) + '</b></div>' +
      '<div class="kv"><span>Interest earned along the way</span><b>' + fmt(interestEarned) + '</b></div>' +
      '<div class="verdict">Contributing <b>' + fmt(d.monthly) + '/month</b> at <b>' + d.apy + '% APY</b>, you will reach <b>' + fmt(d.goal) + '</b> in <b>' + months + ' months</b> (' + monthName(done) + ').</div>';
    res.innerHTML = html;
    res.classList.add('show');
    save();
  }

  document.addEventListener('DOMContentLoaded', function () {
    load();
    document.getElementById('calcBtn').addEventListener('click', calc);
    ids.forEach(function (id) {
      document.getElementById(id).addEventListener('input', function () { save(); });
    });
    calc();
  });
})();
