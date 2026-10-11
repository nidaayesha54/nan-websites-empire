#!/usr/bin/env python3
"""Build script for LogoMakerHub static site. Regenerates all HTML/CSS/JS."""
import os

BASE = os.path.dirname(os.path.abspath(__file__))
DOMAIN = "https://nan-logomaker.surge.sh"

def w(rel, content):
    p = os.path.join(BASE, rel)
    with open(p, "w", encoding="utf-8") as f:
        f.write(content)

CSS = r"""*{box-sizing:border-box;margin:0;padding:0}
:root{--pri:#6c3df5;--pri2:#9a5cff;--dark:#15122b;--muted:#5b5770;--bg:#f7f6fd;--card:#fff;--line:#e8e5f5;--radius:16px}
body{font-family:'Segoe UI',system-ui,-apple-system,Arial,sans-serif;background:var(--bg);color:var(--dark);line-height:1.65}
.container{max-width:1100px;margin:0 auto;padding:0 20px}
.site-header{background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:50}
.nav-inner{display:flex;align-items:center;justify-content:space-between;padding:14px 20px}
.brand{font-weight:800;font-size:1.25rem;color:var(--dark);text-decoration:none}
.brand-mark{background:linear-gradient(135deg,var(--pri),var(--pri2));color:#fff;border-radius:10px;padding:4px 9px;margin-right:8px;font-size:1rem}
.site-nav{display:flex;gap:22px}
.site-nav a{text-decoration:none;color:var(--muted);font-weight:600;font-size:.95rem}
.site-nav a:hover,.site-nav a.active{color:var(--pri)}
.nav-toggle{display:none;background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--dark)}
.hero{background:linear-gradient(135deg,#2a1e63,#6c3df5 60%,#9a5cff);color:#fff;padding:70px 0;text-align:center}
.hero h1{font-size:2.6rem;line-height:1.2;margin-bottom:14px}
.hero .lead{font-size:1.12rem;opacity:.92;max-width:640px;margin:0 auto 26px}
.grad-text{background:linear-gradient(90deg,#ffd166,#ff8fa3);-webkit-background-clip:text;background-clip:text;color:transparent}
.btn{display:inline-block;padding:13px 28px;border-radius:999px;font-weight:700;text-decoration:none;cursor:pointer;border:none;font-size:1rem;transition:.2s}
.btn-primary{background:linear-gradient(135deg,var(--pri),var(--pri2));color:#fff}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(108,61,245,.35)}
.btn-ghost{background:rgba(255,255,255,.15);color:#fff;border:1px solid rgba(255,255,255,.5)}
.btn-ghost:hover{background:rgba(255,255,255,.28)}
.btn-dark{background:var(--dark);color:#fff}
.hero-cta{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.section{padding:56px 0}
.section-title{font-size:1.9rem;margin-bottom:8px;text-align:center}
.section-sub{text-align:center;color:var(--muted);max-width:640px;margin:0 auto 30px}
.grid{display:grid;gap:20px}
.grid-3{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:26px;transition:.2s}
.card:hover{transform:translateY(-4px);box-shadow:0 14px 30px rgba(21,18,43,.1)}
.card .icon{font-size:2rem;margin-bottom:10px}
.card h3{margin-bottom:8px;font-size:1.2rem}
.card h3 a{color:var(--dark);text-decoration:none}
.card h3 a:hover{color:var(--pri)}
.card p{color:var(--muted);font-size:.95rem;margin-bottom:14px}
.badge{display:inline-block;background:#efe9ff;color:var(--pri);font-size:.75rem;font-weight:700;padding:4px 12px;border-radius:999px;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px}
.card-link{color:var(--pri);font-weight:700;text-decoration:none}
.prose{max-width:760px;margin:0 auto;background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:36px}
.prose h1{font-size:2.1rem;margin-bottom:14px}
.prose h2{font-size:1.45rem;margin:30px 0 10px;color:var(--dark)}
.prose h3{font-size:1.15rem;margin:22px 0 8px}
.prose p{margin-bottom:14px;color:#33324a}
.prose ul,.prose ol{margin:0 0 16px 24px;color:#33324a}
.prose li{margin-bottom:8px}
.prose a{color:var(--pri)}
.breadcrumb{font-size:.85rem;color:var(--muted);margin-bottom:18px}
.breadcrumb a{color:var(--pri);text-decoration:none}
.faq{margin-top:34px}
.faq-item{background:#fff;border:1px solid var(--line);border-radius:12px;margin-bottom:12px;padding:18px 20px}
.faq-item h3{font-size:1.05rem;margin-bottom:6px}
.faq-item p{color:var(--muted);font-size:.95rem;margin:0}
.ad-slot{background:#efe9ff;border:1px dashed var(--pri2);border-radius:12px;color:var(--pri);text-align:center;padding:24px;margin:28px auto;font-size:.85rem;max-width:760px}
.tool-wrap{display:grid;grid-template-columns:320px 1fr;gap:24px;align-items:start}
.panel{background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:24px}
.panel h2{font-size:1.15rem;margin-bottom:14px}
.field{margin-bottom:16px}
.field label{display:block;font-weight:600;font-size:.9rem;margin-bottom:6px}
.field input[type=text],.field select{width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:10px;font-size:1rem}
.field input[type=color]{width:100%;height:42px;border:1px solid var(--line);border-radius:10px;cursor:pointer;background:#fff;padding:4px}
.field input[type=range]{width:100%}
.radio-row{display:flex;gap:8px;flex-wrap:wrap}
.radio-row label{border:1px solid var(--line);border-radius:999px;padding:8px 14px;font-size:.88rem;font-weight:600;cursor:pointer;color:var(--muted)}
.radio-row input{display:none}
.radio-row input:checked+label{background:var(--pri);color:#fff;border-color:var(--pri)}
.preview-stage{background:repeating-conic-gradient(#f0eefb 0% 25%,#fff 0% 50%) 0 0/32px 32px;border:1px solid var(--line);border-radius:var(--radius);min-height:340px;display:flex;align-items:center;justify-content:center;padding:30px;overflow:auto}
.preview-stage svg{max-width:100%;height:auto;box-shadow:0 8px 24px rgba(21,18,43,.12);border-radius:8px}
.dl-row{display:flex;gap:12px;margin-top:18px;flex-wrap:wrap}
.icon-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.icon-pick{border:2px solid var(--line);border-radius:10px;padding:10px;cursor:pointer;text-align:center;background:#fff}
.icon-pick svg{width:28px;height:28px;display:block;margin:0 auto}
.icon-pick.sel{border-color:var(--pri);background:#efe9ff}
.size-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:18px;margin-top:24px}
.size-card{background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:22px;text-align:center}
.size-card .box{min-height:120px;display:flex;align-items:center;justify-content:center;background:repeating-conic-gradient(#f0eefb 0% 25%,#fff 0% 50%) 0 0/24px 24px;border-radius:10px;margin-bottom:12px}
.size-card img{image-rendering:auto}
.size-card h3{font-size:1rem;margin-bottom:4px}
.size-card p{font-size:.82rem;color:var(--muted)}
.tip{background:#fff8e6;border:1px solid #f0d97a;border-radius:12px;padding:14px 18px;margin-top:18px;font-size:.92rem}
.site-footer{background:var(--dark);color:#b9b5d6;margin-top:60px;padding:44px 0 26px}
.footer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:24px;margin-bottom:26px}
.footer-grid h4{color:#fff;margin-bottom:12px;font-size:1rem}
.footer-grid a{color:#b9b5d6;text-decoration:none;font-size:.92rem;display:block;margin-bottom:8px}
.footer-grid a:hover{color:#fff}
.footer-bottom{border-top:1px solid #2c2850;padding-top:20px;font-size:.88rem;color:#8f8bb0}
.footer-bottom a{color:#cfc9f5;text-decoration:none}
.footer-bottom a:hover{text-decoration:underline}
@media(max-width:820px){
  .tool-wrap{grid-template-columns:1fr}
  .site-nav{display:none;flex-direction:column;gap:12px;position:absolute;top:100%;left:0;right:0;background:#fff;padding:16px 20px;border-bottom:1px solid var(--line)}
  .site-nav.open{display:flex}
  .nav-toggle{display:block}
  .hero h1{font-size:2rem}
  .prose{padding:24px 20px}
}
"""

