/* DogNamesHub — "Find the Perfect Name" personality quiz */
(function () {
  "use strict";
  var QUESTIONS = [
    { q: "1. What's your dog's overall vibe?",
      opts: [
        { e: "🥰", t: "Total cuddle bug", s: "cute" },
        { e: "🤪", t: "Certified class clown", s: "funny" },
        { e: "💪", t: "Neighborhood bodyguard", s: "tough" },
        { e: "✨", t: "One of a kind", s: "unique" }
      ]},
    { q: "2. How big is (or will be) your pup?",
      opts: [
        { e: "🐭", t: "Pocket-sized", s: "cute" },
        { e: "🐕", t: "Medium and mighty", s: "funny" },
        { e: "🐻", t: "Gentle giant", s: "tough" },
        { e: "🦄", t: "Size doesn't define them", s: "unique" }
      ]},
    { q: "3. Ideal weekend activity together?",
      opts: [
        { e: "🛋️", t: "Couch cuddles + movies", s: "cute" },
        { e: "🎪", t: "Dog-park chaos", s: "funny" },
        { e: "🥾", t: "Hiking rugged trails", s: "tough" },
        { e: "📸", t: "Turning heads downtown", s: "unique" }
      ]},
    { q: "4. Pick a snack for your pup's namesake:",
      opts: [
        { e: "🧁", t: "Cupcake", s: "cute" },
        { e: "🍕", t: "Pizza slice", s: "funny" },
        { e: "🥩", t: "Big steak", s: "tough" },
        { e: "🍣", t: "Sushi", s: "unique" }
      ]},
    { q: "5. If your dog were famous, they'd be...",
      opts: [
        { e: "🧸", t: "Everyone's teddy bear", s: "cute" },
        { e: "🎭", t: "A stand-up comedian", s: "funny" },
        { e: "🦸", t: "A superhero", s: "tough" },
        { e: "🎸", t: "A rock star", s: "unique" }
      ]}
  ];

  var step = 0, scores = { cute: 0, funny: 0, tough: 0, unique: 0 };
  var box = document.getElementById("quiz-box");
  var bar = document.getElementById("quiz-bar");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }

  function renderQ() {
    bar.style.width = (step / QUESTIONS.length * 100) + "%";
    var q = QUESTIONS[step];
    var html = '<div class="quiz-q"><h3>' + esc(q.q) + "</h3><div class='quiz-opts'>";
    q.opts.forEach(function (o, idx) {
      html += '<button class="quiz-opt" data-i="' + idx + '"><span class="eo">' + o.e +
        "</span>" + esc(o.t) + "</button>";
    });
    box.innerHTML = html + "</div></div>";
    var btns = box.querySelectorAll(".quiz-opt");
    for (var b = 0; b < btns.length; b++) {
      btns[b].addEventListener("click", answer);
    }
  }

  function answer(ev) {
    var idx = parseInt(ev.currentTarget.getAttribute("data-i"), 10);
    scores[QUESTIONS[step].opts[idx].s]++;
    step++;
    if (step < QUESTIONS.length) renderQ(); else renderResult();
  }

  function pick(style, n) {
    var pool = DOG_NAMES.filter(function (d) { return d.s.indexOf(style) !== -1; });
    // shuffle
    for (var j = pool.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var t = pool[j]; pool[j] = pool[k]; pool[k] = t;
    }
    return pool.slice(0, n);
  }

  function renderResult() {
    bar.style.width = "100%";
    var order = ["cute", "funny", "tough", "unique"].sort(function (a, b) { return scores[b] - scores[a]; });
    var top = order[0], second = order[1];
    var picks = pick(top, 4).concat(pick(second, 1));
    var label = { cute: "Cuddle Bug 🥰", funny: "Class Clown 🤪", tough: "Tough Cookie 💪", unique: "Original ✨" }[top];
    var html = '<div class="quiz-q"><h3>🎉 Your dog\'s vibe: <strong>' + label + "</strong></h3>" +
      "<p>Based on your answers, these names fit your pup's personality perfectly:</p>" +
      '<div class="results">';
    picks.forEach(function (d) {
      html += '<div class="name-card"><h3>🐾 ' + esc(d.n) + "</h3>" +
        '<div class="tags">' + esc(GENDER_LABELS[d.g]) + "</div><p>" + esc(d.m) + "</p></div>";
    });
    html += '</div><p style="margin-top:22px;text-align:center">' +
      '<button class="btn" id="quiz-again">🔀 Retake Quiz</button> ' +
      '<a class="btn btn-outline" style="color:var(--pink);border-color:var(--pink)" href="name-generator.html">Try the Generator</a></p></div>';
    box.innerHTML = html;
    document.getElementById("quiz-again").addEventListener("click", function () {
      step = 0; scores = { cute: 0, funny: 0, tough: 0, unique: 0 };
      renderQ();
    });
  }

  renderQ();
})();
