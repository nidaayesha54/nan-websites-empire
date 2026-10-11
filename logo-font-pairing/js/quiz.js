/* LogoFontPairing — brand font style quiz logic (vanilla JS) */
(function () {
  "use strict";

  var STYLE_INFO = {
    "bold-sans": {
      name: "Bold Sans", headline: "Anton", body: "Inter",
      hFamily: "'Anton', Impact, sans-serif", bFamily: "'Inter', sans-serif",
      blurb: "Your brand needs to shout with confidence. A heavy, condensed sans headline (like Anton) paired with a clean neutral body font (like Inter) gives you a modern, powerful wordmark that works from billboards to app icons."
    },
    "elegant-serif": {
      name: "Elegant Serif", headline: "Playfair Display", body: "Lato",
      hFamily: "'Playfair Display', Georgia, serif", bFamily: "'Lato', sans-serif",
      blurb: "Your brand whispers luxury. A high-contrast serif headline (like Playfair Display) with a warm supporting sans (like Lato) creates the refined, editorial feel premium customers trust."
    },
    "modern-geometric": {
      name: "Modern Geometric", headline: "Montserrat", body: "Raleway",
      hFamily: "'Montserrat', sans-serif", bFamily: "'Raleway', sans-serif",
      blurb: "Clean, minimal and tech-forward. A geometric sans headline (like Montserrat) with a light, airy body font (like Raleway) keeps your brand crisp on every screen."
    },
    "playful": {
      name: "Playful Display", headline: "Fredoka", body: "Nunito",
      hFamily: "'Fredoka', sans-serif", bFamily: "'Nunito', sans-serif",
      blurb: "Fun is your superpower. A rounded, bouncy display font (like Fredoka) with a cheerful rounded body font (like Nunito) makes your brand feel friendly and approachable — perfect for kids, food and lifestyle."
    },
    "vintage": {
      name: "Vintage Display", headline: "Abril Fatface", body: "Lora",
      hFamily: "'Abril Fatface', Georgia, serif", bFamily: "'Lora', Georgia, serif",
      blurb: "Heritage and craft define you. A flamboyant vintage display face (like Abril Fatface) with an old-style serif body (like Lora) gives your logo that handcrafted, timeless character."
    },
    "script": {
      name: "Handwritten Script", headline: "Pacifico", body: "Poppins",
      hFamily: "'Pacifico', cursive", bFamily: "'Poppins', sans-serif",
      blurb: "Your brand is personal and artistic. A signature-style script (like Pacifico) with a clean geometric body font (like Poppins) feels human and creative while staying professional."
    }
  };

  // Each option adds weights to styles
  var QUESTIONS = [
    {
      q: "1. What industry is your brand in?",
      opts: [
        ["Technology / SaaS", { "modern-geometric": 2, "bold-sans": 1 }],
        ["Food / Restaurant / Kids", { "playful": 2, "script": 1 }],
        ["Fashion / Beauty / Luxury", { "elegant-serif": 2, "vintage": 1 }],
        ["Finance / Legal / Consulting", { "elegant-serif": 1, "bold-sans": 2 }],
        ["Creative / Agency / Arts", { "script": 2, "vintage": 1 }],
        ["Fitness / Sports / Energy", { "bold-sans": 2, "modern-geometric": 1 }]
      ]
    },
    {
      q: "2. Pick the personality closest to your brand:",
      opts: [
        ["Bold & confident", { "bold-sans": 2 }],
        ["Elegant & premium", { "elegant-serif": 2 }],
        ["Friendly & warm", { "playful": 1, "script": 1 }],
        ["Minimal & modern", { "modern-geometric": 2 }],
        ["Fun & quirky", { "playful": 2 }],
        ["Classic & trustworthy", { "vintage": 1, "elegant-serif": 1 }]
      ]
    },
    {
      q: "3. What mood should your logo give at first glance?",
      opts: [
        ["Powerful / striking", { "bold-sans": 2 }],
        ["Luxurious / refined", { "elegant-serif": 2 }],
        ["Clean / futuristic", { "modern-geometric": 2 }],
        ["Cheerful / inviting", { "playful": 2 }],
        ["Nostalgic / handcrafted", { "vintage": 2 }],
        ["Personal / artistic", { "script": 2 }]
      ]
    },
    {
      q: "4. Where will your logo appear most?",
      opts: [
        ["App / website / screens", { "modern-geometric": 2, "bold-sans": 1 }],
        ["Packaging / print", { "vintage": 2, "elegant-serif": 1 }],
        ["Social media", { "playful": 1, "bold-sans": 1, "script": 1 }],
        ["Signage / storefront", { "bold-sans": 2, "vintage": 1 }],
        ["Business cards / stationery", { "elegant-serif": 2, "script": 1 }]
      ]
    },
    {
      q: "5. Which lettering style appeals to you most?",
      opts: [
        ["Thick, heavy letters", { "bold-sans": 2 }],
        ["Thin, refined letters", { "elegant-serif": 1, "modern-geometric": 1 }],
        ["Handwritten / signature", { "script": 2 }],
        ["Rounded & soft", { "playful": 2 }],
        ["Old-style / retro", { "vintage": 2 }],
        ["Simple geometric shapes", { "modern-geometric": 2 }]
      ]
    }
  ];

  var quizBox = document.getElementById("quizBox");
  var progress = document.getElementById("quizProgress");
  var resultBox = document.getElementById("quizResult");
  var answers = [];

  function renderQuestion(i) {
    quizBox.innerHTML = "";
    progress.style.width = ((i / QUESTIONS.length) * 100) + "%";
    var q = QUESTIONS[i];
    var wrap = document.createElement("div");
    wrap.className = "quiz-q";
    var h = document.createElement("h3");
    h.textContent = q.q;
    wrap.appendChild(h);
    var opts = document.createElement("div");
    opts.className = "opts";
    q.opts.forEach(function (o) {
      var b = document.createElement("button");
      b.className = "opt";
      b.type = "button";
      b.textContent = o[0];
      b.addEventListener("click", function () {
        answers[i] = o[1];
        if (i + 1 < QUESTIONS.length) {
          renderQuestion(i + 1);
        } else {
          showResult();
        }
      });
      opts.appendChild(b);
    });
    wrap.appendChild(opts);
    quizBox.appendChild(wrap);
    quizBox.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function tally() {
    var scores = {};
    Object.keys(STYLE_INFO).forEach(function (k) { scores[k] = 0; });
    answers.forEach(function (w) {
      Object.keys(w).forEach(function (k) { scores[k] += w[k]; });
    });
    var best = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; })[0];
    return best;
  }

  function showResult() {
    progress.style.width = "100%";
    var key = tally();
    var info = STYLE_INFO[key];
    quizBox.style.display = "none";
    resultBox.style.display = "block";
    resultBox.innerHTML = "";
    var h3 = document.createElement("h3");
    h3.textContent = "Your brand font style: " + info.name;
    var demoH = document.createElement("div");
    demoH.className = "demo-head";
    demoH.style.fontFamily = info.hFamily;
    demoH.textContent = "Your Brand Name";
    var demoB = document.createElement("div");
    demoB.className = "demo-body";
    demoB.style.fontFamily = info.bFamily;
    demoB.textContent = "Headline: " + info.headline + "  ·  Body: " + info.body;
    var p = document.createElement("p");
    p.textContent = info.blurb;
    var links = document.createElement("p");
    links.innerHTML = 'Try this pairing live in our <a href="font-pairing.html">font pairing tool</a> ' +
      'or learn the rules in the <a href="../guides/font-pairing-for-beginners.html">beginner\'s pairing guide</a>.';
    var again = document.createElement("button");
    again.className = "btn ghost";
    again.type = "button";
    again.style.marginTop = "10px";
    again.textContent = "Retake the quiz";
    again.addEventListener("click", function () {
      answers = [];
      resultBox.style.display = "none";
      quizBox.style.display = "block";
      renderQuestion(0);
    });
    resultBox.appendChild(h3);
    resultBox.appendChild(demoH);
    resultBox.appendChild(demoB);
    resultBox.appendChild(p);
    resultBox.appendChild(links);
    resultBox.appendChild(again);
    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  renderQuestion(0);
})();
