/* Interactive league table tool.
   Tables are editorial SNAPSHOTS updated daily — NOT live standings.
   Includes a points simulator: enter hypothetical results and see the table change. */
(function () {
  'use strict';

  // Snapshot data (updated daily). Pos order here reflects the snapshot date.
  var TABLES = {
    'premier-league': {
      name: 'Premier League', updated: '2026-10-11',
      teams: [
        { t: 'Arsenal', p: 7, w: 5, d: 1, l: 1, gd: 11 },
        { t: 'Liverpool', p: 7, w: 5, d: 0, l: 2, gd: 7 },
        { t: 'Manchester City', p: 7, w: 4, d: 2, l: 1, gd: 10 },
        { t: 'Tottenham Hotspur', p: 7, w: 4, d: 1, l: 2, gd: 8 },
        { t: 'Chelsea', p: 7, w: 3, d: 2, l: 2, gd: 4 },
        { t: 'Aston Villa', p: 7, w: 3, d: 1, l: 3, gd: 1 },
        { t: 'Newcastle United', p: 7, w: 2, d: 3, l: 2, gd: 2 },
        { t: 'Manchester United', p: 7, w: 2, d: 2, l: 3, gd: -1 }
      ]
    },
    'la-liga': {
      name: 'La Liga', updated: '2026-10-11',
      teams: [
        { t: 'Real Madrid', p: 8, w: 7, d: 0, l: 1, gd: 14 },
        { t: 'Barcelona', p: 8, w: 6, d: 1, l: 1, gd: 16 },
        { t: 'Atlético Madrid', p: 8, w: 5, d: 2, l: 1, gd: 8 },
        { t: 'Villarreal', p: 8, w: 4, d: 2, l: 2, gd: 5 },
        { t: 'Real Sociedad', p: 8, w: 3, d: 3, l: 2, gd: 2 }
      ]
    },
    'bundesliga': {
      name: 'Bundesliga', updated: '2026-10-11',
      teams: [
        { t: 'Bayern Munich', p: 6, w: 6, d: 0, l: 0, gd: 20 },
        { t: 'RB Leipzig', p: 6, w: 4, d: 1, l: 1, gd: 7 },
        { t: 'Bayer Leverkusen', p: 6, w: 3, d: 2, l: 1, gd: 5 },
        { t: 'Borussia Dortmund', p: 6, w: 3, d: 1, l: 2, gd: 3 },
        { t: 'Stuttgart', p: 6, w: 2, d: 2, l: 2, gd: 0 }
      ]
    },
    'serie-a': {
      name: 'Serie A', updated: '2026-10-11',
      teams: [
        { t: 'Inter', p: 6, w: 5, d: 0, l: 1, gd: 9 },
        { t: 'Napoli', p: 6, w: 4, d: 1, l: 1, gd: 6 },
        { t: 'Juventus', p: 6, w: 3, d: 3, l: 0, gd: 5 },
        { t: 'AC Milan', p: 6, w: 3, d: 2, l: 1, gd: 4 },
        { t: 'Roma', p: 6, w: 3, d: 1, l: 2, gd: 1 }
      ]
    },
    'ligue-1': {
      name: 'Ligue 1', updated: '2026-10-11',
      teams: [
        { t: 'PSG', p: 7, w: 6, d: 1, l: 0, gd: 15 },
        { t: 'Marseille', p: 7, w: 4, d: 2, l: 1, gd: 6 },
        { t: 'Monaco', p: 7, w: 4, d: 1, l: 2, gd: 4 },
        { t: 'Lille', p: 7, w: 3, d: 2, l: 2, gd: 2 },
        { t: 'Lyon', p: 7, w: 2, d: 3, l: 2, gd: 0 }
      ]
    }
  };

  var leagueSel = document.getElementById('league-select');
  var tableWrap = document.getElementById('table-wrap');
  var updatedEl = document.getElementById('updated-label');
  var sortState = { key: null, dir: 1 };
  var simResults = []; // applied hypothetical results

  function points(row) { return row.w * 3 + row.d; }

  function sortedTeams(teams) {
    var arr = teams.slice();
    if (!sortState.key) {
      arr.sort(function (a, b) { return points(b) - points(a) || b.gd - a.gd; });
    } else {
      arr.sort(function (a, b) {
        var va = sortState.key === 'pts' ? points(a) : a[sortState.key];
        var vb = sortState.key === 'pts' ? points(b) : b[sortState.key];
        if (typeof va === 'string') return va.localeCompare(vb) * sortState.dir;
        return (va - vb) * sortState.dir;
      });
    }
    return arr;
  }

  function render() {
    var key = leagueSel.value;
    var data = TABLES[key];
    updatedEl.textContent = 'Snapshot updated: ' + data.updated + ' — updated daily, not live.';
    var rows = sortedTeams(data.teams).map(function (r, i) {
      return '<tr><td>' + (i + 1) + '</td><td>' + esc(r.t) + '</td><td>' + r.p + '</td>' +
        '<td>' + r.w + '</td><td>' + r.d + '</td><td>' + r.l + '</td><td>' + r.gd + '</td>' +
        '<td><strong>' + points(r) + '</strong></td></tr>';
    }).join('');
    tableWrap.innerHTML =
      '<table class="score"><thead><tr>' +
      '<th>#</th><th class="sortable" data-k="t">Team ↕</th>' +
      '<th class="sortable" data-k="p">P ↕</th><th class="sortable" data-k="w">W ↕</th>' +
      '<th class="sortable" data-k="d">D ↕</th><th class="sortable" data-k="l">L ↕</th>' +
      '<th class="sortable" data-k="gd">GD ↕</th><th class="sortable" data-k="pts">Pts ↕</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table>';
    tableWrap.querySelectorAll('th.sortable').forEach(function (th) {
      th.addEventListener('click', function () {
        var k = th.getAttribute('data-k');
        if (sortState.key === k) sortState.dir *= -1;
        else { sortState.key = k; sortState.dir = -1; }
        render();
      });
    });
    buildSimulator(key);
  }

  function buildSimulator(key) {
    var teams = TABLES[key].teams;
    var opts = teams.map(function (r) { return '<option>' + esc(r.t) + '</option>'; }).join('');
    document.getElementById('sim-home').innerHTML = opts;
    document.getElementById('sim-away').innerHTML = opts;
    document.getElementById('sim-away').selectedIndex = 1;
    simResults = [];
    renderSimList(key);
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function applySim(home, away, hg, ag) {
    var teams = TABLES[leagueSel.value].teams;
    var h = teams.find(function (r) { return r.t === home; });
    var a = teams.find(function (r) { return r.t === away; });
    if (!h || !a || h === a) return;
    h.p++; a.p++;
    if (hg > ag) { h.w++; a.l++; h.gd += (hg - ag); a.gd -= (hg - ag); }
    else if (hg < ag) { a.w++; h.l++; a.gd += (ag - hg); h.gd -= (ag - hg); }
    else { h.d++; a.d++; }
  }

  function revertSim() {
    // Rebuild base table from the stored snapshot then re-apply nothing.
    var key = leagueSel.value;
    TABLES[key].teams = BASE[key].teams.map(function (r) { return Object.assign({}, r); });
    simResults = [];
    render();
  }

  function renderSimList(key) {
    var el = document.getElementById('sim-list');
    el.innerHTML = simResults.length
      ? simResults.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('')
      : '<li class="badge-note">No hypothetical results yet — the table above shows the snapshot.</li>';
  }

  document.getElementById('sim-add').addEventListener('click', function () {
    var home = document.getElementById('sim-home').value;
    var away = document.getElementById('sim-away').value;
    var hg = parseInt(document.getElementById('sim-hg').value || '0', 10);
    var ag = parseInt(document.getElementById('sim-ag').value || '0', 10);
    if (home === away) { alert('Pick two different teams.'); return; }
    applySim(home, away, hg, ag);
    simResults.push(home + ' ' + hg + '–' + ag + ' ' + away + ' (hypothetical)');
    render();
    renderSimList(leagueSel.value);
    document.getElementById('sim-note').textContent =
      'Showing SIMULATED table (' + simResults.length + ' hypothetical result' +
      (simResults.length > 1 ? 's' : '') + ' applied). Not official standings.';
  });

  document.getElementById('sim-reset').addEventListener('click', function () {
    revertSim();
    document.getElementById('sim-note').textContent = '';
  });

  // Freeze base snapshots so the simulator can be reset.
  var BASE = {};
  Object.keys(TABLES).forEach(function (k) {
    BASE[k] = { teams: TABLES[k].teams.map(function (r) { return Object.assign({}, r); }) };
  });

  leagueSel.addEventListener('change', function () {
    sortState = { key: null, dir: 1 };
    render();
    document.getElementById('sim-note').textContent = '';
  });

  render();
})();
