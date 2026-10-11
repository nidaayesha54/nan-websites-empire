/* AIAnimationMaker — Storyboard Planner */
(function () {
  'use strict';
  var KEY = 'aam_storyboard_v1';
  var SHOTS = ['Wide shot', 'Medium shot', 'Close-up', 'Extreme close-up', 'Overhead / aerial', 'POV', 'Tracking shot', 'Establishing shot', 'Montage'];

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function save(scenes) {
    try { localStorage.setItem(KEY, JSON.stringify(scenes)); } catch (e) {}
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var scenes = load();
  var form = document.getElementById('scene-form');
  var list = document.getElementById('scene-list');
  var totalBar = document.getElementById('total-bar');
  var exportBox = document.getElementById('export-box');

  function totalSeconds() {
    return scenes.reduce(function (t, s) { return t + (parseFloat(s.duration) || 0); }, 0);
  }
  function fmt(sec) {
    sec = Math.round(sec);
    var m = Math.floor(sec / 60), s = sec % 60;
    return m > 0 ? m + 'm ' + s + 's' : s + 's';
  }

  function render() {
    save(scenes);
    if (!scenes.length) {
      list.innerHTML = '<p class="output-empty">No scenes yet — add your first scene above. 🎬</p>';
      totalBar.style.display = 'none';
    } else {
      var html = '';
      var running = 0;
      scenes.forEach(function (s, i) {
        var dur = parseFloat(s.duration) || 0;
        var start = running;
        running += dur;
        html += '<div class="scene-card">'
          + '<h4>Scene ' + (i + 1) + ' — ' + esc(s.title) + '</h4>'
          + '<div class="scene-meta"><span>⏱ ' + fmt(dur) + '</span><span>📷 ' + esc(s.shot) + '</span><span>🎞 Starts at ' + fmt(start) + '</span></div>'
          + '<p><strong>Shot:</strong> ' + esc(s.desc) + '</p>'
          + (s.dialogue ? '<p><strong>💬 Dialogue/VO:</strong> ' + esc(s.dialogue) + '</p>' : '')
          + (s.notes ? '<p><strong>📝 Notes:</strong> ' + esc(s.notes) + '</p>' : '')
          + '<div class="scene-actions">'
          + '<button class="btn btn-ghost btn-sm" data-move="-1" data-i="' + i + '">↑</button>'
          + '<button class="btn btn-ghost btn-sm" data-move="1" data-i="' + i + '">↓</button>'
          + '<button class="btn btn-ghost btn-sm" data-del="' + i + '">🗑 Delete</button>'
          + '</div></div>';
      });
      list.innerHTML = html;
      totalBar.style.display = 'block';
      totalBar.textContent = '🎞 Total runtime: ' + fmt(running) + ' across ' + scenes.length + ' scene' + (scenes.length > 1 ? 's' : '');
    }
    exportBox.innerHTML = '<p class="output-empty">Click "Export as Text" to generate your storyboard document.</p>';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var title = document.getElementById('f-title').value.trim();
    var desc = document.getElementById('f-desc').value.trim();
    var duration = parseFloat(document.getElementById('f-duration').value);
    if (!title || !desc || !(duration > 0)) {
      alert('Please fill in the title, shot description, and a duration greater than 0.');
      return;
    }
    scenes.push({
      title: title,
      desc: desc,
      duration: duration,
      shot: document.getElementById('f-shot').value,
      dialogue: document.getElementById('f-dialogue').value.trim(),
      notes: document.getElementById('f-notes').value.trim()
    });
    form.reset();
    document.getElementById('f-shot').selectedIndex = 0;
    render();
  });

  list.addEventListener('click', function (e) {
    var t = e.target;
    if (t.dataset.del !== undefined) {
      scenes.splice(parseInt(t.dataset.del, 10), 1);
      render();
    } else if (t.dataset.move !== undefined) {
      var i = parseInt(t.dataset.i, 10);
      var j = i + parseInt(t.dataset.move, 10);
      if (j >= 0 && j < scenes.length) {
        var tmp = scenes[i]; scenes[i] = scenes[j]; scenes[j] = tmp;
        render();
      }
    }
  });

  document.getElementById('btn-clear').addEventListener('click', function () {
    if (scenes.length && confirm('Delete all scenes? This cannot be undone.')) {
      scenes = [];
      render();
    }
  });

  function buildExport() {
    if (!scenes.length) return '';
    var lines = [];
    lines.push('STORYBOARD — AI Animation Project');
    lines.push('Generated with AIAnimationMaker Storyboard Planner');
    lines.push('Total runtime: ' + fmt(totalSeconds()) + ' | ' + scenes.length + ' scenes');
    lines.push('='.repeat(52));
    var running = 0;
    scenes.forEach(function (s, i) {
      var dur = parseFloat(s.duration) || 0;
      lines.push('');
      lines.push('SCENE ' + (i + 1) + ': ' + s.title.toUpperCase());
      lines.push('Timecode: ' + fmt(running) + ' - ' + fmt(running + dur) + ' (' + fmt(dur) + ')');
      lines.push('Camera: ' + s.shot);
      lines.push('Shot description: ' + s.desc);
      if (s.dialogue) lines.push('Dialogue / VO: "' + s.dialogue + '"');
      if (s.notes) lines.push('Notes: ' + s.notes);
      running += dur;
    });
    lines.push('');
    lines.push('='.repeat(52));
    lines.push('Tip: paste each scene block into your AI animation generator as the prompt, one scene at a time.');
    return lines.join('\n');
  }

  document.getElementById('btn-export').addEventListener('click', function () {
    var text = buildExport();
    if (!text) { alert('Add at least one scene first.'); return; }
    exportBox.textContent = text;
    document.getElementById('export-actions').style.display = 'flex';
  });

  document.getElementById('btn-copy').addEventListener('click', function () {
    var text = buildExport();
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        alert('Storyboard copied to clipboard! 📋');
      }, function () { alert('Copy failed — select the text manually.'); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); alert('Storyboard copied to clipboard! 📋'); }
      catch (e) { alert('Copy failed — select the text manually.'); }
      document.body.removeChild(ta);
    }
  });

  document.getElementById('btn-download').addEventListener('click', function () {
    var text = buildExport();
    if (!text) return;
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'storyboard.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  });

  render();
})();
