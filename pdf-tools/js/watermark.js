/* Add a text watermark to every PDF page — client-side with pdf-lib (loaded via CDN) */
(function () {
  'use strict';

  var dz = document.getElementById('dz');
  var fileInput = document.getElementById('fileInput');
  var fileInfo = document.getElementById('fileInfo');
  var wmText = document.getElementById('wmText');
  var wmStyle = document.getElementById('wmStyle');
  var wmOpacity = document.getElementById('wmOpacity');
  var opVal = document.getElementById('opVal');
  var wmSize = document.getElementById('wmSize');
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

  wmOpacity.addEventListener('input', function () {
    opVal.textContent = wmOpacity.value + '%';
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

  goBtn.addEventListener('click', function () {
    if (typeof PDFLib === 'undefined') {
      resultBox.className = 'result-box show';
      resultBox.innerHTML = '<strong>Could not load the PDF engine.</strong> Please check your internet connection (the engine loads from a CDN once) and try again.';
      return;
    }
    if (!pdfFile) return;
    var text = wmText.value.trim();
    if (!text) {
      resultBox.className = 'result-box show';
      resultBox.innerHTML = '<strong>Please type your watermark text first.</strong>';
      return;
    }

    goBtn.disabled = true;
    prog.classList.add('show');
    progBar.style.width = '20%';
    resultBox.className = 'result-box';
    resultBox.innerHTML = '';

    (async function () {
      try {
        var buf = await readAsArrayBuffer(pdfFile);
        var pdf = await PDFLib.PDFDocument.load(buf, { ignoreEncryption: true });
        var font = await pdf.embedFont(PDFLib.StandardFonts.HelveticaBold);
        var size = parseInt(wmSize.value, 10) || 72;
        var opacity = Math.min(0.6, Math.max(0.1, (parseInt(wmOpacity.value, 10) || 25) / 100));
        var diagonal = wmStyle.value === 'diagonal';
        var pages = pdf.getPages();

        for (var i = 0; i < pages.length; i++) {
          progBar.style.width = Math.round(20 + (i / pages.length) * 60) + '%';
          var page = pages[i];
          var pw = page.getWidth();
          var ph = page.getHeight();
          var textWidth = font.widthOfTextAtSize(text, size);
          var x, y, rotate;
          if (diagonal) {
            // center the text, then rotate 45° around its own center
            x = (pw - textWidth) / 2;
            y = ph / 2;
            rotate = PDFLib.degrees(45);
          } else {
            x = (pw - textWidth) / 2;
            y = ph - 80;
            rotate = PDFLib.degrees(0);
          }
          page.drawText(text, {
            x: x,
            y: y,
            size: size,
            font: font,
            color: PDFLib.rgb(0.55, 0.55, 0.55),
            opacity: opacity,
            rotate: rotate
          });
        }

        progBar.style.width = '90%';
        var bytes = await pdf.save({ useObjectStreams: true });
        progBar.style.width = '100%';
        var blob = new Blob([bytes], { type: 'application/pdf' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'watermarked.pdf';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 4000);
        resultBox.className = 'result-box show';
        resultBox.innerHTML = '<strong>✅ Done!</strong> Watermarked ' + pages.length + ' page(s) (' + fmtSize(bytes.length) + '). Your file has been downloaded.';
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
