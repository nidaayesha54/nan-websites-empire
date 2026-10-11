/* TalkingPhotoMaker — Tool Comparator
   Filters + sorts talking-photo tools by free limits, languages and realism. */
(function () {
  'use strict';

  /* Free limits change often — keep wording conservative and add a verify note. */
  var TOOLS = [
    { name: 'HeyGen', free: 'Free plan: 3 videos / month', watermark: 'Yes (free plan)', langs: 175, realism: 9, bestFor: ['Marketing', 'Fun & social'], note: 'Best lip-sync and avatar realism; generous starter free tier.' },
    { name: 'Synthesia', free: 'Limited free plan (capped minutes)', watermark: 'Yes (free plan)', langs: 140, realism: 9, bestFor: ['Education', 'Marketing'], note: 'Studio-quality avatars; strongest for corporate training videos.' },
    { name: 'D-ID', free: 'Free trial: 5 minutes of video', watermark: 'Yes (trial)', langs: 119, realism: 8, bestFor: ['Marketing', 'Customer support'], note: 'Turns any photo into a talking head in seconds; great API.' },
    { name: 'Colossyan', free: '14-day free trial', watermark: 'Yes (trial)', langs: 70, realism: 8, bestFor: ['Education'], note: 'Built for workplace learning videos with interactive avatars.' },
    { name: 'Vidnoz AI', free: 'Free plan with daily free minutes', watermark: 'Yes (free plan)', langs: 140, realism: 7, bestFor: ['Fun & social', 'Marketing'], note: 'Huge template library and very forgiving free tier.' },
    { name: 'CapCut', free: 'Free talking-photo tools in app', watermark: 'Some exports', langs: 40, realism: 7, bestFor: ['Fun & social'], note: 'Free and familiar; ideal for quick social-media talking photos.' },
    { name: 'Elai.io', free: 'Free trial minute', watermark: 'Yes (trial)', langs: 75, realism: 7, bestFor: ['Marketing', 'Education'], note: 'Fast text-to-avatar workflow with decent free taste.' }
  ];

  var state = { freeOnly: false, noWatermark: false, minLangs: 0, useCase: 'all', sort: 'realism' };

  function star(n) {
    var s = '';
    for (var i = 0; i < 10; i++) s += i < n ? '★' : '☆';
    return s;
  }

  function filtered() {
    return TOOLS.filter(function (t) {
      if (state.freeOnly && t.free.toLowerCase().indexOf('trial') !== -1) return false;
      if (state.noWatermark && t.watermark.toLowerCase().indexOf('yes') !== -1 && t.watermark.toLowerCase().indexOf('some') === -1) {
        if (t.watermark !== 'Some exports') return false;
      }
      if (t.langs < state.minLangs) return false;
      if (state.useCase !== 'all' && t.bestFor.indexOf(state.useCase) === -1) return false;
      return true;
    }).sort(function (a, b) {
      if (state.sort === 'realism') return b.realism - a.realism;
      if (state.sort === 'langs') return b.langs - a.langs;
      return a.name.localeCompare(b.name);
    });
  }

  function render() {
    var rows = filtered();
    var tbody = document.getElementById('cmp-body');
    tbody.innerHTML = '';
    rows.forEach(function (t) {
      var tr = document.createElement('tr');
      var freePill = t.free.toLowerCase().indexOf('trial') === -1
        ? '<span class="pill free">Free plan</span>'
        : '<span class="pill">Trial</span>';
      tr.innerHTML =
        '<td><b>' + t.name + '</b><br><span style="color:var(--muted);font-size:.82rem">' + t.note + '</span></td>' +
        '<td>' + freePill + '<br><span style="font-size:.85rem">' + t.free + '</span></td>' +
        '<td>' + t.watermark + '</td>' +
        '<td>' + t.langs + '+</td>' +
        '<td><span class="stars">' + star(t.realism) + '</span> ' + t.realism + '/10</td>' +
        '<td>' + t.bestFor.join(', ') + '</td>';
      tbody.appendChild(tr);
    });
    document.getElementById('cmp-count').textContent =
      rows.length + ' of ' + TOOLS.length + ' tools match your filters.';

    var freeBest = TOOLS.filter(function (t) { return t.free.toLowerCase().indexOf('trial') === -1; })
      .sort(function (a, b) { return b.realism - a.realism; })[0];
    var realBest = TOOLS.slice().sort(function (a, b) { return b.realism - a.realism; })[0];
    var langBest = TOOLS.slice().sort(function (a, b) { return b.langs - a.langs; })[0];
    document.getElementById('cmp-verdicts').innerHTML =
      '<div class="verdict"><h4>🏆 Best true free tier</h4><p><b>' + freeBest.name + '</b> — ' + freeBest.free + '. ' + freeBest.note + '</p></div>' +
      '<div class="verdict"><h4>🎭 Most realistic avatars</h4><p><b>' + realBest.name + '</b> (' + realBest.realism + '/10) — ' + realBest.note + '</p></div>' +
      '<div class="verdict"><h4>🌍 Most languages</h4><p><b>' + langBest.name + '</b> (' + langBest.langs + '+ languages) — best pick for multilingual audiences.</p></div>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('f-free').addEventListener('change', function () { state.freeOnly = this.checked; render(); });
    document.getElementById('f-nowm').addEventListener('change', function () { state.noWatermark = this.checked; render(); });
    document.getElementById('f-langs').addEventListener('change', function () { state.minLangs = parseInt(this.value, 10); render(); });
    document.getElementById('f-use').addEventListener('change', function () { state.useCase = this.value; render(); });
    document.getElementById('f-sort').addEventListener('change', function () { state.sort = this.value; render(); });
    render();
  });
})();
