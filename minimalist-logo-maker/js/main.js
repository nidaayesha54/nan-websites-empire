// MinimalistLogoMaker — shared site JS (mobile nav, active link)
(function () {
  "use strict";
  var btn = document.getElementById("menuBtn");
  var nav = document.getElementById("mainNav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }
  // highlight active nav link
  try {
    var path = window.location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll("nav.main a");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href") || "";
      if (href.split("/").pop() === path) links[i].classList.add("active");
    }
  } catch (e) { /* noop */ }
})();
