// VideoPromptEngineer — Prompt Builder tool
(function () {
  "use strict";

  var CAMERAS = [
    "static wide shot", "slow dolly in", "slow dolly out", "aerial drone sweep",
    "orbit around the subject", "smooth tracking shot", "crane shot rising upward",
    "low-angle tilt up", "handheld camera with subtle shake", "macro close-up",
    "whip pan transition", "timelapse", "slow motion at 120fps", "POV shot"
  ];
  var LIGHTING = [
    "golden hour sunlight", "neon city glow", "soft studio lighting",
    "moonlit blue night", "dramatic rim lighting", "overcast diffused light",
    "candlelit warm interior", "sunset backlight", "volumetric god rays",
    "bioluminescent glow", "harsh midday sun", "stormy overcast sky"
  ];
  var STYLES = [
    "cinematic photorealistic", "Pixar-style 3D animation",
    "Studio Ghibli-inspired anime", "cyberpunk neon", "documentary realism",
    "vintage 16mm film", "dreamlike watercolor", "film noir black and white",
    "hyperreal 8K nature documentary", "claymation stop-motion",
    "oil painting come to life", "low-poly game cinematic"
  ];
  var MOODS = [
    "epic", "peaceful", "mysterious", "joyful", "melancholic",
    "energetic", "romantic", "tense", "nostalgic", "surreal"
  ];

  function fillSelect(id, items) {
    var sel = document.getElementById(id);
    items.forEach(function (item) {
      var o = document.createElement("option");
      o.value = item;
      o.textContent = window.vpeCap(item);
      sel.appendChild(o);
    });
  }

  function getVal(id) {
    return document.getElementById(id).value.trim();
  }

  function buildPrompt() {
    var subject = getVal("pb-subject");
    var action = getVal("pb-action");
    var camera = getVal("pb-camera");
    var lighting = getVal("pb-lighting");
    var style = getVal("pb-style");
    var mood = getVal("pb-mood");
    var negative = getVal("pb-negative");

    if (!subject) {
      window.vpeToast("Add a subject first — e.g. 'a tiny dragon'");
      document.getElementById("pb-subject").focus();
      return;
    }

    var head = window.vpeCap(camera) + ": " + subject + (action ? " " + action : "") + ".";
    var mid = window.vpeCap(lighting) + ". " + window.vpeCap(mood) + " atmosphere.";
    var tail = "Rendered in " + style + " style, ultra-detailed, sharp focus.";
    var prompt = head + " " + mid + " " + tail;

    var out = prompt;
    if (negative) out += "\n\nNegative prompt: " + negative;

    var resultEl = document.getElementById("pb-result");
    resultEl.textContent = out;
    document.getElementById("pb-output").style.display = "block";
    document.getElementById("pb-count").textContent = out.length + " characters · " + out.split(/\s+/).length + " words";
    document.getElementById("pb-output").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function randomize() {
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    var subjects = [
      "a tiny baby dragon", "an elderly fisherman", "a futuristic courier robot",
      "a Bengal tiger", "a lighthouse keeper", "a street food vendor in Bangkok",
      "a glowing jellyfish swarm", "a medieval knight", "a curious red panda",
      "an astronaut farmer"
    ];
    var actions = [
      "walking through a neon-lit rainy alley", "dancing under falling cherry blossoms",
      "flying over a misty mountain valley at dawn", "cooking over an open fire on a beach",
      "running across a sunlit wheat field", "exploring an ancient overgrown temple",
      "swimming through a coral reef", "standing on a cliff as waves crash below"
    ];
    document.getElementById("pb-subject").value = pick(subjects);
    document.getElementById("pb-action").value = pick(actions);
    document.getElementById("pb-camera").value = pick(CAMERAS);
    document.getElementById("pb-lighting").value = pick(LIGHTING);
    document.getElementById("pb-style").value = pick(STYLES);
    document.getElementById("pb-mood").value = pick(MOODS);
    buildPrompt();
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillSelect("pb-camera", CAMERAS);
    fillSelect("pb-lighting", LIGHTING);
    fillSelect("pb-style", STYLES);
    fillSelect("pb-mood", MOODS);
    document.getElementById("pb-build").addEventListener("click", buildPrompt);
    document.getElementById("pb-random").addEventListener("click", randomize);
    document.getElementById("pb-copy").addEventListener("click", function () {
      window.vpeCopy(document.getElementById("pb-result").textContent);
    });
  });
})();
