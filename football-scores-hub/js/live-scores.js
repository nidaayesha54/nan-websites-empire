/* Live Scores tool.
   HONESTY CONTRACT: any section fed by a live API is labeled "Live (API)".
   Sections using our local snapshot are labeled "Updated daily".
   We NEVER render local snapshot data as if it were live. */
(function () {
  var liveBox = document.getElementById('live-results');
  var statusEl = document.getElementById('api-status');

  // Free public endpoints to try, in order. All are optional; failures are normal.
  var ENDPOINTS = [
    // ScoreBat public video feed (has recent match info; not a true score feed)
    'https://www.scorebat.com/video-api/v3/feed/?token=MTE4NTdfMTY5NDA5Nzg5Nl85MjA4M2U4ZDI3ZDI0Y2E1NDBlNGJiZGNiNGQ1YjU1Mg==',
    // OpenLigaDB - free, no key, but schedules/results rather than live
    'https://api.openligadb.de/getmatchdata/bl1'
  ];

  function setStatus(msg, live) {
    statusEl.textContent = msg;
    statusEl.className = 'tag ' + (live ? 'live' : 'daily');
  }

  function renderError(err) {
    setStatus('Live API unavailable', false);
    liveBox.innerHTML =
      '<div class="alert"><strong>Live data could not be loaded right now.</strong><br>' +
      'The free public APIs we poll are rate-limited or offline. ' +
      'Scores below this box are our <strong>Updated daily</strong> editorial snapshot — not live scores. ' +
      '<span class="badge-note">Error: ' + String(err && err.message || err) + '</span></div>';
  }

  function fmtDate(d) {
    try { return new Date(d).toLocaleString(); } catch (e) { return d; }
  }

  function renderLive(items) {
    setStatus('Live (API) — scorebat feed', true);
    if (!items || !items.length) {
      liveBox.innerHTML = '<div class="alert">No live matches in the API feed right now.</div>';
      return;
    }
    var html = items.slice(0, 10).map(function (m) {
      return '<div class="match-card"><div class="teams">' +
        esc(m.title || 'Unknown match') + '</div>' +
        '<div class="kickoff">' + esc(fmtDate(m.date)) + '<br><span class="badge-note">' +
        esc(m.competition || '') + '</span></div></div>';
    }).join('');
    liveBox.innerHTML = html;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function tryEndpoints(i) {
    if (i >= ENDPOINTS.length) { renderError('all endpoints failed'); return; }
    fetch(ENDPOINTS[i], { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        var items = data && (data.response || data);
        if (Array.isArray(items) && items.length) {
          renderLive(items);
        } else if (items && items.matches) {
          renderLive(items.matches.map(function (mm) {
            return {
              title: (mm.team1 && mm.team1.teamName) + ' vs ' + (mm.team2 && mm.team2.teamName),
              date: mm.matchDateTime,
              competition: mm.leagueName
            };
          }));
        } else {
          tryEndpoints(i + 1);
        }
      })
      .catch(function () { tryEndpoints(i + 1); });
  }

  tryEndpoints(0);
})();
