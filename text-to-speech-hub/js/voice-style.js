// Voice Style Guide — tone picker with sample scripts + recommended settings
(function(){
  var styles = {
    professional: {
      name: 'Professional', icon: '💼',
      desc: 'Corporate narration: steady pace, neutral pitch, clear diction. Best for explainer videos, e-learning, and ads.',
      script: "At Meridian Financial, we believe every dollar should work as hard as you do. Our advisors build personalized strategies — so you can focus on what matters most.",
      settings: { voice: 'A deep US male or warm US female voice', rate: '0.95 – 1.0', pitch: '0.9 – 1.0', pauses: 'Short breaks after key phrases', tip: 'Keep sentences under 18 words for maximum clarity.' }
    },
    friendly: {
      name: 'Friendly', icon: '😊',
      desc: 'Warm and conversational: slightly faster pace, upward inflection, genuine energy. Best for YouTube intros, podcasts, and social content.',
      script: "Hey everyone, welcome back to the channel! Today I've got something super exciting to share with you — three simple tricks that'll make your videos sound amazing.",
      settings: { voice: 'A bright US female or youthful US male voice', rate: '1.05 – 1.15', pitch: '1.05 – 1.15', pauses: 'Natural pauses, avoid robotic gaps', tip: 'Smile while recording — listeners can hear it.' }
    },
    dramatic: {
      name: 'Dramatic', icon: '🎭',
      desc: 'Cinematic storytelling: slow pace, low pitch, strong emphasis on key words. Best for movie trailers, documentaries, and horror stories.',
      script: "In the year 2049, humanity made its final transmission. No one answered… until the silence itself began to speak.",
      settings: { voice: 'A deep, resonant US male voice', rate: '0.8 – 0.9', pitch: '0.75 – 0.85', pauses: 'Long breaks (600–900 ms) before reveals', tip: 'Emphasize verbs and nouns — never prepositions.' }
    },
    calm: {
      name: 'Calm', icon: '🌊',
      desc: 'Soothing and steady: slow pace, soft pitch, minimal variation. Best for meditation, audiobooks, and sleep stories.',
      script: "Take a slow, deep breath in… and let it go. With every breath, feel your shoulders relax, your thoughts slow down, and your body grow heavy and still.",
      settings: { voice: 'A soft, gentle voice — either gender', rate: '0.75 – 0.85', pitch: '0.9 – 1.0', pauses: 'Gentle breaks (500 ms) between sentences', tip: 'Avoid sudden emphasis — consistency soothes.' }
    }
  };

  var out = document.getElementById('styleOut');
  var chips = document.querySelectorAll('.chip[data-style]');

  function render(key){
    var s = styles[key];
    var rows = [
      ['Recommended voice', s.settings.voice],
      ['Speech rate', s.settings.rate],
      ['Pitch', s.settings.pitch],
      ['Pauses', s.settings.pauses],
      ['Pro tip', s.settings.tip]
    ].map(function(r){ return '<tr><th>' + r[0] + '</th><td>' + r[1] + '</td></tr>'; }).join('');
    out.innerHTML =
      '<h3>' + s.icon + ' ' + s.name + ' style</h3>' +
      '<p>' + s.desc + '</p>' +
      '<label>Sample script</label>' +
      '<div class="result"><p id="sampleScript">' + s.script + '</p>' +
      '<button class="btn-sm" id="copyScript">Copy script</button> ' +
      '<button class="btn-sm" id="previewScript">🔊 Preview voice</button></div>' +
      '<label>Recommended settings</label>' +
      '<table>' + rows + '</table>';
    document.getElementById('copyScript').addEventListener('click', function(){
      copyText(s.script, 'Sample script copied!');
    });
    document.getElementById('previewScript').addEventListener('click', function(){
      if(!window.speechSynthesis){ alert('Web Speech API not supported in this browser.'); return; }
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(s.script);
      var v = speechSynthesis.getVoices().find(function(x){ return x.lang === 'en-US'; });
      if(v) u.voice = v;
      var r = parseFloat(s.settings.rate.split('–')[0]);
      var p = parseFloat(s.settings.pitch.split('–')[0]);
      if(!isNaN(r)) u.rate = r; if(!isNaN(p)) u.pitch = p;
      speechSynthesis.speak(u);
    });
  }

  function copyText(t, msg){
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(function(){ alert(msg); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = t; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta); alert(msg);
    }
  }

  chips.forEach(function(c){
    c.addEventListener('click', function(){
      chips.forEach(function(x){ x.classList.remove('active'); });
      c.classList.add('active');
      render(c.getAttribute('data-style'));
    });
  });
  render('professional');
})();
