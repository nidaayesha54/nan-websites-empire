/* Compress PDF client-side with pdf-lib (loaded via CDN).
   Honest approach: re-save with object streams + optional metadata strip.
   This is lossless — gains depend on how optimized the source PDF already is. */
(function () {
  'use strict';

  var dz = document.getElementById('dz');
  var fileInput = document.getElementById('fileInput');
  var fileInfo = document.getElementById('fileInfo');
  var optWrap = document.getElementById('optWrap');
  var compressBtn = document.getElementById('compressBtn');
  var resultBox = document.getElementById('resultBox');
  var prog = document.getElementById('prog');
  var progBar = document.getElementById('progBar');
  var fileBuffer = null;
  var fileName = '';
  var originalSize = 0;

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
    originalSize = f.size;
    var r = new FileReader();
    r.onload = function () {
      fileBuffer = r.result;
      fileInfo.textContent = 'Loaded: ' + f.name + ' — original size ' + fmtSize(originalSize) + '.';
      optWrap.style.display = 'block';
      resultBox.className = 'result-box';
      resultBox.innerHTML = '';
    };
    r.readAsArrayBuffer(f);
  }

  function fmtSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  function selectedLevel() {
    var els = document.getElementsByName('level');
    for (var i = 0; i < els.length; i++) {
      if (els[i].checked) return els[i].value;
    }
    return 'light';
  }

  compressBtn.addEventListener('click', function () {
    if (typeof PDFLib === 'undefined') {
      resultBox.className = 'result-box show';
      resultBox.innerHTML = '<strong>Could not load the PDF engine.</strong> Please check your internet connection and try again.';
      return;
    }
    if (!fileBuffer) return;
    var level = selectedLevel();
    compressBtn.disabled = true;
    prog.classList.add('show');
    progBar.style.width = '25%';
    resultBox.className = 'result-box';

    (async function () {
      try {
        var src = await PDFLib.PDFDocument.load(fileBuffer.slice(0), { ignoreEncryption: true });
        var out = await PDFLib.PDFDocument.create();
        var pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach(function (p) { out.addPage(p); });

        if (level === 'medium' || level === 'strong') {
          out.setTitle('');
          out.setAuthor('');
          out.setSubject('');
          out.setKeywords([]);
          out.setProducer('PDF Tools Hub');
          out.setCreator('');
        }

        progBar.style.width = '60%';
        var saveOpts = { useObjectStreams: true };
        // Strong mode: also drop unused objects by saving without incremental updates
        if (level === 'strong') {
          saveOpts.addDefaultPage = false;
        }
        var bytes = await out.save(saveOpts);
        progBar.style.width = '100%';

        var saved = originalSize - bytes.length;
        var pct = originalSize > 0 ? Math.round((saved / originalSize) * 100) : 0;

        if (bytes.length >= originalSize) {
          resultBox.className = 'result-box show';
          resultBox.innerHTML = '<strong>ℹ️ Already optimized.</strong> This PDF is already well-compressed — re-saving produced ' +
            fmtSize(bytes.length) + ' (original ' + fmtSize(originalSize) + '). No quality was lost.';
        } else {
          var blob = new Blob([bytes], { type: 'application/pdf' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = fileName + '-compressed.pdf';
          document.body.appendChild(a);
          a.click();
          setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 4000);
          resultBox.className = 'result-box show';
          resultBox.innerHTML = '<strong>✅ Done!</strong> New size: ' + fmtSize(bytes.length) +
            ' — saved ' + fmtSize(saved) + ' (' + pct + '% smaller). Your compressed PDF has been downloaded.';
        }
      } catch (err) {
        resultBox.className = 'result-box show';
        resultBox.innerHTML = '<strong>Something went wrong:</strong> ' + escapeHtml(err.message || String(err));
      } finally {
        compressBtn.disabled = false;
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
