/* Pet-Match Quiz engine — scores 12 exotic pets against 6 quiz answers */
(function () {
  "use strict";

  var PETS = [
    { name: "Leopard Gecko", emoji: "🦎", category: "Reptile",
      space: "small", budget: "low", exp: "none", time: "low", noise: "quiet", handle: "hold",
      lifespan: "15–20 years", note: "Docile, hardy, and quiet — the classic beginner reptile. Needs a heated 20-gallon terrarium and insects a few times a week." },
    { name: "Bearded Dragon", emoji: "🦎", category: "Reptile",
      space: "medium", budget: "mid", exp: "none", time: "mid", noise: "quiet", handle: "hold",
      lifespan: "10–15 years", note: "Friendly, interactive, and loves basking. Needs UVB lighting and daily salads plus insects; a 40+ gallon tank." },
    { name: "Ball Python", emoji: "🐍", category: "Reptile",
      space: "small", budget: "mid", exp: "some", time: "low", noise: "quiet", handle: "hold",
      lifespan: "20–30 years", note: "Calm, beautiful, and low-maintenance once set up. Eats frozen rodents weekly and can fast for weeks without worry." },
    { name: "Red-Eared Slider", emoji: "🐢", category: "Reptile",
      space: "medium", budget: "mid", exp: "some", time: "mid", noise: "quiet", handle: "watch",
      lifespan: "20–40 years", note: "Charming aquatic turtle with a very long commitment. Needs a large filtered tank, basking lamp, and UVB." },
    { name: "Budgie (Parakeet)", emoji: "🦜", category: "Bird",
      space: "small", budget: "low", exp: "none", time: "mid", noise: "some", handle: "bond",
      lifespan: "8–15 years", note: "Cheerful, social, and cheap to keep. Learns to mimic, loves company — best kept with daily interaction or a buddy." },
    { name: "Cockatiel", emoji: "🦜", category: "Bird",
      space: "medium", budget: "mid", exp: "none", time: "high", noise: "some", handle: "bond",
      lifespan: "15–25 years", note: "Affectionate whistler that bonds deeply. Needs a roomy cage, daily out-of-cage time, and plenty of attention." },
    { name: "Green-Cheeked Conure", emoji: "🦜", category: "Bird",
      space: "medium", budget: "high", exp: "some", time: "high", noise: "loud", handle: "bond",
      lifespan: "20–30 years", note: "Clownish, cuddly parrot with a big personality — and a loud voice. Not for apartments or beginners short on time." },
    { name: "Hedgehog", emoji: "🦔", category: "Small Mammal",
      space: "small", budget: "mid", exp: "some", time: "mid", noise: "quiet", handle: "hold",
      lifespan: "4–7 years", note: "Adorable, quiet, and nocturnal. Needs a warm enclosure (they get sick if cold) and patient socialization." },
    { name: "Sugar Glider", emoji: "🐿️", category: "Small Mammal",
      space: "medium", budget: "high", exp: "expert", time: "high", noise: "some", handle: "bond",
      lifespan: "12–15 years", note: "Bonded-for-life pocket pets that glide and cuddle — but they are demanding, social, and often need to be kept in pairs." },
    { name: "Chinchilla", emoji: "🐭", category: "Small Mammal",
      space: "medium", budget: "mid", exp: "some", time: "mid", noise: "quiet", handle: "watch",
      lifespan: "15–20 years", note: "Incredibly soft, clean, and odorless. Needs a cool room, tall cage, and dust baths — but minimal daily handling." },
    { name: "Ferret", emoji: "🐹", category: "Small Mammal",
      space: "large", budget: "mid", exp: "some", time: "high", noise: "some", handle: "bond",
      lifespan: "6–10 years", note: "Playful, mischievous, and endlessly entertaining. Needs hours of supervised play and a ferret-proofed home." },
    { name: "Betta Fish", emoji: "🐠", category: "Fish",
      space: "small", budget: "low", exp: "none", time: "low", noise: "quiet", handle: "watch",
      lifespan: "3–5 years", note: "Stunning, low-cost, and perfect for desks. Needs a heated 5+ gallon tank (not a bowl) and weekly water changes." }
  ];

  var RANK = { small: 1, medium: 2, large: 3, low: 1, mid: 2, high: 3, none: 1, some: 2, expert: 3, quiet: 1, watch: 1, hold: 2, bond: 3 };

  function scorePet(pet, answers) {
    var score = 0, max = 0;
    var keys = ["space", "budget", "exp", "time", "noise", "handle"];
    keys.forEach(function (key) {
      max += 3;
      var p = RANK[pet[key]], a = RANK[answers[key]];
      var diff = Math.abs(p - a);
      if (key === "exp") {
        // expert pets are hard for beginners; beginners should not get expert pets
        if (a === 1 && p === 3) { score += 0; return; }
        if (a === 3 && p === 1) { score += 2; return; }
      }
      if (key === "budget" || key === "space" || key === "time") {
        // user with high resources can keep a low-needs pet, but not the reverse
        if (a >= p) { score += 3; return; }
        score += Math.max(0, 3 - (p - a) * 2);
        return;
      }
      score += Math.max(0, 3 - diff);
    });
    return Math.round((score / max) * 100);
  }

  function onSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var answers = {};
    var keys = ["space", "budget", "exp", "time", "noise", "handle"];
    for (var i = 0; i < keys.length; i++) {
      var el = form.querySelector('input[name="' + keys[i] + '"]:checked');
      if (!el) { alert("Please answer all 6 questions to get your matches."); return; }
      answers[keys[i]] = el.value;
    }
    var ranked = PETS.map(function (pet) {
      return { pet: pet, score: scorePet(pet, answers) };
    }).sort(function (a, b) { return b.score - a.score; });

    var top = ranked.slice(0, 3);
    var html = "<h3>Your Top 3 Matches 🎉</h3>";
    top.forEach(function (item, idx) {
      var pet = item.pet;
      html += '<div class="match"><div class="emoji">' + pet.emoji + "</div><div>" +
        '<span class="score">#' + (idx + 1) + " · " + item.score + "% match</span>" +
        "<strong>" + pet.name + "</strong> <em>(" + pet.category + " · lives " + pet.lifespan + ")</em>" +
        "<p>" + pet.note + "</p>" +
        '<div class="bar"><div style="width:' + item.score + '%"></div></div>' +
        "</div></div>";
    });
    var low = ranked[ranked.length - 1];
    html += "<p><strong>Least suited:</strong> " + low.pet.emoji + " " + low.pet.name +
      " (" + low.score + "% match) — " + low.pet.note + "</p>";
    html += '<p>⚠️ Always <a href="legality-checker.html">check your state\'s laws</a> before buying, and ' +
      '<a href="care-cost.html">estimate yearly costs</a> for your match.</p>';

    var box = document.getElementById("quiz-result");
    box.innerHTML = html;
    box.classList.add("show");
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("quiz-form");
    if (form) form.addEventListener("submit", onSubmit);
  });
})();
