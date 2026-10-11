/* PuppyCareHub — first-year puppy cost calculator (USA averages, 2026) */
(function () {
  "use strict";

  var SIZE_MULT = { small: 0.8, medium: 1.0, large: 1.3 };
  var SIZE_LABEL = { small: "Small (under 25 lbs)", medium: "Medium (25–60 lbs)", large: "Large (60+ lbs)" };
  var FOOD_MULT = { budget: 0.75, mid: 1.0, premium: 1.5 };

  function round5(n) { return Math.round(n / 5) * 5; }

  function calculate() {
    var size = document.querySelector('input[name="size"]:checked').value;
    var source = document.querySelector('input[name="source"]:checked').value;
    var food = document.querySelector('input[name="food"]:checked').value;
    var training = document.querySelector('input[name="training"]:checked').value;
    var insurance = document.querySelector('input[name="insurance"]:checked').value;
    var spayNeuter = document.getElementById("spay-neuter").checked;

    var m = SIZE_MULT[size];
    var fm = FOOD_MULT[food];
    var rows = [];

    function row(label, low, high) {
      rows.push({ label: label, low: round5(low), high: round5(high) });
    }

    // 1. Getting the puppy
    if (source === "adopt") row("Adoption / rescue fee", 75, 400);
    else if (source === "breeder") row("Responsible breeder price", 1000, 2500);
    else row("Adoption fee or breeder price", 75, 2500);

    // 2. Food (12 months)
    row("Food — full first year", 350 * m * fm, 650 * m * fm);

    // 3. Treats & chews
    row("Treats, chews & training rewards", 100 * m, 220 * m);

    // 4. Vet — vaccinations & exams
    row("Vet exams + full vaccination series", 150, 350);
    row("Flea, tick & heartworm prevention (12 mo)", 120 * m, 300 * m);
    if (spayNeuter) row("Spay / neuter surgery", 200, 600);
    row("Microchip", 25, 75);

    // 5. Insurance
    if (insurance === "yes") row("Pet insurance — 12 months", 360, 720);
    else row("Emergency vet fund (recommended savings)", 500, 1000);

    // 6. Supplies (one-time-ish)
    row("Crate, bed, bowls, collar, leash", 150, 400);
    row("Toys & enrichment", 80, 200);
    row("Grooming supplies / first grooms", 60, 250);

    // 7. Training
    if (training === "diy") row("Training (DIY books/videos)", 0, 60);
    else if (training === "group") row("Training (group classes)", 150, 400);
    else row("Training (private trainer)", 400, 1200);

    // 8. Misc
    row("Cleaning, poop bags, misc", 100, 250);

    var low = 0, high = 0;
    var html = "";
    rows.forEach(function (r) {
      low += r.low; high += r.high;
      html += '<div class="cost-row"><span>' + r.label + "</span><span><strong>$" + r.low + " – $" + r.high + "</strong></span></div>";
    });

    var monthLow = Math.round(low / 12), monthHigh = Math.round(high / 12);
    html += '<div class="cost-row total"><span>💰 First-year total</span><span>$' + low + " – $" + high + "</span></div>";
    html += '<div class="cost-row"><span>📅 Roughly per month</span><span><strong>$' + monthLow + " – $" + monthHigh + "</strong></span></div>";

    var ctx = 'For a <strong>' + SIZE_LABEL[size] + "</strong> puppy";
    if (source === "adopt") ctx += " from a <strong>rescue/shelter</strong>";
    else if (source === "breeder") ctx += " from a <strong>breeder</strong>";
    ctx += ", " + (training === "diy" ? "<strong>DIY training</strong>" : training === "group" ? "<strong>group classes</strong>" : "<strong>private training</strong>");
    ctx += (insurance === "yes" ? " with <strong>pet insurance</strong>." : " without insurance (emergency fund instead).");

    var out = '<div class="tip">' + ctx + " These are 2026 USA averages — big-city vet prices run higher, rural lower.</div>"
      + html
      + '<div class="warn"><strong>💡 Biggest surprise costs:</strong> emergency vet visits ($500–$3,000) and chewing damage (shoes, furniture). Puppy-proofing + insurance are the two best investments you can make.</div>';

    document.getElementById("cost-results").innerHTML = out;
  }

  document.getElementById("cost-form").addEventListener("submit", function (e) {
    e.preventDefault();
    calculate();
  });
  document.querySelectorAll("#cost-form input").forEach(function (el) {
    el.addEventListener("change", calculate);
  });

  calculate(); // initial render
})();
