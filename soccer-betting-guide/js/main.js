/* Shared site JS: footer year + small helpers. */
document.addEventListener('DOMContentLoaded', function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

/* Format a number as USD currency (display only). */
function fmtUSD(n) {
  if (!isFinite(n)) return '$0.00';
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* Clamp helper. */
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
