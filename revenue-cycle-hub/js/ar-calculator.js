// AR Days Calculator — AR days = total AR / average daily charges, vs benchmarks
function calcAR() {
  var totalAR = num('ar-total');
  var daily = num('ar-daily');
  var box = document.getElementById('ar-result');

  if (daily <= 0) {
    alert('Please enter your average daily charges (greater than 0).');
    return;
  }
  var arDays = totalAR / daily;
  var verdict, cls, tip;
  if (arDays < 40) {
    verdict = 'Excellent — top performer';
    cls = 'good';
    tip = 'Your collections are strong. Keep monitoring weekly to stay here.';
  } else if (arDays <= 50) {
    verdict = 'Average — room to improve';
    cls = 'warn';
    tip = 'Industry average is 40–50 days. Focus on front-end eligibility checks and denial follow-up to push below 40.';
  } else {
    verdict = 'Needs attention — collections problem';
    cls = 'bad';
    tip = 'Over 50 AR days usually means aging claims, slow payer follow-up, or front-end errors. Audit your 90+ day bucket first — it should be under 15–20% of total AR.';
  }

  var ar90 = num('ar-90');
  var pct90 = totalAR > 0 ? (ar90 / totalAR * 100) : 0;
  var pct90Verdict = pct90 <= 20
    ? '<span class="good">Healthy (≤20%)</span>'
    : '<span class="bad">Too high — over 20% of AR is aging</span>';

  box.innerHTML =
    '<h3>Your AR Days: <span class="' + cls + '">' + arDays.toFixed(1) + ' days</span></h3>' +
    '<div class="stat-row">' +
    '<div class="stat"><div class="num">' + arDays.toFixed(1) + '</div><div class="lbl">AR days</div></div>' +
    '<div class="stat"><div class="num">&lt;40</div><div class="lbl">Target (excellent)</div></div>' +
    '<div class="stat"><div class="num">40–50</div><div class="lbl">Industry average</div></div>' +
    '<div class="stat"><div class="num">&gt;50</div><div class="lbl">Needs work</div></div>' +
    '</div>' +
    '<p><strong>Verdict:</strong> <span class="' + cls + '">' + verdict + '</span></p>' +
    '<p style="color:var(--muted)">' + tip + '</p>' +
    (ar90 > 0 ? '<p><strong>AR over 90 days:</strong> ' + pct90.toFixed(1) + '% of total — ' + pct90Verdict + '</p>' : '');
  box.classList.add('show');
}
