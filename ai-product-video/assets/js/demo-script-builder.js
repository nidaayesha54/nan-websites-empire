// Demo Script Builder — PAS structure with timing, visuals, voiceover transcript
document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);

  const TONE_LINES = {
    friendly: {
      opener: w => `If you're ${w}, you know exactly how frustrating this feels…`,
      solution: p => `That's why we created ${p} — made for people like you.`,
      cta: c => `Ready to feel the difference? ${c}`
    },
    bold: {
      opener: w => `Attention, ${w}: stop settling for this problem.`,
      solution: p => `Meet ${p} — the upgrade you should have had yesterday.`,
      cta: c => `Don't wait. ${c}`
    },
    calm: {
      opener: w => `For ${w}, this small daily frustration adds up quietly…`,
      solution: p => `We built ${p} to solve it gently — no gimmicks, just results.`,
      cta: c => `When you're ready: ${c}`
    },
    funny: {
      opener: w => `Okay, ${w} — tell me this hasn't happened to you a hundred times…`,
      solution: p => `Enter ${p}. Problem = officially solved. You're welcome.`,
      cta: c => `Go on, treat yourself: ${c}`
    }
  };

  function wordCount(s) { return s.trim().split(/\s+/).filter(Boolean).length; }

  function build() {
    const name = $('pname').value.trim() || '[Your Product]';
    const cat = $('pcat').value.trim() || 'everyday';
    const audience = $('audience').value.trim() || 'anyone who wants a better solution';
    const features = $('features').value.split('\n').map(f => f.trim()).filter(Boolean).slice(0, 5);
    const benefit = $('benefit').value.trim() || 'a noticeably better result';
    const total = parseInt($('length').value, 10);
    const offer = $('offer').value.trim();
    const cta = $('cta').value.trim() || 'Click the link to get yours today';
    const T = TONE_LINES[$('tone').value];

    const featureLines = features.length ? features : ['its standout feature'];
    const problem = `Struggling with ${cat}-related hassle that keeps slowing ${audience} down`;
    const agitate = `Every day it continues, you lose time, energy, and momentum — ${benefit} stays out of reach`;

    // timing: hook 5s, problem+agitate ~20%, solution+features ~55%, proof+offer ~15%, CTA 10%
    const secs = {
      hook: Math.max(4, Math.round(total * 0.08)),
      problem: Math.round(total * 0.17),
      solution: Math.round(total * 0.5),
      proof: Math.round(total * 0.15),
      cta: Math.max(4, total - 0) // adjusted below
    };
    secs.cta = Math.max(4, total - secs.hook - secs.problem - secs.solution - secs.proof);

    const featureBeats = featureLines.map((f, i) => {
      const beatSecs = Math.max(3, Math.round((secs.solution / featureLines.length)));
      return {
        label: `Demo beat ${i + 1} · ~${beatSecs}s`,
        vo: `And check this out: ${f.charAt(0).toLowerCase() + f.slice(1)} — so you ${benefit}.`,
        visual: `Close-up AI product shot demonstrating: "${f}". On-screen caption with key phrase.`
      };
    });

    const sections = [
      {
        label: `HOOK · 0:00–0:${String(secs.hook).padStart(2, '0')}`,
        vo: T.opener(audience) + ' ' + problem + '.',
        visual: 'Scroll-stopping close-up of the pain point. Bold on-screen text of the problem. Fast cut in.'
      },
      {
        label: `PROBLEM + AGITATE · next ~${secs.problem}s`,
        vo: agitate + '. Sound familiar? It\'s not your fault — most solutions just don\'t cut it.',
        visual: 'Quick montage of failed alternatives / frustration moments. Relatable UGC-style footage.'
      },
      {
        label: `SOLUTION · next ~${secs.solution}s`,
        vo: T.solution(name) + ` Here's how it works.`,
        visual: 'Product reveal with light-sweep effect. Logo/title card animation.'
      },
      ...featureBeats,
      {
        label: `PROOF · next ~${secs.proof}s`,
        vo: offer
          ? `Join thousands already switching to ${name} — ${offer}.`
          : `Join thousands already switching to ${name} — because it actually works.`,
        visual: 'Star-rating overlay, happy customer clips, before/after split-screen.'
      },
      {
        label: `CTA · final ~${secs.cta}s`,
        vo: T.cta(cta),
        visual: 'Product hero shot + big CTA button animation. End card with offer text.'
      }
    ];

    const full = sections.map(s =>
      `━━━ ${s.label} ━━━\n🎙️ VO: ${s.vo}\n🎬 VISUAL: ${s.visual}`
    ).join('\n\n');
    const voOnly = sections.map(s => s.vo).join('\n\n');

    $('resultTitle').textContent = `Your ${total}s demo script for "${name}"`;
    $('scriptSections').innerHTML = sections.map(s => `
      <div class="script-block">
        <div class="script-label">${esc(s.label)}</div>
        <p><strong>🎙️</strong> ${esc(s.vo)}</p>
        <p style="color:var(--muted)"><strong>🎬</strong> ${esc(s.visual)}</p>
      </div>`).join('');
    $('voText').textContent = voOnly;
    $('result').style.display = 'block';
    $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });

    const fileBase = name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'product';
    $('copyScript').onclick = e => copyText(`DEMO SCRIPT — ${name} (${total}s)\n\n${full}\n\n━━━ VOICEOVER TRANSCRIPT ━━━\n${voOnly}`, e.target);
    $('dlScript').onclick = () => downloadText(`${fileBase}-demo-script.txt`, `DEMO SCRIPT — ${name} (${total}s)\n\n${full}\n\n━━━ VOICEOVER TRANSCRIPT ━━━\n${voOnly}`);
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  $('genBtn').addEventListener('click', build);
});
