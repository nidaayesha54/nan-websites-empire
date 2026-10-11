/* PuppyCareHub — daily puppy schedule generator */
(function () {
  "use strict";

  var PROFILES = {
    "8-12": {
      label: "8–12 weeks", pottyEveryMin: 120, meals: 4, mealTimes: ["breakfast", "lunch", "dinner", "latenight"],
      napMin: 110, playMin: 20, trainMin: 5, sleepHours: 19, note: "Tiny bladder, big sleep needs. Potty every 2 hours (plus after eating, playing, waking up)."
    },
    "12-16": {
      label: "3–4 months", pottyEveryMin: 180, meals: 3, mealTimes: ["breakfast", "lunch", "dinner"],
      napMin: 105, playMin: 25, trainMin: 8, sleepHours: 18, note: "Bladder control is growing. Potty roughly every 3 hours."
    },
    "16-24": {
      label: "4–6 months", pottyEveryMin: 240, meals: 3, mealTimes: ["breakfast", "lunch", "dinner"],
      napMin: 90, playMin: 30, trainMin: 10, sleepHours: 16, note: "Teething phase — stock chew toys. Potty about every 4 hours."
    },
    "24-52": {
      label: "6–12 months", pottyEveryMin: 300, meals: 2, mealTimes: ["breakfast", "dinner"],
      napMin: 75, playMin: 40, trainMin: 12, sleepHours: 14, note: "Almost a teenager! Potty every 5 hours, longer play sessions."
    }
  };

  var form = document.getElementById("schedule-form");
  var resultsEl = document.getElementById("schedule-results");

  function toMinutes(t) {
    var p = t.split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }
  function fmt(m) {
    m = ((m % 1440) + 1440) % 1440;
    var h = Math.floor(m / 60), mm = m % 60;
    var ap = h >= 12 ? "PM" : "AM";
    h = h % 12; if (h === 0) h = 12;
    return h + ":" + (mm < 10 ? "0" + mm : mm) + " " + ap;
  }

  function addEvent(list, time, cls, what, why) {
    list.push({ time: time, cls: cls, what: what, why: why });
  }

  function generate(age, wakeStr) {
    var p = PROFILES[age];
    var wake = toMinutes(wakeStr);
    var bedtime = wake + (24 - p.sleepHours) * 60; // awake hours after waking
    if (bedtime - wake < 12 * 60) bedtime = wake + 14 * 60; // sanity: at least 12-14 awake hrs
    var events = [];
    var t = wake;

    addEvent(events, t, "potty", "🚽 Wake-up potty", "First thing — carry your pup straight outside.");
    t += 20;
    addEvent(events, t, "feed", "🍽️ Breakfast", "Meal 1 of " + p.meals + ". Feed on a schedule, don't free-feed.");
    var lastPotty = t + 20;
    addEvent(events, lastPotty, "potty", "🚽 Potty after breakfast", "Puppies almost always need to go 15–20 min after eating.");
    t = lastPotty + 15;

    var mealIdx = 1; // breakfast done
    var dinnerTime = Math.min(wake + 11 * 60, bedtime - 3 * 60);
    var lunchTime = null, lateNightTime = null;
    if (p.meals === 3) { lunchTime = wake + 5.5 * 60; }
    if (p.meals === 4) { lunchTime = wake + 4.5 * 60; lateNightTime = bedtime - 1.5 * 60; }

    var mealTimes = { breakfast: true };
    var cycle = 0;

    while (t < bedtime - 45) {
      cycle++;
      // play / training block
      var label = cycle === 1 ? "🎾 Morning play + training" : (cycle === 2 ? "🎾 Play + socialization" : "🎾 Playtime");
      addEvent(events, t, "play", label, p.playMin + " min active play, " + p.trainMin + " min training (sit, name, recall).");
      t += p.playMin + p.trainMin;

      // check meal windows before next potty
      if (lunchTime && mealIdx === 1 && t >= lunchTime - 30) {
        addEvent(events, Math.max(t, lunchTime), "feed", "🍽️ Lunch", "Meal 2 of " + p.meals + ".");
        t = Math.max(t, lunchTime) + 20;
        mealIdx++;
      }
      if (lateNightTime && mealIdx === 2 && t >= lateNightTime - 30) {
        // handled later; keep order sane
      }

      // potty after play
      if (t + 10 < bedtime) addEvent(events, t + 10, "potty", "🚽 Potty break", "Always after play — excitement empties little bladders.");
      t += 20;

      // dinner window
      if (mealIdx < p.meals - (lateNightTime ? 1 : 0) && t >= dinnerTime - 45) {
        addEvent(events, Math.max(t, dinnerTime), "feed", "🍽️ Dinner", "Last big meal of the day — not too close to bedtime.");
        t = Math.max(t, dinnerTime) + 20;
        addEvent(events, t + 5, "potty", "🚽 Potty after dinner", "Give it 15–20 minutes, then straight outside.");
        t += 25;
        mealIdx++;
      }

      // nap
      if (t + p.napMin < bedtime - 30) {
        addEvent(events, t, "sleep", "😴 Enforced nap", "Crate nap for ~" + Math.round(p.napMin / 60 * 10) / 10 + " hr. Growing puppies need lots of sleep!");
        t += p.napMin;
        if (t < bedtime - 30) addEvent(events, t, "potty", "🚽 Potty after nap", "Wake-up = potty, every single time.");
        t += 15;
      } else {
        t += 30;
      }

      if (cycle > 8) break; // safety
    }

    // late-night meal for youngest pups
    if (lateNightTime && lateNightTime < bedtime - 30) {
      addEvent(events, lateNightTime, "feed", "🍽️ Late-night snack", "Meal 4 of 4 for very young pups (8–12 weeks).");
      addEvent(events, lateNightTime + 25, "potty", "🚽 Potty after snack", "Then settle down for the night.");
    }

    // wind down
    var windDown = bedtime - 60;
    addEvent(events, windDown, "play", "🧸 Calm wind-down", "Low-key chew toy or gentle petting. Pick up water ~2 hrs before bed.");
    addEvent(events, bedtime - 15, "potty", "🚽 Final bedtime potty", "Last chance! Keep it boring and calm — no play.");
    addEvent(events, bedtime, "sleep", "🌙 Bedtime in the crate", "Same spot every night. Young pups may need a midnight potty — that's normal.");

    // sort by time
    events.sort(function (a, b) { return a.time - b.time; });

    // dedupe near-identical times
    var deduped = [];
    events.forEach(function (e) {
      var last = deduped[deduped.length - 1];
      if (last && Math.abs(last.time - e.time) < 8 && last.what === e.what) return;
      deduped.push(e);
    });
    return { profile: p, events: deduped };
  }

  function render(age, wakeStr) {
    var out = generate(age, wakeStr);
    var p = out.profile;
    var html = '<div class="tip"><strong>🐶 ' + p.label + " plan</strong> — " + p.note
      + "<br>Sleep target: ~" + p.sleepHours + " hrs/day. Adjust potty breaks sooner if your pup has accidents — that's data, not failure!</div>";

    out.events.forEach(function (e) {
      html += '<div class="sched-block ' + e.cls + '">'
        + '<span class="time">' + fmt(e.time) + "</span>"
        + '<div><div class="what">' + e.what + '</div><div class="why">' + e.why + "</div></div>"
        + "</div>";
    });
    html += '<div class="warn"><strong>⚠️ Nighttime:</strong> puppies under 12 weeks often need 1–2 middle-of-the-night potty trips. Set an alarm every 3 hours the first week, then stretch it as they succeed.</div>';
    resultsEl.innerHTML = html;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var age = document.getElementById("puppy-age").value;
    var wake = document.getElementById("wake-time").value || "06:30";
    render(age, wake);
  });

  // initial render
  render("8-12", "06:30");
})();
