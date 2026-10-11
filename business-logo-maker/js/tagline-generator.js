/* BusinessLogoMaker - Tagline / Slogan Generator
   Pick industry + tone -> generates business taglines with {name} */
(function () {
  "use strict";

  var KEYWORDS = {
    tech: ["innovation", "smart technology", "digital solutions", "the future"],
    law: ["justice", "your rights", "trusted counsel", "legal excellence"],
    food: ["great taste", "fresh flavor", "unforgettable meals", "food made with love"],
    fitness: ["your strongest self", "real results", "limitless energy", "a healthier you"],
    realestate: ["your dream home", "smart investments", "keys to happiness", "property with purpose"],
    healthcare: ["better health", "care you can trust", "wellness for life", "healing hands"],
    finance: ["financial freedom", "smarter money", "wealth that lasts", "your secure future"],
    beauty: ["natural radiance", "confidence daily", "timeless beauty", "your glow-up"]
  };

  var INDUSTRY_LABELS = {
    tech: "Technology",
    law: "Law Firm",
    food: "Restaurant & Food",
    fitness: "Fitness & Gym",
    realestate: "Real Estate",
    healthcare: "Healthcare",
    finance: "Finance",
    beauty: "Beauty & Salon"
  };

  var TONES = {
    professional: {
      label: "Professional",
      templates: [
        "{name}: {kw}, perfected.",
        "Trusted for {kw}.",
        "{name} \u2014 where {kw} meets excellence.",
        "Delivering {kw}, every single day.",
        "The professional choice for {kw}.",
        "{name}. {kw}, done right.",
        "Experience {kw} at its finest.",
        "Committed to {kw} since day one."
      ]
    },
    friendly: {
      label: "Friendly",
      templates: [
        "{name} \u2014 {kw} with a smile!",
        "Come for {kw}, stay for the people.",
        "Your neighborhood home of {kw}.",
        "{name} makes {kw} easy and fun.",
        "Good vibes and {kw}, always.",
        "We love {kw} \u2014 and it shows.",
        "{name}: {kw} for everyone.",
        "Friendly faces, {kw} you\u2019ll love."
      ]
    },
    bold: {
      label: "Bold",
      templates: [
        "{name}. {kw} \u2014 no compromises.",
        "We don\u2019t do average. We do {kw}.",
        "{kw}, redefined by {name}.",
        "Bigger, better {kw}. That\u2019s {name}.",
        "{name} \u2014 {kw} without limits.",
        "Dare to expect {kw}.",
        "We set the standard for {kw}.",
        "{name}: {kw} on another level."
      ]
    },
    elegant: {
      label: "Elegant",
      templates: [
        "{name} \u2014 the art of {kw}.",
        "Refined {kw}, timelessly {name}.",
        "Where {kw} becomes an experience.",
        "Elegance in every detail of {kw}.",
        "{name}. Simply {kw}, beautifully.",
        "The distinguished choice for {kw}.",
        "Crafted {kw}, curated for you.",
        "Timeless {kw} by {name}."
      ]
    }
  };

  function fill(template, name, kw) {
    return template.split("{name}").join(name).split("{kw}").join(kw);
  }

  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var indSel = document.getElementById("tg-industry");
    var toneSel = document.getElementById("tg-tone");
    var nameInput = document.getElementById("tg-name");
    var genBtn = document.getElementById("tg-generate");
    var out = document.getElementById("tagline-results");
    if (!indSel || !toneSel || !genBtn || !out) return;

    Object.keys(INDUSTRY_LABELS).forEach(function (k) {
      var o = document.createElement("option");
      o.value = k;
      o.textContent = INDUSTRY_LABELS[k];
      indSel.appendChild(o);
    });

    Object.keys(TONES).forEach(function (k) {
      var o = document.createElement("option");
      o.value = k;
      o.textContent = TONES[k].label;
      toneSel.appendChild(o);
    });

    function generate() {
      var industry = indSel.value || "tech";
      var tone = toneSel.value || "professional";
      var name = (nameInput.value || "").trim() || "Your Business";
      var kws = shuffled(KEYWORDS[industry]);
      var templates = shuffled(TONES[tone].templates);
      out.innerHTML = "";
      var n = Math.min(8, templates.length);
      for (var i = 0; i < n; i++) {
        var line = fill(templates[i], name, kws[i % kws.length]);
        var div = document.createElement("div");
        div.className = "tagline";
        var span = document.createElement("span");
        span.textContent = line;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "copy-btn";
        btn.textContent = "Copy";
        (function (text, b) {
          b.addEventListener("click", function () {
            var done = function () {
              b.textContent = "Copied!";
              setTimeout(function () { b.textContent = "Copy"; }, 1500);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(text).then(done, done);
            } else {
              var ta = document.createElement("textarea");
              ta.value = text;
              document.body.appendChild(ta);
              ta.select();
              try { document.execCommand("copy"); } catch (e) { /* noop */ }
              document.body.removeChild(ta);
              done();
            }
          });
        })(line, btn);
        div.appendChild(span);
        div.appendChild(btn);
        out.appendChild(div);
      }
    }

    genBtn.addEventListener("click", generate);
    generate();
  });
})();
