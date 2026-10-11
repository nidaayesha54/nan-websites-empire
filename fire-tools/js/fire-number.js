function money(x){var n=x<0;x=Math.abs(x);var s="$"+x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");return n?"-"+s:s;}
function pct(x,d){return (x*100).toFixed(d===undefined?1:d)+"%";}
function show(html){var b=document.getElementById("resultBox");b.innerHTML=html;b.classList.add("show");}
function statRow(l,v,cls){return '<div class="stat"><span>'+l+'</span><b class="'+(cls||"")+'">'+v+'</b></div>';}
function bar(w){return '<div class="bar"><div style="width:'+Math.min(100,Math.max(0,w))+'%"></div></div>';}

document.getElementById("calcBtn").addEventListener("click",calc);calc();
function calc(){
  var exp=parseFloat(document.getElementById("exp").value)||0;
  if(exp<=0){show(statRow("Enter your annual expenses."));return;}
  var lean=exp*20, fire=exp*25, fat=exp*33;
  show("<h3>Your FIRE numbers</h3>"
    +statRow("Lean FIRE (\u00D720, ~5% rule)",money(lean))
    +statRow("FIRE (\u00D725, 4% rule)",money(fire),"pos")
    +statRow("Fat FIRE (\u00D733, ~3% rule)",money(fat))
    +"<h3 style='margin-top:14px'>Safe yearly withdrawal</h3>"
    +statRow("Lean: 5% of "+money(lean),money(lean*0.05))
    +statRow("FIRE: 4% of "+money(fire),money(fire*0.04),"pos")
    +statRow("Fat: 3% of "+money(fat),money(fat*0.03))
    +statRow("Monthly spending covered (FIRE)",money(fire*0.04/12))
    +"<p style='color:var(--muted);font-size:.9rem'>Based on the Trinity-study 4% rule: save 25\u00D7 annual expenses, withdraw ~4% yearly. Lean assumes lower spending and higher withdrawal risk; Fat adds a bigger safety margin.</p>");
}
