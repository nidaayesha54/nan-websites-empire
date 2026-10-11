// Credit Utilization Calculator — per-card + overall ratios with optimization tips.
(function () {
  'use strict';

  var cardCount = 0;

  function addCardRow(name, balance, limit) {
    cardCount++;
    var wrap = document.getElementById('cards');
    var row = document.createElement('div');
    row.className = 'debt-row';
    row.style.gridTemplateColumns = '2fr 1fr 1fr auto';
    row.innerHTML =
      '<div class="field"><label>Card name</label><input type="text" class="c-name" value="' + (name || '') + '" placeholder="e.g. Visa"></div>' +
      '<div class="field"><label>Balance ($)</label><input type="number" class="c-bal" min="0" step="0.01" value="' + (balance != null ? balance : '') + '"></div>' +
      '<div class="field"><label>Limit ($)</label><input type="number" class="c-lim" min="0" step="0.01" value="' + (limit != null ? limit : '') + '"></div>' +
      '<div class="field"><label>&nbsp;</label><button type="button" class="btn btn-ghost c-del" style="color:#e74c3c;border-color:#e74c3c;padding:8px 14px">✕</button></div>';
    wrap.appendChild(row);
    row.querySelector('.c-del').addEventListener('click', function () {
      if (wrap.children.length > 1) row.remove();
    });
  }

  function tagFor(u) {
    if (u < 10) return '<span class="tag good">Excellent</span>';
    if (u < 30) return '<span class="tag good">Good</span>';
    if (u < 50) return '<span class="tag mid">Fair</span>';
    return '<span class="tag bad">High</span>';
  }

  function tipFor(u) {
    if (u < 10) return 'Keep it up — under 10% is ideal for scoring.';
    if (u < 30) return 'Solid. Paying down toward 10% could add points.';
    if (u < 50) return 'Above 30% starts hurting. Prioritize paying this down.';
    return 'Urgent: 50%+ utilization drags scores down hard. Pay this first.';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('util-form');
    if (!form) return;
    addCardRow('Card A', 2400, 5000);
    addCardRow('Card B', 800, 3000);
    addCardRow('Card C', 0, 8000);
    document.getElementById('add-card').addEventListener('click', function () { addCardRow(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var out = document.getElementById('util-result');
      var cards = [];
      document.querySelectorAll('#cards .debt-row').forEach(function (row) {
        var bal = parseFloat(row.querySelector('.c-bal').value) || 0;
        var lim = parseFloat(row.querySelector('.c-lim').value) || 0;
        var name = row.querySelector('.c-name').value.trim() || 'Card ' + (cards.length + 1);
        if (lim > 0) cards.push({ name: name, bal: bal, lim: lim });
      });
      if (cards.length === 0) { out.innerHTML = '<div class="result warn"><h3>No cards entered</h3><p>Add at least one card with a credit limit above $0.</p></div>'; return; }

      var totBal = cards.reduce(function (s, c) { return s + c.bal; }, 0);
      var totLim = cards.reduce(function (s, c) { return s + c.lim; }, 0);
      var overall = (totBal / totLim) * 100;

      var rows = cards.map(function (c) {
        var u = (c.bal / c.lim) * 100;
        var barColor = u < 30 ? 'linear-gradient(90deg,#2ecc71,#7be495)' : u < 50 ? 'linear-gradient(90deg,#f5b942,#f7d47c)' : 'linear-gradient(90deg,#e74c3c,#f1948a)';
        return '<tr><td><strong>' + c.name + '</strong><br><span class="hint">' + tipFor(u) + '</span></td>' +
          '<td>' + window.fmt$(c.bal) + ' / ' + window.fmt$(c.lim) + '</td>' +
          '<td><div class="bar"><div style="width:' + Math.min(100, u).toFixed(1) + '%;background:' + barColor + '"></div></div>' + u.toFixed(1) + '% ' + tagFor(u) + '</td></tr>';
      }).join('');

      // What-if: how much to pay to hit 10% and 30%
      var to10 = Math.max(0, totBal - totLim * 0.10);
      var to30 = Math.max(0, totBal - totLim * 0.30);
      var whatif = '';
      if (overall >= 10) {
        whatif = '<h3 style="margin-top:18px">Pay-down targets</h3><ul>' +
          (to30 > 0 ? '<li>Pay <strong>' + window.fmt$(to30) + '</strong> to get under <strong>30%</strong> (the commonly cited ceiling).</li>' : '') +
          '<li>Pay <strong>' + window.fmt$(to10) + '</strong> to reach the <strong>under-10%</strong> sweet spot.</li></ul>';
      } else {
        whatif = '<p style="margin-top:14px"><span class="tag good">You are already under 10% overall — ideal.</span></p>';
      }

      // Optimization tips
      var tips = '<h3 style="margin-top:18px">Optimization tips</h3><ol>' +
        '<li><strong>Pay before the statement closes</strong> — most issuers report the statement balance, so paying early lowers reported utilization.</li>' +
        '<li><strong>Spread balances</strong> — one maxed-out card hurts even if overall utilization is low.</li>' +
        '<li><strong>Ask for limit increases</strong> — a higher limit with the same spending instantly lowers your ratio (ask for soft-pull-only increases).</li>' +
        '<li><strong>Don\'t close old cards</strong> — closing cuts your total available credit and raises utilization.</li></ol>';

      out.innerHTML =
        '<div class="result' + (overall >= 50 ? ' bad' : overall >= 30 ? ' warn' : '') + '">' +
        '<h3>Your overall utilization: ' + overall.toFixed(1) + '% ' + tagFor(overall) + '</h3>' +
        '<p>Total balances ' + window.fmt$(totBal) + ' on ' + window.fmt$(totLim) + ' of available credit. Utilization is ~30% of a FICO score — the second-biggest factor.</p>' +
        '<table class="data"><tr><th>Card</th><th>Balance / Limit</th><th>Utilization</th></tr>' + rows + '</table>' +
        whatif + tips + '</div>' +
        '<div class="disclaimer">Educational tool only — estimates based on widely published FICO factor weights. Not financial advice.</div>';
    });
  });
})();
