/* PDF to JPG/PNG converter — client-side with pdf.js (CDN) + JSZip for bulk download */
(function () {
  'use strict';

  var dz = document.getElementById('dz');
  var fileInput = document.getElementById('fileInput');
  var fileInfo = document.getElementById('fileInfo');
  var formatSel = document.getElementById('formatSel');
  var scaleSel = document.getElementById('scaleSel');
  var goBtn = document.getElementById('goBtn');
  var zipBtn = document.getElementById('zipBtn');
  var previewGrid = document.getElementById('previewGrid');
  var resultBox = document.getElementById('resultBox');
  var prog = document.getElementById('prog');
  var progBar = document.getElementById('progBar');

  var pdfFile = null;
  var rendered = []; // [{ pageNum, blob, ext }]

  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

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

  function setFile(f) {
    if (!(f.type === 'application/pdf' || /\.pdf$/i.test(f.name))) {
      resultBox.className = 'result-box show';
      resultBox.innerHTML = '<strong>Please select a PDF file.</strong>';
      return;
    }
    pdfFile = f;
    rendered = [];
    previewGrid.innerHTML = '';
    zipBtn.disabled = true;
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

  function canvasToBlob(canvas, format) {
    return new Promise(function (resolve) {
      var type = format === 'png' ? 'image/png' : 'image/jpeg';
      var quality = format === 'png' ? undefined : 0.92;
      canvas.toBlob(function (b) { resolve(b); }, type, quality);
    });
  }

  function downloadBlob(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 4000);
  }

  goBtn.addEventListener('click', function () {
    if (typeof pdfjsLib === 'undefined') {
      resultBox.className = 'result-box show';
      resultBox.innerHTML = '<strong>Could not load the PDF engine.</strong> Please check your internet connection (the engine loads from a CDN once) and try again.';
      return;
    }
    if (!pdfFile) return;
    goBtn.disabled = true;
    zipBtn.disabled = true;
    prog.classList.add('show');
    progBar.style.width = '5%';
    resultBox.className = 'result-box';
    resultBox.innerHTML = '';
    previewGrid.innerHTML = '';
    rendered = [];

    (async function () {
      try {
        var buf = await readAsArrayBuffer(pdfFile);
        var pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        var numPages = pdf.numPages;
        var format = formatSel.value;
        var scale = parseFloat(scaleSel.value) || 2;
        var ext = format === 'png' ? 'png' : 'jpg';

        for (var p = 1; p <= numPages; p++) {
          progBar.style.width = Math.round(5 + (p / numPages) * 85) + '%';
          var page = await pdf.getPage(p);
          var viewport = page.getViewport({ scale: scale });
          var canvas = document.createElement('canvas');
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          var ctx = canvas.getContext('2d');
          if (format !== 'png') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          await page.render({ canvasContext: ctx, viewport: viewport }).promise;
          var blob = await canvasToBlob(canvas, format);
          rendered.push({ pageNum: p, blob: blob, ext: ext });

          var card = document.createElement('div');
          card.style.cssText = 'text-align:center;border:1px solid #e5e7eb;border-radius:10px;padding:8px;background:#fff;max-width:180px';
          var thumb = document.createElement('img');
          thumb.style.cssText = 'width:150px;height:auto;border-radius:6px;box-shadow:0 1px 4px rgba(0,0,0,.12)';
          thumb.src = URL.createObjectURL(blob);
          thumb.alt = 'Page ' + p;
          var dl = document.createElement('button');
          dl.className = 'btn secondary';
          dl.style.cssText = 'margin-top:8px;font-size:.85rem;padding:6px 12px';
          dl.textContent = 'Download page ' + p;
          (function (rec) {
            dl.addEventListener('click', function () {
              downloadBlob(rec.blob, 'page-' + rec.pageNum + '.' + rec.ext);
            });
          })(rendered[rendered.length - 1]);
          card.appendChild(thumb);
          card.appendChild(document.createElement('br'));
          card.appendChild(dl);
          previewGrid.appendChild(card);
          page.cleanup();
        }

        progBar.style.width = '100%';
        zipBtn.disabled = rendered.length < 2;
        resultBox.className = 'result-box show';
        resultBox.innerHTML = '<strong>✅ Done!</strong> Converted ' + numPages + ' page(s). Download individually above' +
          (rendered.length > 1 ? ' or grab them all as a ZIP.' : '.');
      } catch (err) {
        resultBox.className = 'result-box show';
        var msg = /password|encrypted/i.test(err.message || '')
          ? 'This PDF is password-protected. Please unlock it first, then convert.'
          : (err.message || String(err));
        resultBox.innerHTML = '<strong>Something went wrong:</strong> ' + escapeHtml(msg);
      } finally {
        goBtn.disabled = false;
        setTimeout(function () { prog.classList.remove('show'); progBar.style.width = '0'; }, 600);
      }
    })();
  });

  zipBtn.addEventListener('click', function () {
    if (typeof JSZip === 'undefined' || rendered.length === 0) return;
    zipBtn.disabled = true;
    (async function () {
      try {
        var zip = new JSZip();
        for (var i = 0; i < rendered.length; i++) {
          zip.file('page-' + rendered[i].pageNum + '.' + rendered[i].ext, rendered[i].blob);
        }
        var content = await zip.generateAsync({ type: 'blob' });
        downloadBlob(content, 'pdf-pages.zip');
        resultBox.className = 'result-box show';
        resultBox.innerHTML = '<strong>✅ Done!</strong> All ' + rendered.length + ' pages downloaded as a ZIP.';
      } catch (err) {
        resultBox.className = 'result-box show';
        resultBox.innerHTML = '<strong>Something went wrong:</strong> ' + escapeHtml(err.message || String(err));
      } finally {
        zipBtn.disabled = false;
      }
    })();
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
})();
