// LPN School Cost vs. Salary ROI Calculator — client-side logic.
(function(){
  var STATES = (window.LPN_STATE_WAGE) ? Object.keys(window.LPN_STATE_WAGE).sort() : [];

  function $(id){ return document.getElementById(id); }
  function fmt(n){ return "$" + Math.round(n).toLocaleString("en-US"); }
  function num(id, def){ var v = parseFloat($(id).value); return isFinite(v) ? v : def; }

  document.addEventListener("DOMContentLoaded", function(){
    var stateSel = $("roi-state");
    if(!stateSel) return;
    STATES.forEach(function(s){
      var o = document.createElement("option");
      o.value = s; o.textContent = s;
      stateSel.appendChild(o);
    });
    stateSel.selectedIndex = 5; // California-ish placeholder; user should change

    stateSel.addEventListener("change", function(){
      var est = window.LPN_STATE_WAGE[stateSel.value];
      if(est) $("roi-salary").value = Math.round(est * 1.02); // + experience bump
    });

    $("roi-btn").addEventListener("click", function(){
      var cost = num("roi-cost", 12000);
      var months = num("roi-months", 14);
      var current = num("roi-current", 35000);
      var salary = num("roi-salary", 62000);
      var years = Math.min(Math.max(num("roi-years", 10), 1), 40);

      var monthlyLPN = salary / 12;
      var monthlyCur = current / 12;
      var monthlyGain = monthlyLPN - monthlyCur;

      // Investment = tuition + foregone earnings during school (part-time loss factor 50%)
      var foregone = (current / 12) * months * 0.5;
      var totalInvestment = cost + foregone;

      var monthsWorked = years * 12;
      var totalGain = monthlyGain * monthsWorked;
      var net = totalGain - totalInvestment;
      var breakevenMonths = monthlyGain > 0 ? totalInvestment / monthlyGain : Infinity;

      $("roi-invest").textContent = fmt(totalInvestment);
      $("roi-costline").textContent = "Tuition " + fmt(cost) + " + est. foregone earnings " + fmt(foregone);
      $("roi-net").textContent = fmt(net);
      $("roi-years").textContent = years + "-year net gain vs. staying in your current job";
      $("roi-breach").textContent = isFinite(breakevenMonths)
        ? Math.ceil(breakevenMonths) + " months after starting work as an LPN"
        : "Never — expected LPN salary is below your current pay";

      // Simple year-by-year cumulative chart (bars)
      var cumBox = $("roi-bars");
      cumBox.innerHTML = "";
      var cum = -totalInvestment;
      var rows = [];
      for(var y = 1; y <= years; y++){
        cum += monthlyGain * 12;
        rows.push({y:y, v:cum});
      }
      var maxAbs = Math.max.apply(null, rows.map(function(r){return Math.abs(r.v);})) || 1;
      rows.forEach(function(r){
        var pct = Math.round(Math.abs(r.v)/maxAbs*100);
        var row = document.createElement("div");
        row.className = "bar-row";
        row.innerHTML = '<div class="bar-label">Year ' + r.y + '</div>' +
          '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
          '<div class="bar-val">' + fmt(r.v) + '</div>';
        cumBox.appendChild(row);
      });

      var box = $("roi-result");
      box.classList.add("show");
      box.scrollIntoView({behavior:"smooth", block:"nearest"});
    });
  });
})();
