// Rental property ROI calculator
// NOI = (rent*12) - (expenses*12)
// Cap rate = NOI / price * 100
// Cash invested = downPayment + closing
// Cash-on-cash = NOI / cashInvested * 100
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('calc-btn');
  if(!btn) return;
  btn.addEventListener('click', function(){
    var price = num('price'), rent = num('rent'), expenses = num('expenses'),
        down = num('down'), closing = num('closing');
    var out = document.getElementById('results');
    if(price <= 0 || rent <= 0){ out.innerHTML = '<p>Please enter a property price and monthly rent greater than zero.</p>'; return; }
    var annualRent = rent * 12;
    var annualExp = expenses * 12;
    var noi = annualRent - annualExp;
    var cap = (noi / price) * 100;
    var cash = down + closing;
    var coc = cash > 0 ? (noi / cash) * 100 : null;
    var html = '<div class="big-result"><div class="l">Cap Rate</div><div class="n">' + fmtPct(cap) + '</div></div>';
    html += '<div class="result-row"><span class="lbl">Annual rental income</span><span class="val">' + fmtMoney(annualRent) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Annual expenses</span><span class="val">' + fmtMoney(annualExp) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Net operating income (NOI)</span><span class="val '+(noi>=0?'positive':'negative')+'">' + fmtMoney(noi) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Monthly cash flow</span><span class="val '+(noi>=0?'positive':'negative')+'">' + fmtMoney(noi/12) + '</span></div>';
    if(coc !== null){
      html += '<div class="result-row"><span class="lbl">Cash invested</span><span class="val">' + fmtMoney(cash) + '</span></div>';
      html += '<div class="result-row"><span class="lbl">Cash-on-cash return</span><span class="val '+(coc>=0?'positive':'negative')+'">' + fmtPct(coc) + '</span></div>';
    }
    out.innerHTML = html;
  });
});
