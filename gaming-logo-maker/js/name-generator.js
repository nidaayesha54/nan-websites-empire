/* Gamer name / esports tag generator */
(function () {
  "use strict";

  var BANK = {
    aggressive: {
      pre: ["Shadow", "Venom", "Rage", "Blood", "Doom", "Fang", "Havoc", "Reaper", "Storm", "Blaze", "Savage", "Fury", "Vandal", "Riot", "Claw", "Viper"],
      suf: ["King", "Slayer", "Hunter", "Strike", "Breaker", "Reign", "Fang", "Storm", "Rage", "Wolf", "Blade", "Hound"],
      tag: ["xX", "TTV", "OG", "Faze", "iG"]
    },
    cool: {
      pre: ["Nova", "Zen", "Pulse", "Ghost", "Flux", "Onyx", "Vortex", "Echo", "Frost", "Pixel", "Nebula", "Drift", "Lunar", "Cipher", "Aero", "Mirage"],
      suf: ["Prime", "Zero", "Wave", "Mind", "Byte", "Soul", "Rider", "Scope", "Shift", "Nova", "Fox", "Ops"],
      tag: ["gg", "HQ", "TV", "FX", "NX"]
    },
    funny: {
      pre: ["Noodle", "Potato", "Waffle", "Chicken", "Pickle", "Derpy", "Meme", "Wobble", "Nugget", "Soggy", "Tofu", "Biscuit", "Pancake", "Donut", "Gravy", "Tater"],
      suf: ["Lord", "Ninja", "Pants", "Wizard", "Bandit", "Goblin", "Gremlin", "Pirate", "Squire", "Dude", "Boss", "Noob"],
      tag: ["lol", "xD", "gg", "ez", "owo"]
    }
  };

  var state = { style: "aggressive" };

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function makeName(style) {
    var b = BANK[style];
    var mode = Math.floor(Math.random() * 4);
    var base;
    if (mode === 0) base = pick(b.pre) + pick(b.suf);
    else if (mode === 1) base = pick(b.pre) + "_" + pick(b.suf);
    else if (mode === 2) base = pick(b.pre) + Math.floor(Math.random() * 99);
    else base = pick(b.tag) + "_" + pick(b.pre) + pick(b.suf);
    if (Math.random() < 0.25) base = "xX" + base + "Xx";
    return base;
  }

  function generate() {
    var grid = document.getElementById("nameGrid");
    if (!grid) return;
    grid.innerHTML = "";
    var seen = {};
    var out = 0, guard = 0;
    while (out < 24 && guard < 200) {
      guard++;
      var n = makeName(state.style);
      if (seen[n]) continue;
      seen[n] = true;
      var d = document.createElement("div");
      d.className = "name";
      d.textContent = n;
      d.title = "Click to copy";
      d.addEventListener("click", function () {
        var t = this.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(t).then(function () { flash(this); }.bind(this));
        } else { flash(this); }
        function flash(el) {
          var old = el.textContent;
          el.textContent = "Copied!";
          setTimeout(function () { el.textContent = old; }, 900);
        }
      });
      grid.appendChild(d);
      out++;
    }
  }

  function init() {
    var c = document.getElementById("nameStyleOpts");
    if (c) {
      var opts = c.querySelectorAll(".opt");
      for (var i = 0; i < opts.length; i++) {
        (function (el) {
          el.addEventListener("click", function () {
            for (var j = 0; j < opts.length; j++) opts[j].classList.remove("active");
            el.classList.add("active");
            state.style = el.getAttribute("data-val");
            generate();
          });
        })(opts[i]);
      }
    }
    var btn = document.getElementById("genNamesBtn");
    if (btn) btn.addEventListener("click", generate);
    generate();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
