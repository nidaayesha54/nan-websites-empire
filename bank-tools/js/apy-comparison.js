function money(x){var n=x<0;x=Math.abs(x);var s="$"+x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");return n?"-"+s:s;}
function pct(x,d){return (x*100).toFixed(d===undefined?1:d)+"%";}
function show(html){var b=document.getElementById("resultBox");b.innerHTML=html;b.classList.add("show");}
function statRow(l,v,cls){return '<div class="stat"><span>'+l+'</span><b class="'+(cls||"")+'">'+v+'</b></div>';}
function bar(w){return '<div class="bar"><div style="width:'+Math.min(100,Math.max(0,w))+'%"></div></div>';}

document.getElementById("calcBtn").addEventListener("click",calc);calc();
function calc(){
  var dep=parseFloat(document.getElementById("dep").value)||0;
  var a=(parseFloat(document.getElementById("apya").value)||0)/100;
  var b=(parseFloat(document.getElementById("apyb").value)||0)/100;
  var yrs=parseInt(document.getElementById("yrs").value,10)||0;
  if(dep<=0||yrs<=0||yrs>50){show(statRow("Enter a deposit and 1\u201350 years."));return;}
  var fa=dep*Math.pow(1+a,yrs), fb=dep*Math.pow(1+b,yrs);
  var ia=fa-dep, ib=fb-dep, diff=fa-fb;
  show("<h3>Side-by-side after "+yrs+" years</h3>"
    +statRow("Account A ("+pct(a,2)+" APY)",money(fa))
    +statRow("Account B ("+pct(b,2)+" APY)",money(fb))
    +statRow("Interest earned \u2014 A",money(ia))
    +statRow("Interest earned \u2014 B",money(ib))
    +statRow("Difference (A \u2212 B)",money(diff),diff>=0?"pos":"neg")
    +"<p style='color:var(--muted);font-size:.9rem'>APY is the effective yearly yield, so future value = deposit \u00D7 (1+APY)<sup>years</sup>. Monthly compounding is already baked into the APY figure.</p>");
}
