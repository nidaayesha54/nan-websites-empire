// Shared helpers for AIVoiceGeneratorHub
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  });
  window.vgh = {
    el: function (id) { return document.getElementById(id); },
    esc: function (s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },
    fmtMoney: function (n) {
      return n === 0 ? 'Free' : '$' + (Number.isInteger(n) ? n : n.toFixed(2));
    }
  };
})();
