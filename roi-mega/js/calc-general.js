// General ROI calculator
// ROI% = (gain - cost) / cost * 100
// Annualized ROI = (1 + ROI_decimal)^(1/years) - 1
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('calc-btn');
  if(!btn) return;
  btn.addEventListener('click', function(){
    var cost = num('cost'), gain = num('gain'), years = num('years');
    var out = document.getElementById('results');
    if(cost <= 0){ out.innerHTML = '<p>Please enter an investment amount greater than zero.</p>'; return; }
    var profit = gain - cost;
    var roi = (profit / cost) * 100;
    var ann = null;
    if(years > 0){ ann = (Math.pow(1 + roi/100, 1/years) - 1) * 100; }
    var cls = profit >= 0 ? 'positive' : 'negative';
    var html = '<div class="big-result"><div class="l">Return on Investment</div><div class="n '+cls+'">' + fmtPct(roi) + '</div></div>';
    html += '<div class="result-row"><span class="lbl">Investment (cost)</span><span class="val">' + fmtMoney(cost) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Total return (gain)</span><span class="val">' + fmtMoney(gain) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Net profit / loss</span><span class="val '+cls+'">' + fmtMoney(profit) + '</span></div>';
    if(ann !== null){
      html += '<div class="result-row"><span class="lbl">Annualized ROI (over ' + years + ' yr)</span><span class="val '+(ann>=0?'positive':'negative')+'">' + fmtPct(ann) + '</span></div>';
    }
    html += '<div class="result-row"><span class="lbl">Return per $1 invested</span><span class="val">' + fmtMoney(gain/cost) + '</span></div>';
    out.innerHTML = html;
  });
});
