/* AdMob integration — PREPARED, NOT ACTIVATED.
   Paste your real IDs where ADMOB_SETUP.md says, then rebuild.
   Until real IDs are pasted, every call below is a safe no-op. */
'use strict';

window.AdMob = (function(){
  // ── GOOGLE TEST IDs — show test ads only, earn nothing. Replace with real
  // IDs from your AdMob account (see ADMOB_SETUP.md) to earn real money. ──
  var BANNER_ID      = 'ca-app-pub-3940256099942544/6300978111'; // banner ad unit (test)
  var INTERSTITIAL_ID= 'ca-app-pub-3940256099942544/1033173712'; // interstitial ad unit (test)
  // App ID (ca-app-pub-3940256099942544~3347511713, test) is in package.json
  // cordova.plugins.admob-plus-cordova.APP_ID_ANDROID — see ADMOB_SETUP.md

  var INTERSTITIAL_MIN_GAP_MS = 2*60*1000; // max 1 interstitial per 2 minutes (policy-safe)
  var lastInterstitial = 0;
  var banner = null;

  function isPlaceholder(id){ return !id || id.indexOf('XXXX') !== -1; }
  function ready(){ return (typeof admob !== 'undefined'); }

  async function init(){
    if(isPlaceholder(BANNER_ID) && isPlaceholder(INTERSTITIAL_ID)) return; // not configured yet
    if(!ready()) return;
    try{
      await admob.start();
      if(!isPlaceholder(BANNER_ID)){
        banner = new admob.BannerAd({ adUnitId: BANNER_ID });
        await banner.show();
      }
      if(!isPlaceholder(INTERSTITIAL_ID)){
        await admob.InterstitialAd.load({ adUnitId: INTERSTITIAL_ID });
      }
    }catch(e){ /* ads must never break the app */ }
  }

  async function maybeInterstitial(){
    if(isPlaceholder(INTERSTITIAL_ID) || !ready()) return;
    var now = Date.now();
    if(now - lastInterstitial < INTERSTITIAL_MIN_GAP_MS) return; // capped
    lastInterstitial = now;
    try{
      var inter = new admob.InterstitialAd({ adUnitId: INTERSTITIAL_ID });
      await inter.load();
      await inter.show();
    }catch(e){}
  }

  document.addEventListener('deviceready', init, false);
  // Fallback for plain browser testing (no-op without the plugin)
  if(document.readyState === 'complete'){ setTimeout(function(){ if(!ready()) return; }, 500); }

  return { maybeInterstitial: maybeInterstitial, init: init };
})();
