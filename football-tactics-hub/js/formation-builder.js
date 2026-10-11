/* FootballTacticsHub — interactive formation builder (canvas tactics board) */
(function () {
  "use strict";

  var canvas = document.getElementById("pitch");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var W = canvas.width, H = canvas.height;

  // Presets: fractional coords (x: 0 left → 1 right, y: 0 top/attack → 1 bottom/own goal)
  var PRESETS = {
    "4-4-2": [
      ["GK", 0.50, 0.93], ["RB", 0.16, 0.78], ["CB", 0.38, 0.80], ["CB", 0.62, 0.80], ["LB", 0.84, 0.78],
      ["RM", 0.16, 0.56], ["CM", 0.38, 0.58], ["CM", 0.62, 0.58], ["LM", 0.84, 0.56],
      ["ST", 0.38, 0.34], ["ST", 0.62, 0.34]
    ],
    "4-3-3": [
      ["GK", 0.50, 0.93], ["RB", 0.16, 0.78], ["CB", 0.38, 0.80], ["CB", 0.62, 0.80], ["LB", 0.84, 0.78],
      ["CM", 0.30, 0.56], ["CDM", 0.50, 0.62], ["CM", 0.70, 0.56],
      ["RW", 0.18, 0.34], ["ST", 0.50, 0.30], ["LW", 0.82, 0.34]
    ],
    "4-2-3-1": [
      ["GK", 0.50, 0.93], ["RB", 0.16, 0.78], ["CB", 0.38, 0.80], ["CB", 0.62, 0.80], ["LB", 0.84, 0.78],
      ["CDM", 0.38, 0.64], ["CDM", 0.62, 0.64],
      ["RW", 0.20, 0.44], ["CAM", 0.50, 0.46], ["LW", 0.80, 0.44],
      ["ST", 0.50, 0.28]
    ],
    "3-5-2": [
      ["GK", 0.50, 0.93], ["CB", 0.28, 0.80], ["CB", 0.50, 0.82], ["CB", 0.72, 0.80],
      ["RWB", 0.12, 0.56], ["CM", 0.32, 0.58], ["CDM", 0.50, 0.62], ["CM", 0.68, 0.58], ["LWB", 0.88, 0.56],
      ["ST", 0.38, 0.32], ["ST", 0.62, 0.32]
    ],
    "5-3-2": [
      ["GK", 0.50, 0.93], ["RWB", 0.12, 0.78], ["CB", 0.32, 0.80], ["CB", 0.50, 0.82], ["CB", 0.68, 0.80], ["LWB", 0.88, 0.78],
      ["CM", 0.30, 0.56], ["CM", 0.50, 0.60], ["CM", 0.70, 0.56],
      ["ST", 0.40, 0.32], ["ST", 0.60, 0.32]
    ]
  };

  var tokens = [];      // {num, role, name, x, y}
  var selected = null;  // selected token
  var dragging = null;
  var R = 34;           // token radius (px, in canvas coords)

  var presetSel = document.getElementById("preset");
  var teamInput = document.getElementById("team-name");
  var nameInput = document.getElementById("player-name");
  var textOut = document.getElementById("text-output");

  function loadPreset(key) {
    var defs = PRESETS[key] || PRESETS["4-3-3"];
    tokens = defs.map(function (d, i) {
      return { num: i + 1, role: d[0], name: "", x: d[1], y: d[2] };
    });
    selected = null;
    if (nameInput) nameInput.value = "";
    draw();
  }

  function drawPitch() {
    // grass with stripes
    var stripe = H / 12;
    for (var i = 0; i < 12; i++) {
      ctx.fillStyle = i % 2 ? "#0d5c2e" : "#0f6b36";
      ctx.fillRect(0, i * stripe, W, stripe + 1);
    }
    ctx.strokeStyle = "rgba(255,255,255,.92)";
    ctx.lineWidth = 4;
    var m = 40; // margin
    // outer boundary
    ctx.strokeRect(m, m, W - 2 * m, H - 2 * m);
    // halfway line
    ctx.beginPath(); ctx.moveTo(m, H / 2); ctx.lineTo(W - m, H / 2); ctx.stroke();
    // centre circle
    ctx.beginPath(); ctx.arc(W / 2, H / 2, 90, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.92)";
    ctx.beginPath(); ctx.arc(W / 2, H / 2, 6, 0, Math.PI * 2); ctx.fill();
    // penalty boxes (both ends)
    var boxW = 300, boxH = 130, sixW = 160, sixH = 55;
    function box(top) {
      var y = top ? m : H - m - boxH;
      ctx.strokeRect(W / 2 - boxW / 2, y, boxW, boxH);
      var sy = top ? m : H - m - sixH;
      ctx.strokeRect(W / 2 - sixW / 2, sy, sixW, sixH);
      // penalty spot + arc
      var spotY = top ? m + 92 : H - m - 92;
      ctx.beginPath(); ctx.arc(W / 2, spotY, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      if (top) ctx.arc(W / 2, spotY, 90, Math.PI * 0.22, Math.PI * 0.78);
      else ctx.arc(W / 2, spotY, 90, Math.PI * 1.22, Math.PI * 1.78);
      ctx.stroke();
    }
    box(true); box(false);
    // corner arcs
    ctx.lineWidth = 4;
    [[m, m, 0], [W - m, m, Math.PI / 2], [W - m, H - m, Math.PI], [m, H - m, -Math.PI / 2]].forEach(function (c) {
      ctx.beginPath(); ctx.arc(c[0], c[1], 22, c[2], c[2] + Math.PI / 2); ctx.stroke();
    });
  }

  function drawTokens() {
    tokens.forEach(function (t) {
      var x = t.x * W, y = t.y * H;
      // shadow
      ctx.beginPath(); ctx.arc(x + 3, y + 5, R, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.fill();
      // token body
      var grad = ctx.createRadialGradient(x - 10, y - 12, 6, x, y, R);
      grad.addColorStop(0, "#ffdd66"); grad.addColorStop(1, "#f5a623");
      ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();
      ctx.lineWidth = (t === selected) ? 5 : 3;
      ctx.strokeStyle = (t === selected) ? "#ff6f2c" : "#7a4d00";
      ctx.stroke();
      // role text
      ctx.fillStyle = "#3d2c00";
      ctx.font = "bold 19px system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(t.role, x, y - 6);
      ctx.font = "bold 15px system-ui, sans-serif";
      ctx.fillText(t.name || ("#" + t.num), x, y + 15);
    });
  }

  function drawTeamName() {
    var name = (teamInput && teamInput.value.trim()) || "MY TEAM";
    ctx.fillStyle = "rgba(255,255,255,.95)";
    ctx.font = "800 34px system-ui, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(name.toUpperCase(), W / 2, 470);
  }

  function draw() {
    drawPitch();
    drawTeamName();
    drawTokens();
  }

  function toCanvas(evt) {
    var r = canvas.getBoundingClientRect();
    return { x: (evt.clientX - r.left) * (W / r.width), y: (evt.clientY - r.top) * (H / r.height) };
  }

  function hitToken(p) {
    for (var i = tokens.length - 1; i >= 0; i--) {
      var t = tokens[i];
      var dx = t.x * W - p.x, dy = t.y * H - p.y;
      if (dx * dx + dy * dy <= (R + 12) * (R + 12)) return t;
    }
    return null;
  }

  canvas.addEventListener("pointerdown", function (e) {
    var p = toCanvas(e);
    var t = hitToken(p);
    if (t) {
      dragging = t;
      selected = t;
      if (nameInput) nameInput.value = t.name || "";
      canvas.setPointerCapture(e.pointerId);
      draw();
    }
    e.preventDefault();
  });

  canvas.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var p = toCanvas(e);
    dragging.x = Math.min(0.98, Math.max(0.02, p.x / W));
    dragging.y = Math.min(0.98, Math.max(0.02, p.y / H));
    draw();
    e.preventDefault();
  });

  function endDrag(e) {
    if (dragging) { dragging = null; draw(); }
  }
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  // rename selected token
  if (nameInput) {
    nameInput.addEventListener("input", function () {
      if (selected) { selected.name = nameInput.value.trim().slice(0, 14); draw(); }
    });
  }
  if (teamInput) teamInput.addEventListener("input", draw);

  // preset change
  if (presetSel) presetSel.addEventListener("change", function () { loadPreset(presetSel.value); });

  // reset
  document.getElementById("btn-reset").addEventListener("click", function () {
    if (teamInput) teamInput.value = "";
    loadPreset(presetSel ? presetSel.value : "4-3-3");
  });

  // export PNG
  document.getElementById("btn-png").addEventListener("click", function () {
    draw(); // ensure fresh
    var name = (teamInput && teamInput.value.trim()) || "my-team";
    var safe = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "my-team";
    var a = document.createElement("a");
    a.download = "formation-" + safe + ".png";
    a.href = canvas.toDataURL("image/png");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  // export / copy as text
  function buildText() {
    var name = (teamInput && teamInput.value.trim()) || "My Team";
    var sorted = tokens.slice().sort(function (a, b) { return b.y - a.y || a.x - b.x; });
    var lines = [name.toUpperCase() + " — " + (presetSel ? presetSel.value : "") + " FORMATION", ""];
    // group roughly: GK (bottom-most), defenders, midfielders, forwards
    var groups = { Goalkeeper: [], Defence: [], Midfield: [], Attack: [] };
    sorted.forEach(function (t) {
      var role = t.role;
      if (role === "GK") groups.Goalkeeper.push(t);
      else if (/^(CB|RB|LB|RWB|LWB|WB)$/.test(role)) groups.Defence.push(t);
      else if (/^(CDM|CM|CAM|RM|LM|RWM|LWM)$/.test(role)) groups.Midfield.push(t);
      else groups.Attack.push(t);
    });
    Object.keys(groups).forEach(function (g) {
      if (!groups[g].length) return;
      lines.push(g.toUpperCase() + ":");
      groups[g].forEach(function (t) {
        lines.push("  " + t.num + ". " + (t.name || "Player " + t.num) + " (" + t.role + ")");
      });
      lines.push("");
    });
    lines.push("Built with FootballTacticsHub — https://nan-footballtactics.surge.sh/tools/formation-builder.html");
    return lines.join("\n");
  }

  document.getElementById("btn-text").addEventListener("click", function () {
    var txt = buildText();
    textOut.value = txt;
    function done() { textOut.select(); alert("Lineup copied! Paste it anywhere to share."); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, function () { textOut.select(); });
    } else {
      textOut.select();
      try { document.execCommand("copy"); done(); } catch (e) { /* show text only */ }
    }
  });

  loadPreset(presetSel ? presetSel.value : "4-3-3");
})();
