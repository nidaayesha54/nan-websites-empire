/* RestaurantLogoMaker — shared site JS */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    // Highlight current page in nav if not already marked
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".navlinks a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href && href.split("/").pop() === path && !a.classList.contains("active")) {
        a.classList.add("active");
      }
    });
  });
})();
