// AIReelsMaker — 30-Second Reel Script Writer
(function(){
"use strict";
var HOOKS = {
  "Question": ["Still struggling with {t}? Watch this.", "Why is nobody talking about {t}?", "What if everything you knew about {t} was wrong?"],
  "Shocking stat": ["92% of people get {t} wrong. Here's the fix.", "This {t} trick takes 10 seconds and changes everything.", "Nobody tells you this about {t}."],
  "Bold claim": ["Stop doing {t} like this.", "This is the only {t} advice you need in 2026.", "I tried every {t} hack so you don't have to."],
  "Story": ["I failed at {t} for a year — then this happened.", "Day 1 vs day 30 of fixing {t}.", "Nobody believed me about {t} until I showed proof."],
  "List": ["3 {t} mistakes killing your results.", "5 {t} tips that actually work.", "The 3-step {t} formula — save this."]
};
var BODIES = [
  ["Name the pain (0:03–0:10)", "Call out the exact problem your viewer has with {t}. Be specific — vague pain doesn't stop thumbs."],
  ["Reveal the shift (0:10–0:20)", "Give the ONE insight, method, or twist that solves it. Show, don't lecture — demo it on camera."],
  ["Prove it fast (0:20–0:28)", "Drop quick proof: a result, a before/after, a stat, or a reaction. Proof is what earns the share."]
];
var CTAS = [
  "Follow for daily {t} tips that actually work.",
  "Comment \"{w}\" and I'll send you the full breakdown.",
  "Save this — you'll need it later. Follow for part 2.",
  "Share this with someone who needs {t} help.",
  "Tap follow — new {t} hack every single day."
];
function seed(str){ var h=0; for(var i=0;i<str.length;i++){ h=(h*31+str.charCodeAt(i))>>>0; } return h; }
function pick(arr, s){ return arr[s % arr.length]; }
function esc(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function write(){
  var topic = (document.getElementById("topic").value || "your niche topic").trim();
  var niche = document.getElementById("niche").value;
  var hookStyle = document.getElementById("hookstyle").value;
  var tone = document.getElementById("tone").value;
  var s = seed(topic + niche + hookStyle + tone);
  var hook = pick(HOOKS[hookStyle], s).replace(/\{t\}/g, topic);
  var cta = pick(CTAS, s+2).replace(/\{t\}/g, topic).replace(/\{w\}/g, topic.split(" ")[0].toUpperCase());

  var toneNote = {
    "Funny": "Keep it playful — punchlines land better than lectures. Meme captions on screen double retention.",
    "Serious": "Keep it authoritative — short sentences, confident delivery, minimal fluff.",
    "Educational": "Teach one clear thing — define the term once, then show the example.",
    "Inspirational": "Speak to the viewer's future self — emotion first, method second."
  }[tone];

  var html = '<h3 style="margin:18px 0 6px">🎬 Your 30-second script — "'+esc(topic)+'"</h3>';
  html += '<div class="note"><strong>Tone:</strong> '+esc(toneNote)+'</div>';

  html += '<div class="script-block"><span class="time">0:00 – 0:03 · THE HOOK</span><h4>Say this first (on-screen text too)</h4><p><strong>"'+esc(hook)+'"</strong></p>';
  html += '<button class="copy" onclick="copyText(\''+jsq(hook)+'\', this)">Copy hook</button></div>';

  html += '<div class="script-block"><span class="time">0:03 – 0:28 · THE BODY</span>';
  BODIES.forEach(function(b, i){
    var label = b[0].replace(/\{t\}/g, topic), desc = b[1].replace(/\{t\}/g, topic);
    html += '<h4>'+(i+1)+'. '+esc(label)+'</h4><p>'+esc(desc)+'</p>';
  });
  html += '</div>';

  html += '<div class="script-block"><span class="time">0:28 – 0:30 · THE CTA</span><h4>End with one clear ask</h4><p><strong>"'+esc(cta)+'"</strong></p>';
  html += '<button class="copy" onclick="copyText(\''+jsq(cta)+'\', this)">Copy CTA</button></div>';

  var full = "HOOK (0:00-0:03): "+hook+"\nBODY (0:03-0:28): 1) Name the pain 2) Reveal the shift 3) Prove it fast\nCTA (0:28-0:30): "+cta;
  html += '<button class="go" onclick="copyText(\''+jsq(full)+'\', this)">📋 Copy full script</button>';
  document.getElementById("results").innerHTML = html;
}
function jsq(s){ return s.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n"); }
window.writeScript = write;
})();
