/* Menu Design Tips — interactive checklist + layout advisor */
(function () {
  "use strict";

  var CHECKLIST = [
    { group: "📐 Layout", items: [
      ["Limit to 2 pages (or one tri-fold)", "Diners decide in ~2 minutes. A sprawling menu creates choice paralysis and slows table turnover."],
      ["Use the golden triangle", "Eyes land first on the middle, then top-right, then top-left. Put high-margin dishes there."],
      ["One column for upscale, two for casual", "Single-column menus feel premium and slow readers down; two columns scan fast for busy spots."],
      ["Box or highlight 2–3 stars", "A shaded box or border draws the eye. Use it on your most profitable dishes, not the cheapest."]
    ]},
    { group: "🔤 Typography", items: [
      ["Max 2 fonts: one display, one body", "A personality font for headings plus a clean readable font for descriptions. More than two looks chaotic."],
      ["Body text at least 11–12pt in print", "Dim restaurant lighting punishes small type. Test your menu under warm low light."],
      ["Use headings to chunk sections", "Appetizers, Mains, Desserts, Drinks — clear hierarchy lets guests scan in seconds."]
    ]},
    { group: "💰 Pricing psychology", items: [
      ["Drop the $ sign", "Studies show guests spend more when prices are plain numbers (24) instead of $24.00."],
      ["Nestle price after the description", "Put the price at the end of the dish description in the same size — never in a right-hand column."],
      ["Avoid price ladders", "Listing prices in ascending order trains guests to pick the cheapest. Mix price points within sections."],
      ["Add one premium anchor dish", "A single expensive signature item makes everything else feel reasonably priced."]
    ]},
    { group: "✍️ Descriptions & photos", items: [
      ["Describe with senses, not adjectives", "'Wood-fired, blistered crust, San Marzano tomato' beats 'delicious tasty pizza'."],
      ["Name the origin of 2–3 ingredients", "Local farm names and regions add perceived value and justify higher prices."],
      ["Fewer, better photos (or none)", "One stunning photo per section beats a wall of mediocre ones. Upscale menus often use zero photos."],
      ["Keep descriptions to 1–2 lines", "Long paragraphs don't get read. Two vivid lines sell; five lines get skipped."]
    ]}
  ];

  var LAYOUTS = {
    finedining: {
      name: "🍷 Fine Dining", tips: [
        "Single column, generous white space — let each dish breathe.",
        "No photos; let typography and paper quality carry the luxury feel.",
        "Tasting menu on a separate elegant card; wine pairings listed beneath each course.",
        "Serif display font (like Playfair or Cormorant) + prices without currency symbols."
      ],
      order: ["Amuse-bouche", "Starters", "Mains", "Cheese", "Desserts", "Digestifs & Coffee"]
    },
    fastfood: {
      name: "🍔 Fast Food / QSR", tips: [
        "Menu boards: max 7 items per panel — group into Combos, Burgers, Sides, Drinks.",
        "Big appetizing photos of hero items; bright colors; prices large and clear.",
        "Combos first (highest margin), then signatures, then everything else.",
        "Digital boards: rotate a 'limited time' slot to create urgency."
      ],
      order: ["Combos & Deals", "Signatures", "Burgers / Mains", "Sides", "Desserts", "Drinks"]
    },
    cafe: {
      name: "☕ Café", tips: [
        "Two sections max on the counter card: Drinks and Food — cafés are scanned in seconds.",
        "Chalkboard style works: hand-lettered headings photograph well for Instagram.",
        "Put your signature drink top-center with a small illustration.",
        "List milk alternatives and sizes clearly — it cuts ordering friction."
      ],
      order: ["Signature Drinks", "Espresso & Coffee", "Tea & More", "Breakfast", "Sandwiches & Sweets"]
    },
    pizzeria: {
      name: "🍕 Pizzeria", tips: [
        "Pizzas grouped by style (Classics, Specials, Calzones) — not by price.",
        "One hero photo of a cheese pull; the rest is clean typography.",
        "Toppings as a checklist grid — interactive and fun, boosts add-ons.",
        "Family deals boxed at top-right (the golden triangle sweet spot)."
      ],
      order: ["Specialty Pizzas", "Classic Pizzas", "Calzones & Stromboli", "Appetizers", "Salads", "Desserts & Drinks"]
    }
  };

  var LS_KEY = "rlm-menu-checklist-v1";

  function loadState() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch (e) { return {}; }
  }
  function saveState(s) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {}
  }

  function renderChecklist() {
    var state = loadState();
    var wrap = document.getElementById("checklist");
    wrap.innerHTML = "";
    var total = 0, done = 0, idx = 0;
    CHECKLIST.forEach(function (g) {
      var gd = document.createElement("div");
      gd.className = "check-group";
      var h = document.createElement("h3");
      h.textContent = g.group;
      gd.appendChild(h);
      g.items.forEach(function (it) {
        total++;
        var id = "c" + (idx++);
        var isDone = !!state[id];
        if (isDone) done++;
        var label = document.createElement("label");
        label.className = "check-item" + (isDone ? " done" : "");
        var cb = document.createElement("input");
        cb.type = "checkbox"; cb.checked = isDone;
        cb.setAttribute("data-id", id);
        var ct = document.createElement("span");
        ct.className = "ct";
        var strong = document.createElement("strong");
        strong.textContent = it[0];
        var span = document.createElement("span");
        span.textContent = it[1];
        ct.appendChild(strong); ct.appendChild(span);
        label.appendChild(cb); label.appendChild(ct);
        cb.addEventListener("change", function () {
          var s = loadState();
          s[id] = cb.checked;
          saveState(s);
          label.classList.toggle("done", cb.checked);
          updateProgress();
        });
        gd.appendChild(label);
      });
      wrap.appendChild(gd);
    });
    updateProgress();
  }

  function updateProgress() {
    var state = loadState();
    var boxes = document.querySelectorAll('#checklist input[type="checkbox"]');
    var done = 0;
    boxes.forEach(function (b) { if (b.checked) done++; });
    var pct = boxes.length ? Math.round(done / boxes.length * 100) : 0;
    document.getElementById("progFill").style.width = pct + "%";
    document.getElementById("progLabel").textContent = done + " of " + boxes.length + " done (" + pct + "%)" +
      (pct === 100 ? " — menu ready! 🎉" : "");
  }

  function renderLayouts() {
    var tabs = document.getElementById("layoutTabs");
    var body = document.getElementById("layoutBody");
    Object.keys(LAYOUTS).forEach(function (key, i) {
      var b = document.createElement("button");
      b.className = "opt" + (i === 0 ? " selected" : "");
      b.style.minWidth = "130px";
      b.innerHTML = '<span class="nm">' + LAYOUTS[key].name + "</span>";
      b.addEventListener("click", function () {
        tabs.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("selected"); });
        b.classList.add("selected");
        showLayout(key);
      });
      tabs.appendChild(b);
    });
    showLayout("finedining");

    function showLayout(key) {
      var L = LAYOUTS[key];
      var html = "<h3>" + L.name + " layout recipe</h3><ul>";
      L.tips.forEach(function (t) { html += "<li>" + t + "</li>"; });
      html += "</ul><h3>Recommended section order</h3><ol>";
      L.order.forEach(function (s) { html += "<li>" + s + "</li>"; });
      html += "</ol>";
      body.innerHTML = html;
      body.classList.add("show");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderChecklist();
    renderLayouts();
    document.getElementById("btnResetChecklist").addEventListener("click", function () {
      saveState({});
      renderChecklist();
    });
  });
})();
