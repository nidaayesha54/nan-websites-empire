// Linear Regression Lab — real least-squares math, drag-and-drop points
(function () {
  const canvas = document.getElementById('regCanvas');
  const ctx = canvas.getContext('2d');
  const W = 860, H = 480;
  canvas.width = W; canvas.height = H;

  // data space: x in [0,10], y in [0,22]
  const XMAX = 10, YM = 22;
  const pad = 46;
  const toPx = (x) => pad + (x / XMAX) * (W - 2 * pad);
  const toDx = (px) => ((px - pad) / (W - 2 * pad)) * XMAX;
  const toPy2 = (y) => H - pad - (y / YM) * (H - 2 * pad);
  const toDy2 = (py) => ((H - pad - py) / (H - 2 * pad)) * YM;

  let dragIdx = -1;

  // starter points roughly along y = 2x + 1 with noise
  let points = [
    { x: 0.8, y: 2.4 }, { x: 1.6, y: 4.0 }, { x: 2.5, y: 5.6 },
    { x: 3.4, y: 8.1 }, { x: 4.2, y: 8.9 }, { x: 5.1, y: 10.0 },
    { x: 6.0, y: 13.5 }, { x: 6.8, y: 14.2 }, { x: 7.7, y: 16.8 },
    { x: 8.6, y: 17.5 }, { x: 9.4, y: 20.3 }
  ];

  function fit() {
    const n = points.length;
    if (n < 2) return null;
    let sx = 0, sy = 0, sxx = 0, sxy = 0;
    for (const p of points) { sx += p.x; sy += p.y; sxx += p.x * p.x; sxy += p.x * p.y; }
    const denom = n * sxx - sx * sx;
    if (Math.abs(denom) < 1e-9) return null; // vertical line of points
    const m = (n * sxy - sx * sy) / denom;
    const b = (sy - m * sx) / n;
    const ybar = sy / n;
    let ssRes = 0, ssTot = 0;
    for (const p of points) {
      const yh = m * p.x + b;
      ssRes += (p.y - yh) * (p.y - yh);
      ssTot += (p.y - ybar) * (p.y - ybar);
    }
    const r2 = ssTot < 1e-9 ? 1 : 1 - ssRes / ssTot;
    return { m, b, r2 };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // grid
    ctx.strokeStyle = '#21262d'; ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath(); ctx.moveTo(toPx(i), pad); ctx.lineTo(toPx(i), H - pad); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad, toPy2(i * 2.2)); ctx.lineTo(W - pad, toPy2(i * 2.2)); ctx.stroke();
    }
    // axes
    ctx.strokeStyle = '#30363d'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(pad, pad); ctx.lineTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.stroke();

    const f = fit();
    // residual lines (draw before line so they sit under)
    if (f) {
      ctx.strokeStyle = 'rgba(215,153,34,0.45)'; ctx.lineWidth = 1;
      for (const p of points) {
        const yh = f.m * p.x + f.b;
        ctx.beginPath(); ctx.moveTo(toPx(p.x), toPy2(p.y)); ctx.lineTo(toPx(p.x), toPy2(yh)); ctx.stroke();
      }
      // regression line
      ctx.strokeStyle = '#3fb950'; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(toPx(0), toPy2(f.b));
      ctx.lineTo(toPx(XMAX), toPy2(f.m * XMAX + f.b));
      ctx.stroke();
    }
    // points
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      ctx.fillStyle = i === dragIdx ? '#f778ba' : '#58a6ff';
      ctx.beginPath(); ctx.arc(toPx(p.x), toPy2(p.y), 9, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#0d1117'; ctx.lineWidth = 2; ctx.stroke();
    }
    // stats
    const mEl = document.getElementById('statSlope'),
          bEl = document.getElementById('statIntercept'),
          rEl = document.getElementById('statR2'),
          nEl = document.getElementById('statN');
    if (f) {
      mEl.textContent = f.m.toFixed(3);
      bEl.textContent = f.b.toFixed(3);
      rEl.textContent = Math.max(0, f.r2).toFixed(4);
      rEl.style.color = f.r2 > 0.8 ? '#3fb950' : f.r2 > 0.5 ? '#d29922' : '#f85149';
    } else {
      mEl.textContent = '—'; bEl.textContent = '—'; rEl.textContent = '—';
    }
    nEl.textContent = points.length;
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    const sx = canvas.width / r.width, sy = canvas.height / r.height;
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
  }
  function nearest(px, py) {
    let best = -1, bd = 28 * 28;
    points.forEach((p, i) => {
      const dx = toPx(p.x) - px, dy = toPy2(p.y) - py;
      const d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  }

  canvas.addEventListener('pointerdown', (e) => {
    const { x, y } = pos(e);
    const i = nearest(x, y);
    if (i >= 0) { dragIdx = i; canvas.setPointerCapture(e.pointerId); }
    else {
      // add new point
      const dx = Math.min(XMAX, Math.max(0, toDx(x)));
      const dy = Math.min(YM, Math.max(0, toDy2(y)));
      points.push({ x: +dx.toFixed(2), y: +dy.toFixed(2) });
      draw();
    }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (dragIdx < 0) return;
    const { x, y } = pos(e);
    points[dragIdx].x = +Math.min(XMAX, Math.max(0, toDx(x))).toFixed(2);
    points[dragIdx].y = +Math.min(YM, Math.max(0, toDy2(y))).toFixed(2);
    draw();
  });
  canvas.addEventListener('pointerup', () => { dragIdx = -1; draw(); });

  document.getElementById('btnReset').addEventListener('click', () => {
    points = [
      { x: 0.8, y: 2.4 }, { x: 1.6, y: 4.0 }, { x: 2.5, y: 5.6 },
      { x: 3.4, y: 8.1 }, { x: 4.2, y: 8.9 }, { x: 5.1, y: 10.0 },
      { x: 6.0, y: 13.5 }, { x: 6.8, y: 14.2 }, { x: 7.7, y: 16.8 },
      { x: 8.6, y: 17.5 }, { x: 9.4, y: 20.3 }
    ];
    draw();
  });
  document.getElementById('btnScatter').addEventListener('click', () => {
    points = [];
    for (let i = 0; i < 12; i++) {
      points.push({ x: +(Math.random() * XMAX).toFixed(2), y: +(Math.random() * YM).toFixed(2) });
    }
    draw();
  });
  document.getElementById('btnClear').addEventListener('click', () => { points = []; draw(); });

  draw();
})();
