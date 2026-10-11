/* AI Voice Picker: 5-question quiz -> voice style recommendation */
document.addEventListener('DOMContentLoaded', function(){
  var form = $('vpForm');
  if(!form) return;
  form.addEventListener('submit', function(e){ e.preventDefault(); recommend(); });
});

var ARCHETYPES = {
  warm: { name:'The Warm Conversationalist',
    tagline:'Friendly, relatable, like a smart friend',
    desc:'A natural, mid-range voice with gentle ups and downs — the default winner for lifestyle, self-improvement, parenting, and interview shows. Listeners describe it as "easy to trust."',
    settings:'Rate 0.95–1.0 · Pitch neutral · Pauses: short breaths between ideas · Warmth/style setting at medium-high' },
  authority: { name:'The Trusted Authority',
    tagline:'Confident, clear, credible',
    desc:'A steady, well-enunciated voice with minimal vocal fry — ideal for business, finance, news, and educational shows where credibility is the product.',
    settings:'Rate 1.0–1.05 · Pitch slightly low · Pauses: crisp, deliberate · Keep emotion subtle and even' },
  energetic: { name:'The High-Energy Entertainer',
    tagline:'Upbeat, youthful, full of momentum',
    desc:'A bright, fast-moving voice with big intonation swings — built for comedy, sports, pop culture, and daily shows that need to grab attention in the first 10 seconds.',
    settings:'Rate 1.05–1.15 · Pitch slightly high · Pauses: minimal · Energy/style setting at high' },
  storyteller: { name:'The Cinematic Storyteller',
    tagline:'Deep, dramatic, magnetic',
    desc:'A rich, lower-register voice that leans into pacing and pauses — perfect for true crime, mystery, history, and narrative fiction where atmosphere carries the episode.',
    settings:'Rate 0.9–0.95 · Pitch low · Pauses: long and dramatic · Use whisper/emphasis on key lines' },
  calm: { name:'The Calm Guide',
    tagline:'Soothing, steady, reassuring',
    desc:'A soft, unhurried voice with even pacing — the right pick for meditation, sleep stories, wellness, and kids & family shows where the listener needs to relax.',
    settings:'Rate 0.85–0.92 · Pitch neutral-low · Pauses: generous · Keep volume dynamics gentle' }
};

/* each answer adds points to archetypes */
var QUESTIONS = ['tone','audience','genre','pace','persona'];
var WEIGHTS = {
  tone: {
    warm:{warm:3,calm:1}, professional:{authority:3,warm:1},
    energetic:{energetic:3,storyteller:1}, calm:{calm:3,warm:1}
  },
  audience: {
    teens:{energetic:2,warm:1}, pros:{authority:3,warm:1},
    general:{warm:2,storyteller:1}, family:{calm:2,warm:2}
  },
  genre: {
    truecrime:{storyteller:3,authority:1}, business:{authority:3,storyteller:1},
    comedy:{energetic:3,warm:1}, education:{authority:2,warm:2,calm:1}, fiction:{storyteller:3,calm:1}
  },
  pace: {
    fast:{energetic:3,authority:1}, steady:{warm:2,authority:2}, slow:{calm:3,storyteller:2}
  },
  persona: {
    solo:{warm:2,authority:1}, cohost:{energetic:2,warm:2}, narrator:{storyteller:3,calm:1}
  }
};

function recommend(){
  var box = $('vpResults');
  var scores = {warm:0, authority:0, energetic:0, storyteller:0, calm:0};
  for(var i=0;i<QUESTIONS.length;i++){
    var q = QUESTIONS[i];
    var sel = document.querySelector('input[name='+q+']:checked');
    if(!sel){ setError('vpResults', 'Please answer all 5 questions, then see your recommendation.'); return; }
    var w = WEIGHTS[q][sel.value] || {};
    for(var k in w){ scores[k] += w[k]; }
  }
  var ranked = Object.keys(scores).sort(function(a,b){ return scores[b]-scores[a]; });
  var top = ARCHETYPES[ranked[0]], second = ARCHETYPES[ranked[1]];

  var htmlOut = '<div class="result-hero"><div class="lbl">Your recommended voice style</div><div class="big">' + esc(top.name) + '</div>' +
    '<div class="lbl">' + esc(top.tagline) + '</div></div>' +
    '<div class="voice-card"><h3>' + esc(top.name) + '</h3><div class="tagline">' + esc(top.tagline) + '</div>' +
    '<p>' + esc(top.desc) + '</p>' +
    '<div class="stat-row"><span class="k">Recommended settings</span><span class="v">' + esc(top.settings) + '</span></div>' +
    '<div class="stat-row"><span class="k">Where to find it</span><span class="v">ElevenLabs, PlayHT, Murf &amp; Speechify all offer this style — search their voice libraries for these traits.</span></div></div>' +
    '<div class="verdict good">Runner-up: <strong>' + esc(second.name) + '</strong> — ' + esc(second.tagline) + '. Worth A/B testing against your top pick.</div>' +
    '<p><a class="btn btn-small btn-primary" href="tts-demo.html">Preview a voice in the TTS demo &rarr;</a></p>';
  box.innerHTML = htmlOut;
  box.scrollIntoView({behavior:'smooth', block:'start'});
}
