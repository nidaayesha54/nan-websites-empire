/* DogBreedsHub — Breed Finder quiz */
(function(){
  var form=document.getElementById("quizForm");
  if(!form)return;
  var out=document.getElementById("quizResult");

  function sel(name){var el=form.querySelector('input[name="'+name+'"]:checked');return el?el.value:null;}

  form.addEventListener("submit",function(e){
    e.preventDefault();
    var home=sel("home"),act=sel("activity"),kids=sel("kids"),alg=sel("allergies"),
        groom=sel("grooming"),size=sel("size"),exp=sel("experience");
    if(!home||!act||!kids||!alg||!groom||!size||!exp){
      out.className="result show";
      out.innerHTML="<h3>🐶 Almost there!</h3><p>Please answer all 7 questions so we can find your best matches.</p>";
      out.scrollIntoView({behavior:"smooth"});
      return;
    }
    var pool=BREEDS.slice();
    if(alg==="yes"){pool=pool.filter(function(b){return b.hypo;});}

    var scored=pool.map(function(b){
      var s=0;
      // 1. home (0-10)
      if(home==="apartment")s+=b.apart*2;
      else if(home==="small")s+=(b.apart>=3?8:3)+(b.size==="S"||b.size==="M"?2:0);
      else if(home==="big")s+=(b.energy>=3?6:3)+(SIZE_W[b.size]>=2?4:2);
      else s+=(b.energy>=4?7:4)+3;
      // 2. activity (0-10)
      var target=act==="couch"?2:(act==="moderate"?3:5);
      s+=Math.max(0,10-Math.abs(b.energy-target)*3);
      // 3. kids (0-10)
      if(kids==="no")s+=6;
      else if(kids==="older")s+=b.kids*1.8;
      else s+=b.kids*2;
      // 4. grooming (0-10)
      if(groom==="minimal")s+=(6-b.groom)*2;
      else if(groom==="some")s+=b.groom<=3?8:3;
      else s+=6;
      // 5. size (0-10)
      if(size==="small")s+=(b.size==="S"?10:(b.size==="M"?4:1));
      else if(size==="medium")s+=(b.size==="M"?10:(b.size==="S"||b.size==="L"?6:3));
      else if(size==="large")s+=((b.size==="L"||b.size==="XL")?10:(b.size==="M"?5:2));
      else s+=6;
      // 6. experience (0-10)
      if(exp==="first")s+=b.novice*2;
      else if(exp==="some")s+=b.novice>=3?8:4;
      else s+=6;
      return {b:b,score:s,pct:Math.round(s/66*100)};
    });
    scored.sort(function(a,c){return c.score-a.score;});
    var top=scored.slice(0,3);
    var labels=["🥇 Best match","🥈 Runner-up","🥉 Third pick"];
    var html="<h3>Your top 3 breed matches 🎉</h3>";
    top.forEach(function(t,i){
      var b=t.b;
      var why=[];
      if(home==="apartment"&&b.apart>=4)why.push("apartment-friendly");
      if(kids!=="no"&&b.kids>=4)why.push("great with kids");
      if(alg==="yes")why.push("low-shedding coat");
      if(exp==="first"&&b.novice>=4)why.push("beginner-friendly");
      if(groom==="minimal"&&b.groom<=2)why.push("low-maintenance coat");
      if(act==="athletic"&&b.energy>=4)why.push("matches your energy");
      if(act==="couch"&&b.energy<=2)why.push("happy to chill with you");
      var whyTxt=why.length?("Why: "+why.slice(0,3).join(" · ")+". "):"";
      html+='<div class="match-card"><span class="match-badge">'+t.pct+'% match</span>'
        +'<h4>'+labels[i]+': '+b.name+'</h4>'
        +'<div class="bars"><i style="width:'+t.pct+'%"></i></div>'
        +'<p style="margin-top:10px"><strong>'+SIZE_LABEL[b.size]+'</strong> · '+b.weight+' · '+b.life+'<br>'
        +'Energy '+stars(b.energy)+' · Grooming '+stars(b.groom)+' · Kids '+stars(b.kids)+'<br>'
        +whyTxt+b.desc+'</p>'
        +'<a class="btn-ghost" style="padding:8px 20px;font-size:.9rem" href="breed-comparator.html?a='+b.id+'">Compare this breed →</a></div>';
    });
    html+='<p style="margin-top:8px"><a href="puppy-cost.html">💰 Estimate first-year costs</a> for your new best friend, or <button class="btn-ghost" id="quizAgain" style="padding:6px 16px;font-size:.9rem">retake the quiz</button></p>';
    out.className="result show";
    out.innerHTML=html;
    out.scrollIntoView({behavior:"smooth"});
    var again=document.getElementById("quizAgain");
    if(again){again.addEventListener("click",function(){form.reset();out.className="result";out.innerHTML="";window.scrollTo({top:0,behavior:"smooth"});});}
  });
})();
