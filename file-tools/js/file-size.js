/* File Size Analyzer */
(function () {
  var drop = document.getElementById('drop');
  var fileInput = document.getElementById('file');
  var rows = document.getElementById('rows');
  var tbl = document.getElementById('tbl');
  var countEl = document.getElementById('count');
  var totalEl = document.getElementById('total');
  var bigEl = document.getElementById('biggest');
  var files = [];
  var sortK = 'size', sortD = -1;

  function fmt(b) {
    if (b === 0) return '0 B';
    var u = ['B', 'KB', 'MB', 'GB', 'TB'], i = Math.floor(Math.log(b) / Math.log(1024));
    return (b / Math.pow(1024, i)).toFixed(i ? 1 : 0) + ' ' + u[i];
  }
  function ext(f) {
    var m = /\.([a-z0-9]{1,8})$/i.exec(f.name);
    return m ? m[1].toUpperCase() : (f.type ? f.type.split('/')[1].toUpperCase() : '—');
  }

  drop.addEventListener('click', function () { fileInput.click(); });
  drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', function () { drop.classList.remove('over'); });
  drop.addEventListener('drop', function (e) {
    e.preventDefault(); drop.classList.remove('over');
    add(Array.prototype.slice.call(e.dataTransfer.files));
  });
  fileInput.addEventListener('change', function () {
    add(Array.prototype.slice.call(fileInput.files));
    fileInput.value = '';
  });
  document.getElementById('clear').addEventListener('click', function () { files = []; render(); });

  function add(list) { files = files.concat(list); render(); }

  function render() {
    rows.innerHTML = '';
    if (!files.length) { tbl.style.display = 'none'; countEl.textContent = '0 files'; totalEl.textContent = 'Total: 0 B'; bigEl.textContent = 'Largest: —'; return; }
    tbl.style.display = 'table';
    var sorted = files.slice().sort(function (a, b) {
      var va = sortK === 'name' ? a.name.toLowerCase() : sortK === 'type' ? ext(a) : a.size;
      var vb = sortK === 'name' ? b.name.toLowerCase() : sortK === 'type' ? ext(b) : b.size;
      return (va < vb ? -1 : va > vb ? 1 : 0) * sortD;
    });
    sorted.forEach(function (f) {
      var tr = document.createElement('tr');
      [f.name, ext(f), fmt(f.size)].forEach(function (t) {
        var td = document.createElement('td'); td.textContent = t; tr.appendChild(td);
      });
      rows.appendChild(tr);
    });
    var total = files.reduce(function (s, f) { return s + f.size; }, 0);
    var big = files.reduce(function (m, f) { return f.size > m.size ? f : m; }, files[0]);
    countEl.textContent = files.length + (files.length === 1 ? ' file' : ' files');
    totalEl.textContent = 'Total: ' + fmt(total);
    bigEl.textContent = 'Largest: ' + big.name + ' (' + fmt(big.size) + ')';
  }

  var heads = tbl.querySelectorAll('th');
  heads.forEach(function (h) {
    h.addEventListener('click', function () {
      var k = h.getAttribute('data-k');
      if (sortK === k) sortD *= -1; else { sortK = k; sortD = 1; }
      render();
    });
  });
})();
