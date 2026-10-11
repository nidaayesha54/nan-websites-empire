/* Logo Idea Generator engine — client-side, no network needed */
(function(){
'use strict';

var INDUSTRIES = {
  restaurant:  {label:'Restaurant / Food', icons:['flame','leaf','cup','star','badge'], names:['Sizzle','Forkful','Golden','Saffron','Ember','Tasty'], suffix:['Bites','Kitchen','Table','Eats','House','Co.']},
  tech:        {label:'Tech / Startup', icons:['bolt','hex','wave','badge','geo'], names:['Nexo','Pixel','Quantum','Cloud','Synth','Volt'], suffix:['Labs','ly','OS','Stack','Works','Hub']},
  fitness:     {label:'Fitness / Gym', icons:['bolt','flame','mountain','badge','heart'], names:['Iron','Pulse','Apex','Forge','Vital','Peak'], suffix:['Fit','Gym',' Athletics','Club','Lab','Fuel']},
  realestate:  {label:'Real Estate', icons:['house','mountain','badge','geo','star'], names:['Keystone','Haven','Corner','Landmark','Terra','Prime'], suffix:['Homes','Estates','Realty','Properties','Living','Group']},
  beauty:      {label:'Beauty / Salon', icons:['leaf','heart','star','wave','badge'], names:['Glow','Velvet','Lumi','Petal','Blush','Aura'], suffix:['Beauty','Studio','Glow','Salon','Co.','Atelier']},
  law:         {label:'Law Firm', icons:['badge','hex','mountain','star','geo'], names:['Sterling','Justice','Meridian','Apex','Counsel','Veritas'], suffix:['Law','Legal','& Partners','Associates','Group','LLP']},
  pets:        {label:'Pets / Veterinary', icons:['paw','heart','leaf','badge','star'], names:['Pawsome','Furry','Waggy','Whisker','Bark','Snout'], suffix:['Pets','Vet','Pals','Care','Co.','Haven']},
  coffee:      {label:'Coffee / Cafe', icons:['cup','flame','leaf','wave','badge'], names:['Brew','Roast','Daily','Amber','Mellow','Crema'], suffix:['Coffee','Cafe','Roasters','House','Brew Co.','Cup']},
  fashion:     {label:'Fashion / Boutique', icons:['star','heart','badge','wave','hex'], names:['Vogueish','Chic','Muse','Thread','Atelier','Moda'], suffix:['Style','Boutique','Wear','Label','House','Co.']},
  healthcare:  {label:'Healthcare / Clinic', icons:['heart','badge','wave','leaf','hex'], names:['Vital','Cura','Mend','Halo','Remedy','Nova'], suffix:['Care','Health','Clinic','Med','Wellness','Plus']}
};

var STYLES = {
  minimalist: {label:'Minimalist', desc:'clean lines, generous whitespace, one simple mark', palettes:[['#111827','#6b7280'],['#0f766e','#a7f3d0'],['#1e3a8a','#93c5fd']]},
  bold:       {label:'Bold & Modern', desc:'heavy weight, high contrast, confident geometry', palettes:[['#dc2626','#111827'],['#f97316','#1e293b'],['#7c3aed','#facc15']]},
  playful:    {label:'Playful', desc:'rounded shapes, friendly curves, cheerful energy', palettes:[['#f59e0b','#ef4444'],['#22c55e','#facc15'],['#ec4899','#8b5cf6']]},
  luxury:     {label:'Luxury / Premium', desc:'refined serif feel, gold accents, understated elegance', palettes:[['#0f0f0f','#d4af37'],['#1c1917','#e7c873'],['#312e81','#c0a062']]},
  vintage:    {label:'Vintage / Retro', desc:'badge layouts, classic typography, nostalgic warmth', palettes:[['#7c2d12','#eab308'],['#1f2937','#d6a45c'],['#3f3f46','#a16207']]},
  techy:      {label:'Tech / Futuristic', desc:'gradient-friendly, abstract marks, forward motion', palettes:[['#0ea5e9','#6366f1'],['#22d3ee','#a855f7'],['#10b981','#3b82f6']]},
  organic:    {label:'Organic / Handmade', desc:'natural textures, soft forms, human warmth', palettes:[['#166534','#a3e635'],['#92400e','#fbbf24'],['#0d9488','#fde68a']]}
};

function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* --- SVG mockup builder --- */
function svgMark(icon, c1, c2, initial){
  var L = '<text x="50" y="68" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="42" fill="'+c2+'">'+esc(initial)+'</text>';
  var shapes = {
    badge:   '<circle cx="50" cy="50" r="44" fill="'+c1+'"/><circle cx="50" cy="50" r="34" fill="none" stroke="'+c2+'" stroke-width="3"/>'+L,
    hex:     '<polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill="'+c1+'"/>'+L,
    flame:   '<path d="M50 8 C62 26 78 34 78 58 A28 28 0 0 1 22 58 C22 40 34 34 38 22 C42 30 46 32 50 8 Z" fill="'+c1+'"/><circle cx="50" cy="62" r="10" fill="'+c2+'"/>',
    leaf:    '<path d="M50 8 C78 22 86 56 50 92 C14 56 22 22 50 8 Z" fill="'+c1+'"/><path d="M50 18 L50 84" stroke="'+c2+'" stroke-width="4"/>',
    cup:     '<path d="M28 34 h40 v28 a16 16 0 0 1 -16 16 h-8 a16 16 0 0 1 -16 -16 Z" fill="'+c1+'"/><path d="M68 40 h6 a8 8 0 0 1 0 16 h-8" fill="none" stroke="'+c1+'" stroke-width="5"/><rect x="34" y="20" width="28" height="6" rx="3" fill="'+c2+'"/>',
    star:    '<polygon points="50,8 61,38 93,38 67,57 76,88 50,69 24,88 33,57 7,38 39,38" fill="'+c1+'"/><circle cx="50" cy="52" r="12" fill="'+c2+'"/>',
    wave:    '<rect x="6" y="6" width="88" height="88" rx="20" fill="'+c1+'"/><path d="M6 55 q22 -18 44 0 t44 0 v45 h-88 Z" fill="'+c2+'" opacity="0.85"/>',
    bolt:    '<polygon points="56,6 24,56 46,56 40,94 76,42 52,42" fill="'+c1+'"/><circle cx="50" cy="50" r="44" fill="none" stroke="'+c2+'" stroke-width="4"/>',
    paw:     '<ellipse cx="50" cy="62" rx="16" ry="13" fill="'+c1+'"/><circle cx="32" cy="42" r="8" fill="'+c1+'"/><circle cx="50" cy="34" r="8" fill="'+c1+'"/><circle cx="68" cy="42" r="8" fill="'+c1+'"/><circle cx="50" cy="62" r="5" fill="'+c2+'"/>',
    house:   '<polygon points="50,10 90,44 82,44 82,86 18,86 18,44 10,44" fill="'+c1+'"/><rect x="42" y="58" width="16" height="28" fill="'+c2+'"/>',
    heart:   '<path d="M50 84 C20 60 10 40 18 28 C26 16 42 18 50 30 C58 18 74 16 82 28 C90 40 80 60 50 84 Z" fill="'+c1+'"/><circle cx="50" cy="46" r="9" fill="'+c2+'"/>',
    mountain:'<polygon points="6,86 38,30 56,58 68,42 94,86" fill="'+c1+'"/><circle cx="72" cy="26" r="10" fill="'+c2+'"/>',
    geo:     '<rect x="6" y="6" width="88" height="88" rx="44" fill="'+c1+'"/><polygon points="50,28 72,50 50,72 28,50" fill="'+c2+'"/>'
  };
  var body = shapes[icon] || shapes.badge;
  return '<svg viewBox="0 0 100 100" width="104" height="104" role="img" aria-label="Logo mockup">'+body+'</svg>';
}

function conceptName(ind){
  var n = rand(ind.names) + ' ' + rand(ind.suffix);
  return n.replace(/\s+/g,' ').trim();
}

function buildConcept(ind, styleKey){
  var st = STYLES[styleKey];
  var icon = rand(ind.icons);
  var pal = rand(st.palettes);
  var name = conceptName(ind);
  var initial = name.replace(/[^A-Za-z]/g,'').charAt(0).toUpperCase() || 'L';
  var descMap = {
    badge:'A circular badge mark — the brand initial sits centered inside a double-ring emblem, ideal for packaging, signage, and social avatars.',
    hex:'A hexagonal emblem containing the brand initial — structured and modern, reads well at favicon size.',
    flame:'A stylized flame mark in brand colors — energetic and memorable, great for appetite or passion-driven brands.',
    leaf:'An abstract leaf mark — natural, calming, and versatile for eco-friendly or wellness positioning.',
    cup:'A minimal cup silhouette mark — instantly communicates the product, friendly and approachable.',
    star:'A bold star mark — confident and aspirational, pairs with strong wordmark typography.',
    wave:'A rounded-square app-style icon with a flowing wave — modern, digital-first, and friendly.',
    bolt:'A lightning-bolt mark inside a ring — speed, energy, and forward momentum in one glyph.',
    paw:'A friendly paw mark — warm and instantly recognizable for any pet-related brand.',
    house:'A geometric house mark with a doorway cutout — trust and shelter communicated in seconds.',
    heart:'A heart mark with a contrasting core — care, warmth, and human connection.',
    mountain:'A mountain-peak mark with a sun — ambition, stability, and reaching higher.',
    geo:'A geometric diamond-in-circle mark — balance and precision with a premium feel.'
  };
  return {
    name:name,
    icon:icon,
    desc:descMap[icon] || descMap.badge,
    styleDesc:st.desc,
    c1:pal[0], c2:pal[1],
    svg:svgMark(icon, pal[0], pal[1], initial),
    initial:initial
  };
}

function render(){
  var indKey = document.getElementById('industry').value;
  var styleKey = document.getElementById('style').value;
  var ind = INDUSTRIES[indKey], st = STYLES[styleKey];
  var box = document.getElementById('results');
  var html = '<h2>6 '+esc(st.label)+' logo concepts for '+esc(ind.label)+'</h2>';
  html += '<p class="sub">Style direction: '+esc(st.desc)+'. Click any mockup to enlarge.</p>';
  var seen = {};
  for(var i=0;i<6;i++){
    var c = buildConcept(ind, styleKey);
    if(seen[c.name]){ i--; continue; }
    seen[c.name]=1;
    html += '<article class="concept">'
      + '<div class="mock" data-svg="'+encodeURIComponent(c.svg)+'">'+c.svg+'</div>'
      + '<div><h4>'+esc(c.name)+'</h4>'
      + '<div><span class="tag">'+esc(st.label)+'</span><span class="tag">'+esc(ind.label)+'</span></div>'
      + '<p>'+esc(c.desc)+'</p>'
      + '<p><strong>Palette:</strong> <span class="chip" style="background:'+c.c1+';color:#fff">'+c.c1+'</span> <span class="chip" style="background:'+c.c2+';color:#fff">'+c.c2+'</span></p>'
      + '</div></article>';
  }
  html += '<p class="sub">Tip: screenshot a mockup and send it to a designer as a creative brief, or recreate it as original vector art. <a href="../guides/how-to-brainstorm-logo-ideas.html">Read the brainstorming guide →</a></p>';
  box.innerHTML = html;
  box.classList.remove('hidden');
  box.querySelectorAll('.mock').forEach(function(m){
    m.style.cursor='zoom-in';
    m.addEventListener('click', function(){
      var w = window.open('','_blank','width=420,height=460');
      w.document.write('<!DOCTYPE html><title>'+esc('Logo mockup')+'</title><body style="display:grid;place-items:center;min-height:100vh;background:#f4f5ff;margin:0"><div style="background:#fff;padding:40px;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,.15)">'+decodeURIComponent(m.getAttribute('data-svg')).replace('width="104" height="104"','width="240" height="240"')+'</div></body>');
    });
  });
  box.scrollIntoView({behavior:'smooth', block:'start'});
}

document.addEventListener('DOMContentLoaded', function(){
  var selI = document.getElementById('industry');
  Object.keys(INDUSTRIES).forEach(function(k){
    var o=document.createElement('option'); o.value=k; o.textContent=INDUSTRIES[k].label; selI.appendChild(o);
  });
  var selS = document.getElementById('style');
  Object.keys(STYLES).forEach(function(k){
    var o=document.createElement('option'); o.value=k; o.textContent=STYLES[k].label; selS.appendChild(o);
  });
  document.getElementById('genBtn').addEventListener('click', render);
  render(); // show a starter set on load
});
})();
