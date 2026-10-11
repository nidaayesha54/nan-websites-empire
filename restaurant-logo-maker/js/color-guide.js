/* Cuisine Color Guide — palettes with click-to-copy hex codes */
(function () {
  "use strict";

  var PALETTES = [
    { id: "italian", name: "🇮🇹 Italian", note: "Warm, rustic, appetite-stimulating. Red + green echo the flag; gold adds premium trattoria feel.",
      colors: [
        ["Tomato Red", "#A31621", "Appetite, passion, urgency"],
        ["Basil Green", "#2E7D32", "Freshness, natural ingredients"],
        ["Parmesan Cream", "#F7F0DD", "Warmth, tradition, comfort"],
        ["Olive Gold", "#C9A227", "Premium, heritage"],
        ["Espresso", "#3E2723", "Grounding, sophistication"]
      ]},
    { id: "sushi", name: "🍣 Sushi / Japanese", note: "Minimal, precise, premium. Black signals luxury; red is the classic Japanese accent.",
      colors: [
        ["Sumi Black", "#1B1B1B", "Precision, luxury, minimalism"],
        ["Aka Red", "#C0392B", "Energy, tradition (hinomaru)"],
        ["Rice White", "#FFFFFF", "Purity, cleanliness"],
        ["Wasabi Green", "#7A9E43", "Fresh, distinctive accent"],
        ["Bamboo", "#D9C9A3", "Natural, calm backgrounds"]
      ]},
    { id: "cafe", name: "☕ Café / Coffeehouse", note: "Cozy and inviting. Browns trigger comfort; cream keeps it airy for long stays.",
      colors: [
        ["Coffee Bean", "#4E342E", "Warmth, comfort, craft"],
        ["Latte", "#A9744F", "Approachable, creamy"],
        ["Cream", "#FAF3E8", "Calm, spacious backgrounds"],
        ["Caramel", "#D7B98F", "Sweetness, indulgence"],
        ["Matcha", "#8A9A5B", "Modern, fresh accent"]
      ]},
    { id: "fastfood", name: "🍔 Fast Food", note: "High-energy hunger triggers. Red + yellow is the classic appetite combo that reads from the road.",
      colors: [
        ["Ketchup Red", "#E63946", "Hunger, speed, excitement"],
        ["Mustard Yellow", "#FFB703", "Cheerful, attention-grabbing"],
        ["Sesame Cream", "#FFF8E7", "Clean, readable backgrounds"],
        ["Char Black", "#232323", "Bold contrast, modern"],
        ["Pickle Green", "#6A994E", "Fresh accent, balance"]
      ]},
    { id: "mexican", name: "🌮 Mexican", note: "Fiesta energy. Saturated warm colors + turquoise feel festive and authentic.",
      colors: [
        ["Chili Red", "#C1272D", "Heat, celebration"],
        ["Marigold", "#F2A900", "Joy, festivity"],
        ["Agave Green", "#2E7D4F", "Fresh, natural"],
        ["Turquoise", "#3EB8AC", "Playful, distinctive accent"],
        ["Adobe Cream", "#F5E6C8", "Warm neutral base"]
      ]},
    { id: "indian", name: "🍛 Indian", note: "Rich and royal. Deep jewel tones + gold signal spice, celebration, and abundance.",
      colors: [
        ["Turmeric", "#E08E0B", "Warmth, spice, energy"],
        ["Chili Crimson", "#9D0208", "Depth, richness"],
        ["Royal Purple", "#5A189A", "Luxury, celebration"],
        ["Saffron Cream", "#FBEEDB", "Soft, elegant base"],
        ["Palm Green", "#386641", "Fresh, herbal accent"]
      ]},
    { id: "french", name: "🥐 French Bistro", note: "Effortless chic. Navy + cream + muted red feels Parisian without cliché.",
      colors: [
        ["Bistro Navy", "#1D3557", "Elegance, trust"],
        ["Crème", "#F8F4E8", "Light, refined base"],
        ["Bordeaux", "#7B2D26", "Wine, romance, depth"],
        ["Brass Gold", "#B08D3E", "Classic, premium detail"],
        ["Sage", "#9CAF88", "Soft, natural accent"]
      ]},
    { id: "seafood", name: "🦞 Seafood", note: "Fresh from the ocean. Deep blues + sandy neutrals + coral pop feel clean and coastal.",
      colors: [
        ["Deep Ocean", "#0F4C5C", "Trust, depth, premium"],
        ["Sea Glass", "#7FC8B8", "Fresh, coastal calm"],
        ["Sand", "#F1E3C6", "Warm neutral base"],
        ["Coral", "#E76F51", "Appetite accent, energy"],
        ["Charcoal", "#264653", "Modern contrast"]
      ]},
    { id: "steakhouse", name: "🥩 Steakhouse", note: "Bold and masculine. Dark woods, ember red, and brass = fire, craft, indulgence.",
      colors: [
        ["Ember Red", "#9D0208", "Fire, intensity, appetite"],
        ["Charred Brown", "#3A2A20", "Smoke, craft, luxury"],
        ["Brass", "#C9A227", "Premium, classic detail"],
        ["Bone Cream", "#F4EBD9", "Contrast, readability"],
        ["Smoke Gray", "#6C757D", "Modern, understated"]
      ]},
    { id: "vegan", name: "🥗 Vegan / Healthy", note: "Fresh and alive. Greens + earth tones signal health without preaching.",
      colors: [
        ["Leaf Green", "#4A7C59", "Health, nature, fresh"],
        ["Lime Zest", "#A3B86B", "Energy, modern pop"],
        ["Oat Cream", "#FAF6EC", "Clean, light base"],
        ["Terracotta", "#C67B5C", "Earthy, warm, human"],
        ["Charcoal", "#2F3E33", "Grounding contrast"]
      ]}
  ];

  function copyHex(hex, el) {
    function done() {
      var label = el.querySelector(".hex");
      if (label) {
        label.textContent = "Copied!";
        setTimeout(function () { label.textContent = hex; }, 1200);
      } else {
        var orig = el.innerHTML;
        el.innerHTML = "Copied ✓";
        setTimeout(function () { el.innerHTML = orig; }, 1200);
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(hex).then(done, done);
    } else {
      var ta = document.createElement("textarea");
      ta.value = hex;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      done();
    }
  }

  function luminance(hex) {
    var c = hex.replace("#", "");
    var r = parseInt(c.substr(0, 2), 16) / 255,
        g = parseInt(c.substr(2, 2), 16) / 255,
        b = parseInt(c.substr(4, 2), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.getElementById("paletteGrid");
    var detail = document.getElementById("paletteDetail");

    PALETTES.forEach(function (p) {
      var card = document.createElement("div");
      card.className = "palette-card";
      card.style.cursor = "pointer";
      var sw = p.colors.map(function (col) {
        return '<div class="swatch" style="background:' + col[1] + '" title="Click to copy ' + col[1] + '">' +
          '<span class="hex">' + col[1] + "</span></div>";
      }).join("");
      card.innerHTML = '<div class="pname">' + p.name + '</div><div class="swatches">' + sw + "</div>";
      card.addEventListener("click", function (e) {
        var swEl = e.target.closest ? e.target.closest(".swatch") : null;
        if (swEl) {
          var hex = swEl.querySelector(".hex").textContent;
          swEl.setAttribute("data-hex", hex);
          copyHex(hex, swEl);
          e.stopPropagation();
          return;
        }
        showDetail(p);
      });
      grid.appendChild(card);
    });

    function showDetail(p) {
      var big = p.colors.map(function (col) {
        var dark = luminance(col[1]) < 0.45;
        return '<div class="big-swatch" data-hex="' + col[1] + '" style="background:' + col[1] +
          ";color:" + (dark ? "#fff" : "#3a2a20") + ";text-shadow:" + (dark ? "0 1px 3px rgba(0,0,0,.5)" : "none") + '">' +
          col[1] + "<small>" + col[0] + " — " + col[2] + "</small></div>";
      }).join("");
      detail.innerHTML = "<h3>" + p.name + " palette</h3><p>" + p.note + "</p>" +
        '<div class="big-swatches">' + big + "</div>" +
        '<p class="hint">Click any color to copy its hex code. Pair the darkest color with the lightest for readable text.</p>';
      detail.classList.add("show");
      detail.querySelectorAll(".big-swatch").forEach(function (el) {
        el.addEventListener("click", function () { copyHex(el.getAttribute("data-hex"), el); });
      });
      detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
})();
