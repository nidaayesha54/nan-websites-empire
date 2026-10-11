// FantasyFootballHub - Fixture Difficulty Tracker
// NOTE: sample/demo teams & fixtures - use real official fixture lists for the current season.
(function(){
  var TEAMS = ["Kingsport City","Real Marbella","Northfield Rovers","Brightfield United","Harbour FC","Eastport Town","Westfield Athletic","Southport Rangers"];
  var $ = function(id){ return document.getElementById(id); };
  var ratings = {};   // key "gw|team|opp" -> 1..5
  var fixtures = [];  // {gw, team, opp, home}

  function save(){ try{ localStorage.setItem("ffh_fixtures", JSON.stringify({ratings:ratings, fixtures:fixtures})); }catch(e){} }
  function load(){
    try{
      var d = JSON.parse(localStorage.getItem("ffh_fixtures") || "null");
      if(d && d.fixtures && d.fixtures.length){ ratings = d.ratings||{}; fixtures = d.fixtures; return; }
    }catch(e){}
    generate();
  }
  function generate(){
    // seeded pseudo-random demo fixtures
    var seed = 42;
    function rnd(){ seed = (seed*1103515245 + 12345) & 0x7fffffff; return seed/0x7fffffff; }
    fixtures = []; ratings = {};
    var gwCount = parseInt($("weeks").value, 10) || 5;
    for(var gw=1; gw<=gwCount; gw++){
      var pool = TEAMS.slice();
      for(var i=pool.length-1;i>0;i--){ var j=Math.floor(rnd()*(i+1)); var t=pool[i]; pool[i]=pool[j]; pool[j]=t; }
      for(var k=0;k<pool.length;k+=2){
        var home = pool[k], away = pool[k+1] || pool[0];
        fixtures.push({gw:gw, team:home, opp:away, home:true});
        fixtures.push({gw:gw, team:away, opp:home, home:false});
      }
    }
    fixtures.forEach(function(f){ ratings[f.gw+"|"+f.team+"|"+f.opp] = 3; });
    save();
  }

  function stars(gw, team, opp){
    var key = gw+"|"+team+"|"+opp, r = ratings[key]||3, s = "";
    for(var i=1;i<=5;i++){
      s += '<span class="'+(i<=r?"on":"")+'" data-k="'+key+'" data-s="'+i+'" style="cursor:pointer">★</span>';
    }
    return '<span class="diff-stars">'+s+'</span>';
  }

  function render(){
    $("fixtable").querySelector("tbody").innerHTML = fixtures.map(function(f){
      return "<tr><td>"+f.gw+"</td><td><b>"+f.team+"</b></td><td>"+f.opp+"</td><td>"+(f.home?"H":"A")+"</td><td>"+stars(f.gw,f.team,f.opp)+"</td></tr>";
    }).join("");
    // rotation planner: average difficulty per team
    var agg = {};
    TEAMS.forEach(function(t){ agg[t] = {sum:0, n:0, easy:0}; });
    fixtures.forEach(function(f){
      var r = ratings[f.gw+"|"+f.team+"|"+f.opp]||3;
      agg[f.team].sum += r; agg[f.team].n++; if(r<=2) agg[f.team].easy++;
    });
    var rows = TEAMS.map(function(t){
      return { t:t, avg: agg[t].n ? agg[t].sum/agg[t].n : 3, easy: agg[t].easy };
    }).sort(function(a,b){ return a.avg - b.avg; });
    $("easyruns").innerHTML = rows.map(function(r){
      var cls = r.avg <= 2.6 ? ' style="border-left:4px solid var(--green);padding-left:.6rem"' : "";
      var tag = r.easy >= 2 ? ' <span class="badge">Easy run — target these players</span>' : "";
      return "<p"+cls+"><b>"+r.t+"</b> — avg difficulty "+r.avg.toFixed(1)+tag+"</p>";
    }).join("");
  }

  document.addEventListener("click", function(e){
    var st = e.target.closest ? e.target.closest("[data-k]") : null;
    if(st){
      ratings[st.getAttribute("data-k")] = parseInt(st.getAttribute("data-s"),10);
      save(); render();
    }
  });
  $("weeks").addEventListener("change", function(){ generate(); render(); });
  $("regen").addEventListener("click", function(){ generate(); render(); });
  $("savefix").addEventListener("click", function(){ save(); alert("Fixture ratings saved to this browser."); });

  load(); render();
})();
