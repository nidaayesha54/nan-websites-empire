// Shared helpers: FAQ accordion + footer year
(function(){
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    if(q){ q.addEventListener('click', function(){ item.classList.toggle('open'); }); }
  });
  var y = document.getElementById('year');
  if(y){ y.textContent = new Date().getFullYear(); }
})();

// Parse CSV text into {headers:[], rows:[[]]}, handles quoted commas
function parseCSV(text){
  var rows=[], row=[], field='', inQuotes=false;
  for(var i=0;i<text.length;i++){
    var c=text[i], n=text[i+1];
    if(inQuotes){
      if(c==='"'){ if(n==='"'){ field+='"'; i++; } else { inQuotes=false; } }
      else { field+=c; }
    } else {
      if(c==='"'){ inQuotes=true; }
      else if(c===','){ row.push(field); field=''; }
      else if(c==='\n'){ row.push(field); rows.push(row); row=[]; field=''; }
      else if(c==='\r'){ /* skip */ }
      else { field+=c; }
    }
  }
  row.push(field); rows.push(row);
  // drop trailing empty row
  while(rows.length && rows[rows.length-1].length===1 && rows[rows.length-1][0]===''){
    rows.pop();
  }
  var headers = rows.length ? rows[0] : [];
  var data = rows.length>1 ? rows.slice(1) : [];
  return {headers:headers, rows:data};
}

function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function downloadFile(filename, content, mime){
  var blob = new Blob([content], {type: mime || 'text/plain'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

function isNumeric(v){
  if(v===null||v===undefined) return false;
  var s=String(v).trim().replace(/[$,%]/g,'');
  return s!=='' && !isNaN(Number(s));
}
function toNum(v){ return Number(String(v).trim().replace(/[$,%]/g,'')); }

// Statistics core (population formulas, labeled as such on pages)
function statsOf(values){
  var n=values.length;
  if(!n) return null;
  var sorted=values.slice().sort(function(a,b){return a-b;});
  var sum=values.reduce(function(a,b){return a+b;},0);
  var mean=sum/n;
  var mid=Math.floor(n/2);
  var median = n%2 ? sorted[mid] : (sorted[mid-1]+sorted[mid])/2;
  var freq={}, maxF=0;
  values.forEach(function(v){ freq[v]=(freq[v]||0)+1; if(freq[v]>maxF) maxF=freq[v]; });
  var modes=Object.keys(freq).filter(function(k){return freq[k]===maxF && maxF>1;}).map(Number);
  var variance=values.reduce(function(a,b){return a+(b-mean)*(b-mean);},0)/n; // population
  var std=Math.sqrt(variance);
  function pct(p){
    if(n===1) return sorted[0];
    var rank=(p/100)*(n-1), lo=Math.floor(rank), hi=Math.ceil(rank);
    return sorted[lo]+(sorted[hi]-sorted[lo])*(rank-lo); // linear interpolation
  }
  return {n:n,sum:sum,mean:mean,median:median,modes:modes,min:sorted[0],max:sorted[n-1],
    range:sorted[n-1]-sorted[0],variance:variance,std:std,q1:pct(25),q3:pct(75),p90:pct(90),p95:pct(95)};
}
