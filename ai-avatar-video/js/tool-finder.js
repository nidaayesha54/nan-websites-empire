/* AI Avatar Tool Finder — quiz scoring over a tool dataset */
(function () {
  var TOOLS = [
    { id: 'heygen', name: 'HeyGen', price: 'From ~$29/mo (free trial available)', langs: 175,
      best: 'Marketing videos & UGC-style ads', budget: 'mid', langTier: 'high',
      cases: ['marketing', 'training'], lengths: ['short', 'medium'],
      blurb: 'The most popular avatar platform for marketers — 175+ languages, realistic avatars, and templates built for ads and social.',
      why: 'Huge avatar library, excellent lip-sync in 175+ languages, and one-click ad templates. Best all-rounder for marketing.' },
    { id: 'synthesia', name: 'Synthesia', price: 'From ~$29/mo (free demo available)', langs: 140,
      best: 'Corporate training & e-learning', budget: 'mid', langTier: 'high',
      cases: ['training', 'internal'], lengths: ['medium', 'long'],
      blurb: 'The enterprise standard for training videos — polished avatars, strong brand controls, and SCORM export for LMS platforms.',
      why: 'Purpose-built for learning & development: brand kits, screen recording, quizzes, and enterprise security/compliance.' },
    { id: 'did', name: 'D-ID', price: 'From ~$5.9/mo (free trial)', langs: 119,
      best: 'Budget talking-head videos', budget: 'free', langTier: 'mid',
      cases: ['marketing', 'support'], lengths: ['short'],
      blurb: 'Animate any photo into a talking head in seconds. The cheapest way to start, with a generous-feeling entry tier.',
      why: 'Lowest entry price of the serious tools and dead-simple photo-to-avatar workflow. Great for testing the format cheaply.' },
    { id: 'colossyan', name: 'Colossyan', price: 'From ~$28/mo', langs: 70,
      best: 'Workplace learning videos', budget: 'mid', langTier: 'mid',
      cases: ['training', 'internal'], lengths: ['medium', 'long'],
      blurb: 'Training-focused avatars with auto-translation — write once, publish in dozens of languages for global teams.',
      why: 'Auto-translate keeps every language version in sync, which is a lifesaver for compliance and onboarding content.' },
    { id: 'elai', name: 'Elai.io', price: 'From ~$23/mo', langs: 75,
      best: 'Text-to-video at scale', budget: 'mid', langTier: 'mid',
      cases: ['marketing', 'training'], lengths: ['short', 'medium'],
      blurb: 'Turn articles, URLs, and PPTs into avatar videos fast. Strong API for teams automating video production.',
      why: 'URL/PPT-to-video conversion plus API access makes it the pick for high-volume or automated workflows.' },
    { id: 'deepbrain', name: 'DeepBrain AI', price: 'From ~$30/mo', langs: 80,
      best: 'News-style & broadcast avatars', budget: 'mid', langTier: 'mid',
      cases: ['marketing', 'internal'], lengths: ['medium'],
      blurb: 'Hyper-realistic AI news anchors and presenters — a favorite for broadcast-style updates and announcements.',
      why: 'The most "TV presenter" feel of the bunch; strong choice for company news and formal announcements.' },
    { id: 'veed', name: 'VEED', price: 'Free plan + from ~$24/mo', langs: 100,
      best: 'Quick edits with avatars', budget: 'free', langTier: 'mid',
      cases: ['marketing', 'support'], lengths: ['short'],
      blurb: 'A full online video editor with AI avatars built in — subtitles, translations, and editing in one tab.',
      why: 'If you also need editing, captions, and translations, VEED bundles everything instead of just avatars.' },
    { id: 'vidnoz', name: 'Vidnoz', price: 'Free plan + paid upgrades', langs: 140,
      best: 'Free starter avatar videos', budget: 'free', langTier: 'high',
      cases: ['marketing', 'training'], lengths: ['short', 'medium'],
      blurb: 'One of the most generous free tiers — 140+ languages and hundreds of avatars to experiment with before paying.',
      why: 'Best free starting point: real minutes per month at $0, so you can validate the format before spending.' },
    { id: 'captions', name: 'Captions', price: 'From ~$9.99/mo', langs: 29,
      best: 'Mobile talking-head clips', budget: 'free', langTier: 'low',
      cases: ['marketing'], lengths: ['short'],
      blurb: 'Mobile-first AI creator app — avatar + auto-captions + eye-contact correction, built for short-form.',
      why: 'Cheapest path to polished short-form avatar clips, with killer auto-captions built in.' },
    { id: 'arcads', name: 'Arcads', price: 'Pay per video (credits)', langs: 40,
      best: 'AI UGC ad creatives', budget: 'mid', langTier: 'low',
      cases: ['marketing'], lengths: ['short'],
      blurb: 'UGC-style AI actors that look like real customer testimonials — built specifically for performance ad creatives.',
      why: 'When you want "real person review" energy rather than a polished presenter, Arcads-style UGC actors convert better.' }
  ];

  var QUESTIONS = [
    { key: 'budget', num: 1, title: 'What is your monthly budget?', options: [
      { v: 'free', label: 'Free / as cheap as possible' },
      { v: 'mid', label: '$10–$50/month' },
      { v: 'high', label: '$50+/month or enterprise' }
    ]},
    { key: 'langs', num: 2, title: 'How many languages do you need?', options: [
      { v: 'low', label: 'Just 1 (English is fine)' },
      { v: 'mid', label: 'A handful (2–10)' },
      { v: 'high', label: 'Many (10+ / global)' }
    ]},
    { key: 'usecase', num: 3, title: 'What will you mainly use it for?', options: [
      { v: 'marketing', label: 'Marketing & ads' },
      { v: 'training', label: 'Training & e-learning' },
      { v: 'internal', label: 'Internal comms / announcements' },
      { v: 'support', label: 'Customer support / explainers' }
    ]},
    { key: 'length', num: 4, title: 'Typical video length?', options: [
      { v: 'short', label: 'Under 1 minute (shorts/ads)' },
      { v: 'medium', label: '1–5 minutes' },
      { v: 'long', label: '5+ minutes (courses)' }
    ]}
  ];

  var answers = {};
  var step = 0;

  function langScore(tool, want) {
    if (want === 'low') return 1;
    if (want === 'mid') return tool.langTier === 'low' ? 0.3 : 1;
    return tool.langTier === 'high' ? 1 : (tool.langTier === 'mid' ? 0.5 : 0.2);
  }
  function budgetScore(tool, want) {
    if (want === 'high') return tool.budget === 'free' ? 0.6 : 1;
    if (want === 'mid') return tool.budget === 'free' ? 0.8 : 1;
    return tool.budget === 'free' ? 1 : 0.35; // free wanted
  }

  function score(tool) {
    var s = 0;
    s += budgetScore(tool, answers.budget) * 30;
    s += langScore(tool, answers.langs) * 25;
    s += (tool.cases.indexOf(answers.usecase) > -1 ? 1 : 0.25) * 30;
    s += (tool.lengths.indexOf(answers.length) > -1 ? 1 : 0.4) * 15;
    return Math.round(s);
  }

  function renderStep() {
    var q = QUESTIONS[step];
    var dots = QUESTIONS.map(function (_, i) {
      return '<span class="' + (i < step ? 'done' : (i === step ? 'done' : '')) + '"></span>';
    }).join('');
    var opts = q.options.map(function (o) {
      var checked = answers[q.key] === o.v ? 'checked' : '';
      return '<label><input type="radio" name="q-' + q.key + '" value="' + o.v + '" ' + checked + '><span>' + o.label + '</span></label>';
    }).join('');
    document.getElementById('quiz-box').innerHTML =
      '<div class="progress-dots">' + dots + '</div>'
      + '<div class="quiz-step"><h3><span class="qnum">Q' + q.num + '.</span> ' + q.title + '</h3>'
      + '<div class="radio-pills">' + opts + '</div></div>'
      + '<div class="quiz-nav">'
      + (step > 0 ? '<button class="btn btn-ghost btn-sm" id="q-back">← Back</button>' : '<span></span>')
      + '<button class="btn btn-primary btn-sm" id="q-next" disabled>' + (step === QUESTIONS.length - 1 ? 'See my matches →' : 'Next →') + '</button>'
      + '</div>';

    document.querySelectorAll('input[name="q-' + q.key + '"]').forEach(function (r) {
      r.addEventListener('change', function () {
        answers[q.key] = r.value;
        document.getElementById('q-next').disabled = false;
      });
    });
    var back = document.getElementById('q-back');
    if (back) back.addEventListener('click', function () { step--; renderStep(); });
    document.getElementById('q-next').addEventListener('click', function () {
      if (!answers[q.key]) return;
      if (step === QUESTIONS.length - 1) { renderResults(); }
      else { step++; renderStep(); }
    });
  }

  function renderResults() {
    var ranked = TOOLS.map(function (t) { return { t: t, s: score(t) }; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 3);

    var others = TOOLS.map(function (t) { return { t: t, s: score(t) }; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(3, 6);

    var html = '<h3>Your top 3 matches</h3>'
      + '<p class="section-sub">Scored from your budget, language needs, use case, and video length. Pricing is estimated — check official sites for current plans.</p>';

    ranked.forEach(function (r, i) {
      html += '<div class="rec-card' + (i === 0 ? ' winner' : '') + '">'
        + (i === 0 ? '<span class="badge lime">Best match</span>' : '<span class="badge violet">Runner-up #' + (i + 1) + '</span>')
        + '<h3>' + r.t.name + '</h3>'
        + '<p><b>Best for:</b> ' + r.t.best + '</p>'
        + '<p class="why">' + r.t.why + '</p>'
        + '<div class="score-bar"><i style="width:' + r.s + '%"></i></div>'
        + '<div class="rec-meta"><span>💰 <b>' + r.t.price + '</b></span>'
        + '<span>🌍 <b>' + r.t.langs + '+ languages</b></span>'
        + '<span>⭐ <b>' + r.s + '/100 match</b></span></div>'
        + '</div>';
    });

    html += '<h3 style="margin-top:30px">Also worth a look</h3>'
      + '<p class="section-sub">' + others.map(function (r) { return r.t.name; }).join(' · ') + ' — solid alternatives depending on your exact needs. <a href="../guides/best-ai-avatar-video-generators-2026.html">Read the full comparison guide →</a></p>'
      + '<div class="copy-row"><button class="btn btn-ghost btn-sm" id="q-restart">Retake quiz</button>'
      + '<a class="btn btn-primary btn-sm" href="avatar-script-writer.html">Write my first script →</a></div>'
      + '<p class="hint" style="color:var(--muted);font-size:.85rem;margin-top:14px">Independent ranking — no sponsored placements. Always verify pricing on the official site.</p>';

    var box = document.getElementById('quiz-box');
    box.innerHTML = html;
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('q-restart').addEventListener('click', function () {
      answers = {}; step = 0; renderStep();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('quiz-box')) return;
    renderStep();
  });
})();
