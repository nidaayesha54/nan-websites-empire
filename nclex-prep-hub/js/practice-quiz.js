/* NCLEX practice quiz: 32 built-in NCLEX-style questions with rationales + score tracking */
(function () {
  'use strict';

  var QUESTIONS = [
    { cat: 'Pharmacology', q: 'A client prescribed digoxin (Lanoxin) reports nausea and sees a yellow-green halo around lights. The nurse should first:', opts: ['Reassure the client this is a normal side effect', 'Hold the dose and notify the provider', 'Administer the next dose with food', 'Check the client\'s blood pressure'], ans: 1, rat: 'Nausea and visual halos are classic signs of digoxin toxicity. The priority is to hold the dose, notify the provider, and check the serum digoxin level and potassium.' },
    { cat: 'Prioritization', q: 'Which client should the nurse assess FIRST?', opts: ['A post-op client with a pain rating of 6/10', 'A client with heart failure who gained 2 lb overnight', 'A client 2 hours post-MI with new-onset confusion', 'A client awaiting discharge teaching for diabetes'], ans: 2, rat: 'New-onset confusion after an MI suggests decreased cardiac output/cerebral perfusion — a sudden, life-threatening change. Airway, breathing, circulation changes take priority.' },
    { cat: 'Safety', q: 'A nurse is caring for a client with tuberculosis. Which isolation precaution is required?', opts: ['Standard precautions only', 'Droplet precautions', 'Airborne precautions', 'Contact precautions'], ans: 2, rat: 'TB is transmitted via airborne droplet nuclei. Airborne precautions (negative-pressure room, N95 respirator) are required.' },
    { cat: 'Pharmacology', q: 'Before administering IV heparin, the nurse reviews which lab value?', opts: ['INR', 'aPTT', 'Platelet count', 'D-dimer'], ans: 1, rat: 'Heparin therapy is monitored with aPTT (goal 1.5-2.5x control). INR/PT monitors warfarin.' },
    { cat: 'Med-Surg', q: 'A client with heart failure is prescribed furosemide. Which finding requires immediate action?', opts: ['Potassium 4.2 mEq/L', 'Weight gain of 3 lb in 2 days', 'BP 128/76', 'Urine output 45 mL/hr'], ans: 1, rat: 'A 2-3 lb weight gain in 24 hours (or 5 lb in a week) signals fluid retention and worsening heart failure — report immediately.' },
    { cat: 'Pharmacology', q: 'Metformin should be held before which procedure?', opts: ['Colonoscopy', 'CT scan with IV contrast', 'Chest x-ray', 'Echocardiogram'], ans: 1, rat: 'IV contrast can cause acute kidney injury; combined with metformin this risks lactic acidosis. Hold metformin 48 hours after contrast per provider order.' },
    { cat: 'Maternity', q: 'A laboring client has late decelerations on the fetal monitor. The nurse\'s FIRST action is to:', opts: ['Perform a vaginal exam', 'Turn the client to the left side', 'Administer oxygen via face mask', 'Increase the oxytocin rate'], ans: 1, rat: 'Late decelerations indicate uteroplacental insufficiency. Repositioning (left lateral) improves placental blood flow — do this first, then oxygen and provider notification.' },
    { cat: 'Pediatrics', q: 'A 4-year-old is admitted with epiglottitis. Which action is contraindicated?', opts: ['Keeping the child calm and upright', 'Having intubation equipment at the bedside', 'Using a tongue blade to visualize the throat', 'Administering humidified oxygen'], ans: 2, rat: 'Never insert anything into the mouth/throat of a child with epiglottitis — it can trigger complete airway obstruction. Keep NPO, calm, and prepare for intubation.' },
    { cat: 'Mental Health', q: 'A client with bipolar mania is intrusive and loud on the unit. The best nursing intervention is to:', opts: ['Place the client in seclusion immediately', 'Engage in lengthy group therapy', 'Provide a low-stimulation environment', 'Encourage competitive games with peers'], ans: 2, rat: 'Mania requires decreased stimulation: quiet room, short simple interactions, structured activities. Avoid overstimulation and confrontation.' },
    { cat: 'Pharmacology', q: 'Which food must a client taking an MAOI antidepressant avoid?', opts: ['Citrus fruits', 'Aged cheese', 'Leafy greens', 'Whole grains'], ans: 1, rat: 'Aged cheeses contain tyramine, which with MAOIs can trigger a hypertensive crisis. Avoid tyramine-rich foods: aged cheese, cured meats, red wine.' },
    { cat: 'Med-Surg', q: 'A client post-thyroidectomy reports tingling around the mouth and muscle cramps. The nurse suspects:', opts: ['Hypercalcemia', 'Hypocalcemia', 'Hyperkalemia', 'Hypomagnesemia'], ans: 1, rat: 'Accidental parathyroid removal during thyroidectomy causes hypocalcemia: perioral tingling, Chvostek\'s and Trousseau\'s signs, muscle cramps. Have calcium gluconate available.' },
    { cat: 'Fundamentals', q: 'To prevent pressure injuries, the nurse should reposition an immobile client at least every:', opts: ['30 minutes', '1 hour', '2 hours', '4 hours'], ans: 2, rat: 'Reposition immobile clients at least every 2 hours (every 1 hour if seated) to relieve pressure and prevent tissue injury.' },
    { cat: 'Pharmacology', q: 'A client receiving warfarin has an INR of 5.8. The nurse anticipates which order?', opts: ['Increase the warfarin dose', 'Administer vitamin K', 'Administer protamine sulfate', 'Continue the current dose'], ans: 1, rat: 'Therapeutic INR is 2-3. An INR of 5.8 indicates high bleeding risk — hold warfarin and give vitamin K per protocol.' },
    { cat: 'Med-Surg', q: 'Early signs of hypovolemic shock include:', opts: ['Bradycardia and warm skin', 'Tachycardia, restlessness, and cool clammy skin', 'Hypertension and bounding pulses', 'Fever and flushed skin'], ans: 1, rat: 'Compensatory stage: tachycardia, restlessness/anxiety, cool clammy pale skin, and normal or slightly low BP. Hypotension is a LATE sign.' },
    { cat: 'Delegation', q: 'Which task can the RN delegate to unlicensed assistive personnel (UAP)?', opts: ['Assessing a post-op wound', 'Ambulating a stable post-op client', 'Teaching insulin injection technique', 'Evaluating pain medication effectiveness'], ans: 1, rat: 'UAP may perform routine, stable tasks like ambulating a stable client. Assessment, teaching, and evaluation stay with the RN.' },
    { cat: 'Maternity', q: 'The nurse notes a prolapsed umbilical cord. The immediate action is to:', opts: ['Push the cord back into the vagina', 'Place the client in knee-chest position and apply gloved pressure to lift the presenting part', 'Start oxytocin', 'Encourage the client to push'], ans: 1, rat: 'Relieve cord compression immediately: knee-chest or Trendelenburg position, gloved hand lifting the presenting part off the cord. Never push the cord back in.' },
    { cat: 'Pediatrics', q: 'Which immunization is contraindicated in a child receiving chemotherapy?', opts: ['DTaP', 'Inactivated polio (IPV)', 'MMR', 'Hepatitis B'], ans: 2, rat: 'MMR is a live vaccine — contraindicated in immunocompromised clients. Inactivated vaccines (DTaP, IPV, Hep B) are generally safe.' },
    { cat: 'Pharmacology', q: 'Insulin glargine (Lantus) teaching should include:', opts: ['It peaks in 2-4 hours', 'Do not mix with other insulins', 'Shake well before use', 'It is taken with meals'], ans: 1, rat: 'Glargine is long-acting with no pronounced peak and must NOT be mixed or diluted with other insulins.' },
    { cat: 'Med-Surg', q: 'A client with COPD is receiving 6 L/min oxygen via nasal cannula and becomes drowsy. The nurse should:', opts: ['Increase oxygen to 10 L/min', 'Decrease oxygen to 1-2 L/min and notify the provider', 'Switch to a non-rebreather mask', 'Encourage deep breathing exercises'], ans: 1, rat: 'High-flow O2 can suppress the hypoxic drive in CO2 retainers, causing CO2 narcosis. Titrate to target SpO2 88-92% and notify the provider.' },
    { cat: 'Mental Health', q: 'A client with schizophrenia says, "The TV is sending me secret messages." The best response is:', opts: ['"That is not true; the TV cannot send messages."', '"What do you think the messages are telling you?"', '"I don\'t hear anything from the TV."', '"Let\'s watch a different channel."'], ans: 1, rat: 'Acknowledge the feeling without reinforcing the delusion: reality orientation delivered empathetically. Don\'t argue, and don\'t agree the delusion is real.' },
    { cat: 'Fundamentals', q: 'When removing personal protective equipment after caring for a client on contact precautions, the nurse removes first:', opts: ['Mask', 'Gown', 'Gloves', 'Goggles'], ans: 2, rat: 'Remove the most contaminated item first: gloves, then goggles/face shield, then gown, then mask. Hand hygiene after removal.' },
    { cat: 'Pharmacology', q: 'A client taking furosemide should be taught to report:', opts: ['Weight loss of 1 lb', 'Muscle weakness and cramps', 'Increased appetite', 'Dry mouth in the morning'], ans: 1, rat: 'Loop diuretics waste potassium. Muscle weakness, cramps, and irregular pulse signal hypokalemia — report promptly.' },
    { cat: 'Med-Surg', q: 'Which finding indicates a positive Chvostek\'s sign?', opts: ['Carpal spasm when BP cuff is inflated', 'Facial twitching when the cheek is tapped', 'Calf pain on dorsiflexion of the foot', 'Numbness in the fingers after hyperventilation'], ans: 1, rat: 'Chvostek\'s: tapping the facial nerve causes facial twitching — a sign of hypocalcemia. Trousseau\'s is carpal spasm with a BP cuff.' },
    { cat: 'Maternity', q: 'A newborn\'s Apgar score is 4 at 1 minute. The nurse should:', opts: ['Document and continue routine care', 'Begin resuscitation measures', 'Place the newborn skin-to-skin', 'Recheck the score in 10 minutes'], ans: 1, rat: 'Apgar 0-3 = severe distress; 4-6 = moderate difficulty requiring resuscitation (warm, dry, stimulate, oxygen/ventilation as needed). Recheck at 5 minutes.' },
    { cat: 'Pediatrics', q: 'A child with dehydration is prescribed oral rehydration. Which finding indicates the therapy is effective?', opts: ['Sunken fontanelle', 'Tenting of the skin', 'Moist mucous membranes and tears when crying', 'Decreased urine output'], ans: 2, rat: 'Improved hydration: moist mucous membranes, tears, flat fontanelle, good skin turgor, and adequate urine output.' },
    { cat: 'Pharmacology', q: 'Before giving a client their first dose of IV vancomycin, the nurse should ask about:', opts: ['Penicillin allergy', 'Red man syndrome history', 'Hearing problems', 'Shellfish allergy'], ans: 0, rat: 'Vancomycin is structurally related to penicillin; cross-reactivity can occur. Also infuse slowly to prevent red man syndrome and monitor for ototoxicity.' },
    { cat: 'Prioritization', q: 'The nurse receives report on four clients. Who needs to be seen first?', opts: ['A client with a potassium of 5.9 mEq/L', 'A client with a hemoglobin of 9.8 g/dL', 'A client with a glucose of 210 mg/dL', 'A client with a sodium of 138 mEq/L'], ans: 0, rat: 'Hyperkalemia (K+ 5.9) risks lethal cardiac dysrhythmias — the most immediately life-threatening abnormality. Treat per protocol (calcium, insulin/glucose, kayexalate).' },
    { cat: 'Med-Surg', q: 'A client with a new ileostomy is ready for discharge teaching. The nurse should include:', opts: ['Expect formed stool within a week', 'Empty the pouch when it is one-third to one-half full', 'Avoid all fruits and vegetables permanently', 'Change the entire appliance daily'], ans: 1, rat: 'Empty the pouch at 1/3 to 1/2 full to prevent leakage and skin breakdown. Ileostomy output stays liquid; appliance changes are typically every 3-7 days.' },
    { cat: 'Safety', q: 'A nurse discovers a small fire in a client\'s room. After rescuing clients, the next step in RACE is to:', opts: ['Extinguish the fire', 'Activate the alarm', 'Confine the fire', 'Call the fire department'], ans: 1, rat: 'RACE: Rescue, Alarm, Confine, Extinguish. After moving clients to safety, activate the fire alarm before confining or extinguishing.' },
    { cat: 'Pharmacology', q: 'Which lab value must be monitored in a client taking lithium?', opts: ['Serum sodium', 'Serum calcium', 'Hemoglobin A1c', 'Liver enzymes'], ans: 0, rat: 'Lithium competes with sodium; low sodium raises lithium levels and toxicity risk. Monitor sodium, hydration, and serum lithium levels (0.6-1.2 mEq/L).' },
    { cat: 'Med-Surg', q: 'A client with diabetes insipidus will most likely exhibit:', opts: ['Fluid overload and hypertension', 'Polyuria, polydipsia, and hypernatremia', 'Oliguria and hyponatremia', 'Weight gain and edema'], ans: 1, rat: 'Diabetes insipidus = ADH deficiency → massive dilute urine output (polyuria), extreme thirst, and hypernatremia from free water loss.' },
    { cat: 'Fundamentals', q: 'The nurse is preparing to insert a urinary catheter. Which action maintains sterile technique?', opts: ['Opening the sterile kit on the overbed table', 'Keeping hands above the waist and in sight', 'Placing the sterile drape after cleansing', 'Reaching over the sterile field to adjust lighting'], ans: 1, rat: 'Sterile objects must stay above the waist and in view; never reach over a sterile field. Open the kit on a clean, dry surface and set up the field before cleansing.' }
  ];

  var state = { current: 0, correct: 0, answered: 0, locked: false };

  function bestScore() {
    try { return parseInt(localStorage.getItem('nclex-quiz-best') || '0', 10); } catch (e) { return 0; }
  }
  function saveBest(pct) {
    try {
      if (pct > bestScore()) { localStorage.setItem('nclex-quiz-best', String(pct)); }
    } catch (e) {}
  }

  function renderQuestion() {
    var wrap = document.getElementById('quiz-body');
    if (state.current >= QUESTIONS.length) { renderResults(); return; }
    var q = QUESTIONS[state.current];
    state.locked = false;
    var pct = Math.round((state.current / QUESTIONS.length) * 100);
    var html = '<div class="quiz-q">';
    html += '<p class="note">Question ' + (state.current + 1) + ' of ' + QUESTIONS.length + ' · <strong>' + q.cat + '</strong> · Best score: ' + bestScore() + '%</p>';
    html += '<div class="progress-bar"><span style="width:' + pct + '%"></span></div>';
    html += '<h3>' + q.q + '</h3><div class="opts">';
    q.opts.forEach(function (o, i) {
      html += '<label data-i="' + i + '"><input type="radio" name="qopt" value="' + i + '"> ' + o + '</label>';
    });
    html += '</div><div class="rationale" id="rat"><strong>Rationale:</strong> ' + q.rat + '</div>';
    html += '<button class="btn" id="check-btn" style="margin-top:14px">Check Answer</button>';
    html += '</div>';
    wrap.innerHTML = html;
    document.getElementById('check-btn').addEventListener('click', checkAnswer);
  }

  function checkAnswer() {
    if (state.locked) return;
    var sel = document.querySelector('input[name=qopt]:checked');
    if (!sel) { alert('Please select an answer first.'); return; }
    state.locked = true;
    var q = QUESTIONS[state.current];
    var picked = parseInt(sel.value, 10);
    state.answered++;
    if (picked === q.ans) state.correct++;
    var labels = document.querySelectorAll('.quiz-q .opts label');
    labels.forEach(function (l) {
      var i = parseInt(l.getAttribute('data-i'), 10);
      if (i === q.ans) l.classList.add('correct');
      else if (i === picked) l.classList.add('wrong');
    });
    document.getElementById('rat').classList.add('show');
    var btn = document.getElementById('check-btn');
    btn.textContent = state.current + 1 >= QUESTIONS.length ? 'See My Results' : 'Next Question';
    btn.addEventListener('click', nextQuestion, { once: true });
    btn.id = 'next-btn';
  }

  function nextQuestion() {
    state.current++;
    renderQuestion();
    document.getElementById('quiz-body').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderResults() {
    var pct = Math.round((state.correct / QUESTIONS.length) * 100);
    saveBest(pct);
    var verdict, cls;
    if (pct >= 80) { verdict = 'Excellent — you are answering at a strong NCLEX-ready level. Keep practicing timed sets.'; cls = 'good'; }
    else if (pct >= 65) { verdict = 'Good progress — review the rationales for missed questions and retest in a few days.'; cls = 'warn'; }
    else { verdict = 'Keep studying — focus on content review first, then retake this quiz. Use the study planner to build your schedule.'; cls = 'bad'; }
    var html = '<div class="result" style="text-align:center">';
    html += '<p class="note">Your score</p><div class="big">' + state.correct + ' / ' + QUESTIONS.length + ' (' + pct + '%)</div>';
    html += '<p class="verdict ' + cls + '">' + verdict + '</p>';
    html += '<p class="note">Best score on this device: ' + bestScore() + '%</p>';
    html += '<button class="btn" id="restart-btn" style="margin-top:16px">Retake Quiz</button>';
    html += '</div>';
    document.getElementById('quiz-body').innerHTML = html;
    document.getElementById('restart-btn').addEventListener('click', function () {
      state = { current: 0, correct: 0, answered: 0, locked: false };
      renderQuestion();
    });
  }

  function init() {
    var start = document.getElementById('start-quiz');
    if (!start) return;
    start.addEventListener('click', function () {
      document.getElementById('quiz-intro').style.display = 'none';
      document.getElementById('quiz-body').style.display = 'block';
      renderQuestion();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
