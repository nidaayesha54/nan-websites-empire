/* FAQ accordion */
(function(){
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('.faq-q').forEach(function(q){
      q.addEventListener('click',function(){
        q.parentElement.classList.toggle('open');
      });
    });
  });
})();
