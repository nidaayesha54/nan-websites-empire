/* TalkingPhotoMaker — Script Writer
   Topic + tone + length -> formatted talking-avatar script with pauses. */
(function () {
  'use strict';

  var LENGTHS = {
    15: { label: '15 seconds', beats: 1, targetWords: 38 },
    30: { label: '30 seconds', beats: 2, targetWords: 75 },
    60: { label: '60 seconds', beats: 3, targetWords: 150 },
    90: { label: '90 seconds', beats: 4, targetWords: 225 }
  };

  var HOOKS = {
    Friendly: [
      'Okay, real talk — {t} is way more interesting than you think. Let me show you why.',
      'Hey friend! Quick question: what do you really know about {t}? Stick with me for a moment.',
      'So I just learned something wild about {t}, and I had to tell you first.',
      'If {t} has been on your mind lately, this is for you.'
    ],
    Professional: [
      'Let me walk you through the three things that matter most about {t}.',
      'Here is a clear, practical breakdown of {t} — no fluff, just what works.',
      '{t}, explained: what it is, why it matters, and how to use it well.',
      'In the next minute, you will understand {t} better than most people do.'
    ],
    Funny: [
      'Warning: {t} is about to ruin your excuses. In a good way. Probably.',
      'Nobody asked for my opinion on {t}, but the algorithm says you are getting it anyway.',
      'Me, explaining {t} like my rent depends on it. Because honestly? It might.',
      'Plot twist: {t} is secretly hilarious once you see it this way.'
    ],
    Motivational: [
      'Stop scrolling. If {t} matters to you, the next few seconds could change how you see it.',
      'Nobody is coming to hand you results with {t}. So let us talk about what actually moves the needle.',
      'You are one decision away from mastering {t}. Here is where it starts.',
      'Forget perfect. {t} rewards the people who start messy and keep going.'
    ],
    Educational: [
      'Today we are breaking down {t} — the concept, the mechanism, and one example you will remember.',
      'What is {t}, really? Let us build it up from first principles in under a minute.',
      'Most explanations of {t} skip the important part. We are not going to do that.',
      'By the end of this, you will be able to explain {t} to a ten-year-old.'
    ],
    Storytelling: [
      'It started with {t} — and nothing went the way anyone expected.',
      'There is a story behind {t} that nobody tells you. Until now.',
      'Picture this: everything you assumed about {t} is about to flip.',
      'I was skeptical about {t} too. Then this happened.'
    ]
  };

  var BEATS = [
    'First, the part everyone gets wrong about {t}: it is not about doing more, it is about doing the right things in the right order. Nail the fundamentals, and the rest compounds.',
    'Here is the secret nobody mentions: {t} works best when you strip it down to the essentials. Complexity feels impressive, but simplicity wins.',
    'Think of {t} like a conversation, not a lecture. The moment you start talking with your audience instead of at them, everything clicks.',
    'The biggest shift happens when you stop chasing perfection with {t} and start chasing consistency. Small wins, stacked daily, beat one heroic effort.',
    'Here is what the data and the experience both say: with {t}, the first attempt teaches you more than the first hundred tutorials. Start, observe, adjust.',
    'One underrated move: study what works in {t}, then add your own twist. Originality is just good taste plus courage.',
    'Pay attention to timing with {t}. The right message at the wrong moment flops; an okay message at the perfect moment flies.',
    'And remember — with {t}, your first version is allowed to be rough. Ship it, learn from the response, and make version two twice as good.'
  ];

  var TRANSITIONS = [
    'Which brings me to the next point.',
    'Now, here is where it gets good.',
    'And that is only half the story.',
    'Let us go one level deeper.'
  ];

  var CTAS = {
    Friendly: [
      'If this helped, send it to a friend who needs to hear it. And follow for more quick wins like this!',
      'Try one of these ideas today and tell me how it goes — I read every comment.'
    ],
    Professional: [
      'If you want the full framework, the link is in the description. Let us keep building.',
      'Save this for your next planning session — and share it with your team.'
    ],
    Funny: [
      'Follow for more aggressively helpful content, or don’t. I’m not your boss. But you should.',
      'Share this with someone who needs a laugh and a lesson at the same time.'
    ],
    Motivational: [
      'Start today. Not Monday, not next month — today. Then come back and tell me what changed.',
      'If you are ready to take {t} seriously, hit follow. We are just getting started.'
    ],
    Educational: [
      'Save this so you can revisit it later, and follow for the next lesson in the series.',
      'Drop your questions in the comments — I will answer the top ones in the next video.'
    ],
    Storytelling: [
      'Follow for part two — the twist is worth it, I promise.',
      'Share this story with someone who needs to hear it tonight.'
    ]
  };

  var DELIVERY_NOTES = {
    Friendly: 'Smile through the hook, keep energy warm. Slow down slightly on the key insight so it lands.',
    Professional: 'Steady eye contact, measured pace. Emphasize numbers and action verbs — credibility comes from calm confidence.',
    Funny: 'Pause BEFORE the punchline, not after. A half-second of deadpan silence makes every joke land twice as hard.',
    Motivational: 'Build intensity through the body, then drop to a near-whisper for the final line. Contrast is what gives people chills.',
    Educational: 'Pause after each new concept to let it land. Slightly slower than feels natural — viewers are learning, not just listening.',
    Storytelling: 'Lower your pace at the start, speed up during the twist. Your avatar\'s expression should shift with the story\'s mood.'
  };

  var rollIndex = 0;
  function pick(arr) {
    var item = arr[rollIndex % arr.length];
    return item;
  }

  function fill(template, topic) {
    return template.split('{t}').join(topic);
  }

  function countWords(text) {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  function stripDirections(text) {
    return text
      .replace(/\[(pause|beat|smile|lean in|slow down|whisper)[^\]]*\]/gi, '...')
      .replace(/\([^)]*\)/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function buildScript() {
    var topicInput = document.getElementById('sw-topic').value.trim();
    var topic = topicInput || 'your topic';
    var tone = document.getElementById('sw-tone').value;
    var lenKey = document.getElementById('sw-length').value;
    var personaInput = document.getElementById('sw-persona').value.trim();
    var cfg = LENGTHS[lenKey];

    var hook = fill(pick(HOOKS[tone]), topic);
    var beats = [];
    for (var i = 0; i < cfg.beats; i++) {
      beats.push(fill(BEATS[(rollIndex + i * 2) % BEATS.length], topic));
    }
    var cta = fill(pick(CTAS[tone]), topic);
    rollIndex++;

    var wordsSoFar = 0;
    var lines = [];
    lines.push('🎙️ TALKING AVATAR SCRIPT — ' + topic);
    lines.push('Tone: ' + tone + '  |  Target: ' + cfg.label + (personaInput ? '  |  Persona: ' + personaInput : ''));
    lines.push('');
    lines.push('[HOOK — 0:00]');
    lines.push('"' + hook + '"');
    lines.push('[pause — beat]');
    lines.push('');
    lines.push('[BODY]');
    wordsSoFar = countWords(hook);
    beats.forEach(function (b, idx) {
      var stamp = Math.round(wordsSoFar / 2.4);
      lines.push('(≈0:' + String(stamp).padStart(2, '0') + ') "' + b + '"');
      if (idx < beats.length - 1) {
        lines.push('[beat]');
        lines.push('"' + fill(pick(TRANSITIONS), topic) + '"');
      }
      wordsSoFar += countWords(b);
    });
    lines.push('');
    lines.push('[CTA — ≈0:' + String(Math.round(wordsSoFar / 2.4)).padStart(2, '0') + ']');
    lines.push('"' + cta + '"');
    wordsSoFar += countWords(cta);
    lines.push('');
    lines.push('— DELIVERY NOTES —');
    lines.push(DELIVERY_NOTES[tone]);
    lines.push('Add [pause] markers wherever your avatar tool supports SSML-style breaks (HeyGen, D-ID and most TTS engines honor commas and ellipses for natural pauses).');

    var script = lines.join('\n');
    var totalWords = countWords(script.replace(/\[.*?\]/g, ''));
    var estSecs = Math.round(totalWords / 2.4);

    var out = document.getElementById('sw-output');
    out.innerHTML = '';
    var pre = document.createElement('div');
    script.split('\n').forEach(function (ln) {
      var div = document.createElement('div');
      div.className = 'script-line';
      div.textContent = ln === '' ? ' ' : ln;
      pre.appendChild(div);
    });
    out.appendChild(pre);

    document.getElementById('sw-stats').innerHTML =
      'Words: <b>' + totalWords + '</b> (target ≈' + cfg.targetWords + ') &nbsp;·&nbsp; ' +
      'Est. duration: <b>' + estSecs + 's</b> (target ' + cfg.label + ')';

    out.dataset.full = script;
    out.dataset.clean = stripDirections(script);
    document.getElementById('sw-actions').style.display = 'flex';
  }

  function copyText(text, btn) {
    function done() {
      var old = btn.textContent;
      btn.textContent = '✓ Copied!';
      btn.classList.add('ok');
      setTimeout(function () { btn.textContent = old; btn.classList.remove('ok'); }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      done();
    }
  }

  function downloadTxt() {
    var out = document.getElementById('sw-output');
    var blob = new Blob([out.dataset.full || ''], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'talking-avatar-script.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('sw-generate').addEventListener('click', buildScript);
    document.getElementById('sw-copy').addEventListener('click', function () {
      copyText(document.getElementById('sw-output').dataset.full || '', this);
    });
    document.getElementById('sw-copy-clean').addEventListener('click', function () {
      copyText(document.getElementById('sw-output').dataset.clean || '', this);
    });
    document.getElementById('sw-download').addEventListener('click', downloadTxt);
  });
})();
