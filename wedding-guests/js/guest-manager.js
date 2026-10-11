/* GuestListPro guest manager — localStorage persistence, filters, CSV export */
var GUESTS_KEY = 'guestlistpro_guests_v1';
var guests = [];
var editingId = null;

function loadGuests() {
  try {
    var raw = localStorage.getItem(GUESTS_KEY);
    guests = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(guests)) guests = [];
  } catch (e) { guests = []; }
}
function saveGuests() {
  try { localStorage.setItem(GUESTS_KEY, JSON.stringify(guests)); } catch (e) {}
}
function uid() {
  return 'g' + Date.now().toString(36) + Math.floor(Math.random() * 9999).toString(36);
}
function badgeClass(status) {
  return status === 'Accepted' ? 'badge-yes' : status === 'Declined' ? 'badge-no' : status === 'Maybe' ? 'badge-maybe' : 'badge-pending';
}
function filteredGuests() {
  var side = document.getElementById('filterSide').value;
  var rsvp = document.getElementById('filterRsvp').value;
  var q = document.getElementById('search').value.trim().toLowerCase();
  return guests.filter(function (g) {
    if (side && g.side !== side) return false;
    if (rsvp && g.rsvp !== rsvp) return false;
    if (q && (g.name || '').toLowerCase().indexOf(q) === -1) return false;
    return true;
  });
}
function renderStats() {
  var accepted = guests.filter(function (g) { return g.rsvp === 'Accepted'; });
  var pending = guests.filter(function (g) { return g.rsvp === 'Pending' || g.rsvp === 'Maybe'; });
  var declined = guests.filter(function (g) { return g.rsvp === 'Declined'; });
  function headcount(list) {
    return list.reduce(function (n, g) { return n + 1 + (parseInt(g.plus, 10) || 0); }, 0);
  }
  var html = '';
  html += statBox(headcount(accepted), 'Accepted (headcount)');
  html += statBox(accepted.length, 'Accepted parties');
  html += statBox(pending.length, 'Awaiting reply');
  html += statBox(declined.length, 'Declined');
  html += statBox(guests.length, 'Total invited');
  document.getElementById('stats').innerHTML = html;
}
function statBox(num, lbl) {
  return '<div class="stat"><div class="num">' + num + '</div><div class="lbl">' + esc(lbl) + '</div></div>';
}
function renderTable() {
  var rows = filteredGuests();
  var tb = document.getElementById('guestRows');
  document.getElementById('emptyMsg').style.display = guests.length ? 'none' : 'block';
  tb.innerHTML = rows.map(function (g) {
    return '<tr>' +
      '<td><strong>' + esc(g.name) + '</strong></td>' +
      '<td>' + esc(g.side) + '</td>' +
      '<td><span class="badge ' + badgeClass(g.rsvp) + '">' + esc(g.rsvp) + '</span></td>' +
      '<td>' + (parseInt(g.plus, 10) || 0) + '</td>' +
      '<td>' + esc(g.meal || '—') + '</td>' +
      '<td>' + esc(g.note || '') + '</td>' +
      '<td class="row-actions"><button onclick="cycleRsvp(\'' + g.id + '\')" title="Cycle RSVP status">🔄</button><button onclick="removeGuest(\'' + g.id + '\')" title="Remove">✕</button></td>' +
      '</tr>';
  }).join('');
}
function render() { renderStats(); renderTable(); }
function addGuest() {
  var name = document.getElementById('gname').value.trim();
  if (!name) { toast('Please enter a guest name.'); return; }
  guests.push({
    id: uid(),
    name: name,
    side: document.getElementById('gside').value,
    rsvp: document.getElementById('grsvp').value,
    plus: Math.max(0, parseInt(document.getElementById('gplus').value, 10) || 0),
    meal: document.getElementById('gmeal').value,
    note: document.getElementById('gnote').value.trim()
  });
  saveGuests(); render();
  document.getElementById('gname').value = '';
  document.getElementById('gnote').value = '';
  document.getElementById('gplus').value = '0';
  document.getElementById('gname').focus();
  toast('Guest added ✓');
}
function cycleRsvp(id) {
  var order = ['Pending', 'Accepted', 'Maybe', 'Declined'];
  for (var i = 0; i < guests.length; i++) {
    if (guests[i].id === id) {
      var idx = order.indexOf(guests[i].rsvp);
      guests[i].rsvp = order[(idx + 1) % order.length];
      break;
    }
  }
  saveGuests(); render();
}
function removeGuest(id) {
  if (!confirm('Remove this guest?')) return;
  guests = guests.filter(function (g) { return g.id !== id; });
  saveGuests(); render(); toast('Guest removed.');
}
function exportCSV() {
  if (!guests.length) { toast('Nothing to export yet.'); return; }
  downloadCSV('wedding-guest-list.csv', [['Name', 'Side', 'RSVP', 'Plus-ones', 'Meal', 'Note']].concat(
    guests.map(function (g) { return [g.name, g.side, g.rsvp, g.plus, g.meal, g.note]; })
  ));
  toast('CSV downloaded ✓');
}
function clearAll() {
  if (!guests.length) return;
  if (!confirm('Delete ALL guests? This cannot be undone.')) return;
  guests = []; saveGuests(); render(); toast('List cleared.');
}
document.addEventListener('DOMContentLoaded', function () {
  loadGuests(); render();
  document.getElementById('addBtn').addEventListener('click', addGuest);
  document.getElementById('gname').addEventListener('keydown', function (e) { if (e.key === 'Enter') addGuest(); });
  document.getElementById('exportBtn').addEventListener('click', exportCSV);
  document.getElementById('clearBtn').addEventListener('click', clearAll);
  ['filterSide', 'filterRsvp'].forEach(function (id) {
    document.getElementById(id).addEventListener('change', renderTable);
  });
  document.getElementById('search').addEventListener('input', renderTable);
});
