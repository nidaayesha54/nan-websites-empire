// Data Cleaner logic
(function(){
  var cleaned = [];

  document.getElementById('clean').addEventListener('click', clean);
  document.getElementById('dl').addEventListener('click', function(){
    if(!cleaned.length) return;
    var csv = cleaned.map(function(line){
      return /[",\n]/.test(line) ? '"'+line.replace(/"/g,'""')+'"' : line;
    }).join('\n');
    downloadFile('cleaned-data.csv', csv, 'text/csv');
  });
  clean();

  function clean(){
    var lines = document.getElementById('raw').value.split('\n');
    var doTrim = document.getElementById('opt-trim').checked;
    var doEmpty = document.getElementById('opt-empty').checked;
    var doDedupe = document.getElementById('opt-dedupe').checked;
    var caseInsensitive = document.getElementById('opt-casededupe').checked;
    var casing = document.getElementById('opt-case').value;

    var out = [];
    lines.forEach(function(line){
      if(doTrim) line = line.trim();
      if(doEmpty && line==='') return;
      out.push(line);
    });

    out = out.map(function(line){ return applyCase(line, casing); });

    if(doDedupe){
      var seen = {};
      out = out.filter(function(line){
        var k = caseInsensitive ? line.toLowerCase() : line;
        if(seen[k]) return false;
        seen[k] = true;
        return true;
      });
    }

    cleaned = out;
    document.getElementById('c-in').textContent = lines.length;
    document.getElementById('c-out').textContent = out.length;
    document.getElementById('c-removed').textContent = lines.length - out.length;
    document.getElementById('result').value = out.join('\n');
    document.getElementById('out').style.display = 'block';
    document.getElementById('dl').disabled = !out.length;
  }

  function applyCase(s, mode){
    if(mode==='lower') return s.toLowerCase();
    if(mode==='upper') return s.toUpperCase();
    if(mode==='title') return s.toLowerCase().replace(/(?:^|[\s\-'])\S/g, function(m){ return m.toUpperCase(); });
    if(mode==='sentence'){ var t=s.toLowerCase(); return t.charAt(0).toUpperCase()+t.slice(1); }
    return s;
  }
})();
