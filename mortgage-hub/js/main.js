// Shared helpers for MortgageHub
(function(){
  // Footer year
  var y=document.getElementById('yr');
  if(y) y.textContent=new Date().getFullYear();

  // FAQ accordion smooth behavior (native <details> already works; add nothing)

  window.MH = {
    money: function(n){
      if(!isFinite(n)) return '$0';
      return '$' + Math.round(n).toLocaleString('en-US');
    },
    money2: function(n){
      if(!isFinite(n)) return '$0.00';
      return '$' + Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
    },
    // Standard amortized monthly payment (principal & interest only)
    // principal: loan amount, annualRate: e.g. 6.5 for 6.5%, years: term
    monthlyPI: function(principal, annualRate, years){
      var r = annualRate/100/12, n = Math.round(years*12);
      if(r === 0) return principal/n;
      var f = Math.pow(1+r, n);
      return principal * r * f / (f - 1);
    },
    get: function(id){
      var el = document.getElementById(id);
      return el ? parseFloat(el.value) || 0 : 0;
    }
  };
})();
