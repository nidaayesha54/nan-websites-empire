// Shared site behavior: FAQ accordions + footer year.
document.addEventListener("DOMContentLoaded", function(){
  var yr = document.getElementById("yr");
  if(yr) yr.textContent = new Date().getFullYear();
  document.querySelectorAll(".faq-q").forEach(function(q){
    q.addEventListener("click", function(){
      q.parentElement.classList.toggle("open");
    });
  });
});
