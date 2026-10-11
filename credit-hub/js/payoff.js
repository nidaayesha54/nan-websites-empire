// Debt Payoff Planner — avalanche vs snowball with true monthly amortization.
(function () {
  'use strict';

  var debtCount = 0;

  function addDebtRow(name, balance, apr, minpay) {
    debtCount++;
    var wrap = document.getElementById('debts');
    var row = document.createElement('div');
    row.className = 'debt-row';
    row.dataset.id = debtCount;
    row.innerHTML =
      '<div class="field"><label>Debt name</label><input type="text" class="d-name" value="' + (name || '') + '" placeholder="e.g. Card A"></div>' +
      '<div class="field"><label>Balance ($)</label><input type="number" class="d-bal" min="0" step="0.01" value="' + (balance != null ? balance : '') + '"></div>' +
      '<div class="field"><label>APR %</label><input type="number" class="d-apr" min="0" step="0.01" value="' + (apr != null ? apr : '') + '"></div>' +
      '<div class="field"><label>Min pay ($)</label><input type="number" class="d-min" min="0" step="0.01" value="' + (minpay != null ? minpay : '') + '"></div>' +
      '<div class="field"><label>&nbsp;</label><button type="button" class="btn btn-ghost d-del" style="color:#e74c3c;border-color:#e74c3c;padding:8px 14px">✕</button></div>';
    wrap.appendChild(row);
    row.querySelector('.d-del').addEventListener('click', function () {
      if (wrap.children.length > 1) row.remove();
    });
  }

  function readDebts() {
    var debts = [];
    document.querySelectorAll('#debts .debt-row').forEach(function (row) {
      var bal = parseFloat(row.querySelector('.d-bal').value) || 0;
      var apr = parseFloat(row.querySelector('.d-apr').value) || 0;
      var min = parseFloat(row.querySelector('.d-min').value) || 0;
      var name = row.querySelector('.d-name').value.trim() || 'Debt ' + (debts.length + 1);
      if (bal > 0) debts.push({ name: name, balance: bal, apr: apr, min: min });
    });
    return debts;
  }

  // Simulate one strategy. order = 'avalanche' | 'snowball'
  function simulate(debts, extra, order) {
    var ds = debts.map(function (d) { return { name: d.name, balance: d.balance, apr: d.apr, min: d.min }; });
    // order debts
    var prio = ds.slice().sort(function (a, b) {
      return order === 'avalanche' ? b.apr - a.apr : a.balance - b.balance;
    });
    var totalInterest = 0, month = 0;
    var payoffOrder = [];
    var guard = 0;
    while (ds.some(function (d) { return d.balance > 0.005; }) && guard < 1200) {
      guard++; month++;
      // interest accrues
      ds.forEach(function (d) {
        if (d.balance > 0.005) {
          var i = d.balance * (d.apr / 100 / 12);
          d.balance += i; totalInterest += i;
        }
      });
      // minimums on every active debt
      var active = ds.filter(function (d) { return d.balance > 0.005; });
      active.forEach(function (d) {
        var pay = Math.min(d.min, d.balance);
        d.balance -= pay;
      });
      // freed minimums from fully-paid debts roll into the attack budget
      var freed = ds.filter(function (d) { return d.balance <= 0.005; })
                    .reduce(function (s, d) { return s + d.min; }, 0);
      var budget = extra + freed;
      // avalanche/snowball: hammer the priority target, spill over to the next
      var ordered = prio.filter(function (p) { return p.balance > 0.005; });
      for (var k = 0; k < ordered.length && budget > 0.005; k++) {
        var t = ordered[k];
        var pay2 = Math.min(t.balance, budget);
        t.balance -= pay2;
        budget -= pay2;
      }
      // check payoffs this month
      ds.forEach(function (d) {
        if (d.balance <= 0.005 && !d.paidAt) { d.balance = 0; d.paidAt = month; payoffOrder.push({ name: d.name, month: month }); }
      });
    }
    return { months: month, totalInterest: totalInterest, payoffOrder: payoffOrder,
             totalPaid: debts.reduce(function (s, d) { return s + d.balance; }, 0) + totalInterest };
  }

  function payoffDate(months) {
    var d = new Date();
    d.setMonth(d.getMonth() + months);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('payoff-form');
    if (!form) return;
    // seed 3 example rows
    addDebtRow('Credit Card A', 4500, 24.99, 120);
    addDebtRow('Credit Card B', 1800, 19.99, 55);
    addDebtRow('Personal Loan', 6000, 11.99, 180);
    document.getElementById('add-debt').addEventListener('click', function () { addDebtRow(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var out = document.getElementById('payoff-result');
      var debts = readDebts();
      if (debts.length === 0) { out.innerHTML = '<div class="result warn"><h3>No debts entered</h3><p>Add at least one debt with a balance above $0.</p></div>'; return; }
      var extra = parseFloat(document.getElementById('in-extra').value) || 0;
      var av = simulate(debts, extra, 'avalanche');
      var sn = simulate(debts, extra, 'snowball');
      var best = av.totalInterest <= sn.totalInterest ? 'avalanche' : 'snowball';
      var saveInt = Math.abs(av.totalInterest - sn.totalInterest);
      var saveMo = Math.abs(av.months - sn.months);

      function stratCard(title, r, tag) {
        var rows = r.payoffOrder.map(function (p, i) {
          return '<tr><td>' + (i + 1) + '</td><td>' + p.name + '</td><td>Month ' + p.month + '</td></tr>';
        }).join('');
        return '<div class="result' + (tag === 'best' ? '' : ' warn') + '" style="margin-top:16px">' +
          '<h3>' + title + ' ' + (tag === 'best' ? '<span class="tag good">SAVES MORE</span>' : '') + '</h3>' +
          '<p><strong>' + r.months + ' months</strong> · debt-free by <strong>' + payoffDate(r.months) + '</strong></p>' +
          '<p>Total interest: <strong>' + window.fmt$(r.totalInterest) + '</strong> · Total paid: <strong>' + window.fmt$(r.totalPaid) + '</strong></p>' +
          '<table class="data"><tr><th>#</th><th>Debt</th><th>Paid off</th></tr>' + rows + '</table></div>';
      }

      out.innerHTML =
        '<div class="result"><h3>Head-to-head</h3>' +
        '<p>Avalanche saves <strong>' + window.fmt$(saveInt) + '</strong> in interest' +
        (saveMo > 0 ? ' and finishes <strong>' + saveMo + ' month' + (saveMo > 1 ? 's' : '') + '</strong> sooner' : ' (same timeline)') +
        ' vs snowball — but snowball wins psychologically by killing small balances first.</p></div>' +
        stratCard('🏔️ Avalanche (highest APR first)', av, best === 'avalanche' ? 'best' : '') +
        stratCard('⛄ Snowball (smallest balance first)', sn, best === 'snowball' ? 'best' : '') +
        '<div class="disclaimer">Educational estimate. Assumes no new charges, fixed APRs, and minimums stay constant. Not financial advice.</div>';
    });
  });
})();
