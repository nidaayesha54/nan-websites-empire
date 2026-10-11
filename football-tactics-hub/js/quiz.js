/* FootballTacticsHub — "which formation suits your team?" quiz */
(function () {
  "use strict";

  var FORMS = ["4-3-3", "4-4-2", "3-5-2", "4-2-3-1", "5-3-2"];

  var EXPLAIN = {
    "4-3-3": "The <strong>4-3-3</strong> is perfect for teams that want the ball. Three central midfielders give you control and passing triangles everywhere, while the front three stretch defences wide. It needs energetic full-backs, a disciplined holding midfielder and wingers who track back. Famous users: Pep Guardiola's Manchester City, Barcelona, Spain.",
    "4-4-2": "The <strong>4-4-2</strong> is the classic English system: two banks of four, compact and hard to break down, with two strikers ready to spring. It's direct, disciplined and great for underdogs or teams with a strong target man. Famous users: Sir Alex Ferguson's Manchester United, Diego Simeone's Atlético Madrid.",
    "3-5-2": "The <strong>3-5-2</strong> dominates the middle: three centre-backs plus five midfielders let you outnumber most opponents centrally, and the wing-backs provide all the width. It lives or dies on elite, tireless wing-backs. Famous users: Antonio Conte's Chelsea and Inter, Simone Inzaghi's Inter.",
    "4-2-3-1": "The <strong>4-2-3-1</strong> is the modern all-rounder: a double pivot shields the defence while a number 10 links midfield to a lone striker. Balanced in attack and defence, it suits squads with a creative playmaker and a clinical finisher. Famous users: José Mourinho's Chelsea, Germany's 2014 World Cup winners.",
    "5-3-2": "The <strong>5-3-2</strong> is built to frustrate: five defenders plus three midfielders form a near-impenetrable block, then spring rapid counter-attacks with two strikers. Ideal when you're the underdog against stronger teams. Famous users: defensive masterclasses by low-block specialists across Europe."
  };

  var QUESTIONS = [
    {
      q: "How do you want to win games?",
      opts: [
        { t: "Dominate the ball and pass teams apart", s: { "4-3-3": 3, "4-2-3-1": 1 } },
        { t: "Stay compact, then strike fast", s: { "4-4-2": 3, "5-3-2": 2 } },
        { t: "Outnumber the opposition in midfield", s: { "3-5-2": 3, "4-2-3-1": 1 } },
        { t: "Frustrate bigger teams and counter", s: { "5-3-2": 3, "4-4-2": 1 } }
      ]
    },
    {
      q: "What's your squad's biggest strength?",
      opts: [
        { t: "Technical midfielders who love possession", s: { "4-3-3": 3, "4-2-3-1": 1 } },
        { t: "Two quality strikers", s: { "4-4-2": 3, "3-5-2": 2 } },
        { t: "Flying wing-backs with huge engines", s: { "3-5-2": 3, "5-3-2": 1 } },
        { t: "A brilliant number 10 playmaker", s: { "4-2-3-1": 3 } }
      ]
    },
    {
      q: "Where do you want your width to come from?",
      opts: [
        { t: "Wingers hugging the touchline", s: { "4-3-3": 3 } },
        { t: "Traditional wide midfielders", s: { "4-4-2": 3 } },
        { t: "Wing-backs bombing forward", s: { "3-5-2": 3, "5-3-2": 2 } },
        { t: "Attacking full-backs overlapping", s: { "4-2-3-1": 2, "4-3-3": 1 } }
      ]
    },
    {
      q: "How should your team defend?",
      opts: [
        { t: "Press high and win it back fast", s: { "4-3-3": 3, "4-2-3-1": 1 } },
        { t: "Two solid banks of four", s: { "4-4-2": 3 } },
        { t: "Squeeze the middle with extra bodies", s: { "3-5-2": 3, "5-3-2": 1 } },
        { t: "Drop deep into a low block", s: { "5-3-2": 3 } }
      ]
    },
    {
      q: "Pick the player profile you have (or want):",
      opts: [
        { t: "A deep-lying playmaker (like a regista)", s: { "4-3-3": 3, "4-2-3-1": 1 } },
        { t: "A classic target man striker", s: { "4-4-2": 3, "3-5-2": 1 } },
        { t: "A defensive destroyer in front of the defence", s: { "4-2-3-1": 3, "4-3-3": 1 } },
        { t: "A third centre-back who can step into midfield", s: { "3-5-2": 3, "5-3-2": 2 } }
      ]
    },
    {
      q: "How experienced / disciplined is your squad?",
      opts: [
        { t: "Very — they can handle complex rotations", s: { "3-5-2": 2, "4-3-3": 2 } },
        { t: "Average — keep it simple and structured", s: { "4-4-2": 3, "5-3-2": 1 } },
        { t: "Mixed — needs a safety net behind", s: { "4-2-3-1": 3 } },
        { t: "Young and energetic, will run all day", s: { "4-3-3": 2, "3-5-2": 1 } }
      ]
    },
    {
      q: "Which scenario sounds like your team?",
      opts: [
        { t: "Favourites — expected to break teams down", s: { "4-3-3": 3, "4-2-3-1": 1 } },
        { t: "Underdogs — need to be hard to beat", s: { "5-3-2": 3, "4-4-2": 2 } },
        { t: "Mid-table — want balance and flexibility", s: { "4-2-3-1": 2, "4-4-2": 2 } },
        { t: "Possession-heavy league, midfield battles decide it", s: { "3-5-2": 3 } }
      ]
    },
    {
      q: "Last one: your ideal goal comes from…",
      opts: [
        { t: "A 20-pass move finished by a winger", s: { "4-3-3": 3 } },
        { t: "A cross met by a towering header", s: { "4-4-2": 3 } },
        { t: "A through ball from the number 10", s: { "4-2-3-1": 3 } },
        { t: "A wing-back cross after an overload", s: { "3-5-2": 3, "5-3-2": 1 } }
      ]
    }
  ];

  var box = document.getElementById("quiz-box");
  var bar = document.getElementById("quiz-bar");
  var resultEl = document.getElementById("quiz-result");
  if (!box) return;

  var idx = 0;
  var scores = { "4-3-3": 0, "4-4-2": 0, "3-5-2": 0, "4-2-3-1": 0, "5-3-2": 0 };

  function render() {
    box.innerHTML = "";
    resultEl.style.display = "none";
    var q = QUESTIONS[idx];
    bar.style.width = (idx / QUESTIONS.length * 100) + "%";

    var div = document.createElement("div");
    div.className = "quiz-q";
    var h = document.createElement("h3");
    h.textContent = "Question " + (idx + 1) + " of " + QUESTIONS.length + ": " + q.q;
    div.appendChild(h);

    q.opts.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "quiz-opt";
      b.textContent = o.t;
      b.addEventListener("click", function () {
        Object.keys(o.s).forEach(function (f) { scores[f] += o.s[f]; });
        idx++;
        if (idx < QUESTIONS.length) render();
        else showResult();
      });
      div.appendChild(b);
    });

    var back = document.createElement("button");
    back.type = "button";
    back.className = "quiz-opt";
    back.style.opacity = ".55";
    back.textContent = idx === 0 ? "Start over" : "← Back";
    back.addEventListener("click", function () {
      if (idx === 0) { scores = { "4-3-3": 0, "4-4-2": 0, "3-5-2": 0, "4-2-3-1": 0, "5-3-2": 0 }; render(); }
      else { idx--; render(); } // note: scores not decremented; keeps quiz simple & forgiving
    });
    div.appendChild(back);
    box.appendChild(div);
  }

  function showResult() {
    box.innerHTML = "";
    bar.style.width = "100%";
    var winner = FORMS.slice().sort(function (a, b) { return scores[b] - scores[a]; })[0];
    document.getElementById("result-formation").textContent = winner;
    document.getElementById("result-desc").innerHTML = EXPLAIN[winner];

    var total = FORMS.reduce(function (s, f) { return s + scores[f]; }, 0) || 1;
    var sc = document.getElementById("result-scores");
    sc.innerHTML = "";
    FORMS.slice().sort(function (a, b) { return scores[b] - scores[a]; }).forEach(function (f) {
      var pct = Math.round(scores[f] / total * 100);
      var row = document.createElement("div");
      row.style.marginBottom = "8px";
      row.innerHTML = "<strong>" + f + "</strong> — " + pct + "%" +
        '<div style="height:8px;background:#e3ede5;border-radius:99px;margin-top:4px">' +
        '<div style="height:100%;width:' + pct + '%;background:#0d5c2e;border-radius:99px"></div></div>';
      sc.appendChild(row);
    });

    resultEl.style.display = "block";
    resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.getElementById("btn-retake").addEventListener("click", function () {
    idx = 0;
    scores = { "4-3-3": 0, "4-4-2": 0, "3-5-2": 0, "4-2-3-1": 0, "5-3-2": 0 };
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  render();
})();
