/* TalkingPhotoMaker — Voice Picker Quiz
   Use case + audience -> recommended voice style. */
(function () {
  'use strict';

  var ARCHETYPES = {
    warm: {
      title: 'Warm Conversational',
      desc: 'A friendly, approachable voice that feels like a helpful friend — perfect for trust-building content.',
      pace: 'Medium (150–160 wpm)', pitch: 'Natural, mid-range', tone: 'Smile while recording — it is audible.',
      sample: 'Hey, I\'m so glad you\'re here. Let me walk you through this step by step — you\'ve got this.',
      tools: 'HeyGen "Friendly" voices, D-ID warm presets, CapCut voice effects'
    },
    pro: {
      title: 'Authoritative Professional',
      desc: 'Calm, confident and credible — the voice of someone who knows their stuff and respects your time.',
      pace: 'Measured (140–150 wpm)', pitch: 'Lower-mid, steady', tone: 'Minimal upspeak; land each sentence.',
      sample: 'Here\'s what the data tells us, and exactly what to do about it. Three points, no fluff.',
      tools: 'Synthesia corporate voices, Colossyan professional avatars, HeyGen "Narrator" presets'
    },
    playful: {
      title: 'Playful & Energetic',
      desc: 'High-energy, expressive and fun — built to stop thumbs and keep viewers watching to the end.',
      pace: 'Fast (165–180 wpm)', pitch: 'Bright, animated', tone: 'Exaggerate reactions; punch the jokes.',
      sample: 'Okay wait — you HAVE to see this. This is the coolest thing I\'ve found all week, no contest!',
      tools: 'CapCut energetic voices, Vidnoz expressive presets, HeyGen upbeat avatars'
    },
    calm: {
      title: 'Calm Narrator',
      desc: 'Soothing, even and trustworthy — ideal for explanations, stories and support content.',
      pace: 'Slow (130–145 wpm)', pitch: 'Soft mid-range', tone: 'Pause between ideas; let thoughts breathe.',
      sample: 'Take a breath. We\'ll go through this slowly, one piece at a time, until it all makes sense.',
      tools: 'Synthesia narrator voices, D-ID calm presets, most TTS "storyteller" styles'
    },
    bold: {
      title: 'Bold & Dramatic',
      desc: 'Cinematic and commanding — the movie-trailer energy that makes announcements feel epic.',
      pace: 'Varied (slow build, fast payoff)', pitch: 'Deep, resonant', tone: 'Whisper the setup, hit the payoff hard.',
      sample: 'Everything you knew about this… is about to change. This is the moment. Don\'t look away.',
      tools: 'HeyGen dramatic presets, Vidnoz "Trailer" voices, CapCut deep effects'
    },
    explainer: {
      title: 'Friendly Explainer',
      desc: 'Clear, upbeat and precise — the classic tutorial voice that makes complex topics feel easy.',
      pace: 'Medium-fast (155–170 wpm)', pitch: 'Bright mid-range', tone: 'Emphasize each step; number your points.',
      sample: 'Step one: open the app. Step two: upload your photo. Step three — and this is the fun part — hit generate.',
      tools: 'Colossyan explainer voices, Synthesia tutorial presets, Vidnoz "Guide" voices'
    }
  };

  var QUESTIONS = [
    {
      q: 'What is the video for?',
      opts: [
        { t: 'Marketing / selling a product', w: { playful: 2, bold: 2, warm: 1 } },
        { t: 'Tutorial / education', w: { explainer: 3, calm: 1 } },
        { t: 'Entertainment / social media', w: { playful: 3, bold: 1 } },
        { t: 'Customer support / narration', w: { calm: 2, pro: 2 } },
        { t: 'Storytelling / personal brand', w: { warm: 2, bold: 1, calm: 1 } }
      ]
    },
    {
      q: 'Who is watching?',
      opts: [
        { t: 'Kids & families', w: { playful: 3, warm: 1 } },
        { t: 'Teens & young adults', w: { playful: 2, bold: 2 } },
        { t: 'Professionals / B2B', w: { pro: 3, calm: 1 } },
        { t: 'General adult audience', w: { warm: 2, explainer: 1 } },
        { t: 'Seniors', w: { calm: 3, warm: 1 } }
      ]
    },
    {
      q: 'What should the brand feel like?',
      opts: [
        { t: 'Friendly & warm', w: { warm: 3 } },
        { t: 'Professional & trustworthy', w: { pro: 3 } },
        { t: 'Playful & fun', w: { playful: 3 } },
        { t: 'Bold & dramatic', w: { bold: 3 } },
        { t: 'Calm & reassuring', w: { calm: 3 } },
        { t: 'Clear & helpful', w: { explainer: 3 } }
      ]
    },
    {
      q: 'Preferred pace?',
      opts: [
        { t: 'Fast & energetic', w: { playful: 2, bold: 1, explainer: 1 } },
        { t: 'Steady & natural', w: { warm: 2, pro: 1, explainer: 1 } },
        { t: 'Slow & measured', w: { calm: 2, pro: 1 } }
      ]
    },
    {
      q: 'Voice gender preference?',
      opts: [
        { t: 'Female voice', w: { warm: 1, playful: 1 } },
        { t: 'Male voice', w: { pro: 1, bold: 1 } },
        { t: 'No preference', w: {} }
      ]
    }
  ];

  var step = 0;
  var scores = {};

  function reset() {
    step = 0;
    scores = {};
    Object.keys(ARCHETYPES).forEach(function (k) { scores[k] = 0; });
  }

  function renderStep() {
    var box = document.getElementById('quiz-box');
    var q = QUESTIONS[step];
    var html = '<div class="quiz-progress"><span style="width:' +
      Math.round((step / QUESTIONS.length) * 100) + '%"></span></div>';
    html += '<div class="quiz-q">Question ' + (step + 1) + ' of ' + QUESTIONS.length + ': ' + q.q + '</div>';
    q.opts.forEach(function (o, i) {
      html += '<button class="quiz-opt" data-i="' + i + '">' + o.t + '</button>';
    });
    box.innerHTML = html;
    box.querySelectorAll('.quiz-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var weights = q.opts[parseInt(btn.getAttribute('data-i'), 10)].w;
        Object.keys(weights).forEach(function (k) { scores[k] += weights[k]; });
        step++;
        if (step < QUESTIONS.length) { renderStep(); } else { renderResult(); }
      });
    });
  }

  function renderResult() {
    var ranked = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; });
    var top = ARCHETYPES[ranked[0]];
    var second = ARCHETYPES[ranked[1]];
    var box = document.getElementById('quiz-box');
    box.innerHTML =
      '<div class="quiz-progress"><span style="width:100%"></span></div>' +
      '<div class="quiz-result">' +
      '<h3>🎙️ Your recommended voice: ' + top.title + '</h3>' +
      '<p>' + top.desc + '</p>' +
      '<ul>' +
      '<li><b>Pace:</b> ' + top.pace + '</li>' +
      '<li><b>Pitch:</b> ' + top.pitch + '</li>' +
      '<li><b>Delivery tip:</b> ' + top.tone + '</li>' +
      '<li><b>Find it in:</b> ' + top.tools + '</li>' +
      '</ul>' +
      '<p style="color:var(--muted);font-size:.92rem">Try pasting this sample line into your tool to test the voice:</p>' +
      '<div class="sample-line">"' + top.sample + '"</div>' +
      '<p style="color:var(--muted)">Runner-up: <b>' + second.title + '</b> — ' + second.desc + '</p>' +
      '<p class="section-sub" style="margin-top:14px">Now write the perfect words for it with our <a href="script-writer.html">talking avatar script writer</a>.</p>' +
      '</div>' +
      '<div class="output-actions"><button class="btn small ghost" id="quiz-retake">↺ Retake quiz</button></div>';
    document.getElementById('quiz-retake').addEventListener('click', function () {
      reset();
      renderStep();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    reset();
    renderStep();
  });
})();
