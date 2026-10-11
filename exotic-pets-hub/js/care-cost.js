/* Exotic Pet Care Cost Calculator — 13 species, setup + yearly breakdowns */
(function () {
  "use strict";

  // All figures in USD. setup: one-time. food/supplies/vetBase: yearly.
  var DATA = [
    { id: "gecko", name: "Leopard Gecko", emoji: "🦎", purchase: [25, 150], setup: [180, 350], food: [120, 200], supplies: [60, 120], vet: [80, 150], lifespan: "15–20 yrs",
      note: "One of the cheapest exotics to keep long-term. Main costs are live insects and heating." },
    { id: "beardie", name: "Bearded Dragon", emoji: "🦎", purchase: [50, 300], setup: [350, 700], food: [400, 700], supplies: [120, 200], vet: [100, 200], lifespan: "10–15 yrs",
      note: "Hungry pets! Daily salads and insects plus UVB bulb replacements drive the yearly cost." },
    { id: "python", name: "Ball Python", emoji: "🐍", purchase: [60, 500], setup: [250, 500], food: [150, 300], supplies: [80, 150], vet: [80, 150], lifespan: "20–30 yrs",
      note: "Cheap to feed (one rodent a week), but morphs can cost thousands — stick to normals to save." },
    { id: "slider", name: "Red-Eared Slider", emoji: "🐢", purchase: [20, 60], setup: [300, 600], food: [150, 300], supplies: [100, 200], vet: [80, 150], lifespan: "20–40 yrs",
      note: "The turtle is cheap; the big filtered tank, dock, and UVB setup are not. Multi-decade commitment." },
    { id: "budgie", name: "Budgie (Parakeet)", emoji: "🦜", purchase: [20, 60], setup: [120, 250], food: [100, 180], supplies: [60, 120], vet: [60, 120], lifespan: "8–15 yrs",
      note: "Tiny budget, big personality. Toys need frequent replacing — budgies chew through everything." },
    { id: "cockatiel", name: "Cockatiel", emoji: "🦜", purchase: [100, 300], setup: [250, 500], food: [150, 300], supplies: [100, 180], vet: [80, 150], lifespan: "15–25 yrs",
      note: "Pellet + vegetable diet is healthier but pricier than seed. Annual avian vet checks are essential." },
    { id: "conure", name: "Green-Cheeked Conure", emoji: "🦜", purchase: [300, 600], setup: [400, 800], food: [250, 450], supplies: [150, 300], vet: [100, 200], lifespan: "20–30 yrs",
      note: "Destructive chewers: budget generously for toys. A large cage is a must-have, not a luxury." },
    { id: "hedgehog", name: "Hedgehog", emoji: "🦔", purchase: [200, 400], setup: [250, 500], food: [200, 350], supplies: [100, 180], vet: [120, 250], lifespan: "4–7 yrs",
      note: "Needs constant warmth (75–85°F) — heating costs add up. Prone to tumors, so vet savings matter." },
    { id: "glider", name: "Sugar Glider", emoji: "🐿️", purchase: [300, 600], setup: [400, 800], food: [400, 700], supplies: [150, 300], vet: [150, 300], lifespan: "12–15 yrs",
      note: "One of the priciest small pets: specialized diet, tall cage, and usually kept in pairs (double everything)." },
    { id: "chinchilla", name: "Chinchilla", emoji: "🐭", purchase: [150, 350], setup: [300, 600], food: [150, 250], supplies: [100, 180], vet: [80, 150], lifespan: "15–20 yrs",
      note: "Simple diet of hay and pellets keeps food cheap. The tall multi-level cage is the big purchase." },
    { id: "ferret", name: "Ferret", emoji: "🐹", purchase: [100, 300], setup: [300, 600], food: [300, 500], supplies: [120, 200], vet: [200, 400], lifespan: "6–10 yrs",
      note: "Highest vet risk of the small mammals — insulinoma and adrenal disease are common. Insure or save." },
    { id: "betta", name: "Betta Fish", emoji: "🐠", purchase: [5, 40], setup: [80, 180], food: [30, 60], supplies: [40, 80], vet: [0, 0], lifespan: "3–5 yrs",
      note: "The cheapest pet on this list. A proper heated 5-gallon tank beats a bowl every time." },
    { id: "axolotl", name: "Axolotl", emoji: "🦎", purchase: [30, 80], setup: [250, 450], food: [150, 250], supplies: [80, 150], vet: [50, 120], lifespan: "10–15 yrs",
      note: "Cool-water tank with a chiller in warm climates can push costs up. Illegal in California and New Jersey!" }
  ];

  var VET_MULT = { basic: [1, 1], full: [1.6, 1.8], minimal: [0.4, 0.5] };
  var FOOD_MULT = { standard: [1, 1], premium: [1.25, 1.25], budget: [0.85, 0.85] };

  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
  function range(lo, hi) { return money(lo) + " – " + money(hi); }

  function calculate() {
    var sel = document.getElementById("species");
    var species = DATA.filter(function (d) { return d.id === sel.value; })[0];
    var box = document.getElementById("cost-result");
    if (!species) {
      box.innerHTML = "<h3>👆 Pick a species first</h3><p>Choose one of the 13 species above to see its cost breakdown.</p>";
      box.classList.add("show");
      return;
    }

    var firstPet = document.getElementById("first-pet").checked;
    var vetLevel = document.getElementById("vet-level").value;
    var foodLevel = document.getElementById("food-level").value;

    var food = [species.food[0] * FOOD_MULT[foodLevel][0], species.food[1] * FOOD_MULT[foodLevel][1]];
    var vet = [species.vet[0] * VET_MULT[vetLevel][0], species.vet[1] * VET_MULT[vetLevel][1]];

    var setupTotal = [species.purchase[0] + species.setup[0], species.purchase[1] + species.setup[1]];
    var yearly = [food[0] + species.supplies[0] + vet[0], food[1] + species.supplies[1] + vet[1]];
    if (firstPet) {
      setupTotal[0] += 75; setupTotal[1] += 150;
      yearly[0] += 60; yearly[1] += 120;
    }
    var firstYear = [setupTotal[0] + yearly[0], setupTotal[1] + yearly[1]];
    var lifeYears = species.lifespan.match(/\d+/g).map(Number);
    var avgLife = (lifeYears[0] + lifeYears[lifeYears.length - 1]) / 2;
    var lifetime = [setupTotal[0] + yearly[0] * avgLife, setupTotal[1] + yearly[1] * avgLife];

    var html = "<h3>" + species.emoji + " " + species.name + " — Cost Breakdown</h3>";
    html += '<div class="cost-row"><span>One-time setup (pet + habitat)</span><span>' + range(setupTotal[0], setupTotal[1]) + "</span></div>";
    html += '<div class="cost-row"><span>Food per year</span><span>' + range(food[0], food[1]) + "</span></div>";
    html += '<div class="cost-row"><span>Supplies &amp; habitat per year</span><span>' + range(species.supplies[0], species.supplies[1]) + "</span></div>";
    html += '<div class="cost-row"><span>Vet care per year</span><span>' + range(vet[0], vet[1]) + "</span></div>";
    html += '<div class="cost-row total"><span>Yearly total (after year 1)</span><span>' + range(yearly[0], yearly[1]) + "</span></div>";
    html += '<div class="cost-row total"><span>First-year total</span><span>' + range(firstYear[0], firstYear[1]) + "</span></div>";
    html += '<div class="cost-row"><span>Estimated lifetime (' + species.lifespan + ")</span><span>" + range(lifetime[0], lifetime[1]) + "</span></div>";
    html += "<p style='margin-top:14px'>💡 " + species.note + "</p>";
    html += '<p>⚠️ Estimates are USA averages for 2026. ' +
      '<a href="legality-checker.html">Check legality in your state</a> and read our ' +
      '<a href="../guides/exotic-pet-costs.html">full cost guide</a> before buying.</p>';

    box.innerHTML = html;
    box.classList.add("show");
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var sel = document.getElementById("species");
    if (sel) {
      DATA.forEach(function (d) {
        var opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = d.emoji + " " + d.name;
        sel.appendChild(opt);
      });
    }
    var btn = document.getElementById("calc-btn");
    if (btn) btn.addEventListener("click", calculate);
  });
})();
