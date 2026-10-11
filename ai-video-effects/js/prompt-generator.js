
const FX = {
  "slow-mo": {
    label: "AI Slow Motion",
    base: "ultra slow-motion shot of {subject}, every detail suspended mid-air, {intensity_word} motion blur, {style}",
    tip: "Best for: action, food pours, pet moments, sports highlights."
  },
  "zoom": {
    label: "Zoom Punch",
    base: "rapid snap-zoom punch-in on {subject}, {intensity_word} push toward the focal point with subtle camera shake, {style}",
    tip: "Best for: hooks in the first 2 seconds, comedy beats, reveals."
  },
  "glitch": {
    label: "Glitch Transition",
    base: "digital glitch transition over {subject}, {intensity_word} RGB-split distortion, scanlines and pixel-sorting artifacts, {style}",
    tip: "Best for: tech, gaming, before/after transformations."
  },
  "morph": {
    label: "Morph & Warp",
    base: "seamless AI morph of {subject} transforming fluidly, {intensity_word} warp distortion melting between states, {style}",
    tip: "Best for: POV videos, product transformations, fantasy scenes."
  },
  "speed-ramp": {
    label: "Speed Ramp",
    base: "dynamic speed-ramp sequence on {subject}, time {intensity_word} stretching then snapping back to real-time, {style}",
    tip: "Best for: travel, sports, process videos."
  },
  "neon": {
    label: "Neon Glow Relight",
    base: "{subject} relit with {intensity_word} neon glow, volumetric light bloom and cinematic rim lighting, {style}",
    tip: "Best for: night footage, music videos, aesthetic edits."
  }
};
const INTENSITY = {1:"gentle, barely-there",2:"subtle",3:"subtle",4:"moderate",5:"moderate",6:"strong",7:"strong",8:"dramatic",9:"dramatic",10:"extreme, full-throttle"};
const STYLES = {"cinematic":"cinematic color grade, shallow depth of field","viral":"bold, high-contrast social-media look optimized for mobile","aesthetic":"soft, dreamy aesthetic grade, pastel tones","raw":"clean, natural look, minimal grading"};

function buildPrompt(){
  var fx = document.getElementById('fx-effect').value;
  var lvl = parseInt(document.getElementById('fx-intensity').value,10);
  var subject = (document.getElementById('fx-subject').value||'').trim() || 'your subject';
  var style = document.getElementById('fx-style').value;
  var dur = document.getElementById('fx-duration').value;
  var info = FX[fx];
  var prompt = "AI video effect — " + info.label + " (" + dur + "): " +
    info.base.replace('{subject}', subject)
             .replace('{intensity_word}', INTENSITY[lvl]||'moderate')
             .replace('{style}', STYLES[style]) + ".";
  document.getElementById('fx-output').textContent = prompt;
  document.getElementById('fx-tip').textContent = "💡 " + info.tip;
  document.getElementById('fx-result').style.display = 'block';
}
function copyPrompt(){
  var t = document.getElementById('fx-output').textContent;
  var done = function(){ var b=document.getElementById('fx-copy'); b.textContent='✓ Copied!'; setTimeout(function(){b.textContent='📋 Copy Prompt';},1800); };
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(done).catch(function(){ fallback(); }); }
  else { fallback(); }
  function fallback(){
    var ta=document.createElement('textarea'); ta.value=t; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); }catch(e){}
    document.body.removeChild(ta); done();
  }
}
document.addEventListener('DOMContentLoaded',function(){
  var r=document.getElementById('fx-intensity'), v=document.getElementById('fx-intensity-val');
  if(r&&v){ var upd=function(){v.textContent=r.value+'/10';}; r.addEventListener('input',upd); upd(); }
  var g=document.getElementById('fx-generate'); if(g){g.addEventListener('click',buildPrompt);}
  var c=document.getElementById('fx-copy'); if(c){c.addEventListener('click',copyPrompt);}
});
