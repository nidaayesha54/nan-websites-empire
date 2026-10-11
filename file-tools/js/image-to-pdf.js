/* Images to PDF — pdf-lib, client-side */
(function () {
  var drop = document.getElementById('drop');
  var fileInput = document.getElementById('file');
  var thumbs = document.getElementById('thumbs');
  var status = document.getElementById('status');
  var items = []; // {file, url}

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

  function add(files) {
    files.forEach(function (f) {
      if (!/^image\/(png|jpeg)$/.test(f.type)) return;
      var url = URL.createObjectURL(f);
      items.push({ file: f, url: url });
    });
    render();
  }
  function render() {
    thumbs.innerHTML = '';
    items.forEach(function (it, i) {
      var d = document.createElement('div');
      d.style.cssText = 'position:relative;width:110px;height:110px;border:1px solid var(--border);border-radius:10px;overflow:hidden;cursor:pointer';
      d.title = 'Click to remove';
      var img = document.createElement('img');
      img.src = it.url;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover';
      var b = document.createElement('span');
      b.textContent = '✕';
      b.style.cssText = 'position:absolute;top:2px;right:6px;background:#dc2626;color:#fff;border-radius:50%;width:22px;height:22px;text-align:center;line-height:22px;font-size:12px';
      d.appendChild(img); d.appendChild(b);
      d.addEventListener('click', function () { items.splice(i, 1); render(); });
      thumbs.appendChild(d);
    });
    status.textContent = items.length ? items.length + ' image(s) ready.' : '';
  }

  function readFile(f) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(r.result); };
      r.onerror = rej;
      r.readAsArrayBuffer(f);
    });
  }
  function loadImage(url) {
    return new Promise(function (res, rej) {
      var img = new Image();
      img.onload = function () { res(img); };
      img.onerror = rej;
      img.src = url;
    });
  }

  document.getElementById('go').addEventListener('click', function () {
    if (!items.length) { status.textContent = 'Add at least one image first.'; return; }
    status.textContent = 'Creating PDF…';
    var mode = document.getElementById('size').value;
    var PDFLib = window.PDFLib;
    var chain = Promise.resolve();
    var doc;
    PDFLib.PDFDocument.create().then(function (d) {
      doc = d;
      items.forEach(function (it) {
        chain = chain.then(function () {
          return readFile(it.file).then(function (buf) {
            var isPng = it.file.type === 'image/png';
            var embP = isPng ? doc.embedPng(buf) : doc.embedJpg(buf);
            return embP.then(function (emb) { return loadImage(it.url).then(function (img) { return { emb: emb, w: img.naturalWidth, h: img.naturalHeight }; }); });
          }).then(function (o) {
            var page;
            if (mode === 'fit') {
              page = doc.addPage([o.w, o.h]);
              page.drawImage(o.emb, { x: 0, y: 0, width: o.w, height: o.h });
            } else {
              var PW = mode === 'A4' ? 595 : 612, PH = mode === 'A4' ? 842 : 792;
              page = doc.addPage([PW, PH]);
              var s = Math.min(PW / o.w, PH / o.h);
              var dw = o.w * s, dh = o.h * s;
              page.drawImage(o.emb, { x: (PW - dw) / 2, y: (PH - dh) / 2, width: dw, height: dh });
            }
          });
        });
      });
      return chain.then(function () { return doc.save(); });
    }).then(function (bytes) {
      var blob = new Blob([bytes], { type: 'application/pdf' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'images.pdf';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      status.textContent = 'Done — images.pdf downloaded.';
    }).catch(function () {
      status.textContent = 'Conversion failed. Try different images.';
    });
  });
})();
