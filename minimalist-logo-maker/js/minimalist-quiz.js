// MinimalistLogoMaker — "Is minimalism right for your brand?" quiz
(function () {
  "use strict";

  var QUESTIONS = [
    {
      q: "How would you describe your brand's personality?",
      opts: [
        { t: "Bold and loud — we want maximum attention", s: 0 },
        { t: "Friendly, but still professional", s: 1 },
        { t: "Calm, confident and refined", s: 2 }
      ]
    },
    {
      q: "Where will your logo appear most often?",
      opts: [
        { t: "Big signage, packaging and detailed print work", s: 0 },
        { t: "Mostly website and social media profiles", s: 1 },
        { t: "Everywhere — app icons, favicons, merch, embroidery", s: 2 }
      ]
    },
    {
      q: "How many colors do you want in your logo?",
      opts: [
        { t: "Four or more — the more color, the better", s: 0 },
        { t: "Two or three colors", s: 1 },
        { t: "One or two colors, max", s: 2 }
      ]
    },
    {
      q: "Which style of logo do you admire most?",
      opts: [
        { t: "A detailed, illustrated emblem or badge", s: 0 },
        { t: "A clean wordmark with a small icon", s: 1 },
        { t: "The Nike swoosh or Apple — one simple mark", s: 2 }
      ]
    },
    {
      q: "How long should your logo stay relevant?",
      opts: [
        { t: "We rebrand every couple of years anyway", s: 0 },
        { t: "Five to ten years would be nice", s: 1 },
        { t: "Decades — I want it timeless", s: 2 }
      ]
    },
    {
      q: "What first impression should your brand make?",
      opts: [
        { t: "Exciting and full of energy", s: 0 },
        { t: "Approachable and clear", s: 1 },
        { t: "Premium and effortless", s: 2 }
      ]
    },
    {
      q: "How do you feel about empty space in design?",
      opts: [
        { t: "Empty space feels unfinished to me", s: 0 },
        { t: "A little empty space is fine", s: 1 },
        { t: "Less is more — I love breathing room", s: 2 }
      ]
    }
  ];

  var RESULTS = [
    {
      min: 0, max: 6,
      title: "A bolder style may suit you better",
      text: "Your answers point toward a brand that thrives on energy, detail and color. A maximalist or illustrative logo — rich emblems, playful mascots, layered badges — will probably feel more authentic than stripping everything back. Minimalism is a tool, not a rule: choose the style your audience will remember.",
      examples: [
        ["Starbucks", "A detailed siren emblem full of storytelling — complexity is the point."],
        ["Red Bull", "Two charging bulls, sun, bold colors — high energy needs high detail."],
        ["Wendy's", "A friendly illustrated mascot that a minimal mark could never replace."]
      ]
    },
    {
      min: 7, max: 11,
      title: "Minimalism mostly fits — simplify selectively",
      text: "You're a strong candidate for minimalism with a twist. Keep your logo to one clear idea, 1–2 colors and flat shapes — but keep one distinctive detail (a custom letterform, a small accent, a clever negative-space cut) so it stays memorable. Use our whitespace checker to find exactly what to trim.",
      examples: [
        ["FedEx", "Simple wordmark — with one hidden arrow doing all the clever work."],
        ["Amazon", "Clean type plus a single smile-arrow; nothing else needed."],
        ["Spotify", "Three curved lines on green — minimal, yet instantly ownable."]
      ]
    },
    {
      min: 12, max: 14,
      title: "Minimalism is perfect for your brand",
      text: "Every signal says go minimal: one simple mark, one or two colors, generous whitespace. This is the Nike/Apple playbook — a logo so simple it works at favicon size, in embroidery, and in a single color. Build yours now with the shape combiner, then verify it with the simplicity scorer.",
      examples: [
        ["Nike", "One swoosh. No text needed. The most valuable simple mark ever drawn."],
        ["Apple", "A bitten apple silhouette — minimal, yet unmistakable worldwide."],
        ["McDonald's", "Two golden arches. Recognizable from a mile away, literally."]
      ]
    }
  ];

  var box = document.getElementById("quizBox");
  if (!box) return;

  var idx = 0, score = 0;

  function renderQuestion() {
    var q = QUESTIONS[idx];
    var pct = Math.round((idx / QUESTIONS.length) * 100);
    var html = '<div class="q-progress"><i style="width:' + pct + '%"></i></div>' +
      '<p class="hint" style="margin-bottom:8px">Question ' + (idx + 1) + " of " + QUESTIONS.length + "</p>" +
      '<p class="q">' + q.q + "</p>";
    q.opts.forEach(function (o, i) {
      html += '<button class="opt" data-i="' + i + '">' + o.t + "</button>";
    });
    box.innerHTML = html;
    var btns = box.querySelectorAll(".opt");
    for (var i = 0; i < btns.length; i++) {
      (function (b) {
        b.addEventListener("click", function () {
          score += q.opts[+b.dataset.i].s;
          idx++;
          if (idx < QUESTIONS.length) renderQuestion();
          else renderResult();
        });
      })(btns[i]);
    }
  }

  function renderResult() {
    var r = RESULTS[0];
    for (var i = 0; i < RESULTS.length; i++) {
      if (score >= RESULTS[i].min && score <= RESULTS[i].max) r = RESULTS[i];
    }
    var ex = r.examples.map(function (e) {
      return "<li><strong>" + e[0] + ":</strong> " + e[1] + "</li>";
    }).join("");
    box.innerHTML =
      '<div class="result">' +
      '<div class="q-progress"><i style="width:100%"></i></div>' +
      '<p class="hint">Your score: ' + score + " / " + QUESTIONS.length * 2 + "</p>" +
      "<h2>" + r.title + "</h2>" +
      "<p>" + r.text + "</p>" +
      '<ul class="examples">' + ex + "</ul>" +
      '<div class="preview-actions" style="justify-content:center">' +
      '<a class="btn small" href="shape-combiner.html">Build a Minimal Logo</a> ' +
      '<a class="btn small ghost" href="whitespace-checker.html">Score My Logo</a> ' +
      '<button class="btn small ghost" id="quizRestart">Retake Quiz</button>' +
      "</div></div>";
    var rs = document.getElementById("quizRestart");
    if (rs) rs.addEventListener("click", function () { idx = 0; score = 0; renderQuestion(); });
  }

  renderQuestion();
})();
