/* NCLEXPrepHub shared JS: FAQ accordion */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.faq button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.parentElement.classList.toggle('open');
    });
  });
});
