// VideoPromptEngineer — shared helpers
(function () {
  "use strict";

  // Toast notification
  window.vpeToast = function (msg) {
    var t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  };

  // Copy text to clipboard with fallback
  window.vpeCopy = function (text, done) {
    function ok() {
      window.vpeToast("Copied to clipboard ✓");
      if (typeof done === "function") done();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, function () { fallback(); });
    } else {
      fallback();
    }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); ok(); }
      catch (e) { window.vpeToast("Copy failed — select the text manually"); }
      document.body.removeChild(ta);
    }
  };

  // Capitalize first letter
  window.vpeCap = function (s) {
    s = String(s || "").trim();
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  };
})();
