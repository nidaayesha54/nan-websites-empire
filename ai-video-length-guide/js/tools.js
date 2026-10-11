/* AI Video Length Guide — shared platform data + tool logic (client-side only) */
"use strict";

const PLATFORMS = {
  tiktok: {
    label: "TikTok",
    idealMin: 21, idealMax: 34,
    blurb: "TikTok rewards full watch-throughs and replays. 21–34 seconds is the 2026 sweet spot: long enough to deliver value, short enough to loop.",
    plan: [
      "0:00–0:03 — Hook: state the payoff or pattern-break visual immediately.",
      "0:03–0:08 — Setup: one line of context, no backstory.",
      "0:08–0:24 — Core value: the tips, demo, or story beat.",
      "0:24–end — Payoff + soft CTA (follow for part 2, comment your take)."
    ]
  },
  reels: {
    label: "Instagram Reels",
    idealMin: 18, idealMax: 30,
    blurb: "Reels under 30 seconds with a fast hook win Explore placement. Loopable endings push replays and share saves.",
    plan: [
      "0:00–0:02 — Visual hook: motion + bold on-screen text in the first 2 seconds.",
      "0:02–0:07 — Context in one sentence.",
      "0:07–0:22 — The value: tutorial, transformation, or punchline build.",
      "0:22–end — Loop the ending back to the opening frame for replays."
    ]
  },
  shorts: {
    label: "YouTube Shorts",
    idealMin: 25, idealMax: 35,
    blurb: "Shorts under 40 seconds get the most feed velocity; 25–35 seconds holds retention while giving the algorithm a strong average-view-duration signal.",
    plan: [
      "0:00–0:03 — Verbal + visual hook: name the outcome the viewer wants.",
      "0:03–0:10 — Stakes: why this matters to them specifically.",
      "0:10–0:28 — Deliver the promised value with zero filler.",
      "0:28–end — CTA: watch the pinned long-form or subscribe for the series."
    ]
  },
  youtube: {
    label: "YouTube (long-form)",
    idealMin: 480, idealMax: 720,
    blurb: "8–12 minutes is the classic long-form sweet spot: enough depth for mid-roll ads and 40–50% average retention, which YouTube heavily rewards.",
    plan: [
      "0:00–0:30 — Cold open: the result or most shocking fact first.",
      "0:30–2:00 — Roadmap: tell them the 3–5 beats coming.",
      "2:00–70% — Deep value with a pattern interrupt (B-roll, graphic, joke) every 90 seconds.",
      "Last 15% — Summary, subscribe CTA, and end-screen tease."
    ]
  }
};

/* ---------- Length optimizer ---------- */
function fmtLen(seconds) {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60), s = Math.round(seconds % 60);
    return s ? `${m} min ${s} sec` : `${m} minutes`;
  }
  return `${Math.round(seconds)} seconds`;
}

function runLengthOptimizer() {
  const pKey = document.getElementById("lo-platform").value;
  const topic = (document.getElementById("lo-topic").value || "").trim();
  const p = PLATFORMS[pKey];
  const out = document.getElementById("lo-result");
  if (!topic) {
    out.classList.add("show");
    out.innerHTML = "<h3>⚠️ Add your topic</h3><p>Type what your video is about so the plan can reference it.</p>";
    return;
  }
  const esc = topic.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  out.classList.add("show");
  out.innerHTML =
    `<h3>✅ Ideal length for ${p.label}</h3>` +
    `<p><span class="badge">${fmtLen(p.idealMin)} – ${fmtLen(p.idealMax)}</span></p>` +
    `<p>${p.blurb}</p>` +
    `<h4>Structure plan for: “${esc}”</h4>` +
    `<ol class="plan">${p.plan.map(s => `<li>${s.replace(/(Hook|Core value|Payoff|CTA|Context|Setup|Stakes|Roadmap|Deep value|Summary)/g, "<strong>$1</strong>")}</li>`).join("")}</ol>` +
    `<p>💡 Tip: film 20% longer than the target, then cut ruthlessly — every second that doesn't earn its place costs you retention.</p>`;
}

/* ---------- Hook generator ---------- */
const HOOK_TEMPLATES = {
  tiktok: [
    "POV: you finally learn {t} the easy way",
    "Stop scrolling — {t} takes 30 seconds to understand",
    "Nobody talks about {t} like this",
    "I tried {t} for 7 days, here's what happened",
    "{t}: the 3 mistakes everyone makes",
    "This {t} trick got me 10x more views",
    "Watch {t} change right in front of you",
    "The {t} hack nobody wants you to know",
    "Rating {t} methods from worst to best",
    "If {t} isn't working, you're doing step 2 wrong"
  ],
  reels: [
    "{t} in 15 seconds — save this",
    "The {t} transformation nobody believed",
    "Do this ONE thing for {t} daily",
    "{t} before vs after (wait for it)",
    "I wish someone told me this about {t} sooner",
    "3 {t} tips that actually work",
    "Stop doing {t} like this",
    "{t} explained so simply a kid gets it",
    "The {t} mistake costing you results",
    "POV: {t} finally clicks"
  ],
  shorts: [
    "{t} explained in under 35 seconds",
    "Why {t} works (the science)",
    "I tested every {t} method so you don't have to",
    "The truth about {t} nobody tells beginners",
    "{t} — 3 facts that will surprise you",
    "Fix your {t} with this one change",
    "{t} ranked: worst to best",
    "What pros know about {t} that you don't",
    "The {t} shortcut that feels like cheating",
    "{t} in 2026: what's actually changed"
  ],
  youtube: [
    "Everything you know about {t} is wrong",
    "I spent 30 days mastering {t} — full breakdown",
    "The {t} guide I wish existed when I started",
    "{t}: beginner to advanced in one video",
    "Why 99% of people fail at {t}",
    "The hidden side of {t} nobody covers",
    "{t} mistakes that are silently killing your progress",
    "I asked 10 experts about {t} — here's the consensus",
    "The complete {t} playbook for 2026",
    "{t} deep dive: what actually moves the needle"
  ]
};