FOOTER_NAV = {
    "Tools": [
        ("Text Logo Maker", "tools/text-logo-maker.html"),
        ("Icon Logo Maker", "tools/icon-logo-maker.html"),
        ("Logo Size Guide", "tools/logo-size-guide.html"),
    ],
    "Guides": [
        ("Free Logo Maker 2026", "guides/free-logo-maker-2026.html"),
        ("Make a Logo for Free", "guides/how-to-make-a-logo-for-free.html"),
        ("Logo Design Mistakes", "guides/logo-design-mistakes.html"),
    ],
    "Blog": [
        ("10 Free Logo Maker Tools Compared", "blog/free-logo-maker-tools-compared.html"),
        ("Logo Color Psychology", "blog/logo-color-psychology.html"),
    ],
}

def footer(root):
    cols = "".join(
        "<div><h4>%s</h4>%s</div>" % (k, "".join(
            '<a href="%s%s">%s</a>' % (root, href, label) for label, href in v))
        for k, v in FOOTER_NAV.items())
    return (
        '<footer class="site-footer"><div class="container">'
        '<div class="footer-grid">%s</div>'
        '<div class="footer-bottom">&copy; <span id="year">2026</span> LogoMakerHub. '
        'Built by <a href="https://nidaayesha.com" target="_blank" rel="noopener">NAN Marketing Agency</a>'
        ' | <span>Our sites: <a href="https://aivideodetector.site" target="_blank" rel="noopener">AI Video Detector</a>'
        ' &middot; <a href="https://epstopikpakistan.blogspot.com" target="_blank" rel="noopener">EpsTopik Pakistan</a></span>'
        "</div></div></footer>" % cols)

def header(root, active=""):
    def cls(name):
        return ' class="active"' if name == active else ""
    return (
        '<header class="site-header"><div class="container nav-inner">'
        '<a class="brand" href="%sindex.html"><span class="brand-mark">&#9998;</span> LogoMakerHub</a>'
        '<button class="nav-toggle" aria-label="Menu">&#9776;</button>'
        '<nav class="site-nav">'
        '<a href="%sindex.html"%s>Home</a>'
        '<a href="%stools/text-logo-maker.html"%s>Text Logo</a>'
        '<a href="%stools/icon-logo-maker.html"%s>Icon Logo</a>'
        '<a href="%stools/logo-size-guide.html"%s>Size Guide</a>'
        '<a href="%sguides/free-logo-maker-2026.html"%s>Guides</a>'
        '<a href="%sblog/free-logo-maker-tools-compared.html"%s>Blog</a>'
        "</nav></div></header>"
        % (root, root, cls("home"), root, cls("text"), root, cls("icon"),
           root, cls("size"), root, cls("guides"), root, cls("blog")))

def head(title, desc, keywords, canon, root, extra=""):
    return (
        "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n"
        "<meta charset=\"UTF-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"
        "<title>%s</title>\n"
        "<meta name=\"description\" content=\"%s\">\n"
        "<meta name=\"keywords\" content=\"%s\">\n"
        "<link rel=\"canonical\" href=\"%s\">\n"
        "<meta property=\"og:title\" content=\"%s\">\n"
        "<meta property=\"og:description\" content=\"%s\">\n"
        "<meta property=\"og:type\" content=\"website\">\n"
        "<link rel=\"stylesheet\" href=\"%scss/style.css\">\n"
        "%s\n</head>\n<body>\n" % (title, desc, keywords, canon, title, desc, root, extra))

def page(path, title, desc, keywords, canon, root, active, body, scripts=""):
    html = (head(title, desc, keywords, canon, root)
            + header(root, active) + "<main>" + body + "</main>"
            + footer(root)
            + '<script src="%sjs/main.js"></script>\n%s\n</body>\n</html>' % (root, scripts))
    w(path, html)

ADSLOT = '<div class="ad-slot"><!-- AD-SLOT --><br>Advertisement</div>'

