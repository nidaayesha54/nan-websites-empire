/* FuneralCostGuide — calculators (vanilla JS, all client-side) */
"use strict";

/* 2026 national cost ranges (estimates, marked as such on page) */
var COSTS = {
  burial:   { low: 15250, high: 17200, label: "Traditional burial (funeral with viewing + burial)" },
  cremation:{ low: 8500,  high: 10300, label: "Cremation with viewing and memorial service" },
  direct:   { low: 2550,  high: 3300,  label: "Direct cremation (no service)" }
};

/* State cost-of-living multipliers (estimates) */
var STATE_MULT = {
  "AL":0.90,"AK":1.20,"AZ":1.00,"AR":0.88,"CA":1.22,"CO":1.05,"CT":1.18,"DE":1.08,"DC":1.15,"FL":1.00,
  "GA":0.95,"HI":1.30,"ID":0.95,"IL":1.02,"IN":0.92,"IA":0.92,"KS":0.92,"KY":0.90,"LA":0.92,"ME":1.05,
  "MD":1.12,"MA":1.20,"MI":0.95,"MN":1.00,"MS":0.85,"MO":0.93,"MT":0.95,"NE":0.92,"NV":1.02,"NH":1.10,
  "NJ":1.18,"NM":0.95,"NY":1.20,"NC":0.95,"ND":0.92,"OH":0.93,"OK":0.90,"OR":1.08,"PA":1.02,"RI":1.12,
  "SC":0.92,"SD":0.90,"TN":0.92,"TX":0.95,"UT":0.97,"VT":1.08,"VA":1.05,"WA":1.12,"WV":0.90,"WI":0.97,"WY":0.95
};

var STATE_NAMES = {
  "AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado",
  "CT":"Connecticut","DE":"Delaware","DC":"District of Columbia","FL":"Florida","GA":"Georgia",
  "HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky",
  "LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota",
  "MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire",
  "NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota",
  "OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina",
  "SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia",
  "WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"
};

/* Itemized breakdowns (national averages, 2026 estimates) */
var BREAKDOWN = {
  burial: [
    ["Basic services fee (planning, permits, coordination)", 2000, 3500],
    ["Embalming & body preparation", 500, 1200],
    ["Viewing & ceremony (facilities, staff)", 500, 3000],
    ["Casket", 2000, 10000],
    ["Cemetery plot", 1000, 4000],
    ["Opening & closing of grave", 500, 1500],
    ["Vault / outer burial container", 1000, 2500],
    ["Headstone / marker", 1000, 3000],
    ["Transportation (transfer, hearse)", 300, 800],
    ["Death certificates, flowers, misc.", 200, 600]
  ],
  cremation: [
    ["Basic services fee", 2000, 3000],
    ["Cremation fee", 500, 1500],
    ["Urn", 100, 1000],
    ["Viewing & memorial service", 500, 2000],
    ["Preparation", 300, 800]
  ],
  direct: [
    ["Basic services fee", 1000, 1500],
    ["Cremation fee", 500, 1000],
    ["Simple container", 100, 300]
  ]
};

/* Fair price ranges for quote checker (national, per item) */
var QUOTE_ITEMS = [
  ["Basic services fee", 2000, 3500],
  ["Embalming", 500, 1200],
  ["Viewing / visitation", 400, 1500],
  ["Funeral ceremony", 500, 1500],
  ["Casket (mid-range metal)", 2000, 5000],
  ["Cremation fee", 500, 1500],
  ["Urn", 100, 600],
  ["Vault / grave liner", 1000, 2500],
  ["Cemetery plot", 1000, 4000],
  ["Opening & closing of grave", 500, 1500],
  ["Headstone (flat marker)", 800, 2500],
  ["Hearse / transportation", 300, 800]
];

