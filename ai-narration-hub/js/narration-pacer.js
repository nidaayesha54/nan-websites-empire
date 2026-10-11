// Narration Pacer — word count, audiobook duration estimate, chapter pacing planner
(function () {
  'use strict';

  var BASE_WPM = 150; // industry-standard audiobook narration pace

  function $(id) { return document.getElementById(id); }

  function fmtDuration(hours) {
    if (!isFinite(hours) || hours < 0) return '—';
    var totalMin = Math.round(hours * 60);
    var h = Math.floor(totalMin / 60);
    var m = totalMin % 60;
    if (h === 0) return m + ' min';
    return h + 'h ' + m + 'm';
  }

  function fmtNum(n) {
    return n.toLocaleString('en-US');
  }

  function analyze() {
    var text = $('pacer-input').value;
    var words = window.ANH.countWords(text);
    var chars = text.length;
    var sentences = (text.match(/[.!?…]+["'”’)\]]*\s*/g) || []).length;
    var paragraphs = text.split(/\n\s*\n/).filter(function (p) { return p.trim().length > 0; }).length;
    var wpm = parseInt($('pacer-wpm').value, 10) || BASE_WPM;
    var hours = words / wpm / 60;

    $('pacer-words').textContent = fmtNum(words);
    $('pacer-chars').textContent = fmtNum(chars);
    $('pacer-sentences').textContent = fmtNum(sentences);
    $('pacer-paras').textContent = fmtNum(paragraphs);
    $('pacer-wpm-lbl').textContent = wpm + ' wpm';
    $('pacer-duration').textContent = fmtDuration(hours);
    $('pacer-words-hr').textContent = fmtNum(wpm * 60) + ' words/hr';

    buildChapterPlan(words, wpm, hours);
  }

  function buildChapterPlan(words, wpm, hours) {
    var n = parseInt($('pacer-chapters').value, 10) || 0;
    var box = $('pacer-chapter-plan');
    if (!n || n < 1 || words === 0) {
      box.innerHTML = '<p style="color:var(--muted)">Enter your manuscript and a chapter count to see the pacing plan.</p>';
      return;
    }
    var per = words / n;
    var rows = '';
    for (var i = 1; i <= n; i++) {
      var start = Math.round((i - 1) * per) + 1;
      var end = Math.round(i * per);
      rows += '<tr><td>Chapter ' + i + '</td><td>' + fmtNum(start) + '–' + fmtNum(end) +
        '</td><td>' + fmtNum(Math.round(per)) + '</td><td>' + fmtDuration(per / wpm / 60) + '</td></tr>';
    }
    box.innerHTML =
      '<p style="margin-bottom:8px">Target <b>' + fmtNum(Math.round(per)) + ' words</b> per chapter ' +
      '(≈ ' + fmtDuration(per / wpm / 60) + ' each).</p>' +
      '<div style="overflow-x:auto"><table><thead><tr><th>Chapter</th><th>Word range</th><th>Words</th><th>Est. audio</th></tr></thead><tbody>' +
      rows + '</tbody></table></div>' +
      '<p class="tip">Listener sweet spot: most audiobook chapters land between 10–25 minutes. ' +
      'If yours run over 30 minutes, consider splitting them.</p>';
  }

  function reverseCalc() {
    var targetH = parseFloat($('pacer-target-hours').value);
    var wpm = parseInt($('pacer-wpm').value, 10) || BASE_WPM;
    var out = $('pacer-reverse-out');
    if (!targetH || targetH <= 0) {
      out.textContent = 'Enter a target length to see the word budget.';
      return;
    }
    var words = Math.round(targetH * wpm * 60);
    out.innerHTML = 'For a <b>' + targetH + '-hour</b> audiobook at <b>' + wpm + ' wpm</b>, aim for <b>' +
      fmtNum(words) + ' words</b> (' + fmtNum(wpm * 60) + ' words per finished hour).';
  }

  function copySummary() {
    var text = $('pacer-input').value;
    var words = window.ANH.countWords(text);
    var wpm = parseInt($('pacer-wpm').value, 10) || BASE_WPM;
    var summary = 'Narration pacing summary\n' +
      'Words: ' + fmtNum(words) + '\n' +
      'Pace: ' + wpm + ' wpm\n' +
      'Estimated audio: ' + fmtDuration(words / wpm / 60) + '\n' +
      'Words per finished hour: ' + fmtNum(wpm * 60);
    window.ANH.copyText(summary, $('pacer-status'), 'Summary copied ✓');
  }

  function sample() {
    $('pacer-input').value =
      'Chapter One\n\nThe rain had been falling since dawn, drumming a steady rhythm against the windows of the old bookshop. ' +
      'Mara pulled her coat tighter and pushed the door open, a small brass bell announcing her arrival. ' +
      'Dust hung in the afternoon light like tiny stars. Behind the counter, a man looked up from his ledger, ' +
      'his eyes widening as if he had been waiting for her all along.\n\n"You came," he said. "I was beginning to think the letter never reached you."\n\n' +
      'She placed the envelope on the counter between them. "It reached me," she said. "Now tell me what you know about my father."';
    analyze();
  }

  document.addEventListener('DOMContentLoaded', function () {
    ['pacer-input', 'pacer-wpm', 'pacer-chapters'].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener('input', analyze);
    });
    if ($('pacer-wpm')) $('pacer-wpm').addEventListener('input', analyze);
    if ($('pacer-target-hours')) $('pacer-target-hours').addEventListener('input', reverseCalc);
    if ($('pacer-copy')) $('pacer-copy').addEventListener('click', copySummary);
    if ($('pacer-sample')) $('pacer-sample').addEventListener('click', sample);
    analyze();
  });
})();
