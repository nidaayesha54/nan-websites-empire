'use strict';
/* DIME method: coverage = Debts + Income*years + Mortgage + Education - Assets */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('dimeForm');
  var result = document.getElementById('dimeResult');
  function num(id) {
    var v = parseFloat(document.getElementById(id).value);
    return (isNaN(v) || v < 0) ? 0 : v;
  }
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var debts = num('debts');
    var income = num('income');
    var years = num('years');
    var mortgage = num('mortgage');
    var education = num('education');
    var assets = num('assets');
    var incomeNeed = income * years;
    var gross = debts + incomeNeed + mortgage + education;
    var coverage = Math.max(0, gross - assets);
    var html = '<h2>Your estimated coverage need</h2>'
      + '<p class="big">' + fmt(coverage) + '</p>'
      + '<div class="table-wrap"><table><thead><tr><th>DIME component</th><th>Amount</th></tr></thead><tbody>'
      + '<tr><td><strong>D</strong>ebts</td><td>' + fmt(debts) + '</td></tr>'
      + '<tr><td><strong>I</strong>ncome replacement (' + fmt(income) + ' × ' + years + ' yrs)</td><td>' + fmt(incomeNeed) + '</td></tr>'
      + '<tr><td><strong>M</strong>ortgage balance</td><td>' + fmt(mortgage) + '</td></tr>'
      + '<tr><td><strong>E</strong>ducation costs</td><td>' + fmt(education) + '</td></tr>'
      + '<tr><td>Minus existing assets &amp; coverage</td><td>−' + fmt(assets) + '</td></tr>'
      + '<tr><td><strong>Total coverage needed</strong></td><td><strong>' + fmt(coverage) + '</strong></td></tr>'
      + '</tbody></table></div>'
      + '<p class="meta">Estimate only — round up to the nearest $50k–$100k when shopping, since policies come in standard face amounts.</p>';
    result.innerHTML = html;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
