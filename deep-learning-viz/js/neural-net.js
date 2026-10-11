/* DeepLearnViz — Neural Network Playground engine (vanilla JS, real backprop) */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var tanh = function (x) { return Math.tanh(x); };
  var sigmoid = function (x) { return 1 / (1 + Math.exp(-x)); };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  /* ---------------- datasets ---------------- */
  function randn() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function makeDataset(kind, n) {
    var X = [], Y = [], i, x, y, k, c, l;
    if (kind === 'circle') {
      for (i = 0; i < n; i++) {
        x = Math.random() * 2 - 1; y = Math.random() * 2 - 1;
        X.push([x, y]); Y.push((x * x + y * y < 0.35) ? 1 : 0);
      }
    } else if (kind === 'xor') {
      c = [[-0.6, -0.6], [0.6, 0.6], [-0.6, 0.6], [0.6, -0.6]];
      for (i = 0; i < n; i++) {
        k = i % 4; l = (k < 2) ? 1 : 0;
        X.push([c[k][0] + randn() * 0.16, c[k][1] + randn() * 0.16]); Y.push(l);
      }
    } else { /* blobs */
      for (i = 0; i < n; i++) {
        l = i % 2;
        X.push([(l ? 0.55 : -0.55) + randn() * 0.27, (l ? -0.42 : 0.45) + randn() * 0.27]);
        Y.push(l);
      }
    }
    return { X: X, Y: Y };
  }

  /* ---------------- MLP with full-batch gradient descent ---------------- */
  function MLP(sizes) {
    this.sizes = sizes.slice();
    this.W = []; this.b = [];
    for (var l = 1; l < sizes.length; l++) {
      var nin = sizes[l - 1], nout = sizes[l];
      var lim = Math.sqrt(6 / (nin + nout));
      var Wl = [];
      for (var i = 0; i < nout; i++) {
        var row = [];
        for (var j = 0; j < nin; j++) row.push((Math.random() * 2 - 1) * lim);
        Wl.push(row);
      }
      this.W.push(Wl);
      this.b.push(new Array(nout).fill(0));
    }
  }
  MLP.prototype.forward = function (x) {
    var acts = [x.slice()], a = x.slice(), l, i, j, s, z, Wl, bl, n;
    for (l = 0; l < this.W.length; l++) {
      Wl = this.W[l]; bl = this.b[l]; n = Wl.length; z = new Array(n);
      for (i = 0; i < n; i++) {
        s = bl[i];
        for (j = 0; j < a.length; j++) s += Wl[i][j] * a[j];
        z[i] = s;
      }
      a = (l === this.W.length - 1) ? z.map(sigmoid) : z.map(tanh);
      acts.push(a);
    }
    return acts;
  };
  MLP.prototype.trainEpoch = function (X, Y, lr) {
    var L = this.W.length, N = X.length, l, i, j, k, s;
    var gW = this.W.map(function (Wl) { return Wl.map(function (r) { return r.map(function () { return 0; }); }); });
    var gb = this.b.map(function (v) { return v.map(function () { return 0; }); });
    var loss = 0, acts, out, delta, deltas, d, prev, e;
    for (s = 0; s < N; s++) {
      acts = this.forward(X[s]);
      out = clamp(acts[L][0], 1e-7, 1 - 1e-7);
      loss += -(Y[s] * Math.log(out) + (1 - Y[s]) * Math.log(1 - out));
      deltas = new Array(L);
      deltas[L - 1] = [out - Y[s]]; /* sigmoid + cross-entropy */
      for (l = L - 2; l >= 0; l--) {
        var nd = new Array(this.sizes[l + 1]).fill(0);
        var Wn = this.W[l + 1], dn = deltas[l + 1];
        for (i = 0; i < nd.length; i++) {
          e = 0;
          for (k = 0; k < dn.length; k++) e += Wn[k][i] * dn[k];
          var av = acts[l + 1][i];
          nd[i] = e * (1 - av * av); /* tanh derivative */
        }
        deltas[l] = nd;
      }
      for (l = 0; l < L; l++) {
        d = deltas[l]; prev = acts[l];
        for (i = 0; i < d.length; i++) {
          gb[l][i] += d[i];
          for (j = 0; j < prev.length; j++) gW[l][i][j] += d[i] * prev[j];
        }
      }
    }
    for (l = 0; l < L; l++) {
      for (i = 0; i < this.W[l].length; i++) {
        this.b[l][i] -= lr * gb[l][i] / N;
        for (j = 0; j < this.W[l][i].length; j++) this.W[l][i][j] -= lr * gW[l][i][j] / N;
      }
    }
    return loss / N;
  };
  MLP.prototype.accuracy = function (X, Y) {
    var c = 0, L = this.W.length;
    for (var s = 0; s < X.length; s++) {
      var p = this.forward(X[s])[L][0] >= 0.5 ? 1 : 0;
      if (p === Y[s]) c++;
    }
    return c / X.length;
  };

  /* ---------------- state ---------------- */
  var net = null, data = null, training = false, animating = false;
  var epoch = 0, lossHist = [], maxEpochs = 600;
  var hlCount = 2, hlNeurons = 4, learnRate = 0.5, dsKind = 'circle';

  var BOUND = 300, GRID = 60;

  /* ---------------- network diagram (SVG) ---------------- */
  function drawDiagram(acts) {
    var svg = $('netSvg');
    if (!svg || !net) return;
    var Wpx = 560, Hpx = 340, pad = 46;
    var layers = net.sizes.length;
    var xs = [];
    for (var l = 0; l < layers; l++) xs.push(pad + (Wpx - 2 * pad) * (layers === 1 ? 0.5 : l / (layers - 1)));
    var html = '';
    var i, j, ll;
    /* edges */
    for (ll = 0; ll < net.sizes.length - 1; ll++) {
      var n1 = net.sizes[ll], n2 = net.sizes[ll + 1];
      for (i = 0; i < n2; i++) {
        var y2 = pad + (Hpx - 2 * pad) * (n2 === 1 ? 0.5 : i / (n2 - 1));
        for (j = 0; j < n1; j++) {
          var y1 = pad + (Hpx - 2 * pad) * (n1 === 1 ? 0.5 : j / (n1 - 1));
          var w = net.W[ll][i][j];
          var sw = clamp(Math.abs(w) * 2.2, 0.6, 7).toFixed(1);
          var col = w >= 0 ? 'rgba(0,240,255,' : 'rgba(255,46,166,';
          var op = (0.18 + clamp(Math.abs(w), 0, 1.5) * 0.45).toFixed(2);
          html += '<line x1="' + xs[ll] + '" y1="' + y1.toFixed(1) + '" x2="' + xs[ll + 1] + '" y2="' + y2.toFixed(1) +
            '" stroke="' + col + op + ')" stroke-width="' + sw + '"/>';
        }
      }
    }
    /* nodes */
    var labels = ['input', 'hidden', 'output'];
    for (ll = 0; ll < layers; ll++) {
      var n = net.sizes[ll];
      var kind = ll === 0 ? 0 : (ll === layers - 1 ? 2 : 1);
      for (i = 0; i < n; i++) {
        var yy = pad + (Hpx - 2 * pad) * (n === 1 ? 0.5 : i / (n - 1));
        var fill = '#16213c', stroke = '#3a4a7a';
        if (acts && acts[ll]) {
          var av = acts[ll][i];
          if (kind === 2) { /* sigmoid 0..1 */
            var t = clamp(av, 0, 1);
            fill = 'rgb(' + Math.round(20 + t * 235) + ',' + Math.round(120 - t * 60) + ',' + Math.round(200 - t * 160) + ')';
          } else if (kind === 1) { /* tanh -1..1 */
            var it = clamp(Math.abs(av), 0, 1);
            fill = av >= 0 ? 'rgba(0,240,255,' + (0.12 + it * 0.88).toFixed(2) + ')'
                           : 'rgba(255,46,166,' + (0.12 + it * 0.88).toFixed(2) + ')';
          } else {
            fill = 'rgba(166,255,0,' + (0.25 + clamp(Math.abs(av) / 1.5, 0, 1) * 0.75).toFixed(2) + ')';
          }
          stroke = '#e8eefc';
        }
        html += '<circle cx="' + xs[ll] + '" cy="' + yy.toFixed(1) + '" r="15" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.6"/>';
        if (acts && acts[ll] && acts[ll][i] !== undefined) {
          html += '<text x="' + xs[ll] + '" y="' + (yy + 32).toFixed(1) + '" text-anchor="middle" fill="#8fa0c8" font-size="10" font-family="monospace">' +
            acts[ll][i].toFixed(2) + '</text>';
        }
      }
      html += '<text x="' + xs[ll] + '" y="18" text-anchor="middle" fill="#8fa0c8" font-size="11">' + labels[kind] + ' (' + n + ')</text>';
    }
    svg.setAttribute('viewBox', '0 0 ' + Wpx + ' ' + Hpx);
    svg.innerHTML = html;
  }

  /* ---------------- decision boundary ---------------- */
  function drawBoundary() {
    var cv = $('boundCanvas');
    if (!cv || !net) return;
    var ctx = cv.getContext('2d');
    var cell = BOUND / GRID, gx, gy, px, py, o, a;
    for (gy = 0; gy < GRID; gy++) {
      for (gx = 0; gx < GRID; gx++) {
        px = (gx + 0.5) / GRID * 2 - 1;
        py = (gy + 0.5) / GRID * 2 - 1;
        o = net.forward([px, py])[net.W.length][0];
        a = (Math.abs(o - 0.5) * 2 * 0.5).toFixed(2);
        ctx.fillStyle = o >= 0.5 ? 'rgba(0,240,255,' + a + ')' : 'rgba(255,46,166,' + a + ')';
        ctx.fillRect(gx * cell, gy * cell, cell + 0.5, cell + 0.5);
      }
    }
    /* data points */
    for (var s = 0; s < data.X.length; s++) {
      px = (data.X[s][0] + 1) / 2 * BOUND;
      py = (data.X[s][1] + 1) / 2 * BOUND;
      ctx.beginPath();
      ctx.arc(px, py, 3.2, 0, 7);
      ctx.fillStyle = data.Y[s] ? '#00f0ff' : '#ff2ea6';
      ctx.fill();
      ctx.strokeStyle = '#04070f'; ctx.lineWidth = 1; ctx.stroke();
    }
  }

  /* ---------------- loss chart ---------------- */
  function drawLoss() {
    var cv = $('lossCanvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = '#1d2a4d';
    ctx.beginPath(); ctx.moveTo(34, 6); ctx.lineTo(34, H - 22); ctx.lineTo(W - 6, H - 22); ctx.stroke();
    if (lossHist.length < 2) {
      ctx.fillStyle = '#8fa0c8'; ctx.font = '12px sans-serif';
      ctx.fillText('Press Train — loss curve appears here', 46, H / 2);
      return;
    }
    var mx = Math.max.apply(null, lossHist);
    var step = Math.max(1, Math.floor(lossHist.length / 200));
    ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 2; ctx.beginPath();
    var first = true;
    for (var i = 0; i < lossHist.length; i += step) {
      var x = 34 + (W - 44) * (i / (lossHist.length - 1));
      var y = 6 + (H - 32) * (1 - lossHist[i] / (mx || 1));
      if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = '#8fa0c8'; ctx.font = '11px sans-serif';
    ctx.fillText('loss ' + lossHist[lossHist.length - 1].toFixed(4), 40, 18);
    ctx.fillText('epoch ' + epoch, W - 90, H - 6);
  }

  function drawStats() {
    if (!net || !data) return;
    $('stEpoch').textContent = epoch;
    $('stLoss').textContent = lossHist.length ? lossHist[lossHist.length - 1].toFixed(4) : '—';
    $('stAcc').textContent = (net.accuracy(data.X, data.Y) * 100).toFixed(1) + '%';
    var total = 0;
    net.W.forEach(function (Wl) { Wl.forEach(function (r) { total += r.length; }); });
    net.b.forEach(function (v) { total += v.length; });
    $('stParams').textContent = total;
  }

  function drawAll() { drawDiagram(null); drawBoundary(); drawLoss(); drawStats(); }

  /* ---------------- training loop ---------------- */
  function rebuild() {
    training = false;
    $('btnTrain').textContent = '▶ Train network';
    var sizes = [2];
    for (var i = 0; i < hlCount; i++) sizes.push(hlNeurons);
    sizes.push(1);
    net = new MLP(sizes);
    data = makeDataset(dsKind, 220);
    epoch = 0; lossHist = [];
    drawAll();
    $('trainMsg').textContent = 'Network rebuilt: ' + sizes.join(' → ') + '. Press Train.';
  }

  function tick() {
    if (!training) return;
    var per = 12;
    for (var k = 0; k < per && epoch < maxEpochs; k++) {
      var l = net.trainEpoch(data.X, data.Y, learnRate);
      epoch++;
      if (epoch % 2 === 0) lossHist.push(l);
    }
    drawDiagram(null); drawBoundary(); drawLoss(); drawStats();
    if (epoch >= maxEpochs) {
      training = false;
      $('btnTrain').textContent = '▶ Train network';
      $('trainMsg').textContent = 'Training finished at epoch ' + epoch + '. Try the forward-pass animation!';
      return;
    }
    setTimeout(tick, 30);
  }

  /* ---------------- forward-pass animation ---------------- */
  async function animateForward() {
    if (!net || animating) return;
    animating = true;
    var s = Math.floor(Math.random() * data.X.length);
    var x = data.X[s], y = data.Y[s];
    var acts = net.forward(x);
    $('trainMsg').textContent = 'Sample (' + x[0].toFixed(2) + ', ' + x[1].toFixed(2) + ') → true class ' + y;
    for (var l = 0; l < acts.length; l++) {
      drawDiagram(acts);
      var pred = l === acts.length - 1 ? ' → prediction: ' + (acts[l][0] >= 0.5 ? 1 : 0) +
        ' (confidence ' + (acts[l][0] * 100).toFixed(1) + '%)' : '';
      $('trainMsg').textContent = 'Layer ' + l + ' / ' + (acts.length - 1) + ' lighting up…' + pred;
      await sleep(650);
    }
    animating = false;
  }

  /* ---------------- wiring ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    $('ctlLayers').addEventListener('input', function (e) {
      hlCount = parseInt(e.target.value, 10);
      $('outLayers').textContent = hlCount;
    });
    $('ctlNeurons').addEventListener('input', function (e) {
      hlNeurons = parseInt(e.target.value, 10);
      $('outNeurons').textContent = hlNeurons;
    });
    $('ctlLr').addEventListener('input', function (e) {
      learnRate = parseFloat(e.target.value);
      $('outLr').textContent = learnRate.toFixed(2);
    });
    $('ctlEpochs').addEventListener('input', function (e) {
      maxEpochs = parseInt(e.target.value, 10);
      $('outEpochs').textContent = maxEpochs;
    });
    $('ctlData').addEventListener('change', function (e) { dsKind = e.target.value; });
    $('btnRebuild').addEventListener('click', rebuild);
    $('btnTrain').addEventListener('click', function () {
      training = !training;
      $('btnTrain').textContent = training ? '⏸ Pause' : '▶ Train network';
      if (training) { $('trainMsg').textContent = 'Training…'; tick(); }
    });
    $('btnAnimate').addEventListener('click', animateForward);
    rebuild();
  });
})();
