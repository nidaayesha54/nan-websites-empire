// Belongings calculator — room-by-room home inventory
var ROOMS = [
  { name: 'Bedroom', icon: '🛏️', items: [
    ['Bed frame + mattress', 1, 1200],
    ['Dresser / wardrobe', 1, 500],
    ['Nightstand + lamp', 1, 150],
    ['TV', 1, 400],
    ['Clothing & shoes (all)', 1, 2500],
    ['Jewelry & watches', 1, 800],
    ['Bedding & linens', 1, 300]
  ]},
  { name: 'Living Room', icon: '🛋️', items: [
    ['Sofa / sectional', 1, 1200],
    ['Coffee table + side tables', 1, 350],
    ['TV + sound system', 1, 700],
    ['Rugs & curtains', 1, 400],
    ['Books, games, decor', 1, 500],
    ['Gaming console', 1, 450]
  ]},
  { name: 'Kitchen', icon: '🍳', items: [
    ['Small appliances (coffee, blender…)', 1, 400],
    ['Cookware & utensils', 1, 500],
    ['Dishes, glasses, pantry items', 1, 350],
    ['Dining table + chairs', 1, 600],
    ['Knife set & gadgets', 1, 200]
  ]},
  { name: 'Home Office / Desk', icon: '💻', items: [
    ['Laptop / desktop computer', 1, 1200],
    ['Monitor, keyboard, accessories', 1, 350],
    ['Desk + office chair', 1, 450],
    ['Printer / scanner', 1, 200],
    ['Phone & tablet', 1, 900]
  ]},
  { name: 'Bathroom', icon: '🛁', items: [
    ['Towels, linens, toiletries stock', 1, 250],
    ['Hair tools & grooming devices', 1, 200],
    ['Medicine cabinet contents', 1, 150]
  ]},
  { name: 'Closet & Storage', icon: '🧳', items: [
    ['Luggage & bags', 1, 250],
    ['Sports equipment (bike, gear…)', 1, 600],
    ['Seasonal items & tools', 1, 400],
    ['Musical instruments', 1, 500]
  ]},
  { name: 'Other / Custom', icon: '➕', items: [] }
];

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function renderRooms(){
  var wrap = document.getElementById('rooms');
  if (!wrap) return;
  var html = '';
  ROOMS.forEach(function(room, r){
    html += '<div class="room-block' + (r < 2 ? ' open' : '') + '">';
    html += '<div class="room-head">' + room.icon + ' ' + esc(room.name) + ' <span class="rtotal" id="rtotal-' + r + '">$0</span></div>';
    html += '<div class="room-body">';
    room.items.forEach(function(it, i){
      html += '<div class="item-row"><div class="iname">' + esc(it[0]) + '</div>' +
        '<div style="display:flex;gap:6px"><input class="qty" type="number" min="0" step="1" value="' + it[1] + '" data-r="' + r + '" data-i="' + i + '" title="Quantity">' +
        '<input class="ival" type="number" min="0" step="10" value="' + it[2] + '" data-r="' + r + '" data-i="' + i + '" title="Value each ($)"></div></div>';
    });
    html += '<div class="item-row"><div class="iname"><em>+ Add your own item</em></div>' +
      '<div style="display:flex;gap:6px"><input class="cname" id="cname-' + r + '" type="text" placeholder="Item name" style="padding:7px;border:1px solid #dcc9a8;border-radius:6px;font-size:.92rem;width:100%">' +
      '<input class="cval" id="cval-' + r + '" type="number" min="0" step="10" placeholder="$" style="padding:7px;border:1px solid #dcc9a8;border-radius:6px;font-size:.92rem;width:90px"></div></div>';
    html += '<button type="button" class="btn" style="padding:8px 16px;margin-top:8px" data-add="' + r + '">+ Add item</button>';
    html += '</div></div>';
  });
  wrap.innerHTML = html;
}

function money(n){ return '$' + Math.round(n).toLocaleString('en-US'); }

function recalc(){
  var total = 0;
  ROOMS.forEach(function(room, r){
    var sub = 0;
    room.items.forEach(function(it, i){
      var q = document.querySelector('.qty[data-r="' + r + '"][data-i="' + i + '"]');
      var v = document.querySelector('.ival[data-r="' + r + '"][data-i="' + i + '"]');
      var qty = q ? parseFloat(q.value) || 0 : it[1];
      var val = v ? parseFloat(v.value) || 0 : it[2];
      sub += qty * val;
    });
    var rt = document.getElementById('rtotal-' + r);
    if (rt) rt.textContent = money(sub);
    total += sub;
  });
  document.getElementById('grand-total').textContent = money(total);
  var rec = Math.ceil(total / 5000) * 5000;
  if (rec < 10000) rec = 10000;
  var res = document.getElementById('result');
  res.classList.add('show');
  document.getElementById('rec-coverage').textContent = money(rec);
  document.getElementById('rec-note').textContent =
    'Based on your inventory, you own about ' + money(total) + ' of personal property. ' +
    'Insurers recommend covering the full replacement cost, rounded up — so ' + money(rec) + ' of personal property coverage is a safe fit.';
}

document.addEventListener('DOMContentLoaded', function(){
  renderRooms();
  document.getElementById('rooms').addEventListener('input', recalc);
  document.getElementById('rooms').addEventListener('click', function(e){
    var b = e.target.closest('[data-add]');
    if (!b) return;
    var r = parseInt(b.getAttribute('data-add'), 10);
    var nameEl = document.getElementById('cname-' + r);
    var valEl = document.getElementById('cval-' + r);
    var nm = nameEl.value.trim(), vv = parseFloat(valEl.value) || 0;
    if (!nm) { nameEl.focus(); return; }
    ROOMS[r].items.push([nm, 1, vv]);
    renderRooms();
    recalc();
  });
  recalc();
});
