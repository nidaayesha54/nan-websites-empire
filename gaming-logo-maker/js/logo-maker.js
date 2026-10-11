/* GamingLogoMaker — SVG logo builder */
(function () {
  "use strict";

  var state = { name: "NOVA SQUAD", style: "badge", icon: "skull", c1: "#00f0ff", c2: "#b536ff" };

  var STYLES = {
    badge: { label: "Esports Badge" },
    neon: { label: "Neon" },
    retro: { label: "Retro" }
  };

  var ICONS = {
    skull: { label: "Skull" },
    dragon: { label: "Dragon" },
    wolf: { label: "Wolf" },
    controller: { label: "Controller" }
  };

  // Icon artwork, drawn in a 100x100 box, centered on (50,50)
  function iconSVG(icon, fill, stroke) {
    var s = 'stroke="' + stroke + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
    if (icon === "skull") {
      return '<g>' +
        '<path d="M50 8 C31 8 19 23 19 41 C19 54 26 62 34 66 L34 80 C34 83 36 85 39 85 L61 85 C64 85 66 83 66 80 L66 66 C74 62 81 54 81 41 C81 23 69 8 50 8 Z" fill="' + fill + '" ' + s + '/>' +
        '<circle cx="38" cy="44" r="8" fill="#0a0e1a"/>' +
        '<circle cx="62" cy="44" r="8" fill="#0a0e1a"/>' +
        '<path d="M50 56 L44 66 L56 66 Z" fill="#0a0e1a"/>' +
        '<path d="M42 85 L42 76 M50 85 L50 76 M58 85 L58 76" ' + s + '/>' +
        '</g>';
    }
    if (icon === "dragon") {
      return '<g>' +
        '<path d="M50 6 L60 20 L78 15 L71 31 L90 38 L70 44 L74 64 L59 55 L50 76 L41 55 L26 64 L30 44 L10 38 L29 31 L22 15 L40 20 Z" fill="' + fill + '" ' + s + '/>' +
        '<circle cx="42" cy="40" r="4.5" fill="#0a0e1a"/>' +
        '<circle cx="58" cy="40" r="4.5" fill="#0a0e1a"/>' +
        '</g>';
    }
    if (icon === "wolf") {
      return '<g>' +
        '<path d="M18 12 L36 26 L50 22 L64 26 L82 12 L75 44 L68 60 L50 80 L32 60 L25 44 Z" fill="' + fill + '" ' + s + '/>' +
        '<path d="M36 26 L44 44 L50 60 L56 44 L64 26" fill="none" ' + s + '/>' +
        '<path d="M50 60 L44 70 L56 70 Z" fill="#0a0e1a"/>' +
        '<circle cx="41" cy="46" r="3.5" fill="#0a0e1a"/>' +
        '<circle cx="59" cy="46" r="3.5" fill="#0a0e1a"/>' +
        '</g>';
    }
    // controller
    return '<g>' +
      '<rect x="14" y="34" width="72" height="36" rx="18" fill="' + fill + '" ' + s + '/>' +
      '<path d="M30 44 L30 60 M22 52 L38 52" ' + s + '/>' +
      '<circle cx="64" cy="47" r="4" fill="#0a0e1a"/>' +
      '<circle cx="72" cy="55" r="4" fill="#0a0e1a"/>' +
      '<path d="M14 52 C8 66 12 80 24 84 L76 84 C88 80 92 66 86 52" fill="none" ' + s + '/>' +
      '</g>';
  }

  function badgeBack(c1, c2) {
    return '<defs><linearGradient id="gmbg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient></defs>' +
      '<path d="M60 8 L200 8 L228 40 L228 150 C228 205 160 245 150 250 C140 245 72 205 72 150 L72 40 Z" ' +
      'transform="translate(0,10) scale(0.5)" fill="url(#gmbg)" stroke="#05070f" stroke-width="6"/>' +
      '<path d="M60 8 L200 8 L228 40 L228 150 C228 205 160 245 150 250 C140 245 72 205 72 150 L72 40 Z" ' +
      'transform="translate(0,10) scale(0.5)" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.5"/>';
  }

  function neonBack(c1, c2) {
    return '<defs><linearGradient id="gmng" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient>' +
      '<filter id="gmglow" x="-40%" y="-40%" width="180%" height="180%">' +
      '<feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
      '</filter></defs>' +
      '<rect x="14" y="14" width="272" height="272" rx="26" fill="#070b18" stroke="url(#gmng)" stroke-width="5" filter="url(#gmglow)"/>';
  }

  function retroBack(c1, c2) {
    var stripes = "";
    for (var i = 0; i < 5; i++) {
      var y = 210 + i * 14;
      stripes += '<rect x="60" y="' + y + '" width="180" height="7" rx="3.5" fill="' + (i % 2 ? c2 : c1) + '" opacity="' + (1 - i * 0.18) + '"/>';
    }
    return '<defs><radialGradient id="gmrg" cx="0.5" cy="0.35" r="0.9">' +
      '<stop offset="0" stop-color="' + c1 + '" stop-opacity="0.35"/><stop offset="1" stop-color="' + c2 + '" stop-opacity="0.08"/>' +
      '</radialGradient></defs>' +
      '<circle cx="150" cy="150" r="132" fill="url(#gmrg)" stroke="' + c1 + '" stroke-width="5"/>' +
      '<circle cx="150" cy="150" r="114" fill="none" stroke="' + c2 + '" stroke-width="2" stroke-dasharray="10 6"/>' +
      stripes;
  }

  function fitFontSize(name) {
    var len = name.length;
    if (len <= 8) return 30;
    if (len <= 12) return 24;
    if (len <= 16) return 19;
    return 15;
  }

  function buildSVG() {
    var name = (state.name || "NOVA SQUAD").toUpperCase();
    var fs = fitFontSize(name);
    var icon = '<g transform="translate(95,58) scale(1.1)">' + iconSVG(state.icon, state.c1, "#ffffff") + '</g>';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300" role="img" aria-label="' + escapeAttr(name) + ' gaming logo">';

    if (state.style === "badge") {
      svg += badgeBack(state.c1, state.c2) +
        '<g transform="translate(100,66) scale(1.0)">' + iconSVG(state.icon, "#0a0e1a", state.c1) + '</g>' +
        '<text x="150" y="212" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-style="italic" font-size="' + fs + '" fill="#ffffff" stroke="#05070f" stroke-width="1" letter-spacing="1">' + escapeXml(name) + '</text>' +
        '<text x="150" y="238" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="13" fill="' + state.c1 + '" letter-spacing="6">ESPORTS</text>';
    } else if (state.style === "neon") {
      svg += neonBack(state.c1, state.c2) + icon +
        '<text x="150" y="222" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="' + fs + '" fill="' + state.c1 + '" filter="url(#gmglow)" letter-spacing="2">' + escapeXml(name) + '</text>' +
        '<text x="150" y="252" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="' + state.c2 + '" letter-spacing="5">GAMING</text>';
    } else {
      svg += retroBack(state.c1, state.c2) + icon +
        '<text x="150" y="196" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="' + fs + '" fill="#ffffff" letter-spacing="1">' + escapeXml(name) + '</text>' +
        '<text x="150" y="292" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="11" fill="' + state.c2 + '" letter-spacing="4">★ EST. 2026 ★</text>';
    }
    return svg + "</svg>";
  }

  function escapeXml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function escapeAttr(s) {
    return escapeXml(s).replace(/"/g, "&quot;");
  }

  function render() {
    var box = document.getElementById("logoPreview");
    if (box) box.innerHTML = buildSVG();
  }

  function download() {
    var svg = buildSVG();
    var blob = new Blob([svg], { type: "image/svg+xml" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var fname = (state.name || "gaming-logo").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "gaming-logo";
    a.href = url;
    a.download = fname + "-logo.svg";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 500);
  }

  function bindOptions(containerId, key, onPick) {
    var c = document.getElementById(containerId);
    if (!c) return;
    var opts = c.querySelectorAll(".opt");
    for (var i = 0; i < opts.length; i++) {
      (function (el) {
        el.addEventListener("click", function () {
          for (var j = 0; j < opts.length; j++) opts[j].classList.remove("active");
          el.classList.add("active");
          state[key] = el.getAttribute("data-val");
          if (onPick) onPick();
          render();
        });
      })(opts[i]);
    }
  }

  function init() {
    var nameInput = document.getElementById("teamName");
    if (nameInput) {
      nameInput.addEventListener("input", function () {
        state.name = nameInput.value.trim() || "NOVA SQUAD";
        render();
      });
    }
    bindOptions("styleOpts", "style");
    bindOptions("iconOpts", "icon");
    var c1 = document.getElementById("color1"), c2 = document.getElementById("color2");
    if (c1) c1.addEventListener("input", function () { state.c1 = c1.value; render(); });
    if (c2) c2.addEventListener("input", function () { state.c2 = c2.value; render(); });
    var dl = document.getElementById("downloadBtn");
    if (dl) dl.addEventListener("click", download);
    var rnd = document.getElementById("randomBtn");
    if (rnd) rnd.addEventListener("click", function () {
      var styles = Object.keys(STYLES), icons = Object.keys(ICONS);
      state.style = styles[Math.floor(Math.random() * styles.length)];
      state.icon = icons[Math.floor(Math.random() * icons.length)];
      state.c1 = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
      state.c2 = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
      syncUI(); render();
    });
    syncUI();
    render();
  }

  function syncUI() {
    [["styleOpts", "style"], ["iconOpts", "icon"]].forEach(function (pair) {
      var c = document.getElementById(pair[0]);
      if (!c) return;
      var opts = c.querySelectorAll(".opt");
      for (var i = 0; i < opts.length; i++) {
        opts[i].classList.toggle("active", opts[i].getAttribute("data-val") === state[pair[1]]);
      }
    });
    var c1 = document.getElementById("color1"), c2 = document.getElementById("color2");
    if (c1) c1.value = state.c1;
    if (c2) c2.value = state.c2;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
