/* DeepLearnViz — Activation Function Lab */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var FUNCS = {
    sigmoid: {
      name: 'Sigmoid', f: function (x) { return 1 / (1 + Math.exp(-x)); },
      df: function (x) { var s = 1 / (1 + Math.exp(-x)); return s * (1 - s); },
      formula: 'σ(x) = 1 / (1 + e^(−x))', range: '[0, 1]',
      use: 'Output layer for binary classification; gates in LSTMs.',
      gotcha: 'Saturates for large |x| → vanishing gradients. Rarely used in hidden layers today.'
    },
    tanh: {
      name: 'Tanh', f: function (x) { return Math.tanh(x); },
      df: function (x) { var t = Math.tanh(x); return 1 - t * t; },
      formula: 'tanh(x) = (e^x − e^(−x)) / (e^x + e^(−x))', range: '[−1, 1]',
      use: 'Hidden layers in small networks; zero-centered outputs help learning.',
      gotcha: 'Still saturates at extremes — the same vanishing-gradient problem as sigmoid.'
    },
    relu: {
      name: 'ReLU', f: function (x) { return Math.max(0, x); },
      df: function (x) { return x > 0 ? 1 : 0; },
      formula: 'ReLU(x) = max(0, x)', range: '[0, ∞)',
      use: 'The default for hidden layers in modern networks. Fast and simple.',
      gotcha: '"Dying ReLU": neurons stuck at 0 stop learning forever if weights push them negative.'
    },
    leaky: {
      name: 'Leaky ReLU', f: function (x) { return x > 0 ? x : 0.01 * x; },
      df: function (x) { return x > 0 ? 1 : 0.01; },
      formula: 'LReLU(x) = x if x>0 else 0.01·x', range: '(−∞, ∞)',
      use: 'Fixes dying ReLU by letting a small gradient through for negatives.',
      gotcha: 'The 0.01 slope is arbitrary — tune it (or learn it: PReLU) if it matters.'
    },
    swish: {
      name: 'Swish', f: function (x) { var s = 1 / (1 + Math.exp(-x)); return x * s; },
      df: function (x) { var s = 1 / (1 + Math.exp(-x)); return s + x * s * (1 - s); },
      formula: 'swish(x) = x · σ(x)', range: '(−0.28, ∞)',
      use: 'Found by Google (2017); often beats ReLU on deep vision models.',
      gotcha: 'Slightly more expensive to compute than ReLU.'
    }
  };
  var current = 'relu', showDeriv = true;

  function draw() {
    var cv = $('actCanvas'), ctx = cv.getContext('2d');
    var W = cv.width, H = cv.height, pad = 34;
    var XMIN = -6, XMAX = 6;
    var F = FUNCS[current];
    var x2px = function (x) { return pad + (W - 2 * pad) * (x - XMIN) / (XMAX - XMIN); };
    /* y range: fit f and (optionally) derivative */
    var YMIN = -2.2, YMAX = 4.2;
    var y2px = function (y) { return H - pad - (H - 2 * pad) * (y - YMIN) / (YMAX - YMIN); };
    ctx.clearRect(0, 0, W, H);
    /* grid */
    ctx.strokeStyle = '#16213c'; ctx.lineWidth = 1;
    for (var gx = -6; gx <= 6; gx += 2) {
      ctx.beginPath(); ctx.moveTo(x2px(gx), pad - 10); ctx.lineTo(x2px(gx), H - pad + 10); ctx.stroke();
      ctx.fillStyle = '#5a6b96'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(gx, x2px(gx), H - pad + 16);
    }
    /* axes */
    ctx.strokeStyle = '#3a4a7a';
    ctx.beginPath(); ctx.moveTo(pad - 10, y2px(0)); ctx.lineTo(W - pad + 10, y2px(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2px(0), pad - 10); ctx.lineTo(x2px(0), H - pad + 10); ctx.stroke();
    /* function curve */
    ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 3; ctx.beginPath();
    for (var px = 0; px <= W; px += 2) {
      var x = XMIN + (px / W) * (XMAX - XMIN);
      var y = F.f(x);
      var py = y2px(Math.max(YMIN, Math.min(YMAX, y)));
      if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    /* derivative curve */
    if (showDeriv) {
      ctx.strokeStyle = '#ff2ea6'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath();
      for (var qx = 0; qx <= W; qx += 2) {
        var xx = XMIN + (qx / W) * (XMAX - XMIN);
        var yy = F.df(xx);
        var qy = y2px(Math.max(YMIN, Math.min(YMAX, yy)));
        if (qx === 0) ctx.moveTo(qx, qy); else ctx.lineTo(qx, qy);
      }
      ctx.stroke(); ctx.setLineDash([]);
    }
    /* slider marker */
    var sx = parseFloat($('ctlX').value);
    ctx.strokeStyle = '#a6ff00'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x2px(sx), pad - 10); ctx.lineTo(x2px(sx), H - pad + 10); ctx.stroke();
    var fy = F.f(sx);
    ctx.fillStyle = '#a6ff00';
    ctx.beginPath(); ctx.arc(x2px(sx), y2px(Math.max(YMIN, Math.min(YMAX, fy))), 6, 0, 7); ctx.fill();
    /* readouts */
    $('outX').textContent = sx.toFixed(2);
    $('roF').textContent = fy.toFixed(4);
    $('roD').textContent = F.df(sx).toFixed(4);
    $('roName').textContent = F.name;
    $('roFormula').textContent = F.formula;
    $('roRange').textContent = F.range;
    $('roUse').textContent = F.use;
    $('roGotcha').textContent = F.gotcha;
  }

  /* ---------------- softmax demo ---------------- */
  function drawSoftmax() {
    var z = [parseFloat($('sm1').value), parseFloat($('sm2').value), parseFloat($('sm3').value)];
    var T = parseFloat($('smT').value);
    $('smTOut').textContent = T.toFixed(2);
    var ex = z.map(function (v) { return Math.exp(v / T); });
    var sum = ex.reduce(function (a, b) { return a + b; }, 0);
    var p = ex.map(function (v) { return v / sum; });
    var cv = $('smCanvas'), ctx = cv.getContext('2d');
    var W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    var cols = ['#00f0ff', '#ff2ea6', '#a6ff00'];
    var bw = 90, gap = 40, x0 = 40;
    for (var i = 0; i < 3; i++) {
      var bh = (H - 70) * p[i];
      var x = x0 + i * (bw + gap), y = H - 40 - bh;
      ctx.fillStyle = cols[i];
      ctx.fillRect(x, y, bw, Math.max(2, bh));
      ctx.fillStyle = '#e8eefc'; ctx.font = '13px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('class ' + (i + 1), x + bw / 2, H - 18);
      ctx.fillText((p[i] * 100).toFixed(1) + '%', x + bw / 2, y - 8);
      ctx.fillStyle = '#8fa0c8'; ctx.font = '11px sans-serif';
      ctx.fillText('z=' + z[i].toFixed(1), x + bw / 2, H - 4 + 0);
    }
    $('smOut1').textContent = z[0].toFixed(1);
    $('smOut2').textContent = z[1].toFixed(1);
    $('smOut3').textContent = z[2].toFixed(1);
    var winner = p.indexOf(Math.max.apply(null, p));
    $('smWinner').textContent = 'Winner: class ' + (winner + 1) + ' (' + (p[winner] * 100).toFixed(1) + '%)';
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-fn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('[data-fn]').forEach(function (b) { b.classList.remove('btn-primary'); b.classList.add('btn-ghost'); });
        btn.classList.remove('btn-ghost'); btn.classList.add('btn-primary');
        current = btn.getAttribute('data-fn');
        draw();
      });
    });
    $('ctlX').addEventListener('input', draw);
    $('chkDeriv').addEventListener('change', function (e) { showDeriv = e.target.checked; draw(); });
    ['sm1', 'sm2', 'sm3', 'smT'].forEach(function (id) { $(id).addEventListener('input', drawSoftmax); });
    draw(); drawSoftmax();
  });
})();
