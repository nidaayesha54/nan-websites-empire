document.addEventListener('DOMContentLoaded',function(){
  var steps=document.querySelectorAll('.timeline-step input[type=checkbox]');
  var bar=document.getElementById('progress-bar'),label=document.getElementById('progress-label');
  if(!steps.length){return;}
  var KEY='ilh-timeline-v1';
  function load(){
    try{var saved=JSON.parse(localStorage.getItem(KEY)||'[]');
      steps.forEach(function(cb,i){if(saved.indexOf(i)>-1){cb.checked=true;}});
    }catch(e){}
  }
  function save(){
    var done=[];steps.forEach(function(cb,i){if(cb.checked){done.push(i);}});
    try{localStorage.setItem(KEY,JSON.stringify(done));}catch(e){}
  }
  function paint(){
    var done=0;
    steps.forEach(function(cb){
      var wrap=cb.closest('.timeline-step');
      if(cb.checked){done++;wrap.classList.add('done');}else{wrap.classList.remove('done');}
    });
    var pct=Math.round(done/steps.length*100);
    if(bar){bar.style.width=pct+'%';}
    if(label){label.textContent=done+' of '+steps.length+' steps completed ('+pct+'%)';}
    save();
  }
  steps.forEach(function(cb){cb.addEventListener('change',paint);});
  load();paint();
  var reset=document.getElementById('reset-timeline');
  if(reset){reset.addEventListener('click',function(){
    steps.forEach(function(cb){cb.checked=false;});paint();
  });}
});
