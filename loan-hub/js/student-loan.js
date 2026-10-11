// Student loan payoff planner: Standard vs Income-Driven Repayment (IDR) estimate
function calcStudentLoan() {
  var balance = parseFloat(document.getElementById('balance').value) || 0;
  var rate = parseFloat(document.getElementById('rate').value) || 0;
  var income = parseFloat(document.getElementById('income').value) || 0;
  var years = parseFloat(document.getElementById('years').value) || 0;
  var months = Math.round(years * 12);

  if (balance <= 0 || months <= 0) {
    alert('Please enter your loan balance and repayment term.');
    return;
  }

  // --- Standard plan ---
  var stdPmt = monthlyPayment(balance, rate, months);
  var stdTotal = stdPmt * months;

  // --- IDR estimate: ~10% of discretionary income / 12 (simplified) ---
  var poverty = 15060; // approx single-person guideline baseline
  var discretionary = Math.max(0, income - poverty * 1.5);
  var idrPmt = Math.max(0, discretionary * 0.10 / 12);

  var r = rate / 100 / 12;
  var idrMonths = 0, idrPaid = 0, bal = balance, forgiven = 0;
  var maxMonths = 300; // 25-year cap
  for (var i = 0; i < maxMonths; i++) {
    bal += bal * r;
    var pay = Math.min(idrPmt, bal);
    bal -= pay;
    idrPaid += pay;
    idrMonths++;
    if (bal <= 0.01) { bal = 0; break; }
  }
  forgiven = bal;

  document.getElementById('r-std-pmt').textContent = fmt(stdPmt);
  document.getElementById('r-std-total').textContent = fmt(stdTotal);
  document.getElementById('r-idr-pmt').textContent = fmt(idrPmt);
  document.getElementById('r-idr-paid').textContent = fmt(idrPaid);
  var yEl = document.getElementById('r-idr-years');
  if (forgiven > 0) {
    yEl.textContent = '25 yrs (forgiven ' + fmt(forgiven) + ' — may be taxable)';
  } else {
    yEl.textContent = (idrMonths / 12).toFixed(1) + ' yrs (paid off)';
  }

  document.getElementById('result').classList.add('show');
  document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}
