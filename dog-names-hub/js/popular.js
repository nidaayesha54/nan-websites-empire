/* DogNamesHub — Popular names browser: category tabs + live search */
(function () {
  "use strict";
  var CATS = [
    { id: "all", label: "🐾 All" },
    { id: "popular", label: "🔥 Most Popular" },
    { id: "cute", label: "🥰 Cute" },
    { id: "funny", label: "🤪 Funny" },
    { id: "tough", label: "💪 Tough" },
    { id: "unique", label: "✨ Unique" },
    { id: "classic", label: "🏛️ Classic" },
    { id: "nature", label: "🌿 Nature" },
    { id: "food", label: "🍩 Food" }
  ];
  var activeCat = "all", query = "";
  var tabsEl = document.getElementById("p-tabs");
  var searchEl = document.getElementById("p-search");
  var gridEl = document.getElementById("p-grid");
  var countEl = document.getElementById("p-count");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }

  CATS.forEach(function (c) {
    var b = document.createElement("button");
    b.className = "tab" + (c.id === "all" ? " on" : "");
    b.textContent = c.label;
    b.setAttribute("data-cat", c.id);
    b.addEventListener("click", function () {
      activeCat = c.id;
      var all = tabsEl.querySelectorAll(".tab");
      for (var i = 0; i < all.length; i++) all[i].classList.remove("on");
      b.classList.add("on");
      render();
    });
    tabsEl.appendChild(b);
  });

  var t = null;
  searchEl.addEventListener("input", function () {
    clearTimeout(t);
    t = setTimeout(function () { query = searchEl.value.trim().toLowerCase(); render(); }, 150);
  });

  function render() {
    var list = DOG_NAMES.filter(function (d) {
      if (activeCat !== "all" && d.s.indexOf(activeCat) === -1) return false;
      if (query && d.n.toLowerCase().indexOf(query) === -1 && d.m.toLowerCase().indexOf(query) === -1) return false;
      return true;
    });
    countEl.textContent = "Showing " + list.length + " of " + DOG_NAMES.length + " names";
    if (!list.length) {
      gridEl.innerHTML = '<div class="empty">😢 No names found — try a different search!</div>';
      return;
    }
    gridEl.innerHTML = list.map(function (d) {
      var tags = d.s.map(function (x) { return STYLE_LABELS[x] || x; }).join(" · ");
      return '<div class="name-card"><h3>🐾 ' + esc(d.n) + "</h3>" +
        '<div class="tags">' + esc(GENDER_LABELS[d.g]) + " · " + esc(tags) + "</div>" +
        "<p>" + esc(d.m) + "</p></div>";
    }).join("");
  }

  render();
})();
