// FantasyFootballHub - Team Planner
// Uses window.SAMPLE_PLAYERS / window.FORMATIONS from main.js
// NOTE: all player data is sample/demo data - update with current season stats.
(function(){
  var BUDGET = 100;
  var squad = [];        // player ids
  var captain = null, vice = null;
  var history = [];      // logged gameweek scores
  var formation = "4-4-2";

  var $ = function(id){ return document.getElementById(id); };

  function save(){
    try{ localStorage.setItem("ffh_planner", JSON.stringify({squad:squad, formation:formation, captain:captain, vice:vice, history:history})); }catch(e){}
  }
  function load(){
    try{
      var d = JSON.parse(localStorage.getItem("ffh_planner") || "null");
      if(d){ squad = d.squad||[]; formation = d.formation||"4-4-2"; captain = d.captain||null; vice = d.vice||null; history = d.history||[]; }
    }catch(e){}
  }
  function player(id){ return window.SAMPLE_PLAYERS.find(function(p){return p.id===id;}); }
  function cost(){ return squad.reduce(function(s,id){ return s + player(id).price; }, 0); }
  function basePts(){ return squad.reduce(function(s,id){ return s + player(id).pts; }, 0); }
  function projected(){ // captain doubles, vice counts 1.5x in this demo projection
    var total = 0;
    squad.forEach(function(id){
      var p = player(id), pts = p.pts / 38;
      if(id === captain) pts *= 2;
      total += pts;
    });
    return Math.round(total);
  }

  function render(){
    var f = window.FORMATIONS[formation];
    var need = { GK:1, DEF:f.DEF, MID:f.MID, FWD:f.FWD };
    var rows = ["GK","DEF","MID","FWD"];
    var byPos = { GK:[], DEF:[], MID:[], FWD:[] };
    squad.forEach(function(id){ byPos[player(id).pos].push(id); });

    $("pitch").innerHTML = rows.map(function(pos){
      var slots = "";
      for(var k=0;k<need[pos];k++){
        var id = byPos[pos][k];
        if(id){
          var p = player(id);
          var tag = id===captain ? ' <span class="badge">C</span>' : (id===vice ? ' <span class="badge">V</span>' : "");
          slots += '<div class="player-slot" data-slot="'+id+'"><b>'+p.name+'</b>'+tag+
            '<small>£'+p.price.toFixed(1)+'m · '+p.pts+' pts</small>'+
            '<small><a href="#" data-act="cap">C</a> · <a href="#" data-act="vc">VC</a> · <a href="#" data-act="rm">✕</a></small></div>';
        } else {
          slots += '<div class="player-slot" style="opacity:.4;cursor:default"><b>Empty</b><small>'+pos+'</small></div>';
        }
      }
      return '<div class="pitch-row">'+slots+'</div>';
    }).join("");

    var c = cost();
    $("spent").textContent = c.toFixed(1);
    $("left").textContent = "£" + (BUDGET - c).toFixed(1) + "m left";
    $("tpts").textContent = basePts() + history.reduce(function(s,h){return s+h;},0);
    $("gpts").textContent = projected();

    // pool
    var filter = $("sortpos").value;
    var counts = { GK:0, DEF:0, MID:0, FWD:0 };
    squad.forEach(function(id){ counts[player(id).pos]++; });
    $("pool").innerHTML = window.SAMPLE_PLAYERS
      .filter(function(p){ return filter==="ALL" || p.pos===filter; })
      .map(function(p){
        var inSquad = squad.indexOf(p.id) >= 0;
        var full = counts[p.pos] >= need[p.pos];
        var disabled = inSquad || full || c + p.price > BUDGET;
        return '<div class="pl" data-add="'+p.id+'" style="'+(disabled?"opacity:.35;cursor:not-allowed":"")+'"><b>'+p.name+'</b> <span class="pr">£'+p.price.toFixed(1)+'m</span><br><small>'+p.pos+' · '+p.team+' · '+p.pts+' pts</small></div>';
      }).join("");

    $("history").innerHTML = history.length
      ? "<p>Logged gameweeks: " + history.join(", ") + "</p>"
      : "<p style='color:var(--muted)'>No gameweeks logged yet.</p>";
  }

  document.addEventListener("click", function(e){
    var add = e.target.closest ? e.target.closest("[data-add]") : null;
    if(add){
      var id = add.getAttribute("data-add"), p = player(id);
      var need = window.FORMATIONS[formation];
      var counts = { GK:0, DEF:0, MID:0, FWD:0 };
      squad.forEach(function(x){ counts[player(x).pos]++; });
      var lim = p.pos==="GK" ? 1 : need[p.pos];
      if(squad.indexOf(id)<0 && counts[p.pos] < lim && cost()+p.price <= BUDGET){
        squad.push(id); save(); render();
      } else { alert("Cannot add player: slot full, over budget, or already picked."); }
      return;
    }
    var link = e.target.closest ? e.target.closest("[data-act]") : null;
    if(link){
      e.preventDefault();
      var act = link.getAttribute("data-act");
      var slot = link.closest("[data-slot]").getAttribute("data-slot");
      if(act==="rm"){ squad = squad.filter(function(x){return x!==slot;}); if(captain===slot)captain=null; if(vice===slot)vice=null; }
      if(act==="cap"){ captain = slot; if(vice===slot)vice=null; }
      if(act==="vc"){ vice = slot; if(captain===slot)captain=null; }
      save(); render();
    }
  });

  $("formation").addEventListener("change", function(){
    formation = this.value;
    var f = window.FORMATIONS[formation];
    var kept = [], counts = { GK:0, DEF:0, MID:0, FWD:0 };
    squad.forEach(function(id){
      var pos = player(id).pos;
      var lim = pos==="GK" ? 1 : f[pos];
      if(counts[pos] < lim){ kept.push(id); counts[pos]++; }
    });
    squad = kept; captain = null; vice = null;
    save(); render();
  });
  $("sortpos").addEventListener("change", render);
  $("logpts").addEventListener("click", function(){
    var v = parseInt($("addpts").value, 10);
    if(v > 0){ history.push(v); $("addpts").value = ""; save(); render(); }
  });
  $("save").addEventListener("click", function(){ save(); alert("Squad saved to this browser."); });
  $("clear").addEventListener("click", function(){
    squad = []; captain = null; vice = null; history = []; save(); render();
  });

  load();
  $("formation").value = formation;
  render();
})();
