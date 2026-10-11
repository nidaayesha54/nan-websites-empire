/* Password-protect a PDF — REAL AES-256 encryption via qpdf WASM (vendored, runs in a Web Worker).
   pdf-lib cannot encrypt PDFs, so this tool uses the qpdf engine entirely client-side. */
import { createQpdfRunner } from '../vendor/qpdf/src/index.js';

(function () {
  'use strict';

  var dz = document.getElementById('dz');
  var fileInput = document.getElementById('fileInput');
  var fileInfo = document.getElementById('fileInfo');
  var pw1 = document.getElementById('pw1');
  var pw2 = document.getElementById('pw2');
  var goBtn = document.getElementById('goBtn');
  var resultBox = document.getElementById('resultBox');
  var prog = document.getElementById('prog');
  var progBar = document.getElementById('progBar');
  var pdfFile = null;
  var qpdfRunner = null; // lazy: engine loads only when first needed

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

  function showError(html) {
    resultBox.className = 'result-box show';
    resultBox.innerHTML = html;
  }

  async function getRunner() {
    if (qpdfRunner) return qpdfRunner;
    qpdfRunner = await createQpdfRunner({
      qpdfJsUrl: '../vendor/qpdf/lib/qpdf.js',
      wasmUrl: '../vendor/qpdf/lib/qpdf.wasm',
      timeoutMs: 60000
    });
    return qpdfRunner;
  }

  goBtn.addEventListener('click', function () {
    if (!pdfFile) return;
    var p1 = pw1.value, p2 = pw2.value;
    if (p1.length < 4) {
      showError('<strong>Please choose a password of at least 4 characters.</strong> Longer passwords are much harder to guess.');
      return;
    }
    if (p1 !== p2) {
      showError('<strong>The two passwords do not match.</strong> Please type the same password twice.');
      return;
    }

    goBtn.disabled = true;
    prog.classList.add('show');
    progBar.style.width = '15%';
    resultBox.className = 'result-box';
    resultBox.innerHTML = '';
    setStatus('Loading encryption engine (one-time, ~2 MB)…');

    (async function () {
      try {
        var runner = await getRunner();
        progBar.style.width = '35%';
        setStatus('Encrypting…');
        var buf = await readAsArrayBuffer(pdfFile);
        // qpdf --encrypt <user-pw> <owner-pw> <keylen 256=AES-256> -- in out
        var outBytes = await runner.runOne({
          input: new Uint8Array(buf),
          inputName: 'input.pdf',
          outputName: 'output.pdf',
          args: ['--encrypt', p1, p1, '256', '--', 'input.pdf', 'output.pdf']
        });
        progBar.style.width = '100%';
        var blob = new Blob([outBytes], { type: 'application/pdf' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'protected.pdf';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 4000);
        // clear password fields from DOM immediately
        pw1.value = ''; pw2.value = '';
        resultBox.className = 'result-box show';
        resultBox.innerHTML = '<strong>✅ Done!</strong> Your PDF is now encrypted with AES-256 (' + fmtSize(outBytes.length) + '). Anyone opening it will be asked for the password.';
      } catch (err) {
        var msg = err && err.message ? err.message : String(err);
        if (/QPDF_INIT_FAILED|timed out|worker/i.test(msg)) {
          showError('<strong>Could not start the encryption engine.</strong> Please check your internet connection and try again. (The engine loads once from this site.)');
        } else {
          showError('<strong>Something went wrong:</strong> ' + escapeHtml(msg));
        }
      } finally {
        goBtn.disabled = false;
        setStatus('');
        setTimeout(function () { prog.classList.remove('show'); progBar.style.width = '0'; }, 600);
      }
    })();
  });

  function setStatus(t) {
    var el = document.getElementById('engineStatus');
    if (!el) {
      el = document.createElement('p');
      el.id = 'engineStatus';
      el.className = 'hint';
      el.style.textAlign = 'center';
      goBtn.parentElement.appendChild(el);
    }
    el.textContent = t;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
})();