JS_MAIN = r"""document.addEventListener('DOMContentLoaded',function(){var t=document.querySelector('.nav-toggle'),n=document.querySelector('.site-nav');if(t&&n){t.addEventListener('click',function(){n.classList.toggle('open');});}var y=document.getElementById('year');if(y){y.textContent=new Date().getFullYear();}});
"""

JS_TEXT_LOGO = r"""(function(){
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
"""

JS_ICON_LOGO = r"""(function(){
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
"""

SAMPLE_LOGO = ("data:image/svg+xml," +
  "%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27400%27%3E"
  "%3Crect width=%27400%27 height=%27400%27 rx=%2780%27 fill=%27%236c3df5%27/%3E"
  "%3Ctext x=%27200%27 y=%27240%27 text-anchor=%27middle%27 font-family=%27Arial Black%27 font-size=%2790%27 fill=%27white%27%3EA%3C/text%3E%3C/svg%3E")

JS_SIZE_GUIDE = r"""(function(){
var DEFAULT_LOGO = %s;
var targets=['sz-16','sz-32','sz-98','sz-180','sz-500'];
function setLogo(src){targets.forEach(function(id){var el=document.getElementById(id);if(el)el.src=src;});}
document.getElementById('file').addEventListener('change',function(e){
  var f=e.target.files[0];if(!f)return;
  var r=new FileReader();r.onload=function(){setLogo(r.result);};r.readAsDataURL(f);
});
document.getElementById('sample-btn').addEventListener('click',function(){setLogo(DEFAULT_LOGO);});
setLogo(DEFAULT_LOGO);
})();
""" % ("'" + SAMPLE_LOGO + "'")

# ---------- INDEX ----------
FAQ_JSONLD = '''<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"Is LogoMakerHub really free?","acceptedAnswer":{"@type":"Answer","text":"Yes. Every tool on LogoMakerHub runs entirely in your browser and is 100%% free, with SVG and PNG downloads and no watermark."}},
{"@type":"Question","name":"What format should I download my logo in?","acceptedAnswer":{"@type":"Answer","text":"SVG for anything scalable (websites, print, merchandise) and PNG for quick digital use. SVG is a vector format, so it stays sharp at any size."}},
{"@type":"Question","name":"Can I use my logo commercially?","acceptedAnswer":{"@type":"Answer","text":"Yes — logos you create here are yours to use commercially. For trademark protection of a brand name, consider registering it with your local trademark office."}},
{"@type":"Question","name":"Do I need design skills to make a logo here?","acceptedAnswer":{"@type":"Answer","text":"No. Pick a tool, type your business name, choose a style or icon, and download — the whole process takes under two minutes."}}
]}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","name":"LogoMakerHub","url":"%s","description":"Free logo maker tools and guides: text logos, icon logos, and logo size guides.","potentialAction":{"@type":"SearchAction","target":"%s/?s={search_term_string}","query-input":"required name=search_term_string"}}
</script>''' % (DOMAIN, DOMAIN)

INDEX_BODY = (
'<section class="hero"><div class="container">'
'<h1>Free <span class="grad-text">Logo Maker</span> Tools &amp; Guides</h1>'
'<p class="lead">Design a professional logo in minutes — right in your browser. Pick a style, customize colors, preview live, and download SVG or PNG. No signup, no watermark, 100% free.</p>'
'<div class="hero-cta"><a class="btn btn-primary" href="tools/text-logo-maker.html">Make a Text Logo</a>'
'<a class="btn btn-ghost" href="tools/icon-logo-maker.html">Make an Icon Logo</a></div>'
'</div></section>'
'<section class="section"><div class="container">'
'<h2 class="section-title">Free Logo Tools</h2>'
'<p class="section-sub">Client-side logo makers that work instantly — nothing to install, nothing to pay for.</p>'
'<div class="grid grid-3">'
'<div class="card"><span class="badge">Most popular</span><div class="icon">&#9998;</div>'
'<h3><a href="tools/text-logo-maker.html">Text Logo Maker</a></h3>'
'<p>Type your business name, pick from 6 typography styles, customize colors, and download a crisp SVG logo in seconds.</p>'
'<a class="card-link" href="tools/text-logo-maker.html">Create a text logo &rarr;</a></div>'
'<div class="card"><div class="icon">&#11088;</div>'
'<h3><a href="tools/icon-logo-maker.html">Icon Logo Maker</a></h3>'
'<p>Combine 11 vector icons (star, bolt, leaf, crown, shield&hellip;) with your brand name. Choose layout, colors, and download.</p>'
'<a class="card-link" href="tools/icon-logo-maker.html">Create an icon logo &rarr;</a></div>'
'<div class="card"><div class="icon">&#128269;</div>'
'<h3><a href="tools/logo-size-guide.html">Logo Size Guide</a></h3>'
'<p>Upload your logo and see exactly how it looks as a 16px favicon, social profile picture, app icon, and print file.</p>'
'<a class="card-link" href="tools/logo-size-guide.html">Check your logo sizes &rarr;</a></div>'
'</div></div></section>'
'<section class="section" style="background:#fff;border-top:1px solid var(--line);border-bottom:1px solid var(--line)"><div class="container">'
'<h2 class="section-title">Learn Logo Design</h2>'
'<p class="section-sub">Practical, SEO-researched guides that help your brand look professional from day one.</p>'
'<div class="grid grid-3">'
'<div class="card"><div class="icon">&#128214;</div>'
'<h3><a href="guides/free-logo-maker-2026.html">Free Logo Maker 2026</a></h3>'
'<p>The definitive roundup of genuinely free logo makers in 2026 — what&rsquo;s actually free vs. what charges at download.</p>'
'<a class="card-link" href="guides/free-logo-maker-2026.html">Read the guide &rarr;</a></div>'
'<div class="card"><div class="icon">&#128736;</div>'
'<h3><a href="guides/how-to-make-a-logo-for-free.html">How to Make a Logo for Free</a></h3>'
'<p>A step-by-step walkthrough: from naming and style choice to downloading a print-ready file in under 10 minutes.</p>'
'<a class="card-link" href="guides/how-to-make-a-logo-for-free.html">Read the guide &rarr;</a></div>'
'<div class="card"><div class="icon">&#9888;</div>'
'<h3><a href="guides/logo-design-mistakes.html">Logo Design Mistakes to Avoid</a></h3>'
'<p>The 10 mistakes that make logos look amateur — and how to fix each one before your customers ever see it.</p>'
'<a class="card-link" href="guides/logo-design-mistakes.html">Read the guide &rarr;</a></div>'
'</div></div></section>'
'<section class="section"><div class="container" style="max-width:800px">'
'<h2 class="section-title">Frequently Asked Questions</h2>'
'<p class="section-sub">Quick answers about making logos for free.</p>'
'<div class="faq">'
'<div class="faq-item"><h3>Is LogoMakerHub really free?</h3><p>Yes. Every tool on LogoMakerHub runs entirely in your browser and is 100% free, with SVG and PNG downloads and no watermark.</p></div>'
'<div class="faq-item"><h3>What format should I download my logo in?</h3><p>SVG for anything scalable (websites, print, merchandise) and PNG for quick digital use. SVG is a vector format, so it stays sharp at any size.</p></div>'
'<div class="faq-item"><h3>Can I use my logo commercially?</h3><p>Yes &mdash; logos you create here are yours to use commercially. For trademark protection of a brand name, consider registering it with your local trademark office.</p></div>'
'<div class="faq-item"><h3>Do I need design skills to make a logo here?</h3><p>No. Pick a tool, type your business name, choose a style or icon, and download &mdash; the whole process takes under two minutes.</p></div>'
'</div></div></section>')

