/* GuestListPro seating planner — reads accepted guests from guest-manager localStorage */
var GUESTS_KEY = 'guestlistpro_guests_v1';

function loadGuests() {
  try {
    var raw = localStorage.getItem(GUESTS_KEY);
    var g = raw ? JSON.parse(raw) : [];
    return Array.isArray(g) ? g : [];
  } catch (e) { return []; }
}
function expandHeadcount(guest) {
  var out = [guest.name];
  var plus = parseInt(guest.plus, 10) || 0;
  for (var i = 1; i <= plus; i++) out.push(guest.name + ' (+' + i + ')');
  return out;
}
function generatePlan() {
  var numTables = Math.max(1, Math.min(40, parseInt(document.getElementById('numTables').value, 10) || 10));
  var seatsPer = Math.max(2, Math.min(20, parseInt(document.getElementById('seatsPer').value, 10) || 8));
  var guests = loadGuests().filter(function (g) { return g.rsvp === 'Accepted'; });
  var wrap = document.getElementById('tablesWrap');

  if (!guests.length) {
    wrap.innerHTML = '<div class="tool-panel"><p style="color:#8a7d6d;">No <strong>accepted</strong> guests found. Add guests and mark them Accepted in the <a href="guest-manager.html">Guest Manager</a> first — or continue with a demo below.</p><button class="btn btn-outline" id="demoBtn" style="margin-top:10px;">Load Demo Guests</button></div>';
    document.getElementById('demoBtn').addEventListener('click', function () {
      var demo = [
        { id: 'd1', name: 'Sarah Miller', side: 'Bride', rsvp: 'Accepted', plus: 1, meal: 'Chicken', note: '' },
        { id: 'd2', name: 'James Miller', side: 'Bride', rsvp: 'Accepted', plus: 0, meal: 'Beef', note: '' },
        { id: 'd3', name: 'Aunt Carol', side: 'Bride', rsvp: 'Accepted', plus: 0, meal: 'Vegetarian', note: '' },
        { id: 'd4', name: 'Tom Becker', side: 'Groom', rsvp: 'Accepted', plus: 1, meal: 'Chicken', note: '' },
        { id: 'd5', name: 'Lisa Becker', side: 'Groom', rsvp: 'Accepted', plus: 0, meal: 'Fish', note: '' },
        { id: 'd6', name: 'Mike & Anna Ross', side: 'Mutual', rsvp: 'Accepted', plus: 0, meal: 'Beef', note: '' }
      ];
      try { localStorage.setItem(GUESTS_KEY, JSON.stringify(demo)); } catch (e) {}
      toast('Demo guests loaded ✓'); generatePlan();
    });
    document.getElementById('capacityMsg').textContent = '';
    return;
  }

  // Group by side: Bride, Groom, Mutual — then fill tables in that order
  var order = { 'Bride': 0, 'Groom': 1, 'Mutual': 2 };
  guests.sort(function (a, b) { return (order[a.side] || 9) - (order[b.side] || 9); });

  var tables = [];
  for (var t = 0; t < numTables; t++) tables.push([]);
  var ti = 0;
  guests.forEach(function (g) {
    expandHeadcount(g).forEach(function (seat) {
      // find next table with space
      var placed = false;
      for (var k = 0; k < numTables; k++) {
        var idx = (ti + k) % numTables;
        if (tables[idx].length < seatsPer) { tables[idx].push(seat); placed = true; break; }
      }
      if (!placed) { tables.push([seat]); }
      ti++;
    });
  });

  var totalSeats = numTables * seatsPer;
  var totalPeople = tables.reduce(function (n, tb) { return n + tb.length; }, 0);
  var msg = 'Seating ' + totalPeople + ' people across ' + tables.length + ' tables (' + totalSeats + ' seats available).';
  if (totalPeople > totalSeats) msg += ' ⚠️ Not enough seats — add more tables!';
  document.getElementById('capacityMsg').textContent = msg;

  wrap.innerHTML = tables.map(function (tb, i) {
    var chips = tb.map(function (seat) {
      return '<span class="chip" draggable="true">' + esc(seat) + '</span>';
    }).join('');
    return '<div class="seat-table" data-table="' + i + '"><h4 class="sans">Table ' + (i + 1) + ' <span style="color:#8a7d6d;font-weight:400;">(' + tb.length + '/' + seatsPer + ' seats)</span></h4><div class="chips">' + (chips || '<span style="color:#8a7d6d;">Empty</span>') + '</div></div>';
  }).join('');

  enableDragDrop();
  toast('Seating plan generated ✓ — drag names between tables to adjust');
}
function enableDragDrop() {
  var dragged = null;
  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('dragstart', function () { dragged = chip; });
    chip.addEventListener('dragend', function () { dragged = null; });
  });
  document.querySelectorAll('.seat-table .chips').forEach(function (zone) {
    zone.addEventListener('dragover', function (e) { e.preventDefault(); });
    zone.addEventListener('drop', function (e) {
      e.preventDefault();
      if (dragged) { zone.appendChild(dragged); updateCounts(); toast('Moved ✓'); }
    });
  });
}
function updateCounts() {
  document.querySelectorAll('.seat-table').forEach(function (tbl, i) {
    var n = tbl.querySelectorAll('.chip').length;
    var h = tbl.querySelector('h4');
    var seatsPer = Math.max(2, parseInt(document.getElementById('seatsPer').value, 10) || 8);
    h.innerHTML = 'Table ' + (i + 1) + ' <span style="color:#8a7d6d;font-weight:400;">(' + n + '/' + seatsPer + ' seats)</span>';
  });
}
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('planBtn').addEventListener('click', generatePlan);
});
