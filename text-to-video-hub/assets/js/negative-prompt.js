// Negative Prompt Generator logic for tools/negative-prompt.html
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('neg-form');
  if (!form) return;

  var GROUPS = {
    anatomy: ['deformed faces', 'extra limbs', 'missing fingers', 'morphed bodies', 'unnatural proportions'],
    motion: ['flickering', 'jerky motion', 'melting objects', 'warped background', 'frame tearing'],
    quality: ['blurry', 'low resolution', 'pixelated', 'noisy', 'overexposed', 'underexposed'],
    text: ['watermark', 'logo', 'text artifacts', 'subtitles', 'captions'],
    style: ['cartoonish (when realism wanted)', 'oversaturated', 'flat lighting', 'static image look']
  };

  // Group presets for quick selection
  document.querySelectorAll('[data-preset]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var preset = btn.getAttribute('data-preset');
      clearAll();
      if (preset === 'all') {
        checkAll(true);
      } else if (GROUPS[preset]) {
        GROUPS[preset].forEach(function (label) { checkByLabel(label, true); });
      }
      generate();
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    generate();
  });

  var clearBtn = document.getElementById('clear-btn');
  if (clearBtn) clearBtn.addEventListener('click', function () { clearAll(); generate(); });

  var copyBtn = document.getElementById('copy-neg');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      copyText(window.__lastNeg || '', document.getElementById('copied-note'));
    });
  }

  function checkedLabels() {
    var out = [];
    form.querySelectorAll('input[type=checkbox]:checked').forEach(function (cb) {
      out.push(cb.value);
    });
    return out;
  }
  function checkByLabel(label, on) {
    form.querySelectorAll('input[type=checkbox]').forEach(function (cb) {
      if (cb.value === label) cb.checked = on;
    });
  }
  function checkAll(on) {
    form.querySelectorAll('input[type=checkbox]').forEach(function (cb) { cb.checked = on; });
  }
  function clearAll() { checkAll(false); }

  function generate() {
    var labels = checkedLabels();
    var text = labels.join(', ');
    var pre = document.getElementById('result-text');
    var box = document.getElementById('result-box');
    if (box && pre) {
      pre.textContent = text || '(nothing selected — check some artifacts above)';
      box.style.display = 'block';
    }
    window.__lastNeg = text;
  }
});
