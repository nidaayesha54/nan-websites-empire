// 50/30/20 budget planner
(function () {
  'use strict';
  var fmt = function (n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  var parse = function (v) { var n = parseFloat(v); return isNaN(n) || n < 0 ? 0 : n; };

  var bucketDefs = [
    { id: 'needs', name: 'Needs', pct: 0.50, items: ['Housing', 'Utilities', 'Groceries', 'Transportation', 'Insurance', 'Debt payments'] },
    { id: 'wants', name: 'Wants', pct: 0.30, items: ['Dining out', 'Shopping', 'Entertainment', 'Streaming services', 'Hobbies'] },
    { id: 'savings', name: 'Savings', pct: 0.20, items: ['Emergency fund', 'Retirement', 'Other goals'] }
  ];

  function makeRow(name, amount) {
    var row = document.createElement('div');
    row.className = 'debt-row';
    row.innerHTML =
      '<input type="text" class="cat-name" value="' + name.replace(/"/g, '&quot;') + '" aria-label="Category name">' +
      '<input type="number" class="cat-amt" min="0" step="1" value="' + amount + '" aria-label="Amount">' +
      '<button type="button" class="rm btn-calc" style="padding:8px 12px;margin:0">✕</button>';
    return row;
  }

  function build() {
    var wrap = document.getElementById('buckets');
    bucketDefs.forEach(function (b) {
      var card = document.createElement('div');
      card.className = 'tool';
      card.id = 'bucket-' + b.id;
      card.innerHTML =
        '<h3>' + b.name + ' — <span class="pct"></span>% of income</h3>' +
        '<p class="kv"><span>Allowance</span><b class="allow"></b></p>' +
        '<div class="rows"></div>' +
        '<div style="margin-top:10px"><input type="text" class="new-name" placeholder="New category" style="max-width:200px"> ' +
        '<button type="button" class="add btn-calc" style="padding:10px 16px;margin:0">+ Add</button></div>' +
        '<p class="kv"><span>Spent</span><b class="spent"></b></p>' +
        '<p class="kv"><span>Remaining</span><b class="remain"></b></p>' +
        '<p class="status"></p>';
      var rows = card.querySelector('.rows');
      b.items.forEach(function (it) { rows.appendChild(makeRow(it, 0)); });
      wrap.appendChild(card);
    });
  }

  function recalc() {
    var income = parse(document.getElementById('income').value);
    var totalSpent = 0;
    bucketDefs.forEach(function (b) {
      var card = document.getElementById('bucket-' + b.id);
      var allowance = income * b.pct;
      var spent = 0;
      card.querySelectorAll('.cat-amt').forEach(function (inp) { spent += parse(inp.value); });
      totalSpent += spent;
      card.querySelector('.pct').textContent = Math.round(b.pct * 100);
      card.querySelector('.allow').textContent = fmt(allowance);
      card.querySelector('.spent').textContent = fmt(spent);
      var remEl = card.querySelector('.remain');
      remEl.textContent = fmt(allowance - spent);
      var status = card.querySelector('.status');
      if (income > 0 && spent > allowance) {
        card.classList.add('over');
        remEl.className = 'remain warn-text';
        status.innerHTML = '<span class="warn-text">⚠ Over budget by ' + fmt(spent - allowance) + ' — trim this category.</span>';
      } else {
        card.classList.remove('over');
        remEl.className = 'remain ok-text';
        status.innerHTML = '<span class="ok-text">✓ Within budget.</span>';
      }
    });
    var s = document.getElementById('splitSummary');
    s.innerHTML = bucketDefs.map(function (b) {
      return '<div class="card"><h3>' + b.name + ' (' + Math.round(b.pct * 100) + '%)</h3><p style="font-size:1.5rem;font-weight:800;color:var(--primary-dark);margin:0">' + fmt(income * b.pct) + '</p></div>';
    }).join('');
    var tot = document.getElementById('totalLine');
    tot.innerHTML = 'Total allocated: <b>' + fmt(totalSpent) + '</b> of <b>' + fmt(income) + '</b>' +
      (income > 0 && totalSpent > income ? ' — <span class="warn-text">⚠ over income by ' + fmt(totalSpent - income) + '</span>' : ' — <span class="ok-text">✓ balanced</span>');
  }

  document.addEventListener('DOMContentLoaded', function () {
    build();
    var wrap = document.getElementById('buckets');
    wrap.addEventListener('input', recalc);
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var card = e.target.closest('.tool');
      if (btn.classList.contains('rm')) {
        btn.closest('.debt-row').remove();
        recalc();
      } else if (btn.classList.contains('add')) {
        var nameInput = card.querySelector('.new-name');
        var nm = nameInput.value.trim() || 'New category';
        card.querySelector('.rows').appendChild(makeRow(nm, 0));
        nameInput.value = '';
        recalc();
      }
    });
    document.getElementById('income').addEventListener('input', recalc);
    recalc();
  });
})();
