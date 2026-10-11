// Shot List Generator — parses script into beats, outputs framed shots w/ AI prompts
document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);

  const SHOT_LIBRARY = {
    hook: [
      { shot: 'Extreme close-up of the problem', framing: 'ECU', cam: 'Snap zoom in', overlay: 'Bold problem text' },
      { shot: 'Creator looks into camera, mid-rant', framing: 'Medium close-up', cam: 'Slight handheld shake', overlay: 'Captions on' },
      { shot: 'Before-state mess / fail moment', framing: 'Wide', cam: 'Static', overlay: 'Before text' }
    ],
    problem: [
      { shot: 'Failed alternative in use', framing: 'Medium', cam: 'Slow push-in', overlay: 'X mark graphic' },
      { shot: 'Frustrated creator reaction', framing: 'Close-up', cam: 'Whip pan', overlay: 'Captions' },
      { shot: 'Side-by-side old solutions', framing: 'Split screen', cam: 'Static', overlay: 'Labels' }
    ],
    solution: [
      { shot: 'Product hero reveal', framing: 'Hero 3/4 angle', cam: 'Orbit 180°', overlay: 'Product name card' },
      { shot: 'Product in environment', framing: 'Wide lifestyle', cam: 'Slow dolly', overlay: 'None / subtle logo' },
      { shot: 'Packaging / detail texture', framing: 'Macro', cam: 'Focus pull', overlay: 'Feature callout' }
    ],
    demo: [
      { shot: 'Feature demonstration', framing: 'Close-up hands', cam: 'Tracking follow', overlay: 'Feature caption' },
      { shot: 'Feature result payoff', framing: 'Medium', cam: 'Slow-mo', overlay: 'Checkmark animation' },
      { shot: 'Second angle of feature', framing: 'Over-shoulder', cam: 'Static tripod', overlay: 'Step number' }
    ],
    proof: [
      { shot: 'Testimonial talking head', framing: 'Medium close-up', cam: 'Static', overlay: 'Name + stars' },
      { shot: 'Before/after split', framing: 'Split screen', cam: 'Static', overlay: 'Before/After labels' },
      { shot: 'Review screenshots montage', framing: 'Full-frame UI', cam: 'Ken Burns pan', overlay: 'Star rating' }
    ],
    cta: [
      { shot: 'Product hero + CTA button', framing: 'Hero center', cam: 'Slow push-in', overlay: 'BIG CTA button' },
      { shot: 'Creator points to CTA', framing: 'Medium', cam: 'Static', overlay: 'Arrow to button' },
      { shot: 'End card with offer', framing: 'Full-frame graphic', cam: 'Static', overlay: 'Offer text + logo' }
    ]
  };

  const STYLE_TWEAK = {
    ugc: { suffix: ', authentic smartphone UGC style, natural lighting, casual real-world setting', person: 'real person creator' },
    cinematic: { suffix: ', cinematic studio lighting, shallow depth of field, premium commercial film look', person: 'professional model' },
    avatar: { suffix: ', photorealistic AI avatar presenter, clean studio background, broadcast quality', person: 'AI avatar presenter' },
    mixed: { suffix: ', mix of authentic UGC and cinematic product b-roll, dynamic commercial pacing', person: 'creator' }
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function classify(line) {
    const l = line.toLowerCase();
    if (/hook|intro|attention|rant/.test(l)) return 'hook';
    if (/problem|pain|struggl|agitat|frustrat/.test(l)) return 'problem';
    if (/solution|introduc|meet|reveal/.test(l)) return 'solution';
    if (/demo|feature|show|check|watch/.test(l)) return 'demo';
    if (/proof|review|testimon|result|before|after|rating/.test(l)) return 'proof';
    if (/cta|buy|shop|link|offer|click|tap/.test(l)) return 'cta';
    return 'demo';
  }

  function parseBeats(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) return [];
    // split script on section markers (HOOK:, DEMO:, CTA: ...); unmarked text is classified by content
    const beats = [];
    let current = { type: null, lines: [] };
    lines.forEach(l => {
      const m = l.match(/^(hook|problem|agitate|solution|demo|feature|proof|testimonial|before|after|cta|offer|outro)\s*[:\-–]/i);
      if (m) {
        if (current.lines.length) beats.push(current);
        current = { type: classify(m[1]), lines: [l.replace(/^[^:\-–]+[:\-–]\s*/, '')] };
      } else {
        current.lines.push(l);
      }
    });
    if (current.lines.length) beats.push(current);
    return beats.map(b => b.type ? b : { ...b, type: classify(b.lines.join(' ')) });
  }

  function generate() {
    const product = $('sproduct').value.trim() || 'the product';
    const text = $('sscript').value.trim();
    if (!text) { alert('Please paste your script or a product description first.'); return; }
    const style = STYLE_TWEAK[$('sstyle').value];
    const ratio = $('sratio').value;
    let total = parseInt($('stotal').value, 10);
    if (!total || total < 10) total = 60;

    let beats = parseBeats(text);
    if (!beats.length) beats = [{ type: 'demo', lines: [text.slice(0, 120)] }];
    // ensure hook + CTA exist
    if (beats[0].type !== 'hook') beats.unshift({ type: 'hook', lines: ['Opening hook'] });
    if (beats[beats.length - 1].type !== 'cta') beats.push({ type: 'cta', lines: ['Call to action'] });

    const per = Math.max(2, Math.round(total / beats.length));
    const shots = [];
    beats.forEach(b => {
      const lib = SHOT_LIBRARY[b.type] || SHOT_LIBRARY.demo;
      const n = b.type === 'hook' || b.type === 'cta' ? 1 : Math.min(2, lib.length);
      for (let i = 0; i < n; i++) {
        const s = lib[i % lib.length];
        const dur = Math.max(2, Math.round(per / n));
        const about = b.lines[0] ? ` — ${b.lines[0].slice(0, 60)}` : '';
        shots.push({
          ...s,
          dur,
          prompt: `AI video prompt (${ratio}): ${s.shot.toLowerCase()} featuring ${product}${about}${style.suffix}. Vertical-safe composition.`
        });
      }
    });
    // normalize durations to sum to total
    const sum = shots.reduce((a, s) => a + s.dur, 0);
    if (sum !== total && shots.length) {
      shots[shots.length - 1].dur += total - sum;
      if (shots[shots.length - 1].dur < 2) shots[shots.length - 1].dur = 2;
    }

    $('shotTitle').textContent = `Your shot list — ${product} (${total}s, ${ratio})`;
    const tb = $('shotTable').querySelector('tbody');
    tb.innerHTML = shots.map((s, i) => `
      <tr>
        <td><strong>${i + 1}</strong></td>
        <td>${esc(s.shot)}<br><small style="color:var(--faint)">Overlay: ${esc(s.overlay)}</small></td>
        <td>${esc(s.framing)}</td>
        <td>${esc(s.cam)}</td>
        <td>${s.dur}s</td>
        <td style="font-size:.82rem;color:var(--muted)">${esc(s.prompt)}</td>
      </tr>`).join('');
    $('shotResult').style.display = 'block';
    $('shotResult').scrollIntoView({ behavior: 'smooth', block: 'start' });

    const plain = shots.map((s, i) =>
      `SHOT ${i + 1} (${s.dur}s) — ${s.shot}\n  Framing: ${s.framing} | Camera: ${s.cam} | Overlay: ${s.overlay}\n  AI PROMPT: ${s.prompt}`
    ).join('\n\n');
    const full = `SHOT LIST — ${product} (${total}s, ${$('sstyle').selectedOptions[0].text}, ${ratio})\n\n${plain}`;
    $('copyShots').onclick = e => copyText(full, e.target);
    $('dlShots').onclick = () => downloadText(`${product.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-shot-list.txt`, full);
  }

  $('shotBtn').addEventListener('click', generate);
});
