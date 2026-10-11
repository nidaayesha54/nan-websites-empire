// Ad ROI / ROAS calculator
// ROAS = revenue / adSpend
// ROI% = (revenue - adSpend) / adSpend * 100
// Break-even ROAS = 1 (revenue equals spend)
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('calc-btn');
  if(!btn) return;
  btn.addEventListener('click', function(){
    var spend = num('spend'), revenue = num('revenue');
    var out = document.getElementById('results');
    if(spend <= 0){ out.innerHTML = '<p>Please enter an ad spend greater than zero.</p>'; return; }
    var roas = revenue / spend;
    var profit = revenue - spend;
    var roi = (profit / spend) * 100;
    var cpl = num('leads') > 0 ? spend / num('leads') : null;
    var cls = profit >= 0 ? 'positive' : 'negative';
    var html = '<div class="big-result"><div class="l">ROAS (Return on Ad Spend)</div><div class="n">' + roas.toFixed(2) + 'x</div></div>';
    html += '<div class="result-row"><span class="lbl">Ad spend</span><span class="val">' + fmtMoney(spend) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Revenue generated</span><span class="val">' + fmtMoney(revenue) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Net profit / loss</span><span class="val '+cls+'">' + fmtMoney(profit) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">ROI</span><span class="val '+cls+'">' + fmtPct(roi) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Break-even ROAS</span><span class="val">1.00x (revenue = spend)</span></div>';
    if(cpl !== null){ html += '<div class="result-row"><span class="lbl">Cost per lead</span><span class="val">' + fmtMoney(cpl) + '</span></div>'; }
    out.innerHTML = html;
  });
});
