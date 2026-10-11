// FootballTransferHub shared scripts
(function(){
  "use strict";
  // FAQ accordion: close others on open (progressive enhancement)
  document.querySelectorAll('.faq-item summary').forEach(function(s){
    s.addEventListener('click',function(){
      var parent=s.closest('.faq-item');
      document.querySelectorAll('.faq-item').forEach(function(f){
        if(f!==parent)f.removeAttribute('open');
      });
    });
  });
})();
