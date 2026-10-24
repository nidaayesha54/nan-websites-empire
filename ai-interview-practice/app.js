/* NAN AI Interview Practice — single-page app logic */

// ---------- Question banks ----------
const ROLES = {
  "video-editor": {
    name: "Video Editor", emoji: "🎬",
    desc: "7 questions · editing craft, tools & workflow",
    questions: [
      { q: "Walk me through your video editing process, from raw footage to final export.", tip: "Structure it: ingest & organize → rough cut → fine cut → color & sound → export. Mention your tools." },
      { q: "How do you ensure frame-accurate cuts and smooth visual continuity between shots?", tip: "Mention J/L cuts, match cuts, checking action continuity, and reviewing at full speed plus frame-by-frame." },
      { q: "Describe a time you had to edit under a tight deadline. How did you handle it?", tip: "Use STAR: Situation, Task, Action, Result. Show prioritization and calm under pressure." },
      { q: "What is your workflow for reviewing footage and logging the best takes?", tip: "Talk about bin organization, markers, selects sequences, and naming conventions." },
      { q: "How do you handle client feedback that asks for major revisions?", tip: "Show professionalism: clarify the goal, offer options, protect the story while staying flexible." },
      { q: "Which editing tools do you use, and why do you prefer them?", tip: "Name your stack (Premiere, DaVinci, CapCut…) and connect each tool to a strength — speed, color, motion graphics." },
      { q: "How do you keep viewers engaged in the first 3 seconds of a video?", tip: "Mention hooks: motion on frame one, pattern interrupts, on-screen text, and cutting dead air." }
    ],
    tips: [
      "Open with a hook — the first 10 seconds of your answer matter most, just like a video.",
      "Name specific tools and techniques instead of vague claims like 'I'm detail-oriented'.",
      "Prepare one portfolio piece you can describe shot-by-shot if asked.",
      "Mention turnaround times and how you organize project files — employers love reliability.",
      "End answers with a result: views, retention, client reaction, or revenue impact."
    ]
  },
  "content-creator": {
    name: "Content Creator", emoji: "✨",
    desc: "7 questions · strategy, trends & audience growth",
    questions: [
      { q: "How do you come up with content ideas that actually perform?", tip: "Mention trend research, audience comments, competitor analysis, and testing hooks before full production." },
      { q: "Describe your process for planning a week of content.", tip: "Show a system: content pillars, batching, scheduling tools, and balancing trends with evergreen posts." },
      { q: "How do you adapt one idea across different platforms?", tip: "Explain repurposing: long video → shorts → carousel → thread, with platform-native tweaks." },
      { q: "Tell me about a piece of content that flopped. What did you learn?", tip: "Be honest, show analysis (hook? timing? topic?), and what you changed next time." },
      { q: "How do you stay on top of trends without copying everyone else?", tip: "Mention trend-spotting sources and how you add your own angle or niche twist." },
      { q: "What metrics do you track, and how do they change your content?", tip: "Name retention, watch time, saves/shares, CTR — and give an example of a change you made from data." },
      { q: "How would you grow an account from zero in a new niche?", tip: "Outline: research winners, post daily for 30 days, double down on what works, engage in comments." }
    ],
    tips: [
      "Quantify everything — follower growth, views, engagement rates beat adjectives.",
      "Show you understand the algorithm basics: retention, watch time, and shareability.",
      "Have 2-3 specific content wins ready with numbers.",
      "Mention tools you use: CapCut, Canva, analytics dashboards, schedulers.",
      "Show niche awareness — employers want creators who study their audience."
    ]
  },
  "social-media-manager": {
    name: "Social Media Manager", emoji: "📱",
    desc: "7 questions · strategy, engagement & analytics",
    questions: [
      { q: "How would you build a social media strategy for a brand from scratch?", tip: "Cover: audience research, platform selection, content pillars, posting cadence, and KPIs." },
      { q: "How do you handle negative comments or a PR crisis on social media?", tip: "Show a protocol: acknowledge fast, take it private, never delete criticism, escalate when needed." },
      { q: "What does your content calendar process look like?", tip: "Mention planning tools, approval workflows, balancing planned vs. reactive content, and scheduling." },
      { q: "How do you measure whether social media is actually working?", tip: "Connect metrics to business goals: reach → engagement → clicks → conversions, not just likes." },
      { q: "Describe a campaign you ran and what made it successful.", tip: "STAR format. Include the goal, the creative idea, and the measurable outcome." },
      { q: "How do you keep a brand voice consistent across platforms?", tip: "Mention brand guidelines, tone examples, and review processes before posting." },
      { q: "A post is going viral for the wrong reasons. What do you do?", tip: "Stay calm: assess, pause scheduled posts, respond honestly, and learn — never panic-delete." }
    ],
    tips: [
      "Always tie social metrics to business outcomes — reach is nice, revenue is better.",
      "Prepare one crisis-management example, even from a personal account.",
      "Know the platforms deeply: what works on TikTok rarely works on LinkedIn.",
      "Mention scheduling and analytics tools by name (Buffer, Hootsuite, Meta Suite).",
      "Show you can write — offer to share sample captions or a mini content plan."
    ]
  },
  "graphic-designer": {
    name: "Graphic Designer", emoji: "🎨",
    desc: "7 questions · process, branding & visual craft",
    questions: [
      { q: "Walk me through your design process from brief to final delivery.", tip: "Research → moodboard → concepts → feedback rounds → refine → deliver with organized files." },
      { q: "How do you handle feedback when a client dislikes your design?", tip: "Separate ego from work: ask what problem they're solving, offer alternatives, iterate fast." },
      { q: "How do you maintain brand consistency across many different assets?", tip: "Mention style guides, component libraries, templates, and version control." },
      { q: "Describe a project where you had to design under tight constraints.", tip: "Constraints show creativity: limited palette, strict guidelines, or tiny timelines — and what you delivered." },
      { q: "How do you choose typography and color for a brand?", tip: "Explain the thinking: readability, emotion, hierarchy, accessibility — not just taste." },
      { q: "What design trends are you watching, and how do you use them tastefully?", tip: "Name 1-2 real trends and explain when you'd use them vs. when timeless design wins." },
      { q: "How do you organize and hand off your design files?", tip: "Layer naming, grouped components, export presets, and a README — developers and clients notice." }
    ],
    tips: [
      "Talk about decisions, not just aesthetics — why you chose each element.",
      "Keep a portfolio link ready and know which 3 pieces to highlight.",
      "Mention accessibility: contrast ratios, readable type sizes.",
      "Show range but also a point of view — what makes your work yours?",
      "Name your tools and why: Figma for collaboration, Photoshop for retouching, etc."
    ]
  },
  "virtual-assistant": {
    name: "Virtual Assistant", emoji: "💼",
    desc: "7 questions · organization, communication & reliability",
    questions: [
      { q: "How do you organize your day when supporting multiple clients?", tip: "Show a system: time-blocking, priority matrix, shared task boards, and daily check-ins." },
      { q: "Describe how you handle confidential information.", tip: "Be concrete: password managers, NDAs, secure file sharing, and never discussing clients." },
      { q: "Tell me about a time you caught a mistake before it became a problem.", tip: "STAR format — this question tests proactivity, so emphasize that you acted without being asked." },
      { q: "How do you communicate with clients across different time zones?", tip: "Mention async updates, overlap hours, clear SLAs, and tools like Slack, Loom, and shared docs." },
      { q: "What tools do you use to stay organized?", tip: "Name your stack: Notion/Trello for tasks, Google Workspace, Calendly, Zapier — and what each solves." },
      { q: "How do you prioritize when everything feels urgent?", tip: "Show a framework: clarify deadlines, ask about impact, communicate trade-offs, then execute." },
      { q: "Describe a difficult client situation and how you handled it.", tip: "Stay professional: listen, document, propose solutions, and set boundaries respectfully." }
    ],
    tips: [
      "Reliability is the product — emphasize systems, checklists, and follow-through.",
      "Give response-time commitments (e.g., 'I reply within 2 business hours').",
      "Mention specific tools — VAs are hired for their stack as much as their skills.",
      "Show proactivity with examples, not claims: 'I built a template that saved 3 hours/week'.",
      "Prepare questions about their workflow — great VAs diagnose before they execute."
    ]
  }
};

