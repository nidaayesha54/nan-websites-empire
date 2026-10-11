// Shared helpers for AISingingVoice
document.addEventListener('DOMContentLoaded', function () {
  // mobile nav
  var btn = document.querySelector('.menu-btn');
  var links = document.querySelector('.navlinks');
  if (btn && links) {
    btn.addEventListener('click', function () { links.classList.toggle('open'); });
  }
  // copy-to-clipboard helper: <button data-copy="#target">
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = document.querySelector(b.getAttribute('data-copy'));
      if (!el) return;
      var text = (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') ? el.value : el.innerText;
      navigator.clipboard.writeText(text).then(function () {
        var old = b.textContent;
        b.textContent = 'Copied ✓';
        setTimeout(function () { b.textContent = old; }, 1500);
      }).catch(function () { b.textContent = 'Copy failed'; });
    });
  });
  // download helper: <button data-download="filename.txt" data-download-src="#target">
  document.querySelectorAll('[data-download]').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = document.querySelector(b.getAttribute('data-download-src'));
      if (!el) return;
      var text = (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') ? el.value : el.innerText;
      var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = b.getAttribute('data-download');
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    });
  });
});
