// TTS Narration Preview — Web Speech API with narration-optimized pacing
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }

  var synth = null;
  var supported = ('speechSynthesis' in window);
  var queue = [];
  var currentIndex = 0;
  var speaking = false;

  function status(msg) { $('ntts-status').textContent = msg; }

  function loadVoices() {
    if (!supported) return;
    synth = window.speechSynthesis;
    var voices = synth.getVoices();
    var sel = $('ntts-voice');
    sel.innerHTML = '';
    // Prefer English narration-friendly voices first
    voices.sort(function (a, b) {
      var ae = /^en([-_]|$)/i.test(a.lang) ? 0 : 1;
      var be = /^en([-_]|$)/i.test(b.lang) ? 0 : 1;
      return ae - be;
    });
    voices.forEach(function (v, i) {
      var o = document.createElement('option');
      o.value = i;
      o.textContent = v.name + ' — ' + v.lang + (v.default ? ' (default)' : '');
      sel.appendChild(o);
    });
    // Pre-select a US English voice if present
    var us = voices.findIndex(function (v) { return /^en[-_]US/i.test(v.lang); });
    if (us >= 0) sel.value = us;
  }

  function updateMeta() {
    var text = $('ntts-input').value;
    var words = window.ANH.countWords(text);
    var rate = parseFloat($('ntts-rate').value);
    var est = words > 0 ? Math.round((words / (150 * rate)) * 60) : 0;
    $('ntts-meta').textContent = words + ' words · ≈' + est + ' sec at ' + rate.toFixed(2) + '×';
    $('ntts-rate-lbl').textContent = parseFloat($('ntts-rate').value).toFixed(2) + '×';
    $('ntts-pitch-lbl').textContent = parseFloat($('ntts-pitch').value).toFixed(1);
    $('ntts-gap-lbl').textContent = $('ntts-gap').value + ' ms';
  }

  // Split into speakable chunks, preserving natural narration pauses
  function chunkText(text) {
    // Normalize: paragraph breaks become explicit pause tokens
    var normalized = text
      .replace(/\r/g, '')
      .replace(/\n\s*\n/g, ' ⟦PARA⟧ ')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    // Split on sentence boundaries
    var parts = normalized.match(/[^.!?…]+[.!?…]+["'”’)\]]*|[^.!?…]+$/g) || [];
    return parts.map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function buildQueue() {
    var chunks = chunkText($('ntts-input').value);
    queue = chunks;
    currentIndex = 0;
  }

  function speakChunk(i) {
    var voices = synth.getVoices();
    var sel = $('ntts-voice');
    var chunk = queue[i];

    // Paragraph break → silent beat instead of speech
    if (/⟦PARA⟧/.test(chunk)) {
      status('⏸ paragraph pause… (' + (i + 1) + '/' + queue.length + ')');
      setTimeout(next, parseInt($('ntts-gap').value, 10) * 3);
      return;
    }

    var u = new SpeechSynthesisUtterance(chunk.replace(/⟦PARA⟧/g, ''));
    var vIdx = parseInt(sel.value, 10);
    if (voices[vIdx]) u.voice = voices[vIdx];
    u.rate = parseFloat($('ntts-rate').value);
    u.pitch = parseFloat($('ntts-pitch').value);
    u.onend = function () {
      if (!speaking) return;
      setTimeout(next, parseInt($('ntts-gap').value, 10));
    };
    u.onerror = function () { if (speaking) next(); };
    status('🔊 Speaking chunk ' + (i + 1) + ' of ' + queue.length + '…');
    synth.speak(u);
  }

  function next() {
    currentIndex++;
    if (currentIndex >= queue.length) {
      speaking = false;
      status('Done ✓ — that\'s roughly how your narration will pace.');
      return;
    }
    speakChunk(currentIndex);
  }

  function play() {
    if (!supported) { status('Web Speech API is not supported in this browser. Try Chrome or Edge.'); return; }
    if (!$('ntts-input').value.trim()) { status('Paste your narration script first.'); return; }
    stop(true);
    buildQueue();
    if (!queue.length) { status('Nothing speakable found in the text.'); return; }
    speaking = true;
    speakChunk(0);
  }

  function pauseResume() {
    if (!supported || !synth) return;
    if (synth.paused) { synth.resume(); status('Resumed.'); }
    else if (synth.speaking) { synth.pause(); status('Paused.'); }
  }

  function stop(silent) {
    if (!supported || !synth) return;
    speaking = false;
    synth.cancel();
    if (!silent) status('Stopped.');
  }

  function applyPreset(name) {
    var presets = {
      audiobook: { rate: 0.9, pitch: 1.0, gap: 700 },
      documentary: { rate: 1.0, pitch: 0.95, gap: 450 },
      energetic: { rate: 1.12, pitch: 1.05, gap: 300 }
    };
    var p = presets[name];
    if (!p) return;
    $('ntts-rate').value = p.rate;
    $('ntts-pitch').value = p.pitch;
    $('ntts-gap').value = p.gap;
    updateMeta();
    status('Preset applied: ' + name + ' ✓');
  }

  function sample() {
    $('ntts-input').value = 'Chapter one. The rain had been falling since dawn, drumming a steady rhythm against the windows of the old bookshop. ' +
      'Mara pulled her coat tighter and pushed the door open. A small brass bell announced her arrival.\n\n' +
      '"You came," he said. "I was beginning to think the letter never reached you."';
    updateMeta();
    status('Sample loaded — press Play to hear it.');
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!supported) {
      status('⚠ Your browser does not support the Web Speech API. Open this page in Chrome or Edge.');
    } else {
      loadVoices();
      if (synth && synth.onvoiceschanged !== undefined) synth.onvoiceschanged = loadVoices;
    }
    ['ntts-input', 'ntts-rate', 'ntts-pitch', 'ntts-gap'].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener('input', updateMeta);
    });
    if ($('ntts-voice')) $('ntts-voice').addEventListener('change', updateMeta);
    if ($('ntts-play')) $('ntts-play').addEventListener('click', play);
    if ($('ntts-pause')) $('ntts-pause').addEventListener('click', pauseResume);
    if ($('ntts-stop')) $('ntts-stop').addEventListener('click', function () { stop(false); });
    if ($('ntts-sample')) $('ntts-sample').addEventListener('click', sample);
    document.querySelectorAll('[data-preset]').forEach(function (btn) {
      btn.addEventListener('click', function () { applyPreset(btn.getAttribute('data-preset')); });
    });
    updateMeta();
    if (!supported) { /* status already set */ } else { status('Ready. Pick a voice and press Play.'); }
  });
})();
