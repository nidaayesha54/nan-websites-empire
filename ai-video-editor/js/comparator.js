// AI video editor comparison table: data, filters, sorting
(function () {
  'use strict';

  // Prices are estimates (Oct 2026) — always check official sites.
  var TOOLS = [
    { name: 'Descript', price: 12, priceNote: 'from $12/mo', free: true, rating: 4.7,
      captions: true, textEdit: true, clips: true, bestFor: 'Podcasters & YouTubers who edit by transcript',
      tags: ['auto captions', 'text editing', 'clip repurposing', 'podcast'] },
    { name: 'CapCut', price: 0, priceNote: 'free (Pro $8/mo)', free: true, rating: 4.6,
      captions: true, textEdit: false, clips: true, bestFor: 'Short-form creators, TikTok & Reels on any budget',
      tags: ['auto captions', 'clip repurposing', 'free plan', 'shorts'] },
    { name: 'Adobe Premiere Pro (Firefly)', price: 23, priceNote: 'from $23/mo', free: false, rating: 4.5,
      captions: true, textEdit: true, clips: false, bestFor: 'Pros who want AI inside a full NLE timeline',
      tags: ['auto captions', 'text editing', 'pro'] },
    { name: 'Opus Clip', price: 15, priceNote: 'from $15/mo', free: true, rating: 4.4,
      captions: true, textEdit: false, clips: true, bestFor: 'Turning long videos into viral shorts automatically',
      tags: ['auto captions', 'clip repurposing', 'free plan', 'shorts'] },
    { name: 'Kapwing', price: 16, priceNote: 'from $16/mo', free: true, rating: 4.3,
      captions: true, textEdit: false, clips: true, bestFor: 'Teams making memes, captions & quick social edits',
      tags: ['auto captions', 'clip repurposing', 'free plan', 'shorts'] },
    { name: 'Pictory', price: 19, priceNote: 'from $19/mo', free: false, rating: 4.1,
      captions: true, textEdit: false, clips: true, bestFor: 'Script-to-video for blogs, courses & faceless channels',
      tags: ['auto captions', 'clip repurposing', 'script to video'] },
    { name: 'Runway', price: 15, priceNote: 'from $15/mo', free: true, rating: 4.2,
      captions: false, textEdit: false, clips: false, bestFor: 'Generative video & advanced AI effects',
      tags: ['free plan', 'generative', 'pro'] },
    { name: 'InVideo', price: 20, priceNote: 'from $20/mo', free: true, rating: 4.0,
      captions: true, textEdit: false, clips: true, bestFor: 'Fast template-based marketing videos with AI voice',
      tags: ['auto captions', 'free plan', 'script to video'] }
  ];

  var FILTERS = [
    { key: 'all', label: 'All tools', test: function () { return true; } },
    { key: 'free', label: 'Has free plan', test: function (t) { return t.free; } },
    { key: 'captions', label: 'Auto captions', test: function (t) { return t.captions; } },
    { key: 'textedit', label: 'Text-based editing', test: function (t) { return t.textEdit; } },
    { key: 'clips', label: 'AI clip repurposing', test: function (t) { return t.clips; } }
  ];

  var state = { filter: 'all', sortKey: null, sortDir: 1 };

  function stars(r) {
    var s = '';
    for (var i = 1; i <= 5; i++) s += i <= Math.round(r) ? '★' : '☆';
    return '<span class="stars" title="' + r + '/5">' + s + '</span> ' + r.toFixed(1);
  }

  function boolCell(v) { return v ? '<strong style="color:var(--good)">✓</strong>' : '<span style="color:var(--muted)">—</span>'; }

  function getRows() {
    var f = FILTERS.filter(function (x) { return x.key === state.filter; })[0];
    var rows = TOOLS.filter(f.test);
    if (state.sortKey === 'rating') {
      rows = rows.slice().sort(function (a, b) { return (a.rating - b.rating) * state.sortDir; });
    } else if (state.sortKey === 'price') {
      rows = rows.slice().sort(function (a, b) { return (a.price - b.price) * state.sortDir; });
    }
    return rows;
  }

  function render() {
    var tbody = document.getElementById('compareBody');
    var rows = getRows();
    tbody.innerHTML = '';
    rows.forEach(function (t) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td><strong>' + t.name + '</strong><br><span class="hint">' + t.priceNote + '</span></td>' +
        '<td>' + stars(t.rating) + '</td>' +
        '<td>' + boolCell(t.free) + '</td>' +
        '<td>' + boolCell(t.captions) + '</td>' +
        '<td>' + boolCell(t.textEdit) + '</td>' +
        '<td>' + boolCell(t.clips) + '</td>' +
        '<td>' + t.bestFor + '</td>';
      tbody.appendChild(tr);
    });
    document.getElementById('matchCount').textContent =
      rows.length + ' of ' + TOOLS.length + ' tools match';
  }

  function renderFilters() {
    var box = document.getElementById('filterChips');
    FILTERS.forEach(function (f) {
      var b = document.createElement('button');
      b.className = 'chip' + (f.key === state.filter ? ' active' : '');
      b.textContent = f.label;
      b.addEventListener('click', function () {
        state.filter = f.key;
        box.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
        b.classList.add('active');
        render();
      });
      box.appendChild(b);
    });
  }

  function bindSort() {
    document.querySelectorAll('th.sortable').forEach(function (th) {
      th.addEventListener('click', function () {
        var key = th.dataset.sort;
        if (state.sortKey === key) { state.sortDir *= -1; }
        else { state.sortKey = key; state.sortDir = key === 'rating' ? -1 : 1; }
        document.querySelectorAll('th.sortable').forEach(function (h) {
          h.textContent = h.textContent.replace(/ [▲▼]$/, '');
        });
        th.textContent += state.sortDir === 1 ? ' ▲' : ' ▼';
        render();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderFilters();
    bindSort();
    render();
  });
})();
