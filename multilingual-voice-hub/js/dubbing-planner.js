// Dubbing Planner — per-language word targets + timing notes
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const scriptEl = $('dp-script'), wordsEl = $('dp-words');
  if (!scriptEl) return;

  // Average word-count expansion of translated speech vs English source (spoken duration factor).
  const LANGS = [
    { name: 'Spanish', factor: 1.22, note: 'Runs long — trim filler, tighten pauses, or raise delivery speed ~5%.' },
    { name: 'French', factor: 1.12, note: 'Slightly longer; watch long vowel stretches in lip-sync.' },
    { name: 'German', factor: 1.15, note: 'Compound words stretch timing; break long words across pauses.' },
    { name: 'Portuguese', factor: 1.20, note: 'Similar to Spanish — budget extra seconds per scene.' },
    { name: 'Italian', factor: 1.14, note: 'Musical pacing helps; natural emphasis lands well on camera.' },
    { name: 'Dutch', factor: 1.08, note: 'Close to English timing; minor adjustments needed.' },
    { name: 'Arabic', factor: 1.25, note: 'Longest expansion — script needs condensing or faster pacing.' },
    { name: 'Hindi', factor: 1.10, note: 'Close to English; fine for most narration dubs.' },
    { name: 'Urdu', factor: 1.14, note: 'Slightly longer; works well with conversational pacing.' },
    { name: 'Mandarin', factor: 0.85, note: 'Shorter — add pauses or B-roll to keep scenes in sync.' },
    { name: 'Japanese', factor: 0.80, note: 'Shorter spoken time; add natural pauses between phrases.' },
    { name: 'Korean', factor: 0.88, note: 'Shorter — stretch delivery or add reaction beats.' },
    { name: 'Russian', factor: 1.10, note: 'Slightly longer; consonant clusters need clear enunciation.' },
    { name: 'Turkish', factor: 1.12, note: 'Agglutination stretches words; plan pause points.' },
    { name: 'Polish', factor: 1.08, note: 'Near English timing; minor tweaks only.' }
  ];

  // build checkboxes
  const grid = $('dp-langs');
  LANGS.forEach((l, i) => {
    const lab = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.value = i;
    cb.checked = ['Spanish', 'French', 'German', 'Hindi', 'Arabic'].includes(l.name);
    lab.appendChild(cb);
    lab.appendChild(document.createTextNode(l.name));
    grid.appendChild(lab);
  });

  scriptEl.addEventListener('input', () => {
    const t = scriptEl.value.trim();
    if (t) wordsEl.value = t.split(/\s+/).length;
  });

  function fmt(n) {
    return Math.round(n).toLocaleString('en-US');
  }

  $('dp-go').addEventListener('click', () => {
    const words = Math.max(10, Number(wordsEl.value) || 1500);
    const pace = Number($('dp-pace').value) || 150;
    const duration = Math.max(1, Number($('dp-duration').value) || 10);
    const chosen = [...grid.querySelectorAll('input:checked')].map(cb => LANGS[Number(cb.value)]);
    const res = $('dp-result');

    if (!chosen.length) {
      res.style.display = 'block';
      res.innerHTML = '<b>Pick at least one target language</b> to generate your dubbing plan.';
      return;
    }

    const srcMin = words / pace;
    let rows = chosen.map(l => {
      const tWords = Math.round(words * l.factor);
      const tMin = tWords / pace;
      const delta = tMin - srcMin;
      const deltaTxt = delta >= 0
        ? '+' + delta.toFixed(1) + ' min vs source'
        : delta.toFixed(1) + ' min vs source';
      const fix = delta > 1
        ? 'Condense script or dub at ~1.05\u20131.1\u00d7 rate.'
        : (delta < -1 ? 'Add pauses / reaction beats to fill scenes.' : 'Syncs easily \u2014 good lip-sync candidate.');
      return '<tr><td><b>' + l.name + '</b></td><td>' + fmt(tWords) + '</td><td>' +
        tMin.toFixed(1) + ' min</td><td>' + deltaTxt + '</td><td>' + fix + '<br><span style="color:var(--muted)">' +
        l.note + '</span></td></tr>';
    }).join('');

    res.style.display = 'block';
    res.innerHTML =
      '<div class="stat-grid">' +
      '<div class="stat"><div class="num">' + fmt(words) + '</div><div class="lbl">source words (EN)</div></div>' +
      '<div class="stat"><div class="num">' + srcMin.toFixed(1) + ' min</div><div class="lbl">source spoken @ ' + pace + ' wpm</div></div>' +
      '<div class="stat"><div class="num">' + chosen.length + '</div><div class="lbl">target languages</div></div>' +
      '<div class="stat"><div class="num">' + duration + ' min</div><div class="lbl">target video length</div></div>' +
      '</div>' +
      '<table><tr><th>Language</th><th>Word target</th><th>Spoken time</th><th>Delta</th><th>Timing notes</th></tr>' + rows + '</table>' +
      '<div class="tip"><b>Workflow tip:</b> export your translated scripts, then lock brand terms with the ' +
      '<a href="translation-glossary.html">translation glossary builder</a> before generating voices \u2014 ' +
      'consistent terms make every language sound professional.</div>';
  });
})();
