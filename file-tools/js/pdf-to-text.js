/* PDF to Text — pdf.js text extraction, all client-side */
(function () {
  var drop = document.getElementById('drop');
  var fileInput = document.getElementById('file');
  var status = document.getElementById('status');
  var out = document.getElementById('out');
  var actions = document.getElementById('actions');
  var fullText = '';

  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  drop.addEventListener('click', function () { fileInput.click(); });
  drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', function () { drop.classList.remove('over'); });
  drop.addEventListener('drop', function (e) {
    e.preventDefault(); drop.classList.remove('over');
    if (e.dataTransfer.files.length) handle(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function () { if (fileInput.files.length) handle(fileInput.files[0]); });

  function handle(file) {
    if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
      status.textContent = 'Please choose a PDF file.';
      return;
    }
    status.textContent = 'Extracting text…';
    out.style.display = 'none'; actions.style.display = 'none';
    var reader = new FileReader();
    reader.onload = function () {
      var data = new Uint8Array(reader.result);
      pdfjsLib.getDocument({ data: data }).promise.then(function (pdf) {
        var pages = [];
        for (var i = 1; i <= pdf.numPages; i++) pages.push(i);
        return pages.reduce(function (p, n) {
          return p.then(function (acc) {
            return pdf.getPage(n).then(function (page) {
              return page.getTextContent().then(function (tc) {
                var t = tc.items.map(function (it) { return it.str; }).join(' ');
                return acc + t + '\n\n';
              });
            });
          });
        }, Promise.resolve(''));
      }).then(function (text) {
        fullText = text.trim();
        if (!fullText) {
          status.textContent = 'No text found — this PDF is probably scanned images. OCR software is needed.';
          return;
        }
        out.textContent = fullText;
        out.style.display = 'block'; actions.style.display = 'block';
        status.textContent = 'Done — extracted ' + fullText.length.toLocaleString() + ' characters.';
      }).catch(function () {
        status.textContent = 'Could not read this PDF. It may be corrupted or password-protected.';
      });
    };
    reader.readAsArrayBuffer(file);
  }

  document.getElementById('copy').addEventListener('click', function () {
    navigator.clipboard.writeText(fullText).then(function () {
      status.textContent = 'Copied to clipboard.';
    }, function () { status.textContent = 'Copy failed — select the text manually.'; });
  });
  document.getElementById('dl').addEventListener('click', function () {
    var blob = new Blob([fullText], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'extracted-text.txt';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  });
})();
