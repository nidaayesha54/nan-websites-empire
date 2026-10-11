/* VoiceScriptWriter — Tone Analyzer (word-list heuristics) */
(function () {
  'use strict';
  var VSW = window.VSW;

  var FORMAL = ['furthermore', 'therefore', 'thus', 'moreover', 'hence', 'nevertheless',
    'consequently', 'accordingly', 'pursuant', 'commence', 'utilize', 'utilise', 'leverage',
    'facilitate', 'ensure', 'regarding', 'concerning', 'sincerely', 'respectfully',
    'dear sir', 'dear madam', 'hereby', 'aforementioned', 'notwithstanding', 'endeavor', 'endeavour'];
  var WARM = ['love', 'heart', 'care', 'caring', 'friendly', 'welcome', 'together', 'family',
    'community', 'thank', 'thanks', 'appreciate', 'grateful', 'kind', 'gentle', 'warm',
    'happy', 'smile', 'joy', 'delight', 'wonderful', 'cherish', 'embrace', 'cozy'];
  var ENERGY = ['amazing', 'incredible', 'wow', 'hurry', 'limited', 'free', 'instant',
    'powerful', 'unleash', 'transform', 'revolutionary', 'exclusive', 'exciting', 'epic',
    'secret', 'shocking', 'unbelievable', 'now', 'today', 'breakthrough', 'ultimate',
    'proven', 'guaranteed'];
  var INFORMAL = ['hey', 'gonna', 'wanna', 'gotta', 'cool', 'awesome', 'stuff', 'yeah',
    'yep', 'nope', 'guys', 'folks', 'totally', 'super', 'kinda', 'sorta', 'cuz', 'lemme'];
  var FILLER = ['um', 'uh', 'erm', 'like', 'you know', 'basically', 'actually', 'literally'];
  var WEAK = ['very', 'really', 'just', 'quite', 'rather', 'somewhat'];
  var CTA_WORDS = ['visit', 'call', 'click', 'buy', 'shop', 'order', 'sign up', 'signup',
    'subscribe', 'download', 'press', 'tap', 'join', 'register', 'book', 'try', 'get started',
    'learn more', 'dial'];

  function hits(text, list) {
    var count = 0;
    var found = {};
    list.forEach(function (w) {
      var re = new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
      var m = text.match(re);
      if (m) { count += m.length; found[w] = m.length; }
    });
    return { count: count, found: found };
  }

  function topWords(found, n) {
    return Object.keys(found).sort(function (a, b) { return found[b] - found[a]; }).slice(0, n);
  }

  function score(per100, factor) {
    return Math.min(100, Math.round(per100 * factor));
  }

  function analyze() {
    var text = document.getElementById('scriptText').value.trim();
    var msg = document.getElementById('warnMsg');
    if (!text) {
      msg.textContent = 'Paste a script first — even 2–3 sentences is enough to analyze.';
      document.getElementById('result').classList.add('hidden');
      return;
    }
    msg.textContent = '';

    var words = text.split(/\s+/).filter(Boolean);
    var n = words.length;
    var per100 = function (c) { return n ? (c / n) * 100 : 0; };

    var formal = hits(text, FORMAL);
    var warm = hits(text, WARM);
    var energy = hits(text, ENERGY);
    var informal = hits(text, INFORMAL);
    var filler = hits(text, FILLER);
    var weak = hits(text, WEAK);
    var cta = hits(text, CTA_WORDS);

    var formality = Math.max(0, score(per100(formal.count), 9) - score(per100(informal.count), 6));
    var warmth = score(per100(warm.count), 10);
    var energyScore = score(per100(energy.count), 9);

    var sentences = text.split(/[.!?…]+/).map(function (s) { return s.trim(); }).filter(Boolean);
    var avgLen = sentences.length ? (n / sentences.length) : 0;

    setMeter('mFormal', formality);
    setMeter('mWarm', warmth);
    setMeter('mEnergy', energyScore);

    var label = toneLabel(formality, warmth, energyScore);
    document.getElementById('toneLabel').textContent = label;

    document.getElementById('statWords').textContent = n;
    document.getElementById('statSent').textContent = sentences.length;
    document.getElementById('statAvg').textContent = avgLen.toFixed(1);
    document.getElementById('statTime').textContent = VSW.duration(n);

    var tips = buildTips({
      formality: formality, warmth: warmth, energy: energyScore,
      fillerPer100: per100(filler.count), weakPer100: per100(weak.count),
      avgLen: avgLen, hasCta: cta.count > 0, n: n,
      formalWords: topWords(formal.found, 3), fillerWords: topWords(filler.found, 3)
    });
    document.getElementById('tips').innerHTML = tips;

    document.getElementById('result').classList.remove('hidden');
    document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function setMeter(id, val) {
    document.getElementById(id + 'Fill').style.width = val + '%';
    document.getElementById(id + 'Val').textContent = val + '/100';
  }

  function toneLabel(f, w, e) {
    var parts = [];
    parts.push(f >= 60 ? 'Formal' : f >= 30 ? 'Neutral' : 'Casual');
    parts.push(w >= 50 ? 'Warm' : w >= 25 ? 'Mildly warm' : 'Cool');
    parts.push(e >= 50 ? 'High-energy' : e >= 25 ? 'Steady' : 'Calm');
    return parts.join(' · ');
  }

  function tip(title, body) {
    return '<div class="suggestion"><strong>' + VSW.esc(title) + '</strong><br>' + VSW.esc(body) + '</div>';
  }

  function buildTips(d) {
    var out = '';
    if (d.formality >= 60) {
      out += tip('Soften the stiffness',
        'This reads like a document, not a voice. Swap stiff words (' +
        (d.formalWords.length ? d.formalWords.join(', ') : 'utilize, furthermore') +
        ') for plain ones: "use", "also", "so". Voice scripts should sound like a person talking.');
    } else if (d.formality <= 20) {
      out += tip('Good conversational feel',
        'Nice — this sounds natural spoken aloud. Just make sure it still fits your brand if the context is corporate.');
    }
    if (d.warmth < 25) {
      out += tip('Add warmth',
        'Listeners decide in seconds if they trust a voice. Add a warm word or two — "welcome", "thanks", "together", or a simple "you" directed at the listener.');
    } else {
      out += tip('Warmth is working',
        'Good — the script feels human. Don\u2019t overdo it; one warm beat per 30 seconds is plenty.');
    }
    if (d.energy < 25) {
      out += tip('Raise the energy (if this is marketing)',
        'For ads and promos, energy sells. Add one punchy line with a strong verb — "Grab it now", "This changes everything". For IVR or announcements, low energy is correct — keep it calm.');
    } else if (d.energy > 75) {
      out += tip('Watch the hype level',
        'Very high energy can sound shouty. Balance it: one excited line, then a calm factual line, so the peaks actually land.');
    }
    if (d.fillerPer100 >= 2) {
      out += tip('Cut the filler',
        'Found filler (' + d.fillerWords.join(', ') + ') — in a written voice script these are just clutter. Delete them; the voice actor adds natural pauses anyway.');
    }
    if (d.weakPer100 >= 3) {
      out += tip('Drop the weakeners',
        '"Very", "really", "just" dilute your lines. "It\u2019s fast" beats "It\u2019s really very fast" every time.');
    }
    if (d.avgLen > 20) {
      out += tip('Shorten your sentences',
        'Average sentence is ' + d.avgLen.toFixed(0) + ' words — long for the ear. Aim for 8–14 words per sentence so the voice can breathe and the listener can follow.');
    } else if (d.avgLen > 0 && d.avgLen < 6) {
      out += tip('Sentences are very choppy',
        'Super-short sentences can sound robotic. Mix in a medium-length sentence (10–15 words) for natural rhythm.');
    }
    if (!d.hasCta && d.n >= 30) {
      out += tip('Add a call to action',
        'No clear action words detected (visit, call, click, try…). Every voice script should end by telling the listener exactly what to do next.');
    }
    if (!out) out = tip('Solid script', 'No red flags found. Read it aloud once at normal pace — if you stumble, the listener will too.');
    return out;
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('analyzeBtn').addEventListener('click', analyze);
    document.getElementById('sampleBtn').addEventListener('click', function () {
      document.getElementById('scriptText').value =
        'Welcome to BrightSmile Dental — where your smile comes first! ' +
        'Our friendly team makes every visit comfortable and stress-free. ' +
        'From routine cleanings to complete smile makeovers, we\u2019ve got you covered. ' +
        'Call now to book your free consultation today!';
    });
  });
})();
