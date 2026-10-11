// Ad Script Templates Library — 16 templates, filterable by format, one-click copy
document.addEventListener('DOMContentLoaded', () => {
  const TEMPLATES = [
    { id: 1, cat: 'UGC', title: 'The Relatable Rant', len: '30–45s', why: 'Opens with raw frustration viewers instantly recognize.',
      script: `[HOOK — 0:00] Okay I need to rant about [PROBLEM] because WHY is nobody talking about this?\n\n[PROBLEM — 0:05] I've tried [OLD SOLUTION 1], [OLD SOLUTION 2]... nothing worked and I was so over it.\n\n[DISCOVERY — 0:15] Then I found [PRODUCT]. I was skeptical but honestly? Game changer.\n\n[DEMO — 0:25] Watch — [FEATURE DEMO]. That's it. That's the whole thing.\n\n[CTA — 0:35] If you're dealing with [PROBLEM] too, just try it. Link in bio. Thank me later.` },
    { id: 2, cat: 'UGC', title: 'Day in My Life (Product Placement)', len: '45–60s', why: 'Soft-sell that feels like content, not an ad.',
      script: `[MORNING — 0:00] Morning routine! First thing I do is [USE PRODUCT].\n\n[MIDDAY — 0:15] It comes with me everywhere — [SECOND USE CASE]. I genuinely can't imagine my day without it now.\n\n[EVENING — 0:30] The best part? [KEY BENEFIT]. It's just become part of my routine.\n\n[CTA — 0:45] I've linked it below — [OFFER]. You're gonna love this.` },
    { id: 3, cat: 'UGC', title: '3 Reasons I Switched', len: '30s', why: 'Listicle structure keeps retention high to the end.',
      script: `[HOOK — 0:00] Three reasons I switched to [PRODUCT] — and I'll never go back.\n\n[REASON 1 — 0:06] One: [BENEFIT 1].\n\n[REASON 2 — 0:14] Two: [BENEFIT 2].\n\n[REASON 3 — 0:22] And three: [BENEFIT 3].\n\n[CTA — 0:28] Link below if you want to try it yourself.` },
    { id: 4, cat: 'Unboxing', title: 'First Impressions Unboxing', len: '45–60s', why: 'Curiosity gap — viewers watch to see what\'s inside.',
      script: `[HOOK — 0:00] My [PRODUCT] finally arrived — let's open it together!\n\n[UNBOX — 0:05] Okay the packaging is already [FIRST IMPRESSION]... let's see what's inside. [ITEM], [ITEM], [ITEM].\n\n[FIRST TOUCH — 0:20] Wow, it feels [SENSORY DETAIL]. Let me try [FIRST USE] right now.\n\n[REACTION — 0:35] Honestly? First impression is [REACTION]. Full review coming, but so far — impressed.\n\n[CTA — 0:50] Linked below if you want one too.` },
    { id: 5, cat: 'Unboxing', title: 'What\'s in the Box (Detailed)', len: '60–90s', why: 'Answers buyer questions, reduces purchase anxiety.',
      script: `[HOOK — 0:00] Everything you get with [PRODUCT] — let's break it down.\n\n[BOX TOUR — 0:05] First, [MAIN ITEM] — this is the star of the show. Then [ACCESSORY 1] for [USE], and [ACCESSORY 2].\n\n[SETUP — 0:30] Setup took me [TIME] — literally just [SETUP STEPS].\n\n[FIRST TEST — 0:45] First test: [RESULT].\n\n[VERDICT — 0:60+] For [PRICE], this is honestly [VERDICT].\n\n[CTA — end] Link below — [OFFER].` },
    { id: 6, cat: 'Unboxing', title: 'ASMR Unboxing', len: '30–45s', why: 'ASMR triggers huge watch-through on TikTok/Reels.',
      script: `[NO TALKING — 0:00] Tapping, crinkle sounds. Slow unboxing of [PRODUCT] with satisfying sounds.\n\n[ON-SCREEN TEXT — throughout] "[KEY FEATURE]" → "[KEY BENEFIT]" → "[OFFER]"\n\n[FINAL — end] Product hero shot. Text: "[CTA TEXT]"` },
    { id: 7, cat: 'Testimonial', title: 'Customer Story Arc', len: '45–60s', why: 'Before/after storytelling builds deep trust.',
      script: `[BEFORE — 0:00] Hi, I'm [NAME]. Before [PRODUCT], I was dealing with [PROBLEM] for [TIME PERIOD].\n\n[STRUGGLE — 0:12] I tried everything — [OLD SOLUTIONS] — and nothing stuck.\n\n[DISCOVERY — 0:22] Then I found [PRODUCT]. Within [TIMEFRAME], I noticed [CHANGE 1], then [CHANGE 2].\n\n[AFTER — 0:40] Now? [TRANSFORMATION]. I genuinely wish I'd found this sooner.\n\n[CTA — 0:50] If you're where I was — try it. [OFFER].` },
    { id: 8, cat: 'Testimonial', title: 'Quick Rating Review', len: '20–30s', why: 'Short + punchy — perfect for retargeting ads.',
      script: `[HOOK — 0:00] Rating [PRODUCT] — honest review.\n\n[THE GOOD — 0:05] Pros: [PRO 1], [PRO 2]. [DEMO SHOT].\n\n[THE HONEST BIT — 0:15] One thing to know: [MINOR CON or CAVEAT] — but honestly, [REBUTTAL].\n\n[SCORE — 0:22] Overall? [X]/10. Would buy again.\n\n[CTA — 0:27] Link below.` },
    { id: 9, cat: 'Testimonial', title: 'Skeptic Converted', len: '30–45s', why: 'Speaks directly to doubtful buyers — highest objection-handling power.',
      script: `[HOOK — 0:00] I was SO skeptical about [PRODUCT]... here's what changed my mind.\n\n[DOUBT — 0:06] I thought it was just [OBJECTION]. Everyone was hyping it and I didn't buy the hype.\n\n[THE TEST — 0:15] But I tried it for [TIMEFRAME] anyway. And... [SURPRISING RESULT].\n\n[PROOF — 0:28] Look at this — [DEMO / BEFORE-AFTER].\n\n[CTA — 0:38] Skeptics, I get it. Just try it — [GUARANTEE/OFFER].` },
    { id: 10, cat: 'Before/After', title: 'The Transformation Split', len: '20–30s', why: 'Visual contrast stops the scroll instantly.',
      script: `[BEFORE — 0:00] This was me before [PRODUCT]: [PAIN DESCRIPTION]. (messy, relatable footage)\n\n[TRANSITION — 0:10] Same [PERSON/ROOM/SITUATION]... [TIME LATER].\n\n[AFTER — 0:15] After [PRODUCT]: [TRANSFORMATION]. (clean, satisfying footage)\n\n[HOW — 0:22] All it took was [SIMPLE STEP].\n\n[CTA — 0:27] Want your own transformation? Link in bio.` },
    { id: 11, cat: 'Before/After', title: 'Time-Lapse Results', len: '30–45s', why: 'Compressed time proves the product works.',
      script: `[SETUP — 0:00] Testing [PRODUCT] for [DURATION] — let's see what happens.\n\n[DAY 1 — 0:08] Starting point: [BASELINE].\n\n[DAY X — 0:18] [MIDPOINT UPDATE].\n\n[FINAL DAY — 0:30] Final result: [OUTCOME]. Look at the difference.\n\n[CTA — 0:40] Try it yourself — [OFFER]. Link below.` },
    { id: 12, cat: 'Founder Story', title: 'Why I Built This', len: '60–90s', why: 'Mission-driven brands earn loyalty, not just sales.',
      script: `[ORIGIN — 0:00] I started [BRAND] because [PERSONAL PAIN / STORY].\n\n[THE GAP — 0:20] Everything on the market was [PROBLEM WITH EXISTING OPTIONS]. I knew there had to be a better way.\n\n[THE BUILD — 0:35] So I spent [TIME] building [PRODUCT] — with [KEY DIFFERENTIATOR].\n\n[MISSION — 0:55] This isn't just a product. It's [MISSION STATEMENT].\n\n[CTA — 1:10+] Join us — [OFFER]. Link below.` },
    { id: 13, cat: 'Founder Story', title: 'Behind the Scenes', len: '30–45s', why: 'Transparency = authenticity = trust.',
      script: `[HOOK — 0:00] What actually goes into making [PRODUCT]? Let me show you.\n\n[PROCESS — 0:05] It starts with [STEP 1]... then [STEP 2]... and finally [STEP 3].\n\n[DETAIL — 0:25] We [QUALITY DETAIL] because [REASON].\n\n[CTA — 0:38] This is what you're getting. Link below.` },
    { id: 14, cat: 'Comparison', title: 'Us vs. Them', len: '30s', why: 'Direct comparison converts price-shoppers.',
      script: `[HOOK — 0:00] [PRODUCT] vs. [COMPETITOR] — let's compare honestly.\n\n[ROUND 1 — 0:06] Price: [US] vs [THEM].\n\n[ROUND 2 — 0:12] [FEATURE]: [US] vs [THEM].\n\n[ROUND 3 — 0:18] [FEATURE]: [US] vs [THEM].\n\n[VERDICT — 0:24] The choice is pretty clear.\n\n[CTA — 0:28] Link below — [OFFER].` },
    { id: 15, cat: 'Comparison', title: 'Myth vs. Reality', len: '30s', why: 'Debunks objections while entertaining.',
      script: `[MYTH 1 — 0:00] Myth: [OBJECTION]. Reality: [TRUTH + DEMO].\n\n[MYTH 2 — 0:12] Myth: [OBJECTION]. Reality: [TRUTH + DEMO].\n\n[MYTH 3 — 0:24] Myth: [OBJECTION]. Reality: [TRUTH + DEMO].\n\n[CTA — end] Still skeptical? [GUARANTEE]. Link below.` },
    { id: 16, cat: 'Problem/Solution', title: 'The 3-Second Fix', len: '15–25s', why: 'Ultra-short format dominates paid social.',
      script: `[PROBLEM — 0:00] Tired of [PROBLEM]? (relatable fail clip)\n\n[FIX — 0:06] [PRODUCT]. [ONE DEMO SHOT]. Fixed.\n\n[CTA — 0:15] Link in bio — [OFFER].` }
  ];

  const grid = document.getElementById('templateGrid');
  const chips = document.getElementById('chips');
  const cats = ['All', ...new Set(TEMPLATES.map(t => t.cat))];
  let active = 'All';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  chips.innerHTML = cats.map(c =>
    `<button class="chip${c === active ? ' active' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`
  ).join('');
  chips.querySelectorAll('.chip').forEach(ch =>
    ch.addEventListener('click', () => {
      active = ch.dataset.cat;
      chips.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x === ch));
      render();
    })
  );

  function render() {
    const list = TEMPLATES.filter(t => active === 'All' || t.cat === active);
    grid.innerHTML = list.map(t => `
      <div class="card">
        <span class="badge">${esc(t.cat)}</span> <small style="color:var(--faint)">⏱ ${esc(t.len)}</small>
        <h3>${esc(t.title)}</h3>
        <p><em>Why it works:</em> ${esc(t.why)}</p>
        <pre class="script-text">${esc(t.script)}</pre>
        <div class="result-toolbar">
          <button class="btn btn-small btn-primary" data-copy="${t.id}">Copy script</button>
        </div>
      </div>`).join('');
    grid.querySelectorAll('[data-copy]').forEach(btn =>
      btn.addEventListener('click', () => {
        const t = TEMPLATES.find(x => x.id == btn.dataset.copy);
        copyText(`${t.title} (${t.cat} · ${t.len})\n\n${t.script}`, btn);
      })
    );
  }
  render();
});
