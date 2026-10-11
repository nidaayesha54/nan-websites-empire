/* TTS Demo: Web Speech API podcast voice preview */
document.addEventListener('DOMContentLoaded', function(){
  if(!('speechSynthesis' in window)){
    setError('ttsResults', 'Sorry — your browser does not support the Web Speech API. Try Chrome, Edge, or Safari to preview voices.');
    return;
  }
  populateVoices();
  if('onvoiceschanged' in speechSynthesis){ speechSynthesis.onvoiceschanged = populateVoices; }

  $('rate').addEventListener('input', function(){ $('rateVal').textContent = parseFloat(this.value).toFixed(2) + '\u00D7'; updateStats(); });
  $('pitch').addEventListener('input', function(){ $('pitchVal').textContent = parseFloat(this.value).toFixed(2) + '\u00D7'; });
  $('demoText').addEventListener('input', updateStats);
  $('speakBtn').addEventListener('click', speak);
  $('pauseBtn').addEventListener('click', function(){ speechSynthesis.pause(); });
  $('resumeBtn').addEventListener('click', function(){ speechSynthesis.resume(); });
  $('stopBtn').addEventListener('click', function(){ speechSynthesis.cancel(); });
  $('sampleBtn').addEventListener('click', function(){
    $('demoText').value = 'Welcome to the show. Today we\u2019re diving into the world of AI podcast voices — how they work, which ones sound the most human, and how you can use them to launch your own show this week. Grab your headphones. Let\u2019s get into it.';
    updateStats();
  });
  updateStats();
});

function populateVoices(){
  var sel = $('voiceSelect');
  var voices = speechSynthesis.getVoices().slice();
  if(!voices.length) return;
  /* English (US) first, then other English, then the rest */
  voices.sort(function(a,b){
    var score = function(v){
      if(/^en[-_]US/i.test(v.lang)) return 0;
      if(/^en/i.test(v.lang)) return 1;
      return 2;
    };
    return score(a) - score(b) || a.name.localeCompare(b.name);
  });
  var keep = sel.value;
  sel.innerHTML = '';
  voices.forEach(function(v){
    var o = document.createElement('option');
    o.value = v.name;
    o.textContent = v.name + ' (' + v.lang + ')';
    sel.appendChild(o);
  });
  if(keep){ sel.value = keep; }
}

function updateStats(){
  var text = ($('demoText').value || '').trim();
  var w = text ? text.split(/\s+/).length : 0;
  var secs = Math.round(w / 150 * 60); /* ~150 wpm podcast pace */
  $('wordCount').textContent = words(w) + ' words';
  $('estDur').textContent = '≈ ' + mmss(secs) + ' at podcast pace';
}

function speak(){
  var text = ($('demoText').value || '').trim();
  if(text.length < 5){ setError('ttsResults', 'Paste at least a sentence of script text first.'); return; }
  speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(text);
  var sel = $('voiceSelect');
  var voices = speechSynthesis.getVoices();
  for(var i=0;i<voices.length;i++){
    if(voices[i].name === sel.value){ u.voice = voices[i]; break; }
  }
  u.rate = parseFloat($('rate').value) || 1;
  u.pitch = parseFloat($('pitch').value) || 1;
  u.onstart = function(){ $('ttsStatus').textContent = 'Playing…'; };
  u.onend = u.onerror = function(){ $('ttsStatus').textContent = 'Ready.'; };
  $('ttsResults').innerHTML = '<div class="verdict good">Playing your script — listen for pacing, emphasis, and how the voice handles your hook.</div>';
  speechSynthesis.speak(u);
}
