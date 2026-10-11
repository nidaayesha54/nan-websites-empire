/* PetHealthHub — vaccination tracker (wellness scheduling info only, not medical advice) */
'use strict';
(function () {
  var KEY = 'phh_vax_v1';

  var SCHEDULES = {
    dog: [
      { name: 'DHPP — Distemper, Adenovirus, Parainfluenza, Parvovirus', core: 'Core', doses: [6, 10, 14], notes: 'Booster at 1 year, then every 1–3 years per your vet.' },
      { name: 'Rabies', core: 'Core', doses: [12], notes: 'Required by law in most US states. Booster at 1 year, then every 1–3 years.' },
      { name: 'Bordetella (kennel cough)', core: 'Non-core', doses: [8], notes: 'Annual for dogs that board, groom, or visit dog parks.' },
      { name: 'Canine influenza (H3N2/H3N8)', core: 'Non-core', doses: [10, 13], notes: 'Two-dose series for social dogs; yearly booster.' },
      { name: 'Lyme disease', core: 'Non-core', doses: [12, 15], notes: 'Two-dose series for dogs in tick-prone areas.' }
    ],
    cat: [
      { name: 'FVRCP — Rhinotracheitis, Calicivirus, Panleukopenia', core: 'Core', doses: [6, 10, 14], notes: 'Booster at 1 year, then every 1–3 years per your vet.' },
      { name: 'Rabies', core: 'Core', doses: [12], notes: 'Required by law in many states. Booster at 1 year, then every 1–3 years.' },
      { name: 'FeLV — Feline leukemia virus', core: 'Core (kittens)', doses: [8, 12], notes: 'Recommended for kittens and outdoor cats; annual for at-risk cats.' },
      { name: 'FIV — Feline immunodeficiency virus', core: 'Non-core', doses: [8, 11], notes: 'Discuss with your vet; for cats at high exposure risk.' }
    ]
  };

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { pets: [], done: {} }; }
    catch (e) { return { pets: [], done: {} }; }
  }
  function save(state) { localStorage.setItem(KEY, JSON.stringify(state)); }
  function uid() { return 'p' + Date.now().toString(36) + Math.floor(Math.random() * 9999); }
  function fmt(d) { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function addWeeks(date, w) { var d = new Date(date); d.setDate(d.getDate() + w * 7); return d; }
  function todayISO() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }

  var state = load();
  var petName = document.getElementById('petName');
  var petSpecies = document.getElementById('petSpecies');
  var petBirth = document.getElementById('petBirth');
  var petSelect = document.getElementById('petSelect');
  var reminders = document.getElementById('reminders');
  var tbody = document.querySelector('#scheduleTable tbody');

  function currentPet() { return state.pets.find(function (p) { return p.id === petSelect.value; }); }

  function refreshSelect() {
    petSelect.innerHTML = '';
    if (!state.pets.length) {
      var o = document.createElement('option'); o.textContent = '— add a pet above —'; petSelect.appendChild(o);
      return;
    }
    state.pets.forEach(function (p) {
      var o = document.createElement('option'); o.value = p.id;
      o.textContent = p.name + ' (' + p.species + ')'; petSelect.appendChild(o);
    });
  }

  function statusFor(dueDate, doneDate) {
    var now = new Date(); now.setHours(0, 0, 0, 0);
    if (doneDate) return { cls: 'done', label: 'Done' };
    var diff = Math.ceil((dueDate - now) / 86400000);
    if (diff < 0) return { cls: 'overdue', label: 'Overdue' };
    if (diff <= 14) return { cls: 'soon', label: 'Due soon' };
    return { cls: 'upcoming', label: 'Upcoming' };
  }

  function render() {
    var pet = currentPet();
    tbody.innerHTML = '';
    reminders.innerHTML = '';
    if (!pet) {
      tbody.innerHTML = '<tr><td colspan="6" style="color:#6b7280">Add a pet to build their vaccination schedule.</td></tr>';
      return;
    }
    petName.value = pet.name; petSpecies.value = pet.species; petBirth.value = pet.birthdate || '';
    var sched = SCHEDULES[pet.species] || [];
    var birth = pet.birthdate ? new Date(pet.birthdate + 'T12:00:00') : null;
    var dueList = [], overdueList = [];

    sched.forEach(function (v, vi) {
      v.doses.forEach(function (w, di) {
        var due = birth ? addWeeks(birth, w) : null;
        var key = pet.id + '_' + vi + '_' + di;
        var doneDate = (state.done[pet.id] || {})[key];
        var st = due ? statusFor(due, doneDate) : { cls: 'upcoming', label: 'Upcoming' };
        var tr = document.createElement('tr');
        var cb = document.createElement('input');
        cb.type = 'checkbox'; cb.checked = !!doneDate;
        cb.setAttribute('aria-label', 'Mark ' + v.name + ' dose at ' + w + ' weeks as given');
        cb.addEventListener('change', function () {
          state.done[pet.id] = state.done[pet.id] || {};
          if (cb.checked) state.done[pet.id][key] = todayISO();
          else delete state.done[pet.id][key];
          save(state); render();
        });
        var tdCb = document.createElement('td'); tdCb.appendChild(cb);
        tr.innerHTML =
          '<td><strong>' + v.name + '</strong><br><small style="color:#6b7280">' + v.notes + '</small></td>' +
          '<td>' + v.core + '</td>' +
          '<td>' + w + ' weeks</td>' +
          '<td>' + (due ? fmt(due) : '— set birthdate —') + '</td>' +
          '<td><span class="pill ' + st.cls + '">' + st.label + '</span></td>';
        tr.appendChild(tdCb);
        tbody.appendChild(tr);
        if (!doneDate && due) {
          var item = v.name + ' (dose at ' + w + ' weeks) — due ' + fmt(due);
          if (st.cls === 'overdue') overdueList.push(item);
          else if (st.cls === 'soon') dueList.push(item);
        }
      });
    });

    if (overdueList.length || dueList.length) {
      var box = document.createElement('div');
      box.className = 'reminder-box';
      var html = '<h3>🔔 Reminders for ' + pet.name + '</h3>';
      if (overdueList.length) html += '<p><strong>Overdue:</strong></p><ul>' + overdueList.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>';
      if (dueList.length) html += '<p style="margin-top:8px"><strong>Due within 2 weeks:</strong></p><ul>' + dueList.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>';
      html += '<p style="margin-top:8px;font-size:.9rem">Call your vet to book these — this tracker is a reminder aid, not medical advice.</p>';
      box.innerHTML = html;
      reminders.appendChild(box);
    }
  }

  document.getElementById('addPetBtn').addEventListener('click', function () {
    var name = petName.value.trim();
    if (!name) { alert('Please enter your pet\u2019s name.'); return; }
    var sel = currentPet();
    if (sel) { sel.name = name; sel.species = petSpecies.value; sel.birthdate = petBirth.value; }
    else { var p = { id: uid(), name: name, species: petSpecies.value, birthdate: petBirth.value }; state.pets.push(p); }
    save(state); refreshSelect();
    if (sel) petSelect.value = sel.id; else petSelect.value = state.pets[state.pets.length - 1].id;
    render();
  });

  document.getElementById('removePetBtn').addEventListener('click', function () {
    var pet = currentPet();
    if (!pet || !confirm('Remove ' + pet.name + ' and their records?')) return;
    state.pets = state.pets.filter(function (p) { return p.id !== pet.id; });
    delete state.done[pet.id];
    save(state); refreshSelect(); render();
  });

  petSelect.addEventListener('change', render);
  refreshSelect(); render();
})();
