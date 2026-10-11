// Dog lifetime cost calculator
var DATA={
  small:{life:14,food:420,vet:380,ins:456,groom:360,sup:200,label:'Small (under 20 lbs)'},
  medium:{life:12,food:620,vet:460,ins:576,groom:480,sup:260,label:'Medium (20–50 lbs)'},
  large:{life:10,food:880,vet:560,ins:744,groom:600,sup:320,label:'Large (50+ lbs)'}
};
function calcLifetime(){
  var size=document.getElementById('dogSize').value;
  var d=DATA[size];
  var adopt=parseFloat(document.getElementById('adoptCost').value)||0;
  var ins=document.getElementById('includeIns').checked;
  var annual=d.food+d.vet+(ins?d.ins:0)+d.groom+d.sup;
  var total=adopt+annual*d.life;
  var r=document.getElementById('result');
  r.classList.add('show');
  r.innerHTML='<h3>💰 Lifetime Cost</h3>'
    +'<p class="big-num">'+money(total)+'</p>'
    +'<p>A '+d.label.toLowerCase()+' dog living ~'+d.life+' years costs about <strong>'+money(annual)+'/year</strong>.</p>'
    +'<table><tr><th>Category</th><th>Per year</th><th>Lifetime</th></tr>'
    +'<tr><td>Adoption/purchase (one-time)</td><td>—</td><td>'+money(adopt)+'</td></tr>'
    +'<tr><td>Food & treats</td><td>'+money(d.food)+'</td><td>'+money(d.food*d.life)+'</td></tr>'
    +'<tr><td>Vet care</td><td>'+money(d.vet)+'</td><td>'+money(d.vet*d.life)+'</td></tr>'
    +(ins?'<tr><td>Pet insurance</td><td>'+money(d.ins)+'</td><td>'+money(d.ins*d.life)+'</td></tr>':'')
    +'<tr><td>Grooming</td><td>'+money(d.groom)+'</td><td>'+money(d.groom*d.life)+'</td></tr>'
    +'<tr><td>Supplies, toys, boarding</td><td>'+money(d.sup)+'</td><td>'+money(d.sup*d.life)+'</td></tr>'
    +'<tr><td><strong>Total</strong></td><td><strong>'+money(annual)+'</strong></td><td><strong>'+money(total)+'</strong></td></tr></table>'
    +'<p class="disclaimer" style="margin-top:14px">US averages for 2026 — emergencies and breed-specific needs can add thousands. Plan a vet emergency fund.</p>';
}
