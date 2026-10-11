/* Compound Interest Calculator
   FV = PV(1+r)^n + PMT * (((1+r)^n - 1) / r), monthly compounding */
(function () {
  'use strict';

  function fv(pv, pmt, annualRate, years) {
    var r = annualRate / 12;
    var n = Math.round(years * 12);
    var g = Math.pow(1 + r, n);
    if (r === 0) return pv + pmt * n;
    return pv * g + pmt * ((g - 1) / r);
  }

  function fmt(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function drawChart(canvas, balances, contributions) {
    var ctx = canvas.getContext('2d');
    var W = canvas.width = 560, H = canvas.height = 320;
    ctx.clearRect(0, 0, W, H);
    var max = Math.max.apply(null, balances) * 1.05 || 1;
    var padL = 64, padB = 30, padT = 16, padR = 14;
    var x = function (i) { return padL + (W - padL - padR) * (i / (balances.length - 1 || 1)); };
    var y = function (v) { return H - padB - (H - padB - padT) * (v / max); };
    // gridlines
    ctx.strokeStyle = '#e5e7eb'; ctx.fillStyle = '#6b7280'; ctx.font = '11px sans-serif';
    for (var g2 = 0; g2 <= 4; g2++) {
      var gv = max * g2 / 4;
      ctx.beginPath(); ctx.moveTo(padL, y(gv)); ctx.lineTo(W - padR, y(gv)); ctx.stroke();
      ctx.fillText('$' + Math.round(gv / 1000) + 'k', 6, y(gv) + 4);
    }
    function line(data, color) {
      ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.beginPath();
      for (var i = 0; i < data.length; i++) {
        if (i === 0) ctx.moveTo(x(i), y(data[i])); else ctx.lineTo(x(i), y(data[i]));
      }
      ctx.stroke();
    }
    line(contributions, '#9ca3af');
    line(balances, '#d4af37');
    // legend
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#d4af37'; ctx.beginPath(); ctx.moveTo(padL, H - 8); ctx.lineTo(padL + 24, H - 8); ctx.stroke();
    ctx.fillStyle = '#374151'; ctx.fillText('Balance', padL + 30, H - 4);
    ctx.strokeStyle = '#9ca3af'; ctx.beginPath(); ctx.moveTo(padL + 130, H - 8); ctx.lineTo(padL + 154, H - 8); ctx.stroke();
    ctx.fillText('Contributions', padL + 160, H - 4);
  }

  function init() {
    var btn = document.getElementById('calcBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var pv = parseFloat(document.getElementById('initial').value) || 0;
      var pmt = parseFloat(document.getElementById('monthly').value) || 0;
      var rate = (parseFloat(document.getElementById('rate').value) || 0) / 100;
      var years = parseInt(document.getElementById('years').value, 10) || 0;
      if (years <= 0 || years > 60) {
        document.getElementById('results').innerHTML = '<p>Enter 1–60 years.</p>';
        return;
      }

      var balances = [pv], contributions = [pv];
      for (var y = 1; y <= years; y++) {
        balances.push(fv(pv, pmt, rate, y));
        contributions.push(pv + pmt * 12 * y);
      }
      var total = balances[balances.length - 1];
      var contrib = contributions[contributions.length - 1];
      var growth = total - contrib;

      var html = '<div class="result-big">' + fmt(total) + '</div>';
      html += '<p class="note">Projected value after ' + years + ' years</p>';
      html += '<div class="stat-grid">';
      html += '<div class="stat"><div class="v">' + fmt(contrib) + '</div><div class="l">Total contributions</div></div>';
      html += '<div class="stat"><div class="v">' + fmt(growth) + '</div><div class="l">Investment growth</div></div>';
      html += '</div>';
      html += '<canvas class="chart" id="growthChart"></canvas>';
      html += '<h3>Year-by-year growth</h3>';
      html += '<table class="data"><tr><th>Year</th><th>Balance</th><th>Contributed</th><th>Growth</th></tr>';
      var step = years > 25 ? 2 : 1;
      for (var yy = 0; yy <= years; yy += step) {
        html += '<tr><td>' + yy + '</td><td>' + fmt(balances[yy]) + '</td><td>' +
          fmt(contributions[yy]) + '</td><td>' + fmt(balances[yy] - contributions[yy]) + '</td></tr>';
      }
      if ((years % step) !== 0) {
        var yy2 = years;
        html += '<tr><td>' + yy2 + '</td><td>' + fmt(balances[yy2]) + '</td><td>' +
          fmt(contributions[yy2]) + '</td><td>' + fmt(balances[yy2] - contributions[yy2]) + '</td></tr>';
      }
      html += '</table>';
      html += '<p class="note">Monthly compounding. Past performance does not guarantee future results. ' +
        'Educational purposes only — not financial advice.</p>';
      document.getElementById('results').innerHTML = html;
      drawChart(document.getElementById('growthChart'), balances, contributions);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  if (typeof window !== 'undefined') window.__compoundFV = fv;
})();
