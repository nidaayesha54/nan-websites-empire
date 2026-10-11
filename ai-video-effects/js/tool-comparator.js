
const TOOLS = [
 {name:"Runway", cat:"ai", best:"Cinematic AI effects & generative video", free:"Yes — limited credits", price:"From ~$15/mo", ease:"Medium", pro:"Best-in-class motion quality", con:"Credits burn fast on long clips"},
 {name:"Luma Dream Machine", cat:"ai", best:"Realistic AI video + effects", free:"Yes — limited generations", price:"From ~$10/mo", ease:"Easy", pro:"Very natural motion", con:"Queue times on free tier"},
 {name:"Pika", cat:"ai", best:"Stylized effects & Pikaffects", free:"Yes — daily credits", price:"From ~$10/mo", ease:"Easy", pro:"Fun built-in effect templates", con:"Shorter clip lengths"},
 {name:"Sora (OpenAI)", cat:"ai", best:"High-fidelity text-to-video", free:"Limited", price:"Via ChatGPT plans", ease:"Easy", pro:"Strong prompt adherence", con:"Availability varies by region"},
 {name:"Google Flow / Veo", cat:"ai", best:"Google's cinematic AI video", free:"Trial credits", price:"Via Google AI plans", ease:"Easy", pro:"Excellent realism", con:"Newest — features still rolling out"},
 {name:"CapCut", cat:"editor", best:"Free mobile/desktop editing + AI effects", free:"Yes — generous", price:"Free / Pro ~$8/mo", ease:"Very easy", pro:"Huge free effect library", con:"Some AI features need Pro"},
 {name:"DaVinci Resolve", cat:"editor", best:"Pro color + Fusion effects", free:"Yes — full free version", price:"Free / Studio $295 once", ease:"Hard", pro:"Hollywood-grade, free", con:"Steep learning curve"},
 {name:"Adobe After Effects", cat:"editor", best:"Industry-standard motion graphics", free:"7-day trial", price:"From ~$23/mo", ease:"Hard", pro:"Unlimited creative control", con:"Subscription cost + learning curve"},
 {name:"Kling", cat:"ai", best:"Longer AI clips, good value", free:"Yes — daily credits", price:"From ~$10/mo", ease:"Easy", pro:"Longer durations per credit", con:"UI less polished"},
 {name:"HeyGen", cat:"ai", best:"AI avatars & talking-head effects", free:"Yes — limited", price:"From ~$29/mo", ease:"Very easy", pro:"Best avatar realism", con:"Niche use case"}
];
function rowHTML(t){
  return '<tr data-cat="'+t.cat+'"><td><b>'+t.name+'</b></td><td>'+t.best+'</td><td>'+t.free+'</td><td>'+t.price+'</td><td>'+t.ease+'</td><td class="pros">'+t.pro+'</td><td class="cons">'+t.con+'</td></tr>';
}
function render(filter){
  var html='';
  TOOLS.forEach(function(t){ if(filter==='all'||t.cat===filter){ html+=rowHTML(t); } });
  document.getElementById('cmp-body').innerHTML=html;
  var n=document.querySelectorAll('#cmp-body tr').length;
  document.getElementById('cmp-count').textContent=n+' tool'+(n===1?'':'s')+' shown';
}
document.addEventListener('DOMContentLoaded',function(){
  render('all');
  document.querySelectorAll('[data-filter]').forEach(function(el){
    el.addEventListener('click',function(){
      document.querySelectorAll('[data-filter]').forEach(function(x){x.classList.remove('sel');});
      el.classList.add('sel');
      render(el.getAttribute('data-filter'));
    });
  });
});
