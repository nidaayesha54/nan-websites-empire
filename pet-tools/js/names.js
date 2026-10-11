// Pet name generator
var NAMES={
  cute:['Mochi','Biscuit','Pudding','Waffles','Peanut','Cupcake','Bean','Muffin','Noodle','Pickles','Honey','Maple','Clover','Daisy','Sunny'],
  funny:['Bark Twain','Sir Waggington','Chewbarka','Droolius Caesar','Paw Revere','Jimmy Chew','Waffle House','Colonel Mustard','Tater Tot','Beans'],
  cool:['Zephyr','Onyx','Juno','Kai','Luna','Atlas','Nova','Rogue','Slate','Vega','Zelda','Ghost'],
  food:['Oreo','Pepper','Ginger','Olive','Cocoa','Nacho','Pretzel','Sushi','Taco','Meatball','Pumpkin','Basil'],
  nature:['Willow','River','Aspen','Storm','Fern','Brook','Skye','Moss','Poppy','Ember']
};
var LABELS={cute:'Cute',funny:'Funny',cool:'Cool',food:'Food-inspired',nature:'Nature'};
function genNames(){
  var cat=document.getElementById('nameCat').value;
  var pool=cat==='any'?Object.keys(NAMES).reduce(function(a,k){return a.concat(NAMES[k]);},[]):NAMES[cat];
  var picked=[],copy=pool.slice();
  for(var i=0;i<8&&copy.length;i++){ picked.push(copy.splice(Math.floor(Math.random()*copy.length),1)[0]); }
  var r=document.getElementById('result');
  r.classList.add('show');
  r.innerHTML='<h3>✨ Name ideas ('+(LABELS[cat]||'All categories')+')</h3>'
    +'<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px">'
    +picked.map(function(n){return '<span style="background:#fff3e2;border:2px solid var(--accent);border-radius:999px;padding:8px 18px;font-weight:700">'+n+'</span>';}).join('')
    +'</div><p style="margin-top:14px"><button class="btn" onclick="genNames()">🔁 More names</button></p>';
}
