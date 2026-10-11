// Workers' Comp Estimator — 2026 illustrative base rates per $100 of payroll.
// Rates below are SAMPLES for education only, not quotes. Actual rates vary by
// class code, carrier, experience mod, and state fund vs private market.
// Formula: premium = (payroll / 100) * rate * experience_mod
var WC_RATES = {
  'California':      { office: 0.45, field: 6.20, note: 'CA uses pure premium rates set annually; high overall cost state.' },
  'New York':        { office: 0.35, field: 5.80, note: 'NY splits payroll into high/low classes; experience mods apply.' },
  'Texas':           { office: 0.40, field: 4.50, note: 'TX workers\u2019 comp is optional for most private employers.' },
  'Florida':         { office: 0.30, field: 4.90, note: 'FL requires coverage at 4+ employees (construction: 1+).' },
  'Illinois':        { office: 0.28, field: 4.20, note: 'IL rates set by NCCI; construction trades run higher.' },
  'Pennsylvania':    { office: 0.25, field: 3.80, note: 'PA allows schedule rating credits for safety programs.' },
  'Ohio':            { office: 0.50, field: 3.20, note: 'OH runs a state fund (BWC) \u2014 rates differ from private carriers.' },
  'Georgia':         { office: 0.32, field: 5.10, note: 'GA uses NCCI loss costs; individual carrier multipliers vary.' },
  'North Carolina':  { office: 0.30, field: 4.40, note: 'NC requires coverage at 3+ employees.' },
  'Washington':      { office: 0.55, field: 3.60, note: 'WA prices per hour worked, not payroll \u2014 these are rough equivalents.' },
  'Other / US avg':  { office: 0.40, field: 4.60, note: 'National illustrative average for office vs. manual field work.' }
};

function estimateWC() {
  var state = document.getElementById('wc-state').value;
  var officePay = parseFloat(document.getElementById('wc-office-pay').value) || 0;
  var fieldPay = parseFloat(document.getElementById('wc-field-pay').value) || 0;
  var mod = parseFloat(document.getElementById('wc-mod').value) || 1.0;
  var res = document.getElementById('wc-result');
  if (mod < 0.5 || mod > 2.0) {
    res.innerHTML = '<p style="color:#b23"><strong>Experience mod looks off</strong> \u2014 enter a value between 0.50 and 2.00 (1.00 = average).</p>';
    res.classList.add('show');
    return;
  }
  var r = WC_RATES[state] || WC_RATES['Other / US avg'];

  var officePrem = (officePay / 100) * r.office * mod;
  var fieldPrem = (fieldPay / 100) * r.field * mod;
  var total = officePrem + fieldPrem;
  var lo = total * 0.8, hi = total * 1.2; // carrier variation band

  var html = '<h3>\uD83D\uDC77\uFE0F Estimated Annual Workers\u2019 Comp \u2014 ' + esc(state) + '</h3>';
  html += '<table class="calc"><tr><th>Payroll class</th><th>Rate / $100 payroll</th><th>Est. premium</th></tr>';
  html += '<tr><td><strong>Office / clerical</strong><br><span style="font-size:.82rem;color:var(--muted)">' + money(officePay) + ' payroll \u00D7 ' + mod.toFixed(2) + ' mod</span></td><td>' + r.office.toFixed(2) + '</td><td>' + money(officePrem) + '</td></tr>';
  html += '<tr><td><strong>Field / manual work</strong><br><span style="font-size:.82rem;color:var(--muted)">' + money(fieldPay) + ' payroll \u00D7 ' + mod.toFixed(2) + ' mod</span></td><td>' + r.field.toFixed(2) + '</td><td>' + money(fieldPrem) + '</td></tr>';
  html += '</table>';
  html += '<p style="margin-top:16px"><span class="big-num">' + money(lo) + ' \u2013 ' + money(hi) + '</span><br>' +
    '<span style="color:var(--muted)">illustrative annual range \u00B7 mid estimate ' + money(total) + '</span></p>';
  html += '<div class="callout"><strong>' + esc(state) + ' note:</strong> ' + esc(r.note) + ' ' +
    'Split payroll correctly between class codes \u2014 misclassifying field workers as office is a common (and expensive) audit finding.</div>';

  res.innerHTML = html;
  res.classList.add('show');
  res.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('DOMContentLoaded', function () {
  var sel = document.getElementById('wc-state');
  if (sel) {
    Object.keys(WC_RATES).forEach(function (s) {
      var o = document.createElement('option');
      o.value = s; o.textContent = s;
      sel.appendChild(o);
    });
  }
});
