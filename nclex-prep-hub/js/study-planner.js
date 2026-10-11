/* NCLEX study planner: weeks until exam + hours/day -> day-by-day topic plan */
(function () {
  'use strict';

  var PHASES = [
    { id: 'foundation', name: 'Foundation Review', color: '#0d9488', pct: 0.45,
      note: 'Core content review — read concepts, take notes, build your formula sheet.' },
    { id: 'practice', name: 'Question Practice', color: '#f59e0b', pct: 0.35,
      note: 'Answer 60-100 questions/day, timed, with full rationale review.' },
    { id: 'mastery', name: 'Mastery & Review', color: '#16a34a', pct: 0.20,
      note: 'Weak-area review, full-length practice exams, test-day strategy.' }
  ];

  var TOPICS = [
    { cat: 'Safe & Effective Care', items: ['Management of care: prioritization & delegation', 'Safety & infection control: isolation precautions', 'Medications: high-alert drugs & error prevention', 'Ethical/legal: informed consent, restraints'] },
    { cat: 'Health Promotion', items: ['Developmental stages & milestones', 'Health screening & immunizations', 'Antepartum, intrapartum, postpartum care', 'Newborn assessment & care'] },
    { cat: 'Psychosocial Integrity', items: ['Therapeutic communication', 'Mental health disorders & crisis intervention', 'Substance use disorders & withdrawal', 'Coping, grief & loss'] },
    { cat: 'Physiological Integrity — Pharmacology', items: ['Cardiac medications', 'Diabetes & endocrine medications', 'Psychiatric medications', 'Antibiotics, anticoagulants & pain meds'] },
    { cat: 'Physiological Integrity — Adult Health', items: ['Cardiovascular disorders', 'Respiratory disorders', 'Neurological disorders', 'GI, renal & endocrine disorders'] },
    { cat: 'Physiological Integrity — Acute Care', items: ['Fluids & electrolytes', 'Acid-base balance', 'Shock & sepsis', 'Post-op & wound care'] },
    { cat: 'Pediatric Nursing', items: ['Pediatric emergencies & DKA', 'Congenital heart defects', 'Pediatric meds dosing by weight', 'Communicable diseases in children'] },
    { cat: 'NCLEX Strategy', items: ['Select-all-that-apply tactics', 'Prioritization frameworks (ABCs, Maslow)', 'Eliminating distractors', 'Time management & stamina drills'] }
  ];

  function buildPlan(weeks, hours, examType) {
    var totalDays = Math.max(7, weeks * 7);
    var daysPerPhase = [0, 0, 0];
    daysPerPhase[0] = Math.max(2, Math.round(totalDays * PHASES[0].pct));
    daysPerPhase[2] = Math.max(2, Math.round(totalDays * PHASES[2].pct));
    daysPerPhase[1] = totalDays - daysPerPhase[0] - daysPerPhase[2];
    if (daysPerPhase[1] < 1) { daysPerPhase[1] = 1; daysPerPhase[0] = totalDays - daysPerPhase[1] - daysPerPhase[2]; }

    var flatTopics = [];
    TOPICS.forEach(function (t) {
      t.items.forEach(function (i) {
        flatTopics.push({ cat: t.cat, item: i + (examType === 'PN' ? ' (PN focus)' : '') });
      });
    });

    var plan = [];
    var topicIdx = 0, day = 1;
    PHASES.forEach(function (phase, pi) {
      for (var d = 0; d < daysPerPhase[pi]; d++) {
        var session = { day: day, phase: phase.name, phaseId: phase.id, blocks: [] };
        var studyTopics = 0;
        if (phase.id === 'foundation') {
          var perDay = Math.max(1, Math.ceil(flatTopics.length / daysPerPhase[0]));
          for (var k = 0; k < perDay && topicIdx < flatTopics.length; k++) {
            session.blocks.push({ type: 'study', text: flatTopics[topicIdx].cat + ': ' + flatTopics[topicIdx].item });
            topicIdx++; studyTopics++;
          }
          var qCount = Math.round(hours * 12);
          session.blocks.push({ type: 'quiz', text: qCount + ' practice questions on today\'s topics' });
        } else if (phase.id === 'practice') {
          var perSession = Math.min(150, Math.round(hours * 25));
          session.blocks.push({ type: 'quiz', text: perSession + ' mixed questions, timed blocks of 25' });
          session.blocks.push({ type: 'study', text: 'Rationale review: rewrite 10 missed concepts into your notebook' });
        } else {
          session.blocks.push({ type: 'quiz', text: 'Full-length practice exam every 2nd day (75-145 questions)' });
          session.blocks.push({ type: 'study', text: 'Weak-area review from your error log + strategy drills' });
        }
        session.hours = hours;
        plan.push(session);
        day++;
      }
    });
    return { plan: plan, daysPerPhase: daysPerPhase, totalHours: totalDays * hours };
  }

  function renderPlan(data) {
    var out = document.getElementById('plan-output');
    var html = '<div class="grid2">';
    html += '<div class="stat"><div class="k">Total study days</div><div class="v">' + data.plan.length + '</div></div>';
    html += '<div class="stat"><div class="k">Total study hours</div><div class="v">' + data.totalHours + '</div></div>';
    html += '</div>';
    html += '<p class="note">Phases: <strong>Foundation Review</strong> (' + data.daysPerPhase[0] + ' days) → <strong>Question Practice</strong> (' + data.daysPerPhase[1] + ' days) → <strong>Mastery & Review</strong> (' + data.daysPerPhase[2] + ' days). Check off days as you complete them — your progress is saved on this device.</p>';
    html += '<table class="plan-table"><thead><tr><th>Day</th><th>Phase</th><th>Today\'s plan</th><th>Done</th></tr></thead><tbody>';
    data.plan.forEach(function (s) {
      var saved = false;
      try { saved = localStorage.getItem('nclex-day-' + s.day) === '1'; } catch (e) {}
      html += '<tr><td class="plan-day">Day ' + s.day + '</td>';
      html += '<td><span class="phase-tag">' + s.phase + '</span></td><td><ul style="padding-left:18px;margin:0">';
      s.blocks.forEach(function (b) { html += '<li>' + b.text + '</li>'; });
      html += '</ul></td>';
      html += '<td><input type="checkbox" data-day="' + s.day + '" aria-label="Mark day ' + s.day + ' complete"' + (saved ? ' checked' : '') + '></td></tr>';
    });
    html += '</tbody></table>';
    out.innerHTML = html;
    out.querySelectorAll('input[type=checkbox]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        try { localStorage.setItem('nclex-day-' + cb.getAttribute('data-day'), cb.checked ? '1' : '0'); } catch (e) {}
      });
    });
  }

  function init() {
    var form = document.getElementById('planner-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var weeks = parseInt(document.getElementById('weeks').value, 10);
      var hours = parseFloat(document.getElementById('hours').value);
      var examType = document.getElementById('examtype').value;
      if (!(weeks >= 1 && weeks <= 16) || !(hours >= 0.5 && hours <= 12)) {
        document.getElementById('plan-output').innerHTML = '<p class="verdict bad">Please enter 1-16 weeks and 0.5-12 hours per day.</p>';
        return;
      }
      renderPlan(buildPlan(weeks, hours, examType));
      document.getElementById('plan-output').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