# ---------- TOOL PAGES ----------
TEXT_LOGO_BODY = (
'<section class="section"><div class="container">'
'<div class="breadcrumb"><a href="../index.html">Home</a> &rsaquo; Text Logo Maker</div>'
'<h1 class="section-title" style="text-align:left">Free Text Logo Maker</h1>'
'<p class="section-sub" style="text-align:left;margin:0 0 26px;max-width:none">Type your business name, choose a typography style, and download a crisp SVG or PNG logo &mdash; free, no signup, no watermark.</p>'
'<div class="tool-wrap">'
'<div class="panel"><h2>Customize</h2>'
'<div class="field"><label for="in-name">Business name</label><input type="text" id="in-name" value="Acme Co" maxlength="30"></div>'
'<div class="field"><label for="in-tagline">Tagline (optional)</label><input type="text" id="in-tagline" placeholder="e.g. QUALITY SINCE 2026" maxlength="40"></div>'
'<div class="field"><label>Style</label><div class="radio-row">'
'<input type="radio" name="style" id="st-bold" value="bold" checked><label for="st-bold">Bold</label>'
'<input type="radio" name="style" id="st-script" value="script"><label for="st-script">Script</label>'
'<input type="radio" name="style" id="st-outline" value="outline"><label for="st-outline">Outline</label>'
'<input type="radio" name="style" id="st-minimal" value="minimal"><label for="st-minimal">Minimal</label>'
'<input type="radio" name="style" id="st-serif" value="serif"><label for="st-serif">Serif</label>'
'<input type="radio" name="style" id="st-gradient" value="gradient"><label for="st-gradient">Gradient</label>'
'</div></div>'
'<div class="field"><label>Alignment</label><div class="radio-row">'
'<input type="radio" name="align" id="al-c" value="center" checked><label for="al-c">Center</label>'
'<input type="radio" name="align" id="al-l" value="left"><label for="al-l">Left</label>'
'</div></div>'
'<div class="field"><label for="in-fg">Text color</label><input type="color" id="in-fg" value="#6c3df5"></div>'
'<div class="field"><label for="in-bg">Background color</label><input type="color" id="in-bg" value="#ffffff"></div>'
'<div class="field"><label for="in-size">Font size: <span id="size-val">64px</span></label><input type="range" id="in-size" min="32" max="120" value="64"></div>'
'</div>'
'<div><div class="preview-stage"><svg id="logo-svg" width="800" height="400" viewBox="0 0 800 400" role="img" aria-label="Logo preview"></svg></div>'
'<div class="dl-row"><button class="btn btn-primary" id="dl-svg">Download SVG</button>'
'<button class="btn btn-dark" id="dl-png">Download PNG</button></div>'
'<div class="tip">&#128161; <strong>Tip:</strong> SVG is a vector format &mdash; it stays razor-sharp at any size, from favicon to billboard. Use it for your website, business cards, and print. Read our <a href="../guides/how-to-make-a-logo-for-free.html">free logo guide</a> for the full workflow.</div>'
'</div></div></div></section>'
+ ADSLOT)

ICON_LOGO_BODY = (
'<section class="section"><div class="container">'
'<div class="breadcrumb"><a href="../index.html">Home</a> &rsaquo; Icon Logo Maker</div>'
'<h1 class="section-title" style="text-align:left">Free Icon Logo Maker</h1>'
'<p class="section-sub" style="text-align:left;margin:0 0 26px;max-width:none">Pick a vector icon, pair it with your brand name, fine-tune colors and layout, then download SVG or PNG &mdash; free forever.</p>'
'<div class="tool-wrap">'
'<div class="panel"><h2>Customize</h2>'
'<div class="field"><label>Choose an icon</label><div class="icon-grid" id="icon-grid"></div></div>'
'<div class="field"><label for="in-name">Business name</label><input type="text" id="in-name" value="Acme Co" maxlength="30"></div>'
'<div class="field"><label for="in-tagline">Tagline (optional)</label><input type="text" id="in-tagline" placeholder="e.g. EST. 2026" maxlength="40"></div>'
'<div class="field"><label>Layout</label><div class="radio-row">'
'<input type="radio" name="layout" id="ly-top" value="top" checked><label for="ly-top">Icon above text</label>'
'<input type="radio" name="layout" id="ly-left" value="left"><label for="ly-left">Icon left of text</label>'
'</div></div>'
'<div class="field"><label for="in-icon">Icon color</label><input type="color" id="in-icon" value="#6c3df5"></div>'
'<div class="field"><label for="in-fg">Text color</label><input type="color" id="in-fg" value="#15122b"></div>'
'<div class="field"><label for="in-bg">Background color</label><input type="color" id="in-bg" value="#ffffff"></div>'
'<div class="field"><label for="in-iconsize">Icon size: <span id="is-val">110px</span></label><input type="range" id="in-iconsize" min="60" max="180" value="110"></div>'
'<div class="field"><label for="in-textsize">Text size: <span id="ts-val">56px</span></label><input type="range" id="in-textsize" min="28" max="100" value="56"></div>'
'</div>'
'<div><div class="preview-stage"><svg id="logo-svg" width="800" height="440" viewBox="0 0 800 440" role="img" aria-label="Icon logo preview"></svg></div>'
'<div class="dl-row"><button class="btn btn-primary" id="dl-svg">Download SVG</button>'
'<button class="btn btn-dark" id="dl-png">Download PNG</button></div>'
'<div class="tip">&#128161; <strong>Tip:</strong> an icon mark makes your logo recognizable even at tiny sizes. Test yours with our <a href="logo-size-guide.html">logo size checker</a> before you publish.</div>'
'</div></div></div></section>'
+ ADSLOT)

