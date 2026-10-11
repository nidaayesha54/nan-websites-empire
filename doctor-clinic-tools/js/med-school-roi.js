document.addEventListener('DOMContentLoaded', function () {
  var specSel = document.getElementById('specialty');
  SPECIALTIES.forEach(function (s) {
    var o = document.createElement('option');
    o.value = s.id;
    o.textContent = s.name + ' (' + s.residency + 'y residency)';
    specSel.appendChild(o);
  });

  document.getElementById('calc').addEventListener('submit', function (e) {
    e.preventDefault();
    var spec = specialtyById(specSel.value);
    var debt = parseFloat(document.getElementById('debt').value) || 0;
    var rate = (parseFloat(document.getElementById('rate').value) || 6.5) / 100;
    var repayYears = parseFloat(document.getElementById('repay').value) || 10;
    var altSalary = parseFloat(document.getElementById('alt').value) || 85000;

    var trainingYears = 4 + spec.residency; // 4y med school + residency
    var residencyStipend = 65000;

    // Interest accrues during training (simplified: full balance compounds)
    var principal = debt * Math.pow(1 + rate, trainingYears);

    // Standard amortized payment
    var r = rate / 12, n = repayYears * 12;
    var monthly = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    var totalPaid = monthly * n;
    var totalInterest = totalPaid - principal;

    // Lifetime model: 30 working years post-training, 2% annual raise
    var WORK = 30, GROW = 0.02;
    function lifetimeEarnings(startSalary, startAge) {
      var total = 0;
      for (var y = 0; y < WORK; y++) total += startSalary * Math.pow(1 + GROW, y);
      return total;
    }
    var docEarnings = lifetimeEarnings(spec.salary, 0);
    // Alternative path: works during training years too
    var altEarnings = 0;
    for (var y = 0; y < trainingYears + WORK; y++) altEarnings += altSalary * Math.pow(1 + GROW, y);
    var residencyEarnings = residencyStipend * spec.residency * (1 + GROW); // approx
    var docNet = docEarnings + residencyEarnings - totalPaid;
    var diff = docNet - altEarnings;

    // Breakeven: year when cumulative doc net catches alt cumulative
    var cumDoc = 0, cumAlt = 0, breakeven = -1;
    var debtBalance = principal, mPay = monthly;
    for (var t = 0; t <= trainingYears + WORK; t++) {
      var docYear, altYear;
      if (t < 4) { docYear = 0; } // med school: no income
      else if (t < trainingYears) { docYear = residencyStipend * Math.pow(1 + GROW, t); }
      else { docYear = spec.salary * Math.pow(1 + GROW, t - trainingYears); }
      altYear = altSalary * Math.pow(1 + GROW, t);
      // debt payments during first repayYears of working (after training)
      var payThisYear = 0;
      if (t >= trainingYears && t < trainingYears + repayYears) payThisYear = mPay * 12;
      cumDoc += docYear - payThisYear;
      cumAlt += altYear;
      if (breakeven < 0 && t >= trainingYears && cumDoc >= cumAlt) breakeven = t;
    }

    var res = document.getElementById('result');
    res.classList.add('show');
    var verdict = diff > 0
      ? 'On these numbers, the physician path earns about <strong>' + fmt(diff) + '</strong> more over a career — breakeven around year ' + (breakeven > 0 ? breakeven : '30+') + ' after starting school.'
      : 'On these numbers, the alternative career path earns more over a lifetime (' + fmt(-diff) + ' gap). Consider lower-debt schools, scholarships, or higher-paying specialties.';
    res.innerHTML =
      '<h3>Med School ROI — ' + esc(spec.name) + '</h3>' +
      '<div class="stat-row"><span>Training years (school + residency)</span><strong>' + trainingYears + '</strong></div>' +
      '<div class="stat-row"><span>Debt at graduation (with accrued interest)</span><strong>' + fmt(principal) + '</strong></div>' +
      '<div class="stat-row"><span>Monthly loan payment (' + repayYears + ' yrs)</span><strong>' + fmt(monthly) + '</strong></div>' +
      '<div class="stat-row"><span>Total repaid (principal + interest)</span><strong>' + fmt(totalPaid) + '</strong></div>' +
      '<div class="stat-row"><span>Total interest paid</span><strong>' + fmt(totalInterest) + '</strong></div>' +
      '<div class="stat-row"><span>Lifetime physician net (30y practice)</span><strong>' + fmt(docNet) + '</strong></div>' +
      '<div class="stat-row"><span>Lifetime alternative career (' + fmt(altSalary) + '/yr)</span><strong>' + fmt(altEarnings) + '</strong></div>' +
      '<p class="note">' + verdict + ' This is a simplified model (constant 2% raises, no taxes modeled) for comparison purposes — not financial advice.</p>';
    res.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
