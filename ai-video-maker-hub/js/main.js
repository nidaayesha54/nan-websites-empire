/* Minimal shared JS — active nav highlight + smooth details */
document.addEventListener('DOMContentLoaded', () => {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href').endsWith(here)) a.style.color = 'var(--brand2)';
  });
});