SIZE_GUIDE_BODY = (
'<section class="section"><div class="container">'
'<div class="breadcrumb"><a href="../index.html">Home</a> &rsaquo; Logo Size Guide</div>'
'<h1 class="section-title" style="text-align:left">Logo Size Checker &amp; Guide</h1>'
'<p class="section-sub" style="text-align:left;margin:0 0 26px;max-width:none">Upload your logo (or use the sample) and see how it holds up at the sizes that matter: browser favicon, social profiles, app icons, and print.</p>'
'<div class="panel" style="max-width:760px"><h2>Your logo</h2>'
'<div class="field"><label for="file">Upload a logo image (PNG, JPG, SVG)</label><input type="file" id="file" accept="image/*"></div>'
'<div class="dl-row"><button class="btn btn-dark" id="sample-btn">Use sample logo</button></div></div>'
'<div class="size-grid">'
'<div class="size-card"><div class="box"><img id="sz-16" width="16" height="16" alt="16px favicon preview"></div><h3>Favicon &mdash; 16&times;16px</h3><p>Browser tab icon. Simple shapes survive; fine text disappears.</p></div>'
'<div class="size-card"><div class="box"><img id="sz-32" width="32" height="32" alt="32px favicon preview"></div><h3>Retina favicon &mdash; 32&times;32px</h3><p>High-DPI tab and bookmark icon.</p></div>'
'<div class="size-card"><div class="box"><img id="sz-98" width="98" height="98" alt="98px social profile preview" style="border-radius:50%"></div><h3>Social profile &mdash; ~98&times;98px</h3><p>Instagram / Facebook / X display picture (shown circular).</p></div>'
'<div class="size-card"><div class="box"><img id="sz-180" width="120" height="120" alt="app icon preview" style="border-radius:24px"></div><h3>App icon &mdash; 180&times;180px</h3><p>iOS app icon base size; rounded corners applied by the OS.</p></div>'
'<div class="size-card"><div class="box"><img id="sz-500" width="200" height="200" alt="print preview"></div><h3>Print / large &mdash; 500px+</h3><p>For print, export at 300 DPI (a 2-inch logo = 600px). Always keep a vector SVG master.</p></div>'
'</div>'
'<div class="tip">&#128161; <strong>Rule of thumb:</strong> if your logo is readable at 16px, it works everywhere. If text vanishes, use your icon mark alone at small sizes &mdash; make one with our <a href="icon-logo-maker.html">icon logo maker</a>.</div>'
'</div></section>'
+ ADSLOT)

# ---------- GUIDES ----------
GUIDE_FAQ = {
 "g1": [("What is the best truly free logo maker?","Browser-based tools like the ones on LogoMakerHub are truly free — no account, no watermark, no paywall at download. Many big-name 'free' logo makers charge $20–$60 to unlock downloads."),
        ("Can I trademark a free logo?","You can trademark a brand name, but trademark offices generally require the logo to be original. Simple text and generic icons are harder to protect — consult a trademark attorney for your market.")],
 "g2": [("How long does it take to make a logo for free?","With a free online tool, 5–10 minutes: pick a style, type your name, choose colors, and download. The strategy (name, colors, testing sizes) is what takes the thought."),
        ("What file format do I need for a logo?","Get an SVG (vector) master for scalability plus a PNG for everyday digital use. Ask a printer for a CMYK PDF if you run physical signage.")],
 "g3": [("What is the biggest logo design mistake?","Using a low-resolution raster file everywhere. One blurry stretched logo on a website or sign undoes all your branding work — always keep a vector SVG master."),
        ("How many colors should a logo have?","One to three. Logos with more than three colors look cluttered, cost more to print, and fail at small sizes.")],
}

def guide_faq_html(items):
    out = '<div class="faq"><h2>Frequently asked questions</h2>'
    for q, a in items:
        out += '<div class="faq-item"><h3>%s</h3><p>%s</p></div>' % (q, a)
    return out + "</div>"

def guide_faq_jsonld(items):
    ent = ",".join('{"@type":"Question","name":"%s","acceptedAnswer":{"@type":"Answer","text":"%s"}}' % (q.replace('"',''), a.replace('"','')) for q, a in items)
    return '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[%s]}</script>' % ent

