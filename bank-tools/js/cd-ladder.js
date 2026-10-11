function money(x){var n=x<0;x=Math.abs(x);var s="$"+x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");return n?"-"+s:s;}
function pct(x,d){return (x*100).toFixed(d===undefined?1:d)+"%";}
function show(html){var b=document.getElementById("resultBox");b.innerHTML=html;b.classList.add("show");}
function statRow(l,v,cls){return '<div class="stat"><span>'+l+'</span><b class="'+(cls||"")+'">'+v+'</b></div>';}
function bar(w){return '<div class="bar"><div style="width:'+Math.min(100,Math.max(0,w))+'%"></div></div>';}

document.getElementById("calcBtn").addEventListener("click",calc);calc();
function calc(){
  var total=parseFloat(document.getElementById("total").value)||0;
  var rates=[1,2,3,4,5].map(function(k){return (parseFloat(document.getElementById("r"+k).value)||0)/100;});
  if(total<=0){show(statRow("Enter the total amount to ladder."));return;}
  var rung=total/5, rows="", endTotal=0;
  for(var k=1;k<=5;k++){
    var val=rung*Math.pow(1+rates[k-1],k); endTotal+=val;
    rows+="<tr><td>Year "+k+"</td><td>"+money(rung)+"</td><td>"+pct(rates[k-1],2)+"</td><td>"+money(val)+"</td></tr>";
  }
  var blend=(rates[0]+rates[1]+rates[2]+rates[3]+rates[4])/5;
  var lump=total*Math.pow(1+rates[4],1);
  show("<h3>Your 5-rung CD ladder</h3>"
    +"<table class='data'><tr><th>Matures</th><th>Principal</th><th>Rate</th><th>Value at maturity</th></tr>"+rows+"</table>"
    +statRow("Total principal",money(total))
    +statRow("Combined value as rungs mature",money(endTotal),"pos")
    +statRow("Blended APY (average of rungs)",pct(blend,2))
    +statRow("Interest earned across ladder",money(endTotal-total),"pos")
    +"<p style='color:var(--muted);font-size:.9rem'>Equal "+money(rung)+" per rung. Each year one CD matures \u2014 spend it or roll it into a new 5-year CD to keep the ladder climbing. Early-withdrawal penalties not included; check each bank's terms.</p>");
}
