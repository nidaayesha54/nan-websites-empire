// Medical biller salary calculator
document.addEventListener('DOMContentLoaded', () => {
  const stateSel = document.getElementById('state');
  Object.keys(STATE_FACTORS).sort().forEach(s => {
    const o = document.createElement('option');
    o.value = s; o.textContent = s;
    stateSel.appendChild(o);
  });
  document.getElementById('calc-btn').addEventListener('click', calculate);
  calculate();
});

function calculate() {
  const state = document.getElementById('state').value || 'Texas';
  const exp = getChecked('exp') || 'mid';
  const cert = getChecked('cert') || 'none';
  const setting = getChecked('setting') || 'physician';

  const salary = BILLER_BASE_MEDIAN
    * STATE_FACTORS[state]
    * EXP_FACTORS[exp].factor
    * CERT_FACTORS[cert].factor
    * SETTING_FACTORS[setting].factor;

  const monthly = salary / 12;
  const hourly = salary / 2080;
  const national = BILLER_BASE_MEDIAN * EXP_FACTORS[exp].factor * CERT_FACTORS[cert].factor;
  const diffPct = ((salary - national) / national * 100);

  const certLift = (CERT_FACTORS[cert].factor - 1) * 100;

  document.getElementById('result').innerHTML = `
    <h3>💰 Estimated Medical Biller Salary — ${esc(state)}</h3>
    <div class="stat-row"><span>Annual salary</span><span class="val">${fmtUSD(salary)}</span></div>
    <div class="bar"><div style="width:${Math.min(100, salary/1100)}%"></div></div>
    <div class="stat-row"><span>Monthly</span><span class="val">${fmtUSD(monthly)}</span></div>
    <div class="stat-row"><span>Hourly (full-time)</span><span class="val">$${hourly.toFixed(2)}</span></div>
    <div class="stat-row"><span>vs national avg (${EXP_FACTORS[exp].label})</span>
      <span class="val">${diffPct >= 0 ? '+' : ''}${diffPct.toFixed(1)}%</span></div>
    <div class="stat-row"><span>Profile</span><span>${esc(EXP_FACTORS[exp].label)} · ${esc(CERT_FACTORS[cert].label)}</span></div>
    <div class="stat-row"><span>Work setting</span><span>${esc(SETTING_FACTORS[setting].label)}</span></div>
    ${cert === 'none' ? `<p style="margin-top:12px">📈 <strong>Tip:</strong> Adding a certification typically lifts pay 6–18%. Try the <a href="certification-quiz.html">certification quiz</a> to find your fit.</p>` :
      `<p style="margin-top:12px">✅ Your certification adds an estimated <strong>${certLift.toFixed(0)}%</strong> premium. ${esc(CERT_FACTORS[cert].note)}</p>`}
    <div class="note">Estimates based on U.S. Bureau of Labor Statistics (BLS) Occupational Employment data for Medical Records Specialists (May 2024 median $50,250), projected to 2026 with regional, experience, and certification adjustments. Actual pay varies by employer, metro area, and specialty.</div>
  `;
}
