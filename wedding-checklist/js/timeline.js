// WeddingChecklistHQ — Timeline Planner
// Wedding date -> month-by-month checklist, checkboxes saved to localStorage.

var PHASES = [
  {
    id: "p12",
    title: "12+ Months Out: Lock the Foundation",
    monthsBefore: [12, 24],
    tasks: [
      "Set your total wedding budget (and who contributes what)",
      "Draft your guest list — this drives venue size and cost",
      "Choose your wedding party and ask them",
      "Research venues and tour your top 3",
      "Decide: hire a wedding planner or go DIY?",
      "Pick 2–3 possible wedding dates for venue flexibility"
    ]
  },
  {
    id: "p9",
    title: "9–11 Months Out: Book the Big Vendors",
    monthsBefore: [9, 11],
    tasks: [
      "Book your venue and sign the contract",
      "Book your photographer (and videographer)",
      "Start wedding dress shopping — orders take 6–8 months",
      "Create your wedding registry",
      "Plan your engagement party",
      "Research and book your officiant"
    ]
  },
  {
    id: "p6",
    title: "6–8 Months Out: Food, Flowers & Music",
    monthsBefore: [6, 8],
    tasks: [
      "Book your caterer and schedule a tasting",
      "Book your florist — bring inspiration photos",
      "Book your DJ or band",
      "Order your wedding dress (alterations need months)",
      "Shop for bridesmaid dresses and suits",
      "Block hotel rooms for out-of-town guests",
      "Launch your wedding website with key details"
    ]
  },
  {
    id: "p4",
    title: "4–5 Months Out: Details & Paper",
    monthsBefore: [4, 5],
    tasks: [
      "Order your wedding invitations",
      "Book transportation (limo, shuttle, getaway car)",
      "Buy wedding bands",
      "Book your honeymoon (flights + hotel)",
      "Schedule cake tasting and order the cake",
      "Buy wedding party gifts"
    ]
  },
  {
    id: "p2",
    title: "2–3 Months Out: Finalize Everything",
    monthsBefore: [2, 3],
    tasks: [
      "Mail your invitations (8 weeks before is standard)",
      "Final dress fitting — bring your shoes and undergarments",
      "Book hair and makeup trial",
      "Plan ceremony details: readings, vows, music cues",
      "Order favors and welcome-bag items",
      "Apply for your marriage license (check your state's waiting period)"
    ]
  },
  {
    id: "p1",
    title: "1 Month Out: Confirm & Count Down",
    monthsBefore: [1, 1],
    tasks: [
      "Give final headcount to your caterer and venue",
      "Create your seating chart",
      "Confirm arrival times with every vendor",
      "Pick up your marriage license if you haven't yet",
      "Prepare tip envelopes for vendors",
      "Pack for the honeymoon and confirm travel documents"
    ]
  },
  {
    id: "p0",
    title: "Wedding Week: Breathe & Celebrate",
    monthsBefore: [0, 0],
    tasks: [
      "Hold your rehearsal and rehearsal dinner",
      "Delegate day-of tasks (someone holds the rings, the tips, the timeline)",
      "Confirm vendor meals count with caterer",
      "Charge your phone, lay out outfits, get sleep",
      "Eat breakfast on the wedding day — seriously",
      "Have the best day of your life 💛"
    ]
  }
];

var STORE_KEY = "wchq-timeline-v1";

function monthName(d) {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function addMonths(date, n) {
  var d = new Date(date.getTime());
  d.setMonth(d.getMonth() + n);
  return d;
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) { /* storage unavailable */ }
}

function buildTimeline() {
  var dateVal = document.getElementById("wedding-date").value;
  var out = document.getElementById("timeline-output");
  var progWrap = document.getElementById("progress-wrap");

  if (!dateVal) {
    out.innerHTML = '<div class="result-box"><p>👆 Pick your wedding date above to generate your personalized timeline.</p></div>';
    progWrap.style.display = "none";
    return;
  }

  var wedding = new Date(dateVal + "T12:00:00");
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  if (wedding <= today) {
    out.innerHTML = '<div class="result-box"><p>That date is in the past — pick a future wedding date to build your timeline. 💛</p></div>';
    progWrap.style.display = "none";
    return;
  }

  var state = loadState();
  var total = 0, done = 0;
  var html = "";

  PHASES.forEach(function (phase, pi) {
    // Calendar label: wedding minus the midpoint of the phase window
    var mid = Math.round((phase.monthsBefore[0] + phase.monthsBefore[1]) / 2);
    var phaseDate = addMonths(wedding, -mid);
    var isPast = phaseDate < today && phase.id !== "p0";
    var label = phase.id === "p0" ? monthName(wedding) : "around " + monthName(phaseDate);

    html += '<div class="checklist-group">';
    html += '<h3>' + phase.title + '</h3>';
    html += '<p style="color:#6b7168;font-size:.95rem;margin:-6px 0 12px;">' + label +
      (isPast ? ' · <strong>catch up on these now</strong>' : '') + '</p>';
    html += '<ul>';

    phase.tasks.forEach(function (task, ti) {
      var key = phase.id + "-" + ti;
      var checked = !!state[key];
      total++; if (checked) done++;
      html += '<li class="' + (checked ? 'done' : '') + '">' +
        '<input type="checkbox" data-key="' + key + '"' + (checked ? ' checked' : '') + '>' +
        '<span>' + task + '</span></li>';
    });

    html += '</ul></div>';
  });

  out.innerHTML = html;
  progWrap.style.display = "block";
  updateProgress(total, done);

  // Wire checkboxes
  out.querySelectorAll('input[type="checkbox"]').forEach(function (box) {
    box.addEventListener("change", function () {
      var s = loadState();
      if (box.checked) { s[box.dataset.key] = 1; } else { delete s[box.dataset.key]; }
      saveState(s);
      box.closest("li").classList.toggle("done", box.checked);
      var t = out.querySelectorAll('input[type="checkbox"]').length;
      var d = out.querySelectorAll('input[type="checkbox"]:checked').length;
      updateProgress(t, d);
    });
  });
}

function updateProgress(total, done) {
  var pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("progress-text").textContent =
    done + " of " + total + " tasks complete (" + pct + "%) — you've got this!";
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("wedding-date").addEventListener("change", buildTimeline);
  document.getElementById("build-btn").addEventListener("click", buildTimeline);
  document.getElementById("reset-btn").addEventListener("click", function () {
    if (confirm("Clear all your checklist progress?")) {
      localStorage.removeItem(STORE_KEY);
      buildTimeline();
    }
  });
});
