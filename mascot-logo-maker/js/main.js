// Shared site JS: mobile nav + footer year
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var burger = document.querySelector('.burger');
    var links = document.querySelector('nav.links');
    if (burger && links) {
      burger.addEventListener('click', function () {
        links.classList.toggle('open');
      });
    }
    // mark active nav link
    var path = window.location.pathname;
    document.querySelectorAll('nav.links a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href && path.endsWith(href.split('/').pop()) && href !== '#') {
        a.classList.add('active');
      }
    });
  });
})();
