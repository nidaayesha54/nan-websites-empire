/* Mortgage / PITI calculator — pure math (testable).
   mortgagePayment() comes from js/main.js */
function calcPITI(homePrice, downPct, ratePct, years, annualTax, annualIns, monthlyPMI){
  var down = homePrice * downPct/100;
  var principal = homePrice - down;
  var pi = mortgagePayment(principal, ratePct, years);
  var tax = annualTax/12, ins = annualIns/12;
  var total = pi + tax + ins + monthlyPMI;
  var n = Math.round(years*12);
  var totalInterest = pi*n - principal;
  return { down:down, principal:principal, pi:pi, tax:tax, ins:ins,
           pmi:monthlyPMI, total:total, totalInterest:totalInterest };
}

/* ==== DOM wiring ==== */
document.addEventListener('DOMContentLoaded', function(){
  var form = $('mtgForm');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var price = num('homePrice'), downP = num('downPct'), rate = num('mtgRate'),
        yrs = parseFloat($('mtgTerm').value), tax = num('propTax')||0,
        ins = num('homeIns')||0, pmi = num('pmi')||0;
    if(!(price>0)||!(downP>=0)||downP>=100||!(rate>=0)||!(tax>=0)||!(ins>=0)||!(pmi>=0)){
      setError('mtgResults','Please enter valid numbers (down payment under 100%).');
      return;
    }
    var c = calcPITI(price, downP, rate, yrs, tax, ins, pmi);
    var parts = [
      {label:'Principal & interest', val:c.pi, color:'#1f5fae'},
      {label:'Property tax', val:c.tax, color:'#2f80ed'},
      {label:'Home insurance', val:c.ins, color:'#7aa7e8'},
      {label:'PMI', val:c.pmi, color:'#f0a13c'}
    ];
    var html = '<div class="result-hero"><div class="lbl">Monthly payment (PITI)</div><div class="big">'+money(c.total)+'</div></div>';
    parts.forEach(function(p){
      var w = c.total>0 ? (p.val/c.total*100) : 0;
      html += '<div class="bar-row"><span>'+p.label+'</span><div class="bar-track"><div class="bar-seg" style="width:'+w.toFixed(1)+'%;background:'+p.color+'"></div></div><span>'+money(p.val)+'</span></div>';
    });
    html += '<div class="stat-row"><span class="k">Loan amount</span><span class="v">'+money(c.principal)+'</span></div>' +
      '<div class="stat-row"><span class="k">Down payment ('+downP+'%)</span><span class="v">'+money(c.down)+'</span></div>' +
      '<div class="stat-row"><span class="k">Total interest over '+yrs+' years</span><span class="v">'+money(c.totalInterest)+'</span></div>' +
      '<div class="formula">M = P·r(1+r)<sup>n</sup> / ((1+r)<sup>n</sup> − 1), &nbsp; r = '+rate+'% ÷ 12, &nbsp; n = '+yrs+' × 12</div>';
    $('mtgResults').innerHTML = html;
  });
});
