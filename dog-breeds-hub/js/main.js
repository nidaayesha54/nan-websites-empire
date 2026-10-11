/* DogBreedsHub — nav menu, FAQ accordion, footer year */
(function(){
  var menuBtn=document.getElementById("menuBtn");
  var navLinks=document.getElementById("navLinks");
  if(menuBtn&&navLinks){
    menuBtn.addEventListener("click",function(){navLinks.classList.toggle("open");});
  }
  var items=document.querySelectorAll(".faq-item");
  items.forEach(function(item){
    var q=item.querySelector(".faq-q");
    if(q){q.addEventListener("click",function(){item.classList.toggle("open");});}
  });
  var y=document.getElementById("year");
  if(y){y.textContent=new Date().getFullYear();}
})();
