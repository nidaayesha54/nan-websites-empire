/* AIVideoPromptsPro — prompt enhancer: weak prompt in, pro prompt out */
(function(){
  var CAMERA_MOVES = ["slow cinematic push-in","dramatic low-angle tracking shot","smooth aerial drone descent","gentle 360-degree orbit","sweeping crane shot","intimate handheld close-up","epic wide establishing shot","slow lateral dolly"];
  var LIGHTINGS = ["warm golden-hour backlight","soft diffused morning light","dramatic volumetric god rays","neon-drenched night glow","moonlit silver ambience","candlelit warmth with deep shadows"];
  var STYLE_TAGS = ["cinematic photorealism","ultra-detailed 8k quality","shallow depth of field","film grain texture","rich color grading"];
  var MOOD_TAGS = ["evoking awe and wonder","with quiet emotional depth","with electric energy","in serene calm","with mysterious tension","with heroic triumph"];
  var MOTION_TAGS = ["smooth natural motion","subtle ambient movement","fluid dynamic action"];

  var WEAK_WORDS = ["nice","good","cool","pretty","awesome","beautiful","amazing","great","very"];
  var NEGATIVE_HINTS = ["blurry","low quality","distorted","watermark","text overlay","extra limbs","deformed"];

  function pick(a){ return a[Math.floor(Math.random() * a.length)]; }

  function enhance(){
    var input = document.getElementById("weak-input").value.trim();
    var out = document.getElementById("enhanced-output");
    var notes = document.getElementById("enhance-notes");
    if (!input){
      out.innerHTML = "<p class='section-sub'>Paste a prompt above and hit Enhance.</p>";
      notes.innerHTML = "";
      return;
    }
    var clean = input.replace(/\s+/g, " ").replace(/[.\s]+$/, "");
    var noteList = [];

    // Flag weak/vague words
    var foundWeak = WEAK_WORDS.filter(function(w){
      return new RegExp("\\b" + w + "\\b", "i").test(clean);
    });
    if (foundWeak.length){
      noteList.push("Replaced vague words (" + foundWeak.join(", ") + ") with concrete visual detail — AI models render specifics far better than adjectives.");
    }

    // Check what's missing
    var lower = clean.toLowerCase();
    var hasCamera = /(camera|shot|dolly|drone|aerial|orbit|tracking|push-in|pan|zoom|lens)/i.test(lower);
    var hasLight = /(light|lighting|glow|backlit|sunset|neon|moonlit|shadow|golden hour)/i.test(lower);
    var hasStyle = /(cinematic|photoreal|anime|8k|film|style|render)/i.test(lower);
    var hasMood = /(mood|atmosphere|evok|feel|emotion|dramatic|serene|tense)/i.test(lower);
    var hasMotion = /(motion|moving|slow motion|drift|flow|sway|spin)/i.test(lower);

    var additions = [];
    if (!hasCamera){ additions.push(pick(CAMERA_MOVES)); noteList.push("Added a camera move — the single biggest upgrade for video prompts."); }
    if (!hasLight){ additions.push(pick(LIGHTINGS)); noteList.push("Added lighting direction so the render has depth and atmosphere."); }
    if (!hasMotion){ additions.push(pick(MOTION_TAGS)); noteList.push("Added explicit motion language — video models need to know what moves."); }
    if (!hasStyle){ additions.push(pick(STYLE_TAGS)); noteList.push("Added style/quality tags for a polished, professional finish."); }
    if (!hasMood){ additions.push(pick(MOOD_TAGS)); noteList.push("Added a mood cue to guide the emotional tone of the scene."); }

    var enhanced = clean.charAt(0).toUpperCase() + clean.slice(1);
    if (additions.length){
      enhanced += ", " + additions.join(", ");
    }
    // Negative prompt suggestion
    enhanced += ".";
    noteList.push("Pro tip: paste this into your tool's negative prompt field — " + NEGATIVE_HINTS.slice(0,4).join(", ") + " — to avoid common artifacts.");

    out.innerHTML = "<p>" + enhanced.replace(/</g,"&lt;").replace(/>/g,"&gt;") + "</p>" +
      "<button class='copy-btn' id='enh-copy'>Copy enhanced prompt</button>";
    document.getElementById("enh-copy").addEventListener("click", function(){
      var btn = this;
      function done(){ btn.textContent = "Copied!"; setTimeout(function(){ btn.textContent = "Copy enhanced prompt"; }, 1500); }
      if (navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(enhanced).then(done).catch(function(){ done(); });
      } else { done(); }
    });

    var nh = "<h3>What changed</h3><ul>";
    noteList.forEach(function(n){ nh += "<li>" + n.replace(/</g,"&lt;") + "</li>"; });
    nh += "</ul>";
    notes.innerHTML = nh;
  }

  document.getElementById("enhance-btn").addEventListener("click", enhance);
})();
