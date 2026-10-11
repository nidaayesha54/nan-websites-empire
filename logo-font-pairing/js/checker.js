/* LogoFontPairing — logo typography checker logic (vanilla JS) */
(function () {
  "use strict";

  var CHECKS = [
    {
      group: "Readability",
      items: [
        { t: "Legible at small sizes", d: "Your logo text is still readable when shrunk to favicon or footer size.", tip: "Simplify letterforms, increase x-height, or choose a sturdier font. Test your logo at 32px wide." },
        { t: "Works in one color", d: "The logo holds up in pure black on white (and white on black) with no gradients.", tip: "Redesign any part that depends on color or gradients — logos must survive fax, embroidery and engraving." },
        { t: "No confusing letterforms", d: "Characters like I/l/1, O/0 and rn/m are clearly distinguishable.", tip: "Swap to a font with distinct letterforms, or customize the confusing glyphs by hand." },
        { t: "Even spacing & kerning", d: "Letter spacing looks balanced — no awkward gaps or collisions between specific pairs (like A-V).", tip: "Manually kern problem pairs (AV, To, LT, Ya). Never trust a font's default spacing in a logo." }
      ]
    },
    {
      group: "Scalability",
      items: [
        { t: "Readable at 16px", d: "The wordmark stays legible at tiny UI sizes like browser tabs and mobile icons.", tip: "Consider a simplified 'small-size' version of your logo with thicker strokes and wider spacing." },
        { t: "Works as an app icon / avatar", d: "Your typography survives being cropped into a square or circle social avatar.", tip: "Design a stacked or monogram variant specifically for square and circular crops." },
        { t: "No hairline strokes that vanish", d: "Thin strokes don't disappear when printed small or viewed on low-resolution screens.", tip: "Choose a slightly bolder weight, or thicken thin strokes manually in the vector file." },
        { t: "Built as vector, not raster", d: "The logo exists as editable vector outlines (SVG/EPS/AI), not a PNG or JPG.", tip: "Recreate or trace the logo as vector outlines so it scales infinitely without pixelation." }
      ]
    },
    {
      group: "Uniqueness & Brand Fit",
      items: [
        { t: "Distinctive vs competitors", d: "Your typography doesn't look like a clone of the top 3 competitors in your niche.", tip: "Audit competitor logos, then differentiate through weight, width, custom letterforms or ligatures." },
        { t: "Matches brand personality", d: "The font's mood (playful, luxurious, technical…) matches how you want customers to feel.", tip: "Retake our brand font quiz to find the style that actually fits your positioning." },
        { t: "Timeless, not trendy", d: "The font won't look dated in 3 years (avoid overused trendy faces used raw).", tip: "Prefer classic structures and add uniqueness through customization rather than chasing trends." },
        { t: "Tagline font complements headline", d: "If you use a second font, it contrasts in style but shares the same mood as the headline.", tip: "Use our font pairing tool to find a body font that pairs perfectly with your headline." }
      ]
    }
  ];

  var form = document.getElementById("checkForm");
  var scoreCard = document.getElementById("scoreCard");
  var tipsBox = document.getElementById("tipsBox");
  var total = 0;

  CHECKS.forEach(function (g, gi) {
    var group = document.createElement("div");
    group.className = "check-group";
    var h = document.createElement("h3");
    h.textContent = g.group;
    var cs = document.createElement("span");
    cs.className = "cscore";
    cs.id = "cscore-" + gi;
    h.appendChild(cs);
    group.appendChild(h);
    g.items.forEach(function (item, ii) {
      var id = "chk-" + gi + "-" + ii;
      total++;
      var label = document.createElement("label");
      label.className = "check-item";
      label.setAttribute("for", id);
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.id = id;
      cb.setAttribute("data-g", gi);
      cb.addEventListener("change", update);
      var txt = document.createElement("div");
      var t = document.createElement("div");
      t.className = "ct";
      t.textContent = item.t;
      var d = document.createElement("div");
      d.className = "cd";
      d.textContent = item.d;
      txt.appendChild(t);
      txt.appendChild(d);
      label.appendChild(cb);
      label.appendChild(txt);
      group.appendChild(label);
    });
    form.appendChild(group);
  });

  var btn = document.createElement("button");
  btn.className = "btn";
  btn.type = "button";
  btn.textContent = "Calculate my typography score";
  btn.addEventListener("click", function () {
    update(true);
    scoreCard.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  form.appendChild(btn);

  function grade(s) {
    if (s >= 90) return "A — Professional grade";
    if (s >= 75) return "B — Strong, minor fixes";
    if (s >= 60) return "C — Needs real work";
    return "D — Redesign recommended";
  }

  function update(scroll) {
    var boxes = form.querySelectorAll('input[type="checkbox"]');
    var checked = 0;
    var groupScores = [0, 0, 0];
    var groupTotals = [0, 0, 0];
    var missed = [];
    for (var i = 0; i < boxes.length; i++) {
      var g = parseInt(boxes[i].getAttribute("data-g"), 10);
      groupTotals[g]++;
      if (boxes[i].checked) {
        checked++;
        groupScores[g]++;
      } else {
        var parts = boxes[i].id.split("-");
        missed.push(CHECKS[parseInt(parts[1], 10)].items[parseInt(parts[2], 10)]);
      }
    }
    for (var j = 0; j < 3; j++) {
      var el = document.getElementById("cscore-" + j);
      if (el) el.textContent = groupScores[j] + "/" + groupTotals[j];
    }
    var score = Math.round((checked / total) * 100);
    scoreCard.style.display = "block";
    scoreCard.innerHTML =
      '<div class="big">' + score + '<span style="font-size:1.6rem">/100</span></div>' +
      '<div class="grade">' + grade(score) + "</div>" +
      '<p style="color:#cfc8bd;margin-top:10px">' + checked + " of " + total + " checks passed.</p>";

    tipsBox.innerHTML = "";
    if (missed.length > 0) {
      var t = document.createElement("div");
      t.className = "tips";
      var th = document.createElement("h4");
      th.textContent = "Fix these " + missed.length + " weak spot" + (missed.length > 1 ? "s" : "") + ":";
      t.appendChild(th);
      var ul = document.createElement("ul");
      missed.forEach(function (m) {
        var li = document.createElement("li");
        var b = document.createElement("strong");
        b.textContent = m.t + ": ";
        li.appendChild(b);
        li.appendChild(document.createTextNode(m.tip));
        ul.appendChild(li);
      });
      t.appendChild(ul);
      tipsBox.appendChild(t);
    } else {
      var ok = document.createElement("div");
      ok.className = "tips";
      ok.innerHTML = "<h4>Perfect score!</h4><p>Your logo typography passes every professional check. Keep the vector source files safe — and revisit this checklist after any rebrand.</p>";
      tipsBox.appendChild(ok);
    }
    if (scroll) scoreCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  update(false);
})();
