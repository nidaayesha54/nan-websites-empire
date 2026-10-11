/* Shared helpers for all tools on this site */
function $(id){ return document.getElementById(id); }

function num(id){
  var el = $(id);
  if(!el) return NaN;
  var v = parseFloat(String(el.value).replace(/[$,%\s]/g,''));
  return isNaN(v) ? NaN : v;
}

function money(n, dec){
  if(!isFinite(n)) return '—';
  var d = (typeof dec === 'number') ? dec : 0;
  return '$' + n.toLocaleString('en-US',{minimumFractionDigits:d, maximumFractionDigits:d});
}

function pct(n, dec){
  if(!isFinite(n)) return '—';
  var d = (typeof dec === 'number') ? dec : 1;
  return n.toFixed(d) + '%';
}

/* Standard monthly mortgage payment: M = P*r*(1+r)^n / ((1+r)^n - 1) */
function mortgagePayment(principal, annualRatePct, years){
  var r = annualRatePct/100/12;
  var n = Math.round(years*12);
  if(!(principal>0) || !(n>0)) return NaN;
  if(r === 0) return principal/n;
  var f = Math.pow(1+r, n);
  return principal * r * f / (f - 1);
}

function setError(boxId, msg){
  var box = $(boxId);
  if(box){ box.innerHTML = '<div class="verdict bad">' + msg + '</div>'; }
}

/* Mobile nav toggle */
document.addEventListener('DOMContentLoaded', function(){
  var t = document.querySelector('.nav-toggle');
  var nav = document.getElementById('mainNav');
  if(t && nav){
    t.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
});
