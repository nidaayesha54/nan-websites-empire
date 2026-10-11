// حاسبتي — Hasibati calculators (vanilla JS, RTL-safe)
'use strict';

var SYMBOLS = { SAR: 'ر.س', AED: 'د.إ', EGP: 'ج.م', USD: '$' };

function num(id, fallback) {
  var el = document.getElementById(id);
  if (!el) return fallback;
  var v = parseFloat(el.value);
  return (isNaN(v) || v < 0) ? fallback : v;
}
function fmt(n) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}
function show(id) {
  var el = document.getElementById(id);
  if (el) el.classList.add('show');
}

// حاسبة السعر بالساعة
function calcRate() {
  var income = num('income', 0);
  var hours = num('hours', 1);
  var expenses = num('expenses', 0);
  var feesPct = num('fees', 0);
  var curEl = document.getElementById('currency');
  var cur = curEl ? curEl.value : 'SAR';
  var sym = SYMBOLS[cur] || cur;

  if (hours <= 0) hours = 1;
  var minRate = ((income + expenses) / hours) * (1 + feesPct / 100);
  var recRate = minRate * 1.25;
  var monthly = recRate * hours;

  document.getElementById('minRate').textContent = fmt(minRate) + ' ' + sym;
  document.getElementById('recRate').textContent = fmt(recRate) + ' ' + sym;
  document.getElementById('monthly').textContent = fmt(monthly) + ' ' + sym;
  show('result');
}

// مقدّر أسعار المشاريع
function calcProject() {
  var typeMult = num('ptype', 1);
  var hours = num('phours', 1);
  var complex = num('complex', 1);
  var rate = num('prate', 1);
  var curEl = document.getElementById('pcurrency');
  var cur = curEl ? curEl.value : 'SAR';
  var sym = SYMBOLS[cur] || cur;

  if (hours <= 0) hours = 1;
  if (rate <= 0) rate = 1;
  var base = hours * rate * typeMult * complex;
  var low = base;
  var high = base * 1.3;

  document.getElementById('priceRange').textContent = fmt(low) + ' – ' + fmt(high) + ' ' + sym;
  document.getElementById('basePrice').textContent = fmt(base) + ' ' + sym;
  document.getElementById('totalHours').textContent = fmt(hours) + ' ساعة';
  show('result');
}

// Auto-calc on load with defaults
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('income')) calcRate();
  if (document.getElementById('ptype')) calcProject();
});
