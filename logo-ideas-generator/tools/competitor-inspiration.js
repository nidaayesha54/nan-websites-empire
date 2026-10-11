/* Logo style analyzer quiz */
(function(){
'use strict';
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

var STYLES = {
  minimalist:{label:'Minimalist', icon:'⬜',
    desc:'Less is more. Your brand should use clean lines, generous whitespace, and one simple, memorable mark.',
    marks:['Simple geometric icon or refined wordmark','One or two colors max','Sans-serif or clean serif typography'],
    colors:'Black, white, and one muted accent (sage, slate, or sand)',
    avoid:'Avoid gradients, shadows, and clip-art detail — they fight minimalism.'},
  bold:{label:'Bold & Playful', icon:'🎈',
    desc:'Fun, friendly, unforgettable. Your brand wins with rounded shapes, bright colors, and a mascot-like energy.',
    marks:['Rounded mascot or character mark','Chunky, friendly typography','Bright, cheerful color palette'],
    colors:'Coral, sunny yellow, teal, or bubblegum pink',
    avoid:'Avoid thin lines and muted corporate grays — they drain the fun.'},
  luxury:{label:'Luxury & Elegant', icon:'💎',
    desc:'Premium positioning. Your brand should whisper quality through refined typography, metallic accents, and restraint.',
    marks:['Monogram or refined wordmark','Thin, high-contrast serif typography','Foil-friendly single-color version'],
    colors:'Black, deep navy, or charcoal + gold/champagne accent',
    avoid:'Avoid bright colors, cartoons, and more than one accent — luxury is restraint.'},
  tech:{label:'Modern Tech', icon:'⚡',
    desc:'Forward motion. Your brand needs an abstract, dynamic mark that feels digital-first and scales from favicon to billboard.',
    marks:['Abstract geometric mark','Gradient-friendly shapes','Lowercase modern wordmark'],
    colors:'Electric blue, violet, cyan — gradients welcome',
    avoid:'Avoid vintage badges and script fonts — they signal the past, not the future.'},
  organic:{label:'Organic & Handcrafted', icon:'🌿',
    desc:'Human and warm. Your brand should feel made by hand — soft forms, natural textures, honest colors.',
    marks:['Hand-drawn or soft-edged mark','Warm, slightly imperfect typography','Badge or emblem layout'],
    colors:'Earth tones: forest green, terracotta, cream, warm brown',
    avoid:'Avoid cold metallics and ultra-geometric shapes — they feel machine-made.'},
  vintage:{label:'Vintage & Trustworthy', icon:'🏛️',
    desc:'Heritage and trust. Your brand benefits from classic badge layouts, timeless typography, and nostalgic warmth.',
    marks:['Circular or shield badge','Classic serif or slab typography','Established-date detail ("EST. 2026")'],
    colors:'Deep red, cream, navy, brass/gold',
    avoid:'Avoid neon colors and ultra-modern abstract marks — they clash with heritage.'}
};

var QUESTIONS = [
 {q:'1. How should customers FEEL when they see your brand?',
  opts:[
   {t:'Calm and confident — everything is under control', s:{minimalist:2, luxury:1, tech:1}},
   {t:'Excited and happy — this looks fun!', s:{bold:2, playful:0, organic:1}},
   {t:'Impressed — this feels premium and exclusive', s:{luxury:2, minimalist:1}},
   {t:'Curious — this feels fresh and innovative', s:{tech:2, minimalist:1}},
   {t:'Warm — this feels honest and handmade', s:{organic:2, vintage:1}},
   {t:'Reassured — this business has been around and knows its stuff', s:{vintage:2, luxury:1}}]},
 {q:'2. Pick the word that best describes your business personality:',
  opts:[
   {t:'Simple and clear', s:{minimalist:2}},
   {t:'Fun and friendly', s:{bold:2}},
   {t:'Elegant and refined', s:{luxury:2}},
   {t:'Smart and cutting-edge', s:{tech:2}},
   {t:'Natural and genuine', s:{organic:2}},
   {t:'Classic and dependable', s:{vintage:2}}]},
 {q:'3. Where will your logo appear MOST?',
  opts:[
   {t:'App icon, website, and social avatars (tiny sizes!)', s:{tech:2, minimalist:1}},
   {t:'Packaging, merch, and stickers', s:{bold:2, organic:1}},
   {t:'Business cards, signage, premium print', s:{luxury:2, vintage:1}},
   {t:'Storefront, uniforms, and vehicle wraps', s:{vintage:2, bold:1}},
   {t:'Product labels and craft markets', s:{organic:2, vintage:1}},
   {t:'Everywhere — it must work at any size', s:{minimalist:2, tech:1}}]},
 {q:'4. Which color palette attracts you most?',
  opts:[
   {t:'Black, white, and one quiet accent', s:{minimalist:2, luxury:1}},
   {t:'Bright and cheerful — yellows, corals, teals', s:{bold:2}},
   {t:'Black and gold — rich and dramatic', s:{luxury:2}},
   {t:'Electric blue, violet, cyan gradients', s:{tech:2}},
   {t:'Earthy greens, browns, and creams', s:{organic:2}},
   {t:'Deep red, navy, and brass', s:{vintage:2}}]},
 {q:'5. Which famous logo style do you admire most?',
  opts:[
   {t:'Apple / Nike — one simple iconic mark', s:{minimalist:2, tech:1}},
   {t:'Mailchimp / Innocent — playful character energy', s:{bold:2}},
   {t:'Chanel / Rolex — timeless luxury monogram', s:{luxury:2}},
   {t:'Spotify / Airbnb — modern abstract mark', s:{tech:2}},
   {t:'Starbucks / craft breweries — warm badge emblem', s:{organic:1, vintage:2}},
   {t:'Harley-Davidson / Levi\u2019s — heritage badge', s:{vintage:2}}]},
 {q:'6. What matters MOST in your logo?',
  opts:[
   {t:'Instant recognition at any size', s:{minimalist:2, tech:1}},
   {t:'Making people smile', s:{bold:2, organic:1}},
   {t:'Looking expensive and exclusive', s:{luxury:2}},
   {t:'Feeling innovative and future-proof', s:{tech:2}},
   {t:'Feeling authentic and trustworthy', s:{organic:2, vintage:1}},
   {t:'Standing the test of time', s:{vintage:2, minimalist:1}}]}
];

var answers = new Array(QUESTIONS.length).fill(-1);

function renderQuiz(){
  var box = document.getElementById('quizBox');
  var html = '';
  QUESTIONS.forEach(function(Q, qi){
    html += '<div class="quiz-q" data-q="'+qi+'"><p>'+esc(Q.q)+'</p>';
    Q.opts.forEach(function(o, oi){
      html += '<label class="opt"><input type="radio" name="q'+qi+'" value="'+oi+'"> '+esc(o.t)+'</label>';
    });
    html += '</div>';
  });
  box.innerHTML = html;
  box.querySelectorAll('input[type=radio]').forEach(function(r){
    r.addEventListener('change', function(){
      var qi = parseInt(r.name.slice(1),10);
      answers[qi] = parseInt(r.value,10);
      var wrap = r.closest('.quiz-q');
      wrap.querySelectorAll('.opt').forEach(function(l){ l.classList.remove('sel'); });
      r.closest('.opt').classList.add('sel');
      updateProgress();
    });
  });
}

function updateProgress(){
  var done = answers.filter(function(a){return a>=0;}).length;
  var bar = document.getElementById('progressBar');
  bar.style.width = Math.round(done/QUESTIONS.length*100)+'%';
  document.getElementById('progressText').textContent = done+' of '+QUESTIONS.length+' answered';
  document.getElementById('quizBtn').disabled = done < QUESTIONS.length;
}

function analyze(){
  var scores = {minimalist:0,bold:0,luxury:0,tech:0,organic:0,vintage:0};
  answers.forEach(function(a, qi){
    var pts = QUESTIONS[qi].opts[a].s;
    Object.keys(pts).forEach(function(k){ if(scores[k]!==undefined) scores[k]+=pts[k]; });
  });
  var ranked = Object.keys(scores).sort(function(a,b){ return scores[b]-scores[a]; });
  var top = STYLES[ranked[0]], second = STYLES[ranked[1]];
  var total = Object.keys(scores).reduce(function(s,k){return s+scores[k];},0) || 1;
  var pct = Math.round(scores[ranked[0]]/total*100);
  var res = document.getElementById('quizResult');
  res.innerHTML =
    '<h2>Your recommended style: '+esc(top.label)+' '+top.icon+'</h2>'
    +'<div class="result-style"><p><strong>'+esc(top.desc)+'</strong></p>'
    +'<p><strong>Logo marks that fit you:</strong></p><ul>'
    + top.marks.map(function(m){return '<li>'+esc(m)+'</li>';}).join('') +'</ul>'
    +'<p><strong>Suggested palette:</strong> '+esc(top.colors)+'</p>'
    +'<p><strong>Watch out:</strong> '+esc(top.avoid)+'</p></div>'
    +'<p class="sub">Match strength: '+pct+'% · Runner-up style: <strong>'+esc(second.label)+'</strong> — blend in a touch of it for uniqueness.</p>'
    +'<div class="btnrow" style="justify-content:flex-start">'
    +'<a class="btn" href="idea-generator.html">Generate '+esc(top.label)+' concepts</a> '
    +'<a class="btn ghost" href="color-psychology.html">Check color meanings</a></div>'
    +'<p class="sub" style="margin-top:14px"><button class="btn ghost" id="retakeBtn" type="button">Retake quiz</button></p>';
  res.classList.remove('hidden');
  document.getElementById('retakeBtn').addEventListener('click', function(){
    answers = new Array(QUESTIONS.length).fill(-1);
    res.classList.add('hidden');
    renderQuiz(); updateProgress();
    document.getElementById('quizBox').scrollIntoView({behavior:'smooth'});
  });
  res.scrollIntoView({behavior:'smooth'});
}

document.addEventListener('DOMContentLoaded', function(){
  renderQuiz(); updateProgress();
  document.getElementById('quizBtn').addEventListener('click', analyze);
});
})();
