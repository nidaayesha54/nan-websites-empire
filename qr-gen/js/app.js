/* QRGen shared UI: mobile nav, FAQ accordion, footer year */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('menuBtn');
    var nav = document.getElementById('mainNav');
    if (btn && nav) {
      btn.addEventListener('click', function () { nav.classList.toggle('open'); });
    }
    document.querySelectorAll('.faq-item .faq-q').forEach(function (q) {
      q.addEventListener('click', function () {
        q.parentElement.classList.toggle('open');
      });
    });
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  });
})();
