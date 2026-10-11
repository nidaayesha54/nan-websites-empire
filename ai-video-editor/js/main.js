// AIVideoEditor — shared UI behaviour
(function () {
  'use strict';

  // Mobile nav toggle
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.site-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        nav.classList.toggle('open');
      });
    }

    // Footer year
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

    // FAQ accordion (used on homepage + guides + blog)
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-q');
      if (!q) return;
      q.addEventListener('click', function () {
        item.classList.toggle('open');
      });
    });
  });
})();