GUIDES = [
("guides/free-logo-maker-2026.html", "Best Free Logo Makers in 2026 (Truly Free, No Watermark)", "The best free logo makers of 2026 — genuinely free tools with SVG/PNG downloads, no watermark, and no paywall at checkout.", "free logo maker 2026, best free logo maker, logo maker no watermark, free logo download",
'''<div class="breadcrumb"><a href="../index.html">Home</a> &rsaquo; Guides &rsaquo; Free Logo Maker 2026</div>
<h1>Best Free Logo Makers in 2026 (Truly Free, No Watermark)</h1>
<p>Searching for a <strong>free logo maker</strong> in 2026 is frustrating: half the tools that advertise "free" slap on a watermark or demand $20–$60 at the download screen. This guide separates the genuinely free tools from the freemium traps, so you can make a professional logo without spending a cent.</p>
<h2>What "truly free" means</h2>
<p>A genuinely free logo maker lets you: design in the browser, preview everything, and download usable files (SVG or high-res PNG) with no watermark and no forced signup. If a tool hides the download button behind a paywall, it is not free — it is a trial.</p>
<h2>Our picks for 2026</h2>
<h3>1. LogoMakerHub tools (this site) — free, no signup</h3>
<p>Our <a href="../tools/text-logo-maker.html">text logo maker</a> and <a href="../tools/icon-logo-maker.html">icon logo maker</a> run entirely in your browser. Six typography styles, eleven vector icons, custom colors, and instant SVG + PNG downloads. No account, no watermark, no upsell — the whole thing is the free tier.</p>
<h3>2. Canva Logo Maker — free with account</h3>
<p>Canva's free plan includes thousands of logo templates and free PNG downloads. Downsides: you need an account, many premium elements cost money, and exported logos are raster-only on the free plan. Great for brainstorming; weaker for print.</p>
<h3>3. Looka (trial) — paywalled at download</h3>
<p>Looka's AI generates beautiful concepts for free, but downloading any usable file starts around $20. Use it for inspiration, not for a free final logo.</p>
<h3>4. Hatchful by Shopify — free, retired features</h3>
<p>Hatchful was a solid free option, but Shopify has wound it down. If you find a working mirror, exports are free — just verify the files are high resolution.</p>
<h3>5. Inkscape — free professional vector editor</h3>
<p>If you want total control and are willing to learn, Inkscape (open-source Illustrator alternative) makes genuinely professional logos for free. The learning curve is the price you pay.</p>
<h2>Free vs. freemium: the honest comparison</h2>
<ul>
<li><strong>Truly free tools</strong> give you final files with no strings — best for startups, side projects, and MVPs.</li>
<li><strong>Freemium tools</strong> are better design playgrounds with bigger template libraries, but budget $20–$65 if you want the download.</li>
<li><strong>AI logo generators</strong> produce striking concepts fast, but check the license: some retain rights to generated marks.</li>
</ul>
<h2>How to pick the right one</h2>
<ol>
<li>Start with a truly free tool and export an SVG master — you can always redesign later.</li>
<li>Test the logo at 16px with our <a href="../tools/logo-size-guide.html">logo size checker</a>. If it fails there, simplify.</li>
<li>Avoid the <a href="logo-design-mistakes.html">10 classic logo design mistakes</a> before you publish.</li>
<li>When revenue arrives, consider a designer for a full brand system — your free logo got you to market, which is the point.</li>
</ol>
<p>Ready to start? <a href="../tools/text-logo-maker.html">Make your free logo now</a> — it takes about two minutes. For the full process, see <a href="how-to-make-a-logo-for-free.html">how to make a logo for free</a>.</p>'''),
("guides/how-to-make-a-logo-for-free.html", "How to Make a Logo for Free: Step-by-Step Guide (2026)", "Learn how to make a logo for free in 2026 — a step-by-step guide from naming and style to downloading a print-ready SVG file.", "how to make a logo for free, create logo free, free logo design steps, make logo online free",
'''<div class="breadcrumb"><a href="../index.html">Home</a> &rsaquo; Guides &rsaquo; How to Make a Logo for Free</div>
<h1>How to Make a Logo for Free: Step-by-Step Guide</h1>
<p>You can make a professional logo for free in under ten minutes. This guide walks through the exact steps — from choosing a name treatment to exporting files you can actually use — using free tools only.</p>
<h2>Step 1: Lock in your name treatment</h2>
<p>Decide exactly how your brand name appears: capitalization, spacing, and whether you include a tagline. "Acme Co" and "ACME CO" read very differently. Write it down and stay consistent everywhere.</p>
<h2>Step 2: Choose a style that matches your industry</h2>
<ul>
<li><strong>Bold sans-serif</strong> — tech, fitness, modern services.</li>
<li><strong>Script</strong> — beauty, weddings, boutique brands.</li>
<li><strong>Serif</strong> — law, finance, heritage brands.</li>
<li><strong>Minimal / outline</strong> — startups, portfolios, premium minimalism.</li>
</ul>
<p>Open our <a href="../tools/text-logo-maker.html">free text logo maker</a>, type your name, and click through the six styles to compare them side by side.</p>
<h2>Step 3: Add an icon mark (optional but powerful)</h2>
<p>An icon makes your logo recognizable at favicon size and on social profiles. In the <a href="../tools/icon-logo-maker.html">icon logo maker</a>, pick a simple shape — star, bolt, leaf, shield — in one brand color. Simple beats clever: the best icons are readable at 16 pixels.</p>
<h2>Step 4: Pick your colors deliberately</h2>
<p>One primary color plus one neutral is enough. Blue signals trust, green signals growth, black signals luxury, orange signals energy. Keep contrast high — your logo must work on both light and dark backgrounds. (Deeper dive: <a href="../blog/logo-color-psychology.html">logo color psychology</a>.)</p>
<h2>Step 5: Test every size that matters</h2>
<p>Upload your design to the <a href="../tools/logo-size-guide.html">logo size checker</a> and inspect it as a 16px favicon, a circular social avatar, and a large print file. If the text vanishes at small sizes, create a simplified icon-only version — most major brands maintain one.</p>
<h2>Step 6: Download the right files</h2>
<ul>
<li><strong>SVG</strong> — your master file. Vector, infinitely scalable, tiny file size. Use for web and print.</li>
<li><strong>PNG (transparent)</strong> — for social media, documents, and anywhere SVG is not accepted.</li>
<li><strong>Favicon</strong> — export a 32px PNG or ICO for the browser tab.</li>
</ul>
<p>Both downloads are one click in our tools — <a href="../tools/text-logo-maker.html">get your SVG now</a>.</p>
<h2>Step 7: Avoid the classic mistakes</h2>
<p>Before you publish, run through <a href="logo-design-mistakes.html">the 10 logo design mistakes to avoid</a> — most free logos fail for the same handful of fixable reasons.</p>'''),
("guides/logo-design-mistakes.html", "10 Logo Design Mistakes to Avoid (With Fixes)", "The 10 most common logo design mistakes beginners make — too many colors, unreadable fonts, low-res files — and how to fix each one.", "logo design mistakes, logo mistakes to avoid, bad logo design, logo design tips",
'''<div class="breadcrumb"><a href="../index.html">Home</a> &rsaquo; Guides &rsaquo; Logo Design Mistakes</div>
<h1>10 Logo Design Mistakes to Avoid (With Fixes)</h1>
<p>Most amateur-looking logos fail for the same ten reasons. The good news: every one of them is fixable in minutes, for free. Work through this checklist before your logo goes public.</p>
<h2>1. Using a low-resolution file everywhere</h2>
<p>A stretched, blurry logo on your website screams amateur. <strong>Fix:</strong> always keep a vector SVG master and export PNGs at 2–3x the display size.</p>
<h2>2. Too many colors</h2>
<p>Four-plus colors look cluttered and cost more to print. <strong>Fix:</strong> one primary color plus one neutral. Test the logo in pure black and white — it should still work.</p>
<h2>3. Unreadable typography</h2>
<p>Overly decorative fonts vanish at small sizes. <strong>Fix:</strong> check legibility at 16px with our <a href="../tools/logo-size-guide.html">size checker</a>; prefer clean letterforms.</p>
<h2>4. Copying a competitor</h2>
<p>"Inspired by" too closely is a legal and branding risk. <strong>Fix:</strong> list three things that make your brand different, and let one of them shape the mark.</p>
<h2>5. No small-size version</h2>
<p>A detailed logo that works on a sign becomes mush as a favicon. <strong>Fix:</strong> design an icon-only variant for avatars and favicons — make one in our <a href="../tools/icon-logo-maker.html">icon logo maker</a>.</p>
<h2>6. Relying on gradients and effects</h2>
<p>Bevels, shadows, and rainbow gradients date fast and fail in single-color uses (embroidery, stamps, fax). <strong>Fix:</strong> design flat first; add effects only as a secondary variant.</p>
<h2>7. Ignoring clear space</h2>
<p>Cramming the logo against text or edges looks chaotic. <strong>Fix:</strong> keep padding around the logo equal to at least the height of one letter.</p>
<h2>8. Trendy for trend's sake</h2>
<p>Chasing this year's aesthetic guarantees a redesign next year. <strong>Fix:</strong> choose timeless shapes; express trends in campaigns, not the logo.</p>
<h2>9. No monochrome version</h2>
<p>If your logo only works in full color, you will struggle with receipts, stamps, and single-color merch. <strong>Fix:</strong> export a one-color version on day one.</p>
<h2>10. Skipping the trademark check</h2>
<p>Falling in love with a name or mark someone else owns is expensive. <strong>Fix:</strong> search your country's trademark database before printing anything.</p>
<p>Build it right from the start: <a href="../tools/text-logo-maker.html">create your free logo</a> and follow <a href="how-to-make-a-logo-for-free.html">the step-by-step process</a>.</p>'''),
]

