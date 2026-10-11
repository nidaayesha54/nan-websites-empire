/* Student loan calculator — standard amortization + extra payment simulation */
(function(){
  "use strict";
  function fmt(n){ return "$" + n.toLocaleString("en-US",{maximumFractionDigits:0}); }

  function amortize(P, annualRate, years){
    var r = annualRate/100/12, n = Math.round(years*12);
    if (P<=0 || n<=0) return null;
    var M = r === 0 ? P/n : P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
    return { monthly:M, totalInterest: M*n - P, payments:n };
  }

  function withExtra(P, annualRate, years, extra){
    var r = annualRate/100/12;
    var base = amortize(P, annualRate, years);
    if (!base) return null;
    var M = base.monthly + extra;
    var bal = P, totalInt = 0, months = 0;
    while (bal > 0.005 && months < 1200){
      var interest = bal*r;
      totalInt += interest;
      bal = bal + interest - M;
      months++;
    }
    return { months:months, totalInterest:totalInt, totalPaid:P+totalInt, monthly:M };
  }

  function calculate(){
    var P = parseFloat(document.getElementById("principal").value)||0;
    var rate = parseFloat(document.getElementById("rate").value)||0;
    var years = parseFloat(document.getElementById("years").value)||0;
    var extra = parseFloat(document.getElementById("extra").value)||0;
    var box = document.getElementById("resultBox");
    if (P<=0 || years<=0){ box.classList.remove("show"); return; }
    var base = amortize(P, rate, years);
    var adv = withExtra(P, rate, years, extra);
    box.classList.add("show");
    document.getElementById("monthlyOut").textContent = fmt(base.monthly);
    document.getElementById("interestOut").textContent = fmt(base.totalInterest);
    document.getElementById("totalOut").textContent = fmt(P + base.totalInterest);
    var yrs = Math.floor(adv.months/12), mo = adv.months%12;
    document.getElementById("timeOut").textContent = yrs + " yrs " + mo + " mo (" + adv.months + " payments)";
    var saved = base.totalInterest - adv.totalInterest;
    document.getElementById("saveOut").textContent = extra>0
      ? fmt(saved) + " interest saved · " + (base.payments - adv.months) + " fewer payments"
      : "Add an extra monthly payment above to see savings";
  }

  ["principal","rate","years","extra"].forEach(function(id){
    document.getElementById(id).addEventListener("input", calculate);
  });
  calculate();
})();
