function to12h(mins){
  mins=((mins%1440)+1440)%1440;
  var h=Math.floor(mins/60),m=mins%60;
  var ap=h>=12?'PM':'AM';var h12=h%12;if(h12===0)h12=12;
  return h12+':'+String(m).padStart(2,'0')+' '+ap;
}
function calcSleep(){
  var t=document.getElementById('wake').value;
  if(!t){alert('Please choose a wake-up time.');return;}
  var p=t.split(':'),wakeMin=(+p[0])*60+(+p[1]);
  var html='<table class="res"><tr><th>Go to bed at</th><th>Sleep cycles</th><th>Total sleep</th></tr>';
  var best='';
  for(var c=7;c>=4;c--){
    var bed=wakeMin-(c*90+15);
    var total=c*90/60;
    var mark=(c===5||c===6)?' ⭐':'';
    html+='<tr><td style="font-weight:800">'+to12h(bed)+mark+'</td><td>'+c+' cycles</td><td>'+total.toFixed(1)+' hrs</td></tr>';
    if(c===6)best=to12h(bed);
  }
  html+='</table>';
  document.getElementById('bedtimes').innerHTML=html;
  document.getElementById('sleepDetail').textContent=
    'Recommended: '+best+' (6 full cycles ≈ 9 hours). Times include ~15 minutes to fall asleep.';
  document.getElementById('res').classList.add('show');
}
