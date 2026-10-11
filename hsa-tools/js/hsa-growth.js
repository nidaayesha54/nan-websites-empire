function money(x){var n=x<0;x=Math.abs(x);var s="$"+x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");return n?"-"+s:s;}
function pct(x,d){return (x*100).toFixed(d===undefined?1:d)+"%";}
function show(html){var b=document.getElementById("resultBox");b.innerHTML=html;b.classList.add("show");}
function statRow(l,v,cls){return '<div class="stat"><span>'+l+'</span><b class="'+(cls||"")+'">'+v+'</b></div>';}
function bar(w){return '<div class="bar"><div style="width:'+Math.min(100,Math.max(0,w))+'%"></div></div>';}

document.getElementById("calcBtn").addEventListener("click",calc);calc();
function calc(){
  var annual=parseFloat(document.getElementById("annual").value)||0;
  var years=parseInt(document.getElementById("years").value,10)||0;
  var ret=(parseFloat(document.getElementById("ret").value)||0)/100;
  var tax=(parseFloat(document.getElementById("tax").value)||0)/100;
  if(annual<=0||years<=0||years>60){show(statRow("Enter a positive contribution and 1\u201360 years."));return;}
  if(ret<0||ret>0.30){show(statRow("Return should be between 0% and 30%."));return;}
  if(tax<0||tax>0.5){show(statRow("Tax rate should be between 0% and 50%."));return;}
  var f=ret>0?(Math.pow(1+ret,years)-1)/ret:years;
  var fv=annual*f, contrib=annual*years, growth=fv-contrib;
  var taxSaveYr=annual*tax, taxSaveTotal=taxSaveYr*years;
  var taxableFv=annual*(1-tax)*f, advantage=fv-taxableFv;
  show("<h3>Your HSA projection</h3>"
    +statRow("Future value (tax-free)",money(fv),"pos")
    +statRow("Total contributions",money(contrib))
    +statRow("Tax-free investment growth",money(growth),"pos")
    +statRow("Income tax saved per year",money(taxSaveYr),"pos")
    +statRow("Total income tax saved ("+years+" yrs)",money(taxSaveTotal),"pos")
    +"<h3 style='margin-top:14px'>HSA vs taxable account</h3>"
    +statRow("Same money in a taxable account",money(taxableFv))
    +statRow("HSA triple-tax advantage",money(advantage),"pos")
    +bar(100)
    +"<p style='color:var(--muted);font-size:.9rem'>Assumes end-of-year contributions compounding annually at "+pct(ret)+". Taxable comparison invests only after-tax dollars ("+pct(tax)+" tax paid first). Actual results vary with markets and tax law.</p>");
}
