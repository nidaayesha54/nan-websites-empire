/* DogTrainingHub — command tracker (localStorage) */
(function () {
  'use strict';

  var STORAGE_KEY = 'dth_commands_v1';

  var GROUPS = [
    {
      name: '🟢 Beginner — every dog should know these',
      items: [
        ['sit', 'Sit', '★★★ foundation'],
        ['down', 'Down', '★★★ foundation'],
        ['stay', 'Stay', '★★★ foundation'],
        ['come', 'Come', '★★★ safety'],
        ['leave-it', 'Leave It', '★★★ safety'],
        ['drop-it', 'Drop It', '★★★ safety'],
        ['shake', 'Shake / Paw', '★★ fun'],
        ['watch-me', 'Watch Me', '★★ focus']
      ]
    },
    {
      name: '🟡 Intermediate — polite dog skills',
      items: [
        ['heel', 'Heel', '★★★ walks'],
        ['place', 'Place / Go to Bed', '★★★ manners'],
        ['wait-door', 'Wait at Door', '★★ safety'],
        ['touch', 'Touch (nose target)', '★★ fun'],
        ['roll-over', 'Roll Over', '★ trick'],
        ['spin', 'Spin', '★ trick'],
        ['speak', 'Speak', '★ trick'],
        ['quiet', 'Quiet', '★★ manners']
      ]
    },
    {
      name: '🔴 Advanced — show-off territory',
      items: [
        ['fetch-return', 'Fetch & Return', '★★ play'],
        ['back-up', 'Back Up', '★ trick'],
        ['weave', 'Weave Through Legs', '★ trick'],
        ['play-dead', 'Play Dead', '★ trick'],
        ['crawl', 'Crawl', '★ trick'],
        ['hoop', 'Jump Through Hoop', '★ trick'],
        ['find-it', 'Find It / Search', '★★ brain game'],
        ['bow', 'Bow', '★ trick']
      ]
    }
  ];

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* storage unavailable — tracker still works for this session */
    }
  }

  function totalCommands() {
    var n = 0;
    for (var i = 0; i < GROUPS.length; i++) n += GROUPS[i].items.length;
    return n;
  }

  function updateProgress(state) {
    var total = totalCommands();
    var done = 0;
    for (var i = 0; i < GROUPS.length; i++) {
      for (var j = 0; j < GROUPS[i].items.length; j++) {
        if (state[GROUPS[i].items[j][0]]) done++;
      }
    }
    var pct = Math.round((done / total) * 100);
    document.getElementById('progress-fill').style.width = pct + '%';
    var msg = done + ' of ' + total + ' commands mastered';
    if (done === total) msg += ' — 🏆 Champion dog! Amazing work!';
    else if (done >= 16) msg += ' — 🌟 Advanced level, keep going!';
    else if (done >= 8) msg += ' — 💪 Intermediate unlocked!';
    else if (done >= 1) msg += ' — 🎉 Great start!';
    document.getElementById('progress-text').textContent = msg;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var state = loadState();
    var wrap = document.getElementById('command-groups');
    var html = '';

    for (var i = 0; i < GROUPS.length; i++) {
      html += '<div class="cmd-group"><h3>' + GROUPS[i].name + '</h3><ul class="cmd-list">';
      for (var j = 0; j < GROUPS[i].items.length; j++) {
        var id = GROUPS[i].items[j][0];
        var label = GROUPS[i].items[j][1];
        var tag = GROUPS[i].items[j][2];
        var checked = state[id] ? ' checked' : '';
        var doneCls = state[id] ? ' class="done"' : '';
        html += '<li' + doneCls + '><input type="checkbox" id="cmd-' + id + '" data-cmd="' + id + '"' + checked + '>' +
          '<label for="cmd-' + id + '" class="cmd-name">' + label + '</label>' +
          '<span class="stars">' + tag + '</span></li>';
      }
      html += '</ul></div>';
    }
    wrap.innerHTML = html;

    var boxes = wrap.querySelectorAll('input[type="checkbox"]');
    for (var k = 0; k < boxes.length; k++) {
      boxes[k].addEventListener('change', function () {
        var id = this.getAttribute('data-cmd');
        state[id] = this.checked;
        if (!this.checked) delete state[id];
        saveState(state);
        var li = this.closest('li');
        if (li) {
          if (this.checked) li.classList.add('done');
          else li.classList.remove('done');
        }
        updateProgress(state);
      });
    }

    document.getElementById('reset-btn').addEventListener('click', function () {
      if (window.confirm('Reset all command progress? This cannot be undone.')) {
        state = {};
        saveState(state);
        var all = wrap.querySelectorAll('input[type="checkbox"]');
        for (var m = 0; m < all.length; m++) {
          all[m].checked = false;
          var li = all[m].closest('li');
          if (li) li.classList.remove('done');
        }
        updateProgress(state);
      }
    });

    updateProgress(state);
  });
})();
