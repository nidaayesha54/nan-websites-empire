
document.addEventListener('DOMContentLoaded',function(){
  var t=document.querySelector('.nav-toggle'),n=document.querySelector('.site-nav');
  if(t&&n){t.addEventListener('click',function(){n.classList.toggle('show');});}
  document.querySelectorAll('.year').forEach(function(e){e.textContent=new Date().getFullYear();});
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q=item.querySelector('.faq-q');
    if(q){q.addEventListener('click',function(){item.classList.toggle('open');});}
  });
});
