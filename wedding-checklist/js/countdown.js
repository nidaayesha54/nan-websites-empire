// WeddingChecklistHQ — Wedding Countdown
// Live countdown + smart milestone reminders based on time remaining.

var timerId = null;

function milestoneFor(msLeft) {
  var days = msLeft / 86400000;
  var months = days / 30.44;
  if (months >= 12) return { t: "You're ahead of the game ✨", d: "Start with the big three: budget, guest list draft, and venue research. Use our <a href='timeline-planner.html'>timeline planner</a> to map every month." };
  if (months >= 9) return { t: "Book the big vendors NOW", d: "Venues and photographers book 9–12 months out. This is your highest-priority window — don't let it slip." };
  if (months >= 6) return { t: "Food, flowers & music time", d: "Lock in your caterer, florist, and DJ/band. Order the dress — alterations need months." };
  if (months >= 4) return { t: "Details & paper", d: "Order invitations, book transportation, buy the bands, and plan the honeymoon." };
  if (months >= 2) return { t: "Finalize everything", d: "Mail invitations (8 weeks out is standard), do final fittings, and plan ceremony details." };
  if (months >= 1) return { t: "One month to go!", d: "Final headcount, seating chart, vendor confirmations, marriage license. Almost there!" };
  return { t: "Wedding week mode 💛", d: "Rehearse, delegate day-of tasks, confirm vendor meals, and get some rest. You've done the work — now enjoy it." };
}

function updateCountdown() {
  var dateVal = document.getElementById("wedding-date").value;
  var out = document.getElementById("countdown-output");
  if (!dateVal) return;

  var wedding = new Date(dateVal + "T12:00:00").getTime();
  var now = Date.now();
  var diff = wedding - now;

  if (diff <= 0) {
    clearInterval(timerId); timerId = null;
    out.innerHTML = '<div class="result-box" style="text-align:center;">' +
      '<p class="result-big">🎉 Congratulations!</p>' +
      '<p>Your wedding day has arrived (or passed). Wishing you a lifetime of happiness!</p></div>';
    document.getElementById("milestone").innerHTML = "";
    return;
  }

  var days = Math.floor(diff / 86400000);
  var hours = Math.floor((diff % 86400000) / 3600000);
  var mins = Math.floor((diff % 3600000) / 60000);
  var secs = Math.floor((diff % 60000) / 1000);

  out.innerHTML =
    '<div class="countdown-grid">' +
    '<div class="countdown-cell"><span class="num">' + days + '</span><span class="lbl">Days</span></div>' +
    '<div class="countdown-cell"><span class="num">' + hours + '</span><span class="lbl">Hours</span></div>' +
    '<div class="countdown-cell"><span class="num">' + mins + '</span><span class="lbl">Minutes</span></div>' +
    '<div class="countdown-cell"><span class="num">' + secs + '</span><span class="lbl">Seconds</span></div>' +
    '</div>';

  var m = milestoneFor(diff);
  document.getElementById("milestone").innerHTML =
    '<div class="milestone"><strong>' + m.t + '</strong><br>' + m.d + '</div>';

  try { localStorage.setItem("wchq-countdown-date", dateVal); } catch (e) {}
}

function startCountdown() {
  var dateVal = document.getElementById("wedding-date").value;
  if (!dateVal) {
    document.getElementById("countdown-output").innerHTML =
      '<div class="result-box"><p>👆 Pick your wedding date to start the countdown.</p></div>';
    return;
  }
  if (timerId) clearInterval(timerId);
  updateCountdown();
  timerId = setInterval(updateCountdown, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("start-btn").addEventListener("click", startCountdown);
  document.getElementById("wedding-date").addEventListener("change", startCountdown);
  try {
    var saved = localStorage.getItem("wchq-countdown-date");
    if (saved) {
      document.getElementById("wedding-date").value = saved;
      startCountdown();
    }
  } catch (e) {}
});
