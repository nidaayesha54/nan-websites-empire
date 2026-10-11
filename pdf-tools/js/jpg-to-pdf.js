/* JPG/PNG/etc to PDF converter — client-side with pdf-lib (loaded via CDN) */
(function () {
  'use strict';

  var dz = document.getElementById('dz');
  var fileInput = document.getElementById('fileInput');
  var fileList = document.getElementById('fileList');
  var goBtn = document.getElementById('goBtn');
  var resultBox = document.getElementById('resultBox');
  var prog = document.getElementById('prog');
  var progBar = document.getElementById('progBar');
  var pageSizeSel = document.getElementById('pageSize');
  var orientSel = document.getElementById('orientation');
  var files = [];

  var PAGE_SIZES = { a4: [595.28, 841.89], letter: [612, 792] };

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
      if (f.type.indexOf('image/') === 0) files.push(f);
    }
    render();
  }

  function render() {
    fileList.innerHTML = '';
    files.forEach(function (f, idx) {
      var li = document.createElement('li');
      var thumb = document.createElement('img');
      thumb.alt = '';
      thumb.style.cssText = 'width:48px;height:48px;object-fit:cover;border-radius:6px;margin-right:10px;vertical-align:middle';
      thumb.src = URL.createObjectURL(f);
      thumb.onload = function () { URL.revokeObjectURL(thumb.src); };
      var label = document.createElement('span');
      label.textContent = (idx + 1) + '. ' + f.name + ' (' + fmtSize(f.size) + ')';
      var ctrls = document.createElement('span');
      var up = document.createElement('button');
      up.textContent = '↑'; up.title = 'Move up';
      up.addEventListener('click', function () { move(idx, -1); });
      var down = document.createElement('button');
      down.textContent = '↓'; down.title = 'Move down';
      down.addEventListener('click', function () { move(idx, 1); });
      var del = document.createElement('button');
      del.textContent = '✕'; del.title = 'Remove';
      del.addEventListener('click', function () { files.splice(idx, 1); render(); });
      ctrls.appendChild(up); ctrls.appendChild(down); ctrls.appendChild(del);
      li.appendChild(thumb); li.appendChild(label); li.appendChild(ctrls);
      fileList.appendChild(li);
    });
    goBtn.disabled = files.length < 1;
  }

  function move(idx, dir) {
    var j = idx + dir;
    if (j < 0 || j >= files.length) return;
    var tmp = files[idx]; files[idx] = files[j]; files[j] = tmp;
    render();
  }

  function fmtSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  /* Load an image file and return { pngBytes, width, height } via canvas.
     Canvas normalization means JPG/PNG/GIF/BMP/WebP all work. */
  function imageToPng(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        try {
          var canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          var ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(function (blob) {
            URL.revokeObjectURL(url);
            if (!blob) { reject(new Error('Could not process image: ' + file.name)); return; }
            var r = new FileReader();
            r.onload = function () {
              resolve({ bytes: new Uint8Array(r.result), width: canvas.width, height: canvas.height });
            };
            r.onerror = reject;
            r.readAsArrayBuffer(blob);
          }, 'image/png');
        } catch (e) { URL.revokeObjectURL(url); reject(e); }
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('Could not read image: ' + file.name)); };
      img.src = url;
    });
  }

  function pageDims(imgW, imgH) {
    // Always returns [pageW, pageH, drawX, drawY, drawW, drawH]
    var mode = pageSizeSel.value;
    var orient = orientSel.value;
    if (mode === 'original') return [imgW, imgH, 0, 0, imgW, imgH];
    var size = PAGE_SIZES[mode] || PAGE_SIZES.a4;
    var pw = size[0], ph = size[1];
    var imgLandscape = imgW > imgH;
    if (orient === 'landscape' || (orient === 'auto' && imgLandscape)) {
      var t = pw; pw = ph; ph = t;
    }
    // fit image inside page, keep aspect ratio
    var scale = Math.min(pw / imgW, ph / imgH);
    var dw = imgW * scale, dh = imgH * scale;
    return [pw, ph, (pw - dw) / 2, (ph - dh) / 2, dw, dh];
  }

  goBtn.addEventListener('click', function () {
    if (typeof PDFLib === 'undefined') {
      resultBox.className = 'result-box show';
      resultBox.innerHTML = '<strong>Could not load the PDF engine.</strong> Please check your internet connection (the engine loads from a CDN once) and try again.';
      return;
    }
    goBtn.disabled = true;
    prog.classList.add('show');
    progBar.style.width = '10%';
    resultBox.className = 'result-box';
    resultBox.innerHTML = '';

    (async function () {
      try {
        var pdf = await PDFLib.PDFDocument.create();
        for (var i = 0; i < files.length; i++) {
          progBar.style.width = Math.round(10 + (i / files.length) * 75) + '%';
          var img = await imageToPng(files[i]);
          var embedded = await pdf.embedPng(img.bytes);
          var dims = pageDims(img.width, img.height);
          var page = pdf.addPage([dims[0], dims[1]]);
          page.drawImage(embedded, { x: dims[2], y: dims[3], width: dims[4], height: dims[5] });
        }
        progBar.style.width = '92%';
        var bytes = await pdf.save({ useObjectStreams: true });
        progBar.style.width = '100%';
        var blob = new Blob([bytes], { type: 'application/pdf' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'images.pdf';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 4000);
        resultBox.className = 'result-box show';
        resultBox.innerHTML = '<strong>✅ Done!</strong> Your PDF with ' + files.length + ' page(s) (' + fmtSize(bytes.length) + ') has been downloaded.';
      } catch (err) {
        resultBox.className = 'result-box show';
        resultBox.innerHTML = '<strong>Something went wrong:</strong> ' + escapeHtml(err.message || String(err));
      } finally {
        goBtn.disabled = files.length < 1;
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
