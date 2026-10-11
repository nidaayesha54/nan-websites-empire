/* Photo-to-video tool comparator */
(function () {
  'use strict';

  var TOOLS = [
    { name: 'Canva Video', score: 9.1, freeLen: '5 min', templates: 3000, ease: 9.5, trans: '200+ transitions', music: 'Royalty-free library (free)', watermark: false, hdFree: false, mobileApp: true, autoBeat: false, commercial: false, notes: 'Best all-round free slideshow maker; 720p on free plan.' },
    { name: 'CapCut', score: 8.9, freeLen: 'No limit', templates: 1200, ease: 9.2, trans: 'Auto beat-sync transitions', music: 'Trending audio + royalty-free', watermark: false, hdFree: true, mobileApp: true, autoBeat: true, commercial: false, notes: 'Best free mobile maker; no watermark on most exports.' },
    { name: 'Adobe Express', score: 8.7, freeLen: 'No limit', templates: 2000, ease: 8.8, trans: 'Designer transitions', music: 'Adobe stock music (free)', watermark: false, hdFree: true, mobileApp: true, autoBeat: false, commercial: true, notes: 'Premium-looking templates; some assets need Premium.' },
    { name: 'Animoto', score: 8.4, freeLen: 'No limit (watermarked)', templates: 800, ease: 9.0, trans: 'Story-style transitions', music: 'Licensed library (paid plans)', watermark: true, hdFree: false, mobileApp: true, autoBeat: false, commercial: false, notes: 'Great for marketing slideshows; watermark on free plan.' },
    { name: 'FlexClip', score: 8.2, freeLen: '1 min / 12 projects', templates: 1000, ease: 8.6, trans: '150+ transitions', music: 'Royalty-free library (free)', watermark: false, hdFree: false, mobileApp: false, autoBeat: false, commercial: false, notes: 'Huge template library; short free export length.' },
    { name: 'Kapwing', score: 8.0, freeLen: '4 min (watermarked)', templates: 600, ease: 8.5, trans: '40+ transitions', music: 'Royalty-free library', watermark: true, hdFree: false, mobileApp: false, autoBeat: false, commercial: false, notes: 'Browser-based team editing; watermark under free plan.' },
    { name: 'InVideo', score: 7.9, freeLen: '10 min (watermarked)', templates: 5000, ease: 8.2, trans: 'Template-based transitions', music: 'Royalty-free library', watermark: true, hdFree: false, mobileApp: true, autoBeat: false, commercial: false, notes: 'Most templates; watermarked free exports.' },
    { name: 'VEED', score: 7.8, freeLen: '2 min (watermarked)', templates: 400, ease: 8.7, trans: 'Clean transitions', music: 'Royalty-free library', watermark: true, hdFree: false, mobileApp: false, autoBeat: false, commercial: false, notes: 'Fast browser editor; subtitles strength; watermark on free.' },
    { name: 'Magisto (Vimeo)', score: 7.5, freeLen: 'Trial only', templates: 300, ease: 9.3, trans: 'AI auto-editing', music: 'Licensed library', watermark: true, hdFree: false, mobileApp: true, autoBeat: true, commercial: false, notes: 'AI assembles your photos; truly free tier is limited.' },
    { name: 'Lumen5', score: 7.3, freeLen: '720p (watermarked)', templates: 500, ease: 8.0, trans: 'Simple transitions', music: 'Royalty-free library', watermark: true, hdFree: false, mobileApp: false, autoBeat: false, commercial: false, notes: 'Built for blog-to-video; slideshow OK but watermarked.' }
  ];

  function lenMin(s) {
    if (/no limit/i.test(s)) return 9999;
    var m = s.match(/(\d+)\s*min/i);
    return m ? parseInt(m[1], 10) : 0;
  }

  function stars(score) {
    var n = Math.round(score / 2);
    return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
  }

  function render() {
    var active = Array.prototype.map.call(
      document.querySelectorAll('#mustHave .chip.on'),
      function (c) { return c.getAttribute('data-f'); }
    );
    var sortBy = document.getElementById('sortBy').value;
    var list = TOOLS.filter(function (t) {
      return active.every(function (f) {
        if (f === 'noWatermark') return !t.watermark;
        if (f === 'hdFree') return t.hdFree;
        if (f === 'musicLib') return true;
        if (f === 'mobileApp') return t.mobileApp;
        if (f === 'autoBeat') return t.autoBeat;
        if (f === 'commercial') return t.commercial;
        return true;
      });
    });
    list.sort(function (a, b) {
      if (sortBy === 'freeLen') return lenMin(b.freeLen) - lenMin(a.freeLen);
      if (sortBy === 'templates') return b.templates - a.templates;
      if (sortBy === 'ease') return b.ease - a.ease;
      return b.score - a.score;
    });

    var grid = document.getElementById('toolGrid');
    if (!list.length) {
      grid.innerHTML = '<div class="card"><h3>No tools match</h3><p>Try removing a filter — watermarks and 1080p rarely come together on free plans.</p></div>';
      return;
    }
    grid.innerHTML = list.map(function (t) {
      var flags = [];
      if (!t.watermark) flags.push('No watermark');
      if (t.hdFree) flags.push('1080p free');
      if (t.mobileApp) flags.push('Mobile app');
      if (t.autoBeat) flags.push('Beat-sync');
      if (t.commercial) flags.push('Commercial (free)');
      return '<div class="card"><h3>' + t.name + '</h3>' +
        '<div class="score-row"><span class="score">' + t.score.toFixed(1) + '</span><span class="stars">' + stars(t.score) + '</span></div>' +
        '<ul class="check">' +
        '<li>Free export: <b>' + t.freeLen + '</b></li>' +
        '<li>Transitions: ' + t.trans + '</li>' +
        '<li>Music: ' + t.music + '</li>' +
        '<li>' + t.templates.toLocaleString() + '+ templates</li>' +
        (t.watermark ? '<li class="no">Watermark on free exports</li>' : '') +
        '</ul>' +
        '<p style="font-size:.9rem">' + t.notes + '</p>' +
        (flags.length ? '<div class="chips" style="margin-top:8px">' + flags.map(function (f) { return '<span class="chip" style="cursor:default">' + f + '</span>'; }).join('') + '</div>' : '') +
        '</div>';
    }).join('');
  }

  function init() {
    if (!document.getElementById('toolGrid')) return;
    document.querySelectorAll('#mustHave .chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        chip.classList.toggle('on');
        render();
      });
    });
    document.getElementById('sortBy').addEventListener('change', render);
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
