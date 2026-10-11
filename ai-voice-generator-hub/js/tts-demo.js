// Live TTS demo using the browser Web Speech API (no signup, no server).
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }

  var synth = window.speechSynthesis || null;
  var voices = [];
  var textEl, voiceEl, rateEl, pitchEl, rateVal, pitchVal, countEl, statusEl;

  function refreshVoices() {
    if (!synth) return;
    voices = synth.getVoices().sort(function (a, b) { return a.name.localeCompare(b.name); });
    var keep = voiceEl.value;
    voiceEl.innerHTML = '';
    voices.forEach(function (v, i) {
      var o = document.createElement('option');
      o.value = i;
      o.textContent = v.name + ' (' + v.lang + ')' + (v.default ? ' — default' : '');
      voiceEl.appendChild(o);
    });
    if (keep !== '' && voiceEl.querySelector('option[value="' + keep + '"]')) voiceEl.value = keep;
    statusEl.innerHTML = voices.length
      ? 'Ready — <span class="live">' + voices.length + ' voices found</span> on your device.'
      : 'No voices found. Your browser may need a moment, or it may not support speech synthesis.';
  }

  function updateCount() {
    var t = textEl.value;
    var words = t.trim() ? t.trim().split(/\s+/).length : 0;
    countEl.textContent = t.length + ' characters · ' + words + ' words · ≈' +
      Math.max(1, Math.round(words / 150)) + ' min of audio';
  }

  function speak() {
    if (!synth) return;
    synth.cancel();
    var text = textEl.value.trim();
    if (!text) { statusEl.textContent = 'Type or paste some text first.'; return; }
    var u = new SpeechSynthesisUtterance(text);
    var v = voices[parseInt(voiceEl.value, 10)];
    if (v) u.voice = v;
    u.rate = parseFloat(rateEl.value);
    u.pitch = parseFloat(pitchEl.value);
    u.onstart = function () { statusEl.innerHTML = '🔊 <span class="live">Speaking…</span>'; };
    u.onend = function () { statusEl.textContent = 'Finished. Press Play to hear it again.'; };
    u.onerror = function () { statusEl.textContent = 'Playback was interrupted.'; };
    synth.speak(u);
  }

  function downloadNote() {
    var text = textEl.value.trim();
    if (!text) { statusEl.textContent = 'Nothing to download yet — add some text first.'; return; }
    var v = voices[parseInt(voiceEl.value, 10)];
    var header = 'AIVoiceGeneratorHub — TTS script note\n' +
      'Voice: ' + (v ? v.name + ' (' + v.lang + ')' : 'default') + '\n' +
      'Rate: ' + rateEl.value + ' | Pitch: ' + pitchEl.value + '\n' +
      '---\n\n';
    var blob = new Blob([header + text], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tts-script-note.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    statusEl.textContent = '✅ Script note downloaded as tts-script-note.txt (recreate the audio anytime by pasting it back here).';
  }

  document.addEventListener('DOMContentLoaded', function () {
    textEl = $('tts-text'); voiceEl = $('tts-voice');
    rateEl = $('tts-rate'); pitchEl = $('tts-pitch');
    rateVal = $('tts-rate-val'); pitchVal = $('tts-pitch-val');
    countEl = $('tts-count'); statusEl = $('tts-status');

    if (!synth) {
      statusEl.innerHTML = '⚠️ This browser does not support the Web Speech API. Try Chrome, Edge, or Safari on desktop.';
      $('tts-play').disabled = true;
      return;
    }

    refreshVoices();
    if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = refreshVoices;

    textEl.addEventListener('input', updateCount);
    rateEl.addEventListener('input', function () { rateVal.textContent = rateEl.value + 'x'; });
    pitchEl.addEventListener('input', function () { pitchVal.textContent = pitchEl.value; });

    $('tts-play').addEventListener('click', speak);
    $('tts-stop').addEventListener('click', function () {
      synth.cancel();
      statusEl.textContent = 'Stopped.';
    });
    $('tts-pause').addEventListener('click', function () {
      if (synth.speaking && !synth.paused) { synth.pause(); statusEl.textContent = '⏸ Paused — press Play to restart from the top.'; }
    });
    $('tts-download').addEventListener('click', downloadNote);
    $('tts-sample').addEventListener('click', function () {
      textEl.value = 'Welcome to A I Voice Generator Hub. Paste any script, pick a voice, and hear it read aloud instantly — no signup, no software, right in your browser.';
      updateCount();
    });

    updateCount();
  });
})();
