// LPN Salary Calculator — client-side logic.
(function(){
  var wage = window.LPN_STATE_WAGE || {};
  var specMult = window.LPN_SPECIALTY_MULT || {};
  var expMult = window.LPN_EXP_MULT || {};

  function $(id){ return document.getElementById(id); }
  function fmt(n){ return "$" + Math.round(n).toLocaleString("en-US"); }

  function fillSelect(el, keys){
    keys.forEach(function(k){
      var o = document.createElement("option");
      o.value = k; o.textContent = k;
      el.appendChild(o);
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    var stateSel = $("lpn-state"), specSel = $("lpn-specialty"), expSel = $("lpn-experience");
    if(!stateSel) return;
    fillSelect(stateSel, Object.keys(wage).sort());
    fillSelect(specSel, Object.keys(specMult));
    fillSelect(expSel, Object.keys(expMult));
    expSel.selectedIndex = 2;

    $("lpn-calc-btn").addEventListener("click", function(){
      var state = stateSel.value;
      if(!state){ alert("Please select a state."); return; }
      var base = wage[state];
      var spec = specMult[specSel.value] || 1;
      var exp = expMult[expSel.value] || 1;
      var shift = parseFloat($("lpn-shift").value) || 1;

      var annual = base * spec * exp * shift;
      var hourly = annual / 2080;
      var monthly = annual / 12;
      var overtime = hourly * 1.5 * 200; // est. 200 OT hrs/yr

      $("r-state").textContent = state;
      $("r-annual").textContent = fmt(annual);
      $("r-hourly").textContent = "$" + hourly.toFixed(2);
      $("r-monthly").textContent = fmt(monthly);
      $("r-ot").textContent = fmt(overtime);

      // Comparison bars vs national-ish median baseline
      var baseVals = [base, annual, 62340];
      var labels = ["State mean LPN wage","Your estimated pay","National mean LPN wage (BLS)"];
      var max = Math.max.apply(null, baseVals);
      var bars = $("r-bars");
      bars.innerHTML = "";
      baseVals.forEach(function(v,i){
        var row = document.createElement("div");
        row.className = "bar-row";
        var pct = Math.round(v/max*100);
        row.innerHTML = '<div class="bar-label">'+labels[i]+'</div>' +
          '<div class="bar-track"><div class="bar-fill" style="width:'+pct+'%"></div></div>' +
          '<div class="bar-val">'+fmt(v)+'</div>';
        bars.appendChild(row);
      });

      var res = $("lpn-result");
      res.classList.add("show");
      res.scrollIntoView({behavior:"smooth", block:"nearest"});
    });
  });
})();
