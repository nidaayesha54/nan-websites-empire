/* AIVideoPromptsPro — prompt randomizer with style dice */
(function(){
  var SUBJECTS = [
    "a lone lighthouse keeper", "a cyberpunk street vendor", "a baby dragon", "an elderly astronaut",
    "a fox spirit", "a deep-sea diver", "a medieval blacksmith", "a robot barista",
    "a desert nomad", "a mermaid queen", "a time-traveling chef", "a giant tortoise",
    "a neon samurai", "a cloud whale", "a clockwork owl", "a storm chaser",
    "a tiny knight", "an ice sculptor", "a jungle explorer", "a space botanist",
    "a vintage pilot", "a lava golem", "a moon rabbit", "a street magician"
  ];
  var ACTIONS = [
    "discovering a glowing portal", "dancing in slow motion", "racing against a storm",
    "building something impossible", "sharing a meal with a stranger", "chasing a runaway balloon",
    "waking up a sleeping giant", "painting the sky", "diving into crystal water",
    "climbing toward the light", "conducting an orchestra of birds", "unwrapping a mysterious gift",
    "surfing a sand dune", "lighting a thousand lanterns", "freezing time for one breath",
    "crossing a bridge of clouds"
  ];
  var CAMERAS = [
    "slow aerial drone descent", "dramatic low-angle tracking shot", "intimate handheld close-up",
    "smooth 360-degree orbit", "sweeping crane shot", "FPV dive through the scene",
    "slow push-in", "epic wide establishing shot", "over-the-shoulder follow",
    "macro lens glide", "hyperlapse rush", "gentle lateral dolly"
  ];
  var LIGHTING = [
    "golden hour backlight", "neon-drenched night glow", "soft diffused morning light",
    "dramatic chiaroscuro shadows", "bioluminescent blue ambience", "candlelit warmth",
    "storm-grey diffused light", "lens-flaring sunset", "moonlit silver glow", "volumetric god rays"
  ];
  var STYLES = [
    "cinematic photorealism", "Studio-Ghibli-inspired anime", "vintage 35mm film look",
    "hyper-detailed 3D render", "dreamy watercolor aesthetic", "noir high-contrast",
    "vibrant Pixar-like animation", "epic fantasy realism", "minimalist Scandinavian",
    "retro synthwave", "documentary naturalism", "baroque oil-painting style"
  ];
  var MOODS = [
    "awe and wonder", "quiet melancholy", "electric excitement", "cozy warmth",
    "epic triumph", "mysterious tension", "playful mischief", "serene calm",
    "romantic longing", "heroic determination", "whimsical delight", "haunting beauty"
  ];
  var SETTINGS = [
    "in a floating sky-city", "beneath the ocean surface", "on a rain-soaked rooftop",
    "inside an ancient temple", "across endless desert dunes", "in a neon night market",
    "above the clouds at dawn", "within a glowing forest", "on a cliff above the sea",
    "in a abandoned grand ballroom", "through a bustling spaceport", "inside a giant library"
  ];

  var dice = {
    subject: SUBJECTS, action: ACTIONS, camera: CAMERAS,
    lighting: LIGHTING, style: STYLES, mood: MOODS, setting: SETTINGS
  };
  var locks = {};
  var current = {};

  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

  function rollAll(){
    Object.keys(dice).forEach(function(k){
      if (!locks[k]) current[k] = pick(dice[k]);
    });
    renderDice();
    buildPrompt();
  }

  function renderDice(){
    var wrap = document.getElementById("dice");
    wrap.innerHTML = "";
    var labels = {subject:"Subject", action:"Action", camera:"Camera Move", lighting:"Lighting", style:"Style", mood:"Mood", setting:"Setting"};
    Object.keys(dice).forEach(function(k){
      var d = document.createElement("div");
      d.className = "die" + (locks[k] ? " locked" : "");
      d.innerHTML = "<span class='die-label'>" + labels[k] + "</span>" +
        "<span class='die-value'>" + (current[k] || "—") + "</span>" +
        "<button class='die-lock' data-k='" + k + "'>" + (locks[k] ? "Unlock" : "Lock") + "</button>";
      wrap.appendChild(d);
    });
    var lockBtns = wrap.querySelectorAll(".die-lock");
    for (var i = 0; i < lockBtns.length; i++){
      lockBtns[i].addEventListener("click", function(){
        var k = this.getAttribute("data-k");
        locks[k] = !locks[k];
        renderDice();
      });
    }
  }

  function buildPrompt(){
    var out = document.getElementById("random-output");
    var text = "Cinematic AI video prompt: " + current.subject + " " + current.action + " " +
      current.setting + ". Shot as a " + current.camera + ", lit with " + current.lighting +
      ", rendered in " + current.style + ", evoking " + current.mood + ". Ultra-detailed, smooth motion, professional quality.";
    out.innerHTML = "<p>" + text.replace(/</g,"&lt;") + "</p>" +
      "<button class='copy-btn' id='rand-copy'>Copy prompt</button>";
    document.getElementById("rand-copy").addEventListener("click", function(){
      var btn = this;
      function done(){
        btn.textContent = "Copied!";
        setTimeout(function(){ btn.textContent = "Copy prompt"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(done).catch(function(){ done(); });
      } else { done(); }
    });
  }

  document.getElementById("roll-btn").addEventListener("click", rollAll);
  rollAll();
})();
