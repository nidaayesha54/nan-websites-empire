// Shared helpers for AIVoiceoverHub
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sel = btn.getAttribute('data-copy');
      var el = document.querySelector(sel);
      if (!el) return;
      var text = el.innerText || el.value || '';
      navigator.clipboard.writeText(text).then(function () {
        var old = btn.textContent;
        btn.textContent = 'Copied ✓';
        setTimeout(function () { btn.textContent = old; }, 1500);
      });
    });
  });
});
