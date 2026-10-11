// Color picker: HEX/RGB/HSL conversion + palette generator
(function(){
  const picker = document.getElementById('colorPicker');
  const hexIn = document.getElementById('hexInput');
  function clamp(n,a,b){ return Math.min(b, Math.max(a,n)); }
  function hexToRgb(h){
    h = h.replace('#','');
    if(h.length===3) h = h.split('').map(function(c){return c+c;}).join('');
    if(!/^[0-9a-fA-F]{6}$/.test(h)) return null;
    const n = parseInt(h,16);
    return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
  }
  function rgbToHex(r,g,b){
    return '#'+[r,g,b].map(function(v){ const s=clamp(Math.round(v),0,255).toString(16); return s.length===1?'0'+s:s; }).join('');
  }
  function rgbToHsl(r,g,b){
    r/=255; g/=255; b/=255;
    const mx=Math.max(r,g,b), mn=Math.min(r,g,b);
    let h=0,s=0,l=(mx+mn)/2;
    if(mx!==mn){
      const d=mx-mn;
      s = l>0.5 ? d/(2-mx-mn) : d/(mx+mn);
      if(mx===r) h=(g-b)/d+(g<b?6:0);
      else if(mx===g) h=(b-r)/d+2;
      else h=(r-g)/d+4;
      h*=60;
    }
    return { h:Math.round(h), s:Math.round(s*100), l:Math.round(l*100) };
  }
  function hslToRgb(h,s,l){
    h=((h%360)+360)%360; s=clamp(s,0,100)/100; l=clamp(l,0,100)/100;
    const c=(1-Math.abs(2*l-1))*s, x=c*(1-Math.abs((h/60)%2-1)), m=l-c/2;
    let r=0,g=0,b=0;
    if(h<60){r=c;g=x;} else if(h<120){r=x;g=c;} else if(h<180){g=c;b=x;}
    else if(h<240){g=x;b=c;} else if(h<300){r=x;b=c;} else {r=c;b=x;}
    return { r:Math.round((r+m)*255), g:Math.round((g+m)*255), b:Math.round((b+m)*255) };
  }
  function setFromHex(hex){
    const rgb = hexToRgb(hex);
    if(!rgb) return false;
    hex = rgbToHex(rgb.r,rgb.g,rgb.b);
    const hsl = rgbToHsl(rgb.r,rgb.g,rgb.b);
    picker.value = hex;
    hexIn.value = hex;
    document.getElementById('vHex').textContent = hex;
    document.getElementById('vRgb').textContent = 'rgb('+rgb.r+', '+rgb.g+', '+rgb.b+')';
    document.getElementById('vHsl').textContent = 'hsl('+hsl.h+', '+hsl.s+'%, '+hsl.l+'%)';
    document.getElementById('vRgbCss').textContent = rgb.r+', '+rgb.g+', '+rgb.b;
    renderPalette(hsl);
    return true;
  }
  function renderPalette(hsl){
    const box = document.getElementById('palette');
    box.innerHTML = '';
    const variants = [
      {name:'Base', h:hsl.h, s:hsl.s, l:hsl.l},
      {name:'Light', h:hsl.h, s:hsl.s, l:clamp(hsl.l+20,0,100)},
      {name:'Dark', h:hsl.h, s:hsl.s, l:clamp(hsl.l-20,0,100)},
      {name:'Complement', h:(hsl.h+180)%360, s:hsl.s, l:hsl.l},
      {name:'Analog +30', h:(hsl.h+30)%360, s:hsl.s, l:hsl.l},
      {name:'Analog -30', h:(hsl.h+330)%360, s:hsl.s, l:hsl.l},
      {name:'Triad +120', h:(hsl.h+120)%360, s:hsl.s, l:hsl.l},
      {name:'Triad +240', h:(hsl.h+240)%360, s:hsl.s, l:hsl.l}
    ];
    variants.forEach(function(v){
      const rgb = hslToRgb(v.h, v.s, v.l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const el = document.createElement('div');
      el.className = 'swatch';
      el.innerHTML = '<div class="c" style="background:'+hex+'"></div><div class="t">'+v.name+'<br>'+hex+'</div>';
      el.title = 'Click to copy ' + hex;
      el.addEventListener('click', function(){
        if(navigator.clipboard) navigator.clipboard.writeText(hex);
        setFromHex(hex);
      });
      box.appendChild(el);
    });
  }
  picker.addEventListener('input', function(){ setFromHex(picker.value); });
  document.getElementById('btnApplyHex').addEventListener('click', function(){
    let h = hexIn.value.trim();
    if(h && h[0]!=='#') h = '#'+h;
    if(!setFromHex(h)){
      hexIn.value = picker.value;
    }
  });
  // init
  setFromHex('#3fb950');
})();
