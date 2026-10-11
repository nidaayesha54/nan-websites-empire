/* Weekly match schedule planner.
   Fixture templates are editorial templates updated daily — NOT live fixtures.
   Users can pick a league, view the week's template, and export to .ics. */
(function () {
  'use strict';

  // Editorial fixture TEMPLATES (updated daily). Kickoff times shown in local time.
  var SCHEDULES = {
    'premier-league': {
      name: 'Premier League',
      note: 'Typical weekend slot pattern — confirm kickoffs with the official league site.',
      fixtures: [
        { home: 'Arsenal', away: 'Chelsea', day: 'Saturday', time: '17:30' },
        { home: 'Liverpool', away: 'Tottenham Hotspur', day: 'Saturday', time: '20:00' },
        { home: 'Manchester City', away: 'Newcastle United', day: 'Sunday', time: '14:00' },
        { home: 'Manchester United', away: 'Everton', day: 'Sunday', time: '16:30' },
        { home: 'Aston Villa', away: 'Brighton', day: 'Monday', time: '20:00' }
      ]
    },
    'la-liga': {
      name: 'La Liga',
      note: 'Typical weekend slot pattern — confirm kickoffs with the official league site.',
      fixtures: [
        { home: 'Real Madrid', away: 'Sevilla', day: 'Saturday', time: '18:30' },
        { home: 'Barcelona', away: 'Valencia', day: 'Saturday', time: '21:00' },
        { home: 'Atlético Madrid', away: 'Real Sociedad', day: 'Sunday', time: '18:30' },
        { home: 'Villarreal', away: 'Athletic Club', day: 'Sunday', time: '21:00' }
      ]
    },
    'bundesliga': {
      name: 'Bundesliga',
      note: 'Typical weekend slot pattern — confirm kickoffs with the official league site.',
      fixtures: [
        { home: 'Bayern Munich', away: 'Borussia Dortmund', day: 'Saturday', time: '18:30' },
        { home: 'RB Leipzig', away: 'Bayer Leverkusen', day: 'Saturday', time: '15:30' },
        { home: 'Stuttgart', away: 'Eintracht Frankfurt', day: 'Sunday', time: '17:30' }
      ]
    },
    'serie-a': {
      name: 'Serie A',
      note: 'Typical weekend slot pattern — confirm kickoffs with the official league site.',
      fixtures: [
        { home: 'Inter', away: 'Juventus', day: 'Sunday', time: '20:45' },
        { home: 'Napoli', away: 'Roma', day: 'Saturday', time: '20:45' },
        { home: 'AC Milan', away: 'Atalanta', day: 'Saturday', time: '18:00' }
      ]
    },
    'ligue-1': {
      name: 'Ligue 1',
      note: 'Typical weekend slot pattern — confirm kickoffs with the official league site.',
      fixtures: [
        { home: 'PSG', away: 'Marseille', day: 'Sunday', time: '20:45' },
        { home: 'Monaco', away: 'Lyon', day: 'Saturday', time: '21:05' },
        { home: 'Lille', away: 'Nice', day: 'Friday', time: '20:45' }
      ]
    }
  };

  var leagueSel = document.getElementById('league-select');
  var listEl = document.getElementById('fixture-list');
  var noteEl = document.getElementById('schedule-note');
  var btn = document.getElementById('ics-btn');

  function dayOffset(day) {
    // Offset (days) from the coming Friday to place fixtures in the .ics week.
    var map = { Friday: 0, Saturday: 1, Sunday: 2, Monday: 3, Tuesday: 4, Wednesday: 5, Thursday: 6 };
    return map[day] || 1;
  }

  function nextFriday() {
    var d = new Date();
    var diff = (5 - d.getDay() + 7) % 7; // 5 = Friday
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function render() {
    var key = leagueSel.value;
    var s = SCHEDULES[key];
    noteEl.textContent = s.note;
    listEl.innerHTML = s.fixtures.map(function (f) {
      return '<div class="match-card"><div class="teams">' + esc(f.home) + ' vs ' + esc(f.away) +
        '</div><div class="kickoff">' + esc(f.day) + ' · ' + esc(f.time) + ' (local template)</div></div>';
    }).join('');
    btn.disabled = false;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function downloadICS() {
    var key = leagueSel.value;
    var s = SCHEDULES[key];
    var friday = nextFriday();
    var stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//FootballScoresHub//Schedule//EN'];
    s.fixtures.forEach(function (f, i) {
      var d = new Date(friday.getTime() + dayOffset(f.day) * 86400000);
      var parts = f.time.split(':');
      d.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
      var end = new Date(d.getTime() + 105 * 60000); // ~105 min match
      function icsT(x) {
        return x.getFullYear() + pad(x.getMonth() + 1) + pad(x.getDate()) + 'T' +
          pad(x.getHours()) + pad(x.getMinutes()) + '00';
      }
      lines.push('BEGIN:VEVENT');
      lines.push('UID:' + Date.now() + '-' + i + '@footballscoreshub');
      lines.push('DTSTAMP:' + stamp);
      lines.push('DTSTART:' + icsT(d));
      lines.push('DTEND:' + icsT(end));
      lines.push('SUMMARY:' + f.home + ' vs ' + f.away + ' (' + s.name + ')');
      lines.push('DESCRIPTION:Fixture template from FootballScoresHub — confirm kickoff time with the official league site.');
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');

    var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = key + '-schedule.ics';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  leagueSel.addEventListener('change', render);
  btn.addEventListener('click', downloadICS);
  render();
})();
