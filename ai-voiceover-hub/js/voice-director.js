// Voice Director: style -> direction notes + annotated sample delivery script
(function () {
  'use strict';
  var STYLES = {
    documentary: {
      name: '🎬 Documentary',
      pace: 'Slow, measured — 130–140 WPM. Let facts land.',
      energy: 'Calm authority. 6/10 energy. Think "trusted guide", not "hype man".',
      tone: 'Lower pitch, steady. Slight gravitas on key nouns.',
      breath: 'Full sentences on one breath; pause 1–2 beats between ideas.',
      mic: '6–8 inches, slightly off-axis. Consistent distance = consistent tone.',
      traps: 'Avoid "movie trailer" voice. Don\'t rush the payoff line — the pause before it IS the drama.',
      sample: [
        '[Slow, deliberate. Slight reverb of a big room.]',
        'In 1969, three men left Earth on a pillar of fire.',
        '[Beat. Drop pitch slightly.]',
        'Only two of them would walk on the Moon.',
        '[Pause — two full seconds. Then warmer:]',
        'This is the story of the third man… and the longest night in space history.'
      ]
    },
    commercial: {
      name: '📺 Commercial / Ad Read',
      pace: 'Bright and brisk — 160–175 WPM. Ads are short; every word earns its place.',
      energy: '8/10. Smile with your voice — it reads as warmth on the waveform.',
      tone: 'Conversational, one-to-one. Talk to ONE person, not a crowd.',
      breath: 'Shorter phrases, punchy. Hit the brand name, then relax.',
      mic: '4–6 inches. Close and intimate; pop filter is mandatory.',
      traps: 'Don\'t oversell — modern ads punish "announcer voice". The CTA is the only line that goes up in energy.',
      sample: [
        '[Warm, upbeat — like telling a friend good news.]',
        'You know that 3pm crash? The one that kills your whole afternoon?',
        '[Lean in, conspiratorial:]',
        'BrightFuel fixed it for me. One scoop, real energy, zero jitters.',
        '[Smile big on the CTA:]',
        'Try it today — your afternoons will thank you.'
      ]
    },
    explainer: {
      name: '💡 Explainer / YouTube',
      pace: 'Conversational — 145–155 WPM. Vary it: faster for setup, slower for the insight.',
      energy: '7/10 with spikes. Curiosity is your engine.',
      tone: 'Friendly expert. Slight upward lilt on questions; grounded on conclusions.',
      breath: 'Natural speech rhythm. Mark breath spots at commas, never mid-thought.',
      mic: '5–7 inches. Keep head still — movement changes your EQ between cuts.',
      traps: 'Never monotone-list facts. Every 60 seconds needs an energy reset: a question, a story beat, or a "here\'s the crazy part".',
      sample: [
        '[Energetic opener, direct to camera:]',
        'Your brain is lying to you right now.',
        '[Beat. Softer, curious:]',
        'Not in a scary way — in a fascinating, money-saving way.',
        '[Pick up pace:]',
        'It\'s called loss aversion, and once you see it, you\'ll spot it in every price tag, every sale sign, every "limited offer".',
        '[Slow down for the payoff:]',
        'Here\'s how it works… and how to beat it.'
      ]
    },
    vlog: {
      name: '🎥 Vlog / Creator',
      pace: 'Natural and loose — 150–165 WPM with pauses for laughs and reactions.',
      energy: 'Your real energy, plus 15%. Authenticity beats performance.',
      tone: 'Talk like the viewer is your friend on the couch. Imperfections are fine.',
      breath: 'Breathe where you\'d breathe in real life. Don\'t edit out your personality.',
      mic: '4–8 inches depending on setup; consistency matters more than distance.',
      traps: 'Scripted vlogs die when they sound read. Memorize the idea, not the words — then say it fresh on mic.',
      sample: [
        '[Laughing slightly, mid-story:]',
        '…so I\'m standing there, right? Camera in one hand, coffee in the other —',
        '[Pause for the visual gag:]',
        '— and you can guess what happened next.',
        '[Genuine laugh, then lean in:]',
        'Anyway. Day three. Let\'s see if we can top yesterday\'s disaster.'
      ]
    },
    elearning: {
      name: '🎓 eLearning / Course',
      pace: 'Clear and steady — 135–150 WPM. Learners pause and rewind; give them landing spots.',
      energy: '5–6/10. Encouraging coach, not cheerleader.',
      tone: 'Warm, patient. Emphasize terms the student must remember.',
      breath: 'Pause after each key concept — silence is where learning happens.',
      mic: '6 inches, dead-consistent. Students listen for hours; harshness fatigues.',
      traps: 'Reading slides kills courses. Explain the WHY behind each point, and check in: "Does that make sense? Good — let\'s try one together."',
      sample: [
        '[Warm, welcoming:]',
        'Welcome to module three. By the end of this lesson, you\'ll be able to price any freelance project with confidence.',
        '[Pause. Then step-by-step clarity:]',
        'Step one: list every deliverable. Step two: estimate hours honestly — then add twenty percent.',
        '[Encouraging, slower:]',
        'That buffer isn\'t padding. It\'s professionalism. And clients respect it.'
      ]
    },
    audiobook: {
      name: '📖 Audiobook / Narration',
      pace: 'Unhurried — 130–145 WPM. Listeners are in it for hours.',
      energy: '4–6/10 baseline; characters can spike. Narration stays smooth.',
      tone: 'Rich and intimate. Slight character separation with pitch, not cartoon voices.',
      breath: 'Paragraph breaks are breath breaks. Never rush a chapter end.',
      mic: '6–8 inches. Low noise floor is everything — closet booths beat fancy mics.',
      traps: 'Mouth clicks and stomach growls get amplified. Water (room temp), apple slices, and punch-in recording for flubs.',
      sample: [
        '[Quiet, intimate — like a secret:]',
        'The house had been empty for eleven years.',
        '[Let it sit. Then, a touch faster:]',
        'Everyone in Grayport knew it. Everyone had a theory. No one had the key.',
        '[Almost a whisper:]',
        'Until the night the lights came on.'
      ]
    },
    trailer: {
      name: '🔥 Trailer / Promo',
      pace: 'Dynamic — whisper-quiet lows, booming highs. 140–160 WPM with huge contrast.',
      energy: 'Full range: 3/10 to 10/10 in a single read.',
      tone: 'Cinematic. Every line is a headline. Land the last word of each phrase.',
      breath: 'Dramatic pauses are your instrument. Silence before the title = goosebumps.',
      mic: '5–7 inches, controlled. Proximity effect adds weight — use it, don\'t fear it.',
      traps: 'One trailer voice all the way through = boring. Build: intimate → curious → epic. The music does half the work; leave it room.',
      sample: [
        '[Near whisper:]',
        'They said it couldn\'t be done.',
        '[Building, gravel in the voice:]',
        'They were wrong.',
        '[Full power, then sudden quiet:]',
        'This summer… the rules change.',
        '[Two beats of silence. Title drop:]',
        'ASCENSION. In theaters July.'
      ]
    }
  };

  function el(id) { return document.getElementById(id); }

  function generate() {
    var key = el('vd-style').value;
    var s = STYLES[key] || STYLES.explainer;
    var topic = (el('vd-topic').value || 'your topic').trim();
    var audience = (el('vd-audience').value || 'your audience').trim();

    var html = '<h2 style="margin-bottom:10px">' + s.name + ' — Direction Notes</h2>' +
      '<p style="color:var(--muted)">Tailored for: <b>' + escapeHtml(topic) + '</b> · audience: <b>' + escapeHtml(audience) + '</b></p>' +
      '<div class="stat-grid" style="margin-top:14px">' +
      stat('Pace', s.pace) + stat('Energy', s.energy) +
      '</div>' +
      '<div class="tip"><b>🎯 Tone:</b> ' + s.tone + '</div>' +
      '<div class="tip"><b>🌬️ Breathing & phrasing:</b> ' + s.breath + '</div>' +
      '<div class="tip"><b>🎤 Mic technique:</b> ' + s.mic + '</div>' +
      '<div class="warn"><b>⚠️ Common trap:</b> ' + s.traps + '</div>' +
      '<h3 style="margin:16px 0 8px">📜 Sample delivery script <span class="tag">adapt the bracketed cues to ' + escapeHtml(topic) + '</span></h3>' +
      '<div class="result" id="vd-script">' +
      s.sample.map(function (line) {
        if (line.charAt(0) === '[') return '<p style="color:var(--accent);font-size:.88rem;margin:6px 0"><i>' + escapeHtml(line) + '</i></p>';
        return '<p style="margin:6px 0">' + escapeHtml(line) + '</p>';
      }).join('') + '</div>' +
      '<button class="btn-sm" data-copy="#vd-script" style="margin-top:10px">📋 Copy script</button>';
    el('vd-result').innerHTML = html;
  }
  function stat(lbl, val) {
    return '<div class="stat"><div class="lbl">' + lbl + '</div><div style="font-size:.85rem;margin-top:6px;color:#dbeafe">' + escapeHtml(val) + '</div></div>';
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!el('vd-style')) return;
    var chips = document.querySelectorAll('#vd-chips .chip');
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        chips.forEach(function (x) { x.classList.remove('active'); });
        c.classList.add('active');
        el('vd-style').value = c.getAttribute('data-style');
        generate();
      });
    });
    el('vd-style').addEventListener('change', generate);
    el('vd-topic').addEventListener('input', generate);
    el('vd-audience').addEventListener('input', generate);
    generate();
  });
})();
