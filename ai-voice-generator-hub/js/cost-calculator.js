// Cost estimator: monthly audio minutes × tool pricing → cheapest plan per tool.
(function () {
  'use strict';

  function calculate() {
    var data = window.vghData;
    var minutes = Math.max(1, Math.round(parseFloat(document.getElementById('cc-minutes').value) || 0));
    var results = data.TOOLS.map(function (t) {
      var plan = data.cheapestPlanFor(t, minutes);
      if (plan) {
        return { tool: t, plan: plan, cost: plan.price, covers: true, included: data.planMinutes(t, plan) };
      }
      var top = t.plans.slice().sort(function (a, b) { return b.price - a.price; })[0];
      return { tool: t, plan: top, cost: top.price, covers: false, included: data.planMinutes(t, top) };
    });
    results.sort(function (a, b) { return a.cost - b.cost; });

    var html = '<h3>💵 Estimated monthly cost for ~' + minutes + ' min of audio</h3>';
    html += '<div class="tablewrap"><table><thead><tr><th>Tool</th><th>Cheapest plan</th>' +
      '<th>Included audio</th><th>Covers your need?</th><th>Est. cost/mo</th></tr></thead><tbody>';
    results.forEach(function (r) {
      html += '<tr><td><b>' + vgh.esc(r.tool.name) + '</b></td>' +
        '<td>' + vgh.esc(r.plan.name) + (r.plan.note ? ' <span style="color:var(--muted)">(' + vgh.esc(r.plan.note) + ')</span>' : '') + '</td>' +
        '<td>' + (r.included >= 99999999 ? 'Unlimited' : '≈' + r.included.toLocaleString() + ' min') + '</td>' +
        '<td>' + (r.covers ? '✅ Yes' : '⚠️ Exceeds top plan — overage extra') + '</td>' +
        '<td><b>' + vgh.fmtMoney(r.cost) + '</b></td></tr>';
    });
    html += '</tbody></table></div>';

    // bar chart
    var max = Math.max.apply(null, results.map(function (r) { return r.cost; })) || 1;
    html += '<h3 style="margin-top:18px">📊 Cost comparison</h3><div class="bars">';
    results.forEach(function (r) {
      var w = r.cost === 0 ? 4 : Math.max(4, Math.round(r.cost / max * 100));
      html += '<div class="bar-row"><div class="bar-label">' + vgh.esc(r.tool.name) + '</div>' +
        '<div class="bar-track"><div class="bar-fill" style="width:' + w + '%"></div></div>' +
        '<div class="bar-val">' + vgh.fmtMoney(r.cost) + '</div></div>';
    });
    html += '</div>';

    var best = results[0];
    html += '<div class="result">🏆 <b>Cheapest for ' + minutes + ' min/mo:</b> ' +
      vgh.esc(best.tool.name) + ' — ' + vgh.esc(best.plan.name) + ' at <b>' + vgh.fmtMoney(best.cost) +
      '/mo</b>. <a href="use-case-finder.html">Not sure it fits your project? Take the quiz →</a></div>';

    html += '<p class="disclaimer">Estimates use ≈850 characters or ≈150 words per minute of English audio. ' +
      'Plans and prices change often — always confirm on the vendor\u2019s site before buying.</p>';

    document.getElementById('cc-result').innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cc-go').addEventListener('click', calculate);
    document.getElementById('cc-minutes').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') calculate();
    });
    // preset chips
    var presets = document.querySelectorAll('#cc-presets .chip');
    presets.forEach(function (c) {
      c.addEventListener('click', function () {
        presets.forEach(function (x) { x.classList.remove('active'); });
        c.classList.add('active');
        document.getElementById('cc-minutes').value = c.getAttribute('data-min');
        calculate();
      });
    });
  });
})();
