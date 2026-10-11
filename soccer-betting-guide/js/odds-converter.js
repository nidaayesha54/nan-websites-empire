/* Odds Converter: American <-> Decimal <-> Fractional + implied probability. */
(function () {
  'use strict';

  function gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) { var t = a % b; a = b; b = t; }
    return a || 1;
  }

  function americanToDecimal(a) {
    if (a === 0) return NaN;
    return a > 0 ? 1 + a / 100 : 1 + 100 / Math.abs(a);
  }

  function decimalToAmerican(d) {
    if (!(d > 1)) return NaN;
    return d >= 2 ? Math.round((d - 1) * 100) : Math.round(-100 / (d - 1));
  }

  function decimalToFraction(d) {
    var x = d - 1;
    if (!(x > 0)) return { n: 0, d: 1 };
    var bestN = 1, bestD = 1, bestErr = Math.abs(x - 1);
    for (var den = 1; den <= 50; den++) {
      var num = Math.round(x * den);
      var err = Math.abs(x - num / den);
      if (err < bestErr) { bestErr = err; bestN = num; bestD = den; }
    }
    var g = gcd(bestN, bestD);
    return { n: bestN / g, d: bestD / g };
  }

  function parseFraction(s) {
    var m = String(s).trim().match(/^(-?\d+)\s*[\/:]\s*(\d+)$/);
    if (!m) return NaN;
    var n = parseFloat(m[1]), d = parseFloat(m[2]);
    if (d === 0) return NaN;
    return 1 + n / d;
  }

  function el(id) { return document.getElementById(id); }

  function render(dec) {
    if (!isFinite(dec) || dec <= 1) {
      el('r-decimal').textContent = '—';
      el('r-american').textContent = '—';
      el('r-fractional').textContent = '—';
      el('r-prob').textContent = '—';
      el('r-note').textContent = 'Enter a valid value in any one field to convert.';
      return;
    }
    var am = decimalToAmerican(dec);
    var f = decimalToFraction(dec);
    var prob = (1 / dec) * 100;
    el('r-decimal').textContent = dec.toFixed(3);
    el('r-american').textContent = (am > 0 ? '+' : '') + am;
    el('r-fractional').textContent = f.n + '/' + f.d;
    el('r-prob').textContent = prob.toFixed(2) + '%';
    el('r-note').textContent = 'Implied probability is what the odds suggest — it includes the bookmaker margin, so it is not a true prediction.';
  }

  function wire() {
    var inAm = el('in-american'), inDec = el('in-decimal'), inFr = el('in-fractional');
    inAm.addEventListener('input', function () {
      var v = parseFloat(inAm.value.replace('+', ''));
      render(americanToDecimal(v));
      inDec.value = ''; inFr.value = '';
    });
    inDec.addEventListener('input', function () {
      var v = parseFloat(inDec.value);
      render(v > 1 ? v : NaN);
      inAm.value = ''; inFr.value = '';
    });
    inFr.addEventListener('input', function () {
      render(parseFraction(inFr.value));
      inAm.value = ''; inDec.value = '';
    });
    el('clear-btn').addEventListener('click', function () {
      inAm.value = ''; inDec.value = ''; inFr.value = '';
      render(NaN);
    });
  }

  document.addEventListener('DOMContentLoaded', wire);
})();