# ---------- BLOG ----------
BLOG = [
("blog/free-logo-maker-tools-compared.html", "10 Free Logo Maker Tools Compared: What's Actually Free in 2026?", "We compared 10 free logo maker tools in 2026 — which ones are truly free, which hide paywalls, and which give you SVG downloads.", "free logo maker tools compared, best free logo maker 2026, logo maker comparison",
'''<div class="breadcrumb"><a href="../index.html">Home</a> &rsaquo; Blog &rsaquo; Free Logo Maker Tools Compared</div>
<h1>10 Free Logo Maker Tools Compared: What&rsquo;s Actually Free in 2026?</h1>
<p class="section-sub" style="text-align:left;margin:0 0 20px">Published October 2026 &middot; 6 min read</p>
<p>"Free logo maker" is one of the most misleading phrases on the internet. We tested ten popular tools and scored each on one question: <strong>can you walk away with a usable logo file without paying?</strong></p>
<h2>The scorecard</h2>
<ul>
<li><strong>LogoMakerHub</strong> — Truly free. SVG + PNG, no signup, no watermark. Best for: fast, clean text and icon logos.</li>
<li><strong>Canva</strong> — Free with account; PNG downloads free, no SVG on free plan. Best for: template browsing.</li>
<li><strong>Adobe Express</strong> — Free tier with watermark-free PNG exports. Best for: Adobe ecosystem users.</li>
<li><strong>Looka</strong> — Free to design, ~$20+ to download. Best for: AI concept inspiration only.</li>
<li><strong>Tailor Brands</strong> — Free preview, paid downloads from ~$4/month. Best for: full brand kits if you pay.</li>
<li><strong>Wix Logo Maker</strong> — Free to design, paid downloads. Best for: Wix site owners.</li>
<li><strong>DesignEvo</strong> — Free low-res downloads; high-res costs. Best for: quick drafts.</li>
<li><strong>Ucraft</strong> — Free SVG downloads historically; verify current terms. Best for: simple vector marks.</li>
<li><strong>LogoMakr</strong> — Free low-res, paid high-res. Best for: experimenting.</li>
<li><strong>Inkscape</strong> — 100% free professional vector editor. Best for: DIY designers willing to learn.</li>
</ul>
<h2>Our verdict</h2>
<p>If you need a finished, usable logo today at zero cost, use a truly free browser tool (like ours) and export an SVG master. If you want AI-generated concepts and have $20–$65 to spend, the freemium AI tools earn their price. Either way, run the result through our <a href="../tools/logo-size-guide.html">logo size checker</a> before publishing — and skim the <a href="../guides/logo-design-mistakes.html">mistakes checklist</a>.</p>
<p>Related: <a href="../guides/free-logo-maker-2026.html">Best free logo makers in 2026</a> &middot; <a href="../tools/text-logo-maker.html">Make a text logo free</a></p>'''),
("blog/logo-color-psychology.html", "Logo Color Psychology: What Your Brand Colors Say (2026 Guide)", "Logo color psychology explained: what red, blue, green, black, and other brand colors communicate — and how to pick yours.", "logo color psychology, brand colors meaning, best colors for logo, logo color guide",
'''<div class="breadcrumb"><a href="../index.html">Home</a> &rsaquo; Blog &rsaquo; Logo Color Psychology</div>
<h1>Logo Color Psychology: What Your Brand Colors Say</h1>
<p class="section-sub" style="text-align:left;margin:0 0 20px">Published October 2026 &middot; 5 min read</p>
<p>Color is the fastest signal your logo sends — customers form impressions in milliseconds, before reading a single letter. Here is what the most common brand colors communicate, and how to choose.</p>
<h2>What each color says</h2>
<ul>
<li><strong>Blue</strong> — trust, stability, professionalism. The default for tech, finance, and healthcare.</li>
<li><strong>Red</strong> — energy, urgency, appetite. Food brands, sales, entertainment.</li>
<li><strong>Green</strong> — growth, health, nature. Eco brands, wellness, finance.</li>
<li><strong>Black</strong> — luxury, power, sophistication. Fashion, premium services.</li>
<li><strong>Orange</strong> — friendliness, creativity, value. Startups, kids' brands.</li>
<li><strong>Purple</strong> — imagination, premium, wisdom. Beauty, creative agencies.</li>
<li><strong>Yellow</strong> — optimism, attention. Use sparingly — it strains at small sizes.</li>
</ul>
<h2>How to pick yours</h2>
<ol>
<li>Choose <strong>one primary color</strong> that matches your industry's expectations — or deliberately breaks them to stand out.</li>
<li>Add <strong>one neutral</strong> (charcoal, white, warm gray) for text and backgrounds.</li>
<li>Test the logo in <strong>black and white</strong>. If it fails there, the color is doing too much work.</li>
<li>Check contrast: your logo must stay readable on light <em>and</em> dark backgrounds.</li>
</ol>
<p>Try combinations live in our <a href="../tools/text-logo-maker.html">text logo maker</a> or <a href="../tools/icon-logo-maker.html">icon logo maker</a> — the color pickers update the preview instantly. For the full workflow, see <a href="../guides/how-to-make-a-logo-for-free.html">how to make a logo for free</a>.</p>'''),
]

