// "Which billing certification fits me?" quiz
const QUESTIONS = [
  {
    q: "What part of the revenue cycle sounds most interesting?",
    opts: [
      {t:"Assigning diagnosis & procedure codes from medical records", s:{cpc:3, ccs:2, crc:2}},
      {t:"Submitting claims, fighting denials, following up on AR", s:{cpb:3, cmrs:2}},
      {t:"Reviewing charts to capture chronic conditions accurately", s:{crc:3, cpc:1}},
      {t:"Running a billing office / managing staff and workflows", s:{cmrs:3, cpb:1}}
    ]
  },
  {
    q: "Where would you most like to work?",
    opts: [
      {t:"Hospital / health system (inpatient)", s:{ccs:3, crc:1}},
      {t:"Doctor's office / clinic (outpatient)", s:{cpc:3, cpb:2}},
      {t:"Insurance company / Medicare Advantage plan", s:{crc:3, cpb:1}},
      {t:"Billing company / remote from home", s:{cpb:3, cpc:2, crc:2}}
    ]
  },
  {
    q: "What's your experience level?",
    opts: [
      {t:"Brand new — no healthcare background", s:{cbcs:3, cpb:1}},
      {t:"Some admin / front-desk healthcare experience", s:{cpb:2, cbcs:2, cpc:1}},
      {t:"Already coding, want to specialize or level up", s:{cpc:2, crc:3, ccs:2}},
      {t:"Experienced biller, eyeing management", s:{cmrs:3, cpb:1}}
    ]
  },
  {
    q: "What matters most in your next credential?",
    opts: [
      {t:"Maximum recognition with employers", s:{cpc:2, ccs:2, cpb:2}},
      {t:"Fastest / most affordable path to a first job", s:{cbcs:3, cpb:1}},
      {t:"Highest salary ceiling", s:{ccs:2, crc:3, cpc:1}},
      {t:"Remote-work friendliness", s:{crc:2, cpb:2, cpc:2}}
    ]
  }
];

let step = 0;
const scores = {cpc:0, cpb:0, crc:0, ccs:0, cmrs:0, cbcs:0};
const picks = [];

document.addEventListener('DOMContentLoaded', renderQ);

function renderQ() {
  const wrap = document.getElementById('quiz');
  if (step >= QUESTIONS.length) return showResult(wrap);
  const q = QUESTIONS[step];
  wrap.innerHTML = `
    <div class="quiz-progress">Question ${step + 1} of ${QUESTIONS.length}</div>
    <div class="quiz-q">${esc(q.q)}</div>
    <div class="quiz-opts">${q.opts.map((o, i) =>
      `<button type="button" class="radio-card" data-i="${i}" style="text-align:left;width:100%">${esc(o.t)}</button>`
    ).join('')}</div>
    ${step > 0 ? '<button type="button" class="btn btn-ghost" id="back">← Back</button>' : ''}`;
  wrap.querySelectorAll('.radio-card').forEach(b =>
    b.addEventListener('click', () => {
      picks[step] = parseInt(b.dataset.i, 10);
      step++;
      renderQ();
    }));
  const back = document.getElementById('back');
  if (back) back.addEventListener('click', () => { step--; renderQ(); });
}

function showResult(wrap) {
  Object.keys(scores).forEach(k => scores[k] = 0);
  picks.forEach((optIdx, qi) => {
    const s = QUESTIONS[qi].opts[optIdx].s;
    Object.keys(s).forEach(k => scores[k] += s[k]);
  });
  const ranked = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  const top = ranked[0], second = ranked[1];
  const c = CERTS[top], c2 = CERTS[second];
  wrap.innerHTML = `
    <h3>🎯 Your best-fit certification: ${esc(c.name)}</h3>
    <p><span class="badge">${esc(c.org)}</span> <span class="badge">Exam ${esc(c.cost.split(' exam')[0].replace('~','~$'))}</span></p>
    <p style="margin:12px 0">${esc(c.desc)}</p>
    <div class="stat-row"><span>Best roles</span><span>${esc(c.best)}</span></div>
    <div class="stat-row"><span>Typical total cost</span><span class="val">${esc(c.cost)}</span></div>
    <h4 style="margin:18px 0 8px">Runner-up: ${esc(c2.name)}</h4>
    <p style="color:var(--muted)">${esc(c2.desc)}</p>
    <div style="margin-top:18px">
      <button type="button" class="btn btn-ghost" id="retake">Retake quiz</button>
      <a class="btn" href="training-finder.html" style="margin-left:10px">Compare training costs →</a>
    </div>
    <div class="note">This quiz is a starting guide, not career advice. Check current exam fees and eligibility at ${esc(c.org)}'s official site before enrolling.</div>`;
  document.getElementById('retake').addEventListener('click', () => { step = 0; picks.length = 0; renderQ(); });
}
