// ImageShrink format converter — PNG/JPG/WebP, 100% client-side.
(function () {
  var state = { file: null, img: null, name: 'image', results: {} };

  function $(id) { return document.getElementById(id); }

  function init() {
    var dz = $('dropzone3'), fi = $('fileInput3');
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
    $('convertBtn').addEventListener('click', convert);
  }

  function handleFile(file) {
    if (!file.type.match(/^image\//)) { showMsg('Please choose an image file.', false); return; }
    state.file = file;
    state.name = file.name.replace(/\.[^.]+$/, '') || 'image';
    loadImageFile(file).then(function (r) {
      state.img = r.img;
      var fmt = file.type.replace('image/', '').toUpperCase();
      $('cOrig').textContent = fmt + ' • ' + formatBytes(file.size) + ' • ' + r.img.naturalWidth + '×' + r.img.naturalHeight;
      $('cPreview').classList.add('show');
      $('cControls').style.display = 'block';
      showMsg('', true);
    }).catch(function () { showMsg('Could not read this image file.', false); });
  }

  function convert() {
    if (!state.img) { showMsg('Upload an image first.', false); return; }
    var img = state.img;
    var c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    var ctx = c.getContext('2d');

    var targets = [
      { mime: 'image/jpeg', ext: 'jpg', label: 'JPG', q: 0.9 },
      { mime: 'image/png', ext: 'png', label: 'PNG', q: 1 },
      { mime: 'image/webp', ext: 'webp', label: 'WebP', q: 0.9 }
    ];
    var done = 0;
    var list = $('convList'); list.innerHTML = '';
    $('convResults').style.display = 'block';

    targets.forEach(function (t) {
      if (t.mime === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, c.width, c.height); }
      ctx.clearRect(0, 0, c.width, c.height);
      if (t.mime === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, c.width, c.height); }
      ctx.drawImage(img, 0, 0);
      c.toBlob(function (blob) {
        if (!blob) { done++; return; }
        var url = URL.createObjectURL(blob);
        var row = document.createElement('div');
        row.className = 'preview-box';
        row.style.marginBottom = '12px';
        row.innerHTML = '<strong>' + t.label + '</strong> <span class="stat">' + formatBytes(blob.size) + '</span> ';
        var a = document.createElement('a');
        a.href = url; a.download = state.name + '.' + t.ext;
        a.className = 'btn-purple'; a.style.padding = '8px 22px'; a.style.fontSize = '14px';
        a.textContent = 'Download ' + t.label;
        row.appendChild(a);
        list.appendChild(row);
        done++;
        if (done === targets.length) $('convResults').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, t.mime, t.q);
    });
  }

  function showMsg(msg, ok) {
    var el = $('msg3');
    if (!msg) { el.style.display = 'none'; return; }
    el.textContent = msg;
    el.className = ok ? 'success' : 'note';
    el.style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', init);
})();
