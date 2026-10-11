'use strict';
/* Discount finder quiz: each discount has an estimated % saving off a $1,800/yr base premium. */
var DISCOUNTS = [
  { id: 'goodStudent', name: 'Good student discount', desc: 'B average or better (usually under 25)', pct: 10 },
  { id: 'bundle', name: 'Bundle home / renters', desc: 'Same insurer for auto + home or renters', pct: 15 },
  { id: 'telematics', name: 'Telematics / usage-based', desc: 'Safe driving tracked via app or plug-in device', pct: 20 },
  { id: 'lowMileage', name: 'Low-mileage discount', desc: 'Drive under ~7,500 miles per year', pct: 8 },
  { id: 'defensive', name: 'Defensive driving course', desc: 'State-approved course (great for 55+ and new drivers)', pct: 5 },
  { id: 'paidFull', name: 'Paid-in-full discount', desc: 'Pay the full 6-month premium upfront', pct: 7 },
  { id: 'paperless', name: 'Paperless + autopay', desc: 'E-statements with automatic payments', pct: 5 },
  { id: 'multiCar', name: 'Multi-car discount', desc: 'Insure 2 or more vehicles', pct: 12 },
  { id: 'loyalty', name: 'Loyalty discount', desc: '3–5+ years with the same insurer', pct: 5 }
];
var BASE_ANNUAL = 1800;
var CAP_PCT = 40;
document.addEventListener('DOMContentLoaded', function () {
  var box = document.getElementById('dfChecks');
  DISCOUNTS.forEach(function (d) {
    var label = document.createElement('label');
    label.className = 'check';
    label.innerHTML = '<input type="checkbox" id="df_' + d.id + '">'
      + '<span><strong>' + d.name + '</strong><span>' + d.desc + ' — est. ' + d.pct + '% off</span></span>';
    box.appendChild(label);
  });
  var form = document.getElementById('dfForm');
  var result = document.getElementById('dfResult');
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var qualified = DISCOUNTS.filter(function (d) {
      return document.getElementById('df_' + d.id).checked;
    });
    var totalPct = qualified.reduce(function (s, d) { return s + d.pct; }, 0);
    var capped = Math.min(totalPct, CAP_PCT);
    var savings = BASE_ANNUAL * capped / 100;
    var list = qualified.length
      ? '<ul>' + qualified.map(function (d) {
          return '<li><strong>' + d.name + '</strong> — est. ' + d.pct + '% off (' + d.desc + ')</li>';
        }).join('') + '</ul>'
      : '<p>No boxes checked — check every discount that applies to you, then run the quiz again.</p>';
    var capNote = totalPct > CAP_PCT
      ? '<p class="meta">Your discounts total ' + totalPct + '%, but insurers cap stacking — we applied a realistic ' + CAP_PCT + '% cap.</p>' : '';
    result.innerHTML = '<h2>Your discount results</h2>' + list
      + '<p class="big">' + capped + '% <span style="font-size:1rem;font-weight:400">est. total ≈ ' + fmt(savings) + '/yr off a ' + fmt(BASE_ANNUAL) + ' premium</span></p>'
      + capNote
      + '<p class="meta">Estimated savings only — availability and exact percentages vary by insurer and state. Ask your agent to apply every discount you qualify for.</p>';
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
