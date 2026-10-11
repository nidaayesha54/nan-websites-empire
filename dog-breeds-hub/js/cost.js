/* DogBreedsHub — first-year puppy cost calculator */
(function(){
  var form=document.getElementById("costForm");
  if(!form)return;
  var out=document.getElementById("costResult");

  var SIZE_COST={
    S:{food:40,vet:350,supplies:200,groomOcc:200,groomReg:600,spay:200,ins:35,label:"Small (under 25 lb)"},
    M:{food:55,vet:400,supplies:250,groomOcc:260,groomReg:780,spay:300,ins:45,label:"Medium (25–55 lb)"},
    L:{food:75,vet:475,supplies:325,groomOcc:320,groomReg:960,spay:400,ins:60,label:"Large (55–90 lb)"},
    XL:{food:110,vet:600,supplies:425,groomOcc:400,groomReg:1200,spay:550,ins:80,label:"Giant (90+ lb)"}
  };
  function money(n){return "$"+Math.round(n).toLocaleString();}

  form.addEventListener("submit",function(e){
    e.preventDefault();
    var size=form.size.value;
    var c=SIZE_COST[size];
    var acqType=form.acqType.value;
    var acq=parseFloat(form.acqAmount.value)||0;
    var spay=form.spay.checked?c.spay:0;
    var training=form.training.checked?250:0;
    var ins=form.insurance.checked?c.ins*12:0;
    var groom=form.groom.value==="reg"?c.groomReg:(form.groom.value==="occ"?c.groomOcc:0);

    var lines=[
      ["Acquisition ("+(acqType==="breeder"?"breeder purchase":"adoption fee")+")",acq],
      ["Food (first year)",c.food*12],
      ["Vet exams + puppy vaccines",c.vet],
      ["Spay/neuter",spay],
      ["Supplies (crate, bed, leash, toys)",c.supplies],
      ["Grooming (first year)",groom],
      ["Training classes",training],
      ["Pet insurance (12 mo)",ins]
    ];
    var total=lines.reduce(function(t,l){return t+l[1];},0);
    var html="<h3>💰 First-year estimate: <span class='big-num'>"+money(total)+"</span></h3>"
      +"<p>For a <strong>"+c.label+"</strong> puppy · about <strong>"+money(total/12)+"/month</strong></p>"
      +"<table><tr><th>Expense</th><th>Cost</th></tr>";
    lines.forEach(function(l){html+="<tr><td>"+l[0]+"</td><td>"+money(l[1])+"</td></tr>";});
    html+="</table><p style='margin-top:10px;font-size:.9rem;color:#8a6d52'>Typical 2026 US averages. Emergencies, boarding, and city vet prices can push costs higher — a rainy-day fund is always smart. 🐾</p>";
    out.className="result show";
    out.innerHTML=html;
    out.scrollIntoView({behavior:"smooth"});
  });
})();
