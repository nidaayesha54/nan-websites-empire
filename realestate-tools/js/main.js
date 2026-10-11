/* RealEstateTools — calculators (vanilla JS, all client-side) */
"use strict";

function $(id) { return document.getElementById(id); }
function val(id, d) { var v = parseFloat(($(id) || {}).value); return isNaN(v) ? (d || 0) : v; }
function fmt(n) { n = Math.round(n); return (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString("en-US"); }
function pct(n, d) { return (n * 100).toFixed(d == null ? 1 : d) + "%"; }
function verdict(el, cls, txt) { el.innerHTML = '<span class="verdict ' + cls + '">' + txt + "</span>"; }

/* Monthly P&I payment for a fixed-rate mortgage */
function mortPay(prin, annualRate, termYrs) {
  var i = annualRate / 100 / 12, n = termYrs * 12;
  if (prin <= 0) return 0;
  if (i <= 0) return prin / n;
  var f = Math.pow(1 + i, n);
  return prin * i * f / (f - 1);
}
/* Remaining balance after m monthly payments */
function balanceAfter(prin, annualRate, termYrs, m) {
  var i = annualRate / 100 / 12;
  if (prin <= 0) return 0;
  if (i <= 0) return Math.max(0, prin - mortPay(prin, annualRate, termYrs) * m);
  var M = mortPay(prin, annualRate, termYrs), f = Math.pow(1 + i, m);
  return Math.max(0, prin * f - M * (f - 1) / i);
}

/* ---------- 1. Rental ROI analyzer ---------- */
function calcRental() {
  var price = val("rr-price"), down = val("rr-down"), rate = val("rr-rate", 7), term = val("rr-term", 30);
  var rent = val("rr-rent"), tax = val("rr-tax"), ins = val("rr-ins");
  var maint = val("rr-maint", 1), vac = val("rr-vac", 5), mgmt = val("rr-mgmt", 8);

  var loan = Math.max(0, price - down);
  var M = mortPay(loan, rate, term);
  var effRent = rent * (1 - vac / 100);
  var maintMo = price * (maint / 100) / 12;
  var mgmtMo = rent * (mgmt / 100);
  var taxMo = tax / 12, insMo = ins / 12;

  var opExp = taxMo + insMo + maintMo + mgmtMo;
  var cf = effRent - opExp - M;
  var annualCF = cf * 12;
  var noi = (effRent - opExp) * 12;
  var cap = price > 0 ? noi / price : 0;
  var cashIn = Math.max(down, 1);
  var coc = annualCF / cashIn;
  var rule1 = price > 0 ? rent / price : 0;

  var rows = [
    ["Effective monthly rent (after vacancy)", fmt(effRent)],
    ["Monthly operating expenses", "-" + fmt(opExp)],
    ["Monthly mortgage payment (P&I)", "-" + fmt(M)],
    ["Monthly cash flow", fmt(cf)],
    ["Annual cash flow", fmt(annualCF)],
    ["Net operating income (NOI)", fmt(noi)],
    ["Cash invested (down payment)", fmt(down)],
    ["Total loan amount", fmt(loan)]
  ];
  var html = '<h2>Rental Analysis</h2><div class="big-number">' + fmt(cf) + '<span style="font-size:1rem;color:#cbd5e1"> /month</span></div>';
  html += '<p><strong>Cap rate:</strong> ' + pct(cap) + ' &nbsp;|&nbsp; <strong>Cash-on-cash:</strong> ' + pct(coc) + '</p><table>';
  rows.forEach(function (r) { html += "<tr><td>" + r[0] + "</td><td><strong>" + r[1] + "</strong></td></tr>"; });
  html += "</table>";
  html += '<p class="note">Cap rate = NOI ÷ purchase price. Cash-on-cash = annual cash flow ÷ cash invested. Closing costs (typically 2–5%) are not included — subtract them from your return if you pay them in cash.</p>';
  html += '<h3>1% rule check</h3><p>Monthly rent is <strong>' + pct(rule1, 2) + '</strong> of the purchase price. ';
  if (rule1 >= 0.01) html += '<span class="verdict ok">PASSES the 1% rule</span>';
  else if (rule1 >= 0.008) html += '<span class="verdict warn">Close to the 1% rule</span>';
  else html += '<span class="verdict bad">Fails the 1% rule — rent is low for this price</span>';
  html += '</p><p class="note">The 1% rule is a quick screening rule of thumb, not a buy/sell signal. A deal can fail it and still cash-flow in low-price markets, and pass it while hiding big capex problems.</p>';

  var R = $("rr-result");
  R.innerHTML = html; R.classList.add("show");
}

/* ---------- 2. House flip profit calculator ---------- */
function calcFlip() {
  var purchase = val("fl-purchase"), rehab = val("fl-rehab"), arv = val("fl-arv");
  var holding = val("fl-holding"), sellPct = val("fl-sell", 6);

  var sellCost = arv * sellPct / 100;
  var totalIn = purchase + rehab + holding;
  var profit = arv - sellCost - purchase - rehab - holding;
  var roi = totalIn > 0 ? profit / totalIn : 0;
  var maxBuy = arv * 0.70 - rehab;

  var html = '<h2>Flip Analysis</h2><div class="big-number">' + fmt(profit) + '</div>';
  html += '<p><strong>ROI on cash invested:</strong> ' + pct(roi) + '</p><table>';
  [
    ["Purchase price", fmt(purchase)],
    ["Rehab budget", fmt(rehab)],
    ["Holding costs (payments, taxes, utilities)", fmt(holding)],
    ["Total cash into the deal", fmt(totalIn)],
    ["After-repair value (ARV)", fmt(arv)],
    ["Selling costs (" + sellPct + "%)", "-" + fmt(sellCost)],
    ["Net sale proceeds", fmt(arv - sellCost)],
    ["Estimated profit", fmt(profit)]
  ].forEach(function (r) { html += "<tr><td>" + r[0] + "</td><td><strong>" + r[1] + "</strong></td></tr>"; });
  html += "</table>";
  html += '<h3>70% rule check</h3><p>At a ' + fmt(arv) + ' ARV with ' + fmt(rehab) + ' rehab, the 70% rule says pay no more than <strong>' + fmt(maxBuy) + '</strong>. ';
  if (purchase <= maxBuy) html += '<span class="verdict ok">Purchase price is within the 70% rule</span>';
  else html += '<span class="verdict bad">Purchase price is ' + fmt(purchase - maxBuy) + ' over the 70% rule max</span>';
  html += '</p><p class="note">The 70% rule (pay ≤ 70% of ARV minus repairs) is a conservative screening guideline. Holding costs assume your financing, taxes, insurance, and utilities while you own the property.</p>';

  var R = $("fl-result");
  R.innerHTML = html; R.classList.add("show");
}

/* ---------- 3. Rent vs buy ---------- */
function calcRentBuy() {
  var price = val("rb-price"), down = val("rb-down"), rate = val("rb-rate", 7);
  var rent = val("rb-rent"), years = Math.min(30, Math.max(1, Math.round(val("rb-years", 10))));

  var APPR = 0.03, RENTG = 0.03, OPP = 0.06, CLOSE = 0.02, SELLC = 0.06;
  var loan = Math.max(0, price - down);
  var M = mortPay(loan, rate, 30);
  var propCosts = price * 0.04; /* annual tax+insurance+maintenance estimate, grows with home value */

  function geoSum(a, t) { return t <= 0 ? 0 : a * (Math.pow(1.03, t) - 1) / 0.03; }

  var rowsHtml = "", breakEven = -1, finalBuy = 0, finalRent = 0;
  for (var t = 1; t <= 30; t++) {
    var months = t * 12;
    var bal = balanceAfter(loan, rate, 30, months);
    var interestPaid = M * months - (loan - bal);
    var oppCost = down * (Math.pow(1 + OPP, t) - 1);
    var appr = price * (Math.pow(1 + APPR, t) - 1);
    var sellCost = price * Math.pow(1 + APPR, t) * SELLC;
    var buyNet = price * CLOSE + oppCost + interestPaid + geoSum(propCosts, t) - appr + sellCost;
    var rentNet = geoSum(rent * 12, t);
    if (breakEven < 0 && buyNet <= rentNet) breakEven = t;
    if (t === years) { finalBuy = buyNet; finalRent = rentNet; }
    if (t <= years && (t <= 10 || t % 5 === 0 || t === years)) {
      rowsHtml += "<tr><td>Year " + t + "</td><td>" + fmt(buyNet) + "</td><td>" + fmt(rentNet) + "</td></tr>";
    }
  }

  var html = '<h2>Rent vs Buy — ' + years + '-year comparison</h2>';
  html += '<div class="big-number">' + (finalBuy <= finalRent ? "Buy" : "Rent") + ' wins</div>';
  html += '<p>Buying costs <strong>' + fmt(finalBuy) + '</strong> over ' + years + ' years vs <strong>' + fmt(finalRent) + '</strong> for renting. ';
  if (breakEven > 0) html += 'Buying breaks even in <strong>year ' + breakEven + '</strong>.';
  else html += 'Buying never breaks even within 30 years at these numbers.';
  html += '</p><table><tr><th>Period</th><th>Net cost of buying</th><th>Net cost of renting</th></tr>' + rowsHtml + "</table>";
  html += '<p class="note">Assumptions: 3% annual home appreciation, 3% annual rent growth, 6% opportunity cost on the down payment, 2% closing costs, 6% selling costs at the end, property tax + insurance + maintenance ≈ 4% of home value per year (growing with the home), 30-year fixed mortgage. "Net cost of buying" = closing + opportunity cost + mortgage interest + ownership costs − appreciation + selling costs.</p>';

  var R = $("rb-result");
  R.innerHTML = html; R.classList.add("show");
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () { q.parentElement.classList.toggle("open"); });
  });
  if ($("rr-calc")) { $("rr-calc").addEventListener("click", calcRental); calcRental(); }
  if ($("fl-calc")) { $("fl-calc").addEventListener("click", calcFlip); calcFlip(); }
  if ($("rb-calc")) { $("rb-calc").addEventListener("click", calcRentBuy); calcRentBuy(); }
});
