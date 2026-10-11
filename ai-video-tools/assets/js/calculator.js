/* AI Video Tools Hub — AI video project cost estimator (vanilla JS) */
(function () {
  'use strict';

  // Estimates as of 2026. perSec = rough generation cost per video-second at
  // "standard" quality; toolMult scales it per tool; base = monthly subscription.
  var TOOLS = [
    { name: 'CapCut', base: 0, mult: 0.30, note: 'Free tier covers most needs' },
    { name: 'Hailuo MiniMax', base: 0, mult: 0.70, note: 'Free tier available' },
    { name: 'Kling', base: 10, mult: 0.80, note: 'Free daily credits' },
    { name: 'Pika', base: 10, mult: 0.80, note: 'Free tier available' },
    { name: 'InVideo', base: 15, mult: 0.90, note: 'Free tier has watermark' },
    { name: 'Runway', base: 12, mult: 1.00, note: 'Pro quality baseline' },
    { name: 'Leonardo.Ai', base: 12, mult: 1.00, note: 'Stylized image-to-video' },
    { name: 'Synthesia', base: 18, mult: 1.20, note: 'Avatar minutes metered' },
    { name: 'HeyGen', base: 24, mult: 1.40, note: 'Avatar credits metered' },
    { name: 'Luma', base: 30, mult: 1.50, note: 'Premium realism' },
    { name: 'OpenAI Sora', base: 20, mult: 1.60, note: 'Via ChatGPT Plus' },
    { name: 'Google Veo 3', base: 20, mult: 1.60, note: 'Via Google AI Pro' }
  ];

  var TIER_RATES = { draft: 0.015, standard: 0.05, premium: 0.12 };
  var TIER_LABELS = { draft: 'Draft', standard: 'Standard', premium: 'Premium' };

  function fmt(n) {
    return '$' + n.toFixed(2);
  }

  function calculate() {
    var lenEl = document.getElementById('vid-length');
    var countEl = document.getElementById('vid-count');
    var tierEl = document.querySelector('input[name="tier"]:checked');
    var out = document.getElementById('calc-results');
    if (!lenEl || !countEl || !out) return;

    var seconds = Math.max(1, parseInt(lenEl.value, 10) || 0);
    var videos = Math.max(1, parseInt(countEl.value, 10) || 0);
    var tier = tierEl ? tierEl.value : 'standard';
    var rate = TIER_RATES[tier] || TIER_RATES.standard;
    var totalSeconds = seconds * videos;

    var rows = TOOLS.map(function (t) {
      var usage = totalSeconds * rate * t.mult;
      var monthly = t.base + usage;
      return { name: t.name, base: t.base, usage: usage, monthly: monthly, note: t.note };
    }).sort(function (a, b) { return a.monthly - b.monthly; });

    var cheapest = rows[0];
    var html = '<h3>Estimated monthly cost</h3>' +
      '<p style="color:var(--muted)">' + videos + ' videos × ' + seconds + 's (' + TIER_LABELS[tier] + ' quality)</p>' +
      '<p class="big-number">' + fmt(cheapest.monthly) + '<span style="font-size:1rem;color:var(--muted)">/mo</span></p>' +
      '<p><span class="badge lime">Cheapest: ' + cheapest.name + '</span></p>' +
      '<div class="table-wrap" style="margin-top:18px"><table style="min-width:0"><thead><tr>' +
      '<th>Tool</th><th>Plan base</th><th>Est. usage</th><th>Est. total/mo</th>' +
      '</tr></thead><tbody>' +
      rows.map(function (r, i) {
        return '<tr' + (i === 0 ? ' style="background:rgba(163,230,53,.06)"' : '') + '>' +
          '<td><strong>' + r.name + '</strong><br><span style="font-size:.8rem">' + r.note + '</span></td>' +
          '<td>' + fmt(r.base) + '</td>' +
          '<td>' + fmt(r.usage) + '</td>' +
          '<td><strong>' + fmt(r.monthly) + '</strong></td></tr>';
      }).join('') +
      '</tbody></table></div>' +
      '<p class="disclaimer">Estimates only, based on public pricing as of 2026. Actual costs vary with credit systems, resolution, and plan changes — always check the official site before budgeting.</p>';
    out.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('calc-btn');
    if (btn) btn.addEventListener('click', calculate);
    ['vid-length', 'vid-count'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', calculate);
    });
    document.querySelectorAll('input[name="tier"]').forEach(function (r) {
      r.addEventListener('change', calculate);
    });
    calculate();
  });
})();