function seededPick(arr, n, seedStr) {
  let seed = 0;
  for (const ch of seedStr) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const pool = arr.slice();
  const out = [];
  while (out.length < n && pool.length) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    out.push(pool.splice(seed % pool.length, 1)[0]);
  }
  return out;
}

function runHookGenerator() {
  const pKey = document.getElementById("hg-platform").value;
  const topic = (document.getElementById("hg-topic").value || "").trim();
  const out = document.getElementById("hg-result");
  const esc = topic.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const p = PLATFORMS[pKey];
  if (!topic) {
    out.classList.add("show");
    out.innerHTML = "<h3>⚠️ Add your topic</h3><p>Enter your video topic to generate tailored hooks.</p>";
    return;
  }
  const hooks = seededPick(HOOK_TEMPLATES[pKey], 10, topic + pKey)
    .map(t => t.replaceAll("{t}", esc));
  out.classList.add("show");
  out.innerHTML =
    `<h3>🎣 10 hooks for ${p.label} — “${esc}”</h3>` +
    `<ol>${hooks.map(h => `<li>${h}</li>`).join("")}</ol>` +
    `<p>💡 Deliver the hook verbally AND as on-screen text in the first 2–3 seconds — most viewers decide with the sound off.</p>`;
}

function copyHooks() {
  const items = document.querySelectorAll("#hg-result ol li");
  if (!items.length) return;
  const text = Array.from(items, (li, i) => `${i + 1}. ${li.textContent}`).join("\n");
  navigator.clipboard.writeText(text).then(() => {
    const b = document.getElementById("hg-copy");
    if (b) { const t = b.textContent; b.textContent = "Copied ✅"; setTimeout(() => b.textContent = t, 1500); }
  });
}

/* ---------- Retention planner ---------- */
function runRetentionPlanner() {
  const raw = parseFloat(document.getElementById("rp-length").value);
  const unit = document.getElementById("rp-unit").value;
  const out = document.getElementById("rp-result");
  if (!raw || raw <= 0) {
    out.classList.add("show");
    out.innerHTML = "<h3>⚠️ Enter a video length</h3><p>Type how long your video will be (in seconds or minutes).</p>";
    return;
  }
  const total = Math.round(unit === "min" ? raw * 60 : raw);
  if (total > 7200) {
    out.classList.add("show");
    out.innerHTML = "<h3>⚠️ Too long</h3><p>This planner covers videos up to 2 hours. Try a shorter runtime.</p>";
    return;
  }
  const beats = [
    ["0:00 – " + fmtLen(3), "HOOK", "Open mid-action or state the payoff. No intro, no logo, no 'hey guys'."],
    [fmtLen(3) + " – " + fmtLen(total * 0.15), "SETUP", "One or two sentences of context. Promise the beats coming next."],
    [fmtLen(total * 0.15) + " – " + fmtLen(total * 0.25), "VALUE BEAT 1", "Deliver the first concrete payoff early — earns trust for the rest."],
    ["@" + fmtLen(total * 0.25), "PATTERN INTERRUPT", "New angle, B-roll, graphic, or joke. Viewers drift here — wake them up."],
    [fmtLen(total * 0.25) + " – " + fmtLen(total * 0.5), "VALUE BEAT 2", "The core of the video. Keep each point tight; cut every filler word."],
    ["@" + fmtLen(total * 0.5), "MIDPOINT TWIST", "Re-hook: tease the best part is still coming ('but the last one changes everything')."],
    [fmtLen(total * 0.5) + " – " + fmtLen(total * 0.75), "VALUE BEAT 3", "Escalate — save your strongest material for after the midpoint."],
    ["@" + fmtLen(total * 0.75), "PATTERN INTERRUPT", "Second wake-up: music shift, zoom, or direct-to-camera moment."],
    [fmtLen(total * 0.75) + " – " + fmtLen(total * 0.9), "PAYOFF / CLIMAX", "Deliver the promised result. This is what gets shared and saved."],
    [fmtLen(total * 0.9) + " – end", "CTA", "One clear ask: subscribe, follow, comment, or watch next. Never stack three CTAs."]
  ];
  out.classList.add("show");
  out.innerHTML =
    `<h3>📈 Retention plan — ${fmtLen(total)} video</h3>` +
    `<table><tr><th>Timestamp</th><th>Beat</th><th>What to do</th></tr>` +
    beats.map(b => `<tr><td><strong>${b[0]}</strong></td><td>${b[1]}</td><td>${b[2]}</td></tr>`).join("") +
    `</table><p>💡 Rule of thumb: re-hook or interrupt every 20–25% of runtime. Flat pacing is what kills retention, not length.</p>`;
}
