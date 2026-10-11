/* CSV Viewer — parse, sortable table, export */
(function () {
  var ta = document.getElementById('csv');
  var wrap = document.getElementById('wrap');
  var expBtn = document.getElementById('exp');
  var data = []; // rows of cells
  var sortC = -1, sortD = 1;

  function parseCSV(text) {
    var rows = [], row = [], cur = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"') {
          if (text[i + 1] === '"') { cur += '"'; i++; }
          else q = false;
        } else cur += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cur); cur = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cur); cur = '';
        if (row.length > 1 || row[0] !== '') rows.push(row);
        row = [];
      } else cur += c;
    }
    row.push(cur);
    if (row.length > 1 || row[0] !== '') rows.push(row);
    return rows;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function render() {
    wrap.innerHTML = '';
    if (!data.length) return;
    var t = document.createElement('table');
    t.className = 'data';
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    data[0].forEach(function (h, ci) {
      var th = document.createElement('th');
      th.innerHTML = esc(h) + (sortC === ci ? (sortD === 1 ? ' ▲' : ' ▼') : '');
      th.addEventListener('click', function () {
        if (sortC === ci) sortD *= -1; else { sortC = ci; sortD = 1; }
        sortRows(); render();
      });
      tr.appendChild(th);
    });
    thead.appendChild(tr); t.appendChild(thead);
    var tb = document.createElement('tbody');
    data.slice(1).forEach(function (r) {
      var tr2 = document.createElement('tr');
      data[0].forEach(function (_, ci) {
        var td = document.createElement('td');
        td.textContent = r[ci] === undefined ? '' : r[ci];
        tr2.appendChild(td);
      });
      tb.appendChild(tr2);
    });
    t.appendChild(tb); wrap.appendChild(t);
    expBtn.style.display = 'inline-block';
  }

  function sortRows() {
    var head = data[0], body = data.slice(1);
    body.sort(function (a, b) {
      var va = a[sortC] || '', vb = b[sortC] || '';
      var na = parseFloat(va), nb = parseFloat(vb);
      var cmp = (!isNaN(na) && !isNaN(nb)) ? na - nb : String(va).localeCompare(String(vb));
      return cmp * sortD;
    });
    data = [head].concat(body);
  }

  document.getElementById('go').addEventListener('click', function () {
    data = parseCSV(ta.value);
    sortC = -1; sortD = 1;
    if (!data.length) { wrap.innerHTML = '<p style="color:var(--muted)">No data found. Paste CSV above.</p>'; return; }
    render();
  });
  document.getElementById('sample').addEventListener('click', function () {
    ta.value = 'name,age,city\nAli,28,"Lahore, Pakistan"\nSara,31,Karachi\nUsman,25,Islamabad';
  });
  expBtn.addEventListener('click', function () {
    var csv = data.map(function (r) {
      return r.map(function (c) {
        c = String(c === undefined ? '' : c);
        return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c;
      }).join(',');
    }).join('\n');
    var blob = new Blob([csv], { type: 'text/csv' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'table.csv';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  });
})();
