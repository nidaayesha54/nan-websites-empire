// Claim Denial Tracker — log denials in localStorage, analyze top reasons & appeal priority
var STORE_KEY = 'rcm_denials_v1';

function loadDenials() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch (e) { return []; }
}
function saveDenials(list) {
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
}

function addDenial() {
  var claim = document.getElementById('d-claim').value.trim();
  var payer = document.getElementById('d-payer').value.trim();
  var reason = document.getElementById('d-reason').value;
  var amount = parseFloat(document.getElementById('d-amount').value);
  var date = document.getElementById('d-date').value;

  if (!claim || !reason || isNaN(amount) || amount <= 0) {
    alert('Please enter claim ID, denial reason, and a valid amount.');
    return;
  }
  var list = loadDenials();
  list.push({
    id: Date.now(),
    claim: claim,
    payer: payer || '—',
    reason: reason,
    amount: amount,
    date: date || new Date().toISOString().slice(0, 10),
    status: 'Open'
  });
  saveDenials(list);
  document.getElementById('d-claim').value = '';
  document.getElementById('d-payer').value = '';
  document.getElementById('d-amount').value = '';
  renderDenials();
}

function setStatus(id, status) {
  var list = loadDenials();
  list.forEach(function (d) { if (d.id === id) d.status = status; });
  saveDenials(list);
  renderDenials();
}

function removeDenial(id) {
  var list = loadDenials().filter(function (d) { return d.id !== id; });
  saveDenials(list);
  renderDenials();
}

function clearAll() {
  if (!confirm('Delete all logged denials?')) return;
  localStorage.removeItem(STORE_KEY);
  renderDenials();
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderDenials() {
  var list = loadDenials();
  var tbody = document.getElementById('d-rows');
  tbody.innerHTML = '';
  list.forEach(function (d) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + esc(d.claim) + '</td>' +
      '<td>' + esc(d.payer) + '</td>' +
      '<td>' + esc(d.reason) + '</td>' +
      '<td>' + fmtUSD(d.amount) + '</td>' +
      '<td>' + esc(d.date) + '</td>' +
      '<td><span class="badge ' + (d.status === 'Open' ? 'badge-red' : d.status === 'Appealed' ? 'badge-amber' : 'badge-green') + '">' + d.status + '</span></td>' +
      '<td><select onchange="setStatus(' + d.id + ', this.value)">' +
      '<option value="Open"' + (d.status === 'Open' ? ' selected' : '') + '>Open</option>' +
      '<option value="Appealed"' + (d.status === 'Appealed' ? ' selected' : '') + '>Appealed</option>' +
      '<option value="Resolved"' + (d.status === 'Resolved' ? ' selected' : '') + '>Resolved</option>' +
      '</select> <button onclick="removeDenial(' + d.id + ')" style="background:#7f1d1d;color:#fff;border:none;border-radius:6px;padding:4px 10px;cursor:pointer">✕</button></td>';
    tbody.appendChild(tr);
  });

  // Analysis
  var open = list.filter(function (d) { return d.status === 'Open'; });
  var totalOpen = open.reduce(function (s, d) { return s + d.amount; }, 0);
  var byReason = {};
  open.forEach(function (d) {
    if (!byReason[d.reason]) byReason[d.reason] = { count: 0, amount: 0 };
    byReason[d.reason].count++;
    byReason[d.reason].amount += d.amount;
  });
  var topReasons = Object.keys(byReason).sort(function (a, b) { return byReason[b].count - byReason[a].count; }).slice(0, 5);

  var html = '<div class="stat-row">' +
    '<div class="stat"><div class="num">' + list.length + '</div><div class="lbl">Total denials logged</div></div>' +
    '<div class="stat"><div class="num">' + open.length + '</div><div class="lbl">Open denials</div></div>' +
    '<div class="stat"><div class="num">' + fmtUSD(totalOpen) + '</div><div class="lbl">Open dollar value</div></div>' +
    '</div>';

  if (topReasons.length) {
    html += '<h3>Top Denial Reasons (open)</h3><table class="data"><tr><th>Reason</th><th>Count</th><th>$ at risk</th></tr>';
    topReasons.forEach(function (r) {
      html += '<tr><td>' + esc(r) + '</td><td>' + byReason[r].count + '</td><td>' + fmtUSD(byReason[r].amount) + '</td></tr>';
    });
    html += '</table>';

    // Appeal priority: open denials sorted by amount desc
    var priority = open.slice().sort(function (a, b) { return b.amount - a.amount; }).slice(0, 5);
    html += '<h3>Appeal Priority (highest $ first)</h3><table class="data"><tr><th>Claim</th><th>Payer</th><th>Amount</th><th>Date</th></tr>';
    priority.forEach(function (d) {
      html += '<tr><td>' + esc(d.claim) + '</td><td>' + esc(d.payer) + '</td><td>' + fmtUSD(d.amount) + '</td><td>' + esc(d.date) + '</td></tr>';
    });
    html += '</table>';
  } else {
    html += '<p style="color:var(--muted)">No open denials. Log denials above to see analysis.</p>';
  }

  var box = document.getElementById('d-analysis');
  box.innerHTML = html;
  box.classList.add('show');
}

document.addEventListener('DOMContentLoaded', renderDenials);
