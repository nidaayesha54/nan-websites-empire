// Comparison table of AI voice tools with use-case + budget filters.
(function () {
  'use strict';
  var USECASES = [
    { id: 'all', label: 'All use cases' },
    { id: 'podcast', label: '🎙️ Podcast' },
    { id: 'video', label: '🎬 Video / YouTube' },
    { id: 'audiobook', label: '📖 Audiobook' },
    { id: 'ads', label: '📣 Ads / Marketing' },
    { id: 'elearning', label: '🎓 E-learning' },
    { id: 'listening', label: '🎧 Listening / Accessibility' }
  ];

  function stars(n) {
    var s = '';
    for (var i = 0; i < 10; i++) s += i < n ? '●' : '○';
    return s;
  }

  function render() {
    var uc = document.getElementById('cmp-usecase').value;
    var budget = document.getElementById('cmp-budget').value;
    var data = window.vghData;
    var rows = data.TOOLS.filter(function (t) {
      if (uc !== 'all' && t.useCases.indexOf(uc) === -1) return false;
      if (budget === 'free' && t.plans[0].price !== 0) return false;
      if (budget === 'under25' && t.plans.every(function (p) { return p.price === 0 || p.price > 24; })) return false;
      return true;
    });

    var html = '<div class="tablewrap"><table><thead><tr>' +
      '<th>Tool</th><th>From</th><th>Voice quality</th><th>Languages</th>' +
      '<th>Best for</th><th>Key strengths</th><th>Pricing model</th></tr></thead><tbody>';

    rows.forEach(function (t) {
      var from = Math.min.apply(null, t.plans.map(function (p) { return p.price; }));
      html += '<tr><td><b>' + vgh.esc(t.name) + '</b><br><span style="color:var(--muted);font-size:.82rem">' +
        vgh.esc(t.tagline) + '</span></td>' +
        '<td><b>' + vgh.fmtMoney(from) + '</b>/mo</td>' +
        '<td title="' + t.quality + '/10" style="white-space:nowrap">' + stars(t.quality) + '</td>' +
        '<td>' + t.languages + '+</td>' +
        '<td>' + t.bestFor.map(vgh.esc).join(', ') + '</td>' +
        '<td>' + t.features.slice(0, 3).map(vgh.esc).join('<br>') + '</td>' +
        '<td style="text-transform:capitalize">' + vgh.esc(t.model) + '-based</td></tr>';
    });

    html += '</tbody></table></div>';
    if (!rows.length) html = '<div class="result">No tools match those filters — try widening the budget.</div>';
    document.getElementById('cmp-result').innerHTML = html;
    document.getElementById('cmp-count').textContent = rows.length + ' of ' + data.TOOLS.length + ' tools shown';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var sel = document.getElementById('cmp-usecase');
    USECASES.forEach(function (u) {
      var o = document.createElement('option');
      o.value = u.id; o.textContent = u.label;
      sel.appendChild(o);
    });
    document.getElementById('cmp-usecase').addEventListener('change', render);
    document.getElementById('cmp-budget').addEventListener('change', render);
    render();
  });
})();
