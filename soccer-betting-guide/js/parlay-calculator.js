/* Parlay / accumulator payout calculator — up to 8 legs. */
(function () {
  'use strict';

  // Self-contained fallback if main.js is not loaded first.
  var fmtUSD = (typeof window !== 'undefined' && typeof window.fmtUSD === 'function')
    ? window.fmtUSD
    : function (n) {
        if (!isFinite(n)) return '$0.00';
        return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      };

  var MAX_LEGS = 8;

  function el(id) { return document.getElementById(id); }

  function americanToDecimal(a) {
    if (a === 0 || !isFinite(a)) return NaN;
    return a > 0 ? 1 + a / 100 : 1 + 100 / Math.abs(a);
  }

  function parseLeg(value, format) {
    var v = String(value).trim();
    if (!v) return NaN;
    if (format === 'american') return americanToDecimal(parseFloat(v.replace('+', '')));
    if (format === 'decimal') { var d = parseFloat(v); return d > 1 ? d : NaN; }
    if (format === 'fractional') {
      var m = v.match(/^(-?\d+)\s*[\/:]\s*(\d+)$/);
      if (!m || parseFloat(m[2]) === 0) return NaN;
      return 1 + parseFloat(m[1]) / parseFloat(m[2]);
    }
    return NaN;
  }

  function decimalToAmerican(d) {
    return d >= 2 ? Math.round((d - 1) * 100) : Math.round(-100 / (d - 1));
  }

  function buildLegs() {
    var wrap = el('legs');
    for (var i = 1; i <= MAX_LEGS; i++) {
      var row = document.createElement('div');
      row.className = 'leg-row';
      row.innerHTML =
        '<input type="text" id="leg-odds-' + i + '" placeholder="Leg ' + i + ' odds (e.g. -150, 2.50, 3/2)" aria-label="Leg ' + i + ' odds">' +
        '<select id="leg-format-' + i + '" aria-label="Leg ' + i + ' odds format">' +
        '<option value="american">American</option>' +
        '<option value="decimal">Decimal</option>' +
        '<option value="fractional">Fractional</option>' +
        '</select>';
      wrap.appendChild(row);
    }
  }

  function calculate() {
    var out = el('parlay-result');
    var stake = parseFloat(el('parlay-stake').value);
    if (!isFinite(stake) || stake <= 0) {
      out.innerHTML = '<p class="warning">Enter a stake above $0.</p>';
      return;
    }
    var combined = 1, used = 0, badLeg = 0;
    for (var i = 1; i <= MAX_LEGS; i++) {
      var dec = parseLeg(el('leg-odds-' + i).value, el('leg-format-' + i).value);
      if (!isNaN(dec)) { combined *= dec; used++; }
      else if (el('leg-odds-' + i).value.trim() !== '') badLeg = i;
    }
    if (badLeg) {
      out.innerHTML = '<p class="warning">Leg ' + badLeg + ' odds are invalid — check the value and format.</p>';
      return;
    }
    if (used < 2) {
      out.innerHTML = '<p class="warning">Enter odds for at least 2 legs to build a parlay.</p>';
      return;
    }
    var payout = stake * combined;
    var profit = payout - stake;
    var implied = (1 / combined) * 100;
    var am = decimalToAmerican(combined);
    out.innerHTML =
      '<div class="result-row"><span class="k">Legs used</span><span class="v">' + used + '</span></div>' +
      '<div class="result-row"><span class="k">Combined decimal odds</span><span class="v">' + combined.toFixed(3) + '</span></div>' +
      '<div class="result-row"><span class="k">Combined American odds</span><span class="v">' + (am > 0 ? '+' : '') + am + '</span></div>' +
      '<div class="result-row"><span class="k">Implied win probability</span><span class="v warning">' + implied.toFixed(2) + '%</span></div>' +
      '<div class="result-row"><span class="k">Total payout</span><span class="v positive big">' + fmtUSD(payout) + '</span></div>' +
      '<div class="result-row"><span class="k">Profit if all legs win</span><span class="v">' + fmtUSD(profit) + '</span></div>' +
      '<p class="note">Every added leg multiplies the payout AND the risk — one losing leg loses the whole ticket. The implied probability above shows how unlikely a big parlay really is. Parlays carry a higher house edge than single bets; they are entertainment, not a strategy.</p>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildLegs();
    el('parlay-btn').addEventListener('click', calculate);
    // Live recompute on any input
    el('legs').addEventListener('input', calculate);
    el('legs').addEventListener('change', calculate);
    el('parlay-stake').addEventListener('input', calculate);
  });
})();
