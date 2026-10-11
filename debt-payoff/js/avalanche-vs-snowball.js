// Avalanche vs Snowball month-by-month simulator
(function () {
  'use strict';
  var MAX_DEBTS = 6;
  var fmt = function (n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  var parse = function (v) { var n = parseFloat(v); return isNaN(n) || n < 0 ? 0 : n; };

  function makeRow(i, d) {
    d = d || { name: '', balance: '', apr: '', min: '' };
    var row = document.createElement('div');
    row.className = 'debt-row';
    row.innerHTML =
      '<input type="text" class="d-name" placeholder="Debt name (e.g. Visa)" value="' + String(d.name).replace(/"/g, '&quot;') + '" aria-label="Debt name">' +
      '<input type="number" class="d-bal" placeholder="Balance $" min="0" step="1" value="' + d.balance + '" aria-label="Balance">' +
      '<input type="number" class="d-apr" placeholder="APR %" min="0" max="100" step="0.1" value="' + d.apr + '" aria-label="APR">' +
      '<input type="number" class="d-min" placeholder="Min pay $" min="0" step="1" value="' + d.min + '" aria-label="Minimum payment">' +
      '<button type="button" class="rm btn-calc" style="padding:8px 12px;margin:0" aria-label="Remove debt">✕</button>';
    return row;
  }

  function getDebts() {
    var out = [];
    document.querySelectorAll('#debtRows .debt-row').forEach(function (row, i) {
      var name = row.querySelector('.d-name').value.trim() || ('Debt ' + (i + 1));
      var balance = parse(row.querySelector('.d-bal').value);
      var apr = parse(row.querySelector('.d-apr').value);
      var min = parse(row.querySelector('.d-min').value);
      if (balance > 0) out.push({ name: name, balance: balance, apr: apr, min: min });
    });
    return out;
  }

  // Month-by-month simulation. Returns {months, totalInterest, order[], failed}
  function simulate(debts, extra, strategy) {
    var ds = debts.map(function (d) {
      return { name: d.name, balance: d.balance, apr: d.apr, min: d.min, payoffMonth: 0 };
    });
    var totalInterest = 0, months = 0, order = [];
    while (months < 1200) {
      var anyLeft = ds.some(function (d) { return d.balance > 0.005; });
      if (!anyLeft) break;
      months++;
      ds.forEach(function (d) {
        if (d.balance > 0.005) {
          var i = d.balance * d.apr / 100 / 12;
          d.balance += i;
          totalInterest += i;
        }
      });
      var unpaid = ds.filter(function (d) { return d.balance > 0.005; });
      unpaid.sort(function (a, b) {
        if (strategy === 'avalanche') return (b.apr - a.apr) || (a.balance - b.balance);
        return (a.balance - b.balance) || (b.apr - a.apr);
      });
      // minimum payments on all unpaid debts
      unpaid.forEach(function (d) {
        var pay = Math.min(d.min, d.balance);
        d.balance -= pay;
      });
      // extra payment goes to the top-priority target
      var pool = extra;
      for (var k = 0; k < unpaid.length && pool > 0.005; k++) {
        var t = unpaid[k];
        if (t.balance <= 0.005) continue;
        var p = Math.min(pool, t.balance);
        t.balance -= p;
        pool -= p;
      }
      unpaid.forEach(function (d) {
        if (d.balance <= 0.005 && !d.payoffMonth) {
          d.payoffMonth = months;
          order.push({ name: d.name, month: months });
        }
      });
    }
    var remaining = ds.reduce(function (s, d) { return s + Math.max(0, d.balance); }, 0);
    return { months: months, totalInterest: totalInterest, order: order, failed: remaining > 1 };
  }

  function panel(title, desc, r) {
    var html = '<div class="card"><h3>' + title + '</h3><p>' + desc + '</p>';
    if (r.failed) {
      html += '<p class="warn-text">⚠ These payments never clear the debt — minimums don\'t cover the interest. Increase your payment.</p>';
    } else {
      html += '<div class="kv"><span>Debt-free in</span><b>' + r.months + ' months</b></div>' +
        '<div class="kv"><span>Total interest paid</span><b>' + fmt(r.totalInterest) + '</b></div>' +
        '<h4>Payoff order</h4><ol>' +
        r.order.map(function (o) { return '<li>' + o.name + ' — month ' + o.month + '</li>'; }).join('') +
        '</ol>';
    }
    return html + '</div>';
  }

  function run() {
    var debts = getDebts();
    var extra = parse(document.getElementById('extra').value);
    var err = document.getElementById('err');
    var res = document.getElementById('results');
    err.textContent = '';
    if (debts.length < 1) { err.textContent = 'Enter at least one debt with a balance.'; res.classList.remove('show'); return; }

    var av = simulate(debts, extra, 'avalanche');
    var sn = simulate(debts, extra, 'snowball');

    var html = '<h3>Simulation Results</h3><div class="grid">' +
      panel('🏔️ Avalanche', 'Highest APR first — mathematically cheapest.', av) +
      panel('⛄ Snowball', 'Smallest balance first — fastest first win.', sn) +
      '</div>';

    var verdict;
    if (av.failed && sn.failed) {
      verdict = '⚠ <b>Neither strategy works with these payments</b> — your minimums don\'t cover monthly interest, so balances grow. You need a higher monthly payment (or professional help) before any strategy can succeed.';
    } else if (av.failed) {
      verdict = '⛄ <b>Snowball wins by default</b> — avalanche payments never clear the debt, while snowball pays everything off in ' + sn.months + ' months.';
    } else if (sn.failed) {
      verdict = '🏔️ <b>Avalanche wins by default</b> — snowball payments never clear the debt, while avalanche pays everything off in ' + av.months + ' months.';
    } else {
      var diff = Math.abs(av.totalInterest - sn.totalInterest);
      if (diff < 0.01) {
        verdict = '🤝 <b>It\'s a tie!</b> With these numbers both strategies cost the same (' + fmt(av.totalInterest) + ' interest, ' + av.months + ' months). Pick whichever keeps you motivated.';
      } else if (av.totalInterest <= sn.totalInterest) {
        verdict = '🏔️ <b>Avalanche wins.</b> It pays everything off in ' + av.months + ' months with ' + fmt(av.totalInterest) + ' interest vs snowball\'s ' + fmt(sn.totalInterest) + ' — saving you <b>' + fmt(diff) + '</b>.' +
          (sn.order.length && av.order.length && sn.order[0].month < av.order[0].month ? ' Snowball does kill your first debt sooner (month ' + sn.order[0].month + ' vs ' + av.order[0].month + '), so pick snowball if you need quick wins.' : '');
      } else {
        verdict = '⛄ <b>Snowball wins.</b> It costs ' + fmt(sn.totalInterest) + ' in interest vs avalanche\'s ' + fmt(av.totalInterest) + ' — saving you <b>' + fmt(diff) + '</b>. (Rare, but it happens when rate differences are small.)';
      }
    }
    html += '<div class="verdict">' + verdict + '</div>';
    res.innerHTML = html;
    res.classList.add('show');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var rows = document.getElementById('debtRows');
    rows.appendChild(makeRow(0, { name: 'Credit card', balance: 5000, apr: 24.99, min: 125 }));
    rows.appendChild(makeRow(1, { name: 'Car loan', balance: 9000, apr: 7.9, min: 210 }));
    document.getElementById('addDebt').addEventListener('click', function () {
      if (rows.querySelectorAll('.debt-row').length >= MAX_DEBTS) return;
      rows.appendChild(makeRow(rows.querySelectorAll('.debt-row').length, {}));
    });
    rows.addEventListener('click', function (e) {
      var btn = e.target.closest('.rm');
      if (btn) btn.closest('.debt-row').remove();
    });
    document.getElementById('calcBtn').addEventListener('click', run);
  });
})();
