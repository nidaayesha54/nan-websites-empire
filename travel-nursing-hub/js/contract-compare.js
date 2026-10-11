/* TravelNursingHub — Contract Comparator */
(function () {
  'use strict';

  function num(prefix, id) {
    var el = document.getElementById(prefix + '-' + id);
    if (!el) return 0;
    var v = parseFloat(el.value);
    return isNaN(v) || v < 0 ? 0 : v;
  }
  function money(v) {
    return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function totals(prefix) {
    var hourly  = num(prefix, 'hourly');
    var hours   = num(prefix, 'hours');
    var housing = num(prefix, 'housing');
    var mie     = num(prefix, 'mie');
    var weeks   = num(prefix, 'weeks');
    var travel  = num(prefix, 'travel');
    var bonus   = num(prefix, 'bonus');

    var weekly      = (hourly * hours) + housing + mie;
    var taxFreeWk   = housing + mie;
    var contractTotal = (weekly * weeks) + travel + bonus;
    var effectiveHr = hours > 0 ? weekly / hours : 0;

    return { hourly: hourly, hours: hours, housing: housing, mie: mie, weeks: weeks,
             weekly: weekly, taxFreeWk: taxFreeWk, travel: travel, bonus: bonus,
             contractTotal: contractTotal, effectiveHr: effectiveHr };
  }

  function compare() {
    var a = totals('a');
    var b = totals('b');

    function fill(prefix, t) {
      document.getElementById(prefix + '-r-weekly').textContent   = money(t.weekly);
      document.getElementById(prefix + '-r-taxfree').textContent  = money(t.taxFreeWk);
      document.getElementById(prefix + '-r-effective').textContent = money(t.effectiveHr) + ' / hr';
      document.getElementById(prefix + '-r-total').textContent    = money(t.contractTotal);
    }
    fill('a', a);
    fill('b', b);

    var verdict = document.getElementById('cc-verdict');
    var note    = document.getElementById('cc-note');
    if (a.contractTotal === 0 && b.contractTotal === 0) {
      verdict.textContent = 'Enter both offers above to see which pays more.';
      note.textContent = '';
    } else if (Math.abs(a.contractTotal - b.contractTotal) < 0.01) {
      verdict.textContent = 'Dead heat! Both contracts pay the same — choose on location, schedule, or facility quality.';
      note.textContent = 'When money ties, pick the assignment with better housing options and a stronger unit culture.';
    } else {
      var winner = a.contractTotal > b.contractTotal ? 'Contract A' : 'Contract B';
      var diff = Math.abs(a.contractTotal - b.contractTotal);
      verdict.textContent = winner + ' pays ' + money(diff) + ' more over the full contract.';
      var loserTaxFree = a.contractTotal > b.contractTotal ? b.taxFreeWk : a.taxFreeWk;
      var winnerTaxFree = a.contractTotal > b.contractTotal ? a.taxFreeWk : b.taxFreeWk;
      if (loserTaxFree > winnerTaxFree && (loserTaxFree - winnerTaxFree) > 150) {
        note.textContent = 'One caveat: the lower-paying offer has meaningfully larger tax-free stipends, so its take-home edge may be closer than the totals suggest. Run the winner through the take-home calculator.';
      } else {
        note.textContent = 'Compare take-home after taxes with the take-home pay calculator before you sign.';
      }
    }

    document.getElementById('cc-result').style.display = 'block';
    document.getElementById('cc-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('cc-compare');
    if (btn) btn.addEventListener('click', compare);
  });
})();
