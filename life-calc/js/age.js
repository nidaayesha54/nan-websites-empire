function isLeap(y){return (y%4===0 && y%100!==0) || (y%400===0);}
function calcAge(){
  var dobStr=document.getElementById('dob').value;
  if(!dobStr){alert('Please enter your date of birth.');return;}
  var parts=dobStr.split('-');
  var dob=new Date(+parts[0],+parts[1]-1,+parts[2]);
  var now=new Date();
  var today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  var dobDay=new Date(dob.getFullYear(),dob.getMonth(),dob.getDate());
  if(dobDay>today){alert('Date of birth cannot be in the future.');return;}
  var years=now.getFullYear()-dob.getFullYear();
  var months=now.getMonth()-dob.getMonth();
  var days=now.getDate()-dob.getDate();
  if(days<0){
    // Borrow days from preceding months (loop handles 29th-31st birthdays)
    var bMonth=now.getMonth(), bYear=now.getFullYear();
    while(days<0){
      months--;
      bMonth--;
      if(bMonth<0){bMonth=11;bYear--;}
      days+=new Date(bYear,bMonth+1,0).getDate();
    }
  }
  if(months<0){years--;months+=12;}
  var totalDays=Math.floor((today-dobDay)/86400000);
  // next birthday (Feb 29 -> Mar 1 in non-leap years)
  function bdayIn(y){
    if(dob.getMonth()===1&&dob.getDate()===29&&!isLeap(y))return new Date(y,2,1);
    return new Date(y,dob.getMonth(),dob.getDate());
  }
  var nextBday=bdayIn(now.getFullYear());
  if(nextBday<today)nextBday=bdayIn(now.getFullYear()+1);
  var daysTo=Math.round((nextBday-today)/86400000);
  document.getElementById('ageBig').textContent=years+' yrs '+months+' mo '+days+' days';
  document.getElementById('ageDetail').textContent=
    'That is '+fmt(totalDays)+' days ('+fmt(Math.floor(totalDays/7))+' weeks) since you were born.';
  var badge=document.getElementById('bdayBadge');
  if(daysTo===0){badge.textContent='🎉 Happy Birthday! Today is the day!';}
  else{badge.textContent='🎂 Next birthday in '+daysTo+' day'+(daysTo===1?'':'s')+' — you will turn '+(years+1)+'.';}
  document.getElementById('res').classList.add('show');
}
document.addEventListener('DOMContentLoaded',function(){
  var d=document.getElementById('dob');
  if(d){var t=new Date();d.max=t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');}
});
