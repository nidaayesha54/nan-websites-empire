// Voice cloning tools comparison data + use-case recommender
var TOOLS = [
  {id:"elevenlabs", name:"ElevenLabs", price:"Free tier; paid from ~$5/mo (Starter), Creator ~$22/mo", minAudio:"Instant: ~1 min · Professional: 30+ min", consent:"Identity verification + consent statement required for Professional Voice Cloning; AI-generated disclosure guidance", langs:"32+ languages", best:["podcast","audiobook","creator","dubbing"], blurb:"Industry leader for naturalness. Instant cloning for quick tests, professional cloning for studio-quality voices."},
  {id:"resemble", name:"Resemble AI", price:"Pay-as-you-go ~$0.006/sec; Creator plans from ~$19/mo", minAudio:"~10 min for custom voices; rapid cloning from short clips", consent:"Consent verification workflow; deepfake detection API offered", langs:"60+ languages", best:["enterprise","game","agent"], blurb:"Enterprise-focused with strong API, real-time voice agents, and a deepfake detection tool built in."},
  {id:"descript", name:"Descript Overdub", price:"Included in Creator plan ~$24/mo (annual)", minAudio:"~10 min training script", consent:"Must record a scripted consent statement; speaker verification", langs:"English-focused", best:["podcast","video","creator"], blurb:"Built for podcasters and video editors — fix flubbed lines by typing. Only clones voices with verified consent."},
  {id:"playai", name:"PlayAI (Play.ht)", price:"Free trial; Creator from ~$31/mo (annual)", minAudio:"A few minutes for instant clone", consent:"Consent attestation during voice creation; usage policies against misuse", langs:"140+ languages", best:["audiobook","enterprise","agent"], blurb:"Huge language coverage and strong conversational AI voice agents; solid for global audiobook and support use."}
];

var USECASES = {
  podcast:{label:"🎙️ Podcast / narration (my own voice)", picks:["descript","elevenlabs"], why:"Descript Overdub lets you fix mistakes by typing; ElevenLabs gives the most natural long-form narration."},
  audiobook:{label:"📚 Audiobook production", picks:["elevenlabs","playai"], why:"ElevenLabs for expressiveness, PlayAI for 140+ language versions of the same book."},
  creator:{label:"🎬 Creator content (YouTube/TikTok voiceovers)", picks:["elevenlabs","descript"], why:"ElevenLabs instant clones are fast and natural; Descript is perfect if you edit video too."},
  game:{label:"🎮 Games / character voices", picks:["resemble","elevenlabs"], why:"Resemble's API and real-time pipeline suit games; ElevenLabs excels at expressive character work."},
  agent:{label:"🤖 AI voice agents / customer support", picks:["playai","resemble"], why:"PlayAI and Resemble lead on real-time conversational voices with low latency."},
  enterprise:{label:"🏢 Enterprise / dubbing at scale", picks:["resemble","elevenlabs"], why:"Both offer team controls, APIs, and consent/verification workflows enterprises require."},
  dubbing:{label:"🌍 Video dubbing / localization", picks:["elevenlabs","playai"], why:"ElevenLabs dubbing studio and PlayAI's language coverage make localization easy."},
  video:{label:"🎥 Video editing (fix spoken mistakes)", picks:["descript"], why:"Descript Overdub is purpose-built for this — edit audio like a text document."}
};

function toolById(id){ return TOOLS.find(function(t){return t.id===id;}); }

document.addEventListener('DOMContentLoaded',function(){
  var tbody=document.getElementById('compareBody');
  if(tbody){
    tbody.innerHTML = TOOLS.map(function(t){
      return '<tr data-tool="'+t.id+'"><td><strong>'+t.name+'</strong></td><td>'+t.price+'</td><td>'+t.minAudio+'</td><td>'+t.consent+'</td><td>'+t.langs+'</td><td>'+t.blurb+'</td></tr>';
    }).join('');
  }
  var chips=document.querySelectorAll('#usecasechips .chip');
  var out=document.getElementById('recommenderOut');
  function render(uc){
    var u=USECASES[uc];
    var rows=document.querySelectorAll('#compareBody tr');
    rows.forEach(function(r){ r.classList.toggle('hl-row', u.picks.indexOf(r.dataset.tool)>-1); });
    var html='<h3>Best picks for: '+u.label+'</h3><p>'+u.why+'</p><div class="cards">';
    u.picks.forEach(function(id){
      var t=toolById(id);
      html+='<div class="card"><h3>'+t.name+'</h3><p>'+t.blurb+'</p><p style="font-size:.85rem">Starting price: '+t.price+'</p></div>';
    });
    html+='</div><p style="font-size:.85rem;color:var(--muted)">Pricing changes — confirm on each provider\'s official site. Always verify their current consent requirements before cloning any voice.</p>';
    out.innerHTML=html;
  }
  if(chips.length){
    chips.forEach(function(c){
      c.addEventListener('click',function(){
        chips.forEach(function(x){x.classList.remove('active');});
        c.classList.add('active');
        render(c.dataset.uc);
      });
    });
    chips[0].click();
  }
});
