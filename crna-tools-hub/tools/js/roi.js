// CRNA School ROI Calculator — school cost + lost wages vs CRNA earnings
(function () {
  "use strict";

  function fmt(n) {
    var neg = n < 0;
    return (neg ? "−$" : "$") + Math.abs(Math.round(n)).toLocaleString("en-US");
  }

  function num(id, fallback) {
    var el = document.getElementById(id);
    if (!el) { return fallback; }
    var v = parseFloat(String(el.value).replace(/[^0-9.\-]/g, ""));
    return isNaN(v) ? fallback : v;
  }

  function init() {
    var btn = document.getElementById("roi-btn");
    var out = document.getElementById("result");
    if (!btn || !out) { return; }

    btn.addEventListener("click", function () {
      var schoolCost = num("school-cost", 180000);   // total tuition + fees + living loans
      var rnSalary = num("rn-salary", 85000);        // current RN salary
      var schoolYears = num("school-years", 3);      // DNP length
      var crnaStart = num("crna-start", 214000);      // starting CRNA salary
      var growth = num("growth", 2) / 100;           // annual raise %
      var horizon = num("horizon", 25);              // career years after graduation

      // Total investment: tuition + foregone RN wages during school
      var investment = schoolCost + rnSalary * schoolYears;

      // Cumulative advantage of CRNA path vs staying RN, year by year
      var rows = [];
      var cum = -investment;
      var breakeven = null;
      for (var y = 1; y <= horizon; y++) {
        var crnaPay = crnaStart * Math.pow(1 + growth, y - 1);
        var rnPay = rnSalary * Math.pow(1 + growth, y - 1);
        cum += (crnaPay - rnPay);
        rows.push({ year: y, crna: crnaPay, diff: crnaPay - rnPay, cum: cum });
        if (breakeven === null && cum >= 0) { breakeven = y; }
      }
      var lifetimeGain = cum;

      document.getElementById("res-invest").textContent = fmt(investment);
      document.getElementById("res-invest-note").textContent =
        fmt(schoolCost) + " costs + " + fmt(rnSalary * schoolYears) + " lost RN wages";

      var beEl = document.getElementById("res-breakeven");
      if (breakeven === null) {
        beEl.textContent = ">" + horizon + " yrs";
      } else {
        beEl.textContent = breakeven + (breakeven === 1 ? " year" : " years");
      }

      document.getElementById("res-gain").textContent = fmt(lifetimeGain);
      document.getElementById("res-gain-note").textContent =
        "extra earnings over " + horizon + " yrs as CRNA vs staying RN";

      // Year-by-year table (first 10 + final year)
      var tbl = '<table class="data"><tr><th>Year after grad</th><th>CRNA salary</th><th>Extra vs RN</th><th>Cumulative gain</th></tr>';
      rows.forEach(function (r, i) {
        if (i < 10 || i === rows.length - 1) {
          if (i === 10) { tbl += '<tr><td colspan="4" style="text-align:center">…</td></tr>'; }
          tbl += "<tr><td>" + r.year + "</td><td>" + fmt(r.crna) + "</td><td>" + fmt(r.diff) +
            "</td><td>" + fmt(r.cum) + "</td></tr>";
        }
      });
      tbl += "</table>";
      document.getElementById("res-table").innerHTML = tbl;

      document.getElementById("res-note").textContent =
        "Assumes a " + growth * 100 + "% annual raise for both paths and no loan interest. " +
        "In reality, loan interest adds cost — but CRNA salaries also rise faster with experience and overtime/call pay.";

      out.classList.add("show");
      out.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
