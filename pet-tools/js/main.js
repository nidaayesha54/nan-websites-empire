// PetToolsHub shared JS
document.addEventListener('DOMContentLoaded',function(){
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
  var btn=document.getElementById('menuBtn');
  if(btn){ btn.addEventListener('click',function(){ document.getElementById('navLinks').classList.toggle('open'); }); }
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click',function(){
      var item=q.parentElement, was=item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(i){i.classList.remove('open');});
      if(!was) item.classList.add('open');
    });
  });
});
function money(n){ return '$'+Number(n).toLocaleString('en-US',{maximumFractionDigits:0}); }
