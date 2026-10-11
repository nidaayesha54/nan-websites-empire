(function(){
var S={name:'Acme Co',style:'bold',fg:'#6c3df5',bg:'#ffffff',tagline:'',size:64,align:'center'};
var svgEl=document.getElementById('logo-svg');
var FONTS={bold:"'Arial Black','Arial',sans-serif",script:"'Brush Script MT','Segoe Script',cursive",outline:"'Arial',sans-serif",minimal:"'Helvetica Neue','Arial',sans-serif",serif:"'Georgia','Times New Roman',serif",gradient:"'Arial Black','Arial',sans-serif"};
function build(){
  var W=800,H=400;
  var x=S.align==='center'?W/2:60,anchor=S.align==='center'?'middle':'start';
  var ty=S.tagline?H/2-30:H/2+10;
  var defs='',fill=S.fg,textStyle='';
  if(S.style==='gradient'){
    defs='<defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+S.fg+'"/><stop offset="1" stop-color="'+shade(S.fg,-40)+'"/></linearGradient></defs>';
    fill='url(#lg)';
  }else if(S.style==='outline'){fill='none';textStyle=' stroke="'+S.fg+'" stroke-width="2.5"';}
  var weight=S.style==='bold'||S.style==='gradient'?'900':'400';
  var spacing=S.style==='minimal'?' letter-spacing="10"':'';
  var fstyl=S.style==='script'?' font-style="italic"':'';
  var esc=S.name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  var escTag=S.tagline.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  var taglineSvg=S.tagline?'<text x="'+x+'" y="'+(H/2+52)+'" text-anchor="'+anchor+'" font-family="\'Arial\',sans-serif" font-size="22" letter-spacing="6" fill="'+S.fg+'" opacity="0.75">'+escTag+'</text>':'';
  svgEl.innerHTML=defs+'<rect width="'+W+'" height="'+H+'" fill="'+S.bg+'"/>'
    +'<text x="'+x+'" y="'+ty+'" text-anchor="'+anchor+'" font-family="'+FONTS[S.style]+'" font-size="'+S.size+'" font-weight="'+weight+'" fill="'+fill+'"'+textStyle+spacing+fstyl+'>'+esc+'</text>'+taglineSvg;
}
function shade(hex,p){var n=hex.replace('#','');var r=parseInt(n.substr(0,2),16),g=parseInt(n.substr(2,2),16),b=parseInt(n.substr(4,2),16);var t=p<0?0:255,a=Math.abs(p)/100;r=Math.round((t-r)*a+r);g=Math.round((t-g)*a+g);b=Math.round((t-b)*a+b);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}
function serialize(){var c=svgEl.cloneNode(true);c.setAttribute('xmlns','http://www.w3.org/2000/svg');c.setAttribute('width','800');c.setAttribute('height','400');return new XMLSerializer().serializeToString(c);}
function download(url,name){var a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();}
document.getElementById('dl-svg').addEventListener('click',function(){
  var blob=new Blob([serialize()],{type:'image/svg+xml'});download(URL.createObjectURL(blob),(S.name||'logo').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.svg');
});
document.getElementById('dl-png').addEventListener('click',function(){
  var blob=new Blob([serialize()],{type:'image/svg+xml'});var url=URL.createObjectURL(blob);var img=new Image();
  img.onload=function(){var cv=document.createElement('canvas');cv.width=1600;cv.height=800;var ctx=cv.getContext('2d');ctx.drawImage(img,0,0,1600,800);URL.revokeObjectURL(url);download(cv.toDataURL('image/png'),(S.name||'logo').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.png');};
  img.src=url;
});
function bind(id,key){var el=document.getElementById(id);el.addEventListener('input',function(){S[key]=el.value;build();});}
bind('in-name','name');bind('in-tagline','tagline');bind('in-fg','fg');bind('in-bg','bg');
var sizeEl=document.getElementById('in-size');sizeEl.addEventListener('input',function(){S.size=+sizeEl.value;document.getElementById('size-val').textContent=S.size+'px';build();});
document.querySelectorAll('input[name=style]').forEach(function(r){r.addEventListener('change',function(){S.style=r.value;build();});});
document.querySelectorAll('input[name=align]').forEach(function(r){r.addEventListener('change',function(){S.align=r.value;build();});});
build();
})();
