
(function () {
  "use strict";

  var BREAK_INTERVAL = { dog: 2.5, cat: 3.5, puppy: 1.75 }; // hours of driving between breaks
  var STOP_MINUTES = 20;

  function fmtTime(date) {
    var h = date.getHours(), m = date.getMinutes();
    var ap = h >= 12 ? "PM" : "AM";
    h = h % 12; if (h === 0) h = 12;
    return h + ":" + (m < 10 ? "0" + m : m) + " " + ap;
  }

  function fmtMiles(mi) {
    return Math.round(mi).toLocaleString("en-US") + " mi";
  }

  var TIPS = {
    dog: [
      "Feed a light meal 3–4 hours before departure, then feed at stops — never right before driving.",
      "Bring a chew toy or frozen Kong for restlessness between stops.",
      "Never leave your dog in a parked car — even 70°F outside can turn deadly in minutes.",
      "Book pet-friendly hotels in advance; many charge a $25–$75 pet fee per night."
    ],
    cat: [
      "Keep cats in a secured carrier while driving — loose cats under pedals are dangerous.",
      "Offer the litter box at every stop; most cats won't use it in a moving car.",
      "Cover the carrier with a light blanket to reduce visual stress, but keep airflow.",
      "Bring Feliway spray or a vet-approved calming aid for anxious cats."
    ],
    puppy: [
      "Young and senior pets need breaks every 1.5–2 hours — plan shorter driving days.",
      "Bring pee pads and enzyme cleaner; accidents happen even with trained pups.",
      "Keep to your pet's normal feeding schedule as closely as possible.",
      "Ask your vet about motion-sickness options before a long drive."
    ]
  };

  var form = document.getElementById("trip-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var distance = Math.max(20, Math.min(5000, parseFloat(document.getElementById("distance").value) || 400));
    var speed = Math.max(30, Math.min(80, parseFloat(document.getElementById("speed").value) || 60));
    var pet = form.querySelector('input[name="pet"]:checked').value;
    var startVal = document.getElementById("start").value || "08:00";

    var parts = startVal.split(":");
    var depart = new Date();
    depart.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);

    var interval = BREAK_INTERVAL[pet];
    var totalHours = distance / speed;
    var numStops = Math.max(1, Math.round(totalHours / interval));

    // Recompute spacing so stops are evenly distributed
    var legHours = totalHours / (numStops + 1);

    var stopsHtml = "";
    var now = new Date(depart.getTime());
    for (var i = 1; i <= numStops; i++) {
      now = new Date(now.getTime() + legHours * 3600000);
      var mileMark = (distance / (numStops + 1)) * i;
      stopsHtml +=
        '<div class="stop-card"><strong>🛑 Stop ' + i + " — " + fmtTime(now) + "</strong> (around " + fmtMiles(mileMark) + ")" +
        "<br>💧 Water break &nbsp;•&nbsp; 🚶 10–15 min walk &nbsp;•&nbsp; 🚻 Potty break" +
        (i === Math.ceil(numStops / 2) ? "<br>🍖 <em>Meal stop — feed half a normal meal, rest 30 min before driving.</em>" : "") +
        "</div>";
      now = new Date(now.getTime() + STOP_MINUTES * 60000);
    }
    var arrival = new Date(depart.getTime() + totalHours * 3600000 + numStops * STOP_MINUTES * 60000);

    var petLabel = pet === "dog" ? "dog" : (pet === "cat" ? "cat" : "puppy/senior pet");

    document.getElementById("trip-title").textContent =
      "🗺️ " + fmtMiles(distance) + " Road Trip With Your " + petLabel.charAt(0).toUpperCase() + petLabel.slice(1);
    document.getElementById("trip-summary").innerHTML =
      "Drive time ≈ <strong>" + totalHours.toFixed(1) + " hrs</strong> at " + speed + " mph. " +
      "Planned <strong>" + numStops + " break" + (numStops === 1 ? "" : "s") + "</strong> (" + STOP_MINUTES + " min each). " +
      "Estimated arrival: <strong>" + fmtTime(arrival) + "</strong>.";

    document.getElementById("stops").innerHTML = stopsHtml;

    var tipsHtml = "";
    TIPS[pet].forEach(function (t) {
      tipsHtml += '<div class="tip">✅ ' + t + "</div>";
    });
    tipsHtml += '<div class="warn">⚠️ <strong>Heat warning:</strong> On warm days, park in shade, crack windows, and never leave your pet alone in the car for more than a couple of minutes.</div>';
    document.getElementById("tips").innerHTML = tipsHtml;

    var res = document.getElementById("result");
    res.classList.add("show");
    res.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
