/* Case evaluator quiz — 6 questions, each scored 0 (weak) to 2 (strong).
   Total max = 12. 9-12 = Strong, 5-8 = Moderate, 0-4 = Weak.
   This is a general educational self-check, NOT legal advice. */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('case-quiz');
  var out = document.getElementById('eval-result');
  if (!form || !out) { return; }

  var QUESTIONS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];
  var LABELS = {
    q1: 'Injury severity', q2: 'Fault clarity', q3: 'Evidence strength',
    q4: 'Insurance available', q5: 'Timing / deadline', q6: 'Documented damages'
  };
  var VALUE_TEXT = { 0: 'Weak', 1: 'Moderate', 2: 'Strong' };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var total = 0, answered = 0, rows = '';
    QUESTIONS.forEach(function (q) {
      var sel = form.querySelector('input[name="' + q + '"]:checked');
      if (sel) {
        var v = parseInt(sel.value, 10);
        total += v; answered++;
        rows += '<tr><td>' + LABELS[q] + '</td><td>' + VALUE_TEXT[v] + ' (' + v + '/2)</td></tr>';
      }
    });
    if (answered < QUESTIONS.length) {
      out.innerHTML = '<p style="color:#b23"><strong>Please answer all 6 questions</strong> to get your assessment.</p>';
      out.classList.add('show');
      return;
    }
    var verdict, advice;
    if (total >= 9) {
      verdict = 'Strong case indicators';
      advice = '<li><strong>Consult a personal injury attorney promptly</strong> — most offer free consultations and work on contingency (no upfront fee).</li>' +
        '<li>Do <strong>not</strong> sign any release or accept the insurer\'s first offer before getting that review.</li>' +
        '<li>Keep treating and keep every bill, receipt, and record.</li>';
    } else if (total >= 5) {
      verdict = 'Moderate case indicators';
      advice = '<li>Strengthen the weak areas: see a doctor (document everything), gather photos/witness names, and confirm the filing deadline with our <a href="statute-checker.html">statute checker</a>.</li>' +
        '<li>An attorney\'s free case review can tell you whether the case is worth pursuing — many turn down weak cases honestly.</li>' +
        '<li>Try our <a href="settlement-estimator.html">settlement estimator</a> for a rough value range.</li>';
    } else {
      verdict = 'Weak case indicators';
      advice = '<li>A claim may be difficult to pursue: without clear fault, evidence, or insurance coverage, attorneys may decline the case.</li>' +
        '<li>Very small claims are sometimes better suited to small-claims court (rules vary by state).</li>' +
        '<li>If any facts are uncertain, a free attorney consultation is still the safest way to confirm — laws and exceptions vary.</li>';
    }
    out.innerHTML =
      '<h3>📋 Your case self-assessment</h3>' +
      '<p><span class="big-num">' + total + ' / 12</span><br>' +
      '<strong style="font-size:1.15rem">' + verdict + '</strong></p>' +
      '<table class="calc"><tr><th>Factor</th><th>Your answer</th></tr>' + rows + '</table>' +
      '<h3 style="margin-top:18px">Recommended next steps</h3><ul>' + advice + '</ul>' +
      '<p style="font-size:.9rem;color:var(--muted)"><strong>Disclaimer:</strong> This self-check is general educational information only — not legal advice. Only a licensed attorney who reviews your facts can evaluate your case.</p>';
    out.classList.add('show');
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
