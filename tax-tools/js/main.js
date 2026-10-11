document.addEventListener('DOMContentLoaded', function () {
  var t = document.querySelector('.nav-toggle');
  var nav = document.querySelector('nav.main-nav');
  if (t && nav) {
    t.addEventListener('click', function () { nav.classList.toggle('open'); });
  }
  var years = document.querySelectorAll('.year');
  for (var i = 0; i < years.length; i++) {
    years[i].textContent = new Date().getFullYear();
  }
});
