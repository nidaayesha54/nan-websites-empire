// "Which AI voice tool fits my needs?" quiz — 4 questions, scored recommendations.
(function () {
  'use strict';
  var QUESTIONS = [
    {
      q: '1️⃣ What will you mainly use AI voice for?',
      options: [
        { t: '🎙️ Podcast narration', w: { elevenlabs: 3, playht: 2, murf: 1 } },
        { t: '🎬 YouTube / video voiceover', w: { murf: 3, elevenlabs: 2, playht: 2 } },
        { t: '📖 Audiobook', w: { elevenlabs: 3, playht: 2, speechify: 1 } },
        { t: '📣 Ads & marketing videos', w: { lovo: 3, murf: 2, elevenlabs: 1 } },
        { t: '🎓 E-learning / courses', w: { murf: 3, playht: 2, lovo: 1 } },
        { t: '🎧 Listening to articles & books', w: { speechify: 4, elevenlabs: 1 } }
      ]
    },
    {
      q: '2️⃣ How much audio do you need per month?',
      options: [
        { t: 'Under 30 minutes (just testing)', w: { elevenlabs: 2, murf: 2, lovo: 2 } },
        { t: '30–120 minutes', w: { elevenlabs: 3, murf: 2, playht: 2 } },
        { t: '2–10 hours (regular creator)', w: { elevenlabs: 3, murf: 2, playht: 2, lovo: 2 } },
        { t: '10+ hours (bulk production)', w: { playht: 3, lovo: 3, elevenlabs: 1 } }
      ]
    },
    {
      q: '3️⃣ What is your monthly budget?',
      options: [
        { t: 'Free / as close to $0 as possible', w: { elevenlabs: 3, murf: 2, lovo: 2, playht: 1, speechify: 1 } },
        { t: 'Under $25/month', w: { elevenlabs: 3, murf: 3, playht: 3, lovo: 3 } },
        { t: '$25–$100/month', w: { elevenlabs: 3, murf: 3, playht: 3 } },
        { t: '$100+/month (quality first)', w: { elevenlabs: 3, playht: 2, murf: 2 } }
      ]
    },
    {
      q: '4️⃣ What matters most to you?',
      options: [
        { t: '🤖 Most human-like, realistic voice', w: { elevenlabs: 4, murf: 2 } },
        { t: '⚡ Easiest / fastest to use', w: { murf: 3, speechify: 3, playht: 2 } },
        { t: '💰 Lowest cost per minute', w: { playht: 3, lovo: 3, elevenlabs: 2 } },
        { t: '🌍 Many languages & accents', w: { elevenlabs: 4, playht: 2, lovo: 2 } }
      ]
    }
  ];

  var answers = [];

  function renderQuestions() {
    var box = document.getElementById('quiz-box');
    var html = '';
    QUESTIONS.forEach(function (qq, qi) {
      html += '<div class="quiz-q"><h3>' + vgh.esc(qq.q) + '</h3>';
      qq.options.forEach(function (o, oi) {
        html += '<button class="opt" data-q="' + qi + '" data-o="' + oi + '">' + vgh.esc(o.t) + '</button>';
      });
      html += '</div>';
    });
    box.innerHTML = html;
    box.querySelectorAll('.opt').forEach(function (b) {
      b.addEventListener('click', function () {
        var q = parseInt(b.getAttribute('data-q'), 10);
        var o = parseInt(b.getAttribute('data-o'), 10);
        answers[q] = o;
        box.querySelectorAll('.opt[data-q="' + q + '"]').forEach(function (x) { x.classList.remove('selected'); });
        b.classList.add('selected');
        if (answers.filter(function (a) { return a !== undefined; }).length === QUESTIONS.length) showResult();
      });
    });
  }

  function showResult() {
    var data = window.vghData;
    var scores = {};
    data.TOOLS.forEach(function (t) { scores[t.id] = 0; });
    QUESTIONS.forEach(function (qq, qi) {
      var w = qq.options[answers[qi]].w;
      Object.keys(w).forEach(function (id) { scores[id] += w[id]; });
    });
    var ranked = data.TOOLS.slice().sort(function (a, b) { return scores[b.id] - scores[a.id]; });
    var winner = ranked[0];

    var html = '<div class="rec-card winner"><h3>🏆 Your match: ' + vgh.esc(winner.name) + '</h3>' +
      '<p>' + vgh.esc(winner.blurb) + '</p>' +
      '<div class="why"><b>Why it fits:</b> top-rated for your answers across purpose, volume, budget and priority. ' +
      'Starts at <b>' + vgh.fmtMoney(Math.min.apply(null, winner.plans.map(function (p) { return p.price; }))) + '/mo</b>.</div>' +
      '<p style="margin-top:10px"><a class="btn" href="voice-tool-comparator.html">Compare it with others →</a></p></div>';

    ranked.slice(1, 3).forEach(function (t) {
      html += '<div class="rec-card runner"><h3>🥈 Runner-up: ' + vgh.esc(t.name) + '</h3>' +
        '<p class="why">' + vgh.esc(t.tagline) + ' — best for ' + t.bestFor.map(vgh.esc).join(', ') + '.</p></div>';
    });

    html += '<div class="result">Next step: run your numbers through the <a href="voice-cost-calculator.html">cost calculator</a> ' +
      'to see the exact monthly price for your volume.</div>';

    var r = document.getElementById('quiz-result');
    r.innerHTML = html;
    r.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderQuestions();
    document.getElementById('quiz-reset').addEventListener('click', function () {
      answers = [];
      document.getElementById('quiz-result').innerHTML = '';
      renderQuestions();
    });
  });
})();
