/* AI video cost calculator */
const $ = id => document.getElementById(id);
const bind = (id, labelId, fmt) => $(id).addEventListener('input', () => $(labelId).textContent = fmt(+$(id).value));
bind('videos','vLabel',v=>v); bind('length','lLabel',v=>v+'s');
bind('trad','tLabel',v=>'$'+v.toLocaleString());

$('calc').addEventListener('click', () => {
  const videos = +$('videos').value, len = +$('length').value,
        tradPer = +$('trad').value, plan = +$('plan').value;
  // Heuristic: AI credits per video ≈ $0.15 per 10s of output (multiple generations/retries)
  const aiPerVideo = Math.max(1, +(len/10 * 0.15 + 1.5).toFixed(2));
  const tradMonthly = videos * tradPer;
  const aiMonthly = plan + videos * aiPerVideo;
  const saveMonthly = tradMonthly - aiMonthly;
  const saveYearly = saveMonthly * 12;
  const pct = Math.max(0, Math.round(saveMonthly / tradMonthly * 100));
  const hoursSaved = videos * 12; // ~12 crew-hours saved per AI video vs shoot+edit

  $('result').style.display = 'block';
  $('result').innerHTML = `
    <h3>📊 Your results</h3>
    <div class="grid grid-2" style="margin-top:10px">
      <div><div style="color:var(--muted)">Traditional cost / month</div><div class="big-num" style="color:var(--accent)">$${tradMonthly.toLocaleString()}</div></div>
      <div><div style="color:var(--muted)">AI cost / month</div><div class="big-num">$${aiMonthly.toLocaleString(undefined,{maximumFractionDigits:0})}</div></div>
    </div>
    <div style="margin-top:16px"><div style="color:var(--muted)">You save</div>
      <div class="big-num">$${saveMonthly.toLocaleString(undefined,{maximumFractionDigits:0})}/month</div>
      <p style="color:var(--muted)">That's <strong style="color:var(--brand2)">$${saveYearly.toLocaleString(undefined,{maximumFractionDigits:0})} per year</strong> — a ${pct}% cost reduction — plus roughly ${hoursSaved} crew-hours freed up every month.</p></div>
    <p style="margin-top:12px;font-size:.9rem;color:var(--dim)">Estimate: AI cost ≈ $${aiPerVideo}/video in generation credits + $${plan}/mo subscription. Traditional figures vary by market — adjust the sliders to match your quotes.</p>
    <a class="btn btn-primary" href="tool-comparator.html" style="margin-top:10px">Find the right tool for your budget →</a>`;
  $('result').scrollIntoView({behavior:'smooth'});
});
