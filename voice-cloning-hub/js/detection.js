// Interactive "spot AI-cloned voices" red-flags guide
var FLAGS = [
  {t:"Unnaturally perfect delivery", d:"No stumbles, no filler words, no micro-pauses — real human speech is messier. Clones often sound 'too clean' over long passages.", w:2},
  {t:"Missing or wrong breathing", d:"Humans breathe between phrases. Clones may have no audible breaths at all, or breaths in unnatural places.", w:2},
  {t:"Flat or mismatched emotion", d:"The words say 'exciting news!' but the tone stays neutral. Early clones struggle with emotional consistency across sentences.", w:2},
  {t:"Robotic cadence / odd pacing", d:"Evenly spaced syllables, strange pauses mid-sentence, or rushed endings — prosody glitches are a classic giveaway.", w:2},
  {t:"Audio artifacts (warbling, metallic tones)", d:"Listen on headphones: cloned audio can have faint warbling, underwater-like artifacts, or a metallic edge on sibilants (s/sh sounds).", w:3},
  {t:"Inconsistent accent or pronunciation", d:"The accent drifts mid-call, or common words are pronounced slightly 'off' for the supposed speaker.", w:2},
  {t:"Lip-sync mismatch (video)", d:"In video, mouth movements don't perfectly match the audio — a strong sign the audio track was generated or swapped.", w:3},
  {t:"Impossible knowledge or context", d:"The 'person' mentions events they couldn't know, or the request itself is bizarre (urgent wire transfer, gift cards, secrecy).", w:3},
  {t:"Refuses live verification", d:"They won't get on video, won't answer a callback to a known number, or pressure you to 'not tell anyone.'", w:3},
  {t:"Suspicious call context", d:"Unexpected urgent request + secrecy + money = scam pattern, regardless of how real the voice sounds.", w:3}
];

var TIPS = [
  "<b>Hang up, call back:</b> use a number you already have for the person — never one provided in the suspicious message.",
  "<b>Ask a personal verifier:</b> a question only the real person could answer ('What did we eat last Tuesday?').",
  "<b>Use a family code word:</b> agree on one in advance for emergency calls.",
  "<b>Check another channel:</b> text or video-call the person to confirm.",
  "<b>Slow the audio down:</b> artifacts and glitches are easier to hear at 0.5× speed.",
  "<b>Report it:</b> in the US, report voice-cloning scams to the FTC (reportfraud.ftc.gov) and your carrier."
];

document.addEventListener('DOMContentLoaded',function(){
  var list=document.getElementById('flagList');
  var max=FLAGS.reduce(function(a,f){return a+f.w;},0);
  function verdict(pct){
    if(pct<25) return ['Looks mostly natural','background:#0f2b22;color:#9be8c8','No strong AI indicators yet — but stay alert if the context is suspicious.'];
    if(pct<55) return ['Somewhat suspicious','background:#2a2113;color:#f5d98a','A few red flags detected. Verify the speaker through another channel before acting on anything.'];
    return ['Highly suspicious','background:#2e1414;color:#fca5a5','Multiple AI-voice indicators. Do NOT send money or share sensitive info — verify independently first.'];
  }
  function update(){
    var score=0;
    var boxes=list.querySelectorAll('input[type=checkbox]');
    boxes.forEach(function(b,i){ if(b.checked){score+=FLAGS[i].w;} });
    var pct=Math.round(score/max*100);
    document.getElementById('scoreBig').textContent=pct+'%';
    document.querySelector('#scoreWrap .meterbar i').style.width=pct+'%';
    var v=verdict(pct);
    var vd=document.getElementById('verdictBox');
    vd.style.cssText=v[1];
    vd.innerHTML='<strong>'+v[0]+'</strong><br><span style="font-weight:400;font-size:.9rem">'+v[2]+'</span>';
  }
  if(list){
    list.innerHTML=FLAGS.map(function(f,i){
      return '<label class="flag" id="f'+i+'"><input type="checkbox"><span class="t"><strong>'+f.t+'</strong><small>'+f.d+'</small></span></label>';
    }).join('');
    list.querySelectorAll('input').forEach(function(b,i){
      b.addEventListener('change',function(){
        document.getElementById('f'+i).classList.toggle('hit',b.checked);
        update();
      });
    });
    update();
    var tips=document.getElementById('tipsList');
    if(tips){ tips.innerHTML=TIPS.map(function(t){return '<li>'+t+'</li>';}).join(''); }
  }
});
