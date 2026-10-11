/* AIAutomationHub shared JS: nav active state, FAQ, copy helpers */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('details.faq-item summary').forEach(function (s) {
    s.addEventListener('click', function () {
      var d = s.parentElement;
      document.querySelectorAll('details.faq-item[open]').forEach(function (o) {
        if (o !== d) o.removeAttribute('open');
      });
    });
  });
});

function copyText(txt, btn) {
  var done = function () {
    if (!btn) return;
    var old = btn.textContent;
    btn.textContent = 'Copied ✓';
    setTimeout(function () { btn.textContent = old; }, 1500);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).then(done).catch(function () { fallbackCopy(txt); done(); });
  } else { fallbackCopy(txt); done(); }
}
function fallbackCopy(txt) {
  var ta = document.createElement('textarea');
  ta.value = txt;
  ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
}
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
