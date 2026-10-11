// Caption timing calculator: script -> caption segments with timestamps + SRT export
(function () {
  'use strict';

  function pad(n, len) {
    n = String(n);
    while (n.length < (len || 2)) n = '0' + n;
    return n;
  }

  function fmtClock(sec) {
    sec = Math.max(0, sec);
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = Math.floor(sec % 60);
    return pad(h) + ':' + pad(m) + ':' + pad(s);
  }

  function fmtSrt(sec) {
    sec = Math.max(0, sec);
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = Math.floor(sec % 60);
    var ms = Math.round((sec - Math.floor(sec)) * 1000);
    return pad(h) + ':' + pad(m) + ':' + pad(s) + ',' + pad(ms, 3);
  }

  function parseOffset(str) {
    str = (str || '').trim();
    if (!str) return 0;
    if (/^\d+(\.\d+)?$/.test(str)) return parseFloat(str);
    var parts = str.split(':').map(function (p) { return parseFloat(p) || 0; });
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  }

  // Split script into words, keeping sentence-ending punctuation attached.
  function buildSegments(script, wps, maxWords, offset, gap) {
    var words = script.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
    if (!words.length) return [];
    var segments = [];
    var i = 0;
    var t = offset;
    while (i < words.length) {
      // Prefer breaking at sentence boundaries when close to maxWords.
      var chunk = [];
      while (i < words.length && chunk.length < maxWords) {
        chunk.push(words[i]);
        i++;
        if (/[.!?…]$/.test(words[i - 1]) && chunk.length >= 3) break;
      }
      var dur = Math.round(Math.max(chunk.length / wps, 0.8) * 100) / 100; // minimum readable duration
      segments.push({
        start: t,
        end: t + dur,
        text: chunk.join(' ')
      });
      t += dur + gap;
    }
    return segments;
  }

  function render(segments) {
    var box = document.getElementById('segmentList');
    box.innerHTML = '';
    segments.forEach(function (sg, idx) {
      var div = document.createElement('div');
      div.className = 'caption-seg';
      var ts = document.createElement('span');
      ts.className = 'ts';
      ts.textContent = fmtClock(sg.start) + ' → ' + fmtClock(sg.end);
      var tx = document.createElement('span');
      tx.textContent = sg.text;
      div.appendChild(ts);
      div.appendChild(tx);
      box.appendChild(div);
    });
    var total = segments.length ? segments[segments.length - 1].end : 0;
    var words = segments.reduce(function (a, s) { return a + s.text.split(' ').length; }, 0);
    document.getElementById('statsLine').innerHTML =
      'Segments: <strong>' + segments.length + '</strong> · Words: <strong>' + words +
      '</strong> · Estimated runtime: <strong>' + fmtClock(total) + '</strong>';
    document.getElementById('results').style.display = 'block';
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
  }

  function buildSrt(segments) {
    return segments.map(function (sg, idx) {
      return (idx + 1) + '\n' + fmtSrt(sg.start) + ' --> ' + fmtSrt(sg.end) + '\n' + sg.text + '\n';
    }).join('\n');
  }

  var lastSegments = [];

  function calculate() {
    var script = document.getElementById('scriptInput').value;
    if (!script.trim()) { showAlert('Paste your script first.'); return; }
    var wps = parseFloat(document.getElementById('wps').value) || 2.5;
    var maxWords = parseInt(document.getElementById('maxWords').value, 10) || 6;
    var offset = parseOffset(document.getElementById('offset').value);
    var gap = parseFloat(document.getElementById('gap').value) || 0;
    lastSegments = buildSegments(script, wps, maxWords, offset, gap);
    render(lastSegments);
  }

  function downloadSrt() {
    if (!lastSegments.length) { showAlert('Generate captions first.'); return; }
    var blob = new Blob([buildSrt(lastSegments)], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'captions.srt';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function copySrt() {
    if (!lastSegments.length) { showAlert('Generate captions first.'); return; }
    navigator.clipboard.writeText(buildSrt(lastSegments)).then(function () {
      showAlert('SRT copied to clipboard ✔');
    });
  }

  function showAlert(msg) {
    var a = document.getElementById('alertBox');
    a.textContent = msg;
    a.style.display = 'block';
    setTimeout(function () { a.style.display = 'none'; }, 2500);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('calcBtn').addEventListener('click', calculate);
    document.getElementById('srtBtn').addEventListener('click', downloadSrt);
    document.getElementById('copySrtBtn').addEventListener('click', copySrt);
  });
})();
