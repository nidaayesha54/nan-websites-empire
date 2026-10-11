// Premium estimator by age / health class / smoker / term length
(function () {
  "use strict";

  // Illustrative monthly premium per $100k of 20-yr term coverage, non-smoker, preferred-plus.
  var BASE = [
    { max: 24, m: 9 }, { max: 29, m: 10 }, { max: 34, m: 12 },
    { max: 39, m: 15 }, { max: 44, m: 22 }, { max: 49, m: 33 },
    { max: 54, m: 52 }, { max: 59, m: 82 }, { max: 64, m: 130 },
    { max: 99, m: 210 }
  ];

  var HEALTH_MULT = {
    preferred_plus: { label: "Preferred Plus (excellent health)", mult: 1.0 },
    preferred: { label: "Preferred (very good)", mult: 1.18 },
    standard_plus: { label: "Standard Plus (good)", mult: 1.35 },
    standard: { label: "Standard (average)", mult: 1.6 },
    substandard: { label: "Substandard (health issues)", mult: 2.2 }
  };

  var TERM_MULT = { 10: 0.75, 15: 0.9, 20: 1.0, 25: 1.2, 30: 1.45 };

  function baseMonthly(age) {
    for (var i = 0; i < BASE.length; i++) {
      if (age <= BASE[i].max) return BASE[i].m;
    }
    return 210;
  }

  function calculate() {
    var age = window.num("age", 35);
    if (age < 18) age = 18;
    if (age > 75) age = 75;
    var coverage = window.num("coverage", 500000);
    if (coverage < 25000) coverage = 25000;
    var health = document.getElementById("health").value;
    var smoker = document.getElementById("smoker").value === "yes";
    var term = parseInt(document.getElementById("term").value, 10) || 20;
    var gender = document.getElementById("gender").value;

    var monthly = baseMonthly(age) * (coverage / 100000);
    monthly *= (HEALTH_MULT[health] ? HEALTH_MULT[health].mult : 1.6);
    monthly *= (TERM_MULT[term] || 1.0);
    if (smoker) monthly *= 2.4;
    if (gender === "male") monthly *= 1.15; // men pay slightly more on average

    var annual = monthly * 12;
    var total = annual * term;

    var html = "<h3>Your estimated premium</h3>";
    html += '<div class="big-number">' + window.fmtUSD(monthly) + '<span style="font-size:1.2rem;color:var(--muted)">/mo</span></div>';
    html += "<p>" + window.fmtUSD(annual) + " per year · " + window.fmtUSD(total) + " total over a " + term + "-year term.</p>";

    html += "<h3>How your factors change the price</h3>";
    html += '<table class="cmp"><tr><th>Factor</th><th>Your selection</th><th style="text-align:right">Effect</th></tr>';
    html += "<tr><td>Age</td><td>" + age + "</td><td class=\"num\">base rate " + window.fmtUSD(baseMonthly(age)) + "/mo per $100k</td></tr>";
    html += "<tr><td>Health class</td><td>" + (HEALTH_MULT[health] ? HEALTH_MULT[health].label : health) + "</td><td class=\"num\">×" + (HEALTH_MULT[health] ? HEALTH_MULT[health].mult : 1.6) + "</td></tr>";
    html += "<tr><td>Tobacco</td><td>" + (smoker ? "Smoker" : "Non-smoker") + "</td><td class=\"num\">" + (smoker ? "×2.4" : "×1.0") + "</td></tr>";
    html += "<tr><td>Term length</td><td>" + term + " years</td><td class=\"num\">×" + (TERM_MULT[term] || 1.0) + "</td></tr>";
    html += "<tr><td>Gender</td><td>" + (gender === "male" ? "Male" : "Female") + "</td><td class=\"num\">" + (gender === "male" ? "×1.15" : "×1.0") + "</td></tr>";
    html += "</table>";

    html += "<h3>Tips to lower your premium</h3>";
    html += "<ul>";
    html += "<li>Apply younger — premiums rise every year of age.</li>";
    html += "<li>Quit tobacco at least 12 months before applying for non-smoker rates.</li>";
    html += "<li>Improve health metrics (blood pressure, cholesterol, BMI) before the medical exam.</li>";
    html += "<li>Choose the shortest term that covers your actual need (e.g., until kids are independent).</li>";
    html += "</ul>";
    html += '<p style="color:var(--muted);font-size:.85rem;margin-top:14px">Ballpark estimates for education only — not a quote and not financial advice. Actual premiums come from carrier underwriting.</p>';

    var out = document.getElementById("premResult");
    out.innerHTML = html;
    window.showResult("premResult");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("calcPrem");
    if (btn) btn.addEventListener("click", calculate);
  });
})();
