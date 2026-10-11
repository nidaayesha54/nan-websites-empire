// Cost Estimator logic — 2026 US small-business premium ranges
// Industry risk multipliers and revenue scaling
var RISK = {
  professional:  { mult: 1.0,  wc: 1.10, label: 'Professional services' },
  retail:        { mult: 1.1,  wc: 1.90, label: 'Retail / e-commerce' },
  restaurant:    { mult: 1.35, wc: 2.20, label: 'Restaurant / food service' },
  construction:  { mult: 1.6,  wc: 5.40, label: 'Construction / trades' },
  healthcare:    { mult: 1.25, wc: 1.60, label: 'Healthcare / wellness' },
  manufacturing: { mult: 1.3,  wc: 3.10, label: 'Manufacturing / wholesale' },
  realestate:    { mult: 1.05, wc: 1.40, label: 'Real estate' },
  homebased:     { mult: 0.7,  wc: 0.90, label: 'Home-based / freelance' }
};

function scale(base, revenue) {
  // Premiums grow sub-linearly with revenue: factor = 0.6 + 0.4 * log10-based scale
  var f = 0.55 + 0.45 * Math.log10(Math.max(revenue, 10000) / 10000 + 1);
  return base * f;
}

function range(lo, hi, mult) {
  return { lo: Math.round(lo * mult), hi: Math.round(hi * mult) };
}

function estimateCost() {
  var industry = document.getElementById('industry').value;
  var revenue = parseFloat(document.getElementById('revenue').value) || 0;
  var employees = parseInt(document.getElementById('employees').value, 10) || 0;
  var r = RISK[industry];
  var revFactor = 0.55 + 0.45 * Math.log10(Math.max(revenue, 10000) / 10000 + 1);

  var rows = [];
  var totalLo = 0, totalHi = 0;

  function push(name, base, note) {
    var rg = range(base[0] * revFactor, base[1] * revFactor, r.mult);
    rows.push({ name: name, lo: rg.lo, hi: rg.hi, note: note });
    totalLo += rg.lo; totalHi += rg.hi;
  }

  var useBop = document.getElementById('k-bop').checked;
  var useGL = document.getElementById('k-gl').checked;

  if (useBop) {
    push("Business Owner's Policy (BOP)", [500, 2500], 'Bundles GL + property — usually cheaper than buying separately.');
  } else if (useGL) {
    push('General Liability', [400, 1500], 'Covers injury, property damage, advertising injury claims.');
  }
  if (document.getElementById('k-pl').checked) {
    var plBase = industry === 'healthcare' ? [5000, 30000] : [500, 2000];
    push('Professional Liability (E&O)', plBase, 'Covers claims your professional work caused financial loss.');
  }
  if (document.getElementById('k-wc').checked && employees > 0) {
    // WC: rate per $100 of payroll; assume avg $55k salary/employee
    var payroll = employees * 55000;
    var rate = r.wc; // per $100 payroll
    var wcEst = payroll / 100 * rate;
    rows.push({ name: "Workers' Compensation (" + employees + " employees)", lo: Math.round(wcEst * 0.8), hi: Math.round(wcEst * 1.2), note: 'Legally required in most states. Rate varies by job classification.' });
    totalLo += Math.round(wcEst * 0.8); totalHi += Math.round(wcEst * 1.2);
  }
  if (document.getElementById('k-prop').checked && !useBop) {
    push('Commercial Property', [500, 3000], 'Covers building, equipment, inventory.');
  }
  if (document.getElementById('k-auto').checked) {
    push('Commercial Auto (1 vehicle)', [600, 2400], 'Required for business-owned or business-used vehicles.');
  }
  if (document.getElementById('k-cyber').checked) {
    push('Cyber Liability', [1000, 7500], 'Covers breaches, ransomware, notification costs.');
  }

  var html = '<h3>💰 Estimated Annual Premiums — ' + esc(r.label) + '</h3>';
  if (rows.length === 0) {
    html += '<p>Select at least one coverage above to see an estimate.</p>';
  } else {
    html += '<table class="calc"><tr><th>Coverage</th><th>Low est.</th><th>High est.</th></tr>';
    rows.forEach(function (row) {
      html += '<tr><td><strong>' + esc(row.name) + '</strong><br><span style="font-size:.82rem;color:var(--muted)">' +
        esc(row.note) + '</span></td><td>' + money(row.lo) + '</td><td>' + money(row.hi) + '</td></tr>';
    });
    html += '</table>';
    html += '<p style="margin-top:16px"><span class="big-num">' + money(totalLo) + ' – ' + money(totalHi) + '</span><br>' +
      '<span style="color:var(--muted)">estimated total per year · ≈ ' + money(totalLo / 12) + ' – ' + money(totalHi / 12) + ' / month</span></p>';
    html += '<div class="callout"><strong>Ways to lower it:</strong> raise deductibles, bundle into a BOP, pay annually, improve safety documentation, and shop 3+ agents — quotes for identical coverage routinely differ 20–40%.</div>';
  }

  var res = document.getElementById('result');
  res.innerHTML = html;
  res.classList.add('show');
  res.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
