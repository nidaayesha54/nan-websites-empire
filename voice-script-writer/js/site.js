/* VoiceScriptWriter — shared site behaviour */
(function () {
  'use strict';

  // Mobile nav toggle
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('mainNav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        nav.classList.toggle('open');
      });
      // Close nav when a link is tapped
      nav.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') nav.classList.remove('open');
      });
    }

    // Footer year
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

  // Shared helpers used by tool scripts
  window.VSW = {
    WPM: 150, // standard voice-over pace

    countWords: function (text) {
      var words = (text || '').trim().split(/\s+/).filter(Boolean);
      return words.length;
    },

    duration: function (words) {
      var totalSec = Math.round((words / this.WPM) * 60);
      var m = Math.floor(totalSec / 60);
      var s = ('0' + (totalSec % 60)).slice(-2);
      return m + ':' + s + ' min';
    },

    copyText: function (text, btn) {
      var done = function () {
        if (!btn) return;
        var original = btn.textContent;
        btn.textContent = 'Copied ✓';
        setTimeout(function () { btn.textContent = original; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else {
        fallbackCopy(text);
        done();
      }
      function fallbackCopy(t) {
        var ta = document.createElement('textarea');
        ta.value = t;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { /* noop */ }
        document.body.removeChild(ta);
      }
    },

    downloadText: function (filename, text) {
      var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    },

    esc: function (s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
  };
})();
