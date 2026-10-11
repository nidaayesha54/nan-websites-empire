// Shared helpers for LoanHub
function fmt(n, dec) {
  dec = dec === undefined ? 2 : dec;
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function monthlyPayment(principal, annualRate, months) {
  var r = annualRate / 100 / 12;
  if (months <= 0) return 0;
  if (r === 0) return principal / months;
  var f = Math.pow(1 + r, months);
  return principal * r * f / (f - 1);
}
// FAQ accordion enhancement (details are native)
document.addEventListener('DOMContentLoaded', function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});
