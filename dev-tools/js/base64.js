// Base64 encoder / decoder (UTF-8 safe)
(function(){
  const input = document.getElementById('b64Input');
  const output = document.getElementById('b64Output');
  const msg = document.getElementById('b64Msg');
  function setMsg(text, ok){
    msg.className = 'msg ' + (ok ? 'ok' : 'err');
    msg.textContent = text;
  }
  function utf8Encode(s){ return btoa(unescape(encodeURIComponent(s))); }
  function utf8Decode(s){
    const clean = s.replace(/\s+/g,'');
    return decodeURIComponent(escape(atob(clean)));
  }
  document.getElementById('btnEncode').addEventListener('click', function(){
    const t = input.value;
    if(!t){ setMsg('Enter some text to encode.', false); return; }
    try{
      output.textContent = utf8Encode(t);
      setMsg('Encoded to Base64.', true);
    }catch(e){ setMsg('Encoding failed: ' + e.message, false); }
  });
  document.getElementById('btnDecode').addEventListener('click', function(){
    const t = input.value.trim();
    if(!t){ setMsg('Enter a Base64 string to decode.', false); return; }
    try{
      output.textContent = utf8Decode(t);
      setMsg('Decoded from Base64.', true);
    }catch(e){ setMsg('Invalid Base64 input.', false); }
  });
  document.getElementById('btnSwap').addEventListener('click', function(){
    const t = output.textContent;
    if(!t){ setMsg('Nothing to swap yet.', false); return; }
    input.value = t; output.textContent='';
    setMsg('Output moved to input — press Encode or Decode.', true);
  });
  document.getElementById('btnClearB').addEventListener('click', function(){
    input.value=''; output.textContent=''; msg.className='msg'; msg.textContent='';
  });
  document.getElementById('btnCopyB').addEventListener('click', function(){
    const t = output.textContent;
    if(!t){ setMsg('Nothing to copy yet.', false); return; }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(function(){ setMsg('Copied to clipboard.', true); });
    }
  });
})();
