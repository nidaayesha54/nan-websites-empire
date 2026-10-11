// Interactive "How voice cloning works" explainer + data requirements estimator
var STEPS = [
  {n:"Step 1", t:"Audio collection", s:"Gather clean samples of the target voice.",
   d:"<p>The process starts with raw recordings of the person whose voice will be cloned. Quality matters more than quantity at first: a quiet room, a decent microphone, and natural speech beat hours of noisy audio.</p><ul><li>Best sources: studio/podcast recordings, voice notes, narrated content</li><li>Good recordings should have one speaker, minimal background noise, and varied speech (different emotions, speeds, and words)</li><li>Ethics gate: the person speaking in the recordings must have consented to voice cloning. Reputable tools require this.</li></ul>"},
  {n:"Step 2", t:"Preprocessing & cleanup", s:"Noise removal, diarization, and normalization.",
   d:"<p>Raw audio is cleaned before any AI touches it:</p><ul><li><b>Noise reduction</b> removes hum, echo, and background sounds</li><li><b>Diarization</b> separates speakers so only the target voice is kept</li><li><b>Normalization</b> evens out volume and trims silence</li><li>Poor cleanup is the #1 reason clones sound robotic or distorted</li></ul>"},
  {n:"Step 3", t:"Feature extraction", s:"The AI learns the voice's unique fingerprint.",
   d:"<p>Modern systems convert audio into a <b>speaker embedding</b> — a compact numerical profile of the voice's distinctive traits:</p><ul><li>Timbre (the texture that makes a voice recognizable)</li><li>Pitch range and rhythm patterns</li><li>Pronunciation quirks and pacing habits</li><li>Neural codecs (like those in modern TTS) capture far more detail than old statistical models — which is why today's clones are so convincing</li></ul>"},
  {n:"Step 4", t:"Model training / fine-tuning", s:"A generative model learns to speak as this voice.",
   d:"<p>The speaker embedding guides a text-to-speech model (often a diffusion or transformer-based generator):</p><ul><li><b>Instant cloning (seconds–1 min of audio):</b> zero-shot models generalize from a short sample — fast but less consistent over long passages</li><li><b>Professional cloning (15–30+ min):</b> the model is fine-tuned on the voice — far more natural, stable, and expressive</li><li>Reputable providers verify identity here (e.g., reading a consent script) before training</li></ul>"},
  {n:"Step 5", t:"Inference & speech synthesis", s:"Type text — the clone speaks it.",
   d:"<p>Once trained, the voice can say anything you type or script:</p><ul><li>Text is converted to phonemes, then the model generates audio in the cloned voice with chosen emotion, speed, and emphasis</li><li>Most platforms let you adjust stability, style, and pacing per line</li><li>Responsible platforms embed <b>watermarks or provenance metadata</b> so cloned audio can be detected</li><li>Remember: generating speech in someone's voice still requires their consent — technology doesn't grant permission</li></ul>"}
];

var TIERS = {
  instant:{label:"Instant / zero-shot clone", mins:"1–5 minutes",
    note:"Good for quick tests and short messages. Quality drops on long or emotional passages; accents may drift.",
    rec:["Record in a quiet room, close to the mic","Speak naturally for at least 3 minutes (read aloud from a book)","Avoid music, echo, or other speakers","Include varied sentences — questions, exclamations, pauses"]},
  standard:{label:"Standard quality clone", mins:"10–20 minutes",
    note:"Solid for narration, audiobooks, and content creation. Most creator plans sit here.",
    rec:["Split recording into 5-minute sessions to avoid vocal fatigue","Use a USB mic or headset (not a laptop mic)","Cover different tones: cheerful, calm, serious","Export as WAV or high-bitrate MP3, 44.1kHz+"]},
  pro:{label:"Broadcast / professional clone", mins:"30+ minutes (ideally 60–90)",
    note:"Studio-grade stability for commercial work, dubbing, and long-form narration. Providers usually verify identity with a consent recording.",
    rec:["Record across multiple days for vocal variety","Include emotional range: joy, anger, sadness, whispering","Keep a consistent mic position and distance","Have the speaker read a written consent statement on record"]},
  realtime:{label:"Real-time conversational voice", mins:"15–30 minutes",
    note:"For AI agents and live voice chat. Needs clean, consistent samples for low-latency streaming.",
    rec:["Consistent pacing and energy across all samples","Avoid extreme vocal performances","Short, natural sentences work best for dialogue models"]}
};

document.addEventListener('DOMContentLoaded',function(){
  var viz=document.getElementById('stepviz');
  var det=document.getElementById('stepdetail');
  if(viz){
    STEPS.forEach(function(s,i){
      var b=document.createElement('button');
      b.className='stepbtn'+(i===0?' active':'');
      b.innerHTML='<span class="n">'+s.n+'</span><h4>'+s.t+'</h4><p>'+s.s+'</p>';
      b.addEventListener('click',function(){
        viz.querySelectorAll('.stepbtn').forEach(function(x){x.classList.remove('active');});
        b.classList.add('active');
        det.innerHTML='<h3>'+s.n+': '+s.t+'</h3>'+s.d;
      });
      viz.appendChild(b);
    });
    det.innerHTML='<h3>'+STEPS[0].n+': '+STEPS[0].t+'</h3>'+STEPS[0].d;
  }
  // Estimator
  var chips=document.querySelectorAll('#tierchips .chip');
  var out=document.getElementById('estimatorOut');
  function renderTier(key){
    var t=TIERS[key];
    var html='<h3>Recommended audio: <b>'+t.mins+'</b> for a '+t.label+'</h3>';
    html+='<p>'+t.note+'</p><ul>'+t.rec.map(function(r){return '<li>'+r+'</li>';}).join('')+'</ul>';
    html+='<p style="margin-top:10px;font-size:.9rem;color:var(--warn)">Ethics reminder: only clone voices you own or have explicit, written permission to use.</p>';
    out.innerHTML=html;
  }
  if(chips.length){
    chips.forEach(function(c){
      c.addEventListener('click',function(){
        chips.forEach(function(x){x.classList.remove('active');});
        c.classList.add('active');
        renderTier(c.dataset.tier);
      });
    });
    renderTier('standard');
  }
});
