/* 401(k) projector — pure math (testable) */
function project401k(balance, salary, contribPct, matchPct, matchCapPct, returnPct, years){
  var empAnnual = salary * contribPct/100;
  var erAnnual  = salary * Math.min(contribPct, matchCapPct)/100 * matchPct/100;
  var annual = empAnnual + erAnnual;
  var r = returnPct/100;
  var bal = balance, rows = [], totContrib = 0, totGrowth = 0;
  for(var y=1; y<=years; y++){
    var start = bal;
    var growth = start * r;
    bal = start + growth + annual;      // end-of-year contributions
    totContrib += annual; totGrowth += growth;
    rows.push({year:y, start:start, contrib:annual, growth:growth, end:bal});
  }
  return { rows:rows, empAnnual:empAnnual, erAnnual:erAnnual,
           totalContrib:totContrib, totalGrowth:totGrowth, final:bal };
}

/* ==== DOM wiring ==== */
document.addEventListener('DOMContentLoaded', function(){
  var form = $('k401Form');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var bal = num('kBalance'), sal = num('kSalary'), c = num('kContrib'),
        m = num('kMatch'), cap = num('kMatchCap'), r = num('kReturn'), yrs = num('kYears');
    if(isNaN(bal)||bal<0||!(sal>0)||!(c>=0)||!(m>=0)||!(cap>=0)||!(r>=0)||!(yrs>=1)||yrs>50){
      setError('k401Results','Please enter valid numbers (projection length 1–50 years).');
      return;
    }
    var p = project401k(bal, sal, c, m, cap, r, Math.round(yrs));
    var html = '<div class="result-hero"><div class="lbl">Projected balance</div><div class="big">'+money(p.final)+'</div></div>' +
      '<div class="stat-row"><span class="k">Your contributions/yr</span><span class="v">'+money(p.empAnnual)+'</span></div>' +
      '<div class="stat-row"><span class="k">Employer match/yr</span><span class="v">'+money(p.erAnnual)+'</span></div>' +
      '<div class="stat-row"><span class="k">Total contributions</span><span class="v">'+money(p.totalContrib + bal)+'</span></div>' +
      '<div class="stat-row"><span class="k">Total investment growth</span><span class="v">'+money(p.totalGrowth)+'</span></div>';
    /* Growth-over-time stacked bars at 5-year marks */
    html += '<h3 style="margin-top:22px">Growth over time</h3><div class="bar-legend"><span><i style="background:#12365e"></i>Contributions</span><span><i style="background:#c9a227"></i>Growth</span></div>';
    var cumC = bal, cumG = 0;
    for(var i=0;i<p.rows.length;i++){
      cumC += p.rows[i].contrib; cumG += p.rows[i].growth;
      if((i+1)%5===0 || i===p.rows.length-1){
        var tot = cumC+cumG, pc = tot>0? (cumC/tot*100):0;
        html += '<div class="bar-row"><span>Year '+(i+1)+'</span><div class="bar-track">' +
          '<div class="bar-seg" style="width:'+pc.toFixed(1)+'%;background:#12365e"></div>' +
          '<div class="bar-seg" style="width:'+(100-pc).toFixed(1)+'%;background:#c9a227"></div></div>' +
          '<span>'+money(tot)+'</span></div>';
      }
    }
    /* Year-by-year table */
    html += '<h3 style="margin-top:22px">Year-by-year projection</h3><div class="table-wrap"><table><thead><tr><th>Year</th><th>Start</th><th>Contributions</th><th>Growth</th><th>End</th></tr></thead><tbody>';
    p.rows.forEach(function(row){
      html += '<tr><td>'+row.year+'</td><td>'+money(row.start)+'</td><td>'+money(row.contrib)+'</td><td>'+money(row.growth)+'</td><td><strong>'+money(row.end)+'</strong></td></tr>';
    });
    html += '</tbody></table></div>';
    $('k401Results').innerHTML = html;
  });
});
