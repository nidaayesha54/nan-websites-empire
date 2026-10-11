// Prompt Generator logic for tools/prompt-generator.html
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('prompt-form');
  if (!form) return;

  var STYLE_DETAIL = {
    cinematic: 'cinematic film still, shallow depth of field, rich color grade',
    anime: 'anime style, vibrant cel shading, dynamic linework',
    photoreal: 'ultra photorealistic, 8k, natural skin texture, lifelike detail',
    cartoon: '3D cartoon style, soft rounded shapes, bright saturated colors',
    fantasy: 'epic fantasy art, dramatic atmosphere, intricate detail',
    vintage: 'vintage film look, subtle grain, warm faded tones',
    documentary: 'documentary realism, handheld natural feel, authentic light'
  };

  var CAMERA_DETAIL = {
    'wide shot': 'wide establishing shot',
    'close up': 'intimate close-up',
    'aerial drone': 'sweeping aerial drone shot',
    'tracking shot': 'smooth tracking shot following the action',
    'low angle': 'dramatic low-angle shot',
    'overhead': 'top-down overhead shot',
    'slow push-in': 'slow cinematic push-in'
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var subject = val('subject').trim();
    var action = val('action').trim();
    var style = val('style');
    var camera = val('camera');
    var mood = val('mood');
    var lighting = val('lighting');
    var aspect = val('aspect');
    var duration = val('duration');

    if (!subject) {
      show('Please enter a subject first (e.g. "a lion" or "a futuristic city").');
      return;
    }

    var parts = [];
    parts.push(CAMERA_DETAIL[camera] + ' of ' + subject);
    if (action) parts.push(action);
    parts.push('in a ' + mood + ' mood');
    parts.push(STYLE_DETAIL[style]);
    parts.push(lighting + ' lighting');

    var prompt = parts.join(', ') + '.';
    var negative = 'blurry, low quality, distorted faces, extra limbs, flickering, watermark, text artifacts';

    var out = prompt + '\n\n-- Aspect ratio: ' + aspect + '  |  Duration target: ~' + duration + 's' +
      '\n-- Negative prompt: ' + negative;

    show(out);
    window.__lastPrompt = prompt;
  });

  var copyBtn = document.getElementById('copy-prompt');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      if (window.__lastPrompt) copyText(window.__lastPrompt, document.getElementById('copied-note'));
    });
  }

  var copyNeg = document.getElementById('copy-negative');
  if (copyNeg) {
    copyNeg.addEventListener('click', function () {
      copyText('blurry, low quality, distorted faces, extra limbs, flickering, watermark, text artifacts', document.getElementById('copied-neg'));
    });
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }
  function show(text) {
    var box = document.getElementById('result-box');
    var pre = document.getElementById('result-text');
    if (box && pre) {
      pre.textContent = text;
      box.style.display = 'block';
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
});
