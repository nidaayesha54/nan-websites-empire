// ImageShrink resizer — dimension presets + custom, 100% client-side.
(function () {
  var state = { file: null, img: null, name: 'image', result: null };

  var PRESETS = {
    'instagram-post': [1080, 1080, 'Instagram Post (1:1)'],
    'instagram-story': [1080, 1920, 'Instagram Story (9:16)'],
    'facebook-post': [1200, 630, 'Facebook Post'],
    'twitter-post': [1200, 675, 'X / Twitter Post'],
    'youtube-thumb': [1280, 720, 'YouTube Thumbnail'],
    'linkedin-post': [1200, 627, 'LinkedIn Post'],
    'pinterest-pin': [1000, 1500, 'Pinterest Pin (2:3)'],
    'tiktok': [1080, 1920, 'TikTok Video Cover']
  };

  function $(id) { return document.getElementById(id); }

  function init() {
    var dz = $('dropzone2'), fi = $('fileInput2');
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

    // preset chips
    var wrap = $('presets');
    Object.keys(PRESETS).forEach(function (k) {
      var b = document.createElement('button');
      b.className = 'chip'; b.type = 'button'; b.dataset.preset = k;
      b.textContent = PRESETS[k][2];
      b.addEventListener('click', function () {
        document.querySelectorAll('#presets .chip').forEach(function (c) { c.classList.remove('active'); });
        b.classList.add('active');
        $('widthIn').value = PRESETS[k][0];
        $('heightIn').value = PRESETS[k][1];
        $('modeFit').checked = true;
        updateAspect();
      });
      wrap.appendChild(b);
    });

    ['widthIn', 'heightIn'].forEach(function (id) { $(id).addEventListener('input', updateAspect); });
    document.querySelectorAll('input[name="fitmode"]').forEach(function (r) {
      r.addEventListener('change', updateAspect);
    });
    $('resizeBtn').addEventListener('click', resize);
    $('downloadBtn2').addEventListener('click', function () {
      if (!state.result) return;
      downloadBlob(state.result.blob, state.result.filename);
    });
  }

  function updateAspect() {
    var w = parseInt($('widthIn').value, 10) || 0, h = parseInt($('heightIn').value, 10) || 0;
    var mode = document.querySelector('input[name="fitmode"]:checked').value;
    var label = $('aspectLabel');
    if (w > 0 && h > 0) {
      var g = gcd(w, h);
      label.textContent = 'Aspect: ' + (w / g) + ':' + (h / g) + ' • Mode: ' + (mode === 'fit' ? 'Fit (pad)' : 'Fill (crop)');
    } else { label.textContent = ''; }
  }

  function gcd(a, b) { return b ? gcd(b, a % b) : a; }

  function handleFile(file) {
    if (!file.type.match(/^image\//)) { showMsg('Please choose an image file.', false); return; }
    state.file = file;
    state.name = file.name.replace(/\.[^.]+$/, '') || 'image';
    loadImageFile(file).then(function (r) {
      state.img = r.img;
      $('rOrigDims').textContent = r.img.naturalWidth + ' × ' + r.img.naturalHeight + ' px';
      $('rOrigSize').textContent = formatBytes(file.size);
      if (!$('widthIn').value) $('widthIn').value = r.img.naturalWidth;
      if (!$('heightIn').value) $('heightIn').value = r.img.naturalHeight;
      $('previewImg2').src = r.url;
      $('rControls').style.display = 'block';
      $('rPreview').classList.add('show');
      updateAspect();
      showMsg('', true);
    }).catch(function () { showMsg('Could not read this image file.', false); });
  }

  function resize() {
    if (!state.img) { showMsg('Upload an image first.', false); return; }
    var tw = parseInt($('widthIn').value, 10), th = parseInt($('heightIn').value, 10);
    if (!tw || !th || tw < 1 || th < 1) { showMsg('Enter a valid width and height.', false); return; }
    if (tw > 8000 || th > 8000) { showMsg('Max dimension is 8000 px.', false); return; }
    var mode = document.querySelector('input[name="fitmode"]:checked').value;
    var keepFormat = $('rFormat').value; // 'original' | 'jpeg' | 'png' | 'webp'
    var img = state.img, sw = img.naturalWidth, sh = img.naturalHeight;

    var c = document.createElement('canvas');
    c.width = tw; c.height = th;
    var ctx = c.getContext('2d');

    var scale = mode === 'fit' ? Math.min(tw / sw, th / sh) : Math.max(tw / sw, th / sh);
    var dw = sw * scale, dh = sh * scale;
    var dx = (tw - dw) / 2, dy = (th - dh) / 2;

    var outMime = 'image/png', ext = 'png';
    if (keepFormat === 'original') {
      if (state.file.type === 'image/jpeg') { outMime = 'image/jpeg'; ext = 'jpg'; }
      else if (state.file.type === 'image/webp') { outMime = 'image/webp'; ext = 'webp'; }
    } else if (keepFormat === 'jpeg') { outMime = 'image/jpeg'; ext = 'jpg'; }
    else if (keepFormat === 'webp') { outMime = 'image/webp'; ext = 'webp'; }

    if (outMime === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, tw, th); }
    ctx.drawImage(img, dx, dy, dw, dh);

    c.toBlob(function (blob) {
      state.result = { blob: blob, filename: state.name + '-' + tw + 'x' + th + '.' + ext };
      $('rResImg').src = URL.createObjectURL(blob);
      $('rResDims').textContent = tw + ' × ' + th + ' px';
      $('rResSize').textContent = formatBytes(blob.size);
      $('rResult').style.display = 'block';
      $('rResult').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, outMime, 0.92);
  }

  function showMsg(msg, ok) {
    var el = $('msg2');
    if (!msg) { el.style.display = 'none'; return; }
    el.textContent = msg;
    el.className = ok ? 'success' : 'note';
    el.style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', init);
})();
