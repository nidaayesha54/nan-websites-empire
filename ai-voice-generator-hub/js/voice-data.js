/* Shared AI voice tool dataset (approximate public pricing, 2026 — verify on vendor sites).
   Roughly 850 characters ≈ 1 minute of English audio at natural pace. */
(function () {
  'use strict';
  var TOOLS = [
    {
      id: 'elevenlabs', name: 'ElevenLabs',
      tagline: 'The most human-sounding AI voices on the market',
      model: 'characters',
      plans: [
        { name: 'Free', price: 0, chars: 10000 },
        { name: 'Starter', price: 5, chars: 30000 },
        { name: 'Creator', price: 22, chars: 100000 },
        { name: 'Pro', price: 99, chars: 500000 }
      ],
      paygPer1kChars: 0.30,
      quality: 10, ease: 8, languages: 32,
      bestFor: ['Audiobooks', 'Podcasts', 'YouTube narration'],
      useCases: ['podcast', 'video', 'audiobook', 'elearning'],
      features: ['Industry-leading realism', 'Instant & professional voice cloning', '32 languages', 'Projects long-form editor', 'Developer API'],
      blurb: 'Best realism money can buy. Voice cloning is unmatched — clone your own voice or license celebrity-style voices. Character-based pricing rewards efficient scripts.'
    },
    {
      id: 'murf', name: 'Murf AI',
      tagline: 'Studio-quality voiceovers for teams and creators',
      model: 'minutes',
      plans: [
        { name: 'Free', price: 0, minutes: 10 },
        { name: 'Creator', price: 19, minutes: 120 },
        { name: 'Business', price: 99, minutes: 480 }
      ],
      quality: 9, ease: 10, languages: 20,
      bestFor: ['YouTube videos', 'E-learning', 'Corporate presentations'],
      useCases: ['video', 'elearning', 'ads', 'podcast'],
      features: ['140+ natural voices', 'Built-in video & music editor', 'Voice changer', 'Team workspaces', 'Google Slides add-on'],
      blurb: 'The easiest path from script to finished video. Minutes-based pricing is simple, and the built-in editor means you never leave the app.'
    },
    {
      id: 'playht', name: 'Play.ht',
      tagline: 'Ultra-low-cost voices at serious scale',
      model: 'words',
      plans: [
        { name: 'Free trial', price: 0, chars: 12500 },
        { name: 'Creator', price: 19, words: 60000 },
        { name: 'Unlimited', price: 99, words: 999999999 }
      ],
      quality: 8, ease: 8, languages: 140,
      bestFor: ['Bulk content', 'Podcast feeds', 'News narration'],
      useCases: ['podcast', 'video', 'audiobook'],
      features: ['140+ languages & accents', 'Word-based pricing (generous)', 'Unlimited plan', 'Podcast RSS hosting', 'WordPress plugin'],
      blurb: 'The volume play. Word-based pricing plus a true unlimited tier makes it the cheapest route for high-output channels and faceless-video creators.'
    },
    {
      id: 'speechify', name: 'Speechify',
      tagline: 'The read-aloud app that started it all',
      model: 'listening',
      plans: [
        { name: 'Free', price: 0, minutes: 0, note: 'limited voices' },
        { name: 'Premium', price: 11.58, minutes: 999999999, note: 'billed $139/yr — unlimited listening' }
      ],
      quality: 8, ease: 10, languages: 60,
      bestFor: ['Listening & accessibility', 'Studying', 'Article narration'],
      useCases: ['listening'],
      features: ['Unlimited read-aloud', 'Celebrity & natural voices', 'Chrome / iOS / Android apps', 'Speeds up to 5x', 'Document import'],
      blurb: 'Built for listening, not production. If your goal is hearing articles, PDFs, and books read aloud — nothing beats its apps and speed control.'
    },
    {
      id: 'lovo', name: 'LOVO',
      tagline: 'Genny — voices + images for ads and video',
      model: 'characters',
      plans: [
        { name: 'Free', price: 0, chars: 4250 },
        { name: 'Pro+', price: 24, chars: 1000000 }
      ],
      quality: 9, ease: 9, languages: 100,
      bestFor: ['Ads & marketing', 'Product videos', 'Social content'],
      useCases: ['ads', 'video', 'elearning'],
      features: ['100+ languages', 'Emotional & expressive voices', 'AI art + video built in', 'Commercial license', 'Auto subtitles'],
      blurb: 'The marketer\u2019s pick. Expressive ad-ready voices plus built-in AI visuals make it a one-stop shop for promotional video.'
    }
  ];

  function planMinutes(tool, plan) {
    if (plan.minutes != null) return plan.minutes;
    if (plan.chars != null) return Math.floor(plan.chars / 850);
    if (plan.words != null) return Math.floor(plan.words / 150);
    return 0;
  }

  function cheapestPlanFor(tool, minutes) {
    var sorted = tool.plans.slice().sort(function (a, b) { return a.price - b.price; });
    for (var i = 0; i < sorted.length; i++) {
      if (planMinutes(tool, sorted[i]) >= minutes) return sorted[i];
    }
    return null; // nothing covers it
  }

  window.vghData = {
    TOOLS: TOOLS,
    CHARS_PER_MIN: 850,
    WORDS_PER_MIN: 150,
    planMinutes: planMinutes,
    cheapestPlanFor: cheapestPlanFor,
    byId: function (id) {
      for (var i = 0; i < TOOLS.length; i++) if (TOOLS[i].id === id) return TOOLS[i];
      return null;
    }
  };
})();
