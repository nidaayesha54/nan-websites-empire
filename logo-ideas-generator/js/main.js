/* LogoIdeasGenerator — shared site JS */
(function(){
  // Active nav link
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.links a').forEach(function(a){
    var href = a.getAttribute('href').split('/').pop() || 'index.html';
    if(href === path) a.classList.add('active');
  });
  // FAQ accordion nicety: only one open at a time on index
  var faqs = document.querySelectorAll('.faq details');
  faqs.forEach(function(d){
    d.querySelector('summary').addEventListener('click', function(){
      faqs.forEach(function(o){ if(o!==d) o.open = false; });
    });
  });
})();
