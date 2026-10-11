/* Rotate PDF pages — client-side with pdf-lib (loaded via CDN) */
(function () {
  'use strict';

  var dz = document.getElementById('dz');
  var fileInput = document.getElementById('fileInput');
  var fileInfo = document.getElementById('fileInfo');
  var pagesMode = document.getElementById('pagesMode');
  var rangeWrap = document.getElementById('rangeWrap');
  var rangeInput = document.getElementById('rangeInput');
  var angleSel = document.getElementById('angleSel');
  var goBtn = document.getElementById('goBtn');
  var resultBox = document.getElementById('resultBox');
  var prog = document.getElementById('prog');
  var progBar = document.getElementById('progBar');
  var pdfFile = null;

  dz.addEventListener('click', function () { fileInput.click(); });
  dz.addEventListener('dragover', function (e) { e.preventDefault(); dz.classList.add('drag'); });
  dz.addEventListener('dragleave', function () { dz.classList.remove('drag'); });
  dz.addEventListener('drop', function (e) {
    e.preventDefault();
    dz.classList.remove('drag');
    if (e.dataTransfer.files.length) setFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function () {
    if (fileInput.files.length) setFile(fileInput.files[0]);
    fileInput.value = '';
  });

  pagesMode.addEventListener('change', function () {
    rangeWrap.style.display = pagesMode.value === 'range' ? '' : 'none';
  });

  function setFile(f) {
    if (!(f.type === 'application/pdf' || /\.pdf$/i.test(f.name))) {
      resultBox.className = 'result-box show';
      resultBox.innerHTML = '<strong>Please select a PDF file.</strong>';
      return;
    }
    pdfFile = f;
    resultBox.className = 'result-box';
    resultBox.innerHTML = '';
    fileInfo.innerHTML = '<strong>📄 ' + escapeHtml(f.name) + '</strong> (' + fmtSize(f.size) + ')';
    goBtn.disabled = false;
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

  /* Parse "1-3, 5" into zero-based page indices, clamped to pageCount */
  function parseRanges(text, pageCount) {
    var out = {};
    var parts = String(text).split(',');
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i].trim();
      if (!part) continue;
      var m = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (m) {
        var a = parseInt(m[1], 10), b = parseInt(m[2], 10);
        if (a > b) { var t = a; a = b; b = t; }
        for (var n = a; n <= b; n++) {
          if (n >= 1 && n <= pageCount) out[n - 1] = true;
        }
      } else if (/^\d+$/.test(part)) {
        var n2 = parseInt(part, 10);
        if (n2 >= 1 && n2 <= pageCount) out[n2 - 1] = true;
      } else {
        throw new Error('Could not understand "' + part + '". Use numbers and ranges like 1-3, 5.');
      }
    }
    return Object.keys(out).map(Number);
  }

  goBtn.addEventListener('click', function () {
    if (typeof PDFLib === 'undefined') {
      resultBox.className = 'result-box show';
      resultBox.innerHTML = '<strong>Could not load the PDF engine.</strong> Please check your internet connection (the engine loads from a CDN once) and try again.';
      return;
    }
    if (!pdfFile) return;
    goBtn.disabled = true;
    prog.classList.add('show');
    progBar.style.width = '15%';
    resultBox.className = 'result-box';
    resultBox.innerHTML = '';

    (async function () {
      try {
        var buf = await readAsArrayBuffer(pdfFile);
        var pdf = await PDFLib.PDFDocument.load(buf, { ignoreEncryption: true });
        var pageCount = pdf.getPageCount();
        var delta = parseInt(angleSel.value, 10) || 90;

        var targets;
        if (pagesMode.value === 'range') {
          targets = parseRanges(rangeInput.value, pageCount);
          if (targets.length === 0) throw new Error('No valid pages selected. Example: 1-3, 5');
        } else {
          targets = [];
          for (var i = 0; i < pageCount; i++) targets.push(i);
        }

        progBar.style.width = '45%';
        targets.forEach(function (idx) {
          var page = pdf.getPage(idx);
          var current = page.getRotation().angle;
          page.setRotation(PDFLib.degrees((current + delta) % 360));
        });

        progBar.style.width = '75%';
        var bytes = await pdf.save({ useObjectStreams: true });
        progBar.style.width = '100%';
        var blob = new Blob([bytes], { type: 'application/pdf' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'rotated.pdf';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 4000);
        resultBox.className = 'result-box show';
        resultBox.innerHTML = '<strong>✅ Done!</strong> Rotated ' + targets.length + ' page(s) by ' + delta + '°. Your file (' + fmtSize(bytes.length) + ') has been downloaded.';
      } catch (err) {
        resultBox.className = 'result-box show';
        resultBox.innerHTML = '<strong>Something went wrong:</strong> ' + escapeHtml(err.message || String(err));
      } finally {
        goBtn.disabled = false;
        setTimeout(function () { prog.classList.remove('show'); progBar.style.width = '0'; }, 600);
      }
    })();
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
})();
