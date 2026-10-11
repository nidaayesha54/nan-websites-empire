// CreditHub shared JS: FAQ accordion, footer year, helpers
document.addEventListener('DOMContentLoaded', function () {
  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      q.parentElement.classList.toggle('open');
    });
  });
  // Footer year
  document.querySelectorAll('.yr').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Copy helper (used by letter/calc outputs)
  window.copyText = function (id, btn) {
    var el = document.getElementById(id);
    var t = el ? (el.value || el.innerText) : '';
    navigator.clipboard.writeText(t).then(function () {
      if (btn) { var o = btn.textContent; btn.textContent = 'Copied!'; setTimeout(function(){btn.textContent=o;}, 1500); }
    });
  };
  // Number formatting
  window.fmt$ = function (n) {
    return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: (n % 1 ? 2 : 0) });
  };
});
