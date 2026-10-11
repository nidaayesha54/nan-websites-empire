// Dog food portion calculator — RER = 70 × (weight_kg^0.75)
var MER={
  'neutered':{f:1.6,label:'Neutered adult'},
  'intact':{f:1.8,label:'Intact adult'},
  'inactive':{f:1.3,label:'Inactive / prone to obesity'},
  'weightloss':{f:1.1,label:'Weight loss'},
  'active':{f:2.5,label:'Active / working dog'},
  'puppy4':{f:3.0,label:'Puppy (under 4 months)'},
  'puppy12':{f:2.0,label:'Puppy (4–12 months)'}
};
function calcFood(){
  var lbs=parseFloat(document.getElementById('weight').value);
  var life=document.getElementById('lifestyle').value;
  var kcal=parseFloat(document.getElementById('kcal').value)||350;
  if(isNaN(lbs)||lbs<=0||lbs>300){ alert('Please enter a valid weight in pounds.'); return; }
  var kg=lbs/2.20462;
  var rer=70*Math.pow(kg,0.75);
  var mer=rer*MER[life].f;
  var cups=mer/kcal;
  var meals=cups/2;
  var r=document.getElementById('result');
  r.classList.add('show');
  r.innerHTML='<h3>🍖 Daily Feeding Guide</h3>'
    +'<p class="big-num">'+cups.toFixed(2)+' cups/day</p>'
    +'<p>For a '+lbs+' lb dog ('+MER[life].label.toLowerCase()+'): <strong>'+Math.round(mer)+' kcal/day</strong>.</p>'
    +'<table><tr><th>Detail</th><th>Value</th></tr>'
    +'<tr><td>Resting energy (RER)</td><td>'+Math.round(rer)+' kcal</td></tr>'
    +'<tr><td>Daily need (MER)</td><td>'+Math.round(mer)+' kcal</td></tr>'
    +'<tr><td>Food energy</td><td>'+kcal+' kcal/cup</td></tr>'
    +'<tr><td><strong>Daily portion</strong></td><td><strong>'+cups.toFixed(2)+' cups</strong></td></tr>'
    +'<tr><td>Per meal (2 meals/day)</td><td>'+meals.toFixed(2)+' cups</td></tr></table>'
    +'<p class="disclaimer" style="margin-top:14px">A starting point — adjust for body condition and check the bag label. Ask your vet if your dog is very thin, overweight, pregnant, or ill.</p>';
}
