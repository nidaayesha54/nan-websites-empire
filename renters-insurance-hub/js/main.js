// RentersInsuranceHub — shared UI helpers
document.addEventListener('DOMContentLoaded', function () {
  // footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      q.parentElement.classList.toggle('open');
    });
  });
  // collapsible room blocks
  document.querySelectorAll('.room-head').forEach(function (h) {
    h.addEventListener('click', function () {
      h.parentElement.classList.toggle('open');
    });
  });
});
