/* Bankroll Calculator: Kelly criterion stake sizer + flat-betting planner. */
(function () {
  'use strict';

  // Self-contained fallback if main.js is not loaded first.
  var fmtUSD = (typeof window !== 'undefined' && typeof window.fmtUSD === 'function')
    ? window.fmtUSD
    : function (n) {
        if (!isFinite(n)) return '$0.00';
        return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      };

  function el(id) { return document.getElementById(id); }
  function num(id) { return parseFloat(el(id).value); }

  function americanToDecimal(a) {
    if (a === 0 || !isFinite(a)) return NaN;
    return a > 0 ? 1 + a / 100 : 1 + 100 / Math.abs(a);
  }

  function calcKelly() {
    var bankroll = num('kelly-bankroll');
    var oddsRaw = el('kelly-odds').value.trim();
    var format = el('kelly-format').value;
    var prob = num('kelly-prob') / 100;
    var out = el('kelly-result');

    var dec = NaN;
    if (format === 'american') dec = americanToDecimal(parseFloat(oddsRaw.replace('+', '')));
    else if (format === 'decimal') dec = parseFloat(oddsRaw);
    else if (format === 'fractional') {
      var m = oddsRaw.match(/^(-?\d+)\s*[\/:]\s*(\d+)$/);
      if (m && parseFloat(m[2]) !== 0) dec = 1 + parseFloat(m[1]) / parseFloat(m[2]);
    }

    if (!isFinite(bankroll) || bankroll <= 0) { out.innerHTML = '<p class="warning">Enter a bankroll above $0.</p>'; return; }
    if (!isFinite(dec) || dec <= 1) { out.innerHTML = '<p class="warning">Enter valid odds (e.g. -150, 2.50, or 3/2).</p>'; return; }
    if (!isFinite(prob) || prob <= 0 || prob >= 1) { out.innerHTML = '<p class="warning">Enter an estimated win probability between 1% and 99%. This is your own estimate — no tool can predict winners.</p>'; return; }

    var b = dec - 1;
    var q = 1 - prob;
    var f = (b * prob - q) / b; // Kelly fraction
    var full = f * bankroll;
    var half = full / 2;
    var quarter = full / 4;

    if (f <= 0) {
      out.innerHTML = '<p class="warning"><strong>No edge detected.</strong> With a ' + (prob * 100).toFixed(1) +
        '% win estimate at decimal odds ' + dec.toFixed(3) + ', the Kelly formula suggests staking $0 — the math says this bet has negative expected value.</p>' +
        '<p class="note">The Kelly criterion is educational, not a winning system. Your win-probability estimate is a guess; being wrong by a few points changes everything.</p>';
      return;
    }

    out.innerHTML =
      '<div class="result-row"><span class="k">Kelly fraction (edge)</span><span class="v">' + (f * 100).toFixed(2) + '% of bankroll</span></div>' +
      '<div class="result-row"><span class="k">Full Kelly stake</span><span class="v">' + fmtUSD(full) + '</span></div>' +
      '<div class="result-row"><span class="k">Half Kelly stake (recommended)</span><span class="v positive big">' + fmtUSD(half) + '</span></div>' +
      '<div class="result-row"><span class="k">Quarter Kelly stake (conservative)</span><span class="v">' + fmtUSD(quarter) + '</span></div>' +
      '<p class="note">Most disciplined bettors use half or quarter Kelly because it is far less volatile than full Kelly. An overestimated win probability is the #1 bankroll killer.</p>';
  }

  function calcFlat() {
    var bankroll = num('flat-bankroll');
    var pct = num('flat-unit') / 100;
    var bets = num('flat-bets');
    var out = el('flat-result');

    if (!isFinite(bankroll) || bankroll <= 0) { out.innerHTML = '<p class="warning">Enter a bankroll above $0.</p>'; return; }
    if (!isFinite(pct) || pct <= 0 || pct > 0.1) { out.innerHTML = '<p class="warning">Enter a unit size between 0.1% and 10% of your bankroll. Most planners use 1–2%.</p>'; return; }
    if (!isFinite(bets) || bets < 0) bets = 0;

    var unit = bankroll * pct;
    var units = bankroll / unit;
    var weekly = unit * bets;

    out.innerHTML =
      '<div class="result-row"><span class="k">Stake per bet (unit)</span><span class="v positive big">' + fmtUSD(unit) + '</span></div>' +
      '<div class="result-row"><span class="k">Total units in bankroll</span><span class="v">' + units.toFixed(1) + ' units</span></div>' +
      '<div class="result-row"><span class="k">Planned weekly risk (' + bets + ' bets)</span><span class="v">' + fmtUSD(weekly) + '</span></div>' +
      '<div class="result-row"><span class="k">Units needed to survive a 10-unit losing streak</span><span class="v">' + (units >= 10 ? 'Yes — bankroll covers it' : 'No — reduce unit size') + '</span></div>' +
      '<p class="note">Flat betting keeps every stake identical, which protects you from chasing losses. A common discipline rule: stop for the week if you are down 5 units.</p>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    el('kelly-btn').addEventListener('click', calcKelly);
    el('flat-btn').addEventListener('click', calcFlat);
    calcKelly();
    calcFlat();
  });
})();
