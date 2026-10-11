// AIVideoTutorials — AI Video Project Planner
(function () {
  "use strict";

  var GOALS = {
    ad: {
      label: "Product / Video Ad",
      tools: {
        beginner: ["Hailuo (MiniMax) free tier — text-to-video", "CapCut (free) — edit + captions", "ElevenLabs free tier — voiceover (optional)"],
        intermediate: ["Kling 1.6 — lifelike motion", "Luma Dream Machine — fast cinematic shots", "CapCut Pro / Premiere — polish + captions"],
        advanced: ["Runway Gen-4 — VFX + precise control", "Sora 2 — photoreal hero shots", "Premiere Pro + After Effects — finishing"]
      },
      phases: [
        { t: "Define the offer & the hook", d: "One offer, one CTA. Write the first 3 seconds as a bold visual + spoken hook — ads die or live in the opening." },
        { t: "Script 15–30 seconds", d: "Hook → problem → product moment → proof → CTA. ~35–75 words spoken. Read it aloud to check the timing." },
        { t: "Generate 3–6 shots", d: "Prompt close-ups of the product in use, lifestyle context, and one 'wow' shot. Keep one visual style across all shots." },
        { t: "Voiceover + music", d: "Generate or record the voiceover, add upbeat royalty-free music at −20dB under the voice, sync cuts to beats." },
        { t: "Edit, captions, compliance", d: "Big burned-in captions, logo end-card, and verify ad disclosure rules for the platform before you publish." }
      ]
    },
    reel: {
      label: "Social Reel / Short",
      tools: {
        beginner: ["Luma Dream Machine free — quick clips", "CapCut (free) — trending templates + auto-captions", "Built-in TikTok/Reels effects"],
        intermediate: ["Kling — smooth motion", "Pika — creative effects & transitions", "CapCut — pacing + trending audio"],
        advanced: ["Sora 2 — cinematic B-roll", "Runway — effects & inpainting", "Premiere — custom pacing & sound design"]
      },
      phases: [
        { t: "Pick a proven format", d: "Transformation, before/after, POV, challenge or mini-story. Format beats originality for the first 20 reels." },
        { t: "Write the hook first", d: "Opening line or visual in the first 1–2 seconds. Write 5 hook options and pick the strongest." },
        { t: "Generate 2–4 clips", d: "Short 3–8s clips with high motion. Open mid-action — never start with a slow fade-in." },
        { t: "Edit for retention", d: "Cut every 2–3 seconds, captions word-by-word, trending sound synced. Target 21–34 seconds total." },
        { t: "Publish & iterate", d: "Post at peak hours, reply to early comments, and double down on whichever hook style gets the most watch time." }
      ]
    },
    explainer: {
      label: "Explainer Video",
      tools: {
        beginner: ["Hailuo free — scene visuals", "CapCut — assembly + text overlays", "ElevenLabs free — narration"],
        intermediate: ["Luma — consistent scenes", "Kling — motion between scenes", "Descript — edit narration by editing text"],
        advanced: ["Sora 2 — cinematic scenes", "Runway — controlled camera moves", "Professional VO + After Effects motion graphics"]
      },
      phases: [
        { t: "Outline the explanation", d: "Problem → 3 key points → takeaway. One idea per scene; plan 1 scene per 15–20 seconds of narration." },
        { t: "Write & time the script", d: "~130–150 words per minute. Record a scratch read to time each scene before generating any visuals." },
        { t: "Storyboard each scene", d: "Sketch or list 5–8 scenes with the exact narration line per scene. Lock the script before generating video." },
        { t: "Generate scene visuals", d: "Use a style anchor ('flat vector illustration, teal and purple palette') in every prompt for visual consistency." },
        { t: "Assemble, narrate, polish", d: "Cut visuals to the narration, add animated text for key terms, mix music low, export 1080p." }
      ]
    },
    demo: {
      label: "Product Demo",
      tools: {
        beginner: ["Pika — product hero shots", "CapCut — screen-record + assemble", "Free screen recorder (OBS)"],
        intermediate: ["Kling — product in motion", "Luma — lifestyle scenes", "Descript — narration + captions"],
        advanced: ["Runway — product VFX shots", "Sora 2 — aspirational scenes", "Premiere — pro sound design & color"]
      },
      phases: [
        { t: "List the 3 key features", d: "Pick the three features that sell. Each gets one clear demo moment — no feature tours, only proof." },
        { t: "Write the demo script", d: "Feature → benefit → visual proof per section. Keep total runtime 60–90 seconds." },
        { t: "Capture + generate footage", d: "Screen-record the real product; generate AI B-roll for context scenes you can't film." },
        { t: "Narrate the walkthrough", d: "Confident, paced narration synced to each action on screen. Silence where the visual explains itself." },
        { t: "Polish & add CTA", d: "Zoom on key clicks, captions for steps, and a clear end-card: where to try/buy the product." }
      ]
    },
    avatar: {
      label: "AI Avatar Presenter Video",
      tools: {
        beginner: ["HeyGen free trial — avatar presenter", "CapCut — B-roll + captions", "Your script (60–90s)"],
        intermediate: ["HeyGen Creator plan — custom avatar", "Kling/Luma — B-roll scenes", "ElevenLabs — consistent voice"],
        advanced: ["Custom-trained avatar (HeyGen/Synthesia)", "Runway — branded backgrounds", "Full motion-graphics package"]
      },
      phases: [
        { t: "Choose or create the avatar", d: "Pick an avatar that fits your brand; beginners can use stock avatars, advanced users train their own likeness." },
        { t: "Write a presenter script", d: "Conversational tone, short sentences, one message per 20-second block. ~150 words/minute." },
        { t: "Generate presenter + B-roll", d: "Generate the talking-head segments, then AI B-roll for every concept the avatar mentions." },
        { t: "Assemble like a real shoot", d: "Alternate avatar and B-roll every 10–15 seconds — pure talking-head gets skipped fast." },
        { t: "Brand it", d: "Lower-thirds, logo bug, captions, and a strong CTA end-card." }
      ]
    },
    music: {
      label: "AI Music Video",
      tools: {
        beginner: ["Luma free — visual clips", "Suno free — AI music track", "CapCut — sync cuts to beats"],
        intermediate: ["Kling — character motion", "Pika — effects & style transfer", "CapCut — beat-synced editing"],
        advanced: ["Sora 2 — cinematic sequences", "Runway — stylized effects", "DaVinci Resolve — color grade + finish"]
      },
      phases: [
        { t: "Lock the track", d: "Generate or pick the song first — everything visual is cut to this. Note the BPM and beat drops." },
        { t: "Plan the visual story", d: "One visual concept per verse/chorus. Storyboard 6–10 signature shots." },
        { t: "Generate signature shots", d: "Use a strong style anchor in every prompt (e.g. 'neon-noir, anamorphic, 35mm grain') for a unified look." },
        { t: "Cut to the beat", d: "Hard cuts on downbeats, speed ramps on builds, hold still on the emotional moments." },
        { t: "Grade & export", d: "One color grade across all clips, loudness-normalized audio, export 4K if the platform supports it." }
      ]
    }
  };

  var PLATFORMS = {
    tiktok: { label: "TikTok", aspect: "9:16 vertical", length: "21–34 seconds", hook: "first 1–2 seconds", tip: "Post 1–3x daily; reply to comments with new videos to snowball reach." },
    instagram: { label: "Instagram Reels", aspect: "9:16 vertical", length: "15–30 seconds", hook: "first 1–2 seconds", tip: "Use trending audio within 48h of its spike; add keyword captions for Reels SEO." },
    youtube: { label: "YouTube / Shorts", aspect: "16:9 (long) or 9:16 (Shorts)", length: "60s Shorts or 3–8 min long-form", hook: "first 5 seconds", tip: "Shorts feed discovery is huge for AI content; long-form needs a retention graph above 50%." },
    facebook: { label: "Facebook Reels", aspect: "9:16 vertical", length: "15–30 seconds", hook: "first 2 seconds", tip: "Reels get priority distribution on Facebook; add burned-in captions — most views are silent." },
    website: { label: "Website / Landing Page", aspect: "16:9 horizontal", length: "60–90 seconds", hook: "autoplay-safe first frame", tip: "Keep it muted-autoplay friendly with captions; place the CTA above the fold next to the video." }
  };

  var SKILLS = {
    beginner: { label: "Beginner", note: "Start 100% free. Expect your first plan to take a weekend — speed comes with reps." },
    intermediate: { label: "Intermediate", note: "You've published 10+ AI videos. Mix one paid tool into your free stack for a quality jump." },
    advanced: { label: "Advanced", note: "You ship weekly. Invest in the pro tools and build reusable prompt/style templates." }
  };

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function buildPlan() {
    var goalKey = document.getElementById("goal").value;
    var platKey = document.getElementById("platform").value;
    var skillKey = document.getElementById("skill").value;
    var g = GOALS[goalKey], p = PLATFORMS[platKey], s = SKILLS[skillKey];
    var out = document.getElementById("planResult");

    var html = "";
    html += "<h3>Your plan: " + esc(g.label) + " for " + esc(p.label) + " (" + esc(s.label) + ")</h3>";
    html += "<p style='color:var(--muted)'>" + esc(s.note) + "</p>";
    html += "<div class='kpis'>";
    html += "<div class='kpi'><div class='n'>" + esc(p.aspect) + "</div><div class='l'>Aspect ratio</div></div>";
    html += "<div class='kpi'><div class='n'>" + esc(p.length) + "</div><div class='l'>Target length</div></div>";
    html += "<div class='kpi'><div class='n'>" + esc(p.hook) + "</div><div class='l'>Hook window</div></div>";
    html += "</div>";
    html += "<h3 style='margin-top:10px'>Tool picks for your level</h3>";
    html += "<table class='tool-table'><tr><th>Role</th><th>Recommended tool</th></tr>";
    var roles = ["Video generation", "Voiceover / audio", "Editing & finishing"];
    var picks = g.tools[skillKey];
    for (var i = 0; i < roles.length; i++) {
      html += "<tr><td>" + esc(roles[i]) + "</td><td>" + esc(picks[i]) + "</td></tr>";
    }
    html += "</table>";
    html += "<h3>Step-by-step production plan</h3>";
    for (var j = 0; j < g.phases.length; j++) {
      html += "<div class='plan-step'><div class='ph'>Step " + (j + 1) + " — " + esc(g.phases[j].t) + "</div><div style='color:var(--muted)'>" + esc(g.phases[j].d) + "</div></div>";
    }
    html += "<div class='tip'><strong>Platform tip (" + esc(p.label) + "):</strong> " + esc(p.tip) + "</div>";
    html += "<div class='tip'><strong>Verify your output:</strong> before publishing, run the finished video through the free <a href='https://aivideodetector.site' target='_blank' rel='noopener'>AI Video Detector</a> to spot AI-generation artifacts your viewers would notice.</div>";
    html += "<button id='copyPlan' class='secondary' style='margin-top:8px'>Copy plan as text</button>";
    out.innerHTML = html;
    out.style.display = "block";
    out.scrollIntoView({ behavior: "smooth", block: "start" });

    var btn = document.getElementById("copyPlan");
    if (btn) {
      btn.addEventListener("click", function () {
        var txt = "AI VIDEO PLAN: " + g.label + " for " + p.label + " (" + s.label + ")\n\n";
        txt += "SPECS: " + p.aspect + " | " + p.length + " | hook in " + p.hook + "\n\nTOOLS:\n";
        for (var k = 0; k < picks.length; k++) { txt += "- " + roles[k] + ": " + picks[k] + "\n"; }
        txt += "\nSTEPS:\n";
        for (var m = 0; m < g.phases.length; m++) { txt += (m + 1) + ". " + g.phases[m].t + " — " + g.phases[m].d + "\n"; }
        if (navigator.clipboard) {
          navigator.clipboard.writeText(txt).then(function () { btn.textContent = "Copied!"; });
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var gen = document.getElementById("genPlan");
    if (gen) {
      gen.addEventListener("click", buildPlan);
      buildPlan();
    }
  });
})();
