/* FAQ Generator — extracts question/answer pairs from pasted text via heuristics. */
(function () {
  var QUESTION_STARTERS = ['what', 'why', 'how', 'when', 'where', 'who', 'which', 'can', 'could', 'should', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'will', 'would', 'has', 'have', 'may', 'might'];

  function splitSentences(text) {
    return (text || '')
      .replace(/\s+/g, ' ')
      .match(/[^.!?]+[.!?]+/g) || [];
  }

  function looksLikeQuestion(s) {
    var t = s.trim();
    if (!t) return false;
    if (t.indexOf('?') !== -1) return true;
    var first = t.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
    return QUESTION_STARTERS.indexOf(first) !== -1 && t.split(/\s+/).length >= 3;
  }

  function generateFaq(text) {
    var sentences = splitSentences(text).map(function (s) { return s.trim(); }).filter(Boolean);
    var faqs = [];
    for (var i = 0; i < sentences.length; i++) {
      if (looksLikeQuestion(sentences[i])) {
        var q = sentences[i].replace(/\s+/g, ' ');
        if (q.slice(-1) !== '?') q += '?';
        // Answer = next 1-2 non-question sentences
        var ans = [];
        for (var j = i + 1; j < Math.min(i + 3, sentences.length); j++) {
          if (looksLikeQuestion(sentences[j])) break;
          ans.push(sentences[j]);
        }
        faqs.push({ question: q, answer: ans.join(' ') || 'Answer coming soon.' });
      }
    }
    // Fallback: if no questions found, chunk into statement pairs
    if (!faqs.length && sentences.length >= 2) {
      for (var k = 0; k + 1 < sentences.length; k += 2) {
        faqs.push({ question: 'What should I know about: ' + sentences[k].slice(0, 60) + '?', answer: sentences[k] + ' ' + sentences[k + 1] });
      }
    }
    return faqs;
  }

  function renderFaqs(faqs) {
    var wrap = document.getElementById('faq-results');
    wrap.innerHTML = '';
    if (!faqs.length) {
      wrap.innerHTML = '<p>No questions detected. Try pasting text that includes questions (or sentences starting with What, How, Why, Can, Is...).</p>';
      return;
    }
    faqs.forEach(function (f, i) {
      var d = document.createElement('div');
      d.className = 'rule-row';
      d.innerHTML = '<strong>Q' + (i + 1) + ':</strong> ' +
        '<input type="text" class="f-q" value="">' +
        '<strong>A:</strong><textarea class="f-a"></textarea>';
      d.querySelector('.f-q').value = f.question;
      d.querySelector('.f-a').value = f.answer;
      wrap.appendChild(d);
    });
    document.getElementById('exportbar').style.display = 'block';
  }

  function exportJSON() {
    var out = [];
    document.querySelectorAll('#faq-results .rule-row').forEach(function (row) {
      out.push({ question: row.querySelector('.f-q').value, answer: row.querySelector('.f-a').value });
    });
    var blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'faq.json';
    a.click();
  }

  function copyAll() {
    var txt = '';
    document.querySelectorAll('#faq-results .rule-row').forEach(function (row, i) {
      txt += 'Q' + (i + 1) + ': ' + row.querySelector('.f-q').value + '\nA: ' + row.querySelector('.f-a').value + '\n\n';
    });
    var t = document.createElement('textarea');
    t.value = txt;
    document.body.appendChild(t);
    t.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(t);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('sample').addEventListener('click', function () {
      document.getElementById('sourcetext').value =
        'What is our refund policy? We offer a 30-day money-back guarantee on all plans. ' +
        'How long does shipping take? Standard shipping takes 3-5 business days. Express options are available at checkout. ' +
        'Can I cancel my subscription anytime? Yes, you can cancel from your account page in one click. ' +
        'Is there a free trial? We offer a 14-day free trial with no credit card required.';
    });
    document.getElementById('genfaq').addEventListener('click', function () {
      renderFaqs(generateFaq(document.getElementById('sourcetext').value));
    });
    document.getElementById('exportjson').addEventListener('click', exportJSON);
    document.getElementById('copyall').addEventListener('click', copyAll);
  });

  /* Export for Node testing */
  try { if (typeof module !== 'undefined') { module.exports = { generateFaq: generateFaq }; } } catch (e) {}
})();
