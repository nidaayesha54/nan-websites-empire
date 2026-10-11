/* CollegeTools — calculators (vanilla JS, all client-side) */
"use strict";

function $(id) { return document.getElementById(id); }
function val(id, d) { var v = parseFloat(($(id) || {}).value); return isNaN(v) ? (d || 0) : v; }
function fmt(n) { n = Math.round(n); return (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString("en-US"); }
function pct(n, d) { return (n * 100).toFixed(d == null ? 1 : d) + "%"; }

/* Future value with monthly contributions, monthly compounding */
function fvGrowth(pv, pmt, annualRate, years) {
  var r = annualRate / 100 / 12, n = Math.round(years * 12);
  var f = Math.pow(1 + r, n);
  return pv * f + (r > 0 ? pmt * (f - 1) / r : pmt * n);
}

/* ---------- 1. 529 projector ---------- */
function calc529() {
  var bal = val("p529-bal"), pmt = val("p529-pmt"), years = val("p529-years", 10), ret = val("p529-ret", 7);

  var fv529 = fvGrowth(bal, pmt, ret, years);
  var n = Math.round(years * 12);
  var contrib = bal + pmt * n;
  var growth = fv529 - contrib;

  /* Taxable account: 1% annual tax drag, then 15% capital-gains tax on gains at withdrawal */
  var fvTax = fvGrowth(bal, pmt, Math.max(0, ret - 1), years);
  var gainsTax = fvTax - contrib;
  var taxOwed = Math.max(0, gainsTax * 0.15);
  var netTax = fvTax - taxOwed;

  var html = '<h2>Projected 529 Value</h2><div class="big-number">' + fmt(fv529) + '</div>';
  html += '<table>';
  [
    ["Years until college", years],
    ["Total contributions", fmt(contrib)],
    ["Tax-free growth (529)", fmt(growth)],
    ["Comparable taxable account (after tax drag + 15% gains tax)", fmt(netTax)],
    ["Estimated tax advantage of the 529", fmt(fv529 - netTax)]
  ].forEach(function (r) { html += "<tr><td>" + r[0] + "</td><td><strong>" + r[1] + "</strong></td></tr>"; });
  html += "</table>";
  html += '<p class="note">Assumes monthly compounding at your entered return. The taxable comparison assumes a 1% annual tax drag on returns and a 15% long-term capital gains tax on gains at withdrawal — a simplified estimate, not tax advice. 529 withdrawals for qualified education expenses are federal income-tax-free; non-qualified withdrawals face income tax plus a 10% penalty on earnings.</p>';

  var R = $("p529-result");
  R.innerHTML = html; R.classList.add("show");
}

/* ---------- 2. College cost estimator ---------- */
var PRESETS = {
  publicIn:  { sticker: 25700, label: "Public in-state (avg. total cost of attendance)" },
  publicOut: { sticker: 46000, label: "Public out-of-state (avg. total cost of attendance)" },
  private:   { sticker: 64500, label: "Private nonprofit (avg. total cost of attendance)" }
};
function setPreset() {
  var p = PRESETS[$("cc-preset").value];
  if (p) { $("cc-sticker").value = p.sticker; calcCollege(); }
}
function calcCollege() {
  var sticker = val("cc-sticker"), aid = val("cc-aid"), years = Math.min(6, Math.max(1, Math.round(val("cc-years", 4))));
  var net = Math.max(0, sticker - aid);
  var rows = "", total = 0;
  for (var y = 1; y <= years; y++) {
    var c = net * Math.pow(1.03, y - 1);
    total += c;
    rows += "<tr><td>Year " + y + "</td><td>" + fmt(c) + "</td></tr>";
  }
  var html = '<h2>Estimated Net Cost</h2><div class="big-number">' + fmt(total) + '</div>';
  html += '<p><strong>' + years + '-year total</strong> at ' + fmt(net) + '/year net (after aid), with 3% annual cost inflation.</p>';
  html += '<table><tr><th>Year</th><th>Net cost</th></tr>' + rows + "</table>";
  html += '<p class="note">Sticker prices are 2025-26 national averages for total cost of attendance (tuition + fees + room + board); treat them as estimates. Your net price after grants and scholarships is what matters — use each college\'s official Net Price Calculator for a personalized figure.</p>';
  var R = $("cc-result");
  R.innerHTML = html; R.classList.add("show");
}

/* ---------- 3. Student loan payoff ---------- */
function loanMonths(bal, annualRate, pmt) {
  var i = annualRate / 100 / 12;
  if (pmt <= 0) return -1;
  if (i <= 0) return Math.ceil(bal / pmt);
  if (pmt <= bal * i) return -1; /* never pays off */
  return Math.ceil(-Math.log(1 - i * bal / pmt) / Math.log(1 + i));
}
function payoffDate(months) {
  var d = new Date(); d.setMonth(d.getMonth() + months);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}
function calcLoan() {
  var bal = val("sl-bal"), rate = val("sl-rate", 6), pmt = val("sl-pmt"), extra = val("sl-extra"), income = val("sl-income");
  var i = rate / 100 / 12;

  var stdPmt = i > 0 ? bal * i * Math.pow(1 + i, 120) / (Math.pow(1 + i, 120) - 1) : bal / 120;

  function scenario(p) {
    var m = loanMonths(bal, rate, p);
    if (m < 0) return { months: -1 };
    var totalPaid = p * m;
    return { months: m, interest: totalPaid - bal, date: payoffDate(m) };
  }
  var a = scenario(pmt), b = scenario(pmt + extra), c = scenario(stdPmt);

  /* IDR rough estimate: 10% of discretionary income, 240 payments, then forgiveness */
  var disc = Math.max(0, income - 23475);
  var idrPmt = Math.max(0, 0.10 * disc / 12);
  var idrBal = bal, idrPaid = 0;
  for (var k = 0; k < 240 && idrBal > 0.005; k++) {
    var balWithInt = idrBal * (1 + i);
    var pay = Math.min(idrPmt, balWithInt);
    idrBal = balWithInt - pay;
    idrPaid += pay;
  }

  var html = '<h2>Payoff Comparison</h2><table><tr><th>Plan</th><th>Monthly payment</th><th>Payoff</th><th>Total interest</th></tr>';
  function row(name, p, s) {
    if (s.months < 0) return "<tr><td>" + name + "</td><td>" + fmt(p) + "</td><td><strong>Never — payment covers interest only</strong></td><td>—</td></tr>";
    return "<tr><td>" + name + "</td><td>" + fmt(p) + "</td><td>" + s.months + " mo (" + s.date + ")</td><td>" + fmt(s.interest) + "</td></tr>";
  }
  html += row("Your payment", pmt, a);
  html += row("Your payment + extra", pmt + extra, b);
  html += row("Standard 10-year", stdPmt, c);
  html += "</table>";
  html += '<h3>Income-driven (rough estimate)</h3>';
  if (income <= 0) {
    html += '<p>Enter your annual income above for an IDR estimate.</p>';
  } else {
    html += '<p>Estimated IDR payment: <strong>' + fmt(idrPmt) + '/mo</strong> (10% of discretionary income). After 20 years (240 payments) you\'d pay about <strong>' + fmt(idrPaid) + '</strong> with <strong>' + fmt(idrBal) + '</strong> forgiven. ';
    html += 'Forgiven amounts may be taxable as income depending on current law — check the latest IRS rules.</p>';
  }
  html += '<p class="note">Standard plan assumes a 10-year term. IDR is a rough estimate using 150% of the federal poverty guideline (~$23,475 for a single person, 2026 estimate) — actual plans (SAVE, PAYE, IBR) have specific rules. This is an educational estimate, not a loan servicing quote.</p>';

  var R = $("sl-result");
  R.innerHTML = html; R.classList.add("show");
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () { q.parentElement.classList.toggle("open"); });
  });
  if ($("p529-calc")) { $("p529-calc").addEventListener("click", calc529); calc529(); }
  if ($("cc-calc")) {
    $("cc-calc").addEventListener("click", calcCollege);
    $("cc-preset").addEventListener("change", setPreset);
    calcCollege();
  }
  if ($("sl-calc")) { $("sl-calc").addEventListener("click", calcLoan); calcLoan(); }
});
