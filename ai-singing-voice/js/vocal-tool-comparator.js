// Vocal Tool Comparator — filter, sort, compare AI singing voice tools
document.addEventListener('DOMContentLoaded', function () {
  var TOOLS = [
    { name: 'Suno', cat: 'Text-to-Song', price: 10, priceLabel: 'Free credits · Pro $10/mo', best: 'Full song demos from a text prompt',
      features: ['Complete songs with vocals from text', 'Genre & style prompting', 'Remix, extend & persona tools'], site: 'https://suno.com' },
    { name: 'Udio', cat: 'Text-to-Song', price: 10, priceLabel: 'Free tier · Standard $10/mo', best: 'Polished AI song production',
      features: ['High-fidelity song output', 'Remix & extend tracks', 'Manual mode for more control'], site: 'https://www.udio.com' },
    { name: 'Kits.AI', cat: 'Voice Cloning', price: 10, priceLabel: 'Free tier · Creator ~$10/mo', best: 'Cloning & converting singing voices',
      features: ['Clone a voice from uploads', 'Royalty-free voice library', 'Built-in stem splitter'], site: 'https://www.kits.ai' },
    { name: 'ElevenLabs', cat: 'Voice Cloning', price: 5, priceLabel: 'Free 10k credits · Starter $5/mo', best: 'Cloning your own voice',
      features: ['Very natural voice cloning', '30+ languages', 'Developer API'], site: 'https://elevenlabs.io' },
    { name: 'Murf', cat: 'Voice Cloning', price: 19, priceLabel: 'Free trial · Creator $19/mo', best: 'Sung-style voiceovers & jingles',
      features: ['120+ AI voices', 'Voice changer', 'Built-in studio editor'], site: 'https://murf.ai' },
    { name: 'ACE Studio', cat: 'Singing Synthesis', price: null, priceLabel: 'Free trial · Paid plans', best: 'Realistic virtual singers from MIDI',
      features: ['AI singer voice library', 'DAW / VST integration', 'Multilingual singing'], site: 'https://acestudio.ai' },
    { name: 'Synthesizer V', cat: 'Singing Synthesis', price: null, priceLabel: 'Paid license · free Basic edition', best: 'Editable piano-roll vocal synthesis',
      features: ['Piano-roll vocal editing', 'Expandable voice databases', 'Works fully offline'], site: 'https://dreamtonics.com' },
    { name: 'Emvoice', cat: 'Singing Synthesis', price: null, priceLabel: 'Free tier · Paid plans', best: 'Browser-based vocal writing',
      features: ['Runs entirely in the browser', 'Realistic solo singers', 'No install needed'], site: 'https://emvoiceapp.com' },
    { name: 'LALAL.AI', cat: 'Vocal Utility', price: null, priceLabel: 'Pay-as-you-go packages', best: 'Isolating vocals from any track',
      features: ['Vocal / instrumental split', 'High-quality stems', 'Fast batch processing'], site: 'https://www.lalal.ai' },
    { name: 'Musicfy', cat: 'Text-to-Song', price: null, priceLabel: 'Free tier · Paid plans', best: 'Quick AI song & voice mashups',
      features: ['Text-to-music generation', 'Voice-to-instrument', 'Stem separation tools'], site: 'https://musicfy.lol' }
  ];

  var CATS = ['All', 'Text-to-Song', 'Singing Synthesis', 'Voice Cloning', 'Vocal Utility'];
  var state = { cat: 'All', sort: 'featured', compare: [] };

  var chipsEl = document.getElementById('catChips');
  var sortEl = document.getElementById('sortSel');
  var gridEl = document.getElementById('toolGrid');
  var countEl = document.getElementById('toolCount');
  var cmpOut = document.getElementById('compareOut');

  CATS.forEach(function (c) {
    var b = document.createElement('button');
    b.className = 'chip' + (c === 'All' ? ' on' : '');
    b.textContent = c;
    b.addEventListener('click', function () {
      state.cat = c;
      chipsEl.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      render();
    });
    chipsEl.appendChild(b);
  });
  sortEl.addEventListener('change', function () { state.sort = sortEl.value; render(); });

  function filtered() {
    var list = TOOLS.filter(function (t) { return state.cat === 'All' || t.cat === state.cat; });
    if (state.sort === 'priceAsc') list = list.slice().sort(function (a, b) { return (a.price === null) - (b.price === null) || (a.price || 0) - (b.price || 0); });
    else if (state.sort === 'priceDesc') list = list.slice().sort(function (a, b) { return (b.price === null) - (a.price === null) || (b.price || 0) - (a.price || 0); });
    else if (state.sort === 'name') list = list.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    return list;
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]); }); }

  function render() {
    var list = filtered();
    countEl.textContent = list.length + ' tool' + (list.length === 1 ? '' : 's');
    gridEl.innerHTML = '';
    list.forEach(function (t) {
      var d = document.createElement('div');
      d.className = 'card';
      var checked = state.compare.indexOf(t.name) !== -1 ? ' checked' : '';
      d.innerHTML =
        '<span class="badge">' + esc(t.cat) + '</span>' +
        '<h3>' + esc(t.name) + '</h3>' +
        '<p><b>Best for:</b> ' + esc(t.best) + '</p>' +
        '<p><b>Pricing:</b> ' + esc(t.priceLabel) + '</p>' +
        '<ul class="tight muted" style="font-size:.92rem;padding-left:18px">' +
        t.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
        '<p style="margin-top:12px"><label style="font-size:.9rem"><input type="checkbox" data-cmp="' + esc(t.name) + '"' + checked + '> Compare</label> ' +
        '<a class="btn ghost small" style="float:right" href="' + esc(t.site) + '" target="_blank" rel="noopener sponsored">Visit site ↗</a></p>';
      gridEl.appendChild(d);
    });
    gridEl.querySelectorAll('[data-cmp]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var n = cb.getAttribute('data-cmp');
        var i = state.compare.indexOf(n);
        if (cb.checked) {
          if (state.compare.length >= 3) { cb.checked = false; alert('Compare up to 3 tools at a time.'); return; }
          if (i === -1) state.compare.push(n);
        } else if (i !== -1) state.compare.splice(i, 1);
        renderCompare();
      });
    });
    renderCompare();
  }

  function renderCompare() {
    if (!state.compare.length) { cmpOut.innerHTML = '<span class="hint">Tick “Compare” on up to 3 tools to see them side by side.</span>'; return; }
    var sel = state.compare.map(function (n) { return TOOLS.filter(function (t) { return t.name === n; })[0]; });
    var rows = [
      ['Category', function (t) { return esc(t.cat); }],
      ['Best for', function (t) { return esc(t.best); }],
      ['Pricing', function (t) { return esc(t.priceLabel); }],
      ['Key features', function (t) { return '<ul class="tight" style="padding-left:16px;margin:0">' + t.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>'; }],
      ['Website', function (t) { return '<a href="' + esc(t.site) + '" target="_blank" rel="noopener sponsored">Visit ↗</a>'; }]
    ];
    var html = '<div class="tblwrap"><table class="data"><tr><th></th>' +
      sel.map(function (t) { return '<th>' + esc(t.name) + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) {
        return '<tr><td><b>' + r[0] + '</b></td>' + sel.map(function (t) { return '<td>' + r[1](t) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</table></div>';
    cmpOut.innerHTML = html;
  }

  render();
});
