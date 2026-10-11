/* Merge PDFs client-side with pdf-lib (loaded via CDN) */
(function () {
  'use strict';

  var dz = document.getElementById('dz');
  var fileInput = document.getElementById('fileInput');
  var fileList = document.getElementById('fileList');
  var mergeBtn = document.getElementById('mergeBtn');
  var resultBox = document.getElementById('resultBox');
  var prog = document.getElementById('prog');
  var progBar = document.getElementById('progBar');
  var files = [];

  dz.addEventListener('click', function () { fileInput.click(); });
  dz.addEventListener('dragover', function (e) { e.preventDefault(); dz.classList.add('drag'); });
  dz.addEventListener('dragleave', function () { dz.classList.remove('drag'); });
  dz.addEventListener('drop', function (e) {
    e.preventDefault();
    dz.classList.remove('drag');
    addFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', function () {
    addFiles(fileInput.files);
    fileInput.value = '';
  });

  function addFiles(list) {
    for (var i = 0; i < list.length; i++) {
      var f = list[i];
      if (f.type === 'application/pdf' || /\.pdf$/i.test(f.name)) {
        files.push(f);
      }
    }
    render();
  }

  function render() {
    fileList.innerHTML = '';
    files.forEach(function (f, idx) {
      var li = document.createElement('li');
      var label = document.createElement('span');
      label.textContent = (idx + 1) + '. ' + f.name + ' (' + fmtSize(f.size) + ')';
      var ctrls = document.createElement('span');
      var up = document.createElement('button');
      up.textContent = '↑';
      up.title = 'Move up';
      up.addEventListener('click', function () { move(idx, -1); });
      var down = document.createElement('button');
      down.textContent = '↓';
      down.title = 'Move down';
      down.addEventListener('click', function () { move(idx, 1); });
      var del = document.createElement('button');
      del.textContent = '✕';
      del.title = 'Remove';
      del.addEventListener('click', function () { files.splice(idx, 1); render(); });
      ctrls.appendChild(up);
      ctrls.appendChild(down);
      ctrls.appendChild(del);
      li.appendChild(label);
      li.appendChild(ctrls);
      fileList.appendChild(li);
    });
    mergeBtn.disabled = files.length < 2;
  }

  function move(idx, dir) {
    var j = idx + dir;
    if (j < 0 || j >= files.length) return;
    var tmp = files[idx];
    files[idx] = files[j];
    files[j] = tmp;
    render();
  }

  function fmtSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  function readAsArrayBuffer(file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(r.result); };
      r.onerror = reject;
      r.readAsArrayBuffer(file);
    });
  }

  mergeBtn.addEventListener('click', function () {
    if (typeof PDFLib === 'undefined') {
      resultBox.className = 'result-box show';
      resultBox.innerHTML = '<strong>Could not load the PDF engine.</strong> Please check your internet connection (the engine loads from a CDN once) and try again.';
      return;
    }
    mergeBtn.disabled = true;
    prog.classList.add('show');
    progBar.style.width = '10%';
    resultBox.className = 'result-box';
    resultBox.innerHTML = '';

    (async function () {
      try {
        var merged = await PDFLib.PDFDocument.create();
        for (var i = 0; i < files.length; i++) {
          progBar.style.width = Math.round(10 + (i / files.length) * 70) + '%';
          var buf = await readAsArrayBuffer(files[i]);
          var src = await PDFLib.PDFDocument.load(buf, { ignoreEncryption: true });
          var pages = await merged.copyPages(src, src.getPageIndices());
          pages.forEach(function (p) { merged.addPage(p); });
        }
        progBar.style.width = '90%';
        var bytes = await merged.save({ useObjectStreams: true });
        progBar.style.width = '100%';
        var blob = new Blob([bytes], { type: 'application/pdf' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'merged.pdf';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 4000);
        resultBox.className = 'result-box show';
        resultBox.innerHTML = '<strong>✅ Done!</strong> Your merged PDF (' + fmtSize(bytes.length) + ') has been downloaded.';
      } catch (err) {
        resultBox.className = 'result-box show';
        resultBox.innerHTML = '<strong>Something went wrong:</strong> ' + escapeHtml(err.message || String(err));
      } finally {
        mergeBtn.disabled = files.length < 2;
        setTimeout(function () { prog.classList.remove('show'); progBar.style.width = '0'; }, 600);
      }
    })();
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  render();
})();