function fmt(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function populateStates(selectId, includeAll) {
  var sel = document.getElementById(selectId);
  if (!sel) return;
  var keys = Object.keys(STATE_NAMES).sort(function(a, b) {
    return STATE_NAMES[a].localeCompare(STATE_NAMES[b]);
  });
  keys.forEach(function(code) {
    var opt = document.createElement("option");
    opt.value = code;
    opt.textContent = STATE_NAMES[code];
    sel.appendChild(opt);
  });
}

/* ---------- Funeral cost calculator ---------- */
function initCostCalculator() {
  var typeSel = document.getElementById("fc-type");
  var stateSel = document.getElementById("fc-state");
  var result = document.getElementById("fc-result");
  if (!typeSel || !stateSel || !result) return;
  populateStates("fc-state");

  function calc() {
    var type = typeSel.value;
    var state = stateSel.value;
    var mult = STATE_MULT[state] || 1.0;
    var c = COSTS[type];
    var low = c.low * mult, high = c.high * mult;
    var mid = (low + high) / 2;

    var rows = BREAKDOWN[type].map(function(item) {
      return "<tr><td>" + item[0] + "</td><td>" + fmt(item[1] * mult) + " – " + fmt(item[2] * mult) + "</td></tr>";
    }).join("");

    result.innerHTML =
      "<h2>Estimated cost in " + STATE_NAMES[state] + "</h2>" +
      "<div class=\"big-number\">" + fmt(low) + " – " + fmt(high) + "</div>" +
      "<p><strong>" + c.label + "</strong><br>Typical total: about <strong>" + fmt(mid) + "</strong></p>" +
      "<h3>What makes up the cost</h3>" +
      "<table><tr><th>Item</th><th>Typical range</th></tr>" + rows + "</table>" +
      "<p class=\"note\">Estimates based on 2026 national data adjusted for " + STATE_NAMES[state] +
      ". Actual quotes vary by funeral home. Always ask for the itemized General Price List — " +
      "it is your right under the FTC Funeral Rule.</p>";
    result.classList.add("show");
  }
  typeSel.addEventListener("change", calc);
  stateSel.addEventListener("change", calc);
  calc();
}

/* ---------- Cremation vs burial comparison ---------- */
function initCompare() {
  var stateSel = document.getElementById("cmp-state");
  var result = document.getElementById("cmp-result");
  if (!stateSel || !result) return;
  populateStates("cmp-state");

  function calc() {
    var state = stateSel.value;
    var mult = STATE_MULT[state] || 1.0;
    var b = COSTS.burial, c = COSTS.cremation, d = COSTS.direct;
    var saving = (b.low + b.high) / 2 * mult - (d.low + d.high) / 2 * mult;

    result.innerHTML =
      "<h2>Burial vs cremation in " + STATE_NAMES[state] + "</h2>" +
      "<table>" +
      "<tr><th>Option</th><th>Typical range</th><th>Notes</th></tr>" +
      "<tr><td><strong>Traditional burial</strong></td><td>" + fmt(b.low * mult) + " – " + fmt(b.high * mult) + "</td><td>Cemetery plot, casket, vault, headstone included</td></tr>" +
      "<tr><td><strong>Cremation + service</strong></td><td>" + fmt(c.low * mult) + " – " + fmt(c.high * mult) + "</td><td>Viewing and memorial service, then cremation</td></tr>" +
      "<tr><td><strong>Direct cremation</strong></td><td>" + fmt(d.low * mult) + " – " + fmt(d.high * mult) + "</td><td>No viewing or service; simplest option</td></tr>" +
      "</table>" +
      "<p>Choosing direct cremation over a traditional burial can save roughly <strong>" + fmt(saving) + "</strong> in " + STATE_NAMES[state] + ".</p>" +
      "<div class=\"callout gentle\"><strong class=\"label\">A gentle note</strong>There is no right or wrong choice — only what feels right for your family. " +
      "Many families now choose cremation followed by a personal celebration of life weeks later, which can be both meaningful and far more affordable.</div>" +
      "<p class=\"note\">Estimates for 2026, adjusted for " + STATE_NAMES[state] + ". Prices vary by provider.</p>";
    result.classList.add("show");
  }
  stateSel.addEventListener("change", calc);
  calc();
}

/* ---------- Quote fairness checker ---------- */
function initQuoteChecker() {
  var container = document.getElementById("qc-items");
  var stateSel = document.getElementById("qc-state");
  var result = document.getElementById("qc-result");
  var btn = document.getElementById("qc-check");
  if (!container || !stateSel || !result || !btn) return;
  populateStates("qc-state");

  QUOTE_ITEMS.forEach(function(item, i) {
    var div = document.createElement("div");
    div.className = "field";
    div.innerHTML = "<label for=\"qc-" + i + "\">" + item[0] + " <span style='font-weight:normal;color:#5a6b7d'>(leave blank if not quoted)</span></label>" +
      "<input type=\"number\" id=\"qc-" + i + "\" min=\"0\" placeholder=\"Quoted price in $\">";
    container.appendChild(div);
  });

  btn.addEventListener("click", function() {
    var state = stateSel.value;
    var mult = STATE_MULT[state] || 1.0;
    var rows = "", totalQ = 0, totalFair = 0, flags = 0, checked = 0;

    QUOTE_ITEMS.forEach(function(item, i) {
      var val = parseFloat(document.getElementById("qc-" + i).value);
      if (isNaN(val) || val <= 0) return;
      checked++;
      var fairLow = item[1] * mult, fairHigh = item[2] * mult;
      totalQ += val; totalFair += (fairLow + fairHigh) / 2;
      var verdict, cls;
      if (val > fairHigh * 1.15) { verdict = "Overpriced"; cls = "over"; flags++; }
      else if (val > fairHigh) { verdict = "A bit high"; cls = "high"; }
      else if (val < fairLow) { verdict = "Good value"; cls = "good"; }
      else { verdict = "Fair"; cls = "ok"; }
      rows += "<tr><td>" + item[0] + "</td><td>" + fmt(val) + "</td><td>" + fmt(fairLow) + " – " + fmt(fairHigh) + "</td><td><span class=\"verdict " + cls + "\">" + verdict + "</span></td></tr>";
    });

    if (!checked) {
      result.innerHTML = "<p>Please enter at least one quoted price above.</p>";
      result.classList.add("show");
      return;
    }

    var summary;
    if (flags === 0) {
      summary = "<div class=\"callout solution\"><strong class=\"label\">Looks reasonable</strong>None of the items you entered appear overpriced compared to typical " + STATE_NAMES[state] + " ranges. You can feel more confident about this quote.</div>";
    } else {
      summary = "<div class=\"callout problem\"><strong class=\"label\">Worth a second look</strong>" + flags + " item" + (flags > 1 ? "s" : "") +
        " appear" + (flags > 1 ? "" : "s") + " overpriced. Under the FTC Funeral Rule you can decline any item, buy a casket elsewhere, and ask for an itemized price list before deciding.</div>";
    }

    result.innerHTML = "<h2>Quote check — " + STATE_NAMES[state] + "</h2>" + summary +
      "<table><tr><th>Item</th><th>Your quote</th><th>Typical range</th><th>Verdict</th></tr>" + rows + "</table>" +
      "<p>Your quoted total: <strong>" + fmt(totalQ) + "</strong> vs typical <strong>" + fmt(totalFair) + "</strong> for these items.</p>" +
      "<p class=\"note\">Ranges are 2026 estimates for " + STATE_NAMES[state] + ". This is guidance, not financial advice. " +
      "You always have the right to an itemized statement before paying anything.</p>";
    result.classList.add("show");
  });
}

/* ---------- FAQ accordion ---------- */
function initFaq() {
  document.querySelectorAll(".faq-q").forEach(function(q) {
    q.addEventListener("click", function() {
      q.parentElement.classList.toggle("open");
    });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  initCostCalculator();
  initCompare();
  initQuoteChecker();
  initFaq();
});
