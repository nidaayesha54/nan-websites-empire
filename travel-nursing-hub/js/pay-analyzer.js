/* TravelNursingHub — Pay Package Analyzer */
(function () {
  'use strict';

  function num(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }
  function money(v) {
    return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function analyze() {
    var hourly   = num('pa-hourly');
    var hours    = num('pa-hours');
    var housing  = num('pa-housing');
    var perDiem  = num('pa-perdiem');
    var bonus    = num('pa-bonus');

    var taxableWeekly  = hourly * hours;
    var taxFreeWeekly  = housing + perDiem;
    var trueWeekly     = taxableWeekly + taxFreeWeekly + bonus;
    var effectiveHourly = hours > 0 ? trueWeekly / hours : 0;
    var taxFreePct     = trueWeekly > 0 ? (taxFreeWeekly / trueWeekly) * 100 : 0;
    var estAnnual      = trueWeekly * 52;

    document.getElementById('pa-r-taxable').textContent   = money(taxableWeekly);
    document.getElementById('pa-r-taxfree').textContent    = money(taxFreeWeekly);
    document.getElementById('pa-r-bonus').textContent      = money(bonus);
    document.getElementById('pa-r-true').textContent       = money(trueWeekly);
    document.getElementById('pa-r-effective').textContent  = money(effectiveHourly) + ' / hr';
    document.getElementById('pa-r-pct').textContent        = taxFreePct.toFixed(1) + '% of pay is tax-free';
    document.getElementById('pa-r-annual').textContent     = money(estAnnual) + ' / year (if worked 52 wks)';

    var note = document.getElementById('pa-r-note');
    if (hours < 32) {
      note.textContent = 'Note: under 32 guaranteed hours is unusual — confirm your contract\'s guaranteed hours before signing.';
    } else if (taxFreePct > 60) {
      note.textContent = 'Heads-up: tax-free stipends above ~60% of the package may indicate an unusually low taxable rate. Stipends must reflect actual duplicated expenses and require a tax home.';
    } else {
      note.textContent = 'Looks like a balanced package. Compare it with a competing offer in the contract comparator.';
    }

    document.getElementById('pa-result').style.display = 'block';
    document.getElementById('pa-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('pa-calc');
    if (btn) btn.addEventListener('click', analyze);
  });
})();
