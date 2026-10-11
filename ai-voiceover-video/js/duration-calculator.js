// Script → audio duration estimator (client-side)
(function(){
"use strict";
function fmt(sec){sec=Math.round(sec);var m=Math.floor(sec/60),s=sec%60;return m+":"+("0"+s).slice(-2);}
function calc(){
  var text=document.getElementById("in").value||"";
  var wpm=parseInt(document.getElementById("wpm").value,10)||150;
  var pauseSent=parseFloat(document.getElementById("psent").value)||0.4;
  var pausePara=parseFloat(document.getElementById("ppara").value)||1.0;
  var words=text.trim().split(/\s+/).filter(Boolean).length;
  var sents=(text.match(/[.!?…]+/g)||[]).length;
  var paras=text.split(/\n\s*\n/).filter(function(p){return p.trim().length;}).length;
  var speakSec=words>0?(words/wpm)*60:0;
  var total=speakSec+sents*pauseSent+Math.max(0,paras-1)*pausePara;
  var el=document.getElementById("results");
  el.innerHTML=
    "<div class='stat'>"+
    "<div><b>"+words+"</b>words</div>"+
    "<div><b>"+sents+"</b>sentences</div>"+
    "<div><b>"+paras+"</b>paragraphs</div>"+
    "<div><b>"+fmt(speakSec)+"</b>speech only</div>"+
    "<div><b>"+fmt(total)+"</b>with pauses</div>"+
    "</div>"+
    "<p style='color:var(--mut);margin-top:12px;font-size:.92rem'>"+
    "Tip: YouTube Shorts need under 0:59 · TikTok sweet spot 0:21–0:34 · YouTube mid-roll videos aim 8:00+. "+
    "Paste your script into our <a href='script-optimizer.html'>Script Optimizer</a> first so the word count matches what the AI will actually read.</p>";
  el.style.display="block";
  document.getElementById("wpmVal").textContent=wpm+" wpm";
}
document.addEventListener("DOMContentLoaded",function(){
  var wpm=document.getElementById("wpm");if(!wpm)return;
  wpm.addEventListener("input",function(){document.getElementById("wpmVal").textContent=wpm.value+" wpm";});
  document.getElementById("go").addEventListener("click",calc);
});
})();
