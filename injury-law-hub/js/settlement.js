document.addEventListener('DOMContentLoaded',function(){
  var form=document.getElementById('settlement-form');
  if(!form){return;}
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var med=parseFloat(document.getElementById('med-bills').value)||0;
    var future=parseFloat(document.getElementById('future-med').value)||0;
    var wages=parseFloat(document.getElementById('lost-wages').value)||0;
    var mult=parseFloat(document.getElementById('multiplier').value)||2;
    var fault=parseFloat(document.getElementById('fault').value)||0;
    if(fault>100){fault=100;} if(fault<0){fault=0;}
    var economic=med+future+wages;
    var gross=economic*mult;
    var low=gross*0.7*(1-fault/100);
    var high=gross*1.3*(1-fault/100);
    if(low<0){low=0;} if(high<0){high=0;}
    document.getElementById('r-low').textContent=fmtUSD(low);
    document.getElementById('r-high').textContent=fmtUSD(high);
    document.getElementById('r-economic').textContent=fmtUSD(economic);
    document.getElementById('r-note').textContent=
      'Based on '+fmtUSD(economic)+' in documented losses, a '+mult+'x multiplier, and '+fault+'% fault assigned to you. '+
      'This is a rough informational range only — actual settlements depend on insurance limits, evidence, your state\'s laws, and many other factors.';
    var res=document.getElementById('result');
    res.classList.add('show');
    res.scrollIntoView({behavior:'smooth',block:'center'});
  });
});
