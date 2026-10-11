// AI video editing workflow checklist generator
(function () {
  'use strict';

  var CHECKLISTS = {
    talking: {
      label: 'YouTube talking-head video',
      phases: [
        { phase: 'Pre-production', steps: [
          ['Write the script with hooks', 'Open with a question or bold claim in the first 5 seconds; keep sentences short for captions.'],
          ['Build a shot list', 'Note camera angles, B-roll moments and props before you record anything.'],
          ['Set up lighting & audio', 'Soft key light at 45°, record 10s room tone, test mic levels (-12 to -6 dB).']
        ]},
        { phase: 'AI-assisted edit', steps: [
          ['Run text-based editing', 'Import to Descript or Premiere text mode; delete filler words ("um", "uh") with one click.'],
          ['Apply silence removal', 'Let the AI cut dead air automatically, then review cuts above 0.5s.'],
          ['Auto-generate captions', 'Export an SRT, check names/numbers manually, style with your brand font.'],
          ['Add B-roll with AI match', 'Use auto B-roll or stock suggestions; keep cuts under 4 seconds for retention.'],
          ['Enhance audio', 'Apply noise removal + loudness normalize to -14 LUFS (YouTube standard).']
        ]},
        { phase: 'Polish & publish', steps: [
          ['Color correct + grade', 'Fix white balance, add a light LUT; keep skin tones natural.'],
          ['Design the thumbnail', 'High contrast, 3-word max text, readable at 10% size.'],
          ['Write SEO title & description', 'Front-load the main keyword; add timestamps and a subscribe CTA.'],
          ['Add chapters', 'Split at logical topics — boosts watch time and Google video results.'],
          ['Final quality check', 'Watch at 1.5x speed on phone: check audio, captions, and every cut.']
        ]}
      ]
    },
    short: {
      label: 'TikTok / Shorts / Reels',
      phases: [
        { phase: 'Hook first', steps: [
          ['Script the first 2 seconds', 'Start mid-action or with a pattern interrupt — no intros.'],
          ['Plan 3 value beats', 'Each beat = one tip, joke or reveal; one beat per 3-5 seconds.'],
          ['Choose trending audio', 'Match a trending sound or voiceover pacing under 150 WPM.']
        ]},
        { phase: 'AI-assisted edit', steps: [
          ['Use auto-reframe', 'Let the AI track the subject when converting 16:9 to 9:16.'],
          ['Apply dynamic captions', 'Word-by-word karaoke captions, 3-5 words per line, high contrast.'],
          ['Cut to the beat', 'Use auto beat-sync so cuts land on the music transients.'],
          ['Add AI B-roll/transitions', 'One zoom or transition per beat change — never back to back.'],
          ['Loop the ending', 'Match the last frame to the first for an invisible loop.']
        ]},
        { phase: 'Polish & publish', steps: [
          ['Export 1080x1920, 30fps', 'Keep bitrate high; avoid re-compressing downloaded platform files.'],
          ['Test hook on a friend', 'If they do not stop scrolling in 2 seconds, reshoot the hook.'],
          ['Write SEO caption', '3-5 hashtags max, keyword in the first line, clear CTA.'],
          ['Post at audience peak', 'Check analytics for your top 3 posting hours; schedule ahead.'],
          ['Reply to early comments', 'Pin a question comment to spark the algorithm within 60 minutes.']
        ]}
      ]
    },
    ad: {
      label: 'Product / UGC-style ad',
      phases: [
        { phase: 'Creative', steps: [
          ['Define one avatar + one pain', 'Name the exact buyer and the single pain the product solves.'],
          ['Write a 25-second script', 'Hook (3s) → problem (7s) → demo (10s) → CTA (5s).'],
          ['Gather 5 proof assets', 'Reviews, before/after, unboxing clips, stats, guarantee badge.']
        ]},
        { phase: 'AI-assisted edit', steps: [
          ['Generate voiceover options', 'Try 2 AI voices; pick the one matching the brand energy.'],
          ['Auto-caption + emphasize keywords', 'Bold or color key benefit words inside captions.'],
          ['Remove silences and tighten', 'No shot longer than 2.5 seconds in a paid ad.'],
          ['Add subtitles burn-in', '85% of ad views are muted — captions are non-negotiable.'],
          ['Create 3 hook variants', 'Same ad, 3 different first-3-seconds; test as separate creatives.']
        ]},
        { phase: 'Launch ready', steps: [
          ['Export platform sizes', '1:1, 4:5 and 9:16 versions from one timeline.'],
          ['Check claim compliance', 'Remove absolute claims ("best", "guaranteed") unless provable.'],
          ['Add UTM links', 'Track creative performance per variant in your ad manager.'],
          ['Set up retargeting cut', 'Make a 6-second bumper from the strongest moment.'],
          ['Archive project + assets', 'Label files by angle and hook so winners are reusable.']
        ]}
      ]
    },
    tutorial: {
      label: 'Screen tutorial / course lesson',
      phases: [
        { phase: 'Plan', steps: [
          ['Write a tight outline', 'One concept per section; target 6-10 minutes per lesson.'],
          ['Close distractions', 'Silence notifications, hide bookmarks bar, set 2x cursor size.'],
          ['Record audio first if needed', 'Narration-first recording gives cleaner pacing.']
        ]},
        { phase: 'AI-assisted edit', steps: [
          ['Remove mistakes with text edit', 'Delete stumbles by deleting the words in the transcript.'],
          ['Add zoom-on-action', 'Auto-zoom or keyframe zoom on every click and keystroke.'],
          ['Generate accurate captions', 'Technical terms need manual review — AI gets jargon wrong.'],
          ['Insert chapter markers', 'Label each section; learners skip — make skipping easy.'],
          ['Enhance voice clarity', 'De-noise, de-reverb, and compress narration for laptop speakers.']
        ]},
        { phase: 'Publish', steps: [
          ['Export 1080p with text legible', 'Verify on-screen text is readable on a phone screenshot.'],
          ['Write description with timestamps', 'Each chapter = a searchable entry point.'],
          ['Attach resources', 'Link files, code, or templates mentioned in the lesson.'],
          ['Add practice prompt', 'End every lesson with one actionable exercise.'],
          ['Review with fresh eyes', 'Watch once as a beginner — flag any assumed knowledge.']
        ]}
      ]
    },
    podcast: {
      label: 'Podcast / interview repurposing',
      phases: [
        { phase: 'Source', steps: [
          ['Pick the 3 strongest clips', 'Moments with emotion, controversy, or a quotable take — 30-60s each.'],
          ['Download clean audio', 'Use the master WAV, not a compressed stream rip.'],
          ['Note exact timestamps', 'Log start/end so you never re-hunt for moments.']
        ]},
        { phase: 'AI-assisted edit', steps: [
          ['Auto-transcribe the episode', 'Use the transcript to find clips by searching keywords.'],
          ['Generate clip drafts with AI', 'Tools like Opus Clip or Descript suggest viral clips — review all.'],
          ['Burn in animated captions', 'Speaker labels + word highlighting keep silent scrollers watching.'],
          ['Clean the audio', 'Remove crosstalk, ums, and long pauses between speakers.'],
          ['Add branded frame', 'Consistent border, logo, and caption style across all clips.']
        ]},
        { phase: 'Distribute', steps: [
          ['Export per platform', '9:16 for Shorts/Reels/TikTok, 16:9 for YouTube.'],
          ['Write clip-specific hooks', 'The clip title should create an open loop.'],
          ['Link the full episode', 'Pinned comment + description link to the long-form.'],
          ['Batch 7 clips per episode', 'One recording session = a full week of short-form content.'],
          ['Track which moments pop', 'Double down on the guest type and topic that spikes views.']
        ]}
      ]
    }
  };

  function buildChecklist(type) {
    var data = CHECKLISTS[type];
    if (!data) return;
    var list = document.getElementById('checklistOutput');
    list.innerHTML = '';
    var total = 0;
    data.phases.forEach(function (p) {
      p.steps.forEach(function (s) {
        total++;
        var li = document.createElement('li');
        var box = document.createElement('input');
        box.type = 'checkbox';
        box.setAttribute('aria-label', s[0]);
        box.addEventListener('change', function () {
          li.classList.toggle('done', box.checked);
          updateProgress();
        });
        var inner = document.createElement('div');
        var ph = document.createElement('span');
        ph.className = 'step-phase';
        ph.textContent = p.phase;
        var t = document.createElement('div');
        t.className = 'step-title';
        t.textContent = s[0];
        var d = document.createElement('div');
        d.className = 'step-desc';
        d.textContent = s[1];
        inner.appendChild(ph);
        inner.appendChild(t);
        inner.appendChild(d);
        li.appendChild(box);
        li.appendChild(inner);
        li.addEventListener('click', function (e) {
          if (e.target !== box) { box.checked = !box.checked; box.dispatchEvent(new Event('change')); }
        });
        list.appendChild(li);
      });
    });
    list.dataset.total = String(total);
    updateProgress();
    document.getElementById('results').style.display = 'block';
    document.getElementById('resultTitle').textContent = data.label + ' — editing checklist';
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
  }

  function updateProgress() {
    var list = document.getElementById('checklistOutput');
    var total = parseInt(list.dataset.total || '0', 10);
    if (!total) return;
    var done = list.querySelectorAll('input:checked').length;
    var pct = Math.round((done / total) * 100);
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressText').textContent = done + ' of ' + total + ' steps complete (' + pct + '%)';
  }

  function copyChecklist() {
    var type = document.getElementById('projectType').value;
    var data = CHECKLISTS[type];
    var lines = ['AI VIDEO EDITING CHECKLIST — ' + data.label.toUpperCase(), ''];
    data.phases.forEach(function (p) {
      lines.push('## ' + p.phase);
      p.steps.forEach(function (s) { lines.push('[ ] ' + s[0] + ' — ' + s[1]); });
      lines.push('');
    });
    navigator.clipboard.writeText(lines.join('\n')).then(function () {
      showAlert('Checklist copied to clipboard ✔');
    });
  }

  function resetChecklist() {
    var list = document.getElementById('checklistOutput');
    list.querySelectorAll('input:checked').forEach(function (b) {
      b.checked = false;
      b.closest('li').classList.remove('done');
    });
    updateProgress();
  }

  function showAlert(msg) {
    var a = document.getElementById('alertBox');
    a.textContent = msg;
    a.style.display = 'block';
    setTimeout(function () { a.style.display = 'none'; }, 2500);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('generateBtn').addEventListener('click', function () {
      buildChecklist(document.getElementById('projectType').value);
    });
    document.getElementById('copyBtn').addEventListener('click', copyChecklist);
    document.getElementById('resetBtn').addEventListener('click', resetChecklist);
  });
})();
