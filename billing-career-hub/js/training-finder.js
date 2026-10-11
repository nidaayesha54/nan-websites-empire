// Training program cost vs salary ROI comparator (up to 3 programs)
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('compare-btn').addEventListener('click', compare);
  compare();
});

function readProgram(n) {
  const g = id => document.getElementById(id + n).value;
  return {
    name: g('pname') || ('Program ' + n),
    cost: parseFloat(g('pcost')) || 0,
    months: parseFloat(g('pmonths')) || 6,
    salary: parseFloat(g('psalary')) || 45000,
    cert: document.getElementById('pcert' + n).value
  };
}

function analyze(p) {
  const certBoost = {none:1.0, cpb:1.08, cpc:1.12, cbcs:1.04}[p.cert] || 1.0;
  const adjSalary = p.salary * certBoost;
  const monthlyNet = adjSalary / 12;
  // Assume you could earn $2,500/mo in an unskilled job while training; opportunity cost:
  const oppCost = 2500 * p.months;
  const totalInvestment = p.cost + oppCost;
  const monthlyGain = monthlyNet - 2500;
  const paybackMonths = monthlyGain > 0 ? totalInvestment / monthlyGain : Infinity;
  const fiveYearNet = monthlyGain * 60 - totalInvestment;
  return {adjSalary, totalInvestment, monthlyGain, paybackMonths, fiveYearNet};
}

function compare() {
  const programs = [readProgram(1), readProgram(2), readProgram(3)].filter(p => p.cost > 0 || p.name.trim() !== '');
  const rows = programs.map(p => ({p, a: analyze(p)}));
  rows.sort((x, y) => x.a.fiveYearNet - y.a.fiveYearNet);
  const best = rows[rows.length - 1];

  document.getElementById('result').innerHTML = `
    <h3>📊 Training ROI Comparison</h3>
    <table class="data">
      <tr><th>Program</th><th>Total investment*</th><th>Adj. starting salary</th><th>Payback period</th><th>5-yr net gain</th></tr>
      ${rows.map(({p, a}) => `
        <tr ${p === best.p ? 'style="background:rgba(45,212,191,.08)"' : ''}>
          <td><strong>${esc(p.name)}</strong>${p === best.p ? ' 🏆' : ''}<br><small style="color:var(--muted)">${p.months} months · cert: ${esc(p.cert.toUpperCase())}</small></td>
          <td>${fmtUSD(a.totalInvestment)}</td>
          <td>${fmtUSD(a.adjSalary)}/yr</td>
          <td>${a.paybackMonths === Infinity ? 'Never ⚠️' : a.paybackMonths.toFixed(1) + ' months'}</td>
          <td class="val">${fmtUSD(a.fiveYearNet)}</td>
        </tr>`).join('')}
    </table>
    ${best ? `<p class="verdict">Best value: ${esc(best.p.name)} — pays for itself in ${best.a.paybackMonths === Infinity ? '—' : best.a.paybackMonths.toFixed(1) + ' months'}.</p>` : ''}
    <div class="note">*Total investment = tuition + estimated opportunity cost ($2,500/mo of forgone earnings while training). Starting salaries are illustrative — research real placement stats before enrolling. Avoid programs that won't disclose graduation and job-placement rates.</div>
    <div class="note" style="border-color:var(--teal-dark);background:rgba(45,212,191,.06)">⚠️ Red flags: guaranteed job promises, pressure tactics, no externship, accreditation you can't verify. Legitimate programs publish outcomes data.</div>
  `;
}
