// ImageShrink compressor — target-KB via binary search on quality. 100% client-side.
(function () {
  var state = { file: null, img: null, name: 'image', maxDim: 0, result: null };

  function $(id) { return document.getElementById(id); }

  function init() {
    var dz = $('dropzone'), fi = $('fileInput');
    if (!dz) return;
    dz.addEventListener('click', function () { fi.click(); });
    ['dragover', 'dragenter'].forEach(function (e) {
      dz.addEventListener(e, function (ev) { ev.preventDefault(); dz.classList.add('dragover'); });
    });
    ['dragleave', 'drop'].forEach(function (e) {
      dz.addEventListener(e, function (ev) { ev.preventDefault(); dz.classList.remove('dragover'); });
    });
    dz.addEventListener('drop', function (ev) {
      if (ev.dataTransfer.files.length) handleFile(ev.dataTransfer.files[0]);
    });
    fi.addEventListener('change', function () { if (fi.files.length) handleFile(fi.files[0]); });

    $('targetKB').addEventListener('input', function () { $('targetKBVal').textContent = this.value + ' KB'; });
    ['formatSel', 'targetKB'].forEach(function (id) {
      $(id).addEventListener('change', maybeRecompress);
    });
    $('maxDim').addEventListener('change', maybeRecompress);
    $('compressBtn').addEventListener('click', compress);
    $('downloadBtn').addEventListener('click', function () {
      if (!state.result) return;
      downloadBlob(state.result.blob, state.result.filename);
    });
  }

  function handleFile(file) {
    if (!file.type.match(/^image\//)) { showMsg('Please choose an image file (JPG, PNG, WebP, GIF).', false); return; }
    if (file.size > 50 * 1024 * 1024) { showMsg('That file is over 50 MB — pick a smaller one.', false); return; }
    state.file = file;
    state.name = file.name.replace(/\.[^.]+$/, '') || 'image';
    loadImageFile(file).then(function (r) {
      state.img = r.img;
      $('origName').textContent = file.name;
      $('origSize').textContent = formatBytes(file.size);
      $('origDims').textContent = r.img.naturalWidth + ' × ' + r.img.naturalHeight + ' px';
      $('previewImg').src = r.url;
      $('controls').style.display = 'block';
      $('previewArea').classList.add('show');
      $('compressBtn').scrollIntoView({ behavior: 'smooth', block: 'center' });
      showMsg('', true);
    }).catch(function () { showMsg('Could not read this image file.', false); });
  }

  function drawToCanvas(img, maxDim) {
    var w = img.naturalWidth, h = img.naturalHeight;
    if (maxDim > 0 && Math.max(w, h) > maxDim) {
      var s = maxDim / Math.max(w, h);
      w = Math.round(w * s); h = Math.round(h * s);
    }
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h); // white bg for JPEG (no transparency)
    ctx.drawImage(img, 0, 0, w, h);
    return c;
  }

  function canvasToBlob(canvas, mime, quality) {
    return new Promise(function (resolve) { canvas.toBlob(resolve, mime, quality); });
  }

  function maybeRecompress() {
    if (state.result) compress();
  }

  function compress() {
    if (!state.img) { showMsg('Upload an image first.', false); return; }
    var targetBytes = parseInt($('targetKB').value, 10) * 1024;
    var format = $('formatSel').value; // 'jpeg' | 'webp'
    var mime = format === 'webp' ? 'image/webp' : 'image/jpeg';
    var maxDim = parseInt($('maxDim').value, 10) || 0;
    var canvas = drawToCanvas(state.img, maxDim);
    var prog = $('progress'); prog.classList.add('show');
    $('progressBar').style.width = '10%';
    $('resultBox').style.display = 'none';

    // Binary search quality 0.95 -> 0.05 to land at/under target
    var lo = 0.05, hi = 0.95, best = null, bestQ = 0.95;
    var steps = 7, i = 0;

    function step() {
      if (i >= steps) { finish(); return; }
      var q = (lo + hi) / 2;
      canvasToBlob(canvas, mime, q).then(function (blob) {
        i++;
        $('progressBar').style.width = (10 + (i / steps) * 80) + '%';
        if (blob.size <= targetBytes) { best = blob; bestQ = q; lo = q; }
        else { hi = q; }
        step();
      });
    }

    function finish() {
      prog.classList.remove('show');
      // If even lowest quality is over target, shrink dimensions and retry once
      if (!best) {
        var c2 = drawToCanvas(state.img, Math.max(320, Math.floor(canvas.width * 0.7)));
        canvasToBlob(c2, mime, 0.6).then(function (blob) { showResult(blob, mime, true); });
        return;
      }
      showResult(best, mime, false);
    }

    function showResult(blob, mime, downsized) {
      var ext = mime === 'image/webp' ? 'webp' : 'jpg';
      state.result = { blob: blob, filename: state.name + '-compressed.' + ext };
      var saved = state.file.size - blob.size;
      $('resImg').src = URL.createObjectURL(blob);
      $('resSize').textContent = formatBytes(blob.size);
      $('resSaved').textContent = (saved > 0 ? '−' : '+') + formatBytes(Math.abs(saved)) + ' (' + Math.round(Math.abs(saved) / state.file.size * 100) + '%)';
      var ok = blob.size <= targetBytes;
      var verdict = $('resVerdict');
      verdict.textContent = ok ? '✓ Hit your ' + $('targetKB').value + ' KB target' : '⚠ Closest possible: ' + formatBytes(blob.size) + ' (target was ' + $('targetKB').value + ' KB)';
      verdict.className = ok ? 'result-ok' : 'result-warn';
      $('resDims').textContent = canvas.width + ' × ' + canvas.height + ' px';
      if (downsized) { $('resDims').textContent += ' (auto-resized to fit)'; }
      $('resultBox').style.display = 'block';
      $('resultBox').scrollIntoView({ behavior: 'smooth', block: 'center' });
      $('progressBar').style.width = '100%';
    }

    step();
  }

  function showMsg(msg, ok) {
    var el = $('msg');
    if (!msg) { el.style.display = 'none'; return; }
    el.textContent = msg;
    el.className = ok ? 'success' : 'note';
    el.style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', init);
})();
