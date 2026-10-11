/* Student Loan Payoff Planner: months to payoff + extra-payment comparison */
(function () {
  'use strict';

  // Returns months to payoff, or Infinity if the payment never covers interest
  function monthsToPayoff(balance, apr, payment) {
    var r = apr / 12;
    if (balance <= 0) return 0;
    if (payment <= r * balance) return Infinity;
    return Math.ceil(-Math.log(1 - (r * balance) / payment) / Math.log(1 + r));
  }

  // Simulate to get total interest paid for a given monthly payment
  function totalInterest(balance, apr, payment) {
    var r = apr / 12, bal = balance, interest = 0;
    var guard = 0;
    while (bal > 0 && guard < 1200) {
      var i = bal * r;
      interest += i;
      bal = bal + i - Math.min(payment, bal + i);
      guard++;
    }
    return { interest: interest, months: guard };
  }

  function fmt(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }
  function fmtTime(months) {
    var y = Math.floor(months / 12), m = months % 12;
    return y > 0 ? y + ' yrs ' + m + ' mo' : m + ' months';
  }

  function init() {
    var btn = document.getElementById('calcBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var balance = parseFloat(document.getElementById('balance').value) || 0;
      var apr = (parseFloat(document.getElementById('rate').value) || 0) / 100;
      var payment = parseFloat(document.getElementById('payment').value) || 0;
      var extra = parseFloat(document.getElementById('extra').value) || 0;

      if (balance <= 0 || payment <= 0) {
        document.getElementById('results').innerHTML = '<p>Enter your balance and monthly payment.</p>';
        return;
      }
      var base = totalInterest(balance, apr, payment);
      var html = '';
      if (base.months >= 1200 || !isFinite(monthsToPayoff(balance, apr, payment))) {
        html = '<div class="result-big">Never</div>';
        html += '<p>Your payment of ' + fmt(payment) + ' does not cover the monthly interest (' +
          fmt(balance * (apr / 12)) + '). Increase your payment to make progress.</p>';
      } else {
        var boosted = totalInterest(balance, apr, payment + extra);
        var saved = base.interest - boosted.interest;
        var monthsSaved = base.months - boosted.months;

        html = '<div class="result-big">' + fmtTime(base.months) + '</div>';
        html += '<p class="note">Time to payoff at ' + fmt(payment) + '/month</p>';
        html += '<div class="stat-grid">';
        html += '<div class="stat"><div class="v">' + fmt(base.interest) + '</div><div class="l">Total interest paid</div></div>';
        html += '<div class="stat"><div class="v">' + fmt(base.interest + balance) + '</div><div class="l">Total repaid</div></div>';
        html += '</div>';
        if (extra > 0) {
          html += '<h3>With an extra ' + fmt(extra) + '/month</h3>';
          html += '<div class="stat-grid">';
          html += '<div class="stat"><div class="v">' + fmtTime(boosted.months) + '</div><div class="l">New payoff time</div></div>';
          html += '<div class="stat"><div class="v">' + fmt(saved) + '</div><div class="l">Interest saved</div></div>';
          html += '</div>';
          html += '<p>You would be debt-free <strong>' + fmtTime(monthsSaved) + '</strong> sooner.</p>';
        }
      }
      html += '<p class="note">Standard 10-year plan estimate; federal loans may offer income-driven options. ' +
        'Educational purposes only — not financial advice.</p>';
      document.getElementById('results').innerHTML = html;
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  if (typeof window !== 'undefined') {
    window.__payoffMonths = monthsToPayoff;
    window.__payoffInterest = totalInterest;
  }
})();
