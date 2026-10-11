/* Portfolio Allocator: age-based stock/bond split with canvas pie chart */
(function () {
  'use strict';

  var ADJ = { conservative: -10, moderate: 0, aggressive: 10 };

  function allocate(age, risk) {
    var stocks = 110 - age + (ADJ[risk] || 0);
    stocks = Math.max(10, Math.min(95, Math.round(stocks)));
    return { stocks: stocks, bonds: 100 - stocks };
  }

  function drawPie(canvas, stocks, bonds) {
    var ctx = canvas.getContext('2d');
    var W = canvas.width = 420, H = canvas.height = 300;
    ctx.clearRect(0, 0, W, H);
    var cx = 150, cy = 150, rad = 110;
    var data = [
      { label: 'Stocks ' + stocks + '%', value: stocks, color: '#d4af37' },
      { label: 'Bonds ' + bonds + '%', value: bonds, color: '#14532d' }
    ];
    var start = -Math.PI / 2;
    data.forEach(function (d) {
      var slice = (d.value / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, rad, start, start + slice);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      start += slice;
    });
    // labels
    ctx.font = 'bold 14px sans-serif';
    var ly = 100;
    data.forEach(function (d) {
      ctx.fillStyle = d.color;
      ctx.fillRect(300, ly - 12, 18, 18);
      ctx.fillStyle = '#374151';
      ctx.fillText(d.label, 326, ly + 2);
      ly += 34;
    });
  }

  function riskLabel(risk) {
    return { conservative: 'Conservative', moderate: 'Moderate', aggressive: 'Aggressive' }[risk] || 'Moderate';
  }

  function init() {
    var btn = document.getElementById('calcBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var age = parseInt(document.getElementById('age').value, 10) || 0;
      var risk = document.getElementById('risk').value;
      if (age < 18 || age > 100) {
        document.getElementById('results').innerHTML = '<p>Enter an age between 18 and 100.</p>';
        return;
      }
      var a = allocate(age, risk);
      var html = '<div class="stat-grid">';
      html += '<div class="stat"><div class="v">' + a.stocks + '%</div><div class="l">Stocks</div></div>';
      html += '<div class="stat"><div class="v">' + a.bonds + '%</div><div class="l">Bonds</div></div>';
      html += '</div>';
      html += '<canvas class="chart" id="pieChart"></canvas>';
      html += '<p style="margin-top:14px">Suggested for age <strong>' + age + '</strong>, ' +
        riskLabel(risk) + ' risk tolerance — based on the "110 minus age" rule' +
        (risk !== 'moderate' ? ', adjusted for your risk profile' : '') + '.</p>';
      html += '<p class="note">A starting point only, not personalized advice. Rebalance yearly and consider ' +
        'your goals and timeline. Educational purposes only — not financial advice.</p>';
      document.getElementById('results').innerHTML = html;
      drawPie(document.getElementById('pieChart'), a.stocks, a.bonds);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  if (typeof window !== 'undefined') window.__allocate = allocate;
})();
