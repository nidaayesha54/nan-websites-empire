/* TravelNursingHub — Take-Home Pay Calculator */
(function () {
  'use strict';

  // Simplified 2026 federal brackets (single) — annualized, for estimates only
  var BRACKETS_SINGLE = [
    [11925, 0.10], [48475, 0.12], [103350, 0.22], [197300, 0.24],
    [250525, 0.32], [626350, 0.35], [Infinity, 0.37]
  ];
  var BRACKETS_MARRIED = [
    [23850, 0.10], [96950, 0.12], [206700, 0.22], [394600, 0.24],
    [501050, 0.32], [751600, 0.35], [Infinity, 0.37]
  ];
  var STD_DEDUCTION_SINGLE = 15700;
  var STD_DEDUCTION_MARRIED = 31400;

  function num(id) {
    var el = document.getElementById(id);
    if (!el) return 0;
    var v = parseFloat(el.value);
    return isNaN(v) || v < 0 ? 0 : v;
  }
  function money(v) {
    return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function federalTax(annualTaxable, married) {
    var brackets = married ? BRACKETS_MARRIED : BRACKETS_SINGLE;
    var deduction = married ? STD_DEDUCTION_MARRIED : STD_DEDUCTION_SINGLE;
    var income = Math.max(0, annualTaxable - deduction);
    var tax = 0, prev = 0;
    for (var i = 0; i < brackets.length; i++) {
      var cap = brackets[i][0], rate = brackets[i][1];
      var portion = Math.min(income, cap) - prev;
      if (portion > 0) tax += portion * rate;
      prev = cap;
      if (income <= cap) break;
    }
    return tax;
  }

  function calc() {
    var taxableWk  = num('th-taxable');
    var taxFreeWk  = num('th-taxfree');
    var married    = document.getElementById('th-status').value === 'married';
    var stateRate  = num('th-state');
    var stateName  = document.getElementById('th-state').selectedOptions[0].text;

    var annualTaxable = taxableWk * 52;
    var fedAnnual     = federalTax(annualTaxable, married);
    var stateAnnual   = annualTaxable * (stateRate / 100);
    var ficaAnnual    = annualTaxable * 0.0765; // Social Security + Medicare (approx)

    var fedWeekly   = fedAnnual / 52;
    var stateWeekly = stateAnnual / 52;
    var ficaWeekly  = ficaAnnual / 52;
    var totalTaxWk  = fedWeekly + stateWeekly + ficaWeekly;
    var takeHomeWk  = taxableWk + taxFreeWk - totalTaxWk;
    var keepPct     = (taxableWk + taxFreeWk) > 0 ? (takeHomeWk / (taxableWk + taxFreeWk)) * 100 : 0;
    var monthly     = takeHomeWk * 52 / 12;

    document.getElementById('th-r-fed').textContent   = money(fedWeekly);
    document.getElementById('th-r-state').textContent = money(stateWeekly) + ' (' + stateName + ')';
    document.getElementById('th-r-fica').textContent  = money(ficaWeekly);
    document.getElementById('th-r-total').textContent = money(totalTaxWk);
    document.getElementById('th-r-takehome').textContent = money(takeHomeWk) + ' / week';
    document.getElementById('th-r-monthly').textContent  = money(monthly) + ' / month (est.)';
    document.getElementById('th-r-keep').textContent     = keepPct.toFixed(1) + '% of gross kept';

    var note = document.getElementById('th-r-note');
    var staffEquiv = takeHomeWk / (1 - (fedAnnual / Math.max(annualTaxable, 1) + stateRate / 100 + 0.0765) * 0 + 0.28);
    if (taxFreeWk > 0 && taxableWk > 0) {
      note.textContent = 'Your tax-free stipends are doing heavy lifting: to match this take-home as a fully-taxed staff nurse you would need roughly ' + money(takeHomeWk * 1.25) + '–' + money(takeHomeWk * 1.35) + ' per week before taxes. Stipends require a legitimate tax home — see the tax tips article.';
    } else if (taxFreeWk === 0) {
      note.textContent = 'No tax-free stipends entered — most travel packages include housing and M&IE stipends. If yours does not, the full offer is taxable and may be overpaying on taxes.';
    } else {
      note.textContent = 'Reminder: tax-free stipends legally require a tax home and duplicated expenses. Confirm your status with a tax professional.';
    }

    document.getElementById('th-result').style.display = 'block';
    document.getElementById('th-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('th-calc');
    if (btn) btn.addEventListener('click', calc);
  });
})();
