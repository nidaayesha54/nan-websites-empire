// Train/Test Split Visualizer — polynomial least squares, live overfitting demo
(function () {
  const canvas = document.getElementById('ttCanvas');
  const ctx = canvas.getContext('2d');
  const W = 860, H = 440;
  canvas.width = W; canvas.height = H;
  const XMAX = 10, YMIN = -3, YMAX = 4;
  const pad = 44;
  const toPx = (x) => pad + (x / XMAX) * (W - 2 * pad);
  const toPy = (y) => H - pad - ((y - YMIN) / (YMAX - YMIN)) * (H - 2 * pad);

  // deterministic PRNG so demos are reproducible
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  let seed = 7;
  let data = [];
  function genData() {
    const rnd = mulberry32(seed);
    data = [];
    for (let i = 0; i < 40; i++) {
      const x = (i / 39) * XMAX + (rnd() - 0.5) * 0.25;
      const y = 0.08 * (x - 5) * (x - 5) - 1 + (rnd() - 0.5) * 1.6;
      data.push({ x: Math.min(XMAX, Math.max(0, x)), y });
    }
    // shuffle so train/test split is i.i.d., not extrapolation
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const t = data[i]; data[i] = data[j]; data[j] = t;
    }
  }

  // Solve (X'X)b = X'y via Gaussian elimination with partial pivoting
  function solve(A, b) {
    const n = b.length;
    const M = A.map((row, i) => row.concat(b[i]));
    for (let col = 0; col < n; col++) {
      let piv = col;
      for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
      const tmp = M[col]; M[col] = M[piv]; M[piv] = tmp;
      const d = M[col][col] || 1e-12;
      for (let r = 0; r < n; r++) {
        if (r === col) continue;
        const f = M[r][col] / d;
        for (let c = col; c <= n; c++) M[r][c] -= f * M[col][c];
      }
    }
    return M.map((row, i) => row[n] / (row[i] || 1e-12));
  }

  function polyFit(pts, deg) {
    const n = deg + 1;
    const XtX = Array.from({ length: n }, () => new Array(n).fill(0));
    const Xty = new Array(n).fill(0);
    for (const p of pts) {
      const pw = [1];
      for (let d = 1; d <= deg; d++) pw[d] = pw[d - 1] * p.x;
      for (let i = 0; i < n; i++) {
        Xty[i] += pw[i] * p.y;
        for (let j = 0; j < n; j++) XtX[i][j] += pw[i] * pw[j];
      }
    }
    return solve(XtX, Xty);
  }
  function polyEval(beta, x) {
    let y = 0, pw = 1;
    for (let d = 0; d < beta.length; d++) { y += beta[d] * pw; pw *= x; }
    return y;
  }
  function mse(beta, pts) {
    if (!pts.length) return 0;
    let s = 0;
    for (const p of pts) { const e = p.y - polyEval(beta, p.x); s += e * e; }
    return s / pts.length;
  }

  const splitInput = document.getElementById('splitVal');
  const degInput = document.getElementById('degVal');

  function render() {
    const splitPct = parseInt(splitInput.value, 10);
    const deg = parseInt(degInput.value, 10);
    document.getElementById('splitLabel').textContent = splitPct + '% train / ' + (100 - splitPct) + '% test';
    document.getElementById('degLabel').textContent = 'degree ' + deg;

    const nTrain = Math.max(deg + 2, Math.round(data.length * splitPct / 100));
    const train = data.slice(0, nTrain);
    const test = data.slice(nTrain);
    const beta = polyFit(train, deg);
    const trErr = mse(beta, train), teErr = mse(beta, test);

    // draw
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = '#21262d'; ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath(); ctx.moveTo(toPx(i), pad); ctx.lineTo(toPx(i), H - pad); ctx.stroke();
    }
    for (let y = YMIN; y <= YMAX; y += 2) {
      ctx.beginPath(); ctx.moveTo(pad, toPy(y)); ctx.lineTo(W - pad, toPy(y)); ctx.stroke();
    }
    // (train/test points are interleaved after shuffling — no region shading)

    // fitted curve
    ctx.strokeStyle = '#3fb950'; ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = pad; px <= W - pad; px += 3) {
      const x = ((px - pad) / (W - 2 * pad)) * XMAX;
      const y = Math.min(YMAX + 3, Math.max(YMIN - 3, polyEval(beta, x)));
      const py = toPy(y);
      px === pad ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    // points
    for (const p of train) {
      ctx.fillStyle = '#58a6ff';
      ctx.beginPath(); ctx.arc(toPx(p.x), toPy(p.y), 5, 0, Math.PI * 2); ctx.fill();
    }
    for (const p of test) {
      ctx.fillStyle = '#d29922';
      ctx.beginPath(); ctx.arc(toPx(p.x), toPy(p.y), 5, 0, Math.PI * 2); ctx.fill();
    }
    // legend
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#58a6ff'; ctx.fillText('● train', pad + 8, pad - 12);
    ctx.fillStyle = '#d29922'; ctx.fillText('● test', pad + 80, pad - 12);
    ctx.fillStyle = '#3fb950'; ctx.fillText('— fitted polynomial', pad + 150, pad - 12);

    // stats
    document.getElementById('ttTrain').textContent = trErr.toFixed(3);
    document.getElementById('ttTest').textContent = teErr.toFixed(3);
    const gap = document.getElementById('ttGap');
    const ratio = trErr > 1e-9 ? teErr / trErr : 1;
    gap.textContent = ratio.toFixed(2) + '×';
    const verdict = document.getElementById('ttVerdict');
    if (ratio > 3 && teErr > 1.0) {
      verdict.textContent = '🔥 OVERFITTING! The model memorized the train points but fails on new data.';
      verdict.style.color = '#f85149';
    } else if (trErr > 0.45 && teErr > 0.45) {
      verdict.textContent = '📉 Underfitting — the model is too simple to capture the pattern. Try a higher degree.';
      verdict.style.color = '#d29922';
    } else {
      verdict.textContent = '✅ Good fit — train and test error are close. This is what you want!';
      verdict.style.color = '#3fb950';
    }
  }

  splitInput.addEventListener('input', render);
  degInput.addEventListener('input', render);
  document.getElementById('btnNewData').addEventListener('click', () => { seed++; genData(); render(); });

  genData();
  render();
})();
