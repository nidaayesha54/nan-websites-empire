/* QRGen tool logic: payload builders, live render, PNG/SVG export, logo overlay.
 * Everything runs locally in the browser. No network calls, no tracking. */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function escWifi(s) {
    return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;')
      .replace(/,/g, '\\,').replace(/:/g, '\\:').replace(/"/g, '\\"');
  }

  var state = {
    type: 'link', logoImg: null, result: null, payload: ''
  };

  function buildPayload() {
    var t = state.type, v;
    function val(id) { var el = $(id); return el ? el.value.trim() : ''; }
    switch (t) {
      case 'link': {
        v = val('inLink');
        if (!v) return '';
        if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) v = 'https://' + v;
        return v;
      }
      case 'text': return val('inText');
      case 'email': {
        var to = val('inEmailTo'); if (!to) return '';
        var q = [];
        if (val('inEmailSub')) q.push('subject=' + encodeURIComponent(val('inEmailSub')));
        if (val('inEmailBody')) q.push('body=' + encodeURIComponent(val('inEmailBody')));
        return 'mailto:' + to + (q.length ? '?' + q.join('&') : '');
      }
      case 'phone': {
        var p = val('inPhone'); if (!p) return '';
        return 'tel:' + p.replace(/[\s()-]/g, '');
      }
      case 'sms': {
        var n = val('inSmsNum'); if (!n) return '';
        return 'SMSTO:' + n.replace(/[\s()-]/g, '') + ':' + val('inSmsMsg');
      }
      case 'wifi': return buildWifi();
      case 'contact': {
        var fn = val('inCFirst'), ln = val('inCLast');
        if (!fn && !ln && !val('inCPhone') && !val('inCEmail')) return '';
        var lines = ['BEGIN:VCARD', 'VERSION:3.0'];
        lines.push('N:' + ln + ';' + fn + ';;;');
        lines.push('FN:' + (fn + ' ' + ln).trim());
        if (val('inCPhone')) lines.push('TEL;TYPE=CELL:' + val('inCPhone'));
        if (val('inCEmail')) lines.push('EMAIL:' + val('inCEmail'));
        if (val('inCOrg')) lines.push('ORG:' + val('inCOrg'));
        if (val('inCUrl')) lines.push('URL:' + val('inCUrl'));
        lines.push('END:VCARD');
        return lines.join('\n');
      }
      default: return '';
    }
  }

  function buildWifi() {
    var ssidEl = $('inWifiSsid') || $('wifiSsid');
    var ssid = ssidEl ? ssidEl.value.trim() : '';
    if (!ssid) return '';
    var passEl = $('inWifiPass') || $('wifiPass');
    var secEl = $('inWifiSec') || $('wifiSec');
    var hidEl = $('inWifiHidden') || $('wifiHidden');
    var sec = secEl ? secEl.value : 'WPA';
    var s = 'WIFI:T:' + sec + ';S:' + escWifi(ssid) + ';';
    if (sec !== 'nopass' && passEl && passEl.value) s += 'P:' + escWifi(passEl.value) + ';';
    if (hidEl && hidEl.checked) s += 'H:true;';
    return s + ';';
  }

  function showError(msg) {
    var e = $('qrError');
    if (!e) return;
    if (msg) { e.textContent = msg; e.classList.add('show'); }
    else { e.classList.remove('show'); }
  }

  function render() {
    var canvas = $('qrCanvas');
    if (!canvas || typeof QRCode === 'undefined') return;
    var payload = buildPayload();
    state.payload = payload;
    if (!payload) {
      showError('');
      var ctx0 = canvas.getContext('2d');
      ctx0.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = 300; canvas.height = 300;
      state.result = null;
      return;
    }
    var ecl = ($('qrEcl') && $('qrEcl').value === 'L') ? 0 : 1;
    try {
      var res = QRCode.encode(payload, ecl);
      state.result = res;
      showError('');
      drawCanvas(canvas, res);
    } catch (err) {
      showError(err.message);
      state.result = null;
    }
  }

  function drawCanvas(canvas, res) {
    var fg = ($('qrFg') && $('qrFg').value) || '#0b1220';
    var bg = ($('qrBg') && $('qrBg').value) || '#ffffff';
    var targetPx = parseInt(($('qrSize') && $('qrSize').value) || '1024', 10);
    var margin = parseInt(($('qrMargin') && $('qrMargin').value) || '4', 10);
    var total = res.size + margin * 2;
    var scale = Math.max(1, Math.floor(targetPx / total));
    canvas.width = total * scale;
    canvas.height = total * scale;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fg;
    for (var y = 0; y < res.size; y++) {
      for (var x = 0; x < res.size; x++) {
        if (res.modules[y][x]) ctx.fillRect((x + margin) * scale, (y + margin) * scale, scale, scale);
      }
    }
    drawLogo(ctx, canvas.width);
  }

  function drawLogo(ctx, px) {
    if (!state.logoImg || !state.logoImg.complete || !state.logoImg.naturalWidth) return;
    var box = Math.floor(px * 0.24);
    var x = Math.floor((px - box) / 2), y = Math.floor((px - box) / 2);
    var pad = Math.floor(box * 0.12);
    ctx.save();
    ctx.fillStyle = '#ffffff';
    if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, box, box, Math.floor(box * 0.18)); ctx.fill(); }
    else ctx.fillRect(x, y, box, box);
    var iw = state.logoImg.naturalWidth, ih = state.logoImg.naturalHeight;
    var s = Math.min((box - pad * 2) / iw, (box - pad * 2) / ih);
    var dw = Math.floor(iw * s), dh = Math.floor(ih * s);
    ctx.drawImage(state.logoImg, x + Math.floor((box - dw) / 2), y + Math.floor((box - dh) / 2), dw, dh);
    ctx.restore();
  }

  function downloadPNG() {
    if (!state.result) return;
    var canvas = $('qrCanvas');
    drawCanvas(canvas, state.result); // re-draw to include latest logo
    canvas.toBlob(function (blob) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'qrgen-code.png';
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    }, 'image/png');
  }

  function downloadSVG() {
    if (!state.result) return;
    var res = state.result;
    var fg = ($('qrFg') && $('qrFg').value) || '#0b1220';
    var bg = ($('qrBg') && $('qrBg').value) || '#ffffff';
    var margin = parseInt(($('qrMargin') && $('qrMargin').value) || '4', 10);
    var total = res.size + margin * 2;
    var cell = 10, W = total * cell;
    var d = '';
    for (var y = 0; y < res.size; y++) {
      for (var x = 0; x < res.size; x++) {
        if (res.modules[y][x]) {
          var px = (x + margin) * cell, py = (y + margin) * cell;
          d += 'M' + px + ' ' + py + 'h' + cell + 'v' + cell + 'h-' + cell + 'z';
        }
      }
    }
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + W +
      '" viewBox="0 0 ' + W + ' ' + W + '"><rect width="' + W + '" height="' + W +
      '" fill="' + bg + '"/><path d="' + d + '" fill="' + fg + '"/></svg>';
    var blob = new Blob([svg], { type: 'image/svg+xml' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'qrgen-code.svg';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function initTabs() {
    var tabs = document.querySelectorAll('#qrTabs .tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        state.type = tab.getAttribute('data-type');
        document.querySelectorAll('.type-fields').forEach(function (f) { f.style.display = 'none'; });
        var show = document.getElementById('fields-' + state.type);
        if (show) show.style.display = 'block';
        scheduleRender();
      });
    });
  }

  var timer = null;
  function scheduleRender() {
    clearTimeout(timer);
    timer = setTimeout(render, 250);
  }

  function init() {
    if (!$('qrCanvas')) return;
    var form = $('qrForm');
    if (form && form.getAttribute('data-qr-type')) state.type = form.getAttribute('data-qr-type');
    initTabs();
    document.querySelectorAll('#qrForm input, #qrForm select, #qrForm textarea').forEach(function (el) {
      el.addEventListener(el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'color' || el.type === 'file' ? 'change' : 'input', function () {
        if (el.type === 'file') loadLogo(el);
        else scheduleRender();
      });
    });
    var png = $('btnPng'), svg = $('btnSvg');
    if (png) png.addEventListener('click', downloadPNG);
    if (svg) svg.addEventListener('click', downloadSVG);
    var clearLogo = $('btnClearLogo');
    if (clearLogo) clearLogo.addEventListener('click', function () {
      state.logoImg = null;
      var fi = $('logoInput'); if (fi) fi.value = '';
      scheduleRender();
    });
    render();
  }

  function loadLogo(input) {
    var f = input.files && input.files[0];
    if (!f) { state.logoImg = null; scheduleRender(); return; }
    if (!/^image\//.test(f.type)) { showError('Logo must be an image file (PNG/JPG).'); return; }
    var rd = new FileReader();
    rd.onload = function () {
      var img = new Image();
      img.onload = function () { state.logoImg = img; showError(''); scheduleRender(); };
      img.onerror = function () { showError('Could not read that image.'); };
      img.src = rd.result;
    };
    rd.readAsDataURL(f);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
