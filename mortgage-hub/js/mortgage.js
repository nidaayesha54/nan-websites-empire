// Mortgage payment calculator: P&I + tax + insurance + PMI + HOA
document.getElementById('mcalc').addEventListener('submit', function(e){
  e.preventDefault();
  var price = MH.get('price');
  var downPct = MH.get('downpct');
  var rate = MH.get('rate');
  var years = MH.get('term');
  var taxAnnual = MH.get('tax');
  var insAnnual = MH.get('ins');
  var hoa = MH.get('hoa');

  var down = price * downPct/100;
  var loan = price - down;
  var pi = MH.monthlyPI(loan, rate, years);

  // PMI: applies when down < 20%; typical 0.5% annual of loan
  var pmi = 0;
  if(downPct < 20 && loan > 0){
    pmi = loan * 0.005 / 12;
  }

  var taxM = taxAnnual/12, insM = insAnnual/12;
  var total = pi + taxM + insM + pmi + hoa;
  var n = Math.round(years*12);
  var totalInterest = pi*n - loan;

  document.getElementById('r-pi').textContent = MH.money2(pi);
  document.getElementById('r-tax').textContent = MH.money2(taxM);
  document.getElementById('r-ins').textContent = MH.money2(insM);
  document.getElementById('r-pmi').textContent = MH.money2(pmi);
  document.getElementById('r-hoa').textContent = MH.money2(hoa);
  document.getElementById('r-total').textContent = MH.money2(total);
  document.getElementById('r-loan').textContent = MH.money(loan);
  document.getElementById('r-down').textContent = MH.money(down);
  document.getElementById('r-interest').textContent = MH.money(totalInterest);
  document.getElementById('out').classList.add('show');
  document.getElementById('out').scrollIntoView({behavior:'smooth',block:'start'});
});
