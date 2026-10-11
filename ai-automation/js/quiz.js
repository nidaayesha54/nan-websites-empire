/* "What should I automate?" quiz -> recommendation engine */
var QUIZ = [
  { q: "What best describes your role?", opts: [
    { t: "Marketing / content", tags: ["marketing", "content"] },
    { t: "Sales", tags: ["sales"] },
    { t: "Operations / admin", tags: ["ops"] },
    { t: "Developer / technical", tags: ["dev"] },
    { t: "Founder / solo business", tags: ["marketing", "sales", "ops"] }
  ]},
  { q: "Which task eats most of your week?", opts: [
    { t: "Writing & content creation", tags: ["content"] },
    { t: "Replying to emails/messages", tags: ["ops", "sales"] },
    { t: "Data entry & spreadsheets", tags: ["ops", "dev"] },
    { t: "Follow-ups & scheduling", tags: ["sales", "ops"] },
    { t: "Repetitive coding tasks", tags: ["dev"] }
  ]},
  { q: "How comfortable are you with no-code tools?", opts: [
    { t: "Beginner — keep it simple", tags: ["simple"] },
    { t: "Intermediate — I can wire tools together", tags: ["mid"] },
    { t: "Advanced — APIs don't scare me", tags: ["advanced"] }
  ]},
  { q: "What's your monthly automation budget?", opts: [
    { t: "Free only", tags: ["free"] },
    { t: "Up to $50/mo", tags: ["paid"] },
    { t: "Up to $200/mo", tags: ["paid"] },
    { t: "Whatever it takes", tags: ["paid"] }
  ]}
];

var RECIPES = [
  { tags: ["marketing", "simple"], title: "AI Content Repurposing Pipeline",
    desc: "Turn one long post/video into a week of social content automatically.",
    steps: ["Write or record one long-form piece weekly", "Use ChatGPT/Claude with the Repurpose Engine prompt (see Prompt Library)", "Schedule outputs in Buffer (free tier) across platforms"],
    tools: "ChatGPT (free), Buffer (free)", effort: "2 hours setup" },
  { tags: ["marketing", "mid"], title: "Lead Magnet → Email Nurture Machine",
    desc: "Capture leads and nurture them while you sleep.",
    steps: ["Build a simple checklist lead magnet", "Connect a Tally form to MailerLite via Make.com", "Write a 5-email sequence with the Email Sequence prompt", "Trigger sequence automatically on signup"],
    tools: "Tally (free), MailerLite (free), Make (free tier)", effort: "1 weekend" },
  { tags: ["content", "simple"], title: "Weekly Newsletter Autopilot",
    desc: "Draft your newsletter in 30 minutes instead of 4 hours.",
    steps: ["Collect links/notes in a doc all week", "Use the Newsletter Issue prompt to draft", "Edit voice, schedule in Substack/MailerLite"],
    tools: "Claude/ChatGPT, Substack (free)", effort: "1 hour setup" },
  { tags: ["sales", "simple"], title: "Instant Lead Response",
    desc: "Reply to new leads in under 5 minutes, 24/7.",
    steps: ["Create a Calendly booking link", "Draft 3 follow-up templates with the Follow-Up Sequence prompt", "Set your CRM or Gmail to auto-send template #1 on new inquiry"],
    tools: "Calendly (free), Gmail filters", effort: "2 hours" },
  { tags: ["sales", "mid"], title: "CRM Auto-Enrichment",
    desc: "Stop manual data entry on every lead.",
    steps: ["Connect your lead form to HubSpot free CRM via Zapier", "Auto-create deals and assign owners", "Trigger the Discovery Call Script prompt before each call"],
    tools: "HubSpot (free), Zapier (free tier)", effort: "Half day" },
  { tags: ["ops", "simple"], title: "Inbox Triage System",
    desc: "Cut email time by 60% with filters + templates.",
    steps: ["Apply the Inbox Triage Rules prompt to design filters", "Create 5 canned responses for repeat questions", "Batch-process email twice daily"],
    tools: "Gmail filters + templates (free)", effort: "2 hours" },
  { tags: ["ops", "mid"], title: "SOP Knowledge Base Bot",
    desc: "Answer repeat team questions automatically.",
    steps: ["Write SOPs with the SOP Writer prompt", "Load them into a ChatGPT Custom GPT or Notion AI Q&A", "Point the team to the bot instead of Slack pings"],
    tools: "Notion (free), ChatGPT Plus ($20)", effort: "1 day" },
  { tags: ["dev", "advanced"], title: "PR Review Autopilot",
    desc: "AI first-pass code reviews on every pull request.",
    steps: ["Add an AI review GitHub Action (e.g. CodeRabbit free tier)", "Feed it your Refactor Plan prompt as review rubric", "Humans review only flagged items"],
    tools: "GitHub Actions, CodeRabbit (free tier)", effort: "3 hours" },
  { tags: ["dev", "mid"], title: "Bug Triage Assistant",
    desc: "Turn raw bug reports into actionable tickets.",
    steps: ["Pipe bug reports into a Linear/GitHub template", "Use the Bug Hunter prompt to pre-diagnose", "Auto-label by severity"],
    tools: "Linear (free), ChatGPT API", effort: "Half day" },
  { tags: ["free", "simple"], title: "Meeting Notes → Tasks Flow",
    desc: "Never lose an action item again — $0 cost.",
    steps: ["Paste raw notes into the Meeting Notes prompt after each call", "Copy action items into Todoist/Notion", "Review every Friday with the Weekly Review prompt"],
    tools: "ChatGPT free, Todoist free", effort: "30 minutes" }
];

