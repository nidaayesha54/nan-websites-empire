function money(x){var n=x<0;x=Math.abs(x);var s="$"+x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");return n?"-"+s:s;}
function pct(x,d){return (x*100).toFixed(d===undefined?1:d)+"%";}
function show(html){var b=document.getElementById("resultBox");b.innerHTML=html;b.classList.add("show");}
function statRow(l,v,cls){return '<div class="stat"><span>'+l+'</span><b class="'+(cls||"")+'">'+v+'</b></div>';}
function bar(w){return '<div class="bar"><div style="width:'+Math.min(100,Math.max(0,w))+'%"></div></div>';}

document.getElementById("calcBtn").addEventListener("click",calc);calc();
function yearsToFI(income,sr,nw,r){
  var expenses=income*(1-sr), fi=expenses*25, bal=nw, y=0, save=income*sr;
  if(save<=0)return Infinity;
  while(bal<fi&&y<80){bal=bal*(1+r)+save;y++;}
  return y>=80?Infinity:y;
}
function classic(sr){var r=0.05,fi=(1-sr)/0.04,s=sr;return Math.log((fi*r+s)/s)/Math.log(1+r);}
function calc(){
  var income=parseFloat(document.getElementById("income").value)||0;
  var sr=(parseFloat(document.getElementById("sr").value)||0)/100;
  var nw=parseFloat(document.getElementById("nw").value)||0;
  var r=(parseFloat(document.getElementById("ret").value)||0)/100;
  if(income<=0||sr<=0||sr>=1){show(statRow("Enter income and a savings rate between 1% and 99%."));return;}
  var fi=income*(1-sr)*25, yrs=yearsToFI(income,sr,nw,r);
  var rows=[10,20,30,40,50,60,70,80,90].map(function(p){
    return "<tr><td>"+p+"%</td><td>"+classic(p/100).toFixed(1)+" years</td></tr>";}).join("");
  show("<h3>Your path to FI</h3>"
    +statRow("Annual savings",money(income*sr))
    +statRow("Annual expenses",money(income*(1-sr)))
    +statRow("Your FI number (\u00D725 expenses)",money(fi),"pos")
    +statRow("Years to FI at "+pct(sr,0)+" savings",yrs===Infinity?"80+ years":yrs+" years",yrs<30?"pos":"")
    +"<h3 style='margin-top:14px'>Classic savings-rate table</h3>"
    +"<p style='color:var(--muted);font-size:.9rem'>Years to FI from $0 at 5% real returns:</p>"
    +"<table class='data'><tr><th>Savings rate</th><th>Years to FI</th></tr>"+rows+"</table>"
    +"<p style='color:var(--muted);font-size:.9rem'>Simulation compounds yearly at "+pct(r)+" and adds your annual savings until net worth reaches 25\u00D7 expenses. Small rate increases cut years dramatically.</p>");
}
