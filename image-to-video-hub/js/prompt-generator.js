"use strict";
var DATA = {
  subjects: {
    "Portrait / Person": { motion: ["Subtle smile and head turn", "Hair flowing in breeze", "Slow blink and breathing", "Walking toward camera", "Looking around curiously"], motionDetail: "natural human facial movement" },
    "Animal / Pet": { motion: ["Head tilt and ear twitch", "Running playfully", "Tail wagging", "Slow dramatic walk", "Yawning and stretching"], motionDetail: "lifelike animal movement" },
    "Landscape / Nature": { motion: ["Clouds drifting slowly", "Water flowing / waves", "Leaves rustling in wind", "Birds flying across sky", "Fog rolling in"], motionDetail: "gentle environmental motion" },
    "Product": { motion: ["Slow 360-degree rotation", "Floating and spinning", "Ingredients exploding outward", "Glint of light sweeping across", "Assembling piece by piece"], motionDetail: "smooth commercial product motion" },
    "City / Building": { motion: ["Traffic light trails", "People walking in timelapse", "Day-to-night transition", "Rain falling", "Neon lights flickering"], motionDetail: "urban ambient motion" },
    "Fantasy / Art": { motion: ["Magic particles swirling", "Glowing runes pulsing", "Portal shimmering", "Elements bending around subject", "Slow ethereal float"], motionDetail: "cinematic magical motion" }
  },
  cameras: ["Static, no camera move", "Slow push-in (dolly in)", "Slow pull-out (dolly out)", "Orbit / rotate around subject", "Pan left to right", "Handheld, subtle shake", "Drone-like rise up"],
  moods: ["Bright & cheerful daylight", "Warm golden hour glow", "Moody cinematic blue", "Soft dreamy blur", "Dramatic storm light", "Neon night vibes"],
  styles: ["Photorealistic", "Cinematic film look", "Anime style", "3D Pixar-style render", "Oil painting come alive", "Retro 80s film"]
};

var sel = { subject: null, motion: null, camera: null, mood: null, style: null };

function chipRow(containerId, items, key, single) {
  var el = document.getElementById(containerId);
  el.innerHTML = "";
  items.forEach(function (item) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (sel[key] === item ? " active" : "");
    b.textContent = item;
    b.onclick = function () {
      sel[key] = (sel[key] === item && single) ? null : item;
      if (key === "subject") { sel.motion = null; chipRow("motionRow", DATA.subjects[sel.subject].motion, "motion", true); }
      chipRow(containerId, items, key, single);
      buildPrompt();
    };
    el.appendChild(b);
  });
}

function init() {
  chipRow("subjectRow", Object.keys(DATA.subjects), "subject", true);
  chipRow("cameraRow", DATA.cameras, "camera", true);
  chipRow("moodRow", DATA.moods, "mood", true);
  chipRow("styleRow", DATA.styles, "style", true);
  chipRow("motionRow", [], "motion", true);
}

function buildPrompt() {
  var out = document.getElementById("promptOut");
  var custom = document.getElementById("customDetail").value.trim();
  var parts = [];
  if (sel.subject) parts.push("Subject: " + sel.subject + ".");
  if (sel.motion) parts.push("Motion: " + sel.motion + " with " + DATA.subjects[sel.subject].motionDetail + ".");
  if (sel.camera) parts.push("Camera: " + sel.camera + ".");
  if (sel.mood) parts.push("Lighting/mood: " + sel.mood + ".");
  if (sel.style) parts.push("Style: " + sel.style + ".");
  if (custom) parts.push("Extra detail: " + custom + ".");
  var prompt = parts.length ? parts.join(" ") : "Select a subject, motion, camera move, mood and style above to build your prompt.";
  out.textContent = prompt;
  return prompt;
}

function copyPrompt() {
  var text = buildPrompt();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () { toast("Prompt copied! Paste it into your image-to-video tool."); });
  } else {
    var ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast("Prompt copied!"); } catch (e) { toast("Copy failed — select the text manually."); }
    document.body.removeChild(ta);
  }
}

function surprise() {
  var subs = Object.keys(DATA.subjects);
  sel.subject = subs[Math.floor(Math.random() * subs.length)];
  sel.motion = DATA.subjects[sel.subject].motion[Math.floor(Math.random() * DATA.subjects[sel.subject].motion.length)];
  sel.camera = DATA.cameras[Math.floor(Math.random() * DATA.cameras.length)];
  sel.mood = DATA.moods[Math.floor(Math.random() * DATA.moods.length)];
  sel.style = DATA.styles[Math.floor(Math.random() * DATA.styles.length)];
  chipRow("subjectRow", subs, "subject", true);
  chipRow("motionRow", DATA.subjects[sel.subject].motion, "motion", true);
  chipRow("cameraRow", DATA.cameras, "camera", true);
  chipRow("moodRow", DATA.moods, "mood", true);
  chipRow("styleRow", DATA.styles, "style", true);
  buildPrompt();
}

function toast(msg) {
  var t = document.getElementById("toast");
  t.textContent = msg; t.style.display = "block";
  setTimeout(function () { t.style.display = "none"; }, 2600);
}

document.addEventListener("DOMContentLoaded", function () {
  init();
  document.getElementById("genBtn").addEventListener("click", buildPrompt);
  document.getElementById("copyBtn").addEventListener("click", copyPrompt);
  document.getElementById("surpriseBtn").addEventListener("click", surprise);
  document.getElementById("customDetail").addEventListener("input", buildPrompt);
});
