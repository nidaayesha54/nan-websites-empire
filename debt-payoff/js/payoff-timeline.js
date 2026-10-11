// Single-debt payoff timeline with extra-payment slider
(function () {
  'use strict';
  var fmt = function (n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  var parse = function (v) { var n = parseFloat(v); return isNaN(n) || n < 0 ? 0 : n; };

  function monthName(date) {
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  // Amortize balance at monthly rate r with fixed payment pmt.
  // Returns {months, interest} or null if payment never covers interest.
  function amortize(balance, r, pmt) {
    if (pmt <= balance * r) return null;
    var months = 0, interest = 0, bal = balance;
    while (bal > 0.005 && months < 1200) {
      var i = bal * r;
      bal += i;
      interest += i;
      bal -= Math.min(pmt, bal);
      months++;
    }
    return { months: months, interest: interest };
  }

  function calc() {
    var balance = parse(document.getElementById('balance').value);
    var apr = parse(document.getElementById('apr').value);
    var payment = parse(document.getElementById('payment').value);
    var extra = parse(document.getElementById('extra').value);
    var err = document.getElementById('err');
    var res = document.getElementById('results');
    err.textContent = '';
    document.getElementById('extraVal').textContent = fmt(extra);

    if (balance <= 0) { err.textContent = 'Please enter your current balance.'; res.classList.remove('show'); return; }
    if (payment <= 0) { err.textContent = 'Please enter your monthly payment.'; res.classList.remove('show'); return; }

    var r = apr / 100 / 12;
    var base = amortize(balance, r, payment);
    if (!base) {
      err.textContent = 'Your payment of ' + fmt(payment) + ' doesn\'t cover the monthly interest (' + fmt(balance * r) + '). Increase your payment.';
      res.classList.remove('show');
      return;
    }
    var withExtra = extra > 0 ? amortize(balance, r, payment + extra) : null;

    function block(label, a, pmt) {
      var done = new Date();
      done.setMonth(done.getMonth() + a.months);
      return '<div class="kv"><span>' + label + ' — months to debt-free</span><b>' + a.months + '</b></div>' +
        '<div class="kv"><span>' + label + ' — total interest</span><b>' + fmt(a.interest) + '</b></div>' +
        '<div class="kv"><span>' + label + ' — debt-free date</span><b>' + monthName(done) + '</b></div>' +
        '<div class="kv"><span>' + label + ' — total paid</span><b>' + fmt(balance + a.interest) + '</b></div>';
    }

    var html = '<h3>Your Payoff Timeline</h3>' + block('Base plan (' + fmt(payment) + '/mo)', base, payment);
    if (withExtra) {
      var done2 = new Date();
      done2.setMonth(done2.getMonth() + withExtra.months);
      html += '<hr style="border:none;border-top:1px solid var(--line);margin:14px 0">' +
        block('With extra (' + fmt(payment + extra) + '/mo)', withExtra, payment + extra) +
        '<div class="verdict">💪 Adding <b>' + fmt(extra) + '/month</b> gets you debt-free <b>' + (base.months - withExtra.months) + ' months sooner</b> and saves <b>' + fmt(base.interest - withExtra.interest) + '</b> in interest.</div>';
    } else {
      html += '<div class="verdict">Move the slider to see how extra payments shrink your timeline.</div>';
    }
    res.innerHTML = html;
    res.classList.add('show');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var extra = document.getElementById('extra');
    extra.addEventListener('input', calc);
    document.getElementById('calcBtn').addEventListener('click', calc);
    calc();
  });
})();
