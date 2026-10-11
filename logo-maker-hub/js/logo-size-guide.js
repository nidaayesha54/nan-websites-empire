(function(){
var DEFAULT_LOGO = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27400%27%3E%3Crect width=%27400%27 height=%27400%27 rx=%2780%27 fill=%27%236c3df5%27/%3E%3Ctext x=%27200%27 y=%27240%27 text-anchor=%27middle%27 font-family=%27Arial Black%27 font-size=%2790%27 fill=%27white%27%3EA%3C/text%3E%3C/svg%3E';
var targets=['sz-16','sz-32','sz-98','sz-180','sz-500'];
function setLogo(src){targets.forEach(function(id){var el=document.getElementById(id);if(el)el.src=src;});}
document.getElementById('file').addEventListener('change',function(e){
  var f=e.target.files[0];if(!f)return;
  var r=new FileReader();r.onload=function(){setLogo(r.result);};r.readAsDataURL(f);
});
document.getElementById('sample-btn').addEventListener('click',function(){setLogo(DEFAULT_LOGO);});
setLogo(DEFAULT_LOGO);
})();
