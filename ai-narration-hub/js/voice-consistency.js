// Voice Consistency — pre-narration checklist + character voice tracker (localStorage)
(function () {
  'use strict';

  var CHECK_KEY = 'anh-checklist-v1';
  var CHAR_KEY = 'anh-characters-v1';

  var CHECKLIST = [
    'AI narration disclosure plan confirmed (platform rules checked)',
    'Pronunciation glossary finalized for names, places, and invented words',
    'Character voice notes written for every speaking character',
    'Chapter markers / section breaks marked in the manuscript',
    'Narration pace set (150 wpm baseline) and pause lengths decided',
    'Room tone / silence baseline captured for editing',
    'Test chapter narrated and reviewed end-to-end before full run',
    'Volume levels consistent across all chapters (no sudden jumps)',
    'Dialogue vs narration tone shift practiced (or tagged in script)',
    'Breath / mouth-noise cleanup pass scheduled after recording',
    'Backup of raw audio + formatted scripts stored in two places',
    'Final listen-through of one full chapter at 1x speed, no skipping'
  ];

  function $(id) { return document.getElementById(id); }

  function loadJSON(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v === null || v === undefined ? fallback : v;
    } catch (e) { return fallback; }
  }
  function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ }
  }

  /* ---------- Checklist ---------- */
  function renderChecklist() {
    var state = loadJSON(CHECK_KEY, {});
    var box = $('vc-checklist');
    box.innerHTML = '';
    CHECKLIST.forEach(function (label, i) {
      var row = document.createElement('label');
      row.className = 'check-row' + (state[i] ? ' done' : '');
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !!state[i];
      cb.setAttribute('aria-label', label);
      cb.addEventListener('change', function () {
        state[i] = cb.checked;
        saveJSON(CHECK_KEY, state);
        row.classList.toggle('done', cb.checked);
        updateProgress();
      });
      var span = document.createElement('span');
      span.textContent = label;
      row.appendChild(cb);
      row.appendChild(span);
      box.appendChild(row);
    });
    updateProgress();
  }

  function updateProgress() {
    var state = loadJSON(CHECK_KEY, {});
    var done = CHECKLIST.filter(function (_, i) { return state[i]; }).length;
    var pct = Math.round((done / CHECKLIST.length) * 100);
    $('vc-progress-bar').style.width = pct + '%';
    $('vc-progress-lbl').textContent = done + ' of ' + CHECKLIST.length + ' complete (' + pct + '%)';
  }

  function resetChecklist() {
    saveJSON(CHECK_KEY, {});
    renderChecklist();
  }

  /* ---------- Character tracker ---------- */
  function getChars() { return loadJSON(CHAR_KEY, []); }

  function renderChars() {
    var chars = getChars();
    var box = $('vc-char-table');
    if (!chars.length) {
      box.innerHTML = '<p style="color:var(--muted)">No characters yet — add your first one above. ' +
        'Track every voice so chapter 22 sounds like chapter 1.</p>';
      return;
    }
    var html = '<div style="overflow-x:auto"><table><thead><tr>' +
      '<th>Character</th><th>Voice profile</th><th>Sample line</th><th></th></tr></thead><tbody>';
    chars.forEach(function (c, i) {
      html += '<tr><td><b>' + esc(c.name) + '</b></td>' +
        '<td>Pitch: ' + esc(c.pitch) + '<br>Pace: ' + esc(c.pace) + '<br>Notes: ' + esc(c.notes) + '</td>' +
        '<td><i>"' + esc(c.sample) + '"</i></td>' +
        '<td><button class="btn-sm ghost" data-del="' + i + '">✕</button></td></tr>';
    });
    box.innerHTML = html + '</tbody></table></div>';
    box.querySelectorAll('[data-del]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var list = getChars();
        list.splice(parseInt(btn.getAttribute('data-del'), 10), 1);
        saveJSON(CHAR_KEY, list);
        renderChars();
      });
    });
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function addCharacter() {
    var name = $('vc-name').value.trim();
    if (!name) {
      $('vc-char-status').textContent = 'Give the character a name first.';
      return;
    }
    var list = getChars();
    list.push({
      name: name,
      pitch: $('vc-pitch').value,
      pace: $('vc-pace').value,
      notes: $('vc-notes').value.trim() || '—',
      sample: $('vc-sample').value.trim() || '—'
    });
    saveJSON(CHAR_KEY, list);
    $('vc-name').value = ''; $('vc-notes').value = ''; $('vc-sample').value = '';
    renderChars();
    $('vc-char-status').textContent = 'Added "' + name + '" ✓ — saved in this browser.';
  }

  function exportChars() {
    var list = getChars();
    if (!list.length) { $('vc-char-status').textContent = 'No characters to export yet.'; return; }
    var txt = 'CHARACTER VOICE SHEET\n' + new Date().toISOString().slice(0, 10) + '\n\n';
    list.forEach(function (c, i) {
      txt += (i + 1) + '. ' + c.name + '\n   Pitch: ' + c.pitch + ' | Pace: ' + c.pace +
        '\n   Notes: ' + c.notes + '\n   Sample line: "' + c.sample + '"\n\n';
    });
    window.ANH.copyText(txt, $('vc-char-status'), 'Voice sheet copied — paste it into your project notes ✓');
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderChecklist();
    renderChars();
    if ($('vc-reset')) $('vc-reset').addEventListener('click', resetChecklist);
    if ($('vc-add')) $('vc-add').addEventListener('click', addCharacter);
    if ($('vc-export')) $('vc-export').addEventListener('click', exportChars);
  });
})();
