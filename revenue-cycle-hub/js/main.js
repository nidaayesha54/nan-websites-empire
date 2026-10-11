// Shared helpers for RevenueCycleHub
document.addEventListener('DOMContentLoaded', function () {
  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      q.parentElement.classList.toggle('open');
    });
  });
  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

function fmtUSD(n) {
  if (isNaN(n)) return '$0';
  return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
}
function num(id) {
  var v = parseFloat(document.getElementById(id).value);
  return isNaN(v) ? 0 : v;
}
