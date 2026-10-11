/* BusinessLogoMaker - shared site behaviour */
(function () {
  "use strict";

  // Mobile nav toggle
  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        nav.classList.toggle("open");
      });
    }

    // Footer year
    var yearEls = document.querySelectorAll("[data-year]");
    var y = new Date().getFullYear();
    for (var i = 0; i < yearEls.length; i++) {
      yearEls[i].textContent = y;
    }

    // Mark active nav link
    var path = window.location.pathname;
    var links = document.querySelectorAll(".site-nav a");
    for (var j = 0; j < links.length; j++) {
      var href = links[j].getAttribute("href");
      if (href && path.indexOf(href.replace(/^\.\.?\//, "")) !== -1 && href !== "../index.html" && href !== "index.html") {
        links[j].classList.add("active");
      }
    }
  });
})();
