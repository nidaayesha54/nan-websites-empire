// Shared helpers: FAQ accordion, footer year, radio cards, formatters
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  document.querySelectorAll('.faq-item .faq-q').forEach(q => {
    q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
  });
  document.querySelectorAll('.radio-grid').forEach(grid => {
    grid.querySelectorAll('.radio-card').forEach(card => {
      const input = card.querySelector('input');
      card.addEventListener('click', () => {
        grid.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
      if (input && input.checked) card.classList.add('selected');
    });
  });
});
function fmtUSD(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}
function getChecked(name) {
  const el = document.querySelector('input[name="' + name + '"]:checked');
  return el ? el.value : null;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
