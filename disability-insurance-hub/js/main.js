// InsuranceToolsHub shared JS: FAQ accordion, year, helpers
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click',function(){ q.parentElement.classList.toggle('open'); });
  });
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
});
function money(n){ return '$'+Math.round(n).toLocaleString('en-US'); }
function num(id){ var v=parseFloat(document.getElementById(id).value); return isNaN(v)?0:v; }
function val(id){ return document.getElementById(id).value; }
function show(id){ document.getElementById(id).classList.add('show'); }
