// Affordability calculator: 28/36 rule + binary search for max home price
document.getElementById('acalc').addEventListener('submit', function(e){
  e.preventDefault();
  var income = MH.get('income');        // gross annual
  var debts = MH.get('debts');          // monthly non-housing debts
  var down = MH.get('down');            // down payment $
  var rate = MH.get('rate');
  var years = MH.get('term');
  var taxAnnual = MH.get('tax');
  var insAnnual = MH.get('ins');
  var hoa = MH.get('hoa');

  var grossM = income/12;
  var maxHousing = Math.min(0.28*grossM, 0.36*grossM - debts);
  if(maxHousing < 0) maxHousing = 0;

  // monthly cost of a home priced P (excluding down payment effect on tax/ins)
  function monthlyCost(P){
    var loan = Math.max(P - down, 0);
    var pi = MH.monthlyPI(loan, rate, years);
    var pmi = (down < P*0.20 && loan > 0) ? loan*0.005/12 : 0;
    return pi + taxAnnual/12 + insAnnual/12 + pmi + hoa;
  }

  // binary search max price
  var lo = 0, hi = Math.max(down*2, income*10);
  for(var i=0;i<60;i++){
    var mid = (lo+hi)/2;
    if(monthlyCost(mid) <= maxHousing) lo = mid; else hi = mid;
  }
  var maxPrice = lo;
  var loanAtMax = Math.max(maxPrice - down, 0);
  var piAtMax = MH.monthlyPI(loanAtMax, rate, years);

  document.getElementById('r-maxprice').textContent = MH.money(maxPrice);
  document.getElementById('r-maxpay').textContent = MH.money2(maxHousing);
  document.getElementById('r-loan').textContent = MH.money(loanAtMax);
  document.getElementById('r-pi').textContent = MH.money2(piAtMax);
  document.getElementById('r-dti').textContent = ((debts+maxHousing)/grossM*100).toFixed(1) + '%';
  document.getElementById('out').classList.add('show');
  document.getElementById('out').scrollIntoView({behavior:'smooth',block:'start'});
});
