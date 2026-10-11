function money(x){var n=x<0;x=Math.abs(x);var s="$"+x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");return n?"-"+s:s;}
function pct(x,d){return (x*100).toFixed(d===undefined?1:d)+"%";}
function show(html){var b=document.getElementById("resultBox");b.innerHTML=html;b.classList.add("show");}
function statRow(l,v,cls){return '<div class="stat"><span>'+l+'</span><b class="'+(cls||"")+'">'+v+'</b></div>';}
function bar(w){return '<div class="bar"><div style="width:'+Math.min(100,Math.max(0,w))+'%"></div></div>';}

document.getElementById("calcBtn").addEventListener("click",calc);calc();
function calc(){
  var spend=parseFloat(document.getElementById("spend").value)||0;
  var bracket=(parseFloat(document.getElementById("bracket").value)||0)/100;
  var job=document.getElementById("job").value;
  var hdhp=document.getElementById("hdhp").checked;
  var invest=document.getElementById("invest").checked;
  var hsa=0,fsa=0,reasons=[];
  if(!hdhp){fsa+=5;reasons.push("You are not on a high-deductible health plan, so an HSA is off the table \u2014 FSA wins by default.");}
  else{
    if(bracket>=0.25){hsa+=2;reasons.push("Your "+pct(bracket,0)+" marginal bracket makes the HSA's triple tax break very valuable.");}
    else if(bracket>=0.12){hsa+=1;fsa+=1;reasons.push("At a "+pct(bracket,0)+" bracket the HSA tax edge is real but modest.");}
    else{fsa+=1;reasons.push("At a lower tax bracket, the HSA's tax advantage is smaller.");}
    if(job==="high"){hsa+=3;reasons.push("Likely job change: FSA money is use-it-or-lose-it and usually tied to your employer \u2014 your HSA travels with you.");}
    else if(job==="medium"){hsa+=1;reasons.push("Some job-change risk favors the portable HSA over the employer-tied FSA.");}
    else{fsa+=1;reasons.push("Stable job: the FSA's use-it-or-lose-it risk is low for you.");}
    if(spend>3300){hsa+=1;reasons.push("Your $"+Math.round(spend).toLocaleString()+" spending tops the ~$3,300 FSA cap \u2014 the HSA has no annual spending cap.");}
    else if(spend<1200){fsa+=1;reasons.push("Small, predictable costs under ~$1,200 fit an FSA comfortably.");}
    else{hsa+=1;reasons.push("Mid-range spending: the HSA's higher limits and rollover give more headroom.");}
    if(invest){hsa+=2;reasons.push("You want to invest for retirement: only the HSA can be invested long-term and withdrawn tax-free later.");}
    else{fsa+=1;reasons.push("Spending this year's costs only: the FSA's simplicity is fine.");}
  }
  var winner=hsa>fsa?"HSA":(fsa>hsa?"FSA":"Tie"), wcls=winner==="HSA"?"pos":(winner==="FSA"?"neg":"");
  show("<h3>Recommendation: <b class='"+wcls+"'>"+winner+"</b></h3>"
    +statRow("HSA score",hsa+" pts")+bar(hsa/12*100)
    +statRow("FSA score",fsa+" pts")+bar(fsa/12*100)
    +"<h3 style='margin-top:14px'>Why</h3><ul style='margin-left:20px'>"
    +reasons.map(function(r){return "<li>"+r+"</li>";}).join("")+"</ul>"
    +"<p style='color:var(--muted);font-size:.9rem'>HSA requires a qualifying high-deductible health plan. FSA limits (~$3,300 for 2026) are estimates; confirm with your employer plan.</p>");
}
