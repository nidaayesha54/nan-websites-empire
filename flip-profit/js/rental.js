/* FlipProfit — rental property ROI calculator (vanilla JS) */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };

  function num(id) {
    var v = parseFloat($("rt-" + id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function money(n) {
    if (!isFinite(n)) return "$0";
    var sign = n < 0 ? "-" : "";
    n = Math.abs(Math.round(n));
    return sign + "$" + n.toLocaleString("en-US");
  }

  function pct(n) {
    if (!isFinite(n)) return "0%";
    return (Math.round(n * 100) / 100).toLocaleString("en-US") + "%";
  }

  function calc() {
    var price = num("price"),
        down = num("down"),
        rate = num("rate") / 100 / 12,
        years = num("years"),
        rent = num("rent"),
        tax = num("tax") / 12,
        ins = num("ins") / 12,
        maint = num("maint") / 12,
        vac = num("vac") / 100,
        mgmt = num("mgmt") / 100;

    if (price <= 0) {
      $("rental-results").style.display = "none";
      $("rental-verdict").style.display = "none";
      return;
    }

    var loan = price - down;
    var months = years * 12;
    var pmt = 0;
    if (loan > 0 && rate > 0 && months > 0) {
      var f = Math.pow(1 + rate, months);
      pmt = loan * rate * f / (f - 1);
    } else if (loan > 0 && months > 0) {
      pmt = loan / months;
    }

    var grossRent = rent;
    var vacancyLoss = grossRent * vac;
    var mgmtFee = grossRent * mgmt;
    var totalExp = pmt + tax + ins + maint + vacancyLoss + mgmtFee;
    var noi = (grossRent - vacancyLoss - mgmtFee) * 12 - (tax + ins + maint) * 12;
    var cashFlow = (grossRent - totalExp) * 12;
    var capRate = price > 0 ? (noi / price) * 100 : 0;
    var coc = down > 0 ? (cashFlow / down) * 100 : (cashFlow > 0 ? Infinity : 0);
    var rentPct = price > 0 ? (rent / price) * 100 : 0; // 1% rule check

    $("rt-exp").textContent = money(totalExp);
    $("rt-pmt").textContent = money(pmt);
    $("rt-noi").textContent = money(noi);
    $("rt-cashflow").textContent = money(cashFlow);
    $("rt-cashflow").className = "v " + (cashFlow >= 0 ? "v-pos" : "v-neg");
    $("rt-cap").textContent = pct(capRate);
    $("rt-cap").className = "v " + (capRate >= 6 ? "v-pos" : capRate >= 4 ? "v-warn" : "v-neg");
    $("rt-coc").textContent = isFinite(coc) ? pct(coc) : "N/A";
    $("rt-coc").className = "v " + (coc >= 8 ? "v-pos" : coc >= 0 ? "v-warn" : "v-neg");
    $("rt-1pct").textContent = pct(rentPct) + (rentPct >= 1 ? " ✓" : " ✗");
    $("rt-1pct").className = "v " + (rentPct >= 1 ? "v-pos" : "v-warn");

    $("rental-results").style.display = "block";

    var v = $("rental-verdict");
    v.style.display = "block";
    if (cashFlow > 0 && capRate >= 6 && coc >= 8) {
      v.className = "verdict good";
      v.innerHTML = "<strong>Strong rental.</strong> Positive cash flow, cap rate above 6%, and cash-on-cash return above 8%. This deal deserves a deeper look.";
    } else if (cashFlow > 0) {
      v.className = "verdict meet";
      v.innerHTML = "<strong>Cash-flowing, but thin.</strong> It makes money monthly, yet the returns are below investor benchmarks. Try a bigger down payment or a lower purchase price.";
    } else {
      v.className = "verdict bad";
      v.innerHTML = "<strong>Negative cash flow.</strong> You would pay out of pocket every month to hold this property. Pass — or renegotiate the price down.";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var inputs = document.querySelectorAll("#rental-form input");
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("input", calc);
    }
    var faq = document.querySelectorAll(".faq-q");
    for (var j = 0; j < faq.length; j++) {
      faq[j].addEventListener("click", function () {
        this.parentElement.classList.toggle("open");
      });
    }
    calc();
  });
})();
