// MultilingualVoiceHub — shared helpers
document.addEventListener('DOMContentLoaded', () => {
  // Highlight current page in nav
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navlinks a').forEach(a => {
    if (a.getAttribute('href').endsWith(here)) {
      a.style.color = 'var(--text)';
      a.style.fontWeight = '700';
    }
  });
});
