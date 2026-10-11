/* Refund Estimator: refund vs amount owed */
(function () {
  'use strict';

  function fmt(n) {
    return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  function calcRefund(liability, withholding, credits) {
    var net = withholding + credits - liability; // >0 refund, <0 owed
    return net;
  }

  function init() {
    var btn = document.getElementById('calcBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var liability = parseFloat(document.getElementById('liability').value) || 0;
      var withholding = parseFloat(document.getElementById('withholding').value) || 0;
      var credits = parseFloat(document.getElementById('credits').value) || 0;
      var net = calcRefund(liability, withholding, credits);

      var html;
      if (net >= 0) {
        html = '<div class="result-big">+' + fmt(Math.round(net)) + '</div>';
        html += '<p><strong>Estimated refund.</strong> You overpaid by this amount.</p>';
      } else {
        html = '<div class="result-big">' + fmt(Math.round(-net)) + '</div>';
        html += '<p><strong>Estimated amount owed.</strong> You underpaid by this amount.</p>';
      }
      html += '<div class="result-row"><span>Total tax liability</span><strong>' + fmt(liability) + '</strong></div>';
      html += '<div class="result-row"><span>Federal withholding</span><strong>' + fmt(withholding) + '</strong></div>';
      html += '<div class="result-row"><span>Credits claimed</span><strong>' + fmt(credits) + '</strong></div>';
      html += '<p class="note">Estimate only. Actual refund depends on your filed return, penalties, ' +
        'and IRS processing. Educational purposes only — not financial advice.</p>';
      document.getElementById('results').innerHTML = html;
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  if (typeof window !== 'undefined') window.__refundCalc = calcRefund;
})();
