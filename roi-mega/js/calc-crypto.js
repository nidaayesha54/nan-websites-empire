// Crypto ROI calculator
// Buy cost = buyPrice * amount + buyFee
// Sell value = sellPrice * amount - sellFee
// Profit = sellValue - buyCost ; ROI% = profit / buyCost * 100
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('calc-btn');
  if(!btn) return;
  btn.addEventListener('click', function(){
    var buy = num('buy'), sell = num('sell'), amount = num('amount'),
        buyFee = num('buyfee'), sellFee = num('sellfee');
    var out = document.getElementById('results');
    if(buy <= 0 || amount <= 0){ out.innerHTML = '<p>Please enter a buy price and amount greater than zero.</p>'; return; }
    var buyCost = buy * amount + buyFee;
    var sellValue = sell * amount - sellFee;
    var profit = sellValue - buyCost;
    var roi = (profit / buyCost) * 100;
    var cls = profit >= 0 ? 'positive' : 'negative';
    var html = '<div class="big-result"><div class="l">Crypto ' + (profit>=0?'Profit':'Loss') + '</div><div class="n '+cls+'">' + fmtMoney(profit) + '</div></div>';
    html += '<div class="result-row"><span class="lbl">Total buy cost (incl. fees)</span><span class="val">' + fmtMoney(buyCost) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Total sell value (after fees)</span><span class="val">' + fmtMoney(sellValue) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">ROI</span><span class="val '+cls+'">' + fmtPct(roi) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Price change per coin</span><span class="val '+(sell-buy>=0?'positive':'negative')+'">' + fmtPct(((sell-buy)/buy)*100) + '</span></div>';
    out.innerHTML = html;
  });
});
