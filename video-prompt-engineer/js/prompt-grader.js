// VideoPromptEngineer — Prompt Grader tool
(function () {
  "use strict";

  var CAMERA_WORDS = ["shot", "camera", "dolly", "dolly in", "dolly out", "pan", "pan up",
    "pan down", "tilt", "tilt up", "tilt down", "zoom", "zoom in", "zoom out",
    "aerial", "aerial shot", "drone", "drone shot", "orbit", "tracking",
    "tracking shot", "close-up", "closeup", "extreme close-up", "wide shot",
    "medium shot", "establishing shot", "crane", "handheld", "macro", "angle",
    "low angle", "high angle", "dutch angle", "overhead", "pov", "timelapse",
    "time-lapse", "slow motion", "slow-motion", "push in", "pull back",
    "flyover", "sweep", "static", "rack focus"];
  var STYLE_WORDS = ["cinematic", "photoreal", "photo-realistic", "anime", "pixar",
    "3d", "cyberpunk", "noir", "vintage", "film", "watercolor", "hyperreal", "8k",
    "documentary", "claymation", "oil painting", "ghibli", "style", "render",
    "unreal engine", "stop-motion", "stop motion", "low-poly", "cartoon",
    "realistic", "realism", "photography", "pixar-style", "anime-style"];
  var MOTION_WORDS = ["walk", "run", "fly", "flow", "spin", "dance", "move", "glide",
    "drift", "rise", "fall", "swirl", "wave", "turn", "explode", "morph", "push",
    "pull", "rotate", "bounce", "slide", "chase", "swim", "sail", "bloom",
    "melt", "billow", "splash", "ripple", "crash", "shine", "flicker", "race",
    "march", "float", "soar", "dive", "emerge", "gallop", "tumble", "cascade",
    "sail", "pour", "stream", "rush", "hover", "stroll", "leap", "plunge"];
  var LIGHT_WORDS = ["light", "lighting", "sunlight", "golden hour", "neon", "shadow",
    "glow", "moonlit", "backlit", "rim light", "studio", "candlelit", "overcast",
    "sunset", "sunrise", "night", "dusk", "dawn", "volumetric", "god rays",
    "lantern", "torchlight", "bioluminescent", "sun", "lit", "dark", "bright",
    "lens flare", "chiaroscuro", "silhouette", "halo"];
  var DETAIL_WORDS = ["red", "blue", "green", "golden", "silver", "crimson", "azure",
    "emerald", "amber", "rust", "ivory", "onyx", "scarlet", "teal", "violet",
    "wooden", "metallic", "glass", "silk", "leather", "stone", "misty", "foggy",
    "tiny", "giant", "ancient", "futuristic", "weathered", "glowing", "shimmering",
    "cracked", "ornate", "minimalist", "intricate", "delicate", "massive",
    "baby", "young", "old", "small", "large", "little", "soft", "sharp", "smooth",
    "rough", "wet", "tall", "deep", "thick", "warm", "fierce", "gentle", "wild",
    "lonely", "crowded", "towering", "endless", "velvet", "neon-lit"];

  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  function countMatches(text, words) {
    var found = [];
    words.forEach(function (w) {
      var re = new RegExp("\\b" + escRe(w) + "\\w*");
      if (re.test(text) && found.indexOf(w) === -1) found.push(w);
    });
    return found;
  }

  function band(n, thresholds, scores) {
    for (var i = 0; i < thresholds.length; i++) {
      if (n >= thresholds[i]) return scores[i];
    }
    return scores[scores.length - 1];
  }

  function grade(total) {
    if (total >= 90) return "A";
    if (total >= 75) return "B";
    if (total >= 60) return "C";
    if (total >= 40) return "D";
    return "F";
  }

  function analyze() {
    var raw = document.getElementById("pg-input").value.trim();
    if (raw.length < 5) {
      window.vpeToast("Paste a prompt first (at least a few words)");
      return;
    }
    var text = " " + raw.toLowerCase() + " ";
    var wordCount = raw.split(/\s+/).length;

    // Specificity (25)
    var detailHits = countMatches(text, DETAIL_WORDS);
    var specBase = band(wordCount, [45, 25, 12], [25, 19, 12, 5]);
    var specificity = Math.min(25, specBase + Math.min(5, detailHits.length));

    // Camera (25)
    var camHits = countMatches(text, CAMERA_WORDS);
    var camera = band(camHits.length, [3, 2, 1], [25, 19, 12, 4]);

    // Style (20)
    var styleHits = countMatches(text, STYLE_WORDS);
    var style = band(styleHits.length, [3, 2, 1], [20, 16, 10, 3]);

    // Motion (15)
    var motionHits = countMatches(text, MOTION_WORDS);
    var motion = band(motionHits.length, [3, 2, 1], [15, 12, 8, 2]);

    // Lighting (15)
    var lightHits = countMatches(text, LIGHT_WORDS);
    var lighting = band(lightHits.length, [2, 1], [15, 8, 2]);

    var total = specificity + camera + style + motion + lighting;

    render(total, [
      { name: "Specificity", score: specificity, max: 25, weak: specificity < 17 },
      { name: "Camera language", score: camera, max: 25, weak: camera < 17 },
      { name: "Style", score: style, max: 20, weak: style < 14 },
      { name: "Motion", score: motion, max: 15, weak: motion < 10 },
      { name: "Lighting", score: lighting, max: 15, weak: lighting < 10 }
    ], wordCount);

    document.getElementById("pg-output").style.display = "block";
    document.getElementById("pg-output").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function render(total, cats, wordCount) {
    document.getElementById("pg-score").textContent = total;
    document.getElementById("pg-grade").textContent = "Grade " + grade(total);

    var bars = document.getElementById("pg-bars");
    bars.innerHTML = "";
    var tips = [];

    cats.forEach(function (c) {
      var pct = Math.round((c.score / c.max) * 100);
      var row = document.createElement("div");
      row.className = "bar-row";
      row.innerHTML =
        '<div class="bar-head"><span>' + c.name + '</span><span>' + c.score + "/" + c.max + "</span></div>" +
        '<div class="bar"><div class="fill" style="width:0%"></div></div>';
      bars.appendChild(row);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          row.querySelector(".fill").style.width = pct + "%";
        });
      });
    });

    if (cats[0].weak) tips.push("<b>Specificity:</b> your prompt is thin on detail (" + wordCount + " words). Add colors, materials, textures and setting — e.g. 'weathered wooden boat, teal water, morning mist'. Aim for 30–60 words.");
    if (cats[1].weak) tips.push("<b>Camera language:</b> no clear camera direction found. Add a shot and a move — e.g. 'slow dolly in', 'aerial drone sweep', 'macro close-up'. See our <a href='../guides/camera-language-ai-video.html'>camera language guide</a>.");
    if (cats[2].weak) tips.push("<b>Style:</b> the look is undefined — models guess. Name a style: 'cinematic photorealistic', 'Ghibli-inspired anime', 'vintage 16mm film'.");
    if (cats[3].weak) tips.push("<b>Motion:</b> nothing is actually moving. AI video needs a verb: walking, swirling, blooming, drifting. One strong motion verb beats three adjectives.");
    if (cats[4].weak) tips.push("<b>Lighting:</b> light is missing — and light is half the image. Add 'golden hour sunlight', 'neon city glow' or 'moonlit blue night'.");
    if (total >= 75) tips.push("<b>Strong prompt.</b> Final polish: append a negative prompt — 'extra limbs, morphing face, watermark, flicker' — to block common artifacts.");
    if (wordCount > 90) tips.push("<b>Length warning:</b> " + wordCount + " words is long. Models weigh early words most — move subject + action to the very front and trim filler.");

    var list = document.getElementById("pg-tips");
    list.innerHTML = "";
    tips.forEach(function (t) {
      var li = document.createElement("li");
      li.innerHTML = t;
      list.appendChild(li);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("pg-grade-btn").addEventListener("click", analyze);
    document.getElementById("pg-input").addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") analyze();
    });
  });
})();
