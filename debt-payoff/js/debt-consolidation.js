// Debt consolidation comparison: current debts vs one consolidation loan
(function () {
  'use strict';
  var MAX_DEBTS = 8;
  var fmt = function (n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  var parse = function (v) { var n = parseFloat(v); return isNaN(n) || n < 0 ? 0 : n; };

  function makeRow(d) {
    d = d || { balance: '', apr: '', min: '' };
    var row = document.createElement('div');
    row.className = 'debt-row';
    row.innerHTML =
      '<input type="text" class="d-name" placeholder="Debt name" value="' + String(d.name || '').replace(/"/g, '&quot;') + '" aria-label="Debt name">' +
      '<input type="number" class="d-bal" placeholder="Balance $" min="0" step="1" value="' + d.balance + '" aria-label="Balance">' +
      '<input type="number" class="d-apr" placeholder="APR %" min="0" max="100" step="0.1" value="' + d.apr + '" aria-label="APR">' +
      '<input type="number" class="d-min" placeholder="Min pay $" min="0" step="1" value="' + d.min + '" aria-label="Minimum payment">' +
      '<button type="button" class="rm btn-calc" style="padding:8px 12px;margin:0" aria-label="Remove debt">✕</button>';
    return row;
  }

  // Simulate paying only minimums. Returns {months, interest} or null if stuck.
  function simMins(debts) {
    var ds = debts.map(function (d) { return { balance: d.balance, apr: d.apr, min: d.min }; });
    var interest = 0, months = 0;
    while (months < 1200) {
      if (!ds.some(function (d) { return d.balance > 0.005; })) break;
      months++;
      var stuck = true;
      ds.forEach(function (d) {
        if (d.balance <= 0.005) return;
        var i = d.balance * d.apr / 100 / 12;
        d.balance += i;
        interest += i;
        var pay = Math.min(d.min, d.balance);
        d.balance -= pay;
        if (pay > i) stuck = false;
      });
      if (stuck && months > 1) return null;
    }
    var remaining = ds.reduce(function (s, d) { return s + Math.max(0, d.balance); }, 0);
    if (remaining > 1) return null;
    return { months: months, interest: interest };
  }

  function run() {
    var debts = [];
    document.querySelectorAll('#debtRows .debt-row').forEach(function (row, i) {
      var balance = parse(row.querySelector('.d-bal').value);
      if (balance > 0) {
        debts.push({
          name: row.querySelector('.d-name').value.trim() || ('Debt ' + (i + 1)),
          balance: balance,
          apr: parse(row.querySelector('.d-apr').value),
          min: parse(row.querySelector('.d-min').value)
        });
      }
    });
    var rate = parse(document.getElementById('rate').value);
    var term = parseInt(document.getElementById('term').value, 10) || 0;
    var fees = parse(document.getElementById('fees').value);
    var err = document.getElementById('err');
    var res = document.getElementById('results');
    err.textContent = '';

    if (debts.length < 1) { err.textContent = 'Enter at least one debt.'; res.classList.remove('show'); return; }
    if (term <= 0) { err.textContent = 'Enter the consolidation loan term in months.'; res.classList.remove('show'); return; }

    var totalBal = debts.reduce(function (s, d) { return s + d.balance; }, 0);
    var totalMins = debts.reduce(function (s, d) { return s + d.min; }, 0);
    var cur = simMins(debts);

    var loanAmt = totalBal + fees;
    var r = rate / 100 / 12;
    var loanPmt = r > 0 ? loanAmt * r / (1 - Math.pow(1 + r, -term)) : loanAmt / term;
    var loanTotal = loanPmt * term;
    var loanInterest = loanTotal - loanAmt;

    var html = '<h3>Consolidation Comparison</h3>' +
      '<table class="data"><tr><th></th><th>Current debts (minimums)</th><th>Consolidation loan</th></tr>' +
      '<tr><td><b>Monthly payment</b></td><td>' + fmt(totalMins) + '</td><td><b>' + fmt(loanPmt) + '</b></td></tr>' +
      '<tr><td><b>Time to debt-free</b></td><td>' + (cur ? cur.months + ' months' : 'Never (minimums don\'t cover interest)') + '</td><td>' + term + ' months</td></tr>' +
      '<tr><td><b>Total interest + fees</b></td><td>' + (cur ? fmt(cur.interest) : '—') + '</td><td>' + fmt(loanInterest + fees) + '</td></tr>' +
      '<tr><td><b>Total paid overall</b></td><td>' + (cur ? fmt(totalBal + cur.interest) : '—') + '</td><td><b>' + fmt(loanTotal) + '</b></td></tr></table>';

    var verdict;
    if (!cur) {
      verdict = '⚠ Your current minimums never pay off the debt, so <b>almost any consolidation loan is better</b> — it gives you a fixed finish line of ' + term + ' months at ' + fmt(loanPmt) + '/month.';
    } else {
      var curTotal = totalBal + cur.interest;
      var save = curTotal - loanTotal;
      if (save > 0.01) {
        verdict = '✅ <b>Consolidation saves you ' + fmt(save) + '</b> overall (' + fmt(curTotal) + ' → ' + fmt(loanTotal) + ') and finishes in a fixed ' + term + ' months. Watch out: don\'t run the old cards back up.';
      } else if (save < -0.01) {
        verdict = '❌ <b>Consolidation costs ' + fmt(-save) + ' MORE</b> than staying the course. The lower monthly payment (' + fmt(loanPmt) + ' vs ' + fmt(totalMins) + ') isn\'t worth the extra total cost — unless you need the cash flow to avoid missing payments.';
      } else {
        verdict = '🤝 <b>About even</b> on total cost. Consolidation still simplifies life to one payment with a fixed end date — which has real value if juggling minimums stresses you out.';
      }
    }
    html += '<div class="verdict">' + verdict + '</div>' +
      '<p style="color:var(--muted);font-size:.9rem">Assumes minimum-only payments on current debts and no new borrowing on either path. Origination fees are rolled into the loan amount above.</p>';
    res.innerHTML = html;
    res.classList.add('show');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var rows = document.getElementById('debtRows');
    rows.appendChild(makeRow({ name: 'Card A', balance: 6000, apr: 24.99, min: 150 }));
    rows.appendChild(makeRow({ name: 'Card B', balance: 3500, apr: 19.99, min: 90 }));
    document.getElementById('addDebt').addEventListener('click', function () {
      if (rows.querySelectorAll('.debt-row').length >= MAX_DEBTS) return;
      rows.appendChild(makeRow({}));
    });
    rows.addEventListener('click', function (e) {
      var btn = e.target.closest('.rm');
      if (btn) btn.closest('.debt-row').remove();
    });
    document.getElementById('calcBtn').addEventListener('click', run);
  });
})();
