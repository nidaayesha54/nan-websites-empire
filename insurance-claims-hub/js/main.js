document.addEventListener('DOMContentLoaded',function(){
  // Footer year
  document.querySelectorAll('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear();});
  // FAQ accordion smoothing (native details, nothing needed)
  // Active nav highlight
  var path=location.pathname;
  document.querySelectorAll('nav a').forEach(function(a){
    if(a.getAttribute('href') && path.endsWith(a.getAttribute('href'))) a.style.textDecoration='underline';
  });
});
function copyText(id){
  var el=document.getElementById(id);
  var txt=el.value!==undefined?el.value:el.innerText;
  navigator.clipboard.writeText(txt).then(function(){alert('Copied to clipboard!');});
}
function downloadText(id,filename){
  var el=document.getElementById(id);
  var txt=el.value!==undefined?el.value:el.innerText;
  var blob=new Blob([txt],{type:'text/plain'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download=filename;a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);},2000);
}
function fmtUSD(n){
  n=Number(n);
  if(isNaN(n))return '$0.00';
  return '$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
