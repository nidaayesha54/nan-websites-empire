// Dog age calculator — size-based formula (AAHA/AVMA convention)
function calcDogAge(){
  var age=parseFloat(document.getElementById('dogAge').value);
  var size=document.getElementById('dogSize').value;
  if(isNaN(age)||age<0||age>25){ alert('Please enter a valid age (0-25).'); return; }
  var human;
  if(age<=1){ human=age*15; }
  else if(age<=2){ human=15+(age-1)*9; }
  else{
    var per=size==='small'?4:(size==='medium'?4.5:5);
    human=24+(age-2)*per;
  }
  var stage=human<20?'puppy / young':(human<50?'adult':'senior');
  var r=document.getElementById('result');
  r.classList.add('show');
  r.innerHTML='<h3>🐶 Result</h3><p class="big-num">'+Math.round(human)+' human years</p>'
    +'<p>Your '+age+'-year-old '+size+' dog is roughly <strong>'+Math.round(human)+'</strong> in human years — life stage: <strong>'+stage+'</strong>.</p>'
    +'<table><tr><th>Dog age</th><th>Human equivalent</th></tr>'
    +[1,2,3,5,7,10,12,15].filter(function(a){return a<=15;}).map(function(a){
      var h=a<=1?a*15:(a<=2?15+(a-1)*9:24+(a-2)*(size==='small'?4:(size==='medium'?4.5:5)));
      return '<tr'+(Math.abs(a-age)<0.01?' style="background:#fff3e2;font-weight:bold"':'')+'><td>'+a+' yr</td><td>'+Math.round(h)+' yrs</td></tr>';
    }).join('')+'</table>'
    +'<p class="disclaimer" style="margin-top:14px">Estimates only — aging varies by breed and health. Your vet can assess your dog\'s true life stage.</p>';
}
