/* DeepLearnViz — CNN Convolution Explainer */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var IMG = 160; /* working resolution */

  var FILTERS = {
    identity: { name: 'Identity', k: [[0, 0, 0], [0, 1, 0], [0, 0, 0]] },
    edge: { name: 'Edge detect', k: [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]] },
    sharpen: { name: 'Sharpen', k: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]] },
    blur: { name: 'Box blur', k: [[1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9]] },
    emboss: { name: 'Emboss', k: [[-2, -1, 0], [-1, 1, 1], [0, 1, 2]] },
    sobelx: { name: 'Sobel X', k: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]] }
  };
  var curFilter = 'edge';
  var gray = null; /* 2D array IMG x IMG, 0..255 */

  /* ---------- image handling ---------- */
  function drawSample() {
    var cv = $('inCanvas'), ctx = cv.getContext('2d');
    var g = ctx.createLinearGradient(0, 0, IMG, IMG);
    g.addColorStop(0, '#0a0a2e'); g.addColorStop(1, '#e8e8f8');
    ctx.fillStyle = g; ctx.fillRect(0, 0, IMG, IMG);
    ctx.fillStyle = '#ff2ea6';
    ctx.beginPath(); ctx.arc(IMG * 0.32, IMG * 0.38, IMG * 0.16, 0, 7); ctx.fill();
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(IMG * 0.58, IMG * 0.55, IMG * 0.26, IMG * 0.26);
    ctx.strokeStyle = '#a6ff00'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(10, IMG - 10); ctx.lineTo(IMG - 10, 10); ctx.stroke();
    captureGray();
  }

  function captureGray() {
    var cv = $('inCanvas'), ctx = cv.getContext('2d');
    var d = ctx.getImageData(0, 0, IMG, IMG).data;
    gray = [];
    for (var y = 0; y < IMG; y++) {
      var row = [];
      for (var x = 0; x < IMG; x++) {
        var i = (y * IMG + x) * 4;
        row.push(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
      }
      gray.push(row);
    }
  }

  /* ---------- convolution ---------- */
  function getKernel() {
    if (curFilter === 'custom') {
      var k = [];
      for (var r = 0; r < 3; r++) {
        var row = [];
        for (var c = 0; c < 3; c++) {
          var v = parseFloat($('ck' + r + c).value);
          row.push(isNaN(v) ? 0 : v);
        }
        k.push(row);
      }
      return k;
    }
    return FILTERS[curFilter].k;
  }

  function convolve(src, kernel) {
    var h = src.length, w = src[0].length, out = [];
    var vals = [];
    for (var y = 1; y < h - 1; y++) {
      var row = [];
      for (var x = 1; x < w - 1; x++) {
        var s = 0;
        for (var ky = -1; ky <= 1; ky++)
          for (var kx = -1; kx <= 1; kx++)
            s += src[y + ky][x + kx] * kernel[ky + 1][kx + 1];
        row.push(s); vals.push(s);
      }
      out.push(row);
    }
    var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals);
    var rng = (mx - mn) || 1;
    return out.map(function (r) { return r.map(function (v) { return (v - mn) / rng * 255; }); });
  }

  function paintGray(canvas, mat) {
    var ctx = canvas.getContext('2d');
    var h = mat.length, w = mat[0].length;
    canvas.width = w; canvas.height = h;
    var img = ctx.createImageData(w, h);
    for (var y = 0; y < h; y++)
      for (var x = 0; x < w; x++) {
        var i = (y * w + x) * 4, v = Math.round(mat[y][x]);
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
      }
    ctx.putImageData(img, 0, 0);
  }

  function applyFilter() {
    if (!gray) return;
    var k = getKernel();
    paintGray($('outCanvas'), convolve(gray, k));
    drawKernelViz(k);
    var fname = curFilter === 'custom' ? 'Custom 3×3' : FILTERS[curFilter].name;
    $('convMsg').textContent = 'Applied "' + fname + '" — ' + (IMG - 2) + '×' + (IMG - 2) + ' output (valid convolution, stride 1).';
  }

  function drawKernelViz(k) {
    var html = '<table class="kernel-table"><tbody>';
    for (var r = 0; r < 3; r++) {
      html += '<tr>';
      for (var c = 0; c < 3; c++) {
        var v = k[r][c], bg = v > 0 ? 'rgba(0,240,255,' + Math.min(0.85, Math.abs(v) / 8 + 0.15) + ')'
                                    : (v < 0 ? 'rgba(255,46,166,' + Math.min(0.85, Math.abs(v) / 8 + 0.15) + ')'
                                             : 'rgba(255,255,255,0.04)');
        html += '<td style="background:' + bg + ';text-align:center;font-family:monospace;font-size:.85rem">' +
          (Math.round(v * 100) / 100) + '</td>';
      }
      html += '</tr>';
    }
    $('kernelViz').innerHTML = html + '</tbody></table>';
  }

  /* ---------- step-through animation ---------- */
  var AG = 7; /* animation grid size */
  var animGrid = [], animOut = [], animPos = 0, animTimer = null, animKernel = [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]];

  function animReset() {
    animGrid = [];
    for (var y = 0; y < AG; y++) {
      var row = [];
      for (var x = 0; x < AG; x++) row.push(Math.floor(Math.random() * 10));
      animGrid.push(row);
    }
    animOut = [];
    for (var oy = 0; oy < AG - 2; oy++) { animOut.push(new Array(AG - 2).fill(null)); }
    animPos = 0;
    animStop();
    drawAnim();
    $('animMath').innerHTML = 'Press <strong>Step</strong> (or Play) to slide the filter across the grid.';
  }
  function animStop() {
    if (animTimer) { clearInterval(animTimer); animTimer = null; }
    var b = $('btnAnimPlay'); if (b) b.textContent = '▶ Play';
  }
  function animStep() {
    if (animPos >= (AG - 2) * (AG - 2)) { animStop(); return; }
    var oy = Math.floor(animPos / (AG - 2)), ox = animPos % (AG - 2);
    var terms = [], sum = 0;
    for (var ky = 0; ky < 3; ky++)
      for (var kx = 0; kx < 3; kx++) {
        var p = animGrid[oy + ky][ox + kx], w = animKernel[ky][kx];
        terms.push(p + '×' + w); sum += p * w;
      }
    animOut[oy][ox] = sum;
    animPos++;
    drawAnim();
    $('animMath').innerHTML = 'Output[' + oy + '][' + ox + '] = ' + terms.join(' + ') +
      ' = <strong style="color:var(--cyan)">' + sum + '</strong>';
  }
  function drawAnim() {
    var html = '<table class="kernel-table"><tbody>';
    var total = (AG - 2) * (AG - 2);
    var cy = animPos < total ? Math.floor(animPos / (AG - 2)) : -1;
    var cx = animPos < total ? animPos % (AG - 2) : -1;
    for (var y = 0; y < AG; y++) {
      html += '<tr>';
      for (var x = 0; x < AG; x++) {
        var hot = (y >= cy && y < cy + 3 && x >= cx && x < cx + 3) ? 'box-shadow:inset 0 0 0 3px var(--lime);' : '';
        html += '<td style="' + hot + 'text-align:center;font-family:monospace">' + animGrid[y][x] + '</td>';
      }
      html += '</tr>';
    }
    $('animIn').innerHTML = html + '</tbody></table>';
    var oh = '<table class="kernel-table"><tbody>';
    for (var oy = 0; oy < AG - 2; oy++) {
      oh += '<tr>';
      for (var ox = 0; ox < AG - 2; ox++) {
        var v = animOut[oy][ox];
        oh += '<td style="text-align:center;font-family:monospace;color:var(--cyan)">' + (v === null ? '·' : v) + '</td>';
      }
      oh += '</tr>';
    }
    $('animOut').innerHTML = oh + '</tbody></table>';
  }

  /* ---------- pooling demo ---------- */
  function poolDemo() {
    var g = [], y, x;
    for (y = 0; y < 4; y++) { var r = []; for (x = 0; x < 4; x++) r.push(Math.floor(Math.random() * 10)); g.push(r); }
    var o = [];
    for (y = 0; y < 2; y++) {
      var or = [];
      for (x = 0; x < 2; x++) or.push(Math.max(g[y * 2][x * 2], g[y * 2][x * 2 + 1], g[y * 2 + 1][x * 2], g[y * 2 + 1][x * 2 + 1]));
      o.push(or);
    }
    var mk = function (m, hl) {
      var h = '<table class="kernel-table"><tbody>';
      m.forEach(function (row, yy) {
        h += '<tr>';
        row.forEach(function (v, xx) {
          var win = hl && Math.floor(yy / 2) === hl[0] && Math.floor(xx / 2) === hl[1];
          h += '<td style="text-align:center;font-family:monospace' + (win ? ';box-shadow:inset 0 0 0 3px var(--magenta)' : '') + '">' + v + '</td>';
        });
        h += '</tr>';
      });
      return h + '</tbody></table>';
    };
    $('poolIn').innerHTML = mk(g);
    $('poolOut').innerHTML = mk(o);
    $('poolMsg').textContent = '2×2 max-pooling: each window keeps only its maximum → 4×4 becomes 2×2. This shrinks the image while keeping the strongest features.';
  }

  /* ---------- wiring ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    $('inCanvas').width = IMG; $('inCanvas').height = IMG;
    drawSample();
    document.querySelectorAll('[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('[data-filter]').forEach(function (b) { b.classList.remove('btn-primary'); b.classList.add('btn-ghost'); });
        btn.classList.remove('btn-ghost'); btn.classList.add('btn-primary');
        curFilter = btn.getAttribute('data-filter');
        $('customBox').style.display = curFilter === 'custom' ? 'block' : 'none';
        applyFilter();
      });
    });
    document.querySelectorAll('.kernel-in').forEach(function (inp) {
      inp.addEventListener('input', function () { if (curFilter === 'custom') applyFilter(); });
    });
    $('btnSample').addEventListener('click', function () { drawSample(); applyFilter(); });
    $('fileUp').addEventListener('change', function (e) {
      var f = e.target.files[0];
      if (!f) return;
      var img = new Image();
      img.onload = function () {
        var cv = $('inCanvas'), ctx = cv.getContext('2d');
        var s = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, IMG, IMG);
        captureGray(); applyFilter();
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(f);
    });
    $('btnAnimStep').addEventListener('click', animStep);
    $('btnAnimReset').addEventListener('click', animReset);
    $('btnAnimPlay').addEventListener('click', function () {
      if (animTimer) { animStop(); return; }
      if (animPos >= (AG - 2) * (AG - 2)) animReset();
      $('btnAnimPlay').textContent = '⏸ Pause';
      animTimer = setInterval(function () {
        animStep();
        if (animPos >= (AG - 2) * (AG - 2)) animStop();
      }, 900);
    });
    $('btnPool').addEventListener('click', poolDemo);
    applyFilter(); animReset(); poolDemo();
  });
})();
