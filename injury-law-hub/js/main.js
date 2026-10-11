document.addEventListener('DOMContentLoaded',function(){
  var y=document.getElementById('year'); if(y){y.textContent=new Date().getFullYear();}
  document.querySelectorAll('.faq details').forEach(function(d){
    d.addEventListener('toggle',function(){
      if(d.open){document.querySelectorAll('.faq details').forEach(function(o){if(o!==d&&o.open){o.open=false;}});}
    });
  });
});
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function fmtUSD(n){return '$'+Number(n).toLocaleString('en-US',{maximumFractionDigits:0});}
