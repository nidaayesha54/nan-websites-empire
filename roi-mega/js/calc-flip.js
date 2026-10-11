// House flip ROI calculator
// Total cost = purchase + renovation + holding + selling costs
// Selling costs = sellPrice * sellCostPct / 100
// Net profit = sellPrice - totalCost ; ROI% = netProfit / totalCost * 100
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('calc-btn');
  if(!btn) return;
  btn.addEventListener('click', function(){
    var purchase = num('purchase'), reno = num('reno'), holding = num('holding'),
        sellPrice = num('sellprice'), sellCostPct = num('sellcostpct');
    var out = document.getElementById('results');
    if(purchase <= 0 || sellPrice <= 0){ out.innerHTML = '<p>Please enter a purchase price and sale price greater than zero.</p>'; return; }
    var sellCosts = sellPrice * sellCostPct / 100;
    var totalCost = purchase + reno + holding + sellCosts;
    var profit = sellPrice - totalCost;
    var roi = (profit / totalCost) * 100;
    var cls = profit >= 0 ? 'positive' : 'negative';
    var html = '<div class="big-result"><div class="l">Flip Profit</div><div class="n '+cls+'">' + fmtMoney(profit) + '</div></div>';
    html += '<div class="result-row"><span class="lbl">Total project cost</span><span class="val">' + fmtMoney(totalCost) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">&nbsp;&nbsp;— Purchase</span><span class="val">' + fmtMoney(purchase) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">&nbsp;&nbsp;— Renovation</span><span class="val">' + fmtMoney(reno) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">&nbsp;&nbsp;— Holding costs</span><span class="val">' + fmtMoney(holding) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">&nbsp;&nbsp;— Selling costs (' + sellCostPct + '%)</span><span class="val">' + fmtMoney(sellCosts) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Sale price</span><span class="val">' + fmtMoney(sellPrice) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">ROI on total cost</span><span class="val '+cls+'">' + fmtPct(roi) + '</span></div>';
    out.innerHTML = html;
  });
});
