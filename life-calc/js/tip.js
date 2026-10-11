function calcTip(){
  var bill=parseFloat(document.getElementById('bill').value);
  var pct=parseFloat(document.getElementById('tipPct').value);
  var people=parseInt(document.getElementById('people').value,10);
  if(!(bill>=0)||isNaN(pct)||!(people>=1)){alert('Please enter a valid bill amount and number of people.');return;}
  var tip=bill*pct/100;
  var total=bill+tip;
  var per=total/people;
  document.getElementById('tipAmt').textContent='$'+tip.toFixed(2)+' ('+pct+'%)';
  document.getElementById('totalAmt').textContent='$'+total.toFixed(2);
  document.getElementById('perPerson').textContent='$'+per.toFixed(2)+(people>1?' each ('+people+' people)':'');
  document.getElementById('res').classList.add('show');
}
