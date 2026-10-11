/* Text to speech via Web Speech API */
var voices = [];
function loadVoices() {
  voices = window.speechSynthesis.getVoices();
  var sel = document.getElementById('tts-voice');
  if (!sel) return;
  sel.innerHTML = '';
  voices.forEach(function (v, i) {
    var o = document.createElement('option');
    o.value = i; o.textContent = v.name + ' (' + v.lang + ')';
    sel.appendChild(o);
  });
}
function ttsSpeak() {
  if (!('speechSynthesis' in window)) { toast('Speech not supported in this browser'); return; }
  window.speechSynthesis.cancel();
  var text = document.getElementById('tts-input').value.trim();
  if (!text) { toast('Enter some text first'); return; }
  var u = new SpeechSynthesisUtterance(text);
  var vi = parseInt(document.getElementById('tts-voice').value, 10);
  if (voices[vi]) u.voice = voices[vi];
  u.rate = parseFloat(document.getElementById('tts-rate').value);
  u.pitch = parseFloat(document.getElementById('tts-pitch').value);
  window.speechSynthesis.speak(u);
}
function ttsStop() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
document.addEventListener('DOMContentLoaded', function () {
  if (!('speechSynthesis' in window)) return;
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) window.speechSynthesis.onvoiceschanged = loadVoices;
  var r = document.getElementById('tts-rate');
  if (r) r.addEventListener('input', function () { document.getElementById('tts-rate-val').textContent = r.value + 'x'; });
  var p = document.getElementById('tts-pitch');
  if (p) p.addEventListener('input', function () { document.getElementById('tts-pitch-val').textContent = p.value; });
});
