/* AI Video Tools Hub — shared site JS (vanilla, no deps) */
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

    // Active nav link
    var path = window.location.pathname;
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      var file = href.split('/').pop();
      if (file && path.endsWith(file)) {
        a.classList.add('active');
      } else if (href === 'index.html' && (path.endsWith('/') || path.endsWith('index.html'))) {
        a.classList.add('active');
      }
    });

    // Footer year
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // FAQ accordions
    document.querySelectorAll('.faq-item .faq-q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.closest('.faq-item').classList.toggle('open');
      });
    });
  });
})();
