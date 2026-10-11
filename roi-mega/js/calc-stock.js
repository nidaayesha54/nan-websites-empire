// Stock ROI calculator
// Invested = buyPrice * shares + fees
// Proceeds = sellPrice * shares + dividends - fees
// Return = Proceeds - Invested ; ROI% = Return / Invested * 100
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('calc-btn');
  if(!btn) return;
  btn.addEventListener('click', function(){
    var buy = num('buy'), sell = num('sell'), shares = num('shares'),
        div = num('div'), fees = num('fees');
    var out = document.getElementById('results');
    if(buy <= 0 || shares <= 0){ out.innerHTML = '<p>Please enter a buy price and share count greater than zero.</p>'; return; }
    var invested = buy * shares + fees;
    var proceeds = sell * shares + div - fees;
    var ret = proceeds - invested;
    var roi = (ret / invested) * 100;
    var cls = ret >= 0 ? 'positive' : 'negative';
    var html = '<div class="big-result"><div class="l">Stock ROI</div><div class="n '+cls+'">' + fmtPct(roi) + '</div></div>';
    html += '<div class="result-row"><span class="lbl">Total invested</span><span class="val">' + fmtMoney(invested) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Total proceeds (sale + dividends)</span><span class="val">' + fmtMoney(proceeds) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Net gain / loss</span><span class="val '+cls+'">' + fmtMoney(ret) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Gain per share</span><span class="val '+(sell-buy>=0?'positive':'negative')+'">' + fmtMoney(sell - buy) + '</span></div>';
    out.innerHTML = html;
  });
});
