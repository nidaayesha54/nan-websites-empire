// Term vs Whole life cost comparator
(function () {
  "use strict";

  // Illustrative annual premium per $100k of coverage (age-banded, non-smoker, healthy).
  // These are approximations for comparison purposes only.
  var TERM_RATES = [
    { max: 29, rate: 120 }, { max: 34, rate: 150 }, { max: 39, rate: 190 },
    { max: 44, rate: 280 }, { max: 49, rate: 430 }, { max: 54, rate: 720 },
    { max: 59, rate: 1150 }, { max: 99, rate: 1900 }
  ];

  function termRatePer100k(age) {
    for (var i = 0; i < TERM_RATES.length; i++) {
      if (age <= TERM_RATES[i].max) return TERM_RATES[i].rate;
    }
    return 1900;
  }

  function calculate() {
    var age = window.num("age", 35);
    if (age < 18) age = 18;
    if (age > 80) age = 80;
    var coverage = window.num("coverage", 500000);
    if (coverage < 50000) coverage = 50000;
    var termYears = parseInt(document.getElementById("termYears").value, 10) || 20;
    var smoker = document.getElementById("smoker").value === "yes";

    var base = termRatePer100k(age) * (coverage / 100000);
    if (smoker) base *= 2.4; // smokers pay roughly 2-3x more

    var termAnnual = base;
    var termTotal = termAnnual * termYears;

    // Whole life costs roughly 10-15x term; illustrative factor 12x.
    var wholeAnnual = base * 12;
    var payYears = Math.min(85 - age, 50); // illustrative pay-until horizon
    var wholeTotal = wholeAnnual * payYears;
    // Illustrative cash value accumulation (~3% growth on portion of premium)
    var cashValue = wholeAnnual * 0.55 * (Math.pow(1.03, payYears) - 1) / 0.03;

    var html = "<h3>Cost comparison: " + window.fmtUSD(coverage) + " coverage</h3>";
    html += '<table class="cmp"><tr><th></th><th style="text-align:right">Term life (' + termYears + ' yrs)</th><th style="text-align:right">Whole life</th></tr>';
    html += "<tr><td>Estimated annual premium</td><td class=\"num\">" + window.fmtUSD(termAnnual) + "</td><td class=\"num\">" + window.fmtUSD(wholeAnnual) + "</td></tr>";
    html += "<tr><td>Estimated total paid</td><td class=\"num\">" + window.fmtUSD(termTotal) + " (over " + termYears + " yrs)</td><td class=\"num\">" + window.fmtUSD(wholeTotal) + " (illustrative)</td></tr>";
    html += "<tr><td>Coverage after term ends</td><td class=\"num\">Expires</td><td class=\"num\">Lifetime</td></tr>";
    html += "<tr><td>Illustrative cash value</td><td class=\"num\">$0</td><td class=\"num\">" + window.fmtUSD(cashValue) + "</td></tr>";
    html += "</table>";

    html += "<h3>Which fits you?</h3>";
    if (termTotal * 3 < wholeTotal) {
      html += "<p><strong>Term life wins on cost.</strong> Term is dramatically cheaper for pure protection during your working years — the choice for most families covering income, mortgage, and kids' education. Whole life costs many times more for the same death benefit.</p>";
    } else {
      html += "<p><strong>Consider your goals.</strong> If you need lifetime coverage (estate planning, a dependent who needs permanent support) or want a cash-value component, whole life has a role — but it is far more expensive per dollar of protection.</p>";
    }
    html += '<p style="color:var(--muted);font-size:.85rem;margin-top:14px">Illustrative estimates only — not financial advice or a quote. Real premiums depend on underwriting, carrier, and health details.</p>';

    var out = document.getElementById("twResult");
    out.innerHTML = html;
    window.showResult("twResult");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("calcTW");
    if (btn) btn.addEventListener("click", calculate);
  });
})();
