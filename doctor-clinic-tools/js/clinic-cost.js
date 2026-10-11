// Clinic visit cost estimator — 2026 US self-pay estimate ranges.
const VISIT_TYPES = {
  'new-patient':   { name: 'New patient visit', base: [150, 300] },
  'followup':      { name: 'Follow-up visit', base: [100, 200] },
  'physical':      { name: 'Annual physical', base: [200, 400] },
  'sick-visit':    { name: 'Sick visit (same-day)', base: [100, 250] },
  'telehealth':    { name: 'Telehealth visit', base: [50, 150] },
  'specialist':    { name: 'Specialist visit (new)', base: [250, 500] }
};
const ADDONS = {
  'labs-basic':  { name: 'Basic blood work (CBC, metabolic panel)', cost: [50, 150] },
  'labs-full':   { name: 'Comprehensive labs (lipids, A1C, thyroid)', cost: [150, 400] },
  'xray':        { name: 'X-ray (1 area)', cost: [100, 300] },
  'ekg':         { name: 'EKG', cost: [50, 150] },
  'vaccine-flu': { name: 'Flu vaccine', cost: [20, 50] },
  'vaccine-tdap':{ name: 'Tdap vaccine', cost: [40, 80] },
  'sti-test':    { name: 'STI panel', cost: [100, 250] },
  'ultrasound':  { name: 'Ultrasound', cost: [200, 500] }
};
// Cost-of-care tier by state (approximate)
const STATE_TIER = {
  'California': 'high', 'New York': 'high', 'Massachusetts': 'high', 'New Jersey': 'high',
  'Connecticut': 'high', 'Alaska': 'high', 'Hawaii': 'high', 'District of Columbia': 'high',
  'Mississippi': 'low', 'Arkansas': 'low', 'Oklahoma': 'low', 'Alabama': 'low',
  'West Virginia': 'low', 'New Mexico': 'low', 'Kentucky': 'low', 'Louisiana': 'low'
};
const TIER_FACTOR = { low: 0.85, medium: 1.0, high: 1.2 };

document.addEventListener('DOMContentLoaded', function () {
  var visitSel = document.getElementById('visit');
  Object.keys(VISIT_TYPES).forEach(function (k) {
    var o = document.createElement('option');
    o.value = k; o.textContent = VISIT_TYPES[k].name;
    visitSel.appendChild(o);
  });
  var stateSel = document.getElementById('state');
  var states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
  states.forEach(function (s) {
    var o = document.createElement('option');
    o.value = s; o.textContent = s;
    stateSel.appendChild(o);
  });

  var addonBox = document.getElementById('addons');
  Object.keys(ADDONS).forEach(function (k) {
    var a = ADDONS[k];
    var label = document.createElement('label');
    label.style.cssText = 'display:block;padding:8px 0;font-weight:400';
    label.innerHTML = '<input type="checkbox" value="' + k + '" style="width:auto;margin-right:8px">' +
      esc(a.name) + ' <span style="color:#5b7186">(' + fmt(a.cost[0]) + '–' + fmt(a.cost[1]) + ')</span>';
    addonBox.appendChild(label);
  });

  document.getElementById('calc').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = VISIT_TYPES[visitSel.value];
    var tier = STATE_TIER[stateSel.value] || 'medium';
    var f = TIER_FACTOR[tier];

    var lo = v.base[0] * f, hi = v.base[1] * f;
    var rows = '<div class="stat-row"><span><strong>' + esc(v.name) + '</strong></span><span>' + fmt(lo) + ' – ' + fmt(hi) + '</span></div>';
    addonBox.querySelectorAll('input:checked').forEach(function (cb) {
      var a = ADDONS[cb.value];
      var alo = a.cost[0] * f, ahi = a.cost[1] * f;
      lo += alo; hi += ahi;
      rows += '<div class="stat-row"><span>' + esc(a.name) + '</span><span>' + fmt(alo) + ' – ' + fmt(ahi) + '</span></div>';
    });

    var res = document.getElementById('result');
    res.classList.add('show');
    res.innerHTML =
      '<h3>Estimated self-pay cost — ' + esc(stateSel.value) + '</h3>' +
      '<div class="big-num">' + fmt(lo) + ' – ' + fmt(hi) + '</div>' +
      rows +
      '<div class="info-box"><strong>💡 Pay less:</strong> ask for the self-pay/cash discount (often 20–40% off), request an itemized estimate before the visit, and check community health centers (HRSA) which charge on a sliding scale.</div>' +
      '<p class="note">2026 estimates for uninsured patients; actual prices vary by clinic. Always confirm pricing with the clinic beforehand. Not medical advice.</p>';
    res.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
