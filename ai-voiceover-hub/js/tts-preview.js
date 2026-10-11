// TTS Preview: Web Speech API — paste script, hear it with voices/rates
(function () {
  'use strict';
  function el(id) { return document.getElementById(id); }
  var voices = [];

  function supported() { return ('speechSynthesis' in window); }

  function loadVoices() {
    if (!supported()) return;
    voices = window.speechSynthesis.getVoices().slice();
    voices.sort(function (a, b) {
      var au = a.lang.toLowerCase().indexOf('en-us') === 0 ? 0 : a.lang.toLowerCase().indexOf('en') === 0 ? 1 : 2;
      var bu = b.lang.toLowerCase().indexOf('en-us') === 0 ? 0 : b.lang.toLowerCase().indexOf('en') === 0 ? 1 : 2;
      return au - bu || a.name.localeCompare(b.name);
    });
    var sel = el('tts-voice');
    sel.innerHTML = '';
    if (!voices.length) {
      sel.innerHTML = '<option value="">No voices found on this device</option>';
      return;
    }
    voices.forEach(function (v, i) {
      var o = document.createElement('option');
      o.value = i;
      o.textContent = v.name + ' (' + v.lang + ')' + (v.default ? ' — default' : '');
      sel.appendChild(o);
    });
    var enUS = voices.findIndex(function (v) { return v.lang.toLowerCase().indexOf('en-us') === 0; });
    if (enUS >= 0) sel.value = enUS;
  }

  function speak() {
    if (!supported()) { el('tts-status').textContent = 'Speech synthesis is not supported in this browser. Try Chrome or Edge.'; return; }
    window.speechSynthesis.cancel();
    var text = el('tts-input').value.trim();
    if (!text) { el('tts-status').textContent = 'Paste some script text first.'; return; }
    var u = new SpeechSynthesisUtterance(text);
    var vi = parseInt(el('tts-voice').value, 10);
    if (voices[vi]) u.voice = voices[vi];
    u.rate = parseFloat(el('tts-rate').value);
    u.pitch = parseFloat(el('tts-pitch').value);
    u.onstart = function () { el('tts-status').textContent = '🔊 Speaking… (' + (voices[vi] ? voices[vi].name : 'default voice') + ' @ ' + u.rate + '×)'; };
    u.onend = function () { el('tts-status').textContent = '✅ Done. Try another voice or rate to compare.'; };
    u.onerror = function (e) { el('tts-status').textContent = '⚠️ Playback error: ' + (e.error || 'unknown'); };
    window.speechSynthesis.speak(u);
  }

  function wordCount() {
    var n = el('tts-input').value.trim().split(/\s+/).filter(Boolean).length;
    var rate = parseFloat(el('tts-rate').value);
    var wpm = 150 * rate;
    var sec = n ? (n / wpm) * 60 : 0;
    el('tts-meta').textContent = n + ' words · ≈' + Math.round(sec) + 's at ' + rate.toFixed(2).replace(/0$/, '') + '×';
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!el('tts-input')) return;
    if (!supported()) {
      el('tts-status').textContent = '⚠️ Your browser does not support the Web Speech API. Please open this page in Chrome, Edge, or Safari.';
      el('tts-play').disabled = true;
    }
    loadVoices();
    if (supported() && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    el('tts-play').addEventListener('click', speak);
    el('tts-pause').addEventListener('click', function () {
      if (!supported()) return;
      if (window.speechSynthesis.speaking) {
        if (window.speechSynthesis.paused) { window.speechSynthesis.resume(); el('tts-status').textContent = '🔊 Resumed.'; }
        else { window.speechSynthesis.pause(); el('tts-status').textContent = '⏸️ Paused.'; }
      }
    });
    el('tts-stop').addEventListener('click', function () {
      if (supported()) window.speechSynthesis.cancel();
      el('tts-status').textContent = '⏹️ Stopped.';
    });
    el('tts-rate').addEventListener('input', function () {
      el('tts-rate-lbl').textContent = parseFloat(el('tts-rate').value).toFixed(2).replace(/0$/, '') + '×';
      wordCount();
    });
    el('tts-pitch').addEventListener('input', function () {
      el('tts-pitch-lbl').textContent = parseFloat(el('tts-pitch').value).toFixed(1);
    });
    el('tts-input').addEventListener('input', wordCount);
    document.querySelectorAll('[data-sample-line]').forEach(function (b) {
      b.addEventListener('click', function () {
        el('tts-input').value = b.getAttribute('data-sample-line');
        wordCount();
      });
    });
    wordCount();
  });
})();
