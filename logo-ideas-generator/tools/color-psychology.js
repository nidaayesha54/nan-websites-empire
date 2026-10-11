/* Interactive color psychology guide */
(function(){
'use strict';
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

var COLORS = [
 {name:'Red', hex:'#e11d48', text:'#fff',
  meanings:['Excitement','Urgency','Passion','Appetite','Power'],
  emotions:'Red raises heart rate and grabs attention fast. It creates urgency (sales, clearance) and stimulates appetite — which is why food brands love it.',
  industries:['Restaurants & food','Retail & sales','Entertainment','Sports','Automotive'],
  brands:['Coca-Cola','Netflix','Target','YouTube','KFC'],
  tip:'Use red as an accent, not a flood — too much feels aggressive. Pair with white or black for maximum punch.'},
 {name:'Orange', hex:'#f97316', text:'#fff',
  meanings:['Friendliness','Creativity','Affordability','Enthusiasm','Youth'],
  emotions:'Orange feels approachable and energetic without red\u2019s aggression. It signals value and fun — perfect for brands that want to feel human.',
  industries:['E-commerce','Kids & family','Travel','Creative agencies','Fitness'],
  brands:['Amazon (smile)','Fanta','Home Depot','Nickelodeon','SoundCloud'],
  tip:'Orange + dark charcoal is a modern, confident combo. Avoid pairing with red — they vibrate against each other.'},
 {name:'Yellow', hex:'#eab308', text:'#1a1a1a',
  meanings:['Optimism','Happiness','Warmth','Clarity','Attention'],
  emotions:'Yellow is the most visible color in daylight — it sparks optimism and mental clarity. Overuse can cause eye fatigue, so it works best in doses.',
  industries:['Food & snacks','Children\u2019s brands','Logistics','Home services','Entertainment'],
  brands:['McDonald\u2019s (arches)','IKEA','Snapchat','DHL','Lipton'],
  tip:'Yellow needs a dark partner (black, navy) for contrast and readability. Great for CTAs and highlights.'},
 {name:'Green', hex:'#16a34a', text:'#fff',
  meanings:['Nature','Growth','Health','Wealth','Calm'],
  emotions:'Green sits in the middle of the spectrum, so eyes rest on it. It signals nature, renewal, and money — trusted by eco brands and banks alike.',
  industries:['Eco & organic','Finance & banking','Healthcare','Agriculture','Wellness'],
  brands:['Starbucks','Whole Foods','Spotify','Animal Planet','TD Bank'],
  tip:'Deep forest green reads premium; bright lime reads youthful. Pick one lane — mixing both looks muddy.'},
 {name:'Blue', hex:'#2563eb', text:'#fff',
  meanings:['Trust','Stability','Professionalism','Calm','Intelligence'],
  emotions:'Blue is the world\u2019s favorite color and the safest corporate choice. It lowers blood pressure and builds trust — but it can feel cold or corporate if overused.',
  industries:['Finance & banking','Technology','Healthcare','Insurance','Legal'],
  brands:['Facebook','Samsung','PayPal','Ford','LinkedIn'],
  tip:'Navy = authority, sky blue = friendly. The most common logo color — differentiate with shape, not just shade.'},
 {name:'Purple', hex:'#7c3aed', text:'#fff',
  meanings:['Luxury','Creativity','Wisdom','Mystery','Royalty'],
  emotions:'Purple has historically signaled royalty (rare dye) and now reads as imaginative and premium. It works for brands selling transformation.',
  industries:['Beauty & cosmetics','Luxury goods','Wellness & spirituality','Entertainment','Education'],
  brands:['Cadbury','Twitch','Hallmark','Yahoo','Crown Royal'],
  tip:'Purple + gold is the classic luxury pairing. Muted plum feels sophisticated; neon purple feels playful-tech.'},
 {name:'Pink', hex:'#ec4899', text:'#fff',
  meanings:['Playfulness','Romance','Compassion','Femininity','Modernity'],
  emotions:'Pink softens a brand instantly. Hot pink is bold and youthful; blush pink is calm and premium. It no longer reads as \u201cgirls only\u201d — modern brands use it for warmth.',
  industries:['Beauty & fashion','Dating & lifestyle','Desserts & bakeries','Kids brands','Wellness'],
  brands:['Barbie','T-Mobile','Victoria\u2019s Secret','Lyft','Dunkin\u2019'],
  tip:'Millennial blush pink + minimal typography = instant modern-boutique feel. Hot pink demands bold, simple shapes.'},
 {name:'Brown', hex:'#92400e', text:'#fff',
  meanings:['Earthiness','Reliability','Warmth','Craft','Tradition'],
  emotions:'Brown feels grounded, honest, and handcrafted. It\u2019s the color of coffee, leather, and wood — perfect for artisanal positioning.',
  industries:['Coffee & chocolate','Craft & handmade','Furniture','Outdoor & rugged','Bakeries'],
  brands:['UPS','Hershey\u2019s','Louis Vuitton (monogram)','M&M\u2019s (brown)','A&W'],
  tip:'Brown + cream + one accent color is a timeless artisan palette. Avoid muddy mid-tones that look dirty at small sizes.'},
 {name:'Black', hex:'#18181b', text:'#fff',
  meanings:['Luxury','Power','Sophistication','Elegance','Authority'],
  emotions:'Black is the ultimate premium signal — slimming, serious, timeless. It makes other colors pop and never goes out of style.',
  industries:['Luxury & fashion','Automotive','Tech (premium)','Law','Real estate (high-end)'],
  brands:['Nike','Chanel','Apple (mono)','Adidas','Sony'],
  tip:'Black needs breathing room — generous whitespace keeps it elegant instead of heavy. Add one metallic accent for luxury.'},
 {name:'White / Gray', hex:'#9ca3af', text:'#1a1a1a',
  meanings:['Simplicity','Cleanliness','Minimalism','Neutrality','Modernity'],
  emotions:'White space is a design tool, not empty space. Grays feel neutral and modern — the backbone of minimalist identities.',
  industries:['Tech & SaaS','Healthcare','Architecture','Minimalist brands','Premium services'],
  brands:['Apple (product)','Wikipedia','Mercedes (silver)','Honda','The North Face (gray)'],
  tip:'Gray logos need a strong shape to carry them — pair with bold typography or a distinctive mark.'}
];

function showColor(c){
  document.querySelectorAll('.swatch').forEach(function(s){ s.classList.toggle('sel', s.dataset.name===c.name); });
  var d = document.getElementById('colorDetail');
  d.innerHTML =
    '<div class="color-detail">'
    +'<h3><span class="chip" style="background:'+c.hex+';color:'+c.text+'">'+esc(c.name)+'</span> '+esc(c.hex.toUpperCase())+'</h3>'
    +'<p><strong>What it communicates:</strong></p><div class="chips">'+c.meanings.map(function(m){return '<span class="chip">'+esc(m)+'</span>';}).join('')+'</div>'
    +'<p>'+esc(c.emotions)+'</p>'
    +'<p><strong>Best industries:</strong></p><div class="chips">'+c.industries.map(function(m){return '<span class="chip">'+esc(m)+'</span>';}).join('')+'</div>'
    +'<p><strong>Famous examples:</strong> '+c.brands.map(esc).join(', ')+'</p>'
    +'<p><strong>Designer tip:</strong> '+esc(c.tip)+'</p>'
    +'<p class="sub">Want ideas using this color? <a href="idea-generator.html">Generate logo concepts →</a></p>'
    +'</div>';
  d.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', function(){
  var grid = document.getElementById('swatchGrid');
  COLORS.forEach(function(c){
    var b = document.createElement('button');
    b.type='button'; b.className='swatch'; b.dataset.name=c.name;
    b.style.background=c.hex; b.style.color=c.text;
    b.innerHTML='<div style="font-size:.9rem">'+esc(c.name)+'</div><div style="font-size:.7rem;opacity:.85">'+c.hex.toUpperCase()+'</div>';
    b.setAttribute('aria-label','Learn about '+c.name+' in logo design');
    b.addEventListener('click', function(){ showColor(c); });
    grid.appendChild(b);
  });
  showColor(COLORS[4]); // start with blue
});
})();
