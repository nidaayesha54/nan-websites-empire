/* WeddingBudgetPro calculators — vanilla JS, no dependencies */
(function(){
  "use strict";

  var fmt = function(n){
    return "$" + Math.round(n).toLocaleString("en-US");
  };

  /* ---------- Main budget calculator ---------- */
  // Category shares of total budget (2026 USA averages, normalized)
  var CATS = [
    { key:"venue",    name:"Venue & rentals",            share:0.30 },
    { key:"catering", name:"Catering & cake",            share:0.24 },
    { key:"photo",    name:"Photography & videography",  share:0.12 },
    { key:"attire",   name:"Attire & beauty",            share:0.08 },
    { key:"music",    name:"Music & entertainment",      share:0.08 },
    { key:"flowers",  name:"Flowers & decor",            share:0.07 },
    { key:"station",  name:"Stationery & favors",        share:0.03 },
    { key:"rings",    name:"Rings & gifts",              share:0.04 },
    { key:"misc",     name:"Transport, tips & misc",    share:0.04 }
  ];

  // Per-guest catering cost by style (2026 USA $)
  var PER_GUEST = { budget: 45, moderate: 95, luxury: 180 };
  // Fixed venue cost by location type
  var VENUE_BASE = { rural: 4000, suburban: 8000, city: 14000, destination: 12000 };
  // Style multiplier on remaining categories
  var STYLE_MULT = { budget: 0.7, moderate: 1.0, luxury: 1.9 };

  function calcBudget(){
    var guests = Math.max(10, Math.min(500, parseInt(document.getElementById("w-guests").value,10) || 100));
    var style = document.getElementById("w-style").value || "moderate";
    var loc = document.getElementById("w-loc").value || "suburban";

    var catering = guests * PER_GUEST[style];
    var venue = VENUE_BASE[loc] * STYLE_MULT[style];
    // Remaining categories scaled from a moderate baseline
    var rest = 9500 * STYLE_MULT[style] + guests * 18 * STYLE_MULT[style];
    var total = catering + venue + rest;

    var out = document.getElementById("w-output");
    if(!out) return;
    out.style.display = "block";

    document.getElementById("w-total").textContent = fmt(total);
    document.getElementById("w-perguest").textContent = fmt(total / guests);

    var rows = CATS.map(function(c){
      var amt;
      if(c.key === "venue") amt = venue;
      else if(c.key === "catering") amt = catering;
      else amt = (rest * c.share) / 0.46; // remaining share normalized (total minus venue/catering share = .46)
      var pct = Math.round((amt/total)*100);
      return '<div class="brow"><span>' + c.name + ' <small>(' + pct + '%)</small></span><strong>' + fmt(amt) + '</strong></div>' +
             '<div class="bar"><i style="width:' + pct + '%"></i></div>';
    }).join("");
    document.getElementById("w-breakdown").innerHTML = rows;

    var verdict = document.getElementById("w-verdict");
    if(total < 10000) verdict.textContent = "Budget-friendly plan — smart choices keep this under $10K.";
    else if(total < 30000) verdict.textContent = "Right around the national average — a classic, comfortable wedding.";
    else if(total < 60000) verdict.textContent = "An elevated celebration — prioritize what guests will remember most.";
    else verdict.textContent = "A luxury event — consider a planner to manage the moving parts.";
  }

  /* ---------- Cost breakdown visualizer ---------- */
  var ALLOC = [
    ["Venue & rentals",30],["Catering & cake",24],["Photography & video",12],
    ["Attire & beauty",8],["Music & entertainment",8],["Flowers & decor",7],
    ["Rings & gifts",4],["Stationery & favors",3],["Transport & misc",4]
  ];

  function calcAlloc(){
    var total = Math.max(1000, parseInt(document.getElementById("a-total").value,10) || 30000);
    var html = ALLOC.map(function(a){
      var amt = total * a[1] / 100;
      return '<div class="brow"><span>' + a[0] + ' <small>(' + a[1] + '%)</small></span><strong>' + fmt(amt) + '</strong></div>' +
             '<div class="bar"><i style="width:' + a[1] + '%"></i></div>';
    }).join("");
    document.getElementById("a-breakdown").innerHTML = html;
    document.getElementById("a-total-out").textContent = fmt(total);
  }

  /* ---------- FAQ accordion (progressive enhancement) ---------- */
  function bindFaq(){
    document.querySelectorAll(".faq details summary").forEach(function(s){
      s.addEventListener("click", function(){
        document.querySelectorAll(".faq details").forEach(function(d){
          if(d !== s.parentElement) d.removeAttribute("open");
        });
      });
    });
  }

  /* ---------- wire up ---------- */
  document.addEventListener("DOMContentLoaded", function(){
    ["w-guests","w-style","w-loc"].forEach(function(id){
      var el = document.getElementById(id);
      if(el) el.addEventListener("input", calcBudget);
    });
    var at = document.getElementById("a-total");
    if(at) at.addEventListener("input", calcAlloc);
    bindFaq();
    if(document.getElementById("w-output")) calcBudget();
    if(document.getElementById("a-breakdown")) calcAlloc();
  });
})();
