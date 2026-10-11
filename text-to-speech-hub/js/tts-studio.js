// TTS Studio — Web Speech API
(function(){
  var synth = window.speechSynthesis;
  var voiceSel = document.getElementById('voiceSel');
  var textEl = document.getElementById('ttsText');
  var rateEl = document.getElementById('rate');
  var pitchEl = document.getElementById('pitch');
  var volEl = document.getElementById('vol');
  var rateVal = document.getElementById('rateVal');
  var pitchVal = document.getElementById('pitchVal');
  var volVal = document.getElementById('volVal');
  var statusEl = document.getElementById('ttsStatus');
  var countEl = document.getElementById('wordCount');
  var durEl = document.getElementById('estDur');
  var voices = [];

  function setStatus(msg){ statusEl.textContent = msg; }

  function loadVoices(){
    voices = synth.getVoices() || [];
    // Prefer English voices first for our USA audience
    voices.sort(function(a,b){
      var ae = a.lang.indexOf('en') === 0 ? 0 : 1;
      var be = b.lang.indexOf('en') === 0 ? 0 : 1;
      return ae - be || a.name.localeCompare(b.name);
    });
    voiceSel.innerHTML = '';
    if(!voices.length){
      voiceSel.innerHTML = '<option>No voices found</option>';
      return;
    }
    voices.forEach(function(v, i){
      var o = document.createElement('option');
      o.value = i;
      o.textContent = v.name + ' (' + v.lang + ')' + (v.default ? ' — default' : '');
      voiceSel.appendChild(o);
    });
    // Auto-pick a US English voice when available
    var us = voices.findIndex(function(v){ return v.lang === 'en-US'; });
    if(us > -1) voiceSel.value = us;
  }

  function updSlider(){ rateVal.textContent = rateEl.value; pitchVal.textContent = pitchEl.value; volVal.textContent = volEl.value; }
  ['rate','pitch','vol'].forEach(function(id){
    document.getElementById(id).addEventListener('input', updSlider);
  });

  function countWords(t){ var w = t.trim().split(/\s+/).filter(Boolean); return t.trim() ? w.length : 0; }
  function updStats(){
    var words = countWords(textEl.value);
    countEl.textContent = words.toLocaleString();
    var mins = words / 150; // avg English speaking rate
    var m = Math.floor(mins), s = Math.round((mins - m) * 60);
    durEl.textContent = (words ? m + 'm ' + s + 's' : '0m 0s');
  }
  textEl.addEventListener('input', updStats);

  function makeUtterance(){
    var u = new SpeechSynthesisUtterance(textEl.value.trim() || textEl.placeholder);
    var v = voices[parseInt(voiceSel.value, 10)];
    if(v) u.voice = v;
    u.rate = parseFloat(rateEl.value);
    u.pitch = parseFloat(pitchEl.value);
    u.volume = parseFloat(volEl.value);
    u.onend = function(){ setStatus('Finished.'); };
    u.onerror = function(e){ setStatus('Speech error: ' + (e.error || 'unknown')); };
    return u;
  }

  document.getElementById('btnPlay').addEventListener('click', function(){
    if(!synth){ setStatus('Web Speech API not supported in this browser. Try Chrome or Edge.'); return; }
    if(synth.paused){ synth.resume(); setStatus('Resumed.'); return; }
    synth.cancel();
    synth.speak(makeUtterance());
    setStatus('Speaking…');
  });
  document.getElementById('btnPause').addEventListener('click', function(){
    if(synth.speaking && !synth.paused){ synth.pause(); setStatus('Paused.'); }
  });
  document.getElementById('btnStop').addEventListener('click', function(){
    synth.cancel(); setStatus('Stopped.');
  });
  document.getElementById('btnSample').addEventListener('click', function(){
    textEl.value = "Welcome to TextToSpeechHub! Paste your script here, pick a voice, and press play. Adjust the rate for faster narration, or lower the pitch for a deeper, more dramatic sound.";
    updStats();
  });

  if(!synth){
    setStatus('Web Speech API is not supported in this browser. Chrome, Edge, and Safari support it.');
  } else {
    loadVoices();
    if(synth.onvoiceschanged !== undefined) synth.onvoiceschanged = loadVoices;
  }
  updSlider(); updStats();
})();
