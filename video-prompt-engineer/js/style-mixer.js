// VideoPromptEngineer — Style Mixer tool
(function () {
  "use strict";

  var STYLES = [
    { name: "Cinematic", desc: "photorealism, shallow depth of field, subtle film grain", blend: "cinematic photorealism, shallow depth of field, subtle film grain" },
    { name: "Cyberpunk", desc: "neon signage, rain-slicked reflections, electric haze", blend: "cyberpunk neon, glowing signage, rain-slicked reflections" },
    { name: "Ghibli Anime", desc: "hand-painted skies, lush nature, whimsical warmth", blend: "Studio Ghibli-inspired anime, hand-painted skies, whimsical warmth" },
    { name: "Film Noir", desc: "high-contrast black & white, long shadows, venetian blinds", blend: "film noir, high-contrast black and white, long dramatic shadows" },
    { name: "Vintage 16mm", desc: "warm faded colors, organic grain, nostalgic softness", blend: "vintage 16mm film, warm faded colors, organic grain" },
    { name: "Claymation", desc: "handmade stop-motion texture, tactile charm", blend: "claymation stop-motion, handmade tactile texture, playful charm" },
    { name: "Watercolor", desc: "soft washes of color, ethereal dreamlike glow", blend: "dreamlike watercolor, soft washes of color, ethereal glow" },
    { name: "Documentary", desc: "BBC-Earth realism, crisp 8K natural detail", blend: "nature-documentary realism, crisp 8K detail, natural color" },
    { name: "Oil Painting", desc: "visible brushstrokes, rich impasto, classical light", blend: "living oil painting, visible brushstrokes, rich classical light" },
    { name: "Low-Poly Game", desc: "stylized geometric shapes, vibrant game-cinematic look", blend: "low-poly game cinematic, stylized geometry, vibrant lighting" }
  ];
  var MAX_PICK = 3;

  var picked = [];

  function renderCards() {
    var grid = document.getElementById("sm-grid");
    grid.innerHTML = "";
    STYLES.forEach(function (s, i) {
      var card = document.createElement("div");
      card.className = "style-card" + (picked.indexOf(i) !== -1 ? " selected" : "");
      card.innerHTML = '<span class="check">✓</span><h4>' + s.name + "</h4><p>" + s.desc + "</p>";
      card.addEventListener("click", function () { toggle(i); });
      grid.appendChild(card);
    });
    document.getElementById("sm-count").textContent = picked.length + " / " + MAX_PICK + " selected";
  }

  function toggle(i) {
    var at = picked.indexOf(i);
    if (at !== -1) {
      picked.splice(at, 1);
    } else {
      if (picked.length >= MAX_PICK) {
        window.vpeToast("Pick max " + MAX_PICK + " styles — deselect one first");
        return;
      }
      picked.push(i);
    }
    renderCards();
  }

  function mix() {
    var subject = document.getElementById("sm-subject").value.trim();
    var action = document.getElementById("sm-action").value.trim();
    if (picked.length < 2) {
      window.vpeToast("Select 2–3 styles to mix");
      return;
    }
    if (!subject) {
      window.vpeToast("Add a subject first — e.g. 'a night market'");
      document.getElementById("sm-subject").focus();
      return;
    }
    var chosen = picked.map(function (i) { return STYLES[i]; });
    var names = chosen.map(function (s) { return s.name; });
    var blends = chosen.map(function (s) { return s.blend; });

    var prompt = window.vpeCap(subject) + (action ? " " + action : "") +
      ", rendered as a seamless fusion of " + blends.join("; ") +
      " — one cohesive scene blending " + names.join(", ") +
      " aesthetics, unified lighting, ultra-detailed, sharp focus.";

    document.getElementById("sm-result").textContent = prompt;
    document.getElementById("sm-output").style.display = "block";
    document.getElementById("sm-count2").textContent = prompt.length + " characters";
    document.getElementById("sm-output").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderCards();
    document.getElementById("sm-mix").addEventListener("click", mix);
    document.getElementById("sm-clear").addEventListener("click", function () {
      picked = [];
      renderCards();
    });
    document.getElementById("sm-copy").addEventListener("click", function () {
      window.vpeCopy(document.getElementById("sm-result").textContent);
    });
  });
})();
