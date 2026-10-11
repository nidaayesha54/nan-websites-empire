document.addEventListener('DOMContentLoaded', function () {
  var specSel = document.getElementById('specialty');
  var stateSel = document.getElementById('state');

  SPECIALTIES.forEach(function (s) {
    var o = document.createElement('option');
    o.value = s.id; o.textContent = s.name;
    specSel.appendChild(o);
  });
  Object.keys(STATE_FACTORS).sort().forEach(function (st) {
    var o = document.createElement('option');
    o.value = st; o.textContent = st;
    stateSel.appendChild(o);
  });

  document.getElementById('calc').addEventListener('submit', function (e) {
    e.preventDefault();
    var spec = specialtyById(specSel.value);
    var factor = STATE_FACTORS[stateSel.value] || 1;
    var years = parseFloat(document.getElementById('years').value) || 0;
    var setting = document.getElementById('setting').value;

    var settingFactor = setting === 'private' ? 1.12 : (setting === 'academic' ? 0.88 : 1.0);
    var adjusted = spec.salary * factor * settingFactor;
    var hourly = adjusted / (50 * 55); // ~50 wks x 55 hrs
    var monthly = adjusted / 12;
    var withExp = adjusted * (1 + Math.min(years, 15) * 0.015);

    var res = document.getElementById('result');
    res.classList.add('show');
    res.innerHTML =
      '<h3>' + esc(spec.name) + ' — ' + esc(stateSel.value) + '</h3>' +
      '<div class="big-num">' + fmt(adjusted) + '<span style="font-size:1rem;color:#5b7186"> /year</span></div>' +
      '<div class="stat-row"><span>Monthly (pre-tax)</span><strong>' + fmt(monthly) + '</strong></div>' +
      '<div class="stat-row"><span>Approx. hourly</span><strong>' + fmt(hourly) + '</strong></div>' +
      '<div class="stat-row"><span>With ' + years + ' yrs experience (est.)</span><strong>' + fmt(withExp) + '</strong></div>' +
      '<div class="stat-row"><span>National specialty average</span><strong>' + fmt(spec.salary) + '</strong></div>' +
      '<p class="note">Estimates based on Medscape Physician Compensation Report &amp; BLS data patterns, adjusted to 2026. State factors are regional approximations. Actual pay varies by employer, hours, and contract.</p>';
    res.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
