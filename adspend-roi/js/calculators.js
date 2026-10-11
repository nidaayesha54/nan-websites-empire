// AdSpendROI — ROAS + break-even ROAS calculators (vanilla JS)
(function(){
  "use strict";
  function $(id){return document.getElementById(id);}
  function fmt(n,d){d=d===undefined?2:d;if(!isFinite(n))return "—";return Number(n).toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});}
  function money(n){if(!isFinite(n))return "—";return "$"+Number(n).toLocaleString("en-US",{maximumFractionDigits:2});}

  // ---- ROAS calculator ----
  var spend=$("spend"), revenue=$("revenue");
  if(spend&&revenue){
    var presets={meta:{roas:3.2,label:"Meta Ads average ~3.2x"},google:{roas:4.0,label:"Google Ads average ~4.0x"},tiktok:{roas:2.5,label:"TikTok Ads average ~2.5x"},amazon:{roas:3.8,label:"Amazon Ads average ~3.8x"}};
    function calc(){
      var s=parseFloat(spend.value)||0, r=parseFloat(revenue.value)||0;
      var out=$("result"), big=$("roas-big"), vd=$("verdict"), st=$("stats");
      if(s<=0){out.style.display="none";return;}
      var roas=r/s;
      out.style.display="block";
      big.textContent=fmt(roas)+"x";
      var v,cls;
      if(roas>=4){v="Excellent — scaling territory.";cls="good";}
      else if(roas>=3){v="Solid — above the Meta/Google average.";cls="good";}
      else if(roas>=2){v="Okay — profitable for most businesses; optimize before scaling.";cls="warn";}
      else if(roas>=1){v="Break-even zone — check margins carefully.";cls="warn";}
      else{v="Losing money — pause and fix creative/targeting.";cls="bad";}
      vd.textContent=v; vd.className="verdict "+cls;
      st.innerHTML='<div class="stat"><div class="k">Ad Spend</div><div class="v">'+money(s)+'</div></div>'+
        '<div class="stat"><div class="k">Revenue</div><div class="v">'+money(r)+'</div></div>'+
        '<div class="stat"><div class="k">ROAS %</div><div class="v">'+fmt(roas*100,0)+'%</div></div>'+
        '<div class="stat"><div class="k">Profit (gross)</div><div class="v">'+money(r-s)+'</div></div>';
    }
    spend.addEventListener("input",calc); revenue.addEventListener("input",calc);
    var presetBtns=document.querySelectorAll("[data-preset]");
    presetBtns.forEach(function(b){
      b.addEventListener("click",function(){
        var p=presets[b.getAttribute("data-preset")];
        var s=parseFloat(spend.value)||1000;
        revenue.value=(s*p.roas).toFixed(2);
        $("preset-note").textContent="Preset applied: "+p.label+" on $"+s.toLocaleString()+" spend.";
        calc();
      });
    });
    calc();
  }

  // ---- Break-even ROAS calculator ----
  var price=$("price"), cogs=$("cogs"), ship=$("ship");
  if(price&&cogs){
    function calcBE(){
      var p=parseFloat(price.value)||0, c=parseFloat(cogs.value)||0, sh=parseFloat(ship?ship.value:0)||0;
      var out=$("be-result"), big=$("be-big"), ex=$("be-explain"), st=$("be-stats");
      if(p<=0){out.style.display="none";return;}
      var margin=p-c-sh;
      out.style.display="block";
      if(margin<=0){
        big.textContent="—";
        ex.textContent="Your costs exceed the price — no ad spend can be profitable. Raise price or cut costs first.";
        st.innerHTML=""; return;
      }
      var be=p/margin;
      big.textContent=fmt(be)+"x";
      ex.textContent="You need at least "+fmt(be)+"x ROAS to break even. Every dollar of ad spend must return $"+fmt(be)+" in revenue.";
      st.innerHTML='<div class="stat"><div class="k">Contribution margin</div><div class="v">'+money(margin)+'</div></div>'+
        '<div class="stat"><div class="k">Margin %</div><div class="v">'+fmt(margin/p*100,1)+'%</div></div>'+
        '<div class="stat"><div class="k">Max ad spend / sale</div><div class="v">'+money(margin)+'</div></div>'+
        '<div class="stat"><div class="k">Target (20% profit)</div><div class="v">'+fmt(p/(margin*0.8))+'x</div></div>';
    }
    [price,cogs,ship].forEach(function(el){if(el)el.addEventListener("input",calcBE);});
    calcBE();
  }

  // ---- FAQ accordion ----
  document.querySelectorAll(".faq button").forEach(function(btn){
    btn.addEventListener("click",function(){btn.parentElement.classList.toggle("open");});
  });
})();
