/* RestaurantLogoMaker — SVG logo generator */
(function () {
  "use strict";

  var CUISINES = {
    italian: {
      label: "Italian", tagline: "Cucina Italiana",
      outer: "#a31621", ring: "#c9a227", inner: "#f7f0dd",
      ink: "#8e1f1f", text: "#7a1f1f", accent: "#2e7d32",
      font: "Georgia, 'Times New Roman', serif", weight: "bold"
    },
    sushi: {
      label: "Sushi / Japanese", tagline: "Japanese Kitchen",
      outer: "#1b1b1b", ring: "#c0392b", inner: "#ffffff",
      ink: "#1b1b1b", text: "#1b1b1b", accent: "#c0392b",
      font: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", weight: "800"
    },
    cafe: {
      label: "Café", tagline: "Coffee & More",
      outer: "#6f4e37", ring: "#d7b98f", inner: "#faf3e8",
      ink: "#4e342e", text: "#4e342e", accent: "#a9744f",
      font: "Georgia, 'Times New Roman', serif", weight: "bold"
    },
    fastfood: {
      label: "Fast Food", tagline: "Fast & Tasty",
      outer: "#e63946", ring: "#ffb703", inner: "#fff8e7",
      ink: "#c1121f", text: "#9d0208", accent: "#fb8500",
      font: "'Arial Black', Arial, sans-serif", weight: "900"
    }
  };

  var ICONS = {
    chefhat: { label: "Chef Hat", emoji: "👨‍🍳" },
    fork: { label: "Fork", emoji: "🍴" },
    coffee: { label: "Coffee Cup", emoji: "☕" },
    pizza: { label: "Pizza", emoji: "🍕" }
  };

  var SHAPES = {
    circle: "Circle Badge",
    shield: "Shield",
    square: "Rounded Square"
  };

  var state = { name: "Bella Roma", cuisine: "italian", icon: "chefhat", shape: "circle", tagline: "" };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---- icons drawn in a 120x120 box ---- */
  function iconSVG(key, c) {
    if (key === "chefhat") {
      return '<g>' +
        '<circle cx="38" cy="46" r="20" fill="' + c.ink + '"/>' +
        '<circle cx="60" cy="38" r="24" fill="' + c.ink + '"/>' +
        '<circle cx="82" cy="46" r="20" fill="' + c.ink + '"/>' +
        '<rect x="28" y="56" width="64" height="28" rx="8" fill="' + c.ink + '"/>' +
        '<line x1="44" y1="62" x2="44" y2="78" stroke="' + c.inner + '" stroke-width="3" stroke-linecap="round" opacity="0.55"/>' +
        '<line x1="60" y1="62" x2="60" y2="78" stroke="' + c.inner + '" stroke-width="3" stroke-linecap="round" opacity="0.55"/>' +
        '<line x1="76" y1="62" x2="76" y2="78" stroke="' + c.inner + '" stroke-width="3" stroke-linecap="round" opacity="0.55"/>' +
        '</g>';
    }
    if (key === "fork") {
      return '<g>' +
        '<path d="M38 30 h44 v14 c0 10 -8 14 -12 20 h-20 c-4 -6 -12 -10 -12 -20 z" fill="' + c.ink + '"/>' +
        '<rect x="55" y="62" width="10" height="44" rx="5" fill="' + c.ink + '"/>' +
        '<line x1="47" y1="10" x2="47" y2="32" stroke="' + c.ink + '" stroke-width="7" stroke-linecap="round"/>' +
        '<line x1="60" y1="10" x2="60" y2="32" stroke="' + c.ink + '" stroke-width="7" stroke-linecap="round"/>' +
        '<line x1="73" y1="10" x2="73" y2="32" stroke="' + c.ink + '" stroke-width="7" stroke-linecap="round"/>' +
        '</g>';
    }
    if (key === "coffee") {
      return '<g>' +
        '<path d="M28 46 h52 l-6 34 a8 8 0 0 1 -8 7 h-24 a8 8 0 0 1 -8 -7 z" fill="' + c.ink + '"/>' +
        '<path d="M80 52 c14 0 20 8 20 17 c0 10 -8 16 -22 16" fill="none" stroke="' + c.ink + '" stroke-width="8" stroke-linecap="round"/>' +
        '<rect x="18" y="96" width="76" height="6" rx="3" fill="' + c.ink + '"/>' +
        '<path d="M44 34 c-4 -6 4 -9 0 -15" fill="none" stroke="' + c.accent + '" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M62 34 c-4 -6 4 -9 0 -15" fill="none" stroke="' + c.accent + '" stroke-width="5" stroke-linecap="round"/>' +
        '</g>';
    }
    /* pizza — multi-color */
    return '<g>' +
      '<path d="M60 14 L28 96 Q60 110 92 96 Z" fill="#f4b942"/>' +
      '<rect x="36" y="8" width="48" height="17" rx="8.5" fill="#a5682a"/>' +
      '<circle cx="52" cy="54" r="7.5" fill="#c0392b"/>' +
      '<circle cx="69" cy="68" r="7.5" fill="#c0392b"/>' +
      '<circle cx="55" cy="80" r="7.5" fill="#c0392b"/>' +
      '</g>';
  }

  /* ---- badge frames in a 400x400 viewBox ---- */
  function frameSVG(shape, c) {
    if (shape === "shield") {
      return '' +
        '<path d="M200 22 L336 74 V206 C336 298 274 350 200 378 C126 350 64 298 64 206 V74 Z" fill="' + c.outer + '"/>' +
        '<path d="M200 44 L314 90 V204 C314 282 260 328 200 352 C140 328 86 282 86 204 V90 Z" fill="none" stroke="' + c.ring + '" stroke-width="8"/>' +
        '<path d="M200 62 L296 104 V202 C296 270 248 312 200 334 C152 312 104 270 104 202 V104 Z" fill="' + c.inner + '"/>';
    }
    if (shape === "square") {
      return '' +
        '<rect x="22" y="22" width="356" height="356" rx="72" fill="' + c.outer + '"/>' +
        '<rect x="44" y="44" width="312" height="312" rx="56" fill="none" stroke="' + c.ring + '" stroke-width="8"/>' +
        '<rect x="66" y="66" width="268" height="268" rx="42" fill="' + c.inner + '"/>';
    }
    /* circle badge */
    return '' +
      '<circle cx="200" cy="200" r="192" fill="' + c.outer + '"/>' +
      '<circle cx="200" cy="200" r="172" fill="none" stroke="' + c.ring + '" stroke-width="7"/>' +
      '<circle cx="200" cy="200" r="152" fill="' + c.inner + '"/>';
  }

  function splitName(name) {
    name = name.trim() || "Your Restaurant";
    if (name.length <= 14) return [name];
    var words = name.split(/\s+/);
    if (words.length === 1) return [name];
    var mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  }

  function textEl(x, y, str, size, c2, o) {
    o = o || {};
    var ls = o.ls || 0;
    var estW = str.length * size * 0.62 + ls * Math.max(str.length - 1, 0);
    var tl = estW > o.maxW ? ' textLength="' + o.maxW + '" lengthAdjust="spacingAndGlyphs"' : "";
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle"' +
      ' font-family="' + c2.font + '" font-weight="' + (o.weight || c2.weight) + '"' +
      ' font-size="' + size + '" letter-spacing="' + ls + '" fill="' + (o.fill || c2.text) + '"' +
      (o.opacity ? ' opacity="' + o.opacity + '"' : "") + tl + ">" + esc(str) + "</text>";
  }

  function buildLogoSVG() {
    var c = CUISINES[state.cuisine];
    var tagline = (state.tagline.trim() || c.tagline).toUpperCase();
    var compact = state.shape === "shield";
    var dy = compact ? -24 : 0;
    var lines = splitName(state.name).map(function (l) { return l.toUpperCase(); });
    var longest = Math.max.apply(null, lines.map(function (l) { return l.length; }));
    var fs = longest <= 10 ? 46 : longest <= 16 ? 38 : longest <= 22 ? 32 : 27;
    if (compact) fs = Math.round(fs * 0.85);
    var maxNameW = compact ? 150 : 235;
    var fitFs = Math.floor(maxNameW / (longest * 0.68));
    if (fitFs < fs) fs = Math.max(fitFs, 13);
    var step = fs + 8;
    var nameY = (lines.length === 1 ? 258 : 240) + dy;
    var iconY = compact ? 66 : 78;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img" aria-label="Restaurant logo">' +
      frameSVG(state.shape, c) +
      '<g transform="translate(140,' + iconY + ')">' + iconSVG(state.icon, c) + "</g>";
    lines.forEach(function (l, i) {
      svg += textEl(200, nameY + i * step, l, fs, c, { ls: 1, maxW: maxNameW });
    });
    var divY = nameY + (lines.length - 1) * step + 24;
    var dx = compact ? 62 : 130;
    svg += '<line x1="' + (200 - dx) + '" y1="' + divY + '" x2="' + (200 + dx) + '" y2="' + divY + '"' +
      ' stroke="' + c.ring + '" stroke-width="3"/>' +
      '<circle cx="' + (200 - dx - 12) + '" cy="' + divY + '" r="4" fill="' + c.accent + '"/>' +
      '<circle cx="' + (200 + dx + 12) + '" cy="' + divY + '" r="4" fill="' + c.accent + '"/>';
    var tagY = divY + 28;
    if (compact) {
      svg += textEl(200, tagY, tagline, 11, c, { ls: 1, maxW: 110, fill: c.ink });
    } else {
      svg += textEl(200, tagY, tagline, 16, c, { ls: 3, maxW: 208, fill: c.ink });
      svg += textEl(200, tagY + 24, "★ EST. 2026 ★", 12, c, { ls: 3, maxW: 180, fill: c.ink, opacity: 0.75 });
    }
    return svg + "</svg>";
  }

  /* ---- UI wiring ---- */
  function render() {
    document.getElementById("logoPreview").innerHTML = buildLogoSVG();
    var fname = document.getElementById("fileName");
    if (fname) fname.textContent = fileBase() + ".svg / .png";
  }

  function fileBase() {
    return (state.name.trim() || "restaurant") .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") + "-logo";
  }

  function download(url, filename) {
    var a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); }, 100);
  }

  function downloadSVG() {
    var blob = new Blob([buildLogoSVG()], { type: "image/svg+xml;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    download(url, fileBase() + ".svg");
    setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
    note("SVG downloaded — perfect for print & signage.");
  }

  function downloadPNG() {
    var svgStr = buildLogoSVG();
    var blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var img = new Image();
    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = 1024; canvas.height = 1024;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 1024, 1024);
      URL.revokeObjectURL(url);
      if (canvas.toBlob) {
        canvas.toBlob(function (b) {
          var u2 = URL.createObjectURL(b);
          download(u2, fileBase() + ".png");
          setTimeout(function () { URL.revokeObjectURL(u2); }, 5000);
          note("PNG downloaded (1024×1024) — great for web & social.");
        }, "image/png");
      } else {
        note("PNG export not supported in this browser — use SVG instead.");
      }
    };
    img.onerror = function () { note("Could not render PNG — try the SVG download instead."); };
    img.src = url;
  }

  function note(msg) {
    var el = document.getElementById("dlNote");
    if (el) { el.textContent = msg; }
  }

  function surprise() {
    var keys = function (o) { return Object.keys(o); };
    state.cuisine = keys(CUISINES)[Math.floor(Math.random() * 4)];
    state.icon = keys(ICONS)[Math.floor(Math.random() * 4)];
    state.shape = keys(SHAPES)[Math.floor(Math.random() * 3)];
    var samples = ["Bella Roma", "Sakura House", "The Copper Cup", "Burger Barn", "Olive & Thyme", "Tokyo Nights", "Café Lumière", "Smoky Joe's"];
    state.name = samples[Math.floor(Math.random() * samples.length)];
    document.getElementById("restName").value = state.name;
    document.getElementById("tagline").value = "";
    state.tagline = "";
    syncOptions();
    render();
  }

  function makeOptGrid(elId, items, current, onPick) {
    var el = document.getElementById(elId);
    el.innerHTML = "";
    Object.keys(items).forEach(function (key) {
      var d = document.createElement("div");
      d.className = "opt" + (key === current ? " selected" : "");
      d.setAttribute("role", "button");
      d.setAttribute("tabindex", "0");
      var inner = items[key].emoji ? '<span class="ic">' + items[key].emoji + "</span>" : "";
      d.innerHTML = inner + '<span class="nm">' + items[key].label + "</span>";
      var pick = function () { onPick(key); syncOptions(); render(); };
      d.addEventListener("click", pick);
      d.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      el.appendChild(d);
    });
  }

  function syncOptions() {
    makeOptGrid("cuisineGrid", CUISINES, state.cuisine, function (k) { state.cuisine = k; });
    makeOptGrid("iconGrid", ICONS, state.icon, function (k) { state.icon = k; });
    var shapeItems = {};
    Object.keys(SHAPES).forEach(function (k) { shapeItems[k] = { label: SHAPES[k] }; });
    makeOptGrid("shapeGrid", shapeItems, state.shape, function (k) { state.shape = k; });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var nameInput = document.getElementById("restName");
    var tagInput = document.getElementById("tagline");
    nameInput.addEventListener("input", function () { state.name = nameInput.value; render(); });
    tagInput.addEventListener("input", function () { state.tagline = tagInput.value; render(); });
    document.getElementById("btnSVG").addEventListener("click", downloadSVG);
    document.getElementById("btnPNG").addEventListener("click", downloadPNG);
    document.getElementById("btnSurprise").addEventListener("click", surprise);
    syncOptions();
    render();
  });
})();
