function calcBMI(){
  var h=parseFloat(document.getElementById('height').value);
  var w=parseFloat(document.getElementById('weight').value);
  if(!(h>0)||!(w>0)){alert('Please enter a valid height and weight.');return;}
  var m=h/100;
  var bmi=w/(m*m);
  var cat,cls,note;
  if(bmi<18.5){cat='Underweight';cls='blue';note='Below the healthy range. Consider talking to a healthcare professional about healthy weight gain.';}
  else if(bmi<25){cat='Normal — healthy weight';cls='green';note='Great — you are in the healthy range. Keep up balanced habits!';}
  else if(bmi<30){cat='Overweight';cls='orange';note='Above the healthy range. Small, steady lifestyle changes can help.';}
  else{cat='Obese';cls='red';note='Well above the healthy range. A healthcare professional can help you make a plan.';}
  document.getElementById('bmiBig').textContent=bmi.toFixed(1);
  var badge=document.getElementById('bmiBadge');
  badge.textContent=cat;badge.className='badge '+cls;
  document.getElementById('bmiDetail').textContent=note+' BMI = weight(kg) ÷ height(m)².';
  document.getElementById('res').classList.add('show');
}
