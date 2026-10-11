/* AIAnimationMaker — Animation Style Finder Quiz */
(function () {
  'use strict';
  var CATS = ['2d', '3d', 'anime', 'motion'];

  var QUESTIONS = [
    {
      q: '1/5 — What are you animating?',
      opts: [
        { t: '🎭 Characters with big emotions and a story', c: 'anime' },
        { t: '🐾 Cute characters for kids or family content', c: '3d' },
        { t: '📊 Concepts, numbers, or how-things-work explainers', c: 'motion' },
        { t: '🎪 A classic cartoon short or comedy sketch', c: '2d' }
      ]
    },
    {
      q: '2/5 — What look makes you say "I want THAT"?',
      opts: [
        { t: '✨ Shiny, polished, Pixar-movie polish', c: '3d' },
        { t: '🔥 Expressive, dynamic, Studio Ghibli energy', c: 'anime' },
        { t: '🖌️ Hand-drawn charm and squash-and-stretch', c: '2d' },
        { t: '📐 Clean shapes, slick text, minimal design', c: 'motion' }
      ]
    },
    {
      q: '3/5 — Who is your audience?',
      opts: [
        { t: '🧒 Kids and parents', c: '3d' },
        { t: '📱 Teens and young adults (TikTok/Reels)', c: 'anime' },
        { t: '💼 Professionals, students, clients', c: 'motion' },
        { t: '😂 Anyone who loves cartoons and comedy', c: '2d' }
      ]
    },
    {
      q: '4/5 — How will you make it?',
      opts: [
        { t: '🤖 AI text-to-video generator, fast results', c: '3d' },
        { t: '🤖 AI image-to-video, I draw the key frames', c: 'anime' },
        { t: '🧰 Template tools + AI assets (CapCut, Canva)', c: 'motion' },
        { t: '🎨 Frame-by-frame or rigged 2D animation', c: '2d' }
      ]
    },
    {
      q: '5/5 — What is the end goal?',
      opts: [
        { t: '▶️ A YouTube kids series or channel', c: '3d' },
        { t: '💥 Viral short-form storytelling', c: 'anime' },
        { t: '💰 Client work, ads, or course content', c: 'motion' },
        { t: '🎬 An original animated short film', c: '2d' }
      ]
    }
  ];

  var RESULTS = {
    '3d': {
      icon: '🧸', title: '3D Cartoon Animation',
      desc: 'You need the shiny, lovable 3D look — perfect for kids\u2019 content, family channels, and character-driven series. AI generators now nail this style from a single prompt.',
      tools: [
        ['Kling 2.x', 'Best value 3D character clips, free daily credits'],
        ['Luma Dream Machine', 'Beautiful cinematic 3D motion, great for scenes'],
        ['Runway Gen-4', 'Top-tier control for consistent 3D characters']
      ],
      tip: 'Use our Prompt Builder with the "Pixar-style 3D" preset, then keep a character reference sheet so your hero looks the same in every scene.'
    },
    'anime': {
      icon: '⚔️', title: 'Anime-Style Animation',
      desc: 'Big emotions, dramatic motion, and storytelling that hooks teens and young adults. Anime-style AI shorts are exploding on TikTok and YouTube Shorts right now.',
      tools: [
        ['Pika', 'Strong stylized motion, anime-friendly'],
        ['Kling 2.x', 'Great at dynamic anime action scenes'],
        ['Hailuo (MiniMax)', 'Free tier, excellent stylized output']
      ],
      tip: 'Generate a key frame image first (Midjourney-style tools), then animate it with image-to-video for far more consistent anime characters.'
    },
    '2d': {
      icon: '🖌️', title: 'Classic 2D Cartoon',
      desc: 'Timeless hand-drawn charm and comedy timing. 2D is the king of original cartoon shorts — and AI makes the in-between work dramatically faster.',
      tools: [
        ['Toon Boom Harmony', 'Pro 2D rigging and frame-by-frame'],
        ['Adobe Animate', 'Accessible 2D animation with AI-assisted inbetweening'],
        ['Kaiber', 'AI stylization of 2D footage and art']
      ],
      tip: 'Plan every gag in the Storyboard Planner first — 2D comedy lives or dies on timing, and AI fills the gaps between your key poses.'
    },
    'motion': {
      icon: '📐', title: 'Motion Graphics',
      desc: 'Clean, professional, and perfect for explainers, ads, finance content, and client work. The fastest style to produce and the easiest to monetize.',
      tools: [
        ['InVideo AI', 'Script-to-video with motion graphics templates'],
        ['CapCut', 'Free, fast motion graphics for short-form'],
        ['Runway Gen-4', 'AI motion for custom animated elements']
      ],
      tip: 'Write your script first, then build the Prompt Builder prompts scene by scene — motion graphics are 80% planning, 20% generation.'
    }
  };

  var scores = { '2d': 0, '3d': 0, 'anime': 0, 'motion': 0 };
  var idx = 0;
  var quizBox = document.getElementById('quiz-box');

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderQuestion() {
    var q = QUESTIONS[idx];
    var pct = Math.round((idx / QUESTIONS.length) * 100);
    var html = '<div class="quiz-progress"><i style="width:' + pct + '%"></i></div>'
      + '<div class="quiz-q"><h3>' + esc(q.q) + '</h3>';
    q.opts.forEach(function (o, i) {
      html += '<button class="quiz-opt" data-cat="' + o.c + '">' + esc(o.t) + '</button>';
    });
    html += '</div>';
    quizBox.innerHTML = html;
  }

  function renderResult() {
    var best = CATS[0];
    CATS.forEach(function (c) { if (scores[c] > scores[best]) best = c; });
    var r = RESULTS[best];
    var toolsHtml = r.tools.map(function (t) {
      return '<li><strong>' + esc(t[0]) + '</strong> — ' + esc(t[1]) + '</li>';
    }).join('');
    quizBox.innerHTML =
      '<div class="quiz-progress"><i style="width:100%"></i></div>'
      + '<div class="quiz-result">'
      + '<span class="big-icon">' + r.icon + '</span>'
      + '<h3>Your style: ' + esc(r.title) + '</h3>'
      + '<p>' + r.desc + '</p>'
      + '<h4 style="margin:18px 0 10px">🛠️ Recommended tools</h4>'
      + '<ul style="text-align:left;max-width:520px;margin:0 auto 18px;padding-left:22px">' + toolsHtml + '</ul>'
      + '<p><strong>💡 Pro tip:</strong> ' + r.tip + '</p>'
      + '<div class="result-actions" style="justify-content:center">'
      + '<a class="btn btn-primary btn-sm" href="../tools/storyboard-planner.html">Plan it in the Storyboard Planner</a>'
      + '<a class="btn btn-ghost btn-sm" href="../tools/animation-prompt-builder.html">Build prompts for it</a>'
      + '<button class="btn btn-teal btn-sm" id="btn-retake">↻ Retake quiz</button>'
      + '</div></div>';
    document.getElementById('btn-retake').addEventListener('click', function () {
      scores = { '2d': 0, '3d': 0, 'anime': 0, 'motion': 0 };
      idx = 0;
      renderQuestion();
    });
  }

  quizBox.addEventListener('click', function (e) {
    var btn = e.target.closest('.quiz-opt');
    if (!btn) return;
    scores[btn.dataset.cat]++;
    idx++;
    if (idx < QUESTIONS.length) renderQuestion();
    else renderResult();
  });

  renderQuestion();
})();
