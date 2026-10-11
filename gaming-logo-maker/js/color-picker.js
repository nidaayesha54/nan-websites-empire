/* Team color scheme generator — neon palettes */
(function () {
  "use strict";

  var PALETTES = [
    { name: "Cyber Neon", colors: ["#00f0ff", "#b536ff", "#0a0e1a", "#ffffff"] },
    { name: "Toxic Strike", colors: ["#39ff6a", "#0a0e1a", "#c8ff00", "#ffffff"] },
    { name: "Magma Rage", colors: ["#ff2e2e", "#ffb52e", "#1a0a0a", "#ffffff"] },
    { name: "Void Purple", colors: ["#b536ff", "#5b1fd6", "#0d0618", "#e8dcff"] },
    { name: "Ice Storm", colors: ["#7dd8ff", "#1e6fff", "#06121f", "#ffffff"] },
    { name: "Solar Flare", colors: ["#ffb52e", "#ff2e88", "#1a0f04", "#fff3d6"] },
    { name: "Venom", colors: ["#a3ff12", "#0e2a00", "#39ff6a", "#f2ffe0"] },
    { name: "Bloodline", colors: ["#ff2e2e", "#7a0d0d", "#0f0505", "#ffd9d9"] },
    { name: "Phantom", colors: ["#8b93a7", "#3a4156", "#0a0c14", "#ffffff"] },
    { name: "Sunset Rush", colors: ["#ff7a2e", "#ff2e88", "#2e0a1e", "#ffe9d6"] },
    { name: "Aqua Volt", colors: ["#00f0ff", "#00ff9d", "#041a1a", "#e0fffa"] },
    { name: "Royal Gold", colors: ["#ffd24a", "#8a6a00", "#141004", "#fff6d8"] },
    { name: "Crimson Ops", colors: ["#ff3b5c", "#2b0a12", "#7a1030", "#ffe3ea"] },
    { name: "Ghost Mint", colors: ["#7dffd4", "#123b32", "#00c896", "#eafff7"] },
    { name: "Pixel Party", colors: ["#ff2e88", "#00f0ff", "#b536ff", "#0a0e1a"] },
    { name: "Desert Fox", colors: ["#e0a458", "#6b4a1e", "#17100a", "#f7ead2"] },
    { name: "Night Hunter", colors: ["#2e3bff", "#0a0e2a", "#00f0ff", "#dfe4ff"] },
    { name: "Cherry Bomb", colors: ["#ff2e88", "#7a0d38", "#1c0712", "#ffd6e7"] }
  ];

  var NEON_POOL = ["#00f0ff", "#b536ff", "#ff2e88", "#39ff6a", "#ffb52e", "#7dd8ff", "#ff2e2e", "#c8ff00", "#00ff9d", "#ffd24a", "#ff7a2e", "#a3ff12"];

  function render(list) {
    var grid = document.getElementById("paletteGrid");
    if (!grid) return;
    grid.innerHTML = "";
    list.forEach(function (p) {
      var card = document.createElement("div");
      card.className = "scheme";
      card.title = "Click to copy hex codes";
      var sw = document.createElement("div");
      sw.className = "sw";
      p.colors.forEach(function (hex) {
        var d = document.createElement("div");
        d.style.background = hex;
        sw.appendChild(d);
      });
      var nm = document.createElement("div");
      nm.className = "nm";
      var label = document.createElement("span");
      label.textContent = p.name;
      var small = document.createElement("small");
      small.textContent = "copy";
      nm.appendChild(label);
      nm.appendChild(small);
      card.appendChild(sw);
      card.appendChild(nm);
      card.addEventListener("click", function () {
        var text = p.name + ": " + p.colors.join(", ");
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text);
        }
        label.textContent = "Copied!";
        setTimeout(function () { label.textContent = p.name; }, 900);
      });
      grid.appendChild(card);
    });
  }

  function randomPalettes(n) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var pool = NEON_POOL.slice();
      var colors = [];
      for (var k = 0; k < 3; k++) {
        colors.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
      }
      colors.push("#0a0e1a");
      out.push({ name: "Custom #" + (i + 1), colors: colors });
    }
    return out;
  }

  function init() {
    render(PALETTES);
    var btn = document.getElementById("shufflePalettesBtn");
    if (btn) btn.addEventListener("click", function () { render(randomPalettes(12)); });
    var all = document.getElementById("allPalettesBtn");
    if (all) all.addEventListener("click", function () { render(PALETTES); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
