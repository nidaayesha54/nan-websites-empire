// Transfer fee calculator logic
(function(){
  "use strict";
  var form=document.getElementById('feeForm');
  if(!form)return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var age=parseFloat(document.getElementById('age').value);
    var contract=parseFloat(document.getElementById('contract').value);
    var value=parseFloat(document.getElementById('marketValue').value);
    var league=parseFloat(document.getElementById('league').value);
    if(isNaN(age)||isNaN(contract)||isNaN(value)||value<=0){
      alert('Please enter valid numbers.');return;
    }
    // Age factor: peak 24-28 = 1.2x; younger = 1.1x (potential); older declines
    var ageFactor=1.0;
    if(age<=21)ageFactor=1.10;else if(age<=23)ageFactor=1.15;
    else if(age<=28)ageFactor=1.20;else if(age<=30)ageFactor=1.0;
    else if(age<=32)ageFactor=0.75;else ageFactor=0.5;
    // Contract factor: more years = seller leverage
    var contractFactor=1.0;
    if(contract>=4)contractFactor=1.25;
    else if(contract>=2)contractFactor=1.10;
    else if(contract>=1)contractFactor=0.95;
    else if(contract>0)contractFactor=0.7;
    else contractFactor=0.4;
    var mid=value*ageFactor*contractFactor*league;
    var low=mid*0.85, high=mid*1.25;
    function fmt(n){return '€'+(Math.round(n*10)/10).toFixed(1)+'m';}
    document.getElementById('range').textContent=fmt(low)+' – '+fmt(high);
    document.getElementById('breakdown').innerHTML=
      'Base market value: <strong>'+fmt(value)+'</strong><br>'+
      'Age factor (age '+age+'): <strong>x'+ageFactor.toFixed(2)+'</strong><br>'+
      'Contract factor ('+contract+' yrs left): <strong>x'+contractFactor.toFixed(2)+'</strong><br>'+
      'League premium: <strong>x'+league.toFixed(2)+'</strong><br>'+
      'Central estimate: <strong>'+fmt(mid)+'</strong> (range −15% / +25%)';
    document.getElementById('result').style.display='block';
  });
})();