var quizStep = 0, quizTags = {};

function quizStart() {
  quizStep = 0; quizTags = {};
  quizRender();
}
function quizAnswer(tags) {
  tags.forEach(function (t) { quizTags[t] = (quizTags[t] || 0) + 1; });
  quizStep++;
  quizRender();
}
function scoreRecipe(r) {
  var s = 0;
  r.tags.forEach(function (t) { s += (quizTags[t] || 0) * 2; });
  if ((quizTags.free || 0) && r.tools.indexOf('free') > -1) s += 1;
  return s;
}
function quizRender() {
  var box = document.getElementById('quiz-box');
  if (!box) return;
  if (quizStep < QUIZ.length) {
    var q = QUIZ[quizStep];
    var html = '<div class="quiz-q"><h3>Question ' + (quizStep + 1) + ' of ' + QUIZ.length + '</h3><p>' + esc(q.q) + '</p>';
    q.opts.forEach(function (o, i) {
      html += '<button class="opt" onclick="quizAnswer(' + JSON.stringify(o.tags).replace(/"/g, '&quot;') + ')">' + esc(o.t) + '</button>';
    });
    box.innerHTML = html + '</div>';
  } else {
    var ranked = RECIPES.slice().sort(function (a, b) { return scoreRecipe(b) - scoreRecipe(a); });
    var top = ranked.slice(0, 3);
    var html = '<div class="quiz-q"><h3>🎯 Your top 3 automations</h3><p style="color:var(--muted)">Ranked for your role, skill level, and budget.</p></div>';
    top.forEach(function (r, i) {
      html += '<div class="prompt-card"><b>#' + (i + 1) + ' ' + esc(r.title) + '</b>' +
        '<p style="color:var(--muted)">' + esc(r.desc) + '</p><ol style="margin-left:20px;color:#d7d3f2">' +
        r.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
        '<div class="meta">Tools: ' + esc(r.tools) + ' · Setup: ' + esc(r.effort) + '</div></div>';
    });
    html += '<button class="btn ghost" onclick="quizStart()">Retake quiz</button> ';
    html += '<a class="btn" href="workflow-builder.html" style="margin-left:8px">Plan it in the Workflow Builder</a>';
    box.innerHTML = html;
  }
}
document.addEventListener('DOMContentLoaded', quizStart);
