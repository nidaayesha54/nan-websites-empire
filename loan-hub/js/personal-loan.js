// Personal loan calculator logic
function calcPersonalLoan() {
  var amount = parseFloat(document.getElementById('amount').value) || 0;
  var rate = parseFloat(document.getElementById('rate').value) || 0;
  var years = parseFloat(document.getElementById('years').value) || 0;
  var months = Math.round(years * 12);

  if (amount <= 0 || months <= 0) {
    alert('Please enter a loan amount and term.');
    return;
  }
  var pmt = monthlyPayment(amount, rate, months);
  var total = pmt * months;
  var interest = total - amount;

  document.getElementById('r-monthly').textContent = fmt(pmt);
  document.getElementById('r-total').textContent = fmt(total);
  document.getElementById('r-interest').textContent = fmt(interest);
  document.getElementById('r-principal').textContent = fmt(amount);

  // Simple amortization preview: first 12 rows
  var r = rate / 100 / 12, bal = amount, html = '';
  var rows = Math.min(months, 12);
  for (var i = 1; i <= rows; i++) {
    var ip = bal * r, pp = pmt - ip;
    bal = Math.max(0, bal - pp);
    html += '<tr><td>' + i + '</td><td>' + fmt(ip) + '</td><td>' + fmt(pp) + '</td><td>' + fmt(bal) + '</td></tr>';
  }
  document.getElementById('sched-body').innerHTML = html;
  var note = document.getElementById('sched-note');
  if (months > 12) note.textContent = 'Showing first 12 of ' + months + ' payments.';
  else note.textContent = 'Full amortization schedule.';

  document.getElementById('result').classList.add('show');
  document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}
