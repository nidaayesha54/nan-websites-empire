// Marketing campaign ROI calculator
// Customers = leads * conversionRate/100
// Revenue = customers * dealSize
// Profit = revenue - spend ; ROI% = profit / spend * 100
// CPL = spend / leads ; CPA = spend / customers
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('calc-btn');
  if(!btn) return;
  btn.addEventListener('click', function(){
    var spend = num('spend'), leads = num('leads'), conv = num('conv'), deal = num('deal');
    var out = document.getElementById('results');
    if(spend <= 0 || leads <= 0){ out.innerHTML = '<p>Please enter a campaign spend and lead count greater than zero.</p>'; return; }
    var customers = leads * conv / 100;
    var revenue = customers * deal;
    var profit = revenue - spend;
    var roi = (profit / spend) * 100;
    var cpl = spend / leads;
    var cpa = customers > 0 ? spend / customers : null;
    var cls = profit >= 0 ? 'positive' : 'negative';
    var html = '<div class="big-result"><div class="l">Campaign ROI</div><div class="n '+cls+'">' + fmtPct(roi) + '</div></div>';
    html += '<div class="result-row"><span class="lbl">Campaign spend</span><span class="val">' + fmtMoney(spend) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Leads generated</span><span class="val">' + leads.toLocaleString('en-US') + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Customers won (' + conv + '% conv.)</span><span class="val">' + customers.toLocaleString('en-US',{maximumFractionDigits:1}) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Revenue generated</span><span class="val">' + fmtMoney(revenue) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Net profit / loss</span><span class="val '+cls+'">' + fmtMoney(profit) + '</span></div>';
    html += '<div class="result-row"><span class="lbl">Cost per lead (CPL)</span><span class="val">' + fmtMoney(cpl) + '</span></div>';
    if(cpa !== null){ html += '<div class="result-row"><span class="lbl">Cost per acquisition (CPA)</span><span class="val">' + fmtMoney(cpa) + '</span></div>'; }
    out.innerHTML = html;
  });
});
