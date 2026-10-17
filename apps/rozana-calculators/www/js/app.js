/* Tab switching + bilingual toggle. Offline-safe. */
'use strict';

function switchTab(id, btn){
  document.querySelectorAll('.tabpanel').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('nav.tabs button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  window.scrollTo(0,0);
  // Policy-safe interstitial hook: at most 1 per 2 minutes (handled in admob.js)
  if(window.AdMob && typeof window.AdMob.maybeInterstitial==='function'){
    window.AdMob.maybeInterstitial();
  }
}

function setLang(l){
  LANG = l;
  document.documentElement.lang = l;
  document.querySelectorAll('[data-en]').forEach(el=>{
    el.textContent = el.getAttribute(l==='ur' ? 'data-ur' : 'data-en');
  });
  document.querySelectorAll('[data-en-ph]').forEach(el=>{
    el.placeholder = el.getAttribute(l==='ur' ? 'data-ur-ph' : 'data-en-ph');
  });
  document.querySelectorAll('main .card, footer.appfoot').forEach(el=>{
    el.classList.toggle('ur', l==='ur');
  });
  document.getElementById('langBtn').textContent = l==='ur' ? 'EN' : 'اردو';
  try{ localStorage.setItem('rz_lang', l); }catch(e){}
}

document.getElementById('langBtn').addEventListener('click', ()=>{
  setLang(LANG==='ur' ? 'en' : 'ur');
});

(function init(){
  let saved='ur';
  try{ saved = localStorage.getItem('rz_lang') || 'ur'; }catch(e){}
  setLang(saved);
})();
