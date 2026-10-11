/* VoiceScriptWriter — CTA Builder */
(function () {
  'use strict';
  var VSW = window.VSW;

  var GOALS = {
    buy: {
      label: 'Get customers to buy',
      options: [
        { t: 'Tap Shop Now and get {topic} today — sale ends tonight.', why: 'Strong verb + deadline. Urgency is the #1 purchase trigger in voice ads.' },
        { t: 'Order {topic} now — free shipping and easy returns, zero risk.', why: 'Removes the fear of buying. "Zero risk" beats "buy now" alone.' },
        { t: '{topic} is waiting for you. Grab yours before it\u2019s gone.', why: 'Personal ("for you") plus mild scarcity. Warm but persuasive.' },
        { t: 'Click the link to buy {topic}.', why: 'Clear but flat — no reason to act NOW. Use only as a last resort.' }
      ]
    },
    subscribe: {
      label: 'Get subscribers / followers',
      options: [
        { t: 'Hit subscribe and join thousands getting {topic} every week.', why: 'Social proof ("thousands") makes subscribing feel safe and popular.' },
        { t: 'Subscribe now — it\u2019s free, and the next {topic} drops tomorrow.', why: 'Removes cost objection and promises immediate value.' },
        { t: 'Follow for daily {topic} tips you won\u2019t find anywhere else.', why: '"Won\u2019t find anywhere else" creates exclusivity.' },
        { t: 'Please subscribe to our channel.', why: 'Polite but weak — gives no reason. Always add the benefit.' }
      ]
    },
    call: {
      label: 'Get phone calls (IVR / local business)',
      options: [
        { t: 'Call now — a real person answers in under a minute.', why: '"Real person" + speed kills the #1 fear of calling a business.' },
        { t: 'Dial {brand} today for your free quote. It takes two minutes.', why: 'Names the reward (free quote) and the tiny time cost.' },
        { t: 'Lines are open now — call {brand} and let\u2019s talk.', why: 'Warm and immediate. Works well for service businesses.' },
        { t: 'Call us sometime.', why: 'No urgency, no benefit. Callers won\u2019t act on "sometime".' }
      ]
    },
    download: {
      label: 'Get app / file downloads',
      options: [
        { t: 'Download {topic} free today — set up in under two minutes.', why: '"Free" + tiny effort = the highest-converting download formula.' },
        { t: 'Get the app now and unlock {topic} on your phone instantly.', why: '"Instantly" promises immediate gratification.' },
        { t: 'Tap download and try {topic} free for 7 days.', why: 'Trial framing removes commitment fear.' },
        { t: 'The app is available for download.', why: 'A fact, not a CTA. Tell them WHY to download.' }
      ]
    },
    signup: {
      label: 'Get sign-ups / leads',
      options: [
        { t: 'Sign up free in 30 seconds and get your first {topic} today.', why: 'Tiny time + immediate reward. The classic high-converting signup line.' },
        { t: 'Join now — no credit card required.', why: 'Kills the biggest signup objection in five words.' },
        { t: 'Create your free account and see what {topic} can do for you.', why: 'Benefit-led and personal.' },
        { t: 'You can sign up on our website.', why: 'Passive and vague. Never hide the action.' }
      ]
    },
    share: {
      label: 'Get shares',
      options: [
        { t: 'Know someone who needs {topic}? Send this to them right now.', why: 'Names the exact person to share with — shares triple when the listener pictures someone.' },
        { t: 'Share this with one friend who\u2019d love {topic}.', why: '"One friend" feels easy; "share everywhere" feels like work.' },
        { t: 'If this helped you, pass it on — it might help someone else too.', why: 'Altruism framing works for helpful/educational content.' },
        { t: 'Please share this video.', why: 'Generic ask with no motivation. Tell them who it helps.' }
      ]
    },
    visit: {
      label: 'Get website visits',
      options: [
        { t: 'Visit {brand} now — everything you need is one click away.', why: 'Lowers effort perception to a single click.' },
        { t: 'Head to {brand} today and see {topic} in action.', why: 'Curiosity ("see in action") pulls the visit.' },
        { t: 'All the details are waiting at {brand}. Go take a look.', why: 'Warm and conversational — great for explainers.' },
        { t: 'Check out our website.', why: 'Vague — no URL, no reason. Always name the destination.' }
      ]
    }
  };

  function stars(rating, max) {
    var s = '';
    for (var i = 1; i <= max; i++) s += i <= rating ? '\u2605' : '\u2606';
    return s;
  }

  function build() {
    var goal = document.getElementById('goal').value;
    var topic = document.getElementById('topic').value.trim() || 'it';
    var brand = document.getElementById('brand').value.trim() || 'our website';
    var msg = document.getElementById('warnMsg');

    var data = GOALS[goal];
    if (!data) {
      msg.textContent = 'Pick a goal first.';
      return;
    }
    msg.textContent = '';

    document.getElementById('goalTitle').textContent = data.label;

    var box = document.getElementById('ctas');
    box.innerHTML = '';

    data.options.forEach(function (opt, i) {
      var text = opt.t.replace('{topic}', topic).replace('{brand}', brand);
      var rating = Math.max(1, 5 - i); // first option strongest by curation

      var card = document.createElement('div');
      card.className = 'cta-card';

      var head = document.createElement('div');
      head.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap';

      var s = document.createElement('span');
      s.className = 'stars';
      s.textContent = stars(rating, 5);
      s.setAttribute('aria-label', rating + ' out of 5 strength');

      var badge = document.createElement('span');
      badge.style.cssText = 'font-size:.8rem;font-weight:700;color:var(--muted)';
      badge.textContent = rating >= 5 ? 'STRONGEST' : rating >= 4 ? 'STRONG' : rating >= 3 ? 'DECENT' : 'WEAK';

      head.appendChild(s);
      head.appendChild(badge);

      var p = document.createElement('p');
      p.style.cssText = 'font-size:1.1rem;font-weight:600;margin:10px 0 4px';
      p.textContent = '\u201C' + text + '\u201D';

      var why = document.createElement('p');
      why.className = 'why';
      why.textContent = 'Why it works: ' + opt.why;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-outline';
      btn.style.padding = '8px 18px';
      btn.style.fontSize = '.9rem';
      btn.style.marginTop = '8px';
      btn.textContent = 'Copy';
      btn.addEventListener('click', function () { VSW.copyText(text, btn); });

      card.appendChild(head);
      card.appendChild(p);
      card.appendChild(why);
      card.appendChild(btn);
      box.appendChild(card);
    });

    document.getElementById('result').classList.remove('hidden');
    document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('ctaBtn').addEventListener('click', build);
  });
})();
