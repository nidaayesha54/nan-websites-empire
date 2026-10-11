/* EstateTools — calculators (vanilla JS, all client-side) */
"use strict";

function $(id) { return document.getElementById(id); }
function val(id, d) { var v = parseFloat(($(id) || {}).value); return isNaN(v) ? (d || 0) : v; }
function fmt(n) { n = Math.round(n); return (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString("en-US"); }

/* ---------- 1. Estate tax estimator ---------- */
/* 2026 federal exemption ~$13.6M per individual (estimate — indexed annually; verify current IRS figures) */
var EXEMPT_SINGLE = 13600000, EXEMPT_MARRIED = 27200000, ESTATE_RATE = 0.40;
function calcEstateTax() {
  var gross = val("et-gross"), debts = val("et-debts");
  var marital = val("et-marital"), charitable = val("et-charitable");
  var married = document.querySelector('input[name="et-status"]:checked');
  married = married ? married.value === "married" : false;

  var taxable = Math.max(0, gross - debts - marital - charitable);
  var exemption = married ? EXEMPT_MARRIED : EXEMPT_MARRIED / 2;
  var over = Math.max(0, taxable - exemption);
  var owed = over * ESTATE_RATE;

  var html = '<h2>Estimated Federal Estate Tax</h2><div class="big-number">' + fmt(owed) + '</div>';
  html += "<table>";
  [
    ["Gross estate", fmt(gross)],
    ["Debts & expenses", "-" + fmt(debts)],
    ["Marital deduction", "-" + fmt(marital)],
    ["Charitable deduction", "-" + fmt(charitable)],
    ["Taxable estate", fmt(taxable)],
    ["Federal exemption (" + (married ? "married, portability" : "single") + ", 2026 estimate)", fmt(exemption)],
    ["Amount subject to tax", fmt(over)],
    ["Tax rate", "40%"],
    ["Estimated tax owed", fmt(owed)]
  ].forEach(function (r) { html += "<tr><td>" + r[0] + "</td><td><strong>" + r[1] + "</strong></td></tr>"; });
  html += "</table>";
  if (owed <= 0) {
    html += '<p><span class="verdict ok">No federal estate tax estimated</span></p>';
  } else {
    html += '<p><span class="verdict warn">Estate appears to owe federal estate tax</span></p>';
  }
  html += '<p class="note">The 2026 exemption (~$13.6M per individual, ~$27.2M for married couples with portability) is an estimate — the IRS indexes it annually. This covers federal tax only: many states impose their own estate or inheritance taxes with much lower thresholds. This is an educational estimate, not tax advice; consult an estate attorney for your situation.</p>';

  var R = $("et-result");
  R.innerHTML = html; R.classList.add("show");
}

/* ---------- 2. Will / estate planning checklist ---------- */
var CHECKLIST = [
  { cat: "Essential Documents", items: [
    ["Signed last will and testament", "The foundation — names executor, distributes probate assets."],
    ["Financial power of attorney", "Someone to manage finances if you become incapacitated."],
    ["Healthcare proxy / advance directive", "Names who makes medical decisions; states your wishes."],
    ["HIPAA authorization", "Lets chosen people access your medical information."],
    ["Living trust (if applicable)", "Avoids probate for funded assets; not everyone needs one."],
    ["List of accounts, policies & advisors", "One master list so your executor can find everything."]
  ]},
  { cat: "Beneficiaries & Account Designations", items: [
    ["Retirement account beneficiaries reviewed", "IRAs and 401(k)s pass by beneficiary form — not your will."],
    ["Life insurance beneficiaries reviewed", "Check after marriage, divorce, births, and deaths."],
    ["Payable-on-death (POD) designations", "Bank accounts can transfer directly to named people."],
    ["Transfer-on-death (TOD) for brokerage", "Avoids probate for investment accounts in many states."]
  ]},
  { cat: "Guardians & Family", items: [
    ["Guardian named for minor children", "Without this, a court decides. Name a backup too."],
    ["Care plan for pets", "Name a caretaker — and consider funding their care."],
    ["Special-needs provisions", "A special-needs trust preserves benefit eligibility."],
    ["Letter of instruction", "Non-binding personal guidance: values, stories, wishes."]
  ]},
  { cat: "Digital Assets", items: [
    ["Password manager emergency access", "A trusted person needs a way in — set up emergency access now."],
    ["Cryptocurrency keys documented", "Without keys, crypto is permanently lost. Store securely."],
    ["Social media & email wishes", "Most platforms offer legacy-contact settings."],
    ["Digital photos & files backup plan", "Say where originals live and who should keep them."]
  ]},
  { cat: "Final Wishes", items: [
    ["Burial / cremation preferences", "Spare your family from guessing during grief."],
    ["Funeral or memorial wishes", "Service type, readings, music — as much detail as you want."],
    ["Organ donation decision", "Register your choice officially; tell your family too."]
  ]}
];
var LS_KEY = "estatetools_willchecklist_v1";
function loadChecks() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch (e) { return {}; }
}
function saveChecks(s) { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {} }
function buildChecklist() {
  var host = $("wc-list"); if (!host) return;
  var state = loadChecks(), total = 0, done = 0, html = "";
  CHECKLIST.forEach(function (c, ci) {
    html += '<div class="check-cat"><h3>' + c.cat + "</h3>";
    c.items.forEach(function (it, ii) {
      var key = ci + "-" + ii, checked = !!state[key];
      total++; if (checked) done++;
      html += '<label class="check-item' + (checked ? " done" : "") + '"><input type="checkbox" data-key="' + key + '"' + (checked ? " checked" : "") + '><span>' + it[0] + '<span class="hint">' + it[1] + "</span></span></label>";
    });
    html += "</div>";
  });
  host.innerHTML = html;
  updateProgress(done, total);
  host.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
    cb.addEventListener("change", function () {
      var s = loadChecks(); s[cb.getAttribute("data-key")] = cb.checked; saveChecks(s);
      cb.closest(".check-item").classList.toggle("done", cb.checked);
      var all = host.querySelectorAll('input[type="checkbox"]');
      var d = 0; all.forEach(function (x) { if (x.checked) d++; });
      updateProgress(d, all.length);
    });
  });
  var pb = $("wc-print");
  if (pb) pb.addEventListener("click", function () { buildPrintSummary(); window.print(); });
  var rb = $("wc-reset");
  if (rb) rb.addEventListener("click", function () { saveChecks({}); buildChecklist(); });
}
function updateProgress(done, total) {
  var bar = $("wc-bar"), txt = $("wc-text");
  var p = total ? Math.round(done / total * 100) : 0;
  if (bar) bar.style.width = p + "%";
  if (txt) txt.textContent = done + " of " + total + " complete (" + p + "%)";
}
function buildPrintSummary() {
  var host = $("wc-print-summary"); if (!host) return;
  host.style.display = "block";
  var state = loadChecks(), doneItems = [], todoItems = [];
  CHECKLIST.forEach(function (c, ci) {
    c.items.forEach(function (it, ii) {
      (state[ci + "-" + ii] ? doneItems : todoItems).push("<li><strong>" + c.cat + ":</strong> " + it[0] + "</li>");
    });
  });
  host.innerHTML = "<h2>Estate Planning Checklist Summary</h2><p>Printed " + new Date().toLocaleDateString("en-US") + "</p>" +
    "<h3>Completed (" + doneItems.length + ")</h3><ul>" + (doneItems.join("") || "<li>None yet</li>") + "</ul>" +
    "<h3>Still to do (" + todoItems.length + ")</h3><ul>" + (todoItems.join("") || "<li>All complete — well done.</li>") + "</ul>";
}

