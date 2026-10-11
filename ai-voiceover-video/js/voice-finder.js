// AI Voice Finder quiz — scored recommendations (client-side)
(function(){
"use strict";
var TOOLS=[
 {name:"ElevenLabs",price:"Free plan · $5–$99/mo",langs:["english","spanish","multilingual","urdu","hindi"],
  tones:["professional","conversational","calm","energetic"],budget:["free","low","mid","enterprise"],
  use:["youtube","audiobook","podcast","ads"],
  desc:"Most realistic AI voices in 2026. Voice cloning, 30+ languages, studio-quality output. Free tier: 10k chars/mo."},
 {name:"Murf AI",price:"Free plan · $19–$99/mo",langs:["english","spanish","multilingual"],
  tones:["professional","conversational","calm"],budget:["free","low","mid","enterprise"],
  use:["youtube","ads","podcast"],
  desc:"120+ voices, great for corporate/YouTube narration. Built-in video editor and voice changer."},
 {name:"Play.ht",price:"Free plan · $39–$99/mo",langs:["english","multilingual","urdu","hindi","spanish"],
  tones:["professional","conversational","energetic","calm"],budget:["free","low","mid"],
  use:["youtube","podcast","audiobook","ads"],
  desc:"800+ voices in 130+ languages. Strong Urdu/Hindi support. WordPress + podcast publishing built in."},
 {name:"CapCut Text-to-Speech",price:"100% Free",langs:["english","multilingual","urdu","hindi","spanish"],
  tones:["conversational","energetic","calm"],budget:["free"],
  use:["youtube","ads"],
  desc:"Free unlimited TTS inside CapCut — perfect for shorts/Reels creators on a $0 budget. Decent quality."},
 {name:"Speechify",price:"Free plan · $11.58/mo",langs:["english","multilingual","spanish"],
  tones:["conversational","calm"],budget:["free","low"],
  use:["audiobook","podcast","youtube"],
  desc:"60+ languages, great reading app + studio. Affordable yearly plan, easy voiceovers for beginners."},
 {name:"WellSaid Labs",price:"$49–$99/mo",langs:["english"],
  tones:["professional","calm"],budget:["mid","enterprise"],
  use:["ads","youtube","podcast"],
  desc:"Enterprise-grade studio voices, avatar + API. Best for agencies needing consistent brand voices."},
 {name:"Lovo AI (Genny)",price:"Free plan · $24–$48/mo",langs:["english","multilingual","spanish"],
  tones:["professional","energetic","conversational"],budget:["free","low","mid"],
  use:["ads","youtube","podcast"],
  desc:"500+ voices, 100 languages, AI writer + image gen bundled. Strong pick for ad creatives."},
 {name:"Resemble AI",price:"$0.006/sec · custom",langs:["english","multilingual"],
  tones:["professional","conversational"],budget:["mid","enterprise"],
  use:["ads","podcast","youtube"],
  desc:"Real-time voice cloning API. For developers and teams building voice products at scale."},
 {name:"Microsoft Azure TTS",price:"Pay-as-you-go · free tier",langs:["english","multilingual","urdu","hindi","spanish"],
  tones:["professional","calm","conversational"],budget:["free","low","mid","enterprise"],
  use:["podcast","youtube","audiobook"],
  desc:"Neural voices in 140+ languages, SSML control. Cheap at scale, rock-solid reliability."}
];
var QUESTIONS=[
 {key:"lang",q:"Which language will you voice over in?",opts:["English","Urdu / Hindi","Spanish","Multilingual (several languages)"],
  vals:["english","urdu","spanish","multilingual"]},
 {key:"tone",q:"What tone fits your content?",opts:["Professional / Corporate","Conversational / Friendly","Energetic / Hype","Calm / Storytelling"],
  vals:["professional","conversational","energetic","calm"]},
 {key:"budget",q:"What's your monthly budget?",opts:["Free only ($0)","Under $25/mo","$25–$100/mo","Enterprise / API scale"],
  vals:["free","low","mid","enterprise"]},
 {key:"use",q:"What will you use it for?",opts:["YouTube videos","Ads / Marketing","Audiobooks","Podcasts"],
  vals:["youtube","ads","audiobook","podcast"]}
];
var answers={};
function render(){
  var box=document.getElementById("quiz");if(!box)return;
  box.innerHTML="";
  QUESTIONS.forEach(function(Q,i){
    var d=document.createElement("div");d.className="quizq";
    d.innerHTML="<h3>"+(i+1)+". "+Q.q+"</h3>";
    var o=document.createElement("div");o.className="opts";
    Q.opts.forEach(function(label,j){
      var b=document.createElement("button");b.type="button";b.textContent=label;
      if(answers[Q.key]===Q.vals[j])b.className="sel";
      b.onclick=function(){
        answers[Q.key]=Q.vals[j];
        render();showResults();
      };
      o.appendChild(b);
    });
    d.appendChild(o);box.appendChild(d);
  });
}
function showResults(){
  var res=document.getElementById("results");
  var done=QUESTIONS.every(function(Q){return answers[Q.key];});
  if(!done){res.innerHTML="<p style='color:var(--mut)'>Answer all 4 questions to get your personalized recommendations.</p>";return;}
  var scored=TOOLS.map(function(t){
    var s=0;
    if(t.langs.indexOf(answers.lang)>-1)s+=3;
    if(answers.lang==="urdu"&&t.langs.indexOf("hindi")>-1&&t.langs.indexOf("urdu")===-1)s+=3;
    if(t.tones.indexOf(answers.tone)>-1)s+=2;
    if(t.budget.indexOf(answers.budget)>-1)s+=2;
    if(t.use.indexOf(answers.use)>-1)s+=2;
    return {t:t,s:s};
  }).sort(function(a,b){return b.s-a.s;}).slice(0,3);
  var html="<h2 style='margin-bottom:14px'>Your top 3 matches</h2>";
  scored.forEach(function(r,i){
    html+="<div class='result-card'><h3>#"+(i+1)+" — "+r.t.name+"</h3>"+
      "<p><b style='color:#fff'>"+r.t.price+"</b></p><p>"+r.t.desc+"</p></div>";
  });
  html+="<p style='color:var(--mut);font-size:.9rem;margin-top:10px'>Prices checked Oct 2026 — always verify current pricing on the vendor's site.</p>";
  res.innerHTML=html;
}
document.addEventListener("DOMContentLoaded",function(){render();showResults();});
})();
