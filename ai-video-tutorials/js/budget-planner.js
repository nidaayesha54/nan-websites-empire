// AIVideoTutorials — Free-Tier Budget Planner
(function () {
  "use strict";

  // Approximate free-tier allowances in 10-second clips per month (Oct 2026 estimates).
  var FREE_TIERS = [
    { name: "Hailuo (MiniMax)", clips: 30, note: "Daily free credits; generous starter allowance", wm: "Yes (free tier)", commercial: "No" },
    { name: "Kling", clips: 20, note: "Daily login credits on the free plan", wm: "Yes (free tier)", commercial: "No" },
    { name: "Luma Dream Machine", clips: 15, note: "Free monthly generations", wm: "Yes (free tier)", commercial: "No" },
    { name: "Pika", clips: 12, note: "Free credits refresh monthly", wm: "Yes (free tier)", commercial: "No" },
    { name: "Runway", clips: 8, note: "One-time free credits for new accounts", wm: "Yes (free tier)", commercial: "No" }
  ];

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function calc() {
    var videos = parseInt(document.getElementById("bpVideos").value, 10);
    var length = parseInt(document.getElementById("bpLength").value, 10);
    document.getElementById("bpVideosLabel").textContent = videos;
    document.getElementById("bpLengthLabel").textContent = length + "s";

    var clipsPerVideo = Math.max(1, Math.ceil(length / 10));
    var needed = videos * clipsPerVideo;
    var total = 0;
    for (var i = 0; i < FREE_TIERS.length; i++) { total += FREE_TIERS[i].clips; }

    var out = document.getElementById("bpResult");
    var html = "";
    html += "<h3>Your free-tier budget</h3>";
    html += "<div class='kpis'>";
    html += "<div class='kpi'><div class='n'>" + videos + "</div><div class='l'>Videos / month</div></div>";
    html += "<div class='kpi'><div class='n'>" + needed + "</div><div class='l'>10s clips needed</div></div>";
    html += "<div class='kpi'><div class='n'>" + total + "</div><div class='l'>Free clips available</div></div>";
    html += "</div>";

    html += "<table class='tool-table'><tr><th>Free plan</th><th>~Clips/month</th><th>Watermark</th><th>Commercial use</th><th>Notes</th></tr>";
    for (var j = 0; j < FREE_TIERS.length; j++) {
      var t = FREE_TIERS[j];
      html += "<tr><td><strong style='color:var(--text)'>" + esc(t.name) + "</strong></td><td>" + t.clips + "</td><td>" + esc(t.wm) + "</td><td>" + esc(t.commercial) + "</td><td>" + esc(t.note) + "</td></tr>";
    }
    html += "</table>";

    if (needed <= total) {
      html += "<div class='tip'><strong>✔ Fully covered for free.</strong> Your " + videos + " video(s)/month fit inside the combined free tiers (" + needed + " of ~" + total + " clips). Stack Hailuo + Kling + Luma across the month and pay $0.</div>";
    } else {
      var short = needed - total;
      var shortVideos = Math.ceil(short / clipsPerVideo);
      html += "<div class='warn'><strong>⚠ Free tiers cover most of it.</strong> You're short ~" + short + " clips (≈" + shortVideos + " video" + (shortVideos > 1 ? "s" : "") + "). Options: shorten videos, re-use B-roll across videos, or add one $10/mo plan (Pika/Hailuo) to close the gap.</div>";
    }
    html += "<p style='color:var(--dim);font-size:.88rem;margin-top:14px'>Allowances are October 2026 estimates and change often — always check each tool's current free plan. Free tiers watermark output and don't allow commercial use.</p>";
    out.innerHTML = html;
    out.style.display = "block";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var v = document.getElementById("bpVideos");
    var l = document.getElementById("bpLength");
    var btn = document.getElementById("bpCalc");
    if (!v || !l || !btn) return;
    v.addEventListener("input", calc);
    l.addEventListener("input", calc);
    btn.addEventListener("click", calc);
    calc();
  });
})();
