/* Shared site JS: FAQ accordions, footer year, smooth bits */
document.addEventListener('DOMContentLoaded', function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});
