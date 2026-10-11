// Placeholder generators: lorem ipsum, sample JSON, UUID, password, slug
(function(){
  const type = document.getElementById('genType');
  const count = document.getElementById('genCount');
  const out = document.getElementById('genOut');
  const LOREM = ('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.').split('. ');
  function lorem(n){
    const paras=[];
    for(let i=0;i<n;i++){
      const start = (i*3)%LOREM.length;
      const words = LOREM.slice(start, start+6).concat(LOREM.slice(0, Math.max(0, 6-(LOREM.length-start)))).join('. ');
      paras.push(words + '.');
    }
    return paras.join('\n\n');
  }
  function sampleJSON(){
    return JSON.stringify({
      id: 1, name: "Jane Doe", email: "jane@example.com", active: true,
      roles: ["admin","editor"],
      profile: { bio: "Sample user", joined: "2024-01-15" },
      posts: [ {id:101, title:"Hello world", likes:42} ]
    }, null, 2);
  }
  function uuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
      const r = Math.random()*16|0;
      const v = c==='x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
  function password(){
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
    let s='';
    const buf = new Uint32Array(16);
    (window.crypto||{}).getRandomValues ? crypto.getRandomValues(buf) : buf.forEach(function(_,i){buf[i]=Math.floor(Math.random()*4294967296);});
    for(let i=0;i<16;i++) s += chars[buf[i]%chars.length];
    return s;
  }
  function slug(){
    const words=['quick','brown','fox','jumps','lazy','bright','silent','swift','happy','clever','bold','calm','dark','deep','fresh'];
    const n=3+Math.floor(Math.random()*3), p=[];
    for(let i=0;i<n;i++) p.push(words[Math.floor(Math.random()*words.length)]);
    return p.join('-');
  }
  document.getElementById('btnGenerate').addEventListener('click', function(){
    const t = type.value;
    const n = Math.min(50, Math.max(1, parseInt(count.value,10)||1));
    let result='';
    if(t==='lorem') result = lorem(n);
    else if(t==='json') result = sampleJSON();
    else if(t==='uuid'){ const a=[]; for(let i=0;i<n;i++) a.push(uuid()); result=a.join('\n'); }
    else if(t==='password'){ const a=[]; for(let i=0;i<n;i++) a.push(password()); result=a.join('\n'); }
    else if(t==='slug'){ const a=[]; for(let i=0;i<n;i++) a.push(slug()); result=a.join('\n'); }
    out.textContent = result;
  });
  document.getElementById('btnCopyG').addEventListener('click', function(){
    const t = out.textContent;
    if(!t) return;
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t);
  });
  type.addEventListener('change', function(){
    const t = type.value;
    document.getElementById('countRow').style.display = (t==='lorem'||t==='uuid'||t==='password'||t==='slug') ? '' : 'none';
  });
  type.dispatchEvent(new Event('change'));
})();
