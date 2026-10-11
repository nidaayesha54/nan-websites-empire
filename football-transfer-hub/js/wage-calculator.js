// Wage calculator: weekly -> annual/monthly + after-tax estimate
(function(){
  "use strict";
  var form=document.getElementById('wageForm');
  if(!form)return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var weekly=parseFloat(document.getElementById('weekly').value);
    var rate=parseFloat(document.getElementById('country').value);
    if(isNaN(weekly)||weekly<0){alert('Please enter a valid weekly wage.');return;}
    var annual=weekly*52;
    var monthly=annual/12;
    var netAnnual=annual*(1-rate);
    var netWeekly=weekly*(1-rate);
    function fmt(n){
      return n.toLocaleString('en-US',{maximumFractionDigits:0});
    }
    document.getElementById('annual').textContent=fmt(annual)+' / year';
    document.getElementById('monthly').textContent=fmt(monthly);
    document.getElementById('aftertax').innerHTML=
      'After-tax estimate ('+Math.round(rate*100)+'% top rate):<br>'+
      '<strong style="color:var(--green)">'+fmt(netAnnual)+' / year</strong>'+
      ' (~'+fmt(netWeekly)+' / week)<br>'+
      '<small style="color:var(--muted)">Simplified flat-rate estimate for illustration only — real tax depends on residency, image rights and local rules.</small>';
    document.getElementById('result').style.display='block';
  });
})();