const QUESTION_SECONDS = 120;

// ---------- State ----------
let state = {
  role: null,
  qIndex: 0,
  stream: null,
  recorder: null,
  chunks: [],
  recordings: [],   // {role, question, blobUrl}
  timerId: null,
  secondsLeft: QUESTION_SECONDS,
  recording: false
};

// ---------- Navigation ----------
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.querySelectorAll('[data-nav]').forEach(btn => {
  btn.addEventListener('click', () => showView('view-' + btn.dataset.nav));
});

// ---------- Role cards ----------
function renderRoleCards(containerId) {
  const box = document.getElementById(containerId);
  box.innerHTML = '';
  Object.entries(ROLES).forEach(([key, role]) => {
    const card = document.createElement('div');
    card.className = 'role-card';
    card.innerHTML = `<div class="role-emoji">${role.emoji}</div><h3>${role.name}</h3><p>${role.desc}</p>`;
    card.addEventListener('click', () => startRole(key));
    box.appendChild(card);
  });
}
renderRoleCards('landing-roles');
renderRoleCards('setup-roles');

// ---------- Practice flow ----------
function startRole(key) {
  state.role = key;
  state.qIndex = 0;
  state.recordings = [];
  showView('view-practice');
  loadQuestion();
  startCamera();
}

function loadQuestion() {
  const role = ROLES[state.role];
  const item = role.questions[state.qIndex];
  document.getElementById('practice-role-label').textContent = role.emoji + ' ' + role.name;
  document.getElementById('q-num').textContent = state.qIndex + 1;
  document.getElementById('q-total').textContent = role.questions.length;
  document.getElementById('question-text').textContent = item.q;
  document.getElementById('q-tip').innerHTML = '<strong>💡 Tip:</strong> ' + item.tip;
  document.getElementById('progress-fill').style.width = ((state.qIndex) / role.questions.length * 100) + '%';
  document.getElementById('btn-next').disabled = true;
  document.getElementById('btn-next').textContent = (state.qIndex === role.questions.length - 1) ? 'Finish →' : 'Next Question →';
  resetTimer();
}

