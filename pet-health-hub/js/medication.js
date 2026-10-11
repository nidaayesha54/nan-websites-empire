/* PetHealthHub — medication reminder (planning aid only, not medical advice) */
'use strict';
(function () {
  var KEY = 'phh_meds_v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { meds: [], checks: {} }; }
    catch (e) { return { meds: [], checks: {} }; }
  }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
  function uid() { return 'm' + Date.now().toString(36) + Math.floor(Math.random() * 9999); }
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function validTime(t) { return /^([01]\d|2[0-3]):[0-5]\d$/.test(t); }
  function prettyTime(t) {
    var parts = t.split(':'), h = parseInt(parts[0], 10), m = parts[1];
    var ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    return h + ':' + m + ' ' + ap;
  }

  var state = load();
  var today = todayISO();
  document.getElementById('mToday').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  function render() {
    // Table of all medications
    var tbody = document.querySelector('#mTable tbody');
    tbody.innerHTML = '';
    if (!state.meds.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="color:#6b7280">No medications added yet.</td></tr>';
    }
    state.meds.forEach(function (med) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td><strong>' + esc(med.pet) + '</strong></td><td>' + esc(med.name) + '</td><td>' + esc(med.dose) + '</td>' +
        '<td>' + med.times.map(prettyTime).join(', ') + '</td><td>' + esc(med.notes || '—') + '</td>';
      var td = document.createElement('td');
      var btn = document.createElement('button');
      btn.textContent = 'Remove'; btn.className = 'btn btn-green'; btn.style.cssText = 'padding:6px 12px;background:#dc2626;font-size:.85rem';
      btn.addEventListener('click', function () {
        if (!confirm('Remove ' + med.name + ' for ' + med.pet + '?')) return;
        state.meds = state.meds.filter(function (x) { return x.id !== med.id; });
        save(state); render();
      });
      td.appendChild(btn); tr.appendChild(td);
      tbody.appendChild(tr);
    });

    // Today's checklist
    var list = document.getElementById('mChecklist');
    list.innerHTML = '';
    var checks = state.checks[today] || {};
    var items = [];
    state.meds.forEach(function (med) {
      med.times.forEach(function (t) { items.push({ id: med.id + '_' + t, med: med, time: t }); });
    });
    items.sort(function (a, b) { return a.time < b.time ? -1 : 1; });

    var doneCount = 0;
    if (!items.length) {
      list.innerHTML = '<p style="color:#6b7280">Add a medication above to build today\u2019s checklist.</p>';
    }
    items.forEach(function (it) {
      var checked = !!checks[it.id];
      if (checked) doneCount++;
      var label = document.createElement('label');
      var cb = document.createElement('input');
      cb.type = 'checkbox'; cb.checked = checked;
      cb.addEventListener('change', function () {
        state.checks[today] = state.checks[today] || {};
        if (cb.checked) state.checks[today][it.id] = true;
        else delete state.checks[today][it.id];
        save(state); render();
      });
      var span = document.createElement('span');
      span.innerHTML = '<strong>' + prettyTime(it.time) + '</strong> — ' + esc(it.med.pet) + ': ' +
        esc(it.med.name) + ' <small style="color:#6b7280">(' + esc(it.med.dose) + (it.med.notes ? ' — ' + esc(it.med.notes) : '') + ')</small>';
      if (checked) span.className = 'done-label';
      label.appendChild(cb); label.appendChild(span);
      list.appendChild(label);
    });

    document.getElementById('mProgress').textContent = items.length
      ? doneCount + ' of ' + items.length + ' doses given today' + (doneCount === items.length ? ' ✅ All done!' : '')
      : '';
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  document.getElementById('mAdd').addEventListener('click', function () {
    var pet = document.getElementById('mPet').value.trim();
    var name = document.getElementById('mName').value.trim();
    var dose = document.getElementById('mDose').value.trim();
    var timesRaw = document.getElementById('mTimes').value.trim();
    var notes = document.getElementById('mNotes').value.trim();
    if (!pet || !name || !dose || !timesRaw) { alert('Please fill in pet, medication, dose, and at least one dose time.'); return; }
    var times = timesRaw.split(',').map(function (t) { return t.trim(); }).filter(validTime);
    if (!times.length) { alert('Dose times must look like 08:00, 20:00 (24-hour format).'); return; }
    state.meds.push({ id: uid(), pet: pet, name: name, dose: dose, times: times, notes: notes });
    save(state);
    document.getElementById('mPet').value = ''; document.getElementById('mName').value = '';
    document.getElementById('mDose').value = ''; document.getElementById('mTimes').value = '';
    document.getElementById('mNotes').value = '';
    render();
  });

  render();
})();
