/* DogNamesHub — Name Generator tool logic */
(function () {
  "use strict";
  var genderSel = document.getElementById("g-gender");
  var styleSel = document.getElementById("g-style");
  var letterSel = document.getElementById("g-letter");
  var goBtn = document.getElementById("g-go");
  var shuffleBtn = document.getElementById("g-shuffle");
  var out = document.getElementById("g-results");
  var lastPool = [];

  // Build A–Z letter dropdown
  for (var i = 0; i < 26; i++) {
    var ch = String.fromCharCode(65 + i);
    var opt = document.createElement("option");
    opt.value = ch; opt.textContent = ch;
    letterSel.appendChild(opt);
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var j = a.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var t = a[j]; a[j] = a[k]; a[k] = t;
    }
    return a;
  }

  function filtered() {
    var g = genderSel.value, s = styleSel.value, l = letterSel.value;
    return DOG_NAMES.filter(function (d) {
      if (g !== "any" && d.g !== "any" && d.g !== g) return false;
      if (s !== "any" && d.s.indexOf(s) === -1) return false;
      if (l !== "any" && d.n.charAt(0).toUpperCase() !== l) return false;
      return true;
    });
  }

  function card(d) {
    var tags = d.s.map(function (t) { return STYLE_LABELS[t] || t; }).join(" · ");
    return '<div class="name-card"><h3>🐾 ' + esc(d.n) + '</h3>' +
      '<div class="tags">' + esc(GENDER_LABELS[d.g] || "") + " · " + esc(tags) + "</div>" +
      "<p>" + esc(d.m) + "</p></div>";
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }

  function render(list) {
    if (!list.length) {
      out.innerHTML = '<div class="empty">😢 No names match that combo — try loosening a filter!</div>';
      return;
    }
    out.innerHTML = list.map(card).join("");
  }

  function generate() {
    lastPool = filtered();
    render(shuffle(lastPool).slice(0, 10));
  }

  goBtn.addEventListener("click", generate);
  shuffleBtn.addEventListener("click", function () {
    if (!lastPool.length) { generate(); return; }
    render(shuffle(lastPool).slice(0, 10));
  });

  // Auto-generate on load so the page never looks empty
  generate();
})();
