/* BusinessLogoMaker - Industry Logo Templates tool
   Pick an industry -> live SVG logo preview -> edit name/color -> download SVG */
(function () {
  "use strict";

  // "COLOR" inside each icon is replaced with the chosen brand color.
  var INDUSTRIES = {
    tech: {
      label: "Technology",
      tagline: "SOFTWARE \u2022 IT \u2022 SAAS",
      icon: '<polygon points="200,42 252,72 252,132 200,162 148,132 148,72" fill="none" stroke="COLOR" stroke-width="10"/>' +
        '<circle cx="200" cy="102" r="15" fill="COLOR"/>' +
        '<circle cx="200" cy="42" r="8" fill="COLOR"/>' +
        '<circle cx="252" cy="132" r="8" fill="COLOR"/>' +
        '<circle cx="148" cy="132" r="8" fill="COLOR"/>'
    },
    law: {
      label: "Law Firm",
      tagline: "ATTORNEYS \u2022 COUNSELORS \u2022 JUSTICE",
      icon: '<line x1="200" y1="48" x2="200" y2="152" stroke="COLOR" stroke-width="10"/>' +
        '<line x1="148" y1="74" x2="252" y2="74" stroke="COLOR" stroke-width="8"/>' +
        '<polygon points="148,74 128,120 168,120" fill="none" stroke="COLOR" stroke-width="8"/>' +
        '<polygon points="252,74 232,120 272,120" fill="none" stroke="COLOR" stroke-width="8"/>' +
        '<rect x="172" y="152" width="56" height="10" rx="4" fill="COLOR"/>'
    },
    food: {
      label: "Restaurant & Food",
      tagline: "DINING \u2022 CATERING \u2022 CAF\u00c9",
      icon: '<path d="M140 132 A60 60 0 0 1 260 132 Z" fill="COLOR"/>' +
        '<rect x="128" y="132" width="144" height="12" rx="6" fill="COLOR"/>' +
        '<circle cx="200" cy="62" r="8" fill="COLOR"/>'
    },
    fitness: {
      label: "Fitness & Gym",
      tagline: "TRAINING \u2022 STRENGTH \u2022 HEALTH",
      icon: '<rect x="150" y="94" width="100" height="16" rx="8" fill="COLOR"/>' +
        '<rect x="130" y="72" width="24" height="60" rx="8" fill="COLOR"/>' +
        '<rect x="246" y="72" width="24" height="60" rx="8" fill="COLOR"/>' +
        '<rect x="106" y="82" width="18" height="40" rx="6" fill="COLOR"/>' +
        '<rect x="276" y="82" width="18" height="40" rx="6" fill="COLOR"/>'
    },
    realestate: {
      label: "Real Estate",
      tagline: "HOMES \u2022 PROPERTY \u2022 INVESTMENT",
      icon: '<polygon points="200,48 276,112 260,112 260,162 140,162 140,112 124,112" fill="COLOR"/>' +
        '<rect x="186" y="122" width="28" height="40" fill="#ffffff"/>'
    },
    healthcare: {
      label: "Healthcare",
      tagline: "CLINIC \u2022 CARE \u2022 WELLNESS",
      icon: '<rect x="140" y="62" width="120" height="120" rx="28" fill="COLOR"/>' +
        '<rect x="188" y="88" width="24" height="68" fill="#ffffff"/>' +
        '<rect x="166" y="110" width="68" height="24" fill="#ffffff"/>'
    },
    finance: {
      label: "Finance",
      tagline: "ADVISORY \u2022 BANKING \u2022 WEALTH",
      icon: '<rect x="128" y="122" width="28" height="42" fill="COLOR"/>' +
        '<rect x="166" y="102" width="28" height="62" fill="COLOR" opacity="0.78"/>' +
        '<rect x="204" y="82" width="28" height="82" fill="COLOR" opacity="0.56"/>' +
        '<rect x="242" y="62" width="28" height="102" fill="COLOR" opacity="0.36"/>' +
        '<line x1="122" y1="170" x2="280" y2="170" stroke="COLOR" stroke-width="8"/>'
    },
    beauty: {
      label: "Beauty & Salon",
      tagline: "SALON \u2022 SPA \u2022 COSMETICS",
      icon: '<ellipse cx="200" cy="118" rx="26" ry="46" fill="COLOR"/>' +
        '<ellipse cx="158" cy="130" rx="20" ry="38" fill="COLOR" opacity="0.68" transform="rotate(-28 158 130)"/>' +
        '<ellipse cx="242" cy="130" rx="20" ry="38" fill="COLOR" opacity="0.68" transform="rotate(28 242 130)"/>' +
        '<path d="M138 162 Q200 188 262 162" stroke="COLOR" stroke-width="8" fill="none" stroke-linecap="round"/>'
    },
    construction: {
      label: "Construction",
      tagline: "BUILDERS \u2022 CONTRACTORS \u2022 RENOVATION",
      icon: '<path d="M140 132 A60 56 0 0 1 260 132 L260 136 L140 136 Z" fill="COLOR"/>' +
        '<rect x="118" y="134" width="164" height="14" rx="7" fill="COLOR"/>' +
        '<rect x="192" y="58" width="16" height="46" fill="COLOR"/>'
    },
    education: {
      label: "Education",
      tagline: "SCHOOL \u2022 ACADEMY \u2022 TUTORING",
      icon: '<polygon points="200,56 286,96 200,136 114,96" fill="COLOR"/>' +
        '<polygon points="160,112 160,142 200,160 240,142 240,112 200,130" fill="COLOR" opacity="0.72"/>' +
        '<line x1="270" y1="102" x2="270" y2="142" stroke="COLOR" stroke-width="6"/>' +
        '<circle cx="270" cy="150" r="8" fill="COLOR"/>'
    }
  };

  var state = {
    industry: "tech",
    variant: "emblem",
    name: "Apex Business Co.",
    color: "#1d6fe0"
  };

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function emblemSVG(ind, name, color) {
    var icon = ind.icon.split("COLOR").join(color);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 330" width="400" height="330" role="img" aria-label="' + esc(name) + ' logo">' +
      '<rect width="400" height="330" fill="#ffffff"/>' +
      '<g>' + icon + '</g>' +
      '<text x="200" y="238" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="34" letter-spacing="1" fill="#0b2545">' + esc(name) + '</text>' +
      '<text x="200" y="272" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="14" letter-spacing="4" fill="' + esc(color) + '">' + esc(ind.tagline) + '</text>' +
      '</svg>';
  }

  function monogramSVG(ind, name, color) {
    var initial = (name.trim().charAt(0) || "A").toUpperCase();
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 330" width="400" height="330" role="img" aria-label="' + esc(name) + ' logo">' +
      '<rect width="400" height="330" fill="#ffffff"/>' +
      '<circle cx="105" cy="150" r="62" fill="' + esc(color) + '"/>' +
      '<circle cx="105" cy="150" r="52" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.7"/>' +
      '<text x="105" y="172" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="64" fill="#ffffff">' + esc(initial) + '</text>' +
      '<text x="190" y="140" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="36" fill="#0b2545">' + esc(name) + '</text>' +
      '<text x="190" y="176" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="14" letter-spacing="3" fill="' + esc(color) + '">' + esc(ind.tagline) + '</text>' +
      '<line x1="190" y1="196" x2="372" y2="196" stroke="' + esc(color) + '" stroke-width="4"/>' +
      '</svg>';
  }

  var currentSVG = "";

  function render() {
    var ind = INDUSTRIES[state.industry];
    currentSVG = state.variant === "emblem"
      ? emblemSVG(ind, state.name, state.color)
      : monogramSVG(ind, state.name, state.color);
    var preview = document.getElementById("logo-preview");
    if (preview) {
      preview.innerHTML = currentSVG;
    }
    var label = document.getElementById("template-label");
    if (label) {
      label.textContent = ind.label + " \u2014 " + (state.variant === "emblem" ? "Emblem" : "Monogram") + " style";
    }
  }

  function downloadSVG() {
    var blob = new Blob([currentSVG], { type: "image/svg+xml" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var safeName = state.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "business-logo";
    a.href = url;
    a.download = safeName + "-logo.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Industry buttons
    var grid = document.getElementById("industry-grid");
    if (grid) {
      Object.keys(INDUSTRIES).forEach(function (key) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "ind-btn" + (key === state.industry ? " active" : "");
        b.textContent = INDUSTRIES[key].label;
        b.setAttribute("data-industry", key);
        b.addEventListener("click", function () {
          state.industry = key;
          var btns = grid.querySelectorAll(".ind-btn");
          for (var i = 0; i < btns.length; i++) btns[i].classList.remove("active");
          b.classList.add("active");
          render();
        });
        grid.appendChild(b);
      });
    }

    // Variant buttons
    var variants = document.querySelectorAll("[data-variant]");
    for (var v = 0; v < variants.length; v++) {
      variants[v].addEventListener("click", function () {
        state.variant = this.getAttribute("data-variant");
        for (var k = 0; k < variants.length; k++) variants[k].classList.remove("active");
        this.classList.add("active");
        render();
      });
    }

    // Name input
    var nameInput = document.getElementById("biz-name");
    if (nameInput) {
      nameInput.value = state.name;
      nameInput.addEventListener("input", function () {
        state.name = nameInput.value.trim() === "" ? "Your Business" : nameInput.value;
        render();
      });
    }

    // Color input
    var colorInput = document.getElementById("brand-color");
    if (colorInput) {
      colorInput.value = state.color;
      colorInput.addEventListener("input", function () {
        state.color = colorInput.value;
        render();
      });
    }

    // Quick color swatches
    var swatches = document.querySelectorAll("[data-swatch]");
    for (var s = 0; s < swatches.length; s++) {
      swatches[s].addEventListener("click", function () {
        state.color = this.getAttribute("data-swatch");
        if (colorInput) colorInput.value = state.color;
        render();
      });
    }

    // Download button
    var dl = document.getElementById("download-svg");
    if (dl) {
      dl.addEventListener("click", downloadSVG);
    }

    render();
  });
})();
