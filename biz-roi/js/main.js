/* BizROI — shared: FAQ accordion */
document.addEventListener('click',function(e){
  var q=e.target.closest('.faq-q');
  if(q){q.parentElement.classList.toggle('open');}
});
