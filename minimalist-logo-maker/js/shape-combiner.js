// MinimalistLogoMaker — Shape Combiner
// Pick 2-3 basic shapes + colors, combine into a minimalist SVG logo, download it.
(function () {
  "use strict";

  var SIZE = 400; // viewBox size
  var PRESETS = ["#141414", "#ffffff", "#c2410c", "#2563eb", "#059669", "#f59e0b", "#7c3aed", "#ec4899"];

  var state = {
    bg: "white", // white | transparent | black
    shapes: [
      { on: true, type: "circle", color: "#141414", size: 120, x: 200, y: 200, rot: 0 },
      { on: true, type: "triangle", color: "#c2410c", size: 105, x: 200, y: 175, rot: 0 },
      { on: false, type: "square", color: "#2563eb", size: 90, x: 200, y: 235, rot: 12 }
    ]
  };

  var stage = document.getElementById("stage");
  var hint = document.getElementById("combinerHint");

  function shapeMarkup(s) {
    var sc = s.size / 100;
    var inner = "";
    if (s.type === "circle") {
      inner = '<circle cx="0" cy="0" r="52"/>';
    } else if (s.type === "triangle") {
      inner = '<polygon points="0,-56 48.5,28 -48.5,28"/>';
    } else if (s.type === "square") {
      inner = '<rect x="-46" y="-46" width="92" height="92"/>';
    } else if (s.type === "line") {
      inner = '<rect x="-105" y="-9" width="210" height="18" rx="9"/>';
    }
    return '<g transform="translate(' + s.x + ',' + s.y + ') rotate(' + s.rot + ') scale(' + sc.toFixed(3) + ')" fill="' + s.color + '">' + inner + "</g>";
  }

  function activeShapes() {
    return state.shapes.filter(function (s) { return s.on; });
  }

  function bgRect(forExport) {
    if (state.bg === "transparent") return "";
    var c = state.bg === "black" ? "#141414" : "#ffffff";
    var extra = forExport ? ' width="' + SIZE + '" height="' + SIZE + '"' : "";
    return '<rect x="0" y="0" width="' + SIZE + '" height="' + SIZE + '" fill="' + c + '"' + extra + "/>";
  }

  function buildSVG(forExport) {
    var parts = activeShapes().map(shapeMarkup).join("");
    if (forExport) {
      return '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 ' + SIZE + " " + SIZE + '">' +
        bgRect(true) + parts + "</svg>";
    }
    return '<svg viewBox="0 0 ' + SIZE + " " + SIZE + '" width="100%" style="max-width:340px;height:auto;display:block" role="img" aria-label="Minimalist logo preview">' +
      bgRect(false) + parts + "</svg>";
  }

  function render() {
    if (stage) stage.innerHTML = buildSVG(false);
    // sync card opacity + checkbox state
    state.shapes.forEach(function (s, i) {
      var card = document.getElementById("shapeCard" + i);
      if (card) card.classList.toggle("off", !s.on);
    });
  }

  function setHint(msg) {
    if (hint) hint.textContent = msg;
  }

  function activeCount() { return activeShapes().length; }

  function bindShapeCard(i) {
    var s = state.shapes[i];
    var on = document.getElementById("s" + i + "on");
    var type = document.getElementById("s" + i + "type");
    var color = document.getElementById("s" + i + "color");
    var size = document.getElementById("s" + i + "size");
    var x = document.getElementById("s" + i + "x");
    var y = document.getElementById("s" + i + "y");
    var rot = document.getElementById("s" + i + "rot");
    var sizeVal = document.getElementById("s" + i + "sizeVal");
    var xVal = document.getElementById("s" + i + "xVal");
    var yVal = document.getElementById("s" + i + "yVal");
    var rotVal = document.getElementById("s" + i + "rotVal");

    function syncLabels() {
      if (sizeVal) sizeVal.textContent = s.size + "%";
      if (xVal) xVal.textContent = s.x;
      if (yVal) yVal.textContent = s.y;
      if (rotVal) rotVal.textContent = s.rot + "°";
    }
    function syncSwatches() {
      var card = document.getElementById("shapeCard" + i);
      if (!card) return;
      var sws = card.querySelectorAll(".swatch");
      for (var k = 0; k < sws.length; k++) {
        sws[k].classList.toggle("sel", sws[k].dataset.color.toLowerCase() === s.color.toLowerCase());
      }
    }

    if (on) on.addEventListener("change", function () {
      if (!on.checked && activeCount() <= 2) {
        on.checked = true;
        setHint("Keep at least 2 shapes active — minimalism loves pairs.");
        return;
      }
      s.on = on.checked;
      setHint(s.on ? "Shape " + (i + 1) + " added." : "Shape " + (i + 1) + " removed.");
      render();
    });
    if (type) type.addEventListener("change", function () { s.type = type.value; render(); });
    if (color) color.addEventListener("input", function () { s.color = color.value; syncSwatches(); render(); });
    if (size) size.addEventListener("input", function () { s.size = +size.value; syncLabels(); render(); });
    if (x) x.addEventListener("input", function () { s.x = +x.value; syncLabels(); render(); });
    if (y) y.addEventListener("input", function () { s.y = +y.value; syncLabels(); render(); });
    if (rot) rot.addEventListener("input", function () { s.rot = +rot.value; syncLabels(); render(); });

    // preset swatches
    var card = document.getElementById("shapeCard" + i);
    if (card) {
      var sws = card.querySelectorAll(".swatch");
      for (var k = 0; k < sws.length; k++) {
        (function (sw) {
          sw.addEventListener("click", function () {
            s.color = sw.dataset.color;
            if (color) color.value = s.color;
            syncSwatches(); render();
          });
        })(sws[k]);
      }
    }

    // init control values
    if (on) on.checked = s.on;
    if (type) type.value = s.type;
    if (color) color.value = s.color;
    if (size) size.value = s.size;
    if (x) x.value = s.x;
    if (y) y.value = s.y;
    if (rot) rot.value = s.rot;
    syncLabels(); syncSwatches();
  }

  function randomize() {
    var types = ["circle", "triangle", "square", "line"];
    state.shapes.forEach(function (s) {
      s.type = types[Math.floor(Math.random() * types.length)];
      s.color = PRESETS[Math.floor(Math.random() * PRESETS.length)];
      s.size = 70 + Math.floor(Math.random() * 90);
      s.x = 120 + Math.floor(Math.random() * 160);
      s.y = 120 + Math.floor(Math.random() * 160);
      s.rot = Math.floor(Math.random() * 90);
    });
    // re-bind values to controls
    for (var i = 0; i < 3; i++) {
      var s = state.shapes[i];
      var get = function (id) { return document.getElementById(id); };
      if (get("s" + i + "type")) get("s" + i + "type").value = s.type;
      if (get("s" + i + "color")) get("s" + i + "color").value = s.color;
      if (get("s" + i + "size")) get("s" + i + "size").value = s.size;
      if (get("s" + i + "x")) get("s" + i + "x").value = s.x;
      if (get("s" + i + "y")) get("s" + i + "y").value = s.y;
      if (get("s" + i + "rot")) get("s" + i + "rot").value = s.rot;
      var card = document.getElementById("shapeCard" + i);
      if (card) {
        var sws = card.querySelectorAll(".swatch");
        for (var k = 0; k < sws.length; k++) {
          sws[k].classList.toggle("sel", sws[k].dataset.color.toLowerCase() === s.color.toLowerCase());
        }
      }
      var lv = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
      lv("s" + i + "sizeVal", s.size + "%");
      lv("s" + i + "xVal", s.x);
      lv("s" + i + "yVal", s.y);
      lv("s" + i + "rotVal", s.rot + "°");
    }
    setHint("New random combination — tweak it until it feels right.");
    render();
  }

  function reset() {
    state.shapes[0] = { on: true, type: "circle", color: "#141414", size: 120, x: 200, y: 200, rot: 0 };
    state.shapes[1] = { on: true, type: "triangle", color: "#c2410c", size: 105, x: 200, y: 175, rot: 0 };
    state.shapes[2] = { on: false, type: "square", color: "#2563eb", size: 90, x: 200, y: 235, rot: 12 };
    for (var i = 0; i < 3; i++) {
      var s = state.shapes[i];
      var get = function (id) { return document.getElementById(id); };
      if (get("s" + i + "on")) get("s" + i + "on").checked = s.on;
      if (get("s" + i + "type")) get("s" + i + "type").value = s.type;
      if (get("s" + i + "color")) get("s" + i + "color").value = s.color;
      if (get("s" + i + "size")) get("s" + i + "size").value = s.size;
      if (get("s" + i + "x")) get("s" + i + "x").value = s.x;
      if (get("s" + i + "y")) get("s" + i + "y").value = s.y;
      if (get("s" + i + "rot")) get("s" + i + "rot").value = s.rot;
    }
    // refresh swatch highlights + labels by re-running bind's sync via a render
    setHint("Reset to the starter composition.");
    // easiest: re-init swatches by dispatching through bindShapeCard sync — just re-call render and fix swatches manually
    for (var j = 0; j < 3; j++) {
      (function (idx) {
        var card = document.getElementById("shapeCard" + idx);
        if (!card) return;
        var sws = card.querySelectorAll(".swatch");
        for (var k = 0; k < sws.length; k++) {
          sws[k].classList.toggle("sel", sws[k].dataset.color.toLowerCase() === state.shapes[idx].color.toLowerCase());
        }
        var s2 = state.shapes[idx];
        var lv = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
        lv("s" + idx + "sizeVal", s2.size + "%");
        lv("s" + idx + "xVal", s2.x);
        lv("s" + idx + "yVal", s2.y);
        lv("s" + idx + "rotVal", s2.rot + "°");
      })(j);
    }
    render();
  }

  function downloadSVG() {
    var svg = buildSVG(true);
    var blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "minimalist-logo.svg";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 400);
    setHint("Downloaded minimalist-logo.svg — a true vector file, free for commercial use.");
  }

  function copySVG() {
    var svg = buildSVG(true);
    function done() { setHint("SVG code copied to clipboard."); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(svg).then(done, function () { fallbackCopy(svg); done(); });
    } else { fallbackCopy(svg); done(); }
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* noop */ }
    document.body.removeChild(ta);
  }

  // wire up
  for (var i = 0; i < 3; i++) bindShapeCard(i);

  var bgSeg = document.getElementById("bgSeg");
  if (bgSeg) {
    var bts = bgSeg.querySelectorAll("button");
    for (var b = 0; b < bts.length; b++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          for (var k = 0; k < bts.length; k++) bts[k].classList.remove("on");
          btn.classList.add("on");
          state.bg = btn.dataset.bg;
          render();
        });
      })(bts[b]);
    }
  }

  var dl = document.getElementById("dlBtn");
  if (dl) dl.addEventListener("click", downloadSVG);
  var cp = document.getElementById("copyBtn");
  if (cp) cp.addEventListener("click", copySVG);
  var rnd = document.getElementById("rndBtn");
  if (rnd) rnd.addEventListener("click", randomize);
  var rst = document.getElementById("rstBtn");
  if (rst) rst.addEventListener("click", reset);

  render();
})();
