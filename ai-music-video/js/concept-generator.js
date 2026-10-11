/* AI Music Video Concept Generator */
const GENRES = {
  "pop":        { name:"Pop",        palette:"Hot pink, electric violet, chrome silver", setting:"Neon-drenched city rooftop at golden hour turning to night", style:"Glossy, high-fashion editorial look with clean VFX" },
  "hip-hop":    { name:"Hip-Hop",    palette:"Gold, deep purple, midnight black", setting:"Luxury penthouse, lowrider street, or desert at dusk", style:"Slow-mo flex shots, confident wide angles, film-grain warmth" },
  "rock":       { name:"Rock",       palette:"Blood red, charcoal, smoke grey", setting:"Abandoned warehouse / rain-soaked stage", style:"Gritty handheld energy, strobe cuts, anamorphic flares" },
  "edm":        { name:"EDM / Electronic", palette:"Cyan, magenta, laser green", setting:"Massive festival stage / cyber club / digital void", style:"Audio-reactive visuals, strobing light architecture" },
  "lofi":       { name:"Lo-Fi",      palette:"Warm amber, dusty rose, soft teal", setting:"Cozy bedroom studio / rainy Tokyo alley", style:"Soft film grain, gentle drift, anime-tinged nostalgia" },
  "rnb":        { name:"R&B",        palette:"Champagne gold, velvet maroon, candlelight amber", setting:"Intimate lounge / moonlit balcony", style:"Silky slow motion, intimate close-ups, velvet bokeh" },
  "country":    { name:"Country",    palette:"Sunset orange, denim blue, wheat gold", setting:"Open highway, barn, prairie at magic hour", style:"Warm natural light, sweeping drone vistas" },
  "metal":      { name:"Metal",      palette:"Charcoal black, ember orange, ash white", setting:"Volcanic wasteland / cathedral ruins", style:"Aggressive rapid cuts, dramatic scale, fire and smoke" },
  "kpop":       { name:"K-Pop",      palette:"Pastel pink, sky blue, holographic silver", setting:"Hyper-stylized studio sets with rotating stages", style:"Precision choreography framing, hyper-clean sync cuts" },
  "jazz":       { name:"Jazz",       palette:"Brass gold, deep teal, smoky noir", setting:"Dim speakeasy / midnight jazz club", style:"Moody noir cinematography, slow push-ins" },
  "latin":      { name:"Latin / Reggaetón", palette:"Tropical coral, turquoise, sunset magenta", setting:"Beach party / vibrant old-town street", style:"Sun-soaked movement, rhythmic whip-pans, joyful crowds" },
  "indie":      { name:"Indie",      palette:"Faded film tones, sage green, dusty blue", setting:"Small-town Americana / foggy coastline", style:"16mm film aesthetic, authentic imperfection" }
};
const MOODS = {
  "euphoric":   { name:"Euphoric",   lighting:"Explosive color washes, lens flares, confetti light", camera:"Sweeping crane moves, spinning 360s, euphoric slow-mo", energy:"Maximum energy — everything moves, glows, and lifts" },
  "melancholic":{ name:"Melancholic",lighting:"Soft desaturated tones, window light, rain reflections", camera:"Lingering static frames, slow dolly-outs, lonely wide shots", energy:"Slow, heavy, introspective — space between moments" },
  "dark":       { name:"Dark",       lighting:"Hard contrast, deep shadows, single-source practicals", camera:"Low angles, creeping Steadicam, sudden whip cuts", energy:"Tense and brooding — danger just off-frame" },
  "romantic":   { name:"Romantic",   lighting:"Golden candlelight, fairy lights, soft bloom", camera:"Intimate close-ups, gentle orbits, soft rack focus", energy:"Tender and magnetic — two-person gravity" },
  "rebellious": { name:"Rebellious", lighting:"Harsh neons, graffiti glow, police-light reds and blues", camera:"Shaky handheld, Dutch angles, smash cuts", energy:"Defiant chaos — rules visibly broken" },
  "nostalgic":  { name:"Nostalgic",  lighting:"Faded VHS warmth, sun-bleed, polaroid tones", camera:"Home-video wobble, zooms, freeze-frame memories", energy:"Bittersweet time-travel — the past feels present" },
  "futuristic": { name:"Futuristic", lighting:"Holographic UI glow, chrome reflections, void blacks", camera:"Impossible drone paths, seamless morph transitions", energy:"Otherworldly precision — the future is now" },
  "dreamy":     { name:"Dreamy",     lighting:"Pastel diffusion, floating particles, underwater softness", camera:"Weightless floating moves, soft dissolves, mirrored worlds", energy:"Hypnotic drift — logic dissolves into feeling" }
};
const TWISTS = [
  "a masked dancer who mirrors the artist's every move with a 2-second delay",
  "the entire world freezing mid-motion while the artist keeps singing",
  "a giant moon that follows the artist from scene to scene",
  "lyrics physically materializing as 3D objects in the environment",
  "the artist aging and de-aging between verses",
  "a storm that reacts to the kick drum — lightning on every drop",
  "crowd of mannequins that come alive only during the chorus",
  "the set rebuilding itself in reverse during the bridge"
];
const AI_PROMPT_TIPS = [
  "Describe camera movement first, subject second, lighting last.",
  "Lock a style suffix on every prompt (e.g. 'anamorphic, film grain, 24fps cinematic').",
  "Generate a character reference sheet first, reuse it in every scene for consistency.",
  "Keep clips 4–8 seconds each — stitch in edit, never ask AI for a full 3-minute take.",
  "Use image-to-video from a keyframe for hero shots instead of pure text-to-video."
];
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
function generateConcept(){
  var g = document.getElementById('genre').value;
  var m = document.getElementById('mood').value;
  var G = GENRES[g], M = MOODS[m];
  var shots = [
    "OPENING — Extreme wide establishing shot of the setting; slow push-in as the first beat drops. (" + M.camera.split(',')[0] + ")",
    "HOOK SHOT — Artist close-up with signature lighting (" + M.lighting.split(',')[0] + "); hold 3 seconds, the frame everyone screenshots.",
    "VERSE 1 — " + M.energy.split('—')[0].trim() + " performance sequence; cut on every snare.",
    "PRE-CHORUS — Tension build: " + M.camera.split(',')[1].trim() + " as lights dim to a single source.",
    "CHORUS — Full spectacle: widest shot of the video, maximum color (" + G.palette.split(',')[0] + " dominant), energy peaks.",
    "VERSE 2 — Variation: same location, new angle and wardrobe shift; keeps the algorithm watching.",
    "BRIDGE — Stripped-back moment: " + M.lighting.split(',')[1].trim() + ", artist alone, emotional core of the video.",
    "FINAL CHORUS — Everything at 110%: faster cuts, bigger scale, the twist pays off.",
    "OUTRO — Freeze or slow fade on the hook shot composition; end-card ready."
  ];
  var html = "<h3>🎨 Visual Concept — " + G.name + " × " + M.name + "</h3>";
  html += "<ul><li><strong>Palette:</strong> " + G.palette + "</li>";
  html += "<li><strong>Setting:</strong> " + G.setting + "</li>";
  html += "<li><strong>Art direction:</strong> " + G.style + "</li>";
  html += "<li><strong>Lighting:</strong> " + M.lighting + "</li>";
  html += "<li><strong>Camera language:</strong> " + M.camera + "</li>";
  html += "<li><strong>Signature twist:</strong> " + pick(TWISTS) + "</li></ul>";
  html += "<h3>🎞️ Shot List (9 shots)</h3><ul>";
  shots.forEach(function(s,i){ html += "<li><strong>Shot " + (i+1) + ":</strong> " + s + "</li>"; });
  html += "</ul><h3>🤖 AI Prompt Tips</h3><ul>";
  AI_PROMPT_TIPS.forEach(function(t){ html += "<li>" + t + "</li>"; });
  html += "</ul>";
  document.getElementById('conceptResult').innerHTML = html;
}
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('genBtn');
  if (btn) btn.addEventListener('click', generateConcept);
});
