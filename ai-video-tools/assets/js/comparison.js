/* AI Video Tools Hub — comparison table data + filtering (vanilla JS) */
(function () {
  'use strict';

  // Pricing/features are estimates as of 2026 — verify on official sites.
  var TOOLS = [
    { name: 'Runway', model: 'Gen-4', price: 'from ~$12/mo', free: 'Limited free credits', bestFor: 'Cinematic, pro-grade video', rating: 4.8, tags: ['marketing', 'youtube'] },
    { name: 'Google Veo 3', model: 'Veo 3 (Flow / Gemini)', price: 'from ~$20/mo', free: 'Trial credits', bestFor: 'Ultra-realistic video + native audio', rating: 4.8, tags: ['marketing', 'youtube'] },
    { name: 'Luma Dream Machine', model: 'Dream Machine', price: 'from ~$30/mo', free: 'Limited free tier', bestFor: 'Realistic motion & scenes', rating: 4.7, tags: ['marketing', 'youtube'] },
    { name: 'HeyGen', model: 'Avatar IV', price: 'from ~$24/mo', free: 'Free trial', bestFor: 'AI avatar spokesperson ads', rating: 4.7, tags: ['marketing'] },
    { name: 'OpenAI Sora', model: 'Sora 2', price: '~$20/mo (ChatGPT Plus)', free: 'No free tier', bestFor: 'High-end creative concepts', rating: 4.7, tags: ['youtube'] },
    { name: 'Kling', model: 'Kling 2.x', price: 'from ~$10/mo', free: 'Free daily credits', bestFor: 'Longer videos, great value', rating: 4.6, tags: ['youtube', 'social-ads'] },
    { name: 'CapCut', model: 'Commerce Pro', price: 'Free + Pro ~$8/mo', free: 'Generous free tier', bestFor: 'Budget social video & editing', rating: 4.6, tags: ['social-ads'] },
    { name: 'Synthesia', model: 'v3', price: 'from ~$18/mo', free: 'Free demo only', bestFor: 'Corporate & training videos', rating: 4.5, tags: ['marketing'] },
    { name: 'InVideo', model: 'AI v4', price: 'from ~$15/mo', free: 'Free tier (watermark)', bestFor: 'Fast social ads & promos', rating: 4.5, tags: ['social-ads', 'marketing'] },
    { name: 'Pika', model: 'Pika 2', price: 'from ~$10/mo', free: 'Free tier', bestFor: 'Fun social clips & effects', rating: 4.4, tags: ['social-ads'] },
    { name: 'Leonardo.Ai', model: 'Motion', price: 'from ~$12/mo', free: 'Free daily tokens', bestFor: 'Image-to-video stylized clips', rating: 4.4, tags: ['marketing'] },
    { name: 'Hailuo MiniMax', model: 'Hailuo 02', price: 'from ~$10/mo', free: 'Free tier', bestFor: 'Creative & anime-style video', rating: 4.3, tags: ['social-ads', 'youtube'] }
  ];

  var USE_CASE_LABELS = {
    'marketing': 'Marketing',
    'youtube': 'YouTube',
    'social-ads': 'Social Ads'
  };

  var activeFilter = 'all';
  var query = '';

  function starRating(r) {
    return '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
  }

  function matches(tool) {
    var okFilter = activeFilter === 'all' || tool.tags.indexOf(activeFilter) !== -1;
    var okQuery = !query ||
      (tool.name + ' ' + tool.model + ' ' + tool.bestFor).toLowerCase().indexOf(query) !== -1;
    return okFilter && okQuery;
  }

  function render() {
    var tbody = document.getElementById('tool-rows');
    var count = document.getElementById('tool-count');
    if (!tbody) return;
    var rows = TOOLS.filter(matches).map(function (t) {
      var tags = t.tags.map(function (g) {
        return '<span class="tag">' + (USE_CASE_LABELS[g] || g) + '</span>';
      }).join('');
      return '<tr>' +
        '<td><strong>' + t.name + '</strong><br><span style="font-size:.82rem">' + t.model + '</span></td>' +
        '<td>' + t.price + '</td>' +
        '<td>' + t.free + '</td>' +
        '<td>' + t.bestFor + '<br>' + tags + '</td>' +
        '<td class="rating">' + starRating(t.rating) + ' ' + t.rating.toFixed(1) + '</td>' +
        '</tr>';
    });
    tbody.innerHTML = rows.length
      ? rows.join('')
      : '<tr><td colspan="5" style="text-align:center;padding:32px">No tools match your filters. Try clearing the search.</td></tr>';
    if (count) count.textContent = TOOLS.filter(matches).length + ' of ' + TOOLS.length + ' tools';
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.filter-btn[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn[data-filter]').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        render();
      });
    });
    var search = document.getElementById('tool-search');
    if (search) {
      search.addEventListener('input', function () {
        query = search.value.trim().toLowerCase();
        render();
      });
    }
    render();
  });
})();