/* ---------- 3. Beneficiary allocation planner ---------- */
var BEN_LS = "estatetools_beneficiaries_v1";
var accounts = [];
function loadAccounts() {
  try { accounts = JSON.parse(localStorage.getItem(BEN_LS) || "[]"); } catch (e) { accounts = []; }
  if (!accounts.length) {
    accounts = [
      { name: "401(k) — Current employer", value: 250000, bens: [{ name: "Spouse", pct: 100 }] },
      { name: "Life insurance policy", value: 500000, bens: [{ name: "Spouse", pct: 50 }, { name: "Child 1", pct: 25 }, { name: "Child 2", pct: 25 }] }
    ];
  }
}
function saveAccounts() { try { localStorage.setItem(BEN_LS, JSON.stringify(accounts)); } catch (e) {} }
function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function renderBen() {
  var host = $("bp-accounts"); if (!host) return;
  var html = "";
  accounts.forEach(function (a, ai) {
    html += '<div class="ben-acct"><div class="field-row">' +
      '<div class="field"><label>Account name</label><input type="text" data-ai="' + ai + '" data-f="name" value="' + esc(a.name) + '"></div>' +
      '<div class="field"><label>Value ($)</label><input type="number" data-ai="' + ai + '" data-f="value" value="' + a.value + '"></div></div>';
    html += '<label style="font-weight:600">Beneficiaries (% must total 100)</label>';
    a.bens.forEach(function (b, bi) {
      html += '<div class="ben-row"><input type="text" placeholder="Name" data-ai="' + ai + '" data-bi="' + bi + '" data-f="bname" value="' + esc(b.name) + '">' +
        '<input type="number" placeholder="%" min="0" max="100" step="0.1" data-ai="' + ai + '" data-bi="' + bi + '" data-f="bpct" value="' + b.pct + '">' +
        '<button class="ben-del" data-ai="' + ai + '" data-bi="' + bi + '" data-act="delben" title="Remove">×</button></div>';
    });
    html += '<div class="no-print" style="margin-top:.5rem;display:flex;gap:.5rem;flex-wrap:wrap">' +
      '<button class="btn btn-char" data-ai="' + ai + '" data-act="addben" style="font-size:.85rem;padding:.5rem 1rem">+ Add beneficiary</button>' +
      '<button class="btn btn-outline" data-ai="' + ai + '" data-act="delacct" style="font-size:.85rem;padding:.5rem 1rem;color:var(--red);border-color:#e5b8b8">Remove account</button></div></div>';
  });
  host.innerHTML = html;

  host.querySelectorAll("input").forEach(function (inp) {
    inp.addEventListener("input", function () {
      var ai = +inp.getAttribute("data-ai"), f = inp.getAttribute("data-f");
      if (f === "name") accounts[ai].name = inp.value;
      else if (f === "value") accounts[ai].value = parseFloat(inp.value) || 0;
      else if (f === "bname") accounts[ai].bens[+inp.getAttribute("data-bi")].name = inp.value;
      else if (f === "bpct") accounts[ai].bens[+inp.getAttribute("data-bi")].pct = parseFloat(inp.value) || 0;
      saveAccounts();
    });
  });
  host.querySelectorAll("button[data-act]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var ai = +btn.getAttribute("data-ai"), act = btn.getAttribute("data-act");
      if (act === "addben") accounts[ai].bens.push({ name: "", pct: 0 });
      else if (act === "delben") accounts[ai].bens.splice(+btn.getAttribute("data-bi"), 1);
      else if (act === "delacct") accounts.splice(ai, 1);
      saveAccounts(); renderBen();
    });
  });
}
function validateBen() {
  var totals = {}, grand = 0, html = '<h2>Allocation Review</h2><table><tr><th>Account</th><th>Beneficiary total</th><th>Status</th></tr>', allOk = true;
  accounts.forEach(function (a) {
    var sum = 0;
    a.bens.forEach(function (b) { sum += (+b.pct) || 0; });
    grand += (+a.value) || 0;
    a.bens.forEach(function (b) {
      var amt = ((+a.value) || 0) * ((+b.pct) || 0) / 100;
      totals[b.name || "(unnamed)"] = (totals[b.name || "(unnamed)"] || 0) + amt;
    });
    var ok = Math.abs(sum - 100) < 0.011;
    if (!ok) allOk = false;
    html += "<tr><td>" + esc(a.name || "(unnamed account)") + "</td><td>" + sum.toFixed(1) + "%</td><td>" +
      (ok ? '<span class="verdict ok">Sums to 100%</span>' : '<span class="verdict bad">Does not sum to 100%</span>') + "</td></tr>";
  });
  html += "</table>";
  html += "<h3>Totals by beneficiary</h3><table><tr><th>Beneficiary</th><th>Total across accounts</th></tr>";
  Object.keys(totals).forEach(function (k) { html += "<tr><td>" + esc(k) + "</td><td><strong>" + fmt(totals[k]) + "</strong></td></tr>"; });
  html += "</table><p><strong>Combined account value:</strong> " + fmt(grand) + "</p>";
  html += allOk
    ? '<p><span class="verdict ok">All accounts allocate 100% — plan is internally consistent</span></p>'
    : '<p><span class="verdict warn">Fix the accounts above so each totals exactly 100%</span></p>';
  html += '<p class="note">Beneficiary designations override your will for these accounts — that is why keeping them at 100% and reviewing after life events matters. "Per stirpes" vs "per capita" (explained below) controls what happens if a beneficiary dies before you.</p>';
  var R = $("bp-result");
  R.innerHTML = html; R.classList.add("show");
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () { q.parentElement.classList.toggle("open"); });
  });
  document.querySelectorAll('input[name="et-status"]').forEach(function (r) {
    r.addEventListener("change", function () {
      document.querySelectorAll(".radio-card").forEach(function (c) { c.classList.remove("selected"); });
      r.closest(".radio-card").classList.add("selected");
    });
  });
  var first = document.querySelector('input[name="et-status"]');
  if (first) first.closest(".radio-card").classList.add("selected");
  if ($("et-calc")) { $("et-calc").addEventListener("click", calcEstateTax); calcEstateTax(); }
  if ($("wc-list")) buildChecklist();
  if ($("bp-accounts")) {
    loadAccounts(); renderBen();
    $("bp-add").addEventListener("click", function () { accounts.push({ name: "", value: 0, bens: [{ name: "", pct: 100 }] }); saveAccounts(); renderBen(); });
    $("bp-validate").addEventListener("click", validateBen);
  }
});
