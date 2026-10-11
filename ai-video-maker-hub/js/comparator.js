/* Tool data + comparator logic. Prices: starting paid plan USD, reviewed Oct 2026. */
const TOOLS = [
  { id:"runway", name:"Runway Gen-4", tagline:"The professional's AI video suite", from:12,
    freeTier:false, commercial:true, api:true, editing:true, longClips:false,
    resolution:"4K", maxClip:"~16s", freeNote:"Trial credits only",
    quality:9.4, value:7.6, ease:8.2, features:9.8,
    bestFor:"Professional editing, VFX & brand work",
    pros:["Full editing + Aleph VFX suite","Best inpainting & motion brush","Strong commercial terms"],
    cons:["No usable free tier","Credits burn fast on long clips"] },
  { id:"sora", name:"Sora 2 (OpenAI)", tagline:"Most photorealistic text-to-video", from:20,
    freeTier:false, commercial:true, api:false, editing:false, longClips:false,
    resolution:"1080p", maxClip:"~20s", freeNote:"No free tier",
    quality:9.6, value:8.0, ease:8.8, features:8.4,
    bestFor:"Photorealism & narrative scenes",
    pros:["Best realism & physics of motion","Included with ChatGPT Plus","Great prompt adherence"],
    cons:["Locked behind $20/mo Plus plan","No API / limited editing tools"] },
  { id:"kling", name:"Kling 2.x", tagline:"Lifelike human motion", from:10,
    freeTier:true, commercial:true, api:true, editing:false, longClips:true,
    resolution:"1080p", maxClip:"~2 min", freeNote:"Daily free credits",
    quality:9.2, value:9.2, ease:8.4, features:8.6,
    bestFor:"Realistic people & longer clips",
    pros:["Excellent human motion","Up to 2-minute generations","Generous free credits"],
    cons:["Slower peak-time generation","UI mostly English/Chinese mix"] },
  { id:"hailuo", name:"Hailuo (MiniMax)", tagline:"Best free-tier value", from:10,
    freeTier:true, commercial:true, api:true, editing:false, longClips:false,
    resolution:"1080p", maxClip:"~10s", freeNote:"Generous daily credits",
    quality:8.8, value:9.6, ease:9.0, features:8.0,
    bestFor:"Beginners & budget creators",
    pros:["Best free plan in the category","Strong character consistency","Affordable paid tiers"],
    cons:["Shorter clips than Kling","Occasional motion artifacts"] },
  { id:"luma", name:"Luma Dream Machine", tagline:"Fast, cinematic clips", from:10,
    freeTier:true, commercial:true, api:true, editing:false, longClips:false,
    resolution:"1080p", maxClip:"~30s", freeNote:"Limited monthly generations",
    quality:8.8, value:8.8, ease:9.2, features:8.4,
    bestFor:"Cinematic b-roll & fast iteration",
    pros:["Very fast generation","Beautiful camera movement","Keyframes + image-to-video"],
    cons:["Limited free generations","Less control than Runway"] },
  { id:"pika", name:"Pika 2.x", tagline:"Creative effects playground", from:8,
    freeTier:true, commercial:true, api:false, editing:false, longClips:false,
    resolution:"1080p", maxClip:"~10s", freeNote:"Free credits on signup",
    quality:8.0, value:9.0, ease:9.4, features:8.8,
    bestFor:"Stylized shorts & viral effects",
    pros:["Unique Pikaffects & Pikaframes","Cheapest entry price","Easiest to learn"],
    cons:["Less photorealistic","No API access"] }
];
TOOLS.forEach(t => t.score = +(t.quality*0.35 + t.value*0.25 + t.ease*0.20 + t.features*0.20).toFixed(1));

const budgetEl = document.getElementById('budget');
const budgetLabel = document.getElementById('budgetLabel');
const resultsEl = document.getElementById('results');
const sortEl = document.getElementById('sortBy');
const activeFilters = new Set();

document.getElementById('mustHave').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if(!c) return;
  c.classList.toggle('on');
  c.classList.contains('on') ? activeFilters.add(c.dataset.f) : activeFilters.delete(c.dataset.f);
  render();
});
budgetEl.addEventListener('input', () => { budgetLabel.textContent = '$' + budgetEl.value; render(); });
sortEl.addEventListener('change', render);

function star(n){ return '★'.repeat(Math.round(n/2)) + '☆'.repeat(5 - Math.round(n/2)); }

function render(){
  const maxB = +budgetEl.value;
  let list = TOOLS.filter(t => t.from <= maxB && [...activeFilters].every(f => t[f]));
  const sort = sortEl.value;
  list.sort((a,b) => sort==='price' ? a.from-b.from : sort==='quality' ? b.quality-a.quality : sort==='value' ? b.value-a.value : b.score-a.score);
  resultsEl.innerHTML = list.length ? list.map((t,i) => `
    <div class="card tool-card" style="margin-bottom:18px">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <h3 style="margin:0">${i+1}. ${t.name}</h3>
        <span class="tag ${t.freeTier?'free':''}">${t.freeTier?'Free tier available':'Paid only'}</span>
      </div>
      <p style="margin:8px 0">${t.tagline}</p>
      <div class="score-row"><span class="score">${t.score}</span><span class="stars">${star(t.score)}</span><span style="color:var(--dim);font-size:.85rem">Quality ${t.quality} · Value ${t.value} · Ease ${t.ease} · Features ${t.features}</span></div>
      <div class="price-line">From $${t.from}/mo · ${t.resolution} · clips up to ${t.maxClip}</div>
      <ul class="check">${t.pros.map(p=>`<li>${p}</li>`).join('')}${t.cons.map(c=>`<li class="no">${c}</li>`).join('')}</ul>
      <p style="font-size:.9rem;color:var(--dim)">Best for: <strong style="color:var(--text)">${t.bestFor}</strong></p>
    </div>`).join('')
    : `<div class="card"><h3>No tools match those filters</h3><p>Try raising your budget or removing a filter.</p></div>`;

  document.getElementById('specTable').innerHTML = TOOLS.map(t => `
    <tr><td><strong>${t.name}</strong></td><td class="mut">$${t.from}/mo</td><td class="mut">${t.freeNote}</td>
    <td class="mut">${t.resolution}</td><td class="mut">${t.maxClip}</td><td class="mut">${t.bestFor}</td></tr>`).join('');
}
render();
