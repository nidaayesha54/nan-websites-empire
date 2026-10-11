// Business investment ROI calculator
// Monthly profit = monthlyRevenue - monthlyCost
// Annual profit = monthlyProfit * 12
// Payback months = startupCost / monthlyProfit
// Annual ROI% = annualProfit / startupCost * 100
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('calc-btn');
  if(!btn) return;
  btn.addEventListener('click', function(){
    var startup = num('startup'), rev = num('rev'), cost = num('cost');
    var out = document.getElementById('results');
    if(startup <= 0){ out.innerHTML = '<p>Please enter a startup investment greater than zero.</p>'; return; }
    var mProfit = rev - cost;
    var aProfit = mProfit * 12;
    var roi = (aProfit / startup) * 100;
    var payback = mProfit > 0 ? startup / mProfit : null;
    var html = '<div class="big-result"><div class="l">Annual ROI</div><div class="n '+(roi>=0?'positive':'negative')+'">' + fmtPct(roi) + '</div></div>';
    html += '<div class="result-row"><span class="lbl">Startup investment</span><span class="val">' + fmtMoney(startup) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Monthly revenue</span><span class="val">' + fmtMoney(rev) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Monthly operating cost</span><span class="val">' + fmtMoney(cost) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Monthly profit</span><span class="val '+(mProfit>=0?'positive':'negative')+'">' + fmtMoney(mProfit) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Annual profit</span><span class="val '+(aProfit>=0?'positive':'negative')+'">' + fmtMoney(aProfit) + '</span></div>';
    if(payback !== null){
      var yrs = Math.floor(payback / 12), mos = Math.round(payback % 12);
      html += '<div class="result-row"><span class="lbl">Payback period</span><span class="val">' + (yrs > 0 ? yrs + ' yr ' : '') + mos + ' months</span></div>';
    } else {
      html += '<div class="result-row"><span class="lbl">Payback period</span><span class="val negative">Never (monthly loss)</span></div>';
    }
    out.innerHTML = html;
  });
});
