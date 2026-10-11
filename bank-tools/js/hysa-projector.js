function money(x){var n=x<0;x=Math.abs(x);var s="$"+x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");return n?"-"+s:s;}
function pct(x,d){return (x*100).toFixed(d===undefined?1:d)+"%";}
function show(html){var b=document.getElementById("resultBox");b.innerHTML=html;b.classList.add("show");}
function statRow(l,v,cls){return '<div class="stat"><span>'+l+'</span><b class="'+(cls||"")+'">'+v+'</b></div>';}
function bar(w){return '<div class="bar"><div style="width:'+Math.min(100,Math.max(0,w))+'%"></div></div>';}

document.getElementById("calcBtn").addEventListener("click",calc);calc();
function calc(){
  var start=parseFloat(document.getElementById("start").value)||0;
  var dep=parseFloat(document.getElementById("dep").value)||0;
  var apy=(parseFloat(document.getElementById("apy").value)||0)/100;
  var yrs=parseInt(document.getElementById("yrs").value,10)||0;
  if(yrs<=0||yrs>50){show(statRow("Enter 1\u201350 years."));return;}
  var m=apy/12, bal=start, rows="", totDep=start;
  for(var y=1;y<=yrs;y++){
    var yInt=0;
    for(var mo=0;mo<12;mo++){var i=bal*m;bal+=i+dep;yInt+=i;totDep+=dep;}
    rows+="<tr><td>"+y+"</td><td>"+money(dep*12)+"</td><td>"+money(yInt)+"</td><td>"+money(bal)+"</td></tr>";
  }
  show("<h3>Growth projection</h3>"
    +statRow("Ending balance",money(bal),"pos")
    +statRow("Total deposited",money(totDep))
    +statRow("Total interest earned",money(bal-totDep),"pos")
    +"<table class='data'><tr><th>Year</th><th>Deposited</th><th>Interest</th><th>Balance</th></tr>"+rows+"</table>"
    +"<p style='color:var(--muted);font-size:.9rem'>Monthly compounding at "+pct(apy,2)+" APY (monthly rate = APY/12). Assumes a constant rate \u2014 real HYSA rates move with the Fed.</p>");
}
