/* Script Timer — word count → spoken duration estimator (and reverse calculator) */
(function () {
  var PRESETS = { slow: 130, conversational: 150, brisk: 170, fast: 190 };

  function words(str) {
    var w = str.trim().split(/\s+/).filter(Boolean);
    return w.length;
  }
  function fmtSecs(totalSecs) {
    totalSecs = Math.round(totalSecs);
    var m = Math.floor(totalSecs / 60), s = totalSecs % 60;
    if (m === 0) return s + ' sec';
    return m + ' min ' + (s < 10 ? '0' : '') + s + ' sec';
  }

  function update() {
    var ta = document.getElementById('st-script');
    if (!ta) return;
    var text = ta.value;
    var wc = words(text);
    var cc = text.length;
    var wpm = Number(document.getElementById('st-wpm').value);

    document.getElementById('st-wpm-val').textContent = wpm + ' WPM';
    document.getElementById('stat-words').textContent = wc;
    document.getElementById('stat-chars').textContent = cc;

    var secs = wc / wpm * 60;
    document.getElementById('stat-time').textContent = fmtSecs(secs);

    // Per-WPM table
    var rows = Object.keys(PRESETS).map(function (k) {
      var p = PRESETS[k];
      var label = k.charAt(0).toUpperCase() + k.slice(1) + ' (' + p + ' WPM)';
      var t = fmtSecs(wc / p * 60);
      var active = (p === wpm || Math.abs(p - wpm) < 5) ? ' style="background:rgba(124,58,237,.12);font-weight:700"' : '';
      return '<tr' + active + '><td>' + label + '</td><td>' + t + '</td></tr>';
    }).join('');
    document.getElementById('st-table').innerHTML = rows;

    // Readability hints
    var hints = [];
    var sentences = text.split(/[.!?]+/).filter(function (s) { return s.trim().length > 0; });
    if (wc > 0 && sentences.length > 0) {
      var avg = wc / sentences.length;
      if (avg > 22) hints.push('⚠️ Long sentences (avg ' + Math.round(avg) + ' words) — AI avatars sound more natural with sentences under ~18 words.');
      else hints.push('✅ Sentence length looks good for natural-sounding speech (avg ' + Math.round(avg) + ' words).');
    }
    if (/(,)/.test(text)) hints.push('✅ You use commas — avatars read them as natural pauses.');
    else if (wc > 40) hints.push('💡 Add commas where a human would pause — avatars treat them as breath marks.');
    if (/\b[A-Z]{4,}\b/.test(text)) hints.push('⚠️ ALL-CAPS words may be spelled out letter-by-letter by some TTS voices — write them normally.');
    var hbox = document.getElementById('st-hints');
    hbox.innerHTML = hints.map(function (h) { return '<li>' + h + '</li>'; }).join('');
    hbox.style.display = hints.length ? 'block' : 'none';
  }

  function reverseCalc() {
    var mins = Number(document.getElementById('rc-mins').value);
    var wpm = Number(document.getElementById('rc-wpm').value);
    var out = document.getElementById('rc-out');
    if (!mins || mins <= 0) { out.textContent = 'Enter a target length above.'; return; }
    var low = Math.round(mins * 130), high = Math.round(mins * 190), mid = Math.round(mins * wpm);
    out.innerHTML = 'Aim for <b>' + low + '–' + high + '</b> words (about <b>' + mid + '</b> at ' + wpm + ' WPM).'
      + '<br><span style="color:var(--muted);font-size:.9rem">Tip: write to the middle of the range, then time it with the estimator above.</span>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var ta = document.getElementById('st-script');
    if (!ta) return;

    // Sample script
    var sample = 'Welcome to AIAvatarVideo. In the next sixty seconds, you\'ll learn how to turn any script into a professional talking-head video. Step one: write your script the way you speak, with short sentences and natural pauses. Step two: paste it into your avatar tool and pick a voice that matches your brand. Step three: generate, review, and publish. That\'s it — no camera, no microphone, no retakes.';
    document.getElementById('st-load-sample').addEventListener('click', function () {
      ta.value = sample; update();
    });
    document.getElementById('st-clear').addEventListener('click', function () {
      ta.value = ''; update();
    });

    ta.addEventListener('input', update);
    document.getElementById('st-wpm').addEventListener('input', update);

    // Preset buttons
    document.querySelectorAll('[data-wpm]').forEach(function (b) {
      b.addEventListener('click', function () {
        document.getElementById('st-wpm').value = b.getAttribute('data-wpm');
        update();
      });
    });

    // Reverse calculator
    document.getElementById('rc-calc').addEventListener('click', reverseCalc);

    // Copy timing summary
    document.getElementById('st-copy').addEventListener('click', function () {
      var wc = document.getElementById('stat-words').textContent;
      var t = document.getElementById('stat-time').textContent;
      var wpm = document.getElementById('st-wpm').value;
      copyText('Script: ' + wc + ' words ≈ ' + t + ' spoken at ' + wpm + ' WPM.', this);
    });

    update();
  });
})();
