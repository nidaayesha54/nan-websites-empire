// Script Optimizer: word count, spoken duration, filler-word detection, pacing tips
(function () {
  'use strict';
  var FILLERS = [
    'um', 'uh', 'erm', 'ah', 'like', 'basically', 'actually', 'really', 'just',
    'so', 'well', 'you know', 'sort of', 'kind of', 'literally', 'stuff',
    'things', 'very', 'quite', 'pretty much', 'in order to', 'due to the fact that',
    'at this point in time', 'in my opinion', 'needless to say', 'each and every',
    'first and foremost', 'as a matter of fact'
  ];
  var PASSIVE = /\b(was|were|is|are|be|been|being|has been|have been)\s+\w+(ed|en)\b/gi;
  var WPM_DEFAULT = 150;

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function words(text) { return text.trim().split(/\s+/).filter(Boolean); }
  function sentences(text) {
    // Split on sentence-ending punctuation without lookbehind (older-browser safe)
    var parts = text.replace(/([.!?…])(\s+|$)/g, '$1\u0000').split('\u0000');
    return parts.map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function fmtDur(sec) {
    sec = Math.round(sec);
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function analyze() {
    var text = el('so-input').value;
    var wpm = parseInt(el('so-wpm').value, 10) || WPM_DEFAULT;
    el('so-wpm-lbl').textContent = wpm + ' WPM';
    var out = el('so-result');
    var w = words(text);
    if (!w.length) { out.innerHTML = '<p>Paste your script above to analyze it.</p>'; return; }

    var wc = w.length;
    var cc = text.length;
    var sents = sentences(text);
    var sc = sents.length;
    var avgWords = sc ? wc / sc : 0;
    var durSec = (wc / wpm) * 60;

    // Filler detection (case-insensitive, word-boundary)
    var lower = ' ' + text.toLowerCase().replace(/[^a-z0-9'\s]/g, ' ') + ' ';
    var fillerHits = [];
    FILLERS.forEach(function (f) {
      var re = new RegExp(' ' + f.replace(/ /g, '\\s+') + ' ', 'g');
      var m = lower.match(re);
      if (m) fillerHits.push({ word: f, n: m.length });
    });
    fillerHits.sort(function (a, b) { return b.n - a.n; });
    var totalFillers = fillerHits.reduce(function (s, f) { return s + f.n; }, 0);

    // Passive voice count
    var passive = (text.match(PASSIVE) || []).length;

    // Long sentences (>25 words)
    var longS = sents.map(function (s, i) {
      return { i: i + 1, n: words(s).length, s: s };
    }).filter(function (o) { return o.n > 25; })
      .sort(function (a, b) { return b.n - a.n; }).slice(0, 5);

    // Exclamation + adverb density
    var excl = (text.match(/!/g) || []).length;
    var ly = (text.toLowerCase().match(/\b\w+ly\b/g) || []).length;

    // Pacing tips
    var tips = [];
    if (avgWords > 20) tips.push('Your average sentence is ' + avgWords.toFixed(1) + ' words — spoken scripts land better at 12–18 words per sentence. Split long ones for breath control.');
    else tips.push('Good sentence length: ' + avgWords.toFixed(1) + ' words on average. That range breathes well on mic.');
    if (totalFillers > 0) tips.push('Found ' + totalFillers + ' filler word' + (totalFillers > 1 ? 's' : '') + ' (' + ((totalFillers / wc) * 100).toFixed(1) + '% of words). Cut them — they weaken authority on camera.');
    else tips.push('Zero filler words detected. Clean script — nice work.');
    if (passive > 0 && passive / sc > 0.25) tips.push(passive + ' likely passive constructions found. Prefer active voice ("We built it" not "It was built by us") — it sounds more energetic in voiceover.');
    if (excl > sc * 0.3) tips.push('Lots of exclamation marks (' + excl + '). On voiceover, one exclamation per minute is plenty — energy comes from pacing, not punctuation.');
    if (ly > wc * 0.05) tips.push(ly + ' "-ly" adverbs spotted. Strong verbs beat adverbs: "sprinted" instead of "ran quickly".');
    if (durSec > 600) tips.push('At ' + fmtDur(durSec) + ', this is a long listen. Consider chapters, a pattern break (music shift, rhetorical question), or splitting into parts for retention.');
    if (!/[?!]/.test(text)) tips.push('No questions or exclamations found. Add a rhetorical question every ~90 seconds to keep listeners leaning in.');
    // Reading level (Flesch)
    var syllables = w.join(' ').toLowerCase().replace(/[^a-z\s]/g, '')
      .split(/\s+/).reduce(function (s, word) {
        if (!word) return s;
        var n = (word.match(/[aeiouy]+/g) || []).length;
        return s + Math.max(1, n - (word.endsWith('e') ? 1 : 0));
      }, 0);
    var flesch = sc && wc ? 206.835 - 1.015 * (wc / sc) - 84.6 * (syllables / wc) : 0;
    var level = flesch >= 70 ? 'Conversational (easy to follow aloud)' :
      flesch >= 50 ? 'Moderate (fine for educated audiences)' : 'Dense (hard to voice naturally)';
    if (flesch < 50) tips.push('Reading ease is ' + Math.round(flesch) + ' — dense for spoken word. Shorten sentences and swap formal words for everyday ones.');

    // Target lengths table
    var targets = [30, 60, 120, 300, 600];
    var targetRows = targets.map(function (sec) {
      var low = Math.round(sec / 60 * (wpm - 10)), high = Math.round(sec / 60 * (wpm + 10));
      return '<tr><td>' + (sec >= 60 ? (sec / 60) + ' min' : sec + ' sec') + '</td><td>' + low + '–' + high + ' words</td></tr>';
    }).join('');

    var html = '<div class="stat-grid">' +
      '<div class="stat"><div class="num">' + wc + '</div><div class="lbl">Words</div></div>' +
      '<div class="stat"><div class="num">' + fmtDur(durSec) + '</div><div class="lbl">Spoken duration @' + wpm + 'wpm</div></div>' +
      '<div class="stat"><div class="num">' + sc + '</div><div class="lbl">Sentences</div></div>' +
      '<div class="stat"><div class="num">' + avgWords.toFixed(1) + '</div><div class="lbl">Avg words/sentence</div></div>' +
      '<div class="stat"><div class="num">' + totalFillers + '</div><div class="lbl">Filler words</div></div>' +
      '<div class="stat"><div class="num">' + Math.round(flesch) + '</div><div class="lbl">Reading ease (' + esc(level.split(' (')[0]) + ')</div></div>' +
      '</div>';

    html += '<h3 style="margin:14px 0 8px">🎯 Filler-word breakdown</h3>';
    if (fillerHits.length) {
      html += fillerHits.map(function (f) {
        var pct = Math.min(100, f.n * 12);
        return '<div class="filler-row"><span><b>' + esc(f.word) + '</b></span><span class="count">' + f.n + '×</span></div>' +
          '<div class="progress"><div style="width:' + pct + '%"></div></div>';
      }).join('');
    } else {
      html += '<div class="tip">No filler words found. Your script is camera-ready on this front. ✅</div>';
    }

    if (longS.length) {
      html += '<h3 style="margin:14px 0 8px">✂️ Longest sentences (split these)</h3>';
      html += longS.map(function (o) {
        return '<div class="warn"><b>Sentence ' + o.i + ' — ' + o.n + ' words:</b> ' + esc(o.s.slice(0, 140)) + (o.s.length > 140 ? '…' : '') + '</div>';
      }).join('');
    }

    html += '<h3 style="margin:14px 0 8px">💡 Pacing & delivery tips</h3>';
    html += tips.map(function (t) { return '<div class="tip">' + esc(t) + '</div>'; }).join('');

    html += '<h3 style="margin:14px 0 8px">📏 Word targets at your pace</h3>';
    html += '<table><tr><th>Video length</th><th>Word target</th></tr>' + targetRows + '</table>';

    out.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!el('so-input')) return;
    el('so-input').addEventListener('input', analyze);
    el('so-wpm').addEventListener('input', analyze);
    el('so-clear').addEventListener('click', function () { el('so-input').value = ''; analyze(); });
    el('so-sample').addEventListener('click', function () {
      el('so-input').value = 'Welcome back to the channel. Today we are basically going to talk about something really important. You know, a lot of people actually struggle with this. In order to succeed, you need to sort of understand the fundamentals. Let me explain each and every step, first and foremost, with real examples.';
      analyze();
    });
    analyze();
  });
})();
