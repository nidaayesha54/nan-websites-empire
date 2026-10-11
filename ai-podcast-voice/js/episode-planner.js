/* Episode Planner: outline generator + per-segment countdown timers */
document.addEventListener('DOMContentLoaded', function(){
  var form = $('epForm');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    generateOutline();
  });
});

var HOOKS = {
  casual: 'a question everyone secretly wonders about',
  professional: 'a challenge your industry keeps getting wrong',
  humorous: 'something so ridiculous you will laugh out loud',
  inspiring: 'a story that might just change how you see things'
};

var ANGLES = [
  {t:'The story behind {topic}', p:['How this topic started and why it matters now','The key moment that changed everything','The people or ideas at the center of it']},
  {t:'What most people get wrong about {topic}', p:['The #1 misconception (and the truth)','Why this myth keeps spreading','What to believe instead']},
  {t:'Real-world examples of {topic}', p:['A success story listeners can copy','A cautionary tale (what not to do)','What the data actually says']},
  {t:'Actionable takeaways on {topic}', p:['One thing to try this week','A simple framework to remember','Where to go deeper (resources)']},
  {t:'Myths vs. facts: {topic} edition', p:['Myth 1 vs. the reality','Myth 2 vs. the reality','The one fact that surprises everyone']},
  {t:'The future of {topic}', p:['Where this is heading in the next 2 years','What early adopters are already doing','How to stay ahead of the curve']}
];

var TONE_LINES = {
  casual: 'Keep it conversational — talk like you would to a smart friend.',
  professional: 'Keep it crisp and credible — cite sources and stay on point.',
  humorous: 'Lean into the comedy — callbacks and playful exaggeration welcome.',
  inspiring: 'Speak to the heart — stories first, lessons second.'
};

function fill(s, topic){ return s.replace(/\{topic\}/g, topic); }

function generateOutline(){
  var box = $('epResults');
  var topic = ($('epTopic').value || '').trim();
  var totalMin = parseInt($('epDuration').value, 10) || 30;
  var nSeg = parseInt($('epSegments').value, 10) || 3;
  var tone = $('epTone').value || 'casual';
  if(topic.length < 3){ setError('epResults', 'Please enter a topic of at least 3 characters.'); return; }

  var introMin = Math.max(1, Math.round(totalMin * 0.08));
  var outroMin = Math.max(1, Math.round(totalMin * 0.07));
  var segBudget = totalMin - introMin - outroMin;
  var base = Math.floor(segBudget / nSeg), extra = segBudget % nSeg;
  var segMins = [];
  for(var i=0;i<nSeg;i++){ segMins.push(base + (i < extra ? 1 : 0)); }

  var topicCap = topic.charAt(0).toUpperCase() + topic.slice(1);
  var htmlOut = '<div class="result-hero"><div class="lbl">Total episode runtime</div><div class="big">' +
    totalMin + ' min</div><div class="lbl">' + (nSeg+2) + ' blocks &middot; ' + nSeg + ' segments</div></div>';

  /* intro */
  htmlOut += '<div class="outline-block"><h3>Intro <span class="seg-time">' + introMin + ' min</span></h3><ul>' +
    '<li><strong>Hook (30s):</strong> "' + esc(topicCap) + ' — ' + esc(HOOKS[tone]) + '."</li>' +
    '<li><strong>Welcome:</strong> who you are, what the show is about, one sentence.</li>' +
    '<li><strong>Preview:</strong> "Today: ' + segMins.map(function(m,i){ return (i+1)+'. '+esc(fill(ANGLES[i % ANGLES.length].t, topicCap)); }).join('; ') + '."</li>' +
    '<li><strong>Tone note:</strong> ' + esc(TONE_LINES[tone]) + '</li></ul>' +
    '<div class="timer" data-secs="' + (introMin*60) + '"></div></div>';

  /* segments */
  for(var s=0; s<nSeg; s++){
    var a = ANGLES[s % ANGLES.length];
    var title = fill(a.t, topicCap);
    var pts = a.p.map(function(pt){ return '<li>' + esc(fill(pt, topic)) + '</li>'; }).join('');
    htmlOut += '<div class="outline-block"><h3>Segment ' + (s+1) + ': ' + esc(title) + ' <span class="seg-time">' + segMins[s] + ' min</span></h3>' +
      '<p><strong>Transition in:</strong> "So let\'s dig into ' + esc(title.charAt(0).toLowerCase() + title.slice(1)) + '..."</p>' +
      '<ul>' + pts + '</ul>' +
      '<div class="timer" data-secs="' + (segMins[s]*60) + '"></div></div>';
  }

  /* outro */
  htmlOut += '<div class="outline-block"><h3>Outro <span class="seg-time">' + outroMin + ' min</span></h3><ul>' +
    '<li><strong>Recap:</strong> the 2–3 biggest takeaways from today’s episode.</li>' +
    '<li><strong>CTA:</strong> subscribe, leave a review, share with one person who needs this.</li>' +
    '<li><strong>Tease:</strong> what’s coming in the next episode.</li>' +
    '<li><strong>Sign-off:</strong> your tagline + theme music fade.</li></ul>' +
    '<div class="timer" data-secs="' + (outroMin*60) + '"></div></div>';

  htmlOut += '<button type="button" class="btn btn-primary" id="copyOutline">Copy outline as text</button>';
  box.innerHTML = htmlOut;

  /* wire timers */
  var timers = box.querySelectorAll('.timer');
  timers.forEach(function(el){ initTimer(el, parseInt(el.getAttribute('data-secs'),10)); });

  /* copy handler */
  var plain = 'EPISODE OUTLINE: ' + topicCap + ' (' + totalMin + ' min)\n\n' +
    'INTRO (' + introMin + ' min)\n- Hook, welcome, preview, tone\n\n';
  for(var j=0;j<nSeg;j++){
    var a2 = ANGLES[j % ANGLES.length];
    plain += 'SEGMENT ' + (j+1) + ': ' + fill(a2.t, topicCap) + ' (' + segMins[j] + ' min)\n' +
      a2.p.map(function(pt){ return '- ' + fill(pt, topic); }).join('\n') + '\n\n';
  }
  plain += 'OUTRO (' + outroMin + ' min)\n- Recap, CTA, tease, sign-off\n';
  $('copyOutline').addEventListener('click', function(){ copyText(plain, this); });
}

function initTimer(el, seconds){
  var remaining = seconds, running = false, iv = null;
  el.innerHTML = '<span class="clock">' + mmss(remaining) + '</span>' +
    '<button type="button" data-act="start">Start</button>' +
    '<button type="button" data-act="pause" disabled>Pause</button>' +
    '<button type="button" data-act="reset">Reset</button>';
  var clock = el.querySelector('.clock');
  var bStart = el.querySelector('[data-act=start]');
  var bPause = el.querySelector('[data-act=pause]');
  function render(){ clock.textContent = mmss(remaining); }
  function stop(){ running = false; if(iv){ clearInterval(iv); iv = null; } bStart.disabled = false; bPause.disabled = true; }
  bStart.addEventListener('click', function(){
    if(running || remaining <= 0) return;
    running = true; bStart.disabled = true; bPause.disabled = false;
    iv = setInterval(function(){
      remaining--;
      if(remaining <= 0){ remaining = 0; render(); stop(); clock.textContent = 'DONE'; return; }
      render();
    }, 1000);
  });
  bPause.addEventListener('click', function(){ stop(); });
  el.querySelector('[data-act=reset]').addEventListener('click', function(){ stop(); remaining = seconds; render(); });
}
