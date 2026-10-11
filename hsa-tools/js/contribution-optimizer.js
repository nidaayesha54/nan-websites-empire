function money(x){var n=x<0;x=Math.abs(x);var s="$"+x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");return n?"-"+s:s;}
function pct(x,d){return (x*100).toFixed(d===undefined?1:d)+"%";}
function show(html){var b=document.getElementById("resultBox");b.innerHTML=html;b.classList.add("show");}
function statRow(l,v,cls){return '<div class="stat"><span>'+l+'</span><b class="'+(cls||"")+'">'+v+'</b></div>';}
function bar(w){return '<div class="bar"><div style="width:'+Math.min(100,Math.max(0,w))+'%"></div></div>';}

document.getElementById("calcBtn").addEventListener("click",calc);calc();
function calc(){
  var cov=document.getElementById("cov").value;
  var c55=document.getElementById("c55").checked;
  var cur=parseFloat(document.getElementById("cur").value)||0;
  var emp=parseFloat(document.getElementById("emp").value)||0;
  var limit=cov==="self"?4400:8750, catchup=c55?1000:0, max=limit+catchup;
  var remaining=Math.max(0,max-cur-emp);
  var now=new Date(), monthsLeft=Math.max(1,12-now.getMonth());
  var perMonth=remaining/monthsLeft, perPay=remaining/24;
  show("<h3>Your 2026 HSA limit</h3>"
    +statRow("2026 limit ("+(cov==="self"?"self-only":"family")+" coverage, estimate)","$"+limit.toLocaleString())
    +statRow("Age 55+ catch-up",catchup?"$1,000":"$0")
    +statRow("Your 2026 maximum allowed",money(max),"pos")
    +statRow("Already contributed (you)",money(cur))
    +statRow("Employer contributions",money(emp))
    +statRow("Remaining room for 2026",money(remaining),remaining>0?"pos":"")
    +"<h3 style='margin-top:14px'>To max it out</h3>"
    +statRow("Contribute per month ("+monthsLeft+" months left)",money(perMonth))
    +statRow("If paid 2x/month",money(perPay))
    +"<p style='color:var(--muted);font-size:.9rem'>2026 limits are IRS estimates ($4,400 self / $8,750 family, +$1,000 catch-up at 55+). Employer contributions count toward YOUR limit. Married couples: each spouse 55+ gets their own $1,000 catch-up (separate accounts).</p>");
}
