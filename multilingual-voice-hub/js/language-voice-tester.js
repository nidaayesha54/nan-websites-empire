// Language Voice Tester — Web Speech API, voices grouped by language
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const textEl = $('vt-text'), voiceEl = $('vt-voice'), rateEl = $('vt-rate'),
        pitchEl = $('vt-pitch'), tipEl = $('vt-tip');
  if (!textEl) return;

  const LANG_NAMES = {
    'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'pt': 'Portuguese',
    'it': 'Italian', 'nl': 'Dutch', 'ar': 'Arabic', 'hi': 'Hindi', 'ur': 'Urdu',
    'zh': 'Mandarin Chinese', 'yue': 'Cantonese', 'ja': 'Japanese', 'ko': 'Korean',
    'ru': 'Russian', 'tr': 'Turkish', 'pl': 'Polish', 'sv': 'Swedish', 'da': 'Danish',
    'no': 'Norwegian', 'nb': 'Norwegian', 'fi': 'Finnish', 'el': 'Greek', 'he': 'Hebrew',
    'hu': 'Hungarian', 'ro': 'Romanian', 'cs': 'Czech', 'sk': 'Slovak', 'bg': 'Bulgarian',
    'uk': 'Ukrainian', 'id': 'Indonesian', 'ms': 'Malay', 'th': 'Thai', 'vi': 'Vietnamese',
    'ta': 'Tamil', 'te': 'Telugu', 'bn': 'Bengali', 'mr': 'Marathi', 'gu': 'Gujarati',
    'pa': 'Punjabi', 'kn': 'Kannada', 'ml': 'Malayalam', 'ne': 'Nepali', 'si': 'Sinhala',
    'fa': 'Persian', 'sw': 'Swahili', 'am': 'Amharic', 'zu': 'Zulu', 'af': 'Afrikaans',
    'ca': 'Catalan', 'hr': 'Croatian', 'sr': 'Serbian', 'sl': 'Slovenian', 'lt': 'Lithuanian',
    'lv': 'Latvian', 'et': 'Estonian', 'is': 'Icelandic', 'mt': 'Maltese', 'cy': 'Welsh',
    'ga': 'Irish', 'eu': 'Basque', 'gl': 'Galician', 'fil': 'Filipino', 'jv': 'Javanese'
  };

  function langLabel(code) {
    const base = code.split('-')[0].split('_')[0].toLowerCase();
    return LANG_NAMES[base] || code;
  }

  function friendlyVoiceName(v) {
    // strip redundant lang tags from names for readability
    return v.name.replace(/\s*\((United States|US|Great Britain|UK)\)\s*/i, '').trim();
  }

  let voices = [];

  function populate() {
    if (!('speechSynthesis' in window)) {
      voiceEl.innerHTML = '<option value="">Speech synthesis not supported in this browser</option>';
      return;
    }
    voices = speechSynthesis.getVoices().slice().sort((a, b) =>
      langLabel(a.lang).localeCompare(langLabel(b.lang)) || a.name.localeCompare(b.name));
    if (!voices.length) {
      voiceEl.innerHTML = '<option value="">No voices found on this device</option>';
      return;
    }
    const groups = {};
    voices.forEach((v, i) => {
      const g = langLabel(v.lang) + (v.lang ? ' (' + v.lang + ')' : '');
      (groups[g] = groups[g] || []).push(i);
    });
    voiceEl.innerHTML = '';
    Object.keys(groups).sort().forEach(g => {
      const og = document.createElement('optgroup');
      og.label = g + ' — ' + groups[g].length + ' voice' + (groups[g].length > 1 ? 's' : '');
      groups[g].forEach(i => {
        const v = voices[i];
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = friendlyVoiceName(v) + (v.localService ? ' · on-device' : ' · network');
        og.appendChild(opt);
      });
      voiceEl.appendChild(og);
    });
    // default: pick an English voice if present
    const enIdx = voices.findIndex(v => v.lang && v.lang.toLowerCase().startsWith('en'));
    if (enIdx >= 0) voiceEl.value = enIdx;
    $('vt-voice-count').textContent = voices.length + ' voices across ' +
      Object.keys(groups).length + ' languages detected on your device.';
  }

  if ('speechSynthesis' in window) {
    populate();
    if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = populate;
  } else {
    populate();
  }

  function updateCounts() {
    const t = textEl.value.trim();
    $('vt-words').textContent = t ? t.split(/\s+/).length : 0;
    $('vt-chars').textContent = textEl.value.length;
  }
  textEl.addEventListener('input', updateCounts);

  document.querySelectorAll('[data-vt-sample]').forEach(btn => {
    btn.addEventListener('click', () => {
      textEl.value = btn.getAttribute('data-vt-sample');
      updateCounts();
    });
  });

  rateEl.addEventListener('input', () => { $('vt-rate-lbl').textContent = Number(rateEl.value).toFixed(2).replace(/0$/, '') + '×'; });
  pitchEl.addEventListener('input', () => { $('vt-pitch-lbl').textContent = Number(pitchEl.value).toFixed(1); });

  function speak() {
    const text = textEl.value.trim();
    if (!text) {
      tipEl.style.display = 'block';
      tipEl.textContent = 'Type or load some text first — then press Play.';
      return;
    }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = voices[Number(voiceEl.value)];
    if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = Number(rateEl.value);
    u.pitch = Number(pitchEl.value);
    u.onend = () => { tipEl.style.display = 'none'; };
    u.onerror = () => {
      tipEl.style.display = 'block';
      tipEl.textContent = 'Playback was interrupted. Press Play again — some browsers pause speech after a while on inactive tabs.';
    };
    speechSynthesis.speak(u);
    tipEl.style.display = 'block';
    tipEl.textContent = 'Speaking with: ' + (v ? friendlyVoiceName(v) + ' (' + v.lang + ')' : 'default voice') +
      ' at ' + rateEl.value + '× rate.';
  }

  $('vt-play').addEventListener('click', speak);
  $('vt-pause').addEventListener('click', () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.paused ? speechSynthesis.resume() : speechSynthesis.pause();
    }
  });
  $('vt-stop').addEventListener('click', () => { speechSynthesis.cancel(); tipEl.style.display = 'none'; });
})();
