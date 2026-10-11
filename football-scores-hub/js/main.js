/* Shared site JS: mobile nav is CSS-only; keep footer year updated. */
(function () {
  document.querySelectorAll('footer.site-footer .yr').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
