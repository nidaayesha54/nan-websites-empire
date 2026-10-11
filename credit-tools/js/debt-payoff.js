/* Avalanche vs snowball debt payoff simulator — pure math (testable).
   debts: [{balance, apr, minPay}], extraMonthly: number, strategy: 'avalanche'|'snowball' */
function simulatePayoff(debts, extraMonthly, strategy){
  var order = debts.map(function(_,i){ return i; }).sort(function(a,b){
    return strategy==='snowball' ? debts[a].balance - debts[b].balance
                                 : debts[b].apr - debts[a].apr;
  });
  var bal = debts.map(function(d){ return d.balance; });
  var month = 0, totalInterest = 0, totalPaid = 0;
  var paidOffAt = debts.map(function(){ return 0; });
  while(bal.some(function(b){ return b > 0.005; }) && month < 1200){
    month++;
    var i;
    for(i=0;i<bal.length;i++){                       // accrue interest
      if(bal[i] > 0.005){ var it = bal[i]*debts[i].apr/100/12; bal[i]+=it; totalInterest+=it; }
    }
    for(i=0;i<bal.length;i++){                       // minimums on all
      if(bal[i] > 0.005){ var p = Math.min(debts[i].minPay, bal[i]); bal[i]-=p; totalPaid+=p; }
    }
    var extra = extraMonthly;                        // extra cascades down priority order
    for(var k=0;k<order.length;k++){
      if(extra <= 0) break;
      i = order[k];
      if(bal[i] > 0.005){ var q = Math.min(extra, bal[i]); bal[i]-=q; totalPaid+=q; extra-=q; }
    }
    for(i=0;i<bal.length;i++){
      if(bal[i] <= 0.005 && !paidOffAt[i]) paidOffAt[i] = month;
    }
  }
  var done = !bal.some(function(b){ return b > 0.005; });
  return { months:month, totalInterest:totalInterest, totalPaid:totalPaid,
           paidOffAt:paidOffAt, done:done };
}

/* ==== DOM wiring ==== */
document.addEventListener('DOMContentLoaded', function(){
  var form = $('debtForm');
  if(!form) return;
  var list = $('debtList');

  function addRow(bal, apr, min){
    if(list.children.length >= 8) return;
    var div = document.createElement('div');
    div.className = 'debt-row';
    div.innerHTML =
      '<div><label class="hint">Balance ($)</label><input type="number" class="d-bal" min="1" step="1" value="'+(bal||'')+'" placeholder="5,000"></div>' +
      '<div><label class="hint">APR (%)</label><input type="number" class="d-apr" min="0" step="0.01" value="'+(apr||'')+'" placeholder="19.99"></div>' +
      '<div><label class="hint">Min payment ($)</label><input type="number" class="d-min" min="1" step="1" value="'+(min||'')+'" placeholder="100"></div>' +
      '<div><button type="button" class="btn btn-small btn-outline d-del" style="color:var(--bad);border-color:var(--bad)">✕</button></div>';
    div.querySelector('.d-del').addEventListener('click', function(){ div.remove(); });
    list.appendChild(div);
  }

  $('addDebt').addEventListener('click', function(){ addRow(); });
  /* starter example so the tool works instantly */
  addRow(6500, 22.99, 130); addRow(3200, 18.5, 75); addRow(1200, 12.9, 40);

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var debts = [];
    Array.prototype.forEach.call(list.querySelectorAll('.debt-row'), function(row, i){
      var b = parseFloat(row.querySelector('.d-bal').value),
          a = parseFloat(row.querySelector('.d-apr').value),
          m = parseFloat(row.querySelector('.d-min').value);
      if(b>0 && a>=0 && m>0) debts.push({name:'Debt '+(i+1), balance:b, apr:a, minPay:m});
    });
    var extra = num('extraPay')||0;
    var box = $('debtResults');
    if(debts.length === 0){ setError('debtResults','Add at least one debt with a balance, APR, and minimum payment.'); return; }
    if(extra < 0){ setError('debtResults','Extra payment cannot be negative.'); return; }
    var av = simulatePayoff(debts, extra, 'avalanche');
    var sn = simulatePayoff(debts, extra, 'snowball');
    function card(title, r){
      var h = '<div class="card" style="flex:1"><h3>'+title+'</h3>';
      if(!r.done){ h += '<div class="verdict bad">Minimum payments don\'t cover the interest — this plan never finishes. Raise payments or the extra amount.</div>'; }
      else {
        h += '<div class="stat-row"><span class="k">Debt-free in</span><span class="v">'+r.months+' months ('+(r.months/12).toFixed(1)+' yrs)</span></div>' +
             '<div class="stat-row"><span class="k">Total interest</span><span class="v">'+money(r.totalInterest)+'</span></div>' +
             '<div class="stat-row"><span class="k">Total paid</span><span class="v">'+money(r.totalPaid)+'</span></div>';
      }
      return h + '</div>';
    }
    var html = '<div style="display:flex;gap:16px;flex-wrap:wrap">' + card('⚡ Avalanche (highest APR first)', av) + card('⛄ Snowball (smallest balance first)', sn) + '</div>';
    if(av.done && sn.done){
      var saveI = sn.totalInterest - av.totalInterest, saveM = sn.months - av.months;
      if(saveI > 1){ html += '<div class="verdict good">🏆 Avalanche wins: saves '+money(saveI)+' in interest'+(saveM>0?' and '+saveM+' months':'')+' vs snowball. Snowball still wins psychologically — quick wins keep many people motivated.</div>'; }
      else if(saveI < -1){ html += '<div class="verdict good">🏆 Snowball wins here: saves '+money(-saveI)+' in interest vs avalanche.</div>'; }
      else { html += '<div class="verdict good">It\'s a tie on interest ('+money(av.totalInterest)+' each). Pick snowball for faster first wins.</div>'; }
    }
    box.innerHTML = html;
  });
});
