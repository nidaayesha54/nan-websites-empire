/* Shared helpers for AIPodcastVoice tools */
function $(id){ return document.getElementById(id); }

function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function words(n){ return Math.round(n).toLocaleString('en-US'); }

function mmss(totalSec){
  totalSec = Math.max(0, Math.round(totalSec));
  var m = Math.floor(totalSec/60), s = totalSec%60;
  return (m<10?'0':'')+m + ':' + (s<10?'0':'')+s;
}

function setError(boxId, msg){
  var box = $(boxId);
  if(box){ box.innerHTML = '<div class="verdict bad">' + msg + '</div>'; }
}

function copyText(text, btn){
  function done(){
    if(btn){ var old = btn.textContent; btn.textContent = 'Copied!'; setTimeout(function(){ btn.textContent = old; }, 1600); }
  }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done, function(){ fallback(); });
  } else { fallback(); }
  function fallback(){
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch(e){}
    document.body.removeChild(ta); done();
  }
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
