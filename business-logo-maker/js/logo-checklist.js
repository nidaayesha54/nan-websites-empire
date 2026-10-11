/* BusinessLogoMaker - Logo Quality Checklist tool
   10 criteria -> live score + improvement tips for unchecked items */
(function () {
  "use strict";

  var CRITERIA = [
    {
      title: "1. Simple & uncluttered",
      desc: "The logo works when shrunk to favicon size (16px) without losing meaning.",
      tip: "Remove extra elements, gradients and fine detail. If it is not readable at 1 inch wide, simplify it."
    },
    {
      title: "2. Memorable at a glance",
      desc: "Someone can sketch it from memory after seeing it for 5 seconds.",
      tip: "Build around ONE strong shape or idea (think Nike swoosh, Apple apple). Avoid generic clip-art concepts."
    },
    {
      title: "3. Relevant to your industry",
      desc: "The imagery or style signals what your business actually does.",
      tip: "Test it on 5 strangers: ask what industry they think it belongs to. Mismatches mean a rethink."
    },
    {
      title: "4. Timeless, not trendy",
      desc: "It will still look professional in 10 years, not dated by a passing fad.",
      tip: "Avoid trendy gradients, 3D bevels and meme aesthetics. Flat, geometric marks age best."
    },
    {
      title: "5. Works in one color",
      desc: "The logo stays recognizable in pure black on white (and reversed).",
      tip: "Convert it to black and white today. If it breaks, the concept depends too much on color."
    },
    {
      title: "6. Scales from favicon to billboard",
      desc: "Crisp and legible from a browser tab to a shop sign.",
      tip: "Use vector (SVG) artwork, not raster images. Check stroke widths at tiny sizes."
    },
    {
      title: "7. Distinct from competitors",
      desc: "It does not look like the top 5 logos in your niche.",
      tip: "Line your logo up next to competitors'. If it blends in, change the shape language or color family."
    },
    {
      title: "8. Typography is appropriate",
      desc: "The font matches the brand personality and is legible at all sizes.",
      tip: "Use max 1\u20132 fonts, avoid system defaults and overused free fonts. Check kerning and spacing."
    },
    {
      title: "9. Color psychology fits",
      desc: "Colors match the emotion you want customers to feel (trust, energy, luxury...).",
      tip: "Blue = trust, green = health/growth, red = energy, black/gold = premium. Pick 1\u20132 brand colors max."
    },
    {
      title: "10. Balanced composition",
      desc: "Icon, text and spacing feel balanced with clear breathing room.",
      tip: "Apply the clear-space rule: keep empty space equal to the icon height around the logo everywhere."
    }
  ];

  function gradeFor(score) {
    if (score >= 90) return { label: "Excellent logo", cls: "great" };
    if (score >= 70) return { label: "Good \u2014 minor fixes", cls: "good" };
    if (score >= 40) return { label: "Needs work", cls: "poor" };
    return { label: "Major redesign advised", cls: "poor" };
  }

  document.addEventListener("DOMContentLoaded", function () {
    var list = document.getElementById("checklist");
    var scoreEl = document.getElementById("score-num");
    var fillEl = document.getElementById("score-fill");
    var gradeEl = document.getElementById("score-grade");
    var tipsEl = document.getElementById("tips-list");
    var countEl = document.getElementById("score-count");
    if (!list) return;

    CRITERIA.forEach(function (c, i) {
      var item = document.createElement("div");
      item.className = "check-item";
      var box = document.createElement("input");
      box.type = "checkbox";
      box.id = "crit-" + i;
      box.setAttribute("aria-label", c.title);
      var body = document.createElement("div");
      var h = document.createElement("h3");
      h.textContent = c.title;
      var p = document.createElement("p");
      p.textContent = c.desc;
      body.appendChild(h);
      body.appendChild(p);
      item.appendChild(box);
      item.appendChild(body);
      box.addEventListener("change", function () {
        item.classList.toggle("done", box.checked);
        update();
      });
      list.appendChild(item);
    });

    function update() {
      var boxes = list.querySelectorAll("input[type=checkbox]");
      var checked = 0;
      var tips = [];
      for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].checked) {
          checked++;
        } else {
          tips.push(CRITERIA[i]);
        }
      }
      var score = Math.round((checked / CRITERIA.length) * 100);
      var g = gradeFor(score);
      if (scoreEl) scoreEl.textContent = score + "%";
      if (fillEl) fillEl.style.width = score + "%";
      if (countEl) countEl.textContent = checked + " of " + CRITERIA.length + " criteria met";
      if (gradeEl) {
        gradeEl.textContent = g.label;
        gradeEl.className = "grade " + g.cls;
      }
      if (tipsEl) {
        tipsEl.innerHTML = "";
        if (tips.length === 0) {
          var li = document.createElement("li");
          li.textContent = "Your logo passes all 10 checks \u2014 it is ready for professional use.";
          tipsEl.appendChild(li);
        } else {
          var head = document.createElement("li");
          head.innerHTML = "<strong>Priority fixes (" + tips.length + "):</strong>";
          tipsEl.appendChild(head);
          tips.forEach(function (c) {
            var t = document.createElement("li");
            var strong = document.createElement("strong");
            strong.textContent = c.title.replace(/^\d+\.\s*/, "") + ": ";
            t.appendChild(strong);
            t.appendChild(document.createTextNode(c.tip));
            tipsEl.appendChild(t);
          });
        }
      }
    }

    var reset = document.getElementById("checklist-reset");
    if (reset) {
      reset.addEventListener("click", function () {
        var boxes = list.querySelectorAll("input[type=checkbox]");
        for (var i = 0; i < boxes.length; i++) {
          boxes[i].checked = false;
          boxes[i].closest(".check-item").classList.remove("done");
        }
        update();
      });
    }

    update();
  });
})();
