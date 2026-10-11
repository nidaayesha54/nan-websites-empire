// MinimalistLogoMaker — Logo Simplicity (Whitespace) Checker
// Scores a logo's simplicity from user inputs and returns targeted tips.
(function () {
  "use strict";

  var form = document.getElementById("scoreForm");
  var result = document.getElementById("scoreResult");
  if (!form || !result) return;

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value : "";
  }
  function num(id) {
    var n = parseInt(val(id), 10);
    return isNaN(n) ? 0 : n;
  }
  function radio(name) {
    var els = document.querySelectorAll('input[name="' + name + '"]');
    for (var i = 0; i < els.length; i++) if (els[i].checked) return els[i].value;
    return "no";
  }

  function gradeFor(score) {
    if (score >= 90) return ["Ultra-minimal", "Museum-grade simplicity. Protect this logo — it's rarer than you think."];
    if (score >= 75) return ["Clean & minimal", "A genuinely simple logo. A tweak or two could make it iconic."];
    if (score >= 55) return ["Borderline", "Readable, but complexity is creeping in. The tips below show exactly what to cut."];
    return ["Too complex", "This logo is fighting minimalism. Simplify aggressively — start with the first tip."];
  }

  function calculate() {
    var score = 100;
    var tips = [];

    var colors = val("fColors");
    if (colors === "3") { score -= 8; tips.push("Drop from 3 colors to 2. The third color rarely adds meaning — it usually adds noise."); }
    else if (colors === "4") { score -= 16; tips.push("Four colors is two too many for minimal. Pick the two strongest and let whitespace do the rest."); }
    else if (colors === "5plus") { score -= 26; tips.push("Five or more colors reads as illustration, not a logo. Rebuild around 1–2 core colors."); }

    var elements = num("fElements");
    if (elements === 2) { score -= 4; }
    else if (elements === 3) { score -= 8; tips.push("Three separate elements compete for attention. Can two of them merge into one idea?"); }
    else if (elements > 3) {
      var d = Math.min(35, 8 + 7 * (elements - 3));
      score -= d;
      tips.push(elements + " distinct elements is a crowd. Iconic minimalist logos express one idea — combine or cut until one remains.");
    }

    if (radio("fGrad") === "yes") { score -= 12; tips.push("Remove gradients — flat color scales from favicon to billboard; gradients band, blur and date quickly."); }
    if (radio("fShadow") === "yes") { score -= 10; tips.push("Drop shadows and 3D effects. A truly minimal logo works as a single flat silhouette."); }
    if (radio("fDetail") === "yes") { score -= 12; tips.push("Eliminate fine detail (thin lines, tiny text inside the mark). If it vanishes at small sizes, it doesn't belong."); }

    var words = num("fWords");
    if (words === 3) { score -= 5; tips.push("Three words is fine for a lockup, but consider whether the tagline must live inside the logo."); }
    else if (words > 3) { score -= 10; tips.push("Four or more words inside a logo kills scalability. Keep the mark wordless or 1–2 words max."); }

    if (radio("fFavicon") === "no") { score -= 10; tips.push("Fails the favicon test: simplify until the mark is recognizable at 32×32 pixels."); }
    if (radio("fMono") === "no") { score -= 10; tips.push("Must work in a single color. If it needs full color to make sense, the shape isn't strong enough yet."); }
    if (radio("fNeg") === "yes") { score = Math.min(100, score + 8); }

    score = Math.max(0, Math.min(100, Math.round(score)));

    if (tips.length === 0) {
      tips.push("Nothing to fix — this is textbook minimalism. Now test it in the wild: favicon, embroidery, single-color print.");
    }
    tips.push("Try rebuilding the mark from just 2–3 basic shapes in our <a href=\"shape-combiner.html\">shape combiner</a> — constraints breed the best minimal logos.");

    return { score: score, tips: tips };
  }

  // radio pill styling
  var pills = form.querySelectorAll(".radio-pill");
  for (var p = 0; p < pills.length; p++) {
    (function (pill) {
      var input = pill.querySelector("input");
      pill.addEventListener("click", function () {
        var group = form.querySelectorAll('input[name="' + input.name + '"]');
        for (var g = 0; g < group.length; g++) {
          group[g].closest(".radio-pill").classList.remove("on");
        }
        pill.classList.add("on");
      });
    })(pills[p]);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var r = calculate();
    var g = gradeFor(r.score);
    var tipsHtml = r.tips.map(function (t) { return "<li>" + t + "</li>"; }).join("");
    result.innerHTML =
      '<div class="score-num">' + r.score + '<span style="font-size:26px;color:var(--muted)">/100</span></div>' +
      '<p class="grade">' + g[0] + "</p>" +
      '<p class="hint" style="max-width:560px;margin:0 auto">' + g[1] + "</p>" +
      '<div class="meter"><i style="width:' + r.score + '%"></i></div>' +
      '<ul class="tips" style="text-align:left;max-width:640px;margin:18px auto 0">' + tipsHtml + "</ul>" +
      '<div class="preview-actions" style="justify-content:center;margin-top:18px">' +
      '<a class="btn small" href="shape-combiner.html">Rebuild It Simply</a> ' +
      '<a class="btn small ghost" href="../guides/why-minimalist-logos-work.html">Why Minimalism Works</a>' +
      "</div>";
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
})();
