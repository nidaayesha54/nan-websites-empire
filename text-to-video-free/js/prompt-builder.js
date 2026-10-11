// Guided prompt builder: subject + style + camera + mood -> finished prompt
(function () {
  var NEGATIVE = "blurry, distorted faces, extra limbs, watermark, text overlay, low quality, flickering, morphing";

  document.getElementById('build').addEventListener('click', function () {
    var subject = document.getElementById('subject').value.trim();
    var style = document.getElementById('style').value;
    var camera = document.getElementById('camera').value;
    var mood = document.getElementById('mood').value;
    var extra = document.getElementById('extra').value.trim();

    if (!subject) {
      document.getElementById('subject').focus();
      document.getElementById('subject').style.borderColor = '#ff7b7b';
      return;
    }
    document.getElementById('subject').style.borderColor = '';

    var prompt = cap(subject) + ', ' + camera + ', ' + style + ', ' + mood;
    if (extra) prompt += ', ' + extra;
    prompt += ', ultra-detailed, smooth motion, high quality';

    document.getElementById('promptText').textContent = prompt;
    document.getElementById('output').style.display = 'block';
    document.getElementById('output').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  document.getElementById('copyBtn').addEventListener('click', function () {
    copyText(document.getElementById('promptText').textContent, this);
  });

  document.getElementById('negBtn').addEventListener('click', function () {
    var full = document.getElementById('promptText').textContent +
      '\n\nNegative prompt: ' + NEGATIVE;
    copyText(full, this);
  });
})();
