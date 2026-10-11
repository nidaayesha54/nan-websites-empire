// FantasyFootballHub - Player Compare
// NOTE: sample/demo data - type in real current-season stats for accurate comparisons.
(function(){
  var $ = function(id){ return document.getElementById(id); };
  function num(id){ return parseFloat($(id).value) || 0; }
  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

  // value score: points + goals*5 + assists*3, divided by price
  function valueScore(g, a, price, mins){
    var raw = num(g)*5 + num(a)*3;
    var per90 = mins > 0 ? raw / (num(mins)/90) : 0;
    var p = num(price);
    return { total: raw, per90: per90, value: p > 0 ? raw / p : 0 };
  }

  function side(pfx, name, s, win){
    return '<div class="cside '+(win?"winner":"")+'">' +
      '<h3>'+esc(name)+'</h3>' +
      '<p>Value score: <b>'+s.value.toFixed(2)+'</b></p><div class="bar"><i style="width:'+Math.min(100, s.value*10)+'%"></i></div>' +
      '<p>Attacking points: <b>'+s.total+'</b> (goals×5 + assists×3)</p>' +
      '<p>Attacking points per 90: <b>'+s.per90.toFixed(2)+'</b></p>' +
      (win ? '<p class="badge">Best value pick</p>' : '') +
      '</div>';
  }

  function compare(){
    var nameA = $("a-name").value.trim() || "Player A";
    var nameB = $("b-name").value.trim() || "Player B";
    var sA = valueScore("a-goals","a-assists","a-price","a-mins");
    var sB = valueScore("b-goals","b-assists","b-price","b-mins");
    var verdict;
    if(Math.abs(sA.value - sB.value) < 0.05) verdict = "Too close to call — both players offer near-identical value per million.";
    else if(sA.value > sB.value) verdict = "<b>"+esc(nameA)+"</b> is the better value pick ("+sA.value.toFixed(2)+" vs "+sB.value.toFixed(2)+" value per £m).";
    else verdict = "<b>"+esc(nameB)+"</b> is the better value pick ("+sB.value.toFixed(2)+" vs "+sA.value.toFixed(2)+" value per £m).";
    $("result").innerHTML =
      '<div class="compare">'+side("a",nameA,sA,sA.value>sB.value)+'<div class="vs">VS</div>'+side("b",nameB,sB,sB.value>sA.value)+'</div>' +
      '<div class="panel" style="margin-top:1rem"><h3>Verdict</h3><p>'+verdict+'</p>' +
      '<p style="color:var(--muted);font-size:.9rem">Value score = (goals × 5 + assists × 3) ÷ price. Higher is better — it rewards attacking output relative to cost.</p></div>';
  }

  // quick-pick dropdowns from sample players
  var opts = window.SAMPLE_PLAYERS.map(function(p){
    return '<option value="'+p.id+'">'+p.name+' ('+p.pos+', £'+p.price.toFixed(1)+'m)</option>';
  }).join("");
  $("qa").innerHTML = opts; $("qb").innerHTML = opts;
  $("qa").selectedIndex = 12; $("qb").selectedIndex = 13; // two sample forwards

  function fillFrom(pfx, id){
    var p = window.SAMPLE_PLAYERS.find(function(x){return x.id===id;});
    $(pfx+"-name").value = p.name;
    $(pfx+"-goals").value = p.goals;
    $(pfx+"-assists").value = p.assists;
    $(pfx+"-price").value = p.price;
    $(pfx+"-mins").value = 3000;
  }
  $("quick").addEventListener("click", function(){
    fillFrom("a", $("qa").value); fillFrom("b", $("qb").value); compare();
  });
  $("compare").addEventListener("click", compare);
})();
