function money(x){var n=x<0;x=Math.abs(x);var s="$"+x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");return n?"-"+s:s;}
function pct(x,d){return (x*100).toFixed(d===undefined?1:d)+"%";}
function show(html){var b=document.getElementById("resultBox");b.innerHTML=html;b.classList.add("show");}
function statRow(l,v,cls){return '<div class="stat"><span>'+l+'</span><b class="'+(cls||"")+'">'+v+'</b></div>';}
function bar(w){return '<div class="bar"><div style="width:'+Math.min(100,Math.max(0,w))+'%"></div></div>';}

document.getElementById("calcBtn").addEventListener("click",calc);calc();
function calc(){
  var cur=parseFloat(document.getElementById("cur").value)||0;
  var age=parseInt(document.getElementById("age").value,10)||0;
  var ra=parseInt(document.getElementById("ra").value,10)||0;
  var r=(parseFloat(document.getElementById("ret").value)||0)/100;
  var exp=parseFloat(document.getElementById("exp").value)||0;
  if(cur<0||age<=0||ra<=age||exp<=0){show(statRow("Check inputs: retirement age must exceed current age, expenses positive."));return;}
  var yrs=ra-age, fv=cur*Math.pow(1+r,yrs), fi=exp*25, gap=fi-fv;
  var done=gap<=0;
  show("<h3>Coast FIRE check</h3>"
    +statRow("Current invested",money(cur))
    +statRow("Years of compounding",yrs+" years")
    +statRow("Value at age "+ra+" (no new savings)",money(fv),"pos")
    +statRow("Full FI number (\u00D725 expenses)",money(fi))
    +statRow(done?"Surplus beyond FI":"Gap to fill",money(Math.abs(gap)),done?"pos":"neg")
    +(done?"<p style='font-size:1.05rem'><b class='pos'>\U0001F389 You\u2019ve hit Coast FIRE!</b> Your stash compounds to full FI on its own \u2014 you only need to cover current living costs from here.</p>"
          :"<p>To coast today you\u2019d need <b>"+money(gap)+"</b> more invested, or let time/returns do the work.</p>")
    +"<p style='color:var(--muted);font-size:.9rem'>Uses "+pct(r)+" real annual returns. Coast FIRE means never saving for retirement again \u2014 work becomes optional, not required.</p>");
}
