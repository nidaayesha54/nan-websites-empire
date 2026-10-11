/* DogBreedsHub — side-by-side breed comparison */
(function(){
  var selA=document.getElementById("breedA"),selB=document.getElementById("breedB");
  var out=document.getElementById("cmpResult");
  if(!selA||!selB||!out)return;

  BREEDS.forEach(function(b){
    var o1=document.createElement("option"),o2=document.createElement("option");
    o1.value=b.id;o1.textContent=b.name;o2.value=b.id;o2.textContent=b.name;
    selA.appendChild(o1);selB.appendChild(o2);
  });
  function fromQuery(){
    var q=new URLSearchParams(window.location.search);
    return {a:q.get("a"),b:q.get("b")};
  }
  var qp=fromQuery();
  selA.value=(qp.a&&breedById(qp.a))?qp.a:"labrador";
  selB.value=(qp.b&&breedById(qp.b))?qp.b:"golden";

  function row(label,va,vb,better){
    var clsA="",clsB="";
    if(better==="low"){if(va<vb)clsA=' style="background:#e8f7ea;font-weight:700"';else if(vb<va)clsB=' style="background:#e8f7ea;font-weight:700"';}
    if(better==="high"){if(va>vb)clsA=' style="background:#e8f7ea;font-weight:700"';else if(vb>va)clsB=' style="background:#e8f7ea;font-weight:700"';}
    return "<tr><th>"+label+"</th><td"+clsA+">"+va+"</td><td"+clsB+">"+vb+"</td></tr>";
  }
  function render(){
    var a=breedById(selA.value),b=breedById(selB.value);
    if(!a||!b)return;
    var h='<div class="cmp-grid">'
      +'<div class="cmp-head"><h3>🐶 '+a.name+'</h3><div class="sub2">'+a.desc+'</div></div>'
      +'<div class="cmp-head"><h3>🐶 '+b.name+'</h3><div class="sub2">'+b.desc+'</div></div></div>'
      +'<table><tr><th style="width:28%">Trait</th><th>'+a.name+'</th><th>'+b.name+'</th></tr>'
      +row("Size",SIZE_LABEL[a.size],SIZE_LABEL[b.size])
      +row("Weight",a.weight,b.weight)
      +row("Lifespan",a.life,b.life)
      +row("Energy level",stars(a.energy),stars(b.energy))
      +row("Grooming needs",stars(a.groom),stars(b.groom),"low")
      +row("Shedding",a.shed,b.shed)
      +row("Good with kids",stars(a.kids),stars(b.kids),"high")
      +row("Apartment friendly",stars(a.apart),stars(b.apart),"high")
      +row("Hypoallergenic",a.hypo?"✅ Yes":"❌ No",b.hypo?"✅ Yes":"❌ No")
      +row("Barking level",stars(a.bark),stars(b.bark),"low")
      +row("Trainability",stars(a.train),stars(b.train),"high")
      +row("Beginner friendly",stars(a.novice),stars(b.novice),"high")
      +row("Est. monthly cost","$"+a.costMo,"$"+b.costMo,"low")
      +row("Est. first-year cost","$"+a.firstYear.toLocaleString()," $"+b.firstYear.toLocaleString(),"low")
      +"</table>"
      +'<p style="margin-top:10px;color:#8a6d52;font-size:.9rem">🟩 = better on this trait. Costs are typical 2026 US averages — actual costs vary by breeder, city, and vet.</p>';
    out.className="result show";
    out.innerHTML=h;
  }
  selA.addEventListener("change",render);
  selB.addEventListener("change",render);
  render();
})();
