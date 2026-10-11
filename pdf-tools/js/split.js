/* Split PDF by page ranges, client-side with pdf-lib (loaded via CDN) */
(function () {
  'use strict';

  var dz = document.getElementById('dz');
  var fileInput = document.getElementById('fileInput');
  var fileInfo = document.getElementById('fileInfo');
  var rangeWrap = document.getElementById('rangeWrap');
  var rangesInput = document.getElementById('ranges');
  var splitBtn = document.getElementById('splitBtn');
  var resultBox = document.getElementById('resultBox');
  var prog = document.getElementById('prog');
  var progBar = document.getElementById('progBar');
  var fileBuffer = null;
  var pageCount = 0;
  var fileName = '';

  dz.addEventListener('click', function () { fileInput.click(); });
  dz.addEventListener('dragover', function (e) { e.preventDefault(); dz.classList.add('drag'); });
  dz.addEventListener('dragleave', function () { dz.classList.remove('drag'); });
  dz.addEventListener('drop', function (e) {
    e.preventDefault();
    dz.classList.remove('drag');
    if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function () {
    if (fileInput.files.length) loadFile(fileInput.files[0]);
    fileInput.value = '';
  });

  function loadFile(f) {
    if (f.type !== 'application/pdf' && !/\.pdf$/i.test(f.name)) {
      fileInfo.textContent = 'Please choose a PDF file.';
      return;
    }
    fileName = f.name.replace(/\.pdf$/i, '');
    var r = new FileReader();
    r.onload = function () {
      fileBuffer = r.result;
      (async function () {
        try {
          var doc = await PDFLib.PDFDocument.load(fileBuffer.slice(0));
          pageCount = doc.getPageCount();
          fileInfo.textContent = 'Loaded: ' + f.name + ' — ' + pageCount + ' pages.';
          rangeWrap.style.display = 'block';
          rangesInput.value = '1-' + Math.min(pageCount, 3);
        } catch (err) {
          fileInfo.textContent = 'Could not read this PDF. It may be encrypted or corrupted.';
          rangeWrap.style.display = 'none';
          fileBuffer = null;
        }
      })();
    };
    r.readAsArrayBuffer(f);
  }

  function parseRanges(text, max) {
    var out = [];
    var parts = text.split(',');
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].trim();
      if (!p) continue;
      var m = p.match(/^(\d+)\s*-\s*(\d+)$/);
      if (m) {
        var a = parseInt(m[1], 10), b = parseInt(m[2], 10);
        if (a < 1 || b > max || a > b) throw new Error('Invalid range: "' + p + '". Pages must be between 1 and ' + max + '.');
        for (var k = a; k <= b; k++) out.push(k - 1);
      } else if (/^\d+$/.test(p)) {
        var n = parseInt(p, 10);
        if (n < 1 || n > max) throw new Error('Invalid page: "' + p + '". Pages must be between 1 and ' + max + '.');
        out.push(n - 1);
      } else {
        throw new Error('Could not understand: "' + p + '". Use formats like 1-3 or 5.');
      }
    }
    // de-duplicate, keep order
    var seen = {}, res = [];
    out.forEach(function (x) { if (!seen[x]) { seen[x] = 1; res.push(x); } });
    return res;
  }

  splitBtn.addEventListener('click', function () {
    if (typeof PDFLib === 'undefined') {
      resultBox.className = 'result-box show';
      resultBox.innerHTML = '<strong>Could not load the PDF engine.</strong> Please check your internet connection and try again.';
      return;
    }
    if (!fileBuffer) return;
    var indices;
    try {
      indices = parseRanges(rangesInput.value, pageCount);
    } catch (err) {
      resultBox.className = 'result-box show';
      resultBox.innerHTML = '<strong>Check your page selection:</strong> ' + escapeHtml(err.message);
      return;
    }
    if (!indices.length) {
      resultBox.className = 'result-box show';
      resultBox.innerHTML = 'Please enter at least one page or range.';
      return;
    }
    splitBtn.disabled = true;
    prog.classList.add('show');
    progBar.style.width = '30%';
    resultBox.className = 'result-box';

    (async function () {
      try {
        var src = await PDFLib.PDFDocument.load(fileBuffer.slice(0), { ignoreEncryption: true });
        var out = await PDFLib.PDFDocument.create();
        var pages = await out.copyPages(src, indices);
        pages.forEach(function (p) { out.addPage(p); });
        progBar.style.width = '80%';
        var bytes = await out.save({ useObjectStreams: true });
        progBar.style.width = '100%';
        var blob = new Blob([bytes], { type: 'application/pdf' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = fileName + '-pages.pdf';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 4000);
        resultBox.className = 'result-box show';
        resultBox.innerHTML = '<strong>✅ Done!</strong> Extracted ' + indices.length + ' page(s) into a new PDF.';
      } catch (err) {
        resultBox.className = 'result-box show';
        resultBox.innerHTML = '<strong>Something went wrong:</strong> ' + escapeHtml(err.message || String(err));
      } finally {
        splitBtn.disabled = false;
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
