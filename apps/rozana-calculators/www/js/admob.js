/* AdMob integration — PREPARED, NOT ACTIVATED.
   Paste your real IDs where ADMOB_SETUP.md says, then rebuild.
   Until real IDs are pasted, every call below is a safe no-op. */
'use strict';

window.AdMob = (function(){
  // ── PLACEHOLDERS — replace with real IDs from your AdMob account ──
  var BANNER_ID      = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'; // banner ad unit
  var INTERSTITIAL_ID= 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'; // interstitial ad unit
  // App ID (ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXX) goes in package.json
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
