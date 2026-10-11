/* Avatar Script Writer — topic → teleprompter-ready talking-head script with timing
   Average speaking pace: 150 WPM (adjustable by reading-speed buttons) */
(function () {
  var WPM = 150;

  var HOOKS = [
    'Stop scrolling — in the next {dur}, I\'m going to show you exactly how {topic} can change the way you {benefit}.',
    'Here\'s the thing nobody tells you about {topic}. Stay with me for the next {dur} — this could save you hours.',
    'If you\'ve ever wondered about {topic}, this {dur} video is for you. Let\'s break it down together.',
    'What if I told you {topic} is simpler than you think? In the next {dur}, I\'ll prove it.',
    'This is the {dur} guide to {topic} you wish you\'d watched sooner. Let\'s dive in.'
  ];
  var INTROS = [
    'Hey, I\'m your AI host, and today we\'re talking about {topic}. Whether you\'re a complete beginner or just need a refresher, you\'re in the right place.',
    'Welcome back. I\'m here to walk you through {topic} — no jargon, no fluff, just the essentials you need to {benefit}.',
    'I\'m an AI avatar, and my job today is simple: make {topic} crystal clear for you in the next {dur}. Let\'s get started.'
  ];
  var POINTS = {
    a: [
      'First, the foundation. {topic} works best when you understand the core idea behind it. Think of it as the building block everything else rests on — get this right, and the rest follows naturally.',
      'Let\'s start with the basics. Before anything else, you need to grasp what {topic} really means and why it matters. This foundation makes everything that follows ten times easier.',
      'Point one: start with the fundamentals. With {topic}, the key insight is understanding the core concept first. Everything else builds on this, so give it your full attention.'
    ],
    b: [
      'Second, put it into practice. Knowing about {topic} is one thing — applying it is where the real results happen. Start small, stay consistent, and let the momentum build.',
      'Next up: action. The difference between people who succeed with {topic} and those who don\'t is simple — the winners take the first step today, not next week.',
      'Second, focus on application. {topic} only pays off when you use it. Pick one small action from today\'s video and commit to trying it this week.'
    ],
    c: [
      'Finally, the mistake to avoid. Most people struggle with {topic} because they overcomplicate it. Keep it simple, track what works, and refine as you go — that\'s the whole game.',
      'And third: avoid the common trap. People give up on {topic} too early because they expect instant results. Stay patient, measure progress, and the payoff will come.',
      'Third, think long term. {topic} rewards consistency over intensity. Small, steady effort beats one big push every single time.'
    ]
  };
  var CTAS = {
    subscribe: 'If this helped, hit subscribe — I break down topics like {topic} every week, and you won\'t want to miss what\'s next.',
    website: 'Want the full breakdown? Visit the link below for our free resource pack on {topic}. It\'s completely free, and it takes two minutes.',
    comment: 'Drop a comment telling me your biggest takeaway about {topic} — I read every single one, and your question might become our next video.',
    buy: 'Ready to take {topic} to the next level? Check out the link below — it\'s the fastest way to get results, and you can start today.',
    none: 'That\'s a wrap on {topic}. Thanks for watching, and I\'ll see you in the next one.'
  };
  var BENEFITS = ['save time and get better results', 'work smarter, not harder', 'build skills that actually pay off', 'stay ahead of the curve', 'turn knowledge into action'];
  var OUTROS = ['Thanks for sticking around.', 'Appreciate you watching all the way through.', 'Glad you made it to the end.'];

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function fill(template, topic, benefit, dur) {
    return template.split('{topic}').join(topic).split('{benefit}').join(benefit).split('{dur}').join(dur);
  }
  function words(str) { return str.trim().split(/\s+/).filter(Boolean).length; }
  function secsFor(wordCount) { return Math.round(wordCount / WPM * 60); }
  function fmtSecs(s) {
    var m = Math.floor(s / 60), sec = s % 60;
    return m > 0 ? m + 'm ' + (sec < 10 ? '0' : '') + sec + 's' : sec + 's';
  }

  var TARGETS = { 30: 75, 60: 150, 90: 225, 120: 300, 180: 450, 300: 750, 600: 1500 };

  function generate() {
    var topic = document.getElementById('sw-topic').value.trim();
    var durKey = document.getElementById('sw-length').value;
    var tone = document.getElementById('sw-tone').value;
    var audience = document.getElementById('sw-audience').value.trim();
    var _ctaEl = document.querySelector('input[name="sw-cta-v"]:checked');
    var ctaKey = _ctaEl ? _ctaEl.value : 'subscribe';
    var benefit = pick(BENEFITS);
    var durLabel = durKey === '30' ? '30 seconds' : (durKey === '60' ? 'one minute' : (Number(durKey) / 60) + ' minutes');

    var msg = document.getElementById('sw-msg');
    if (!topic) {
      msg.textContent = 'Please enter a topic first.';
      msg.style.display = 'block';
      return;
    }
    msg.style.display = 'none';

    var target = TARGETS[durKey] || 150;
    // Section share of the script: hook 8%, intro 12%, point A 27%, point B 27%, point C 22%, outro+CTA 4-8%
    var hook = fill(pick(HOOKS), topic, benefit, durLabel);
    var intro = fill(pick(INTROS), topic, benefit, durLabel);
    if (audience) intro += ' This one is especially for ' + audience + '.';
    var pa = fill(pick(POINTS.a), topic, benefit, durLabel);
    var pb = fill(pick(POINTS.b), topic, benefit, durLabel);
    var pc = fill(pick(POINTS.c), topic, benefit, durLabel);
    var outro = pick(OUTROS) + ' ' + fill(CTAS[ctaKey] || CTAS.subscribe, topic, benefit, durLabel);

    // Tone flavour line appended to intro
    var toneNote = {
      professional: 'Let\'s keep things clear and focused.',
      friendly: 'Grab a coffee — let\'s chat about it.',
      energetic: 'I\'m pumped for this one. Let\'s go!',
      casual: 'No pressure, we\'ll take it easy.',
      persuasive: 'By the end, you\'ll see exactly why this matters.'
    };
    if (toneNote[tone]) intro += ' ' + toneNote[tone];

    var sections = [
      { label: 'Hook (first 3–5 seconds)', text: hook, color: '#fb7185' },
      { label: 'Intro', text: intro, color: '#d946ef' },
      { label: 'Point 1', text: pa, color: '#22d3ee' },
      { label: 'Point 2', text: pb, color: '#22d3ee' },
      { label: 'Point 3', text: pc, color: '#22d3ee' },
      { label: 'Outro + Call to Action', text: outro, color: '#a3e635' }
    ];

    var totalWords = 0;
    sections.forEach(function (s) { s.wc = words(s.text); s.secs = secsFor(s.wc); totalWords += s.wc; });

    // Render section cards with timing
    var html = '<h3>Your teleprompter-ready script <span class="badge lime">' + fmtSecs(secsFor(totalWords)) + ' at ' + WPM + ' WPM</span></h3>';
    html += '<div class="stat-row">'
      + '<div class="stat"><div class="num">' + totalWords + '</div><div class="lbl">Words</div></div>'
      + '<div class="stat"><div class="num">' + fmtSecs(secsFor(totalWords)) + '</div><div class="lbl">Est. duration</div></div>'
      + '<div class="stat"><div class="num">' + target + '</div><div class="lbl">Target words</div></div>'
      + '<div class="stat"><div class="num">' + (totalWords >= target * 0.85 && totalWords <= target * 1.25 ? '✓ On target' : (totalWords < target ? 'Short — add detail' : 'Long — trim a point')) + '</div><div class="lbl">Fit check</div></div>'
      + '</div>';

    var plain = '';
    sections.forEach(function (s) {
      html += '<div class="script-block">'
        + '<div class="sec-label"><strong style="color:' + s.color + '">' + s.label + '</strong>'
        + '<span class="timing">≈ ' + s.wc + ' words · ' + fmtSecs(s.secs) + '</span></div>'
        + '<p>' + escapeHtml(s.text) + '</p></div>';
      plain += '[' + s.label + ' — ≈' + fmtSecs(s.secs) + ']\n' + s.text + '\n\n';
    });
    plain = plain.trim();

    // Teleprompter block
    html += '<h3 style="margin-top:28px">Teleprompter view</h3>'
      + '<p class="section-sub">Paste into your avatar tool\'s script box, or scroll here while recording. Large type, section breaks built in.</p>'
      + '<div class="teleprompter" id="tp-view">'
      + sections.map(function (s) {
          return '<div class="tp-sec">' + escapeHtml(s.label) + '</div><p>' + escapeHtml(s.text) + '</p>';
        }).join('')
      + '</div>'
      + '<div class="copy-row">'
      + '<button class="btn btn-primary btn-sm" id="sw-copy">Copy full script</button>'
      + '<button class="btn btn-sm" id="sw-regen">Regenerate</button>'
      + '<a class="btn btn-ghost btn-sm" href="script-timer.html">Check timing →</a>'
      + '</div>'
      + '<p class="hint" style="color:var(--muted);font-size:.85rem;margin-top:12px">Tip: AI avatar tools read punctuation as pauses. Keep sentences short and add commas where a human would breathe.</p>';

    var out = document.getElementById('sw-output');
    out.innerHTML = html;
    out.classList.remove('hidden');
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });

    document.getElementById('sw-copy').addEventListener('click', function () {
      copyText(plain, this);
    });
    document.getElementById('sw-regen').addEventListener('click', generate);
    window.__lastScript = plain;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('sw-generate');
    if (!btn) return;
    btn.addEventListener('click', generate);
    // WPM selector pills
    document.querySelectorAll('input[name="sw-wpm"]').forEach(function (r) {
      r.addEventListener('change', function () { WPM = Number(r.value); });
    });
  });
})();
