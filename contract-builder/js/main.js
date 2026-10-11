// ContractBuilder shared JS: FAQ accordion + helpers
(function(){
  document.querySelectorAll('.faq-item .faq-q').forEach(function(q){
    q.addEventListener('click', function(){
      var item = q.parentElement;
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(o){ o.classList.remove('open'); });
      if(!wasOpen) item.classList.add('open');
    });
  });
})();
function esc(s){
  return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function val(id){ var el=document.getElementById(id); return el?el.value.trim():''; }
function todayStr(){
  var d=new Date();
  return d.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
}