function resetTimer() {
  clearInterval(state.timerId);
  state.secondsLeft = QUESTION_SECONDS;
  updateTimerDisplay();
  const t = document.getElementById('timer');
  t.classList.remove('warn', 'danger');
}

function updateTimerDisplay() {
  const m = Math.floor(state.secondsLeft / 60);
  const s = state.secondsLeft % 60;
  const t = document.getElementById('timer');
  t.textContent = m + ':' + String(s).padStart(2, '0');
  t.classList.toggle('warn', state.secondsLeft <= 30 && state.secondsLeft > 10);
  t.classList.toggle('danger', state.secondsLeft <= 10);
}

function tickTimer() {
  if (state.secondsLeft <= 0) {
    stopRecording();
    return;
  }
  state.secondsLeft--;
  updateTimerDisplay();
}

// ---------- Camera & recording ----------
async function startCamera() {
  const video = document.getElementById('webcam');
  try {
    if (state.stream) return;
    state.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    video.srcObject = state.stream;
  } catch (err) {
    document.querySelector('.cam-hint').innerHTML =
      '⚠️ Camera access was blocked. <strong>Allow camera & mic</strong> in your browser to practice with video — or answer out loud anyway!';
  }
}

document.getElementById('btn-record').addEventListener('click', () => {
  if (!state.stream) { alert('Camera is not available. Please allow camera access and try again.'); return; }
  state.chunks = [];
  const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
  state.recorder = new MediaRecorder(state.stream, { mimeType: mime });
  state.recorder.ondataavailable = e => { if (e.data.size > 0) state.chunks.push(e.data); };
  state.recorder.onstop = saveRecording;
  state.recorder.start();
  state.recording = true;
  document.getElementById('rec-badge').hidden = false;
  document.getElementById('btn-record').disabled = true;
  document.getElementById('btn-stop').disabled = false;
  document.getElementById('btn-next').disabled = true;
  state.timerId = setInterval(tickTimer, 1000);
});

document.getElementById('btn-stop').addEventListener('click', stopRecording);

function stopRecording() {
  if (state.recorder && state.recording) {
    state.recorder.stop();
    state.recording = false;
  }
  clearInterval(state.timerId);
  document.getElementById('rec-badge').hidden = true;
  document.getElementById('btn-record').disabled = false;
  document.getElementById('btn-stop').disabled = true;
  document.getElementById('btn-next').disabled = false;
}

function saveRecording() {
  const blob = new Blob(state.chunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const role = ROLES[state.role];
  state.recordings.push({
    role: role.name,
    qNum: state.qIndex + 1,
    question: role.questions[state.qIndex].q,
    blobUrl: url,
    blob: blob
  });
}

// ---------- Question navigation ----------
document.getElementById('btn-skip').addEventListener('click', nextQuestion);

document.getElementById('btn-next').addEventListener('click', () => {
  if (state.recording) stopRecording();
  nextQuestion();
});

function nextQuestion() {
  clearInterval(state.timerId);
  const role = ROLES[state.role];
  if (state.qIndex < role.questions.length - 1) {
    state.qIndex++;
    document.getElementById('progress-fill').style.width = ((state.qIndex) / role.questions.length * 100) + '%';
    loadQuestion();
  } else {
    finishPractice();
  }
}

// ---------- Summary ----------
function finishPractice() {
  clearInterval(state.timerId);
  if (state.stream) {
    state.stream.getTracks().forEach(t => t.stop());
    state.stream = null;
  }
  const role = ROLES[state.role];
  document.getElementById('sum-role').textContent = role.name;
  document.getElementById('sum-count').textContent = state.recordings.length + ' of ' + role.questions.length;
  document.getElementById('progress-fill').style.width = '100%';

  // Recordings
  const list = document.getElementById('recordings-list');
  list.innerHTML = '';
  if (state.recordings.length === 0) {
    list.innerHTML = '<p class="view-sub">No recordings this time — hit record next round to review yourself on camera!</p>';
  }
  state.recordings.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'rec-card';
    const fname = 'interview-' + state.role + '-q' + r.qNum + '.webm';
    card.innerHTML = `
      <h4>Q${r.qNum}: ${r.question.substring(0, 60)}${r.question.length > 60 ? '…' : ''}</h4>
      <video src="${r.blobUrl}" controls playsinline></video>
      <div class="rec-actions">
        <a class="btn btn-primary" href="${r.blobUrl}" download="${fname}">⬇ Download</a>
      </div>`;
    list.appendChild(card);
  });

  // Tips
  const tips = document.getElementById('tips-list');
  tips.innerHTML = '';
  role.tips.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t;
    tips.appendChild(li);
  });

  showView('view-summary');
}
