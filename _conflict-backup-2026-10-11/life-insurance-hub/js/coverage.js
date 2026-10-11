// DIME method coverage calculator: D + I + M + E - Assets
(function () {
  "use strict";

  function calculate() {
    var debts = window.num("debts");
    var income = window.num("income");
    var years = window.num("years");
    var mortgage = window.num("mortgage");
    var education = window.num("education");
    var kids = window.num("kids");
    var assets = window.num("assets");
    var existing = window.num("existing");

    var incomeNeed = income * years;
    var educationNeed = education * kids;
    var total = debts + incomeNeed + mortgage + educationNeed - assets - existing;
    if (total < 0) total = 0;

    var html = "";
    html += "<h3>Your recommended coverage</h3>";
    html += '<div class="big-number">' + window.fmtUSD(total) + "</div>";
    html += "<p>Based on the DIME method — the industry standard for life insurance needs analysis.</p>";
    html += "<h3>Breakdown</h3>";
    html += '<table class="cmp"><tr><th>Component</th><th style="text-align:right">Amount</th></tr>';
    html += "<tr><td><strong>D</strong> — Debts (excluding mortgage)</td><td class=\"num\">" + window.fmtUSD(debts) + "</td></tr>";
    html += "<tr><td><strong>I</strong> — Income replacement (" + window.fmtUSD(income) + " × " + years + " yrs)</td><td class=\"num\">" + window.fmtUSD(incomeNeed) + "</td></tr>";
    html += "<tr><td><strong>M</strong> — Mortgage payoff</td><td class=\"num\">" + window.fmtUSD(mortgage) + "</td></tr>";
    html += "<tr><td><strong>E</strong> — Education (" + kids + " kids × " + window.fmtUSD(education) + ")</td><td class=\"num\">" + window.fmtUSD(educationNeed) + "</td></tr>";
    html += "<tr><td>Minus: assets & existing coverage</td><td class=\"num\">−" + window.fmtUSD(assets + existing) + "</td></tr>";
    html += "<tr><td><strong>Total recommended coverage</strong></td><td class=\"num\"><strong>" + window.fmtUSD(total) + "</strong></td></tr>";
    html += "</table>";

    var barMax = Math.max(total, 1);
    html += "<h3>Visual breakdown</h3>";
    var parts = [
      ["Debts", debts, "#38bdf8"],
      ["Income replacement", incomeNeed, "#34d399"],
      ["Mortgage", mortgage, "#fbbf24"],
      ["Education", educationNeed, "#f472b6"]
    ];
    parts.forEach(function (p) {
      var pct = Math.round((p[1] / barMax) * 100);
      html += "<p><strong>" + p[0] + ":</strong> " + window.fmtUSD(p[1]) + " (" + pct + "%)</p>";
      html += '<div class="bar"><div style="width:' + pct + "%;background:" + p[2] + '"></div></div>';
    });

    html += '<p style="color:var(--muted);font-size:.85rem;margin-top:14px">Estimates only — not financial advice. Actual needs vary; talk to a licensed insurance professional.</p>';

    var out = document.getElementById("dimeResult");
    out.innerHTML = html;
    window.showResult("dimeResult");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("calcDime");
    if (btn) btn.addEventListener("click", calculate);
  });
})();
