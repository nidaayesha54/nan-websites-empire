// Prompt Improver logic for tools/prompt-improver.html
document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('improve-btn');
  if (!btn) return;

  var CAMERA_HINTS = ['wide shot', 'close-up', 'close up', 'drone', 'aerial', 'tracking', 'pan', 'zoom', 'angle', 'shot'];
  var LIGHT_HINTS = ['lighting', 'lit', 'sunset', 'golden hour', 'neon', 'moonlight', 'studio', 'shadow', 'glow'];
  var MOOD_HINTS = ['mood', 'atmosphere', 'feeling', 'vibe', 'dramatic', 'peaceful', 'tense', 'joyful', 'eerie', 'nostalgic'];
  var STYLE_HINTS = ['cinematic', 'photorealistic', 'anime', 'cartoon', 'realistic', 'painting', 'vintage', 'fantasy', 'documentary'];

  function hasAny(text, list) {
    var t = text.toLowerCase();
    return list.some(function (w) { return t.indexOf(w) !== -1; });
  }

  btn.addEventListener('click', function () {
    var input = document.getElementById('weak-prompt');
    var raw = (input.value || '').trim();
    if (!raw) {
      showResult('Paste a prompt above first — e.g. "a dog running".');
      return;
    }

    // Split core subject from the rest as best we can
    var subject = raw.split(/[,.]/)[0].trim();

    var added = [];
    if (!hasAny(raw, CAMERA_HINTS)) added.push('🎥 Camera: add a shot type — e.g. "sweeping drone shot" or "slow push-in".');
    if (!hasAny(raw, LIGHT_HINTS)) added.push('💡 Lighting: specify it — e.g. "warm golden-hour lighting".');
    if (!hasAny(raw, MOOD_HINTS)) added.push('🎭 Mood: set the feeling — e.g. "a joyful, energetic mood".');
    if (!hasAny(raw, STYLE_HINTS)) added.push('🎨 Style: pick a look — e.g. "cinematic film still".');

    var actionMatch = raw.match(/(running|walking|flying|swimming|dancing|talking|fighting|exploring|cooking|driving|playing|singing|laughing|crying|jumping|falling|rising|sailing|glowing|shimmering|moving)/i);

    var improved = 'Improved prompt:\n' +
      'Sweeping cinematic shot of ' + lcFirst(subject) +
      (actionMatch ? ', ' + actionMatch[1].toLowerCase() + ' with natural, fluid motion' : ', moving with natural fluid motion') +
      ', in warm golden-hour lighting with soft shadows, joyful and uplifting mood, ' +
      'ultra photorealistic detail, shallow depth of field, smooth camera movement, 8k quality.\n\n' +
      'Negative prompt: blurry, distorted faces, extra limbs, flickering, watermark, text artifacts, low quality';

    var report = '';
    if (added.length) {
      report = '\n\nWhat was added:\n' + added.map(function (a) { return '• ' + a; }).join('\n');
    } else {
      report = '\n\n✓ Your prompt already covers camera, lighting, mood, and style — it is ready to use!';
    }

    showResult(improved + report);
    window.__lastImproved = improved;
  });

  var copyBtn = document.getElementById('copy-improved');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      if (window.__lastImproved) copyText(window.__lastImproved, document.getElementById('copied-note'));
    });
  }

  function lcFirst(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
  function showResult(text) {
    var box = document.getElementById('result-box');
    var pre = document.getElementById('result-text');
    if (box && pre) {
      pre.textContent = text;
      box.style.display = 'block';
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
});
