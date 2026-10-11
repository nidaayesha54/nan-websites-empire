// AINarrationHub — shared site scripts
(function () {
  'use strict';

  // Highlight the current page in the nav
  function highlightNav() {
    var path = window.location.pathname;
    var links = document.querySelectorAll('.navlinks a');
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      // match by filename (last segment)
      var file = href.split('/').pop();
      if (file && path.endsWith(file)) {
        a.classList.add('active');
      }
    });
  }

  // Shared word counter utility
  function countWords(text) {
    var m = (text || '').trim().match(/\S+/g);
    return m ? m.length : 0;
  }

  // Shared copy-to-clipboard helper with fallback
  function copyText(text, statusEl, doneMsg) {
    function done() {
      if (statusEl) statusEl.textContent = doneMsg || 'Copied to clipboard ✓';
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else {
      fallback();
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) { /* noop */ }
      document.body.removeChild(ta);
      done();
    }
  }

  document.addEventListener('DOMContentLoaded', highlightNav);

  // expose helpers for tool scripts
  window.ANH = { countWords: countWords, copyText: copyText };
})();
