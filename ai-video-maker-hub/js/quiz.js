/* Use-case finder quiz — scores tools per answer */
const QUESTIONS = [
  { q:"What will you mainly make videos for?", opts:[
    ["ads","📣 Marketing ads & promos"],
    ["social","📱 Social media content"],
    ["training","🎓 Training & explainer videos"],
    ["film","🎬 Creative / cinematic projects"]]},
  { q:"What's your monthly budget?", opts:[
    ["free","$0 — free tier only"],
    ["budget","Under $15/mo"],
    ["pro","$15–$30/mo"],
    ["any","Whatever it takes"]]},
  { q:"How would you describe your experience?", opts:[
    ["new","🌱 Beginner — keep it simple"],
    ["mid","⚙️ Intermediate — some control"],
    ["pro","🛠 Pro — I want full control"]]},
  { q:"What matters most in the output?", opts:[
    ["real","🤖 Maximum realism"],
    ["motion","🏃 Lifelike human motion"],
    ["speed","⚡ Speed of generation"],
    ["fx","✨ Creative effects & style"]]}
];

const RECOS = {
  ads:   {t:"Runway Gen-4", w:"Best for ads: professional editing, inpainting and brand-safe output. Starts $12/mo.", link:"tool-comparator.html"},
  social:{t:"Pika", w:"Best for social: fastest to learn, viral Pikaffects, cheapest entry at $8/mo.", link:"tool-comparator.html"},
  training:{t:"Kling", w:"Best for training: lifelike presenters and up to 2-minute clips with a free tier to start.", link:"tool-comparator.html"},
  film:  {t:"Sora 2", w:"Best for cinematic work: unmatched photorealism via ChatGPT Plus ($20/mo).", link:"tool-comparator.html"}
};
const BUDGET_BOOST = { free:"Hailuo (MiniMax) — the strongest free tier in AI video. Start free, upgrade at $9.99/mo.",
  budget:"Pika ($8/mo) or Luma ($9.99/mo) — full creative power under $15.",
  pro:"Kling or Runway — pro-grade output in your budget range.",
  any:"Runway Gen-4 + Sora 2 combo — the professional stack for maximum quality." };
const EXP_NOTE = { new:"Tip: start with the free tier and simple text-to-video prompts.",
  mid:"Tip: try image-to-video + keyframes for more control over each shot.",
  pro:"Tip: combine Runway's editing suite with Sora for hero shots." };
const STYLE_NOTE = { real:"Sora 2 leads on realism if budget allows.", motion:"Kling is the motion king — especially for people.",
  speed:"Luma Dream Machine renders fastest.", fx:"Pika's effects library is unmatched." };

let step = 0; const answers = {};
const quizEl = document.getElementById('quiz'), bar = document.getElementById('bar');

function show(){
  if(step >= QUESTIONS.length){ finish(); return; }
  bar.style.width = (step/QUESTIONS.length*100) + '%';
  const q = QUESTIONS[step];
  quizEl.innerHTML = `<h2 style="margin-bottom:14px">Q${step+1}. ${q.q}</h2>` +
    q.opts.map(([v,label]) => `<div class="quiz-opt" data-v="${v}">${label}</div>`).join('');
  quizEl.querySelectorAll('.quiz-opt').forEach(o => o.addEventListener('click', () => {
    answers[['use','budget','exp','style'][step]] = o.dataset.v; step++; show();
  }));
}
function finish(){
  bar.style.width = '100%';
  const main = RECOS[answers.use];
  quizEl.innerHTML = `
    <div class="result-box">
      <span class="tag">Your match</span>
      <h3 style="margin-top:10px;font-size:1.6rem">🏆 ${main.t}</h3>
      <p style="color:var(--muted)">${main.w}</p>
      <ul class="check">
        <li>${BUDGET_BOOST[answers.budget]}</li>
        <li>${EXP_NOTE[answers.exp]}</li>
        <li>${STYLE_NOTE[answers.style]}</li>
      </ul>
      <div class="cta-row" style="justify-content:flex-start;margin-top:14px">
        <a class="btn btn-primary" href="${main.link}">Compare all tools →</a>
        <a class="btn btn-ghost" href="cost-calculator.html">Estimate your cost</a>
      </div>
      <p style="margin-top:14px"><button id="retry" style="background:none;border:1px solid var(--line);padding:8px 18px;font-size:.9rem">↻ Retake quiz</button></p>
    </div>`;
  document.getElementById('retry').addEventListener('click', () => { step=0; Object.keys(answers).forEach(k=>delete answers[k]); show(); });
}
show();
