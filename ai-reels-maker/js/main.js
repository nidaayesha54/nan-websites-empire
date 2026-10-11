// AIReelsMaker shared JS
(function(){
  "use strict";
  window.copyText = function(text, btn){
    function done(){ if(btn){ var o=btn.textContent; btn.textContent="Copied!"; setTimeout(function(){btn.textContent=o;},1400);} }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(function(){ fallback(); });
    } else { fallback(); }
    function fallback(){
      var ta=document.createElement("textarea"); ta.value=text; document.body.appendChild(ta);
      ta.select(); try{ document.execCommand("copy"); }catch(e){}
      document.body.removeChild(ta); done();
    }
  };
})();