def main():
    w("css/style.css", CSS)
    w("js/main.js", JS_MAIN)
    w("js/text-logo-maker.js", JS_TEXT_LOGO)
    w("js/icon-logo-maker.js", JS_ICON_LOGO)
    w("js/logo-size-guide.js", JS_SIZE_GUIDE)

    page("index.html",
         "Free Logo Maker 2026 — Text & Icon Logo Tools, No Watermark | LogoMakerHub",
         "LogoMakerHub is a 100% free logo maker: design text logos and icon logos in your browser, preview live, and download SVG or PNG with no watermark and no signup.",
         "free logo maker, free logo maker 2026, make a logo free, logo maker no watermark, free logo download, text logo maker, icon logo maker",
         DOMAIN + "/",
         "", "home",
         INDEX_BODY + FAQ_JSONLD.replace("</script>", "</scr"+"ipt>") if False else INDEX_BODY,
         "")

    # index needs FAQ JSON-LD appended properly; rewrite below
    with open(os.path.join(BASE, "index.html"), "r", encoding="utf-8") as f:
        idx = f.read()
    idx = idx.replace("</head>", FAQ_JSONLD + "\n</head>", 1)
    with open(os.path.join(BASE, "index.html"), "w", encoding="utf-8") as f:
        f.write(idx)

    page("tools/text-logo-maker.html",
         "Free Text Logo Maker — 6 Styles, SVG Download, No Watermark",
         "Free text logo maker: type your business name, choose from bold, script, outline, minimal, serif, or gradient styles, and download SVG or PNG instantly.",
         "text logo maker, free text logo maker, business name logo, typography logo maker, free logo svg download",
         DOMAIN + "/tools/text-logo-maker.html",
         "../", "text", TEXT_LOGO_BODY,
         '<script src="../js/text-logo-maker.js"></script>')

    page("tools/icon-logo-maker.html",
         "Free Icon Logo Maker — 11 Vector Icons + Text, SVG Download",
         "Free icon logo maker: combine star, bolt, leaf, crown, shield and more vector icons with your brand name. Customize colors and layout, download SVG or PNG.",
         "icon logo maker, free icon logo maker, logo with icon, vector logo maker, free logo svg",
         DOMAIN + "/tools/icon-logo-maker.html",
         "../", "icon", ICON_LOGO_BODY,
         '<script src="../js/icon-logo-maker.js"></script>')

    page("tools/logo-size-guide.html",
         "Logo Size Checker — Favicon, Social & Print Preview Guide",
         "Free logo size checker: upload your logo and preview it as a 16px favicon, social profile picture, app icon, and print file — with size recommendations.",
         "logo size guide, logo size checker, favicon size, logo dimensions, social media logo size",
         DOMAIN + "/tools/logo-size-guide.html",
         "../", "size", SIZE_GUIDE_BODY,
         '<script src="../js/logo-size-guide.js"></script>')

    for path, title, desc, kw, body in GUIDES:
        key = {"free-logo-maker-2026": "g1", "how-to-make-a-logo-for-free": "g2",
               "logo-design-mistakes": "g3"}[os.path.basename(path).replace(".html", "")]
        items = GUIDE_FAQ[key]
        full = ('<section class="section"><div class="container"><article class="prose">'
                + body + guide_faq_html(items) + "</article></div></section>" + ADSLOT)
        page(path, title + " | LogoMakerHub", desc, kw,
             DOMAIN + "/" + path, "../", "guides", full, "")
        p = os.path.join(BASE, path)
        with open(p, encoding="utf-8") as f:
            h = f.read()
        h = h.replace("</head>", guide_faq_jsonld(items) + "\n</head>", 1)
        with open(p, "w", encoding="utf-8") as f:
            f.write(h)

    for path, title, desc, kw, body in BLOG:
        full = ('<section class="section"><div class="container"><article class="prose">'
                + body + "</article></div></section>" + ADSLOT)
        page(path, title + " | LogoMakerHub", desc, kw,
             DOMAIN + "/" + path, "../", "blog", full, "")

    print("done")

main()
