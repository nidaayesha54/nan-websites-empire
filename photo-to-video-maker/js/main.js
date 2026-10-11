/* PhotoToVideoMaker — shared behaviors */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    // Highlight active nav link
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      if (a.getAttribute('href') === path) a.style.color = 'var(--brand)';
    });
  });
})();
