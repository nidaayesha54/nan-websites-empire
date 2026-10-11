// CSV Analyzer logic
(function(){
  var fileInput = document.getElementById('file');
  var results = document.getElementById('results');

  fileInput.addEventListener('change', function(){
    var f = fileInput.files[0];
    if(!f) return;
    var reader = new FileReader();
    reader.onload = function(e){ analyze(e.target.result); };
    reader.readAsText(f);
  });

  document.getElementById('sample').addEventListener('click', function(e){
    e.preventDefault();
    var sample = 'name,age,salary,department\nAlice,28,72000,Engineering\nBob,35,85000,Marketing\nCarol,29,78000,Engineering\nDave,41,95000,Sales\nEve,33,81000,Marketing\nFrank,26,65000,Engineering\nGrace,38,90000,Sales\nHenry,31,76000,Marketing\nIvy,27,69000,Engineering\nJack,44,105000,Sales\nKate,36,88000,Marketing\nLeo,30,74000,Engineering';
    analyze(sample);
  });

  function analyze(text){
    var parsed = parseCSV(text);
    var headers = parsed.headers, rows = parsed.rows;
    if(!headers.length){ return; }

    document.getElementById('st-rows').textContent = rows.length.toLocaleString();
    document.getElementById('st-cols').textContent = headers.length;

    // detect numeric columns (at least 50% of non-empty values numeric)
    var numCols = [];
    for(var c=0;c<headers.length;c++){
      var vals = [];
      for(var r=0;r<rows.length;r++){
        var v = rows[r][c];
        if(v!==undefined && String(v).trim()!=='') vals.push(v);
      }
      var numeric = vals.filter(isNumeric).map(toNum);
      if(numeric.length>=Math.max(1,Math.ceil(vals.length*0.5))){
        numCols.push({index:c, name:headers[c]||('Column '+(c+1)), stats:statsOf(numeric)});
      }
    }
    document.getElementById('st-num').textContent = numCols.length;

    var html = '<table><tr><th>Column</th><th>Count</th><th>Mean</th><th>Median</th><th>Min</th><th>Max</th></tr>';
    numCols.forEach(function(col){
      var s = col.stats;
      html += '<tr><td>'+escapeHtml(col.name)+'</td><td>'+s.n.toLocaleString()+'</td><td>'+round2(s.mean)+
        '</td><td>'+round2(s.median)+'</td><td>'+round2(s.min)+'</td><td>'+round2(s.max)+'</td></tr>';
    });
    html += '</table>';
    document.getElementById('num-table').innerHTML = numCols.length ? html :
      '<p style="color:var(--muted)">No numeric columns detected.</p>';

    var ph = '<table><tr>';
    headers.forEach(function(h){ ph += '<th>'+escapeHtml(h)+'</th>'; });
    ph += '</tr>';
    rows.slice(0,10).forEach(function(row){
      ph += '<tr>';
      for(var c=0;c<headers.length;c++){ ph += '<td>'+escapeHtml(row[c]!==undefined?row[c]:'')+'</td>'; }
      ph += '</tr>';
    });
    ph += '</table>';
    document.getElementById('preview').innerHTML = ph;

    results.style.display = 'block';
    results.scrollIntoView({behavior:'smooth'});
  }

  function round2(v){
    if(!isFinite(v)) return '—';
    return Math.abs(v)>=1000 ? Number(v.toFixed(0)).toLocaleString() : String(Math.round(v*100)/100);
  }
})();
