/* VendorCompare — quote comparator logic */
(function () {
  var vendorSel = document.getElementById("vendor");
  var regionSel = document.getElementById("region");

  Object.keys(VENDOR_DATA).forEach(function (k) {
    var o = document.createElement("option");
    o.value = k; o.textContent = VENDOR_DATA[k].icon + " " + VENDOR_DATA[k].name;
    vendorSel.appendChild(o);
  });
  Object.keys(REGION_MULT).forEach(function (k) {
    var o = document.createElement("option");
    o.value = k; o.textContent = REGION_MULT[k].name;
    regionSel.appendChild(o);
  });

  function scoreQuote(price, incCount, r) {
    // Price score: 50 at typical, scales down as price rises above typical
    var ratio = price / r.typical;
    var priceScore = ratio <= 1 ? 50 : Math.max(0, 50 - (ratio - 1) * 100);
    if (ratio < 0.5) priceScore = Math.max(0, priceScore - 15); // suspiciously cheap
    // Inclusion score: up to 50, ~8 pts per inclusion capped
    var incScore = Math.min(50, incCount * 8);
    return Math.round(priceScore + incScore);
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function compare() {
    var v = VENDOR_DATA[vendorSel.value];
    var r = adjRange(v, regionSel.value);
    var quotes = ["A", "B", "C"].map(function (L) {
      var price = parseFloat(document.getElementById("price" + L).value) || 0;
      var name = document.getElementById("name" + L).value.trim() || ("Quote " + L);
      var inc = document.getElementById("inc" + L).value.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      return { L: L, name: name, price: price, inc: inc };
    }).filter(function (q) { return q.price > 0; });

    if (quotes.length < 2) {
      alert("Enter at least 2 quotes with prices to compare.");
      return;
    }

    quotes.forEach(function (q) {
      q.score = scoreQuote(q.price, q.inc.length, r);
      q.vd = verdictFor(q.price, r.typical);
    });
    quotes.sort(function (a, b) { return b.score - a.score; });

    document.getElementById("fairNote").textContent =
      v.name + " — fair range in " + REGION_MULT[regionSel.value].name + ": " +
      fmt(r.low) + " – " + fmt(r.high) + " (typical " + fmt(r.typical) + ").";

    document.getElementById("quoteCols").innerHTML = quotes.map(function (q, i) {
      var badge = i === 0 ? '<span class="winner-badge">★ BEST VALUE</span><br>' : "";
      var incList = q.inc.length ? q.inc.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") : "<li><em style='color:#999'>No inclusions listed</em></li>";
      return '<div class="quote-card' + (i === 0 ? " winner" : "") + '">' +
        badge + "<h3>" + esc(q.name) + "</h3>" +
        '<div class="qprice">' + fmt(q.price) + "</div>" +
        '<span class="verdict ' + q.vd.cls + '">' + q.vd.text + "</span>" +
        "<p style='margin:8px 0 4px;font-weight:600'>Value score: " + q.score + "/100</p>" +
        '<div class="score-bar"><div class="score-fill" style="width:' + q.score + '%"></div></div>' +
        "<ul style='padding-left:20px;font-size:.92rem'>" + incList + "</ul></div>";
    }).join("");

    var res = document.getElementById("result");
    res.classList.add("show");
    res.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.getElementById("compareBtn").addEventListener("click", compare);
})();
