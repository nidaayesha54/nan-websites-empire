/* Shared: FAQ accordion, footer year */
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".faq-q").forEach(q=>{
    q.addEventListener("click",()=>q.parentElement.classList.toggle("open"));
  });
  const y=document.getElementById("yr");if(y)y.textContent=new Date().getFullYear();
});
