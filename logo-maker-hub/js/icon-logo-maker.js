(function(){
var ICONS={
 star:{label:'Star',d:'M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17l-6.2 3.9 1.6-7L2 9.2l7.1-.6z'},
 bolt:{label:'Bolt',d:'M13 2L4 14h6l-1 8 9-12h-6l1-8z'},
 leaf:{label:'Leaf',d:'M20 4C10 4 4 10 4 20c10 0 16-6 16-16zM7 17c2-5 5-8 9-10'},
 heart:{label:'Heart',d:'M12 21C7 16.5 3 13 3 8.8 3 6 5.2 4 7.8 4c1.7 0 3.2.9 4.2 2.2C13 4.9 14.5 4 16.2 4 18.8 4 21 6 21 8.8c0 4.2-4 7.7-9 12.2z'},
 triangle:{label:'Triangle',d:'M12 3l10 18H2z'},
 hexagon:{label:'Hexagon',d:'M12 2l8.7 5v10L12 22l-8.7-5V7z'},
 crown:{label:'Crown',d:'M3 8l4 4 5-6 5 6 4-4v9H3z'},
 diamond:{label:'Diamond',d:'M12 2l8 8-8 12L4 10z'},
 shield:{label:'Shield',d:'M12 2l8 3v6c0 5-3.5 9.3-8 11-4.5-1.7-8-6-8-11V5z'},
 moon:{label:'Moon',d:'M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z'},
 circle:{label:'Circle',circle:true}
};
var S={icon:'star',iconColor:'#6c3df5',fg:'#15122b',bg:'#ffffff',name:'Acme Co',tagline:'',layout:'top',iconSize:110,textSize:56};
var svgEl=document.getElementById('logo-svg');
function iconSvg(cx,cy,s,color){
  var k=Object.keys(ICONS).indexOf(S.icon);
  var d=ICONS[S.icon];
  if(d.circle){return '<circle cx="'+cx+'" cy="'+cy+'" r="'+(s/2)+'" fill="'+color+'"/>';}
  var sc=s/24;
  return '<g transform="translate('+(cx-s/2)+','+(cy-s/2)+') scale('+sc+')"><path d="'+d.d+'" fill="'+color+'"/></g>';
}
function build(){
  var W=800,H=440;
  var esc=S.name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  var escTag=S.tagline.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  var parts='<rect width="'+W+'" height="'+H+'" fill="'+S.bg+'"/>';
  var textY,iconCx,iconCy,tagY;
  if(S.layout==='top'){
    iconCx=W/2;iconCy=H/2-70;textY=H/2+70;tagY=H/2+112;
    parts+=iconSvg(iconCx,iconCy,S.iconSize,S.iconColor);
    parts+='<text x="'+(W/2)+'" y="'+textY+'" text-anchor="middle" font-family="\'Arial Black\',Arial,sans-serif" font-size="'+S.textSize+'" font-weight="900" fill="'+S.fg+'">'+esc+'</text>';
  }else{
    iconCx=140;iconCy=H/2;textY=H/2+20;tagY=H/2+58;
    parts+=iconSvg(iconCx,iconCy,S.iconSize,S.iconColor);
    parts+='<text x="230" y="'+textY+'" text-anchor="start" font-family="\'Arial Black\',Arial,sans-serif" font-size="'+S.textSize+'" font-weight="900" fill="'+S.fg+'">'+esc+'</text>';
  }
  if(S.tagline){parts+='<text x="'+(S.layout==='top'?W/2:230)+'" y="'+tagY+'" text-anchor="'+(S.layout==='top'?'middle':'start')+'" font-family="Arial,sans-serif" font-size="20" letter-spacing="5" fill="'+S.fg+'" opacity="0.7">'+escTag+'</text>';}
  svgEl.innerHTML=parts;
}
var grid=document.getElementById('icon-grid');
Object.keys(ICONS).forEach(function(key){
  var d=document.createElement('div');d.className='icon-pick'+(key===S.icon?' sel':'');d.dataset.key=key;d.title=ICONS[key].label;
  var s='<svg viewBox="0 0 24 24">'+(ICONS[key].circle?'<circle cx="12" cy="12" r="10" fill="#6c3df5"/>':'<path d="'+ICONS[key].d+'" fill="#6c3df5"/>')+'</svg>';
  d.innerHTML=s+'<div style="font-size:.7rem;color:#5b5770;margin-top:4px">'+ICONS[key].label+'</div>';
  d.addEventListener('click',function(){S.icon=key;grid.querySelectorAll('.icon-pick').forEach(function(x){x.classList.remove('sel');});d.classList.add('sel');build();});
  grid.appendChild(d);
});
function serialize(){var c=svgEl.cloneNode(true);c.setAttribute('xmlns','http://www.w3.org/2000/svg');c.setAttribute('width','800');c.setAttribute('height','440');return new XMLSerializer().serializeToString(c);}
function download(url,name){var a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();}
document.getElementById('dl-svg').addEventListener('click',function(){var b=new Blob([serialize()],{type:'image/svg+xml'});download(URL.createObjectURL(b),(S.name||'logo').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.svg');});
document.getElementById('dl-png').addEventListener('click',function(){var b=new Blob([serialize()],{type:'image/svg+xml'});var url=URL.createObjectURL(b);var img=new Image();img.onload=function(){var cv=document.createElement('canvas');cv.width=1600;cv.height=880;var ctx=cv.getContext('2d');ctx.drawImage(img,0,0,1600,880);URL.revokeObjectURL(url);download(cv.toDataURL('image/png'),(S.name||'logo').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.png');};img.src=url;});
function bind(id,key){var el=document.getElementById(id);el.addEventListener('input',function(){S[key]=el.value;build();});}
bind('in-name','name');bind('in-tagline','tagline');bind('in-icon','iconColor');bind('in-fg','fg');bind('in-bg','bg');
var ts=document.getElementById('in-textsize');ts.addEventListener('input',function(){S.textSize=+ts.value;document.getElementById('ts-val').textContent=S.textSize+'px';build();});
var is=document.getElementById('in-iconsize');is.addEventListener('input',function(){S.iconSize=+is.value;document.getElementById('is-val').textContent=S.iconSize+'px';build();});
document.querySelectorAll('input[name=layout]').forEach(function(r){r.addEventListener('change',function(){S.layout=r.value;build();});});
build();
})();
