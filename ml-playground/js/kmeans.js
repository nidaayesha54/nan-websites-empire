// K-Means Clustering Visualizer — real Lloyd's algorithm, animated iterations
(function () {
  const canvas = document.getElementById('kmCanvas');
  const ctx = canvas.getContext('2d');
  const W = 860, H = 460;
  canvas.width = W; canvas.height = H;
  const pad = 20;
  const COLORS = ['#58a6ff', '#3fb950', '#f778ba', '#d29922', '#bc8cff'];

  let points = [];       // {x, y, c}
  let centroids = [];    // {x, y}
  let running = false, timer = null, iter = 0;
  const MAX_ITER = 30;

  const kInput = document.getElementById('kVal');
  const kLabel = document.getElementById('kLabel');

  function seedPoints() {
    points = [];
    const blobs = [[220, 140], [620, 130], [400, 330]];
    for (let b = 0; b < 3; b++) {
      for (let i = 0; i < 14; i++) {
        points.push({
          x: blobs[b][0] + (Math.random() - 0.5) * 170,
          y: blobs[b][1] + (Math.random() - 0.5) * 130,
          c: -1
        });
      }
    }
  }

  function initCentroids(k) {
    centroids = [];
    const used = new Set();
    while (centroids.length < k && used.size < points.length) {
      const i = Math.floor(Math.random() * points.length);
      if (!used.has(i)) { used.add(i); centroids.push({ x: points[i].x, y: points[i].y }); }
    }
  }

  function dist2(a, b) { const dx = a.x - b.x, dy = a.y - b.y; return dx * dx + dy * dy; }

  // one Lloyd iteration; returns true if any assignment changed
  function step() {
    let changed = false;
    for (const p of points) {
      let best = 0, bd = Infinity;
      centroids.forEach((c, i) => { const d = dist2(p, c); if (d < bd) { bd = d; best = i; } });
      if (p.c !== best) { p.c = best; changed = true; }
    }
    // recompute centroids
    const sums = centroids.map(() => ({ x: 0, y: 0, n: 0 }));
    for (const p of points) { sums[p.c].x += p.x; sums[p.c].y += p.y; sums[p.c].n++; }
    sums.forEach((s, i) => {
      if (s.n > 0) { centroids[i].x = s.x / s.n; centroids[i].y = s.y / s.n; }
    });
    return changed;
  }

  function inertia() {
    let s = 0;
    for (const p of points) if (p.c >= 0) s += dist2(p, centroids[p.c]);
    return s;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#161b22'; ctx.fillRect(0, 0, W, H);
    // faint cluster regions (voronoi-ish skip; just draw points + centroids)
    for (const p of points) {
      ctx.fillStyle = p.c >= 0 ? COLORS[p.c % COLORS.length] : '#8b949e';
      ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill();
    }
    centroids.forEach((c, i) => {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.beginPath(); ctx.arc(c.x, c.y, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // crosshair
      ctx.strokeStyle = '#0d1117'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(c.x - 6, c.y); ctx.lineTo(c.x + 6, c.y);
      ctx.moveTo(c.x, c.y - 6); ctx.lineTo(c.x, c.y + 6);
      ctx.stroke();
    });
    document.getElementById('kmIter').textContent = iter;
    document.getElementById('kmInertia').textContent = points.length && centroids.length ? Math.round(inertia()) : '—';
    document.getElementById('kmPoints').textContent = points.length;
  }

  function stop() { running = false; clearInterval(timer); timer = null; document.getElementById('btnRun').textContent = '▶ Run K-Means'; }

  function run() {
    if (running) { stop(); return; }
    const k = parseInt(kInput.value, 10);
    if (points.length < k) { alert('Add at least ' + k + ' points first (click on the canvas).'); return; }
    initCentroids(k);
    points.forEach(p => p.c = -1);
    iter = 0;
    running = true;
    document.getElementById('btnRun').textContent = '⏸ Pause';
    draw();
    timer = setInterval(() => {
      iter++;
      const changed = step();
      draw();
      if (!changed || iter >= MAX_ITER) stop();
    }, 700);
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (canvas.width / r.width), y: (e.clientY - r.top) * (canvas.height / r.height) };
  }
  canvas.addEventListener('pointerdown', (e) => {
    if (running) return;
    const { x, y } = pos(e);
    if (x < pad || x > W - pad || y < pad || y > H - pad) return;
    points.push({ x, y, c: -1 });
    draw();
  });

  kInput.addEventListener('input', () => { kLabel.textContent = kInput.value; });
  document.getElementById('btnRun').addEventListener('click', run);
  document.getElementById('btnStep').addEventListener('click', () => {
    if (running) return;
    const k = parseInt(kInput.value, 10);
    if (!centroids.length) {
      if (points.length < k) { alert('Add at least ' + k + ' points first.'); return; }
      initCentroids(k); points.forEach(p => p.c = -1); iter = 0;
    } else { iter++; step(); }
    draw();
  });
  document.getElementById('btnSeed').addEventListener('click', () => { stop(); seedPoints(); centroids = []; iter = 0; draw(); });
  document.getElementById('btnClearKm').addEventListener('click', () => { stop(); points = []; centroids = []; iter = 0; draw(); });

  seedPoints();
  draw();
})();
