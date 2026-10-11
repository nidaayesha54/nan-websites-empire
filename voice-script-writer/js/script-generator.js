/* VoiceScriptWriter — Script Generator */
(function () {
  'use strict';
  var VSW = window.VSW;

  var TONE_WORDS = {
    friendly: 'warm and conversational',
    professional: 'clear and trustworthy',
    urgent: 'fast-paced and high-energy',
    playful: 'fun and lighthearted'
  };

  var HOOKS = {
    ad: [
      'Stop scrolling — if {aud} this is for you: {topic}.',
      'What if {topic} could make your day a whole lot easier?',
      'Here\u2019s the {topic} secret everyone\u2019s talking about.'
    ],
    explainer: [
      'So, how does {topic} actually work? Let\u2019s break it down.',
      'You\u2019ve heard about {topic} — here\u2019s what it really does.',
      'Three things you need to know about {topic}. Starting now.'
    ],
    ivr: [
      'Thank you for calling {brand}.',
      'Welcome to {brand} — {topic} support line.',
      'Hello, and thanks for reaching {brand}.'
    ],
    announcement: [
      'Attention please — an important update from {brand}.',
      'Big news from {brand}: {topic} is here.',
      'We have an exciting announcement about {topic}.'
    ]
  };

  var CTAS = {
    ad: 'Tap the link and try {topic} today — only from {brand}.',
    explainer: 'Visit {brand} online to learn more and get started.',
    ivr: 'Press 1 to continue, press 2 to speak with a representative, or stay on the line.',
    announcement: 'Find full details at {brand} — don\u2019t miss out.'
  };

  var BODIES = {
    ad: 'It\u2019s {tone}, it\u2019s simple, and it was built for people like you.',
    explainer: 'Here\u2019s the simple version, step by step.',
    ivr: 'Please listen carefully so we can route your call.',
    announcement: 'Here\u2019s everything you need to know.'
  };

  function pick(arr, seed) {
    return arr[seed % arr.length];
  }

  function seedFrom(str) {
    var h = 0;
    str = String(str || '');
    for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) >>> 0; }
    return h;
  }

  function buildScript() {
    var purpose = document.getElementById('purpose').value;
    var topic = document.getElementById('topic').value.trim() || 'your product';
    var brand = document.getElementById('brand').value.trim() || 'our company';
    var audRaw = document.getElementById('audience').value.trim();
    var audience = audRaw ? 'you\u2019re ' + audRaw.replace(/^for\s+/i, '') + ',' : 'you\u2019re listening,';
    var toneKey = document.getElementById('tone').value;
    var tone = TONE_WORDS[toneKey] || 'warm and conversational';
    var points = document.getElementById('points').value
      .split('\n').map(function (l) { return l.trim(); }).filter(Boolean);

    var seed = seedFrom(topic + purpose + toneKey);

    var hook = pick(HOOKS[purpose], seed)
      .replace('{topic}', topic).replace('{brand}', brand).replace('{aud}', audience);

    var bodyLines = [BODIES[purpose].replace('{tone}', tone)];
    if (points.length) {
      points.slice(0, 4).forEach(function (p, i) {
        var lead = ['First,', 'Next,', 'And,', 'Finally,'][i] || 'Also,';
        var sentence = p.replace(/\.$/, '') + '.';
        bodyLines.push(lead + ' ' + sentence.charAt(0).toLowerCase() + sentence.slice(1));
      });
    } else {
      bodyLines.push('It saves you time, it saves you money, and it just works.');
    }

    var cta = CTAS[purpose].replace('{topic}', topic).replace('{brand}', brand);

    var labels = { ad: 'Opening Hook', explainer: 'Opening Hook', ivr: 'Greeting', announcement: 'Opening' };
    var bodyLabel = { ad: 'Main Message', explainer: 'Explanation', ivr: 'Menu Options', announcement: 'Details' };

    var fullText = '[' + labels[purpose].toUpperCase() + ']\n' + hook + '\n\n' +
      '[' + bodyLabel[purpose].toUpperCase() + ']\n' + bodyLines.join(' ') + '\n\n' +
      '[CALL TO ACTION]\n' + cta;

    var words = VSW.countWords(fullText);

    document.getElementById('outHook').textContent = hook;
    document.getElementById('outBody').textContent = bodyLines.join(' ');
    document.getElementById('outCta').textContent = cta;
    document.getElementById('statWords').textContent = words;
    document.getElementById('statTime').textContent = VSW.duration(words);
    document.getElementById('statPurpose').textContent =
      document.getElementById('purpose').selectedOptions[0].textContent;

    document.getElementById('result').classList.remove('hidden');
    document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' });

    document.getElementById('copyBtn').onclick = function () {
      VSW.copyText(fullText, this);
    };
    document.getElementById('dlBtn').onclick = function () {
      VSW.downloadText('voice-script-' + purpose + '.txt', fullText);
    };
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('genBtn').addEventListener('click', buildScript);
  });
})();
