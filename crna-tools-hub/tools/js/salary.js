// CRNA Salary Calculator — vanilla JS
(function () {
  "use strict";

  // Median CRNA salary by state (2026 estimates, USD)
  var STATE_SALARY = {
    "AL": 195000, "AK": 250000, "AZ": 225000, "AR": 196000, "CA": 258000,
    "CO": 232000, "CT": 242000, "DE": 228000, "DC": 230000, "FL": 205000,
    "GA": 212000, "HI": 248000, "ID": 210000, "IL": 228000, "IN": 208000,
    "IA": 203000, "KS": 202000, "KY": 201000, "LA": 198000, "ME": 224000,
    "MD": 232000, "MA": 240000, "MI": 218000, "MN": 222000, "MS": 192000,
    "MO": 204000, "MT": 214000, "NE": 205000, "NV": 232000, "NH": 238000,
    "NJ": 238000, "NM": 208000, "NY": 235000, "NC": 206000, "ND": 210000,
    "OH": 208000, "OK": 200000, "OR": 240000, "PA": 210000, "RI": 230000,
    "SC": 202000, "SD": 205000, "TN": 204000, "TX": 215000, "UT": 215000,
    "VT": 225000, "VA": 214000, "WA": 245000, "WV": 197000, "WI": 220000,
    "WY": 216000
  };

  var STATE_NAMES = {
    "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas",
    "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware",
    "DC": "Washington DC", "FL": "Florida", "GA": "Georgia", "HI": "Hawaii",
    "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
    "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine",
    "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota",
    "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska",
    "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico",
    "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
    "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island",
    "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas",
    "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington",
    "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
  };

  // Experience multipliers (relative to mid-career median)
  var EXP = {
    "0-2":   { label: "0–2 years (new grad)", mult: 0.92 },
    "3-5":   { label: "3–5 years",            mult: 1.00 },
    "6-10":  { label: "6–10 years",           mult: 1.08 },
    "11-15": { label: "11–15 years",          mult: 1.14 },
    "16+":   { label: "16+ years (veteran)",  mult: 1.18 }
  };

  var NATIONAL_MEDIAN = 214000;

  function fmt(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  function init() {
    var stateSel = document.getElementById("state");
    var expSel = document.getElementById("experience");
    var btn = document.getElementById("calc-btn");
    var out = document.getElementById("result");
    if (!stateSel || !expSel || !btn || !out) { return; }

    // Populate state dropdown
    Object.keys(STATE_NAMES).sort(function (a, b) {
      return STATE_NAMES[a] < STATE_NAMES[b] ? -1 : 1;
    }).forEach(function (code) {
      var opt = document.createElement("option");
      opt.value = code;
      opt.textContent = STATE_NAMES[code];
      stateSel.appendChild(opt);
    });
    stateSel.value = "TX";

    // Populate experience dropdown
    Object.keys(EXP).forEach(function (k) {
      var opt = document.createElement("option");
      opt.value = k;
      opt.textContent = EXP[k].label;
      expSel.appendChild(opt);
    });
    expSel.value = "3-5";

    btn.addEventListener("click", function () {
      var code = stateSel.value;
      var e = EXP[expSel.value];
      if (!code || !e) { return; }

      var annual = STATE_SALARY[code] * e.mult;
      var monthly = annual / 12;
      var hourly = annual / (40 * 52); // standard 40h week basis
      var vsNational = annual - NATIONAL_MEDIAN;

      document.getElementById("res-annual").textContent = fmt(annual);
      document.getElementById("res-state").textContent =
        STATE_NAMES[code] + " · " + e.label;
      document.getElementById("res-monthly").textContent = fmt(monthly);
      document.getElementById("res-hourly").textContent = fmt(hourly);
      document.getElementById("res-diff").textContent =
        (vsNational >= 0 ? "+" : "−") + fmt(Math.abs(vsNational)).slice(0) +
        " vs national median ($214K)";
      document.getElementById("res-note").textContent =
        "Estimate for a full-time CRNA in " + STATE_NAMES[code] +
        " with " + e.label + " of experience. Actual offers vary by employer, setting (hospital vs ASC vs locum), call, and overtime.";

      out.classList.add("show");
      out.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
