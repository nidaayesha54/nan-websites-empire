
const RECOMMEND = [
  {platforms:["tiktok","reels"], moods:["dramatic","funny","cinematic"], subjects:["person","product","pet","text"],
   title:"Zoom Punch + Speed Ramp", why:"Snap-zooms in the first 2 seconds reset viewer attention — the highest-retention combo for short-form.", how:"Place a zoom punch on the beat drop, then speed-ramp the payoff moment."},
  {platforms:["tiktok","reels","shorts"], moods:["funny","dramatic"], subjects:["person","pet","product"],
   title:"Glitch Transition", why:"RGB-split glitches signal a scene change instantly and read as 'edited by a pro' on mobile.", how:"Cut on the glitch peak; keep it under 0.4s so it feels snappy, not messy."},
  {platforms:["reels","shorts","youtube"], moods:["aesthetic","emotional"], subjects:["landscape","person","pet"],
   title:"AI Slow Motion", why:"Frame-interpolated slow-mo stretches the emotional beat — viewers watch to the end to feel the payoff.", how:"Ramp into 50% speed at the peak moment; add soft grain for a filmic feel."},
  {platforms:["tiktok","reels","shorts","youtube"], moods:["cinematic","dramatic","emotional"], subjects:["landscape","person","product"],
   title:"Neon Glow Relight", why:"AI relighting turns flat footage cinematic — ideal for night shots, products and music.", how:"Apply glow first, then grade; keep skin tones natural if people are in frame."},
  {platforms:["tiktok","reels"], moods:["funny","dramatic","cinematic"], subjects:["product","person","text"],
   title:"Morph / Before-After", why:"Seamless morphs are the engine of transformation content — the format with the highest share rate.", how:"Match framing between the two states; let the AI handle the melt, you handle the timing."},
  {platforms:["youtube","shorts"], moods:["aesthetic","emotional","cinematic"], subjects:["landscape","pet","person"],
   title:"Film Grain + Light Leaks", why:"Vintage texture signals authenticity and slows the scroll for viewers tired of hyper-polished edits.", how:"Subtle grain (10–15%) plus one light leak on transitions."},
  {platforms:["reels","tiktok"], moods:["aesthetic","funny"], subjects:["text","product","person"],
   title:"Kinetic Text + Pop-ins", why:"Animated captions keep sound-off viewers engaged — 80%+ of short-form is watched muted.", how:"Big bold captions, word-by-word reveal, pop-in on keywords."}
];
const state = {platform:null, mood:null, subject:null};
function pick(group, value){
  state[group]=value;
  document.querySelectorAll('[data-group="'+group+'"]').forEach(function(el){
    el.classList.toggle('sel', el.getAttribute('data-value')===value);
  });
  maybeRecommend();
}
function maybeRecommend(){
  if(!(state.platform&&state.mood&&state.subject)) return;
  var scored = RECOMMEND.map(function(r){
    var s=0;
    if(r.platforms.indexOf(state.platform)>=0)s+=2;
    if(r.moods.indexOf(state.mood)>=0)s+=2;
    if(r.subjects.indexOf(state.subject)>=0)s+=1;
    return {r:r,s:s};
  }).sort(function(a,b){return b.s-a.s;}).slice(0,3);
  var box=document.getElementById('quiz-result');
  var html='<h3>🎬 Recommended effects for you</h3>';
  scored.forEach(function(x,i){
    html+='<div class="result-card" style="margin-top:14px"><h3>'+(i+1)+'. '+x.r.title+'</h3><p><b>Why it works:</b> '+x.r.why+'</p><p><b>How to use it:</b> '+x.r.how+'</p></div>';
  });
  html+='<div class="copy-row"><a class="btn btn-ghost" href="effect-prompt-generator.html">Generate a prompt for these →</a> <a class="btn btn-ghost" href="../guides/best-ai-video-effects-2026.html">Read the full effects guide →</a></div>';
  box.innerHTML=html; box.style.display='block';
  box.scrollIntoView({behavior:'smooth',block:'start'});
}
function resetQuiz(){
  state.platform=state.mood=state.subject=null;
  document.querySelectorAll('.opt').forEach(function(el){el.classList.remove('sel');});
  var box=document.getElementById('quiz-result'); box.style.display='none'; box.innerHTML='';
}
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.opt[data-group]').forEach(function(el){
    el.addEventListener('click',function(){pick(el.getAttribute('data-group'),el.getAttribute('data-value'));});
  });
  var r=document.getElementById('quiz-reset'); if(r){r.addEventListener('click',resetQuiz);}
});
