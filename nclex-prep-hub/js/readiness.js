/* NCLEX readiness self-assessment: 12 scored questions -> readiness verdict */
(function () {
  'use strict';

  var ITEMS = [
    { q: 'I consistently score 65% or higher on timed NCLEX-style practice questions.', w: 3 },
    { q: 'I can explain the rationale for both correct and incorrect answers on most questions.', w: 3 },
    { q: 'I have completed at least 1,500 practice questions across all NCLEX content areas.', w: 2 },
    { q: 'I have taken at least two full-length (75-145 question) practice exams under timed conditions.', w: 2 },
    { q: 'I feel confident with pharmacology (drug classes, side effects, antidotes).', w: 2 },
    { q: 'I feel confident with prioritization and delegation questions.', w: 2 },
    { q: 'I know the key lab values (electrolytes, ABGs, therapeutic drug levels) by heart.', w: 2 },
    { q: 'My scores have been stable or improving over the last two weeks.', w: 2 },
    { q: 'I can study for 2+ hours without losing focus or getting overwhelmed.', w: 1 },
    { q: 'I have a test-day strategy (time per question, handling SATA, managing anxiety).', w: 1 },
    { q: 'I have reviewed all of my weak areas identified in practice exams.', w: 2 },
    { q: 'I feel calm — not panicked — when I think about my exam date.', w: 1 }
  ];

  var SCALE = [
    { label: 'Not true', val: 0 },
    { label: 'Somewhat true', val: 1 },
    { label: 'Mostly true', val: 2 },
    { label: 'Completely true', val: 3 }
  ];

  function maxScore() {
    var m = 0;
    ITEMS.forEach(function (it) { m += it.w * 3; });
    return m;
  }

  function renderForm() {
    var wrap = document.getElementById('assess-body');
    var html = '<p class="note">Answer honestly — this assessment works best when you don\'t sugarcoat. There are ' + ITEMS.length + ' statements.</p>';
    ITEMS.forEach(function (it, i) {
      html += '<div class="quiz-q"><h3>' + (i + 1) + '. ' + it.q + '</h3><div class="opts">';
      SCALE.forEach(function (s, si) {
        html += '<label><input type="radio" name="a' + i + '" value="' + s.val + '"> ' + s.label + '</label>';
      });
      html += '</div></div>';
    });
    html += '<button class="btn" id="assess-btn">Check My Readiness</button>';
    wrap.innerHTML = html;
    document.getElementById('assess-btn').addEventListener('click', score);
  }

  function score() {
    var total = 0, answered = 0;
    ITEMS.forEach(function (it, i) {
      var sel = document.querySelector('input[name=a' + i + ']:checked');
      if (sel) { total += parseInt(sel.value, 10) * it.w; answered++; }
    });
    if (answered < ITEMS.length) {
      alert('Please answer all ' + ITEMS.length + ' statements before checking your readiness.');
      return;
    }
    var pct = Math.round((total / maxScore()) * 100);
    var verdict, cls, tips;
    if (pct >= 75) {
      verdict = 'You look READY. Schedule your exam with confidence.';
      cls = 'good';
      tips = ['Book your exam date if you haven\'t already.', 'Do light review only in the final week — no cramming.', 'Take one more full-length practice exam 3-4 days out.', 'Read our test-day tips to lock in your strategy.'];
    } else if (pct >= 50) {
      verdict = 'You are ALMOST ready — 2-4 more focused weeks should get you there.';
      cls = 'warn';
      tips = ['Push your question volume to 75-100 timed questions/day.', 'Drill your two weakest content areas using the study planner.', 'Take a full-length practice exam weekly and track your trend.', 'Don\'t book the exam until practice scores are stable above 65%.'];
    } else {
      verdict = 'NOT YET — you need more structured preparation first.';
      cls = 'bad';
      tips = ['Build a study schedule with the study planner — aim for 4-8 weeks.', 'Start with content review before heavy question practice.', 'Target 1,500+ questions total across all content areas.', 'Retake this assessment in 2-3 weeks to measure progress.'];
    }
    var html = '<div class="result" style="text-align:center">';
    html += '<p class="note">Your readiness score</p><div class="big">' + pct + '%</div>';
    html += '<p class="verdict ' + cls + '">' + verdict + '</p>';
    html += '<div style="text-align:left;max-width:520px;margin:18px auto 0"><strong>Recommended next steps:</strong><ul style="padding-left:20px;margin-top:8px">';
    tips.forEach(function (t) { html += '<li>' + t + '</li>'; });
    html += '</ul></div>';
    html += '<p style="margin-top:16px"><a class="btn" href="../tools/study-planner.html">Build My Study Plan</a> ';
    html += '<a class="btn btn-outline" style="color:var(--navy);border-color:var(--navy)" href="../tools/practice-quiz.html">Take the Practice Quiz</a></p>';
    html += '<button class="btn" id="redo-btn" style="margin-top:14px;background:var(--muted)">Retake Assessment</button>';
    html += '</div>';
    document.getElementById('assess-body').innerHTML = html;
    document.getElementById('redo-btn').addEventListener('click', renderForm);
    document.getElementById('assess-body').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function init() {
    if (document.getElementById('assess-body')) renderForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
