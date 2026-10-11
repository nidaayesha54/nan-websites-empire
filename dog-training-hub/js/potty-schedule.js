/* DogTrainingHub — puppy potty schedule generator */
(function () {
  'use strict';

  function parseTime(str) {
    var m = String(str).trim().match(/^(\d{1,2})(?::(\d{2}))?\s*([aApP])\.?\s*[mM]\.?$/);
    if (!m) return null;
    var h = parseInt(m[1], 10);
    var min = m[2] ? parseInt(m[2], 10) : 0;
    var ap = m[3].toLowerCase();
    if (h < 1 || h > 12 || min > 59) return null;
    if (ap === 'p' && h !== 12) h += 12;
    if (ap === 'a' && h === 12) h = 0;
    return h * 60 + min;
  }

  function fmt(mins) {
    mins = ((mins % 1440) + 1440) % 1440;
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    var ap = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return h12 + ':' + (m < 10 ? '0' + m : m) + ' ' + ap;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function buildSchedule(ageWeeks, wakeMin, bedMin) {
    var months = ageWeeks / 4.345;
    var holdHrs = Math.min(Math.max(Math.floor(months) + 1, 2), 8);

    var events = [];
    function add(mins, what) {
      events.push({ t: mins, what: what });
    }

    // Daytime: potty every holdHrs from wake to bedtime
    var t = wakeMin;
    var first = true;
    while (t <= bedMin) {
      add(t, first ? '☀️ Morning potty — immediately after waking' : '🚻 Scheduled potty break');
      first = false;
      t += holdHrs * 60;
    }

    // Meal-anchored trips (assume meals at wake+30min, midday, evening)
    var breakfast = wakeMin + 30;
    var lunch = wakeMin + Math.round((bedMin - wakeMin) / 2);
    var dinner = bedMin - 180;
    add(breakfast + 15, '🍽️ Potty 15 min after breakfast');
    add(lunch + 15, '🍽️ Potty 15 min after lunch');
    add(dinner + 15, '🍽️ Potty 15 min after dinner');
    // After-play / after-nap anchors
    add(wakeMin + 120, '🎾 Potty after morning play session');
    add(lunch + 120, '😴 Potty after afternoon nap');

    // Last call before bed
    add(bedMin - 15, '🌙 Last potty before bed');

    // Night breaks for young puppies
    var nightBreaks = 0;
    if (ageWeeks < 12) nightBreaks = 2;
    else if (ageWeeks < 16) nightBreaks = 1;
    for (var n = 1; n <= nightBreaks; n++) {
      add(bedMin + n * holdHrs * 60, '🌃 Night potty break #' + n + ' (set an alarm — no playing!)');
    }

    events.sort(function (a, b) { return a.t - b.t; });

    // Dedupe times closer than 20 minutes apart (keep the more specific one)
    var clean = [];
    for (var i = 0; i < events.length; i++) {
      var prev = clean[clean.length - 1];
      if (prev && Math.abs(events[i].t - prev.t) < 20) {
        if (events[i].what.length > prev.what.length) clean[clean.length - 1] = events[i];
      } else {
        clean.push(events[i]);
      }
    }
    return { rows: clean, holdHrs: holdHrs, nightBreaks: nightBreaks };
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('potty-form');
    var result = document.getElementById('potty-result');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ageWeeks = parseInt(document.getElementById('puppy-age').value, 10);
      var wakeMin = parseTime(document.getElementById('wake-time').value);
      var bedMin = parseTime(document.getElementById('bed-time').value);

      if (wakeMin === null || bedMin === null) {
        result.innerHTML = '<div class="warn"><strong>⚠️ Oops!</strong> Please enter times like <em>7:00 AM</em> and <em>10:30 PM</em>.</div>';
        return;
      }
      if (bedMin <= wakeMin) bedMin += 1440; // bedtime after midnight edge case

      var s = buildSchedule(ageWeeks, wakeMin, bedMin);
      var html = '';
      html += '<div class="tool-form" style="border-left:6px solid var(--green)">';
      html += '<h2 style="color:var(--green-dark);margin-bottom:8px">⏰ Daily Potty Schedule</h2>';
      html += '<p>For a <strong>' + ageWeeks + '-week-old puppy</strong>: maximum hold time ≈ <strong>every ' +
        s.holdHrs + ' hours</strong>.' + (s.nightBreaks ? ' Includes <strong>' + s.nightBreaks + ' night break' + (s.nightBreaks > 1 ? 's' : '') + '</strong> — young bladders need it!' : ' No night breaks needed at this age — great progress!') + '</p>';
      html += '</div>';

      html += '<table class="schedule"><thead><tr><th>Time</th><th>What to do</th></tr></thead><tbody>';
      for (var i = 0; i < s.rows.length; i++) {
        html += '<tr><td><strong>' + esc(fmt(s.rows[i].t)) + '</strong></td><td>' + esc(s.rows[i].what) + '</td></tr>';
      }
      html += '</tbody></table>';

      html += '<div class="tip"><strong>💡 Potty training rules that make this work:</strong><ul>' +
        '<li>Reward outdoor success <strong>within 3 seconds</strong> — a treat right there on the grass.</li>' +
        '<li>Same spot every time — the smell says "bathroom here".</li>' +
        '<li>Supervise or confine. If you cannot watch the puppy, crate or pen them.</li>' +
        '<li>Never punish accidents — clean with enzymatic cleaner and tighten the schedule.</li>' +
        '<li>Watch for signals: sniffing, circling, squatting = sprint outside immediately.</li>' +
        '</ul></div>';
      html += '<p class="text-center mt"><button type="button" class="btn btn-green" onclick="window.print()">🖨️ Print My Schedule</button></p>';

      result.innerHTML = html;
      result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
