/* PetHealthHub — weight tracker (wellness info only, not medical advice) */
'use strict';
(function () {
  var KEY = 'phh_weight_v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { pets: [], entries: {} }; }
    catch (e) { return { pets: [], entries: {} }; }
  }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
  function uid() { return 'w' + Date.now().toString(36) + Math.floor(Math.random() * 9999); }
  function fmt(d) { return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }

  var state = load();
  var petSelect = document.getElementById('wPetSelect');
  var tbody = document.querySelector('#wTable tbody');
  var insight = document.getElementById('wInsight');
  var chart = document.getElementById('wChart');
  var today = new Date();
  document.getElementById('wDate').value = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

  function currentPet() { return state.pets.find(function (p) { return p.id === petSelect.value; }); }

  function refreshSelect() {
    petSelect.innerHTML = '';
    state.pets.forEach(function (p) {
      var o = document.createElement('option'); o.value = p.id;
      o.textContent = p.name + ' (' + p.unit + ')'; petSelect.appendChild(o);
    });
    if (!state.pets.length) {
      var o = document.createElement('option'); o.textContent = '— add a pet above —'; petSelect.appendChild(o);
    }
  }

  function render() {
    var pet = currentPet();
    tbody.innerHTML = ''; insight.innerHTML = '';
    var ctx = chart.getContext('2d');
    ctx.clearRect(0, 0, chart.width, chart.height);
    if (!pet) {
      tbody.innerHTML = '<tr><td colspan="4" style="color:#6b7280">Add a pet and log a weigh-in to see the trend.</td></tr>';
      return;
    }
    var entries = (state.entries[pet.id] || []).slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });

    entries.forEach(function (e, i) {
      var prev = entries[i - 1];
      var chg = prev ? (e.weight - prev.weight) : 0;
      var chgTxt = prev ? (chg >= 0 ? '+' : '') + chg.toFixed(1) + ' ' + pet.unit : '—';
      var chgColor = !prev ? '#6b7280' : (Math.abs(chg) < 0.05 ? '#6b7280' : (chg > 0 ? '#b45309' : '#15803d'));
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + fmt(e.date) + '</td><td><strong>' + e.weight + ' ' + pet.unit + '</strong></td>' +
        '<td style="color:' + chgColor + ';font-weight:700">' + chgTxt + '</td>';
      var td = document.createElement('td');
      var btn = document.createElement('button');
      btn.textContent = '✕'; btn.className = 'btn btn-green'; btn.style.cssText = 'padding:4px 10px;background:#dc2626';
      btn.setAttribute('aria-label', 'Delete entry');
      btn.addEventListener('click', function () {
        state.entries[pet.id] = state.entries[pet.id].filter(function (x) { return x !== e; });
        save(state); render();
      });
      td.appendChild(btn); tr.appendChild(td);
      tbody.appendChild(tr);
    });

    // Insight
    if (entries.length >= 2) {
      var first = entries[0], last = entries[entries.length - 1];
      var total = last.weight - first.weight;
      var days = Math.max(1, Math.round((new Date(last.date) - new Date(first.date)) / 86400000));
      var inRange = pet.min && pet.max && last.weight >= pet.min && last.weight <= pet.max;
      var html = '<div class="reminder-box" style="background:#f0fdf4;border-color:#22c55e"><h3 style="color:#166534">📊 ' + pet.name + '\u2019s trend</h3><p>';
      html += 'Total change: <strong>' + (total >= 0 ? '+' : '') + total.toFixed(1) + ' ' + pet.unit + '</strong> over ' + days + ' days (' + entries.length + ' weigh-ins). ';
      if (pet.min && pet.max) {
        html += inRange
          ? 'Current weight is <strong>within</strong> your set healthy range (' + pet.min + '–' + pet.max + ' ' + pet.unit + ').'
          : 'Current weight is <strong>outside</strong> your set healthy range (' + pet.min + '–' + pet.max + ' ' + pet.unit + ') — consider mentioning it at the next vet visit.';
      } else { html += 'Set a healthy range above to get range feedback.'; }
      if (Math.abs(total) > 0 && days <= 30 && Math.abs(total) / first.weight > 0.1) {
        html += ' <strong>Note:</strong> a change over 10% in a month can be significant — check with your vet.';
      }
      html += '</p></div>';
      insight.innerHTML = html;
    }

    drawChart(ctx, entries, pet);
  }

  function drawChart(ctx, entries, pet) {
    var W = chart.width, H = chart.height, pad = 48;
    ctx.font = '12px sans-serif'; ctx.fillStyle = '#6b7280';
    if (entries.length < 2) {
      ctx.fillText('Log at least 2 weigh-ins to see the trend chart.', pad, H / 2);
      return;
    }
    var vals = entries.map(function (e) { return e.weight; });
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    if (pet.min && pet.max) { min = Math.min(min, pet.min); max = Math.max(max, pet.max); }
    var span = (max - min) || 1; min -= span * 0.15; max += span * 0.15;
    function X(i) { return pad + (W - pad * 2) * (entries.length === 1 ? 0.5 : i / (entries.length - 1)); }
    function Y(v) { return H - pad - ((v - min) / (max - min)) * (H - pad * 2); }

    // healthy-range band
    if (pet.min && pet.max) {
      ctx.fillStyle = 'rgba(34,197,94,0.18)';
      ctx.fillRect(pad, Y(pet.max), W - pad * 2, Y(pet.min) - Y(pet.max));
      ctx.fillStyle = '#15803d';
      ctx.fillText('healthy range ' + pet.min + '–' + pet.max + ' ' + pet.unit, pad + 6, Y(pet.max) - 6);
    }
    // axes labels
    ctx.fillStyle = '#6b7280';
    ctx.fillText(max.toFixed(1), 8, Y(max) + 4);
    ctx.fillText(min.toFixed(1), 8, Y(min) + 4);
    // line
    ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 3; ctx.beginPath();
    entries.forEach(function (e, i) { i ? ctx.lineTo(X(i), Y(e.weight)) : ctx.moveTo(X(i), Y(e.weight)); });
    ctx.stroke();
    // points + dates
    entries.forEach(function (e, i) {
      ctx.fillStyle = '#166534';
      ctx.beginPath(); ctx.arc(X(i), Y(e.weight), 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#6b7280';
      var lbl = e.date.slice(5);
      ctx.fillText(lbl, X(i) - 14, H - 14);
    });
  }

  document.getElementById('wAddPet').addEventListener('click', function () {
    var name = document.getElementById('wPetName').value.trim();
    if (!name) { alert('Please enter your pet\u2019s name.'); return; }
    var sel = currentPet();
    var data = {
      name: name,
      species: document.getElementById('wSpecies').value,
      unit: document.getElementById('wUnit').value,
      min: parseFloat(document.getElementById('wMin').value) || null,
      max: parseFloat(document.getElementById('wMax').value) || null
    };
    if (sel) { Object.assign(sel, data); }
    else { data.id = uid(); state.pets.push(data); state.entries[data.id] = []; }
    save(state); refreshSelect();
    petSelect.value = (sel || state.pets[state.pets.length - 1]).id;
    document.getElementById('wMin').value = data.min || '';
    document.getElementById('wMax').value = data.max || '';
    render();
  });

  document.getElementById('wAddEntry').addEventListener('click', function () {
    var pet = currentPet();
    if (!pet) { alert('Add a pet first.'); return; }
    var w = parseFloat(document.getElementById('wWeight').value);
    var d = document.getElementById('wDate').value;
    if (!w || w <= 0 || !d) { alert('Enter a valid date and weight.'); return; }
    state.entries[pet.id] = state.entries[pet.id] || [];
    state.entries[pet.id].push({ date: d, weight: w });
    document.getElementById('wWeight').value = '';
    save(state); render();
  });

  petSelect.addEventListener('change', function () {
    var pet = currentPet();
    if (pet) {
      document.getElementById('wPetName').value = pet.name;
      document.getElementById('wSpecies').value = pet.species;
      document.getElementById('wUnit').value = pet.unit;
      document.getElementById('wMin').value = pet.min || '';
      document.getElementById('wMax').value = pet.max || '';
    }
    render();
  });

  refreshSelect(); render();
})();
