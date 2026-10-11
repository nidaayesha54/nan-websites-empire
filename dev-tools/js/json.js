// JSON formatter / validator / minifier
(function(){
  const input = document.getElementById('jsonInput');
  const output = document.getElementById('jsonOutput');
  const msg = document.getElementById('jsonMsg');
  function setMsg(text, ok){
    msg.className = 'msg ' + (ok ? 'ok' : 'err');
    msg.textContent = text;
  }
  function parse(){
    const raw = input.value;
    if(!raw.trim()){ setMsg('Paste some JSON first.', false); return null; }
    try{
      return { value: JSON.parse(raw) };
    }catch(e){
      setMsg('Invalid JSON: ' + e.message, false);
      return null;
    }
  }
  document.getElementById('btnFormat').addEventListener('click', function(){
    const r = parse(); if(!r) return;
    output.textContent = JSON.stringify(r.value, null, 2);
    setMsg('Valid JSON — formatted with 2-space indentation.', true);
  });
  document.getElementById('btnMinify').addEventListener('click', function(){
    const r = parse(); if(!r) return;
    output.textContent = JSON.stringify(r.value);
    setMsg('Valid JSON — minified to one line.', true);
  });
  document.getElementById('btnValidate').addEventListener('click', function(){
    const r = parse(); if(!r) return;
    output.textContent = '';
    setMsg('Valid JSON. No errors found.', true);
  });
  document.getElementById('btnClear').addEventListener('click', function(){
    input.value=''; output.textContent=''; msg.className='msg'; msg.textContent='';
  });
  document.getElementById('btnCopy').addEventListener('click', function(){
    const t = output.textContent;
    if(!t){ setMsg('Nothing to copy yet.', false); return; }
    copyText(t, function(){ setMsg('Copied to clipboard.', true); });
  });
  function copyText(t, ok){
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(ok, function(){ fallbackCopy(t, ok); });
    } else { fallbackCopy(t, ok); }
  }
  function fallbackCopy(t, ok){
    const ta = document.createElement('textarea');
    ta.value = t; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); ok(); }catch(e){}
    document.body.removeChild(ta);
  }
  // Sample
  document.getElementById('btnSample').addEventListener('click', function(){
    input.value = '{\n  "name": "NAN Marketing Agency",\n  "services": ["UGC", "AI Video", "SEO"],\n  "founded": 2024,\n  "remote": true,\n  "contact": { "email": "hello@example.com", "whatsapp": "+1234567890" }\n}';
    msg.className='msg'; msg.textContent='';
  });
})();
