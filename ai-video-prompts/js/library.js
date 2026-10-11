/* Prompt library: search + category filter + one-click copy */
(function(){
  const results = document.getElementById('results');
  const chips = document.getElementById('chips');
  const search = document.getElementById('search');
  const count = document.getElementById('count');
  const cats = ['All', ...new Set(PROMPTS.map(p => p.cat))];
  let activeCat = 'All', query = '';

  cats.forEach(c => {
    const b = document.createElement('button');
    b.className = 'chip' + (c === 'All' ? ' active' : '');
    b.textContent = c;
    b.onclick = () => {
      activeCat = c;
      chips.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render();
    };
    chips.appendChild(b);
  });

  search.addEventListener('input', e => { query = e.target.value.toLowerCase(); render(); });

  function render(){
    const list = PROMPTS.filter(p =>
      (activeCat === 'All' || p.cat === activeCat) &&
      (!query || (p.title + ' ' + p.text).toLowerCase().includes(query))
    );
    count.textContent = list.length + ' prompt' + (list.length === 1 ? '' : 's');
    results.innerHTML = '';
    if (!list.length){
      results.innerHTML = '<p class="section-sub">No prompts found. Try another keyword or category.</p>';
      return;
    }
    list.forEach(p => {
      const d = document.createElement('div');
      d.className = 'prompt-card';
      const h = document.createElement('h3'); h.textContent = p.title;
      const c = document.createElement('div'); c.className = 'cat'; c.textContent = p.cat;
      const t = document.createElement('div'); t.className = 'prompt-text'; t.textContent = p.text;
      const btn = document.createElement('button');
      btn.className = 'copy-btn'; btn.textContent = 'Copy prompt';
      btn.onclick = () => {
        navigator.clipboard.writeText(p.text).then(() => {
          btn.textContent = 'Copied ✓'; btn.classList.add('ok');
          setTimeout(() => { btn.textContent = 'Copy prompt'; btn.classList.remove('ok'); }, 1600);
        });
      };
      d.append(h, c, t, btn);
      results.appendChild(d);
    });
  }
  render();
})();
