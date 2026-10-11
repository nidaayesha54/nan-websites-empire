/* Shared helpers: FAQ accordion */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      q.parentElement.classList.toggle('open');
    });
  });
});
function copyText(id) {
  var el = document.getElementById(id);
  var txt = el ? (el.value !== undefined ? el.value : el.textContent) : '';
  if (!txt) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).catch(function () { fallbackCopy(txt); });
  } else { fallbackCopy(txt); }
  toast('Copied!');
}
function fallbackCopy(txt) {
  var ta = document.createElement('textarea');
  ta.value = txt; document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
}
function toast(msg) {
  var t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#0a5f3b;color:#fff;padding:10px 22px;border-radius:24px;font-weight:600;z-index:99;box-shadow:0 4px 16px rgba(0,0,0,.2)';
  document.body.appendChild(t);
  setTimeout(function () { t.remove(); }, 1600);
}
function downloadFile(name, content, type) {
  var blob = new Blob([content], { type: type || 'text/plain' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
