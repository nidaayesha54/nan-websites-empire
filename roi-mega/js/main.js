// ROICalcHub shared helpers
(function(){
  'use strict';
  // FAQ accordion
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.faq-q').forEach(function(btn){
      btn.addEventListener('click', function(){
        var item = btn.closest('.faq-item');
        item.classList.toggle('open');
      });
    });
  });
})();

// Format helpers (global)
function fmtMoney(v){
  var n = Number(v);
  if(!isFinite(n)) return '—';
  return (n<0?'-$':'$') + Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
}
function fmtPct(v, d){
  var n = Number(v);
  if(!isFinite(n)) return '—';
  return n.toFixed(d===undefined?2:d) + '%';
}
function num(id){
  var el = document.getElementById(id);
  if(!el) return 0;
  var v = parseFloat(String(el.value).replace(/,/g,''));
  return isFinite(v) ? v : 0;
}
