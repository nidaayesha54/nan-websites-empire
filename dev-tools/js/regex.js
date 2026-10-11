// Regex tester with live highlighting
(function(){
  const pat = document.getElementById('rxPattern');
  const flags = document.getElementById('rxFlags');
  const text = document.getElementById('rxText');
  const out = document.getElementById('rxOut');
  const msg = document.getElementById('rxMsg');
  const count = document.getElementById('rxCount');
  function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function run(){
    const p = pat.value;
    const f = flags.value;
    const t = text.value;
    if(!p){ out.textContent = esc(t) || '(type a pattern and some test text)'; count.textContent=''; msg.className='msg'; msg.textContent=''; return; }
    let re;
    try{ re = new RegExp(p, f); }
    catch(e){
      msg.className='msg err'; msg.textContent='Invalid regex: '+e.message;
      out.textContent = esc(t); count.textContent='';
      return;
    }
    msg.className='msg'; msg.textContent='';
    if(!t){ out.textContent='(enter test text above)'; count.textContent=''; return; }
    const matches = [];
    if(f.indexOf('g')>=0){
      let m; const rx = new RegExp(p, f);
      while((m = rx.exec(t))!==null){
        matches.push({i:m.index, s:m[0]});
        if(m[0]==='') rx.lastIndex++;
        if(matches.length>500) break;
      }
    } else {
      const m = t.match(re);
      if(m) matches.push({i:m.index, s:m[0]});
    }
    if(matches.length===0){
      out.textContent = esc(t);
      count.textContent = 'No matches found.';
      return;
    }
    let html='', last=0;
    matches.forEach(function(mt){
      html += esc(t.slice(last, mt.i));
      html += '<mark class="hl">'+esc(mt.s)+'</mark>';
      last = mt.i + mt.s.length;
    });
    html += esc(t.slice(last));
    out.innerHTML = html;
    count.textContent = matches.length + (matches.length===1?' match':' matches') + ' found.';
  }
  ['input','change'].forEach(function(ev){
    pat.addEventListener(ev, run);
    flags.addEventListener(ev, run);
    text.addEventListener(ev, run);
  });
  document.getElementById('btnRxSample').addEventListener('click', function(){
    pat.value = '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b';
    flags.value = 'gi';
    text.value = 'Contact us at hello@example.com or support@test-site.org for help.';
    run();
  });
  run();
})();
