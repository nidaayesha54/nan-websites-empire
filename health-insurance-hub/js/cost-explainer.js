'use strict';
/* Interactive deductible / OOP-max / coinsurance explainer for a hospital bill.
   patientPays = min(OOPmax, min(bill, deductible) + coinsurance% x max(0, bill - deductible)) */
document.addEventListener('DOMContentLoaded', function () {
  function $(id) { return document.getElementById(id); }
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  var billEl = $('ceBill'), dedEl = $('ceDed'), oopEl = $('ceOop'), coinEl = $('ceCoin');
  function update() {
    var bill = +billEl.value, ded = +dedEl.value, oop = +oopEl.value, coin = +coinEl.value;
    $('ceBillOut').textContent = fmt(bill);
    $('ceDedOut').textContent = fmt(ded);
    $('ceOopOut').textContent = fmt(oop);
    $('ceCoinOut').textContent = coin + '%';
    var dedPart = Math.min(bill, ded);
    var coinPart = (coin / 100) * Math.max(0, bill - ded);
    var patient = Math.min(oop, dedPart + coinPart);
    var insurer = Math.max(0, bill - patient);
    var youPct = bill > 0 ? (patient / bill) * 100 : 0;
    $('ceYouBar').style.width = youPct + '%';
    $('ceInsBar').style.width = (100 - youPct) + '%';
    $('ceYouPay').textContent = fmt(patient);
    $('ceInsPay').textContent = fmt(insurer);
    $('ceBreakdown').innerHTML =
      '<li>You pay the deductible first: <strong>' + fmt(dedPart) + '</strong></li>'
      + '<li>You pay coinsurance (' + coin + '% of the remaining ' + fmt(Math.max(0, bill - ded)) + '): <strong>' + fmt(Math.min(coinPart, Math.max(0, oop - dedPart))) + '</strong></li>'
      + '<li>Out-of-pocket max caps your share at: <strong>' + fmt(oop) + '</strong>' + (dedPart + coinPart > oop ? ' (cap applied ✓)' : '') + '</li>'
      + '<li>Insurer pays the rest: <strong>' + fmt(insurer) + '</strong></li>';
  }
  [billEl, dedEl, oopEl, coinEl].forEach(function (el) {
    el.addEventListener('input', update);
  });
  update();
});
