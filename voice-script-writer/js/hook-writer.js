/* VoiceScriptWriter — Hook Writer */
(function () {
  'use strict';
  var VSW = window.VSW;

  var TEMPLATES = [
    {
      type: 'Question',
      build: function (t, a) {
        return 'What would you do if ' + t + ' worked twice as well — with half the effort?';
      }
    },
    {
      type: 'Statistic',
      build: function (t, a) {
        return 'Here\u2019s a number worth knowing: [insert your real stat]% of ' +
          (a ? a : 'people') + ' get ' + t + ' wrong. Here\u2019s how to fix it.';
      }
    },
    {
      type: 'Story',
      build: function (t, a) {
        return 'Last month, ' + (a ? 'one of our ' + a : 'someone') +
          ' tried ' + t + ' for the very first time. What happened next surprised everyone.';
      }
    },
    {
      type: 'Bold Claim',
      build: function (t, a) {
        return 'Forget everything you think you know about ' + t + ' — because this changes all of it.';
      }
    },
    {
      type: 'Curiosity Gap',
      build: function (t, a) {
        return 'There\u2019s one thing about ' + t + ' that nobody tells you — and it changes everything.';
      }
    }
  ];

  function generate() {
    var topicRaw = document.getElementById('topic').value.trim();
    var audRaw = document.getElementById('audience').value.trim();
    var msg = document.getElementById('warnMsg');
    if (!topicRaw) {
      msg.textContent = 'Enter a topic first — e.g. "morning coffee", "budgeting app", "dog training".';
      document.getElementById('result').classList.add('hidden');
      return;
    }
    msg.textContent = '';

    var topic = topicRaw.replace(/\.$/, '');
    var aud = audRaw.replace(/^for\s+/i, '').replace(/\.$/, '');

    var box = document.getElementById('hooks');
    box.innerHTML = '';

    TEMPLATES.forEach(function (tpl) {
      var text = tpl.build(topic, aud);
      var card = document.createElement('div');
      card.className = 'hook-card';

      var tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = tpl.type + ' hook';

      var p = document.createElement('p');
      p.textContent = '\u201C' + text + '\u201D';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-outline';
      btn.style.padding = '8px 18px';
      btn.style.fontSize = '.9rem';
      btn.textContent = 'Copy';
      btn.addEventListener('click', function () { VSW.copyText(text, btn); });

      card.appendChild(tag);
      card.appendChild(p);
      card.appendChild(btn);
      box.appendChild(card);
    });

    var note = document.createElement('p');
    note.style.cssText = 'color:var(--muted);font-size:.9rem;margin-top:10px';
    note.textContent = 'Tip: the Statistic hook uses a placeholder — always replace [insert your real stat] with a verified number before publishing.';
    box.appendChild(note);

    document.getElementById('result').classList.remove('hidden');
    document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('hookBtn').addEventListener('click', generate);
  });
})();
