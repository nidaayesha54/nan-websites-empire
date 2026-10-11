// Shared helpers for BillingSoftwareHub
document.addEventListener('DOMContentLoaded', function(){
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click', function(){
      q.parentElement.classList.toggle('open');
    });
  });
});
function fmtUSD(n){
  if(!isFinite(n)) return '—';
  return '$' + Math.round(n).toLocaleString('en-US');
}
function num(id, def){
  var v = parseFloat(document.getElementById(id).value);
  return isFinite(v) ? v : (def || 0);
}
