// Voice Tool Finder Quiz — 4 questions -> recommendation
(function () {
  'use strict';
  const go = document.getElementById('quiz-go');
  if (!go) return;

  const answers = {};
  document.querySelectorAll('.quiz-q').forEach((q, qi, all) => {
    q.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        q.querySelectorAll('button').forEach(b => b.classList.remove('sel'));
        btn.classList.add('sel');
        answers[q.getAttribute('data-q')] = btn.getAttribute('data-v');
        const next = all[qi + 1];
        if (next) { all.forEach(s => s.classList.remove('active')); next.classList.add('active'); }
      });
    });
  });

  function pick() {
    const { langs, budget, use, quality } = answers;
    // decision tree
    if (budget === 'free') {
      if (use === 'dub') return {
        name: 'Captions (free tier)', langs: '29 languages', price: 'Free tier available',
        why: 'Captions dubs short-form video with lip-sync on its free tier \u2014 the fastest free way to try AI dubbing. Pair it with our browser voice tester for zero-cost previews.',
        alt: 'Runner-up: your browser\u2019s Web Speech API \u2014 100% free narration tests in 30+ languages.' };
      return {
        name: 'ElevenLabs (free tier)', langs: '32 languages', price: 'Free: 10k chars/mo',
        why: 'The most natural free multilingual voices available. The free tier is generous enough for testing narration in Spanish, French, Hindi, Arabic, and more.',
        alt: 'Runner-up: Google Cloud TTS free quota \u2014 50+ languages, great via API.' };
    }
    if (use === 'dub') {
      if (budget === 'high' || langs === '10+') return {
        name: 'HeyGen', langs: '175+ languages & dialects', price: 'From ~$29/mo',
        why: 'Best-in-class AI dubbing with voice cloning and lip-sync at scale. Ideal when you need 10+ languages with consistent brand voice.',
        alt: 'Runner-up: Rask AI \u2014 strong translation-first dubbing, great for long YouTube videos.' };
      return {
        name: 'Rask AI', langs: '135 languages', price: 'From ~$50/mo',
        why: 'Translation-first dubbing built for YouTubers: upload once, get dubbed versions with synced timing. Excellent for 3\u201310 languages on a mid budget.',
        alt: 'Runner-up: HeyGen \u2014 better lip-sync, slightly pricier.' };
    }
    if (use === 'realtime') return {
      name: 'ElevenLabs Conversational AI', langs: '32 languages', price: 'From ~$5/mo + usage',
      why: 'Low-latency multilingual voice agents with natural turn-taking \u2014 the standard for real-time use cases.',
      alt: 'Runner-up: Azure Speech \u2014 enterprise-grade real-time TTS in 140+ locales.' };
    if (quality === 'natural' || budget === 'high') return {
      name: 'ElevenLabs', langs: '32 languages', price: 'From ~$5/mo',
      why: 'The most human-sounding multilingual voices in 2026, with voice cloning so your dubs sound like YOU in every language.',
      alt: 'Runner-up: PlayHT \u2014 140+ languages, strong API, slightly less natural.' };
    if (quality === 'api') return {
      name: 'Google Cloud Text-to-Speech', langs: '50+ languages', price: 'Pay-as-you-go, generous free tier',
      why: 'Rock-solid API, 50+ languages, and pricing that scales from side project to millions of characters.',
      alt: 'Runner-up: Azure AI Speech \u2014 140+ locales and the best SSML control.' };
    return {
      name: 'Murf', langs: '20+ languages', price: 'From ~$19/mo',
      why: 'The simplest workflow for creators: paste script, pick from 120+ voices across 20+ languages, export studio-quality audio in minutes.',
      alt: 'Runner-up: PlayHT \u2014 more languages (140+) if Murf\u2019s list is too short.' };
  }

  go.addEventListener('click', () => {
    const missing = ['langs', 'budget', 'use', 'quality'].filter(k => !answers[k]);
    const res = document.getElementById('quiz-result');
    res.style.display = 'block';
    if (missing.length) {
      res.innerHTML = '<b>Almost there!</b> Please answer all 4 questions above, then press the button again.';
      res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    const r = pick();
    res.innerHTML =
      '<p style="color:var(--muted)">\U0001f3af Your best match</p>' +
      '<h3 style="font-size:1.5rem;margin:6px 0">' + r.name + '</h3>' +
      '<div style="margin:8px 0"><span class="tag">' + r.langs + '</span>' +
      '<span class="tag">' + r.price + '</span></div>' +
      '<p>' + r.why + '</p>' +
      '<p style="color:var(--muted);margin-top:8px">' + r.alt + '</p>' +
      '<div class="tip" style="margin-top:12px"><b>Next step:</b> compare it against the field in our ' +
      '<a href="../guides/best-multilingual-ai-voice-tools-2026.html">2026 tools guide</a>, or hear what ' +
      'free browser voices sound like in the <a href="language-voice-tester.html">voice tester</a>.</div>';
    res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();
