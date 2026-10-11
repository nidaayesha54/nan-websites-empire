// Script Formatter — chapter breaks, pause markers, dialogue tags, pronunciation notes
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }

  function splitParagraphs(text) {
    return text.split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
  }

  function isChapterHeading(line) {
    return /^(chapter|part|section|prologue|epilogue|interlude)\b/i.test(line.trim()) && line.trim().length < 80;
  }

  function isDialogue(paragraph) {
    var t = paragraph.trim();
    return /^["“'‘]/.test(t) || /said|asked|replied|whispered|shouted|murmured|cried|laughed/i.test(t);
  }

  function parseGlossary(raw) {
    var map = {};
    raw.split('\n').forEach(function (line) {
      var parts = line.split('=');
      if (parts.length >= 2) {
        var word = parts[0].trim();
        var pron = parts.slice(1).join('=').trim();
        if (word && pron) map[word.toLowerCase()] = { word: word, pron: pron };
      }
    });
    return map;
  }

  function escapeReg(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function format() {
    var text = $('fmt-input').value;
    var out = $('fmt-output');
    var status = $('fmt-status');
    if (!text.trim()) {
      out.value = '';
      status.textContent = 'Paste your manuscript to format it.';
      return;
    }

    var addPauses = $('fmt-pauses').checked;
    var tagDialogue = $('fmt-dialogue').checked;
    var markEmphasis = $('fmt-emphasis').checked;
    var splitEvery = parseInt($('fmt-split').value, 10) || 0;
    var glossary = parseGlossary($('fmt-glossary').value);

    var paras = splitParagraphs(text);
    var lines = [];
    var chapter = 0;
    var wordBudget = 0;

    // First pass: auto chapter breaks every N words (if enabled and no real headings)
    var hasRealChapters = paras.some(isChapterHeading);

    paras.forEach(function (p) {
      var pWords = window.ANH.countWords(p);

      // Chapter detection
      if (isChapterHeading(p)) {
        chapter++;
        lines.push('');
        lines.push('═══════════════════════');
        lines.push('CHAPTER ' + chapter + ': ' + p.replace(/^(chapter|part|section)\s*/i, '').toUpperCase());
        lines.push('═══════════════════════');
        if (addPauses) lines.push('[LONG PAUSE — 2 seconds]');
        wordBudget = 0;
        return;
      }
      if (!hasRealChapters && splitEvery > 0 && wordBudget + pWords > splitEvery && wordBudget > 0) {
        chapter++;
        lines.push('');
        lines.push('═══════════════════════');
        lines.push('CHAPTER ' + chapter + ' (auto break at ~' + splitEvery + ' words)');
        lines.push('═══════════════════════');
        if (addPauses) lines.push('[LONG PAUSE — 2 seconds]');
        wordBudget = 0;
      }
      if (!hasRealChapters && splitEvery > 0 && chapter === 0 && wordBudget === 0) {
        chapter = 1;
        lines.push('═══════════════════════');
        lines.push('CHAPTER 1');
        lines.push('═══════════════════════');
      }

      // Dialogue tagging
      var prefix = '';
      if (tagDialogue && isDialogue(p)) prefix = '🎭 DIALOGUE — ';

      // Pronunciation notes
      var body = p;
      Object.keys(glossary).forEach(function (key) {
        var g = glossary[key];
        var re = new RegExp('\\b' + escapeReg(g.word) + '\\b', 'gi');
        body = body.replace(re, function (m) {
          return m + ' [PRONOUNCE: "' + g.pron + '"]';
        });
      });

      // Emphasis: ALL-CAPS words of 3+ letters
      if (markEmphasis) {
        body = body.replace(/\b[A-Z]{3,}\b/g, function (m) { return '[EMPHASIS] ' + m + ' [/EMPHASIS]'; });
      }

      lines.push(prefix + body);
      if (addPauses) lines.push('[PAUSE — 1 second]');
      lines.push('');
      wordBudget += pWords;
    });

    out.value = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    status.textContent = 'Formatted ✓ — ' + window.ANH.countWords(out.value) +
      ' words, ' + chapter + ' chapter break(s). Scroll down and copy or download.';
  }

  function copyOut() {
    var v = $('fmt-output').value;
    if (!v) { $('fmt-status').textContent = 'Nothing to copy yet — format a script first.'; return; }
    window.ANH.copyText(v, $('fmt-status'), 'Formatted script copied ✓');
  }

  function download() {
    var v = $('fmt-output').value;
    if (!v) { $('fmt-status').textContent = 'Nothing to download yet — format a script first.'; return; }
    var blob = new Blob([v], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'narration-script.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    $('fmt-status').textContent = 'Downloaded narration-script.txt ✓';
  }

  document.addEventListener('DOMContentLoaded', function () {
    if ($('fmt-run')) $('fmt-run').addEventListener('click', format);
    if ($('fmt-copy')) $('fmt-copy').addEventListener('click', copyOut);
    if ($('fmt-download')) $('fmt-download').addEventListener('click', download);
    ['fmt-pauses', 'fmt-dialogue', 'fmt-emphasis', 'fmt-split'].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener('change', function () { if ($('fmt-input').value.trim()) format(); });
    });
  });
})();
