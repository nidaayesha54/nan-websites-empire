// Voiceover Planner: video length -> word targets, takes/retakes, recording timeline
(function () {
  'use strict';
  function el(id) { return document.getElementById(id); }
  function fmt(min) {
    min = Math.round(min);
    var h = Math.floor(min / 60), m = min % 60;
    return h ? h + 'h ' + m + 'm' : m + ' min';
  }

  function plan() {
    var lenMin = parseFloat(el('vp-length').value) || 0;
    if (lenMin <= 0) { el('vp-result').innerHTML = '<p>Enter your target video length above.</p>'; return; }
    var pace = parseInt(el('vp-pace').value, 10) || 150;
    var sections = parseInt(el('vp-sections').value, 10) || 1;
    var takes = parseInt(el('vp-takes').value, 10) || 2;
    var music = el('vp-music').checked;
    var pausePct = parseFloat(el('vp-pause').value) || 12;

    var targetWords = Math.round(lenMin * pace);
    var perSection = Math.round(targetWords / sections);
    var rawRecordMin = lenMin * (1 + pausePct / 100);       // pauses & breaths
    var retakeFactor = 1 + (takes - 1) * 0.75;               // retakes aren't full passes
    var recordMin = rawRecordMin * retakeFactor;
    var setupMin = 20;                                       // mic, levels, warm-up
    var editMin = lenMin * 6;                                // rule of thumb: 6x runtime
    var mixMin = music ? 25 : 12;                            // music bed / mastering
    var totalMin = setupMin + recordMin + editMin + mixMin;

    var rows = [
      ['🎙️ Setup & warm-up', 'Mic check, levels, vocal warm-up', fmt(setupMin)],
      ['🎧 Recording (' + takes + ' takes/section)', targetWords + ' words across ' + sections + ' section' + (sections > 1 ? 's' : '') + ' + ' + pausePct + '% pause time', fmt(recordMin)],
      ['✂️ Editing', 'Cutting, de-breath, pacing (rule of thumb: ~6× video length)', fmt(editMin)],
      ['🎚️ Mix & master', music ? 'Music bed, ducking, loudness for YouTube (-14 LUFS)' : 'EQ, compression, loudness normalize', fmt(mixMin)]
    ];
    var html = '<div class="stat-grid">' +
      '<div class="stat"><div class="num">' + targetWords + '</div><div class="lbl">Script word target</div></div>' +
      '<div class="stat"><div class="num">' + perSection + '</div><div class="lbl">Words per section</div></div>' +
      '<div class="stat"><div class="num">' + fmt(recordMin) + '</div><div class="lbl">Recording session</div></div>' +
      '<div class="stat"><div class="num">' + fmt(totalMin) + '</div><div class="lbl">Total project time</div></div>' +
      '</div>';
    html += '<table><tr><th>Phase</th><th>Details</th><th>Time</th></tr>' +
      rows.map(function (r) { return '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td><b>' + r[2] + '</b></td></tr>'; }).join('') + '</table>';

    var tips = [];
    if (sections === 1 && lenMin > 5) tips.push('For videos over 5 minutes, split into ' + Math.ceil(lenMin / 3) + ' sections — you can punch-in record and fix mistakes per section instead of re-doing everything.');
    if (takes < 2) tips.push('One take is a gamble. Plan at least 2 takes per section — the second is usually more relaxed and usable.');
    if (takes > 3) tips.push(takes + ' takes per section adds ' + fmt(recordMin - rawRecordMin) + ' of session time. Consider 2 full takes + targeted punch-ins for flubbed lines only.');
    tips.push('Record ' + Math.ceil(sections * takes) + ' section-passes. Label each file (e.g. "S2-T1") so your editor (or you) can comp the best bits fast.');
    tips.push('Always record 10 seconds of room tone first — you need it to patch edits invisibly.');
    if (music) tips.push('Duck music to −20dB under voice and sidechain lightly; viewers bounce when they strain to hear you.');
    html += '<h3 style="margin:14px 0 8px">💡 Session tips</h3>' +
      tips.map(function (t) { return '<div class="tip">' + t + '</div>'; }).join('');

    el('vp-result').innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!el('vp-length')) return;
    var preset = el('vp-preset');
    if (preset) preset.addEventListener('change', function () {
      if (preset.value) { el('vp-length').value = preset.value; plan(); }
    });
    ['vp-length', 'vp-pace', 'vp-sections', 'vp-takes', 'vp-pause'].forEach(function (id) {
      el(id).addEventListener('input', plan);
    });
    el('vp-music').addEventListener('change', plan);
    plan();
  });
})();
