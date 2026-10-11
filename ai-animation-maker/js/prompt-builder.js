/* AIAnimationMaker — Animation Prompt Builder */
(function () {
  'use strict';
  var STYLES = {
    '3d-pixar': 'Pixar-style 3D animation',
    '2d-cartoon': 'classic 2D cartoon animation',
    'anime': 'Japanese anime style animation',
    'claymation': 'claymation stop-motion style',
    'motion-graphics': 'modern motion graphics animation',
    'watercolor': 'soft watercolor storybook animation',
    'pixel-art': 'pixel art animation',
    'cinematic': 'cinematic photorealistic animation',
    'chibi': 'cute chibi-style animation',
    'paper-cutout': 'paper cutout animation style'
  };
  var CAMERAS = {
    'static': 'static camera',
    'slow-zoom-in': 'slow cinematic zoom-in',
    'slow-zoom-out': 'slow cinematic zoom-out',
    'pan-left': 'smooth pan from right to left',
    'pan-right': 'smooth pan from left to right',
    'tracking': 'tracking shot following the subject',
    'orbit': 'slow orbital camera move around the subject',
    'crane-up': 'crane shot rising upward',
    'handheld': 'subtle handheld camera feel'
  };

  function val(id) { return (document.getElementById(id).value || '').trim(); }

  function build() {
    var character = val('p-character') || 'a friendly animated character';
    var action = val('p-action') || 'waving at the camera';
    var setting = val('p-setting') || 'a colorful fantasy landscape';
    var styleKey = document.getElementById('p-style').value;
    var style = STYLES[styleKey] || STYLES['3d-pixar'];
    var camera = CAMERAS[document.getElementById('p-camera').value] || 'static camera';
    var mood = val('p-mood') || 'cheerful and warm';
    var duration = val('p-duration') || '5';
    var aspect = document.getElementById('p-aspect').value;
    var negative = val('p-negative');

    var prompt = style.charAt(0).toUpperCase() + style.slice(1)
      + ' of ' + character + ' ' + action
      + ' in ' + setting + '. '
      + 'Camera: ' + camera + '. '
      + 'Mood: ' + mood + '. '
      + 'Duration: ' + duration + ' seconds, ' + aspect + ' aspect ratio, smooth fluid motion, high detail, vibrant colors.';

    var full = prompt + (negative ? '\n\nNegative prompt: ' + negative : '');
    var box = document.getElementById('prompt-output');
    box.textContent = full;
    var count = document.getElementById('prompt-count');
    if (count) count.textContent = full.length + ' characters';
    return full;
  }

  var inputs = ['p-character', 'p-action', 'p-setting', 'p-style', 'p-camera', 'p-mood', 'p-duration', 'p-aspect', 'p-negative'];
  inputs.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', build);
  });

  var RANDOM = [
    ['a brave little dragon', 'learning to fly for the first time', 'a sunny meadow full of flowers', 'chibi', 'slow-zoom-in', 'heartwarming and playful'],
    ['a wise old robot', 'teaching a child to plant a tree', 'a cozy futuristic greenhouse', '3d-pixar', 'tracking', 'gentle and inspiring'],
    ['a speedy ninja cat', 'racing through neon city rooftops', 'a rainy cyberpunk city at night', 'anime', 'orbit', 'intense and electric'],
    ['a tiny paper boat captain', 'sailing across a giant teacup ocean', 'a whimsical kitchen world', 'paper-cutout', 'pan-left', 'whimsical and dreamy'],
    ['a grumpy cloud', 'grumbling while raining candy', 'a pastel candy village', '2d-cartoon', 'crane-up', 'silly and lighthearted']
  ];

  document.getElementById('btn-random').addEventListener('click', function () {
    var r = RANDOM[Math.floor(Math.random() * RANDOM.length)];
    document.getElementById('p-character').value = r[0];
    document.getElementById('p-action').value = r[1];
    document.getElementById('p-setting').value = r[2];
    document.getElementById('p-style').value = r[3];
    document.getElementById('p-camera').value = r[4];
    document.getElementById('p-mood').value = r[5];
    build();
  });

  document.getElementById('btn-copy-prompt').addEventListener('click', function () {
    var text = build();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        alert('Prompt copied! Paste it into your AI animation generator. ✨');
      }, function () { alert('Copy failed — select the text manually.'); });
    }
  });

  document.getElementById('btn-clear-prompt').addEventListener('click', function () {
    inputs.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.tagName !== 'SELECT') el.value = '';
    });
    document.getElementById('p-style').selectedIndex = 0;
    document.getElementById('p-camera').selectedIndex = 0;
    document.getElementById('p-aspect').selectedIndex = 0;
    build();
  });

  build();
})();
