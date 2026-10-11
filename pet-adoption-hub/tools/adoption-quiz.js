/* PetAdoptionHub — Adoption Readiness Quiz */
(function () {
  'use strict';

  var PREP_STEPS = {
    time: [
      'Block daily pet time in your calendar before adopting (walks, feeding, play).',
      'Arrange a backup walker/sitter for busy days — shelters ask about this.'
    ],
    home: [
      'Pet-proof one room first: secure cords, toxic plants, and small objects.',
      'Get written landlord permission now if you rent — most shelters require it.'
    ],
    budget: [
      'Run our <a href="adoption-cost.html">Adoption Cost Calculator</a> to see your true first-year number.',
      'Open a separate "pet fund" savings pocket, even $50/month to start.'
    ],
    emergency: [
      'Build a $1,000 emergency vet fund — or compare pet insurance plans (from ~$30/mo).',
      'Locate your nearest 24-hour emergency vet and save the number.'
    ],
    stability: [
      'Map out the next 2–3 years: moves, travel, job changes. Plan pet care for each.',
      'Consider fostering first — it\'s a low-commitment trial run.'
    ],
    family: [
      'Hold a family meeting: assign feeding, walking, and vet-visit duties in writing.',
      'Agree on house rules (furniture? sleeping spots?) before the pet arrives.'
    ],
    allergies: [
      'Spend time with the species/breed you want (friend\'s pet, shelter visit) to test reactions.',
      'Talk to your doctor about management options; keep antihistamines on hand.'
    ],
    planb: [
      'Line up 2 backup caregivers and exchange spare keys now.',
      'Research one boarding facility or pet-sitter app in your area with reviews.'
    ]
  };

  var form = document.getElementById('quiz-form');
  var resultBox = document.getElementById('quiz-result');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var score = 0, unanswered = [], weakAreas = [];
    var keys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'];
    var areas = ['time', 'home', 'budget', 'emergency', 'stability', 'family', 'allergies', 'planb'];

    for (var i = 0; i < keys.length; i++) {
      var picked = form.querySelector('input[name="' + keys[i] + '"]:checked');
      if (!picked) { unanswered.push(i + 1); continue; }
      var val = parseInt(picked.value, 10);
      score += val;
      if (val === 0) { weakAreas.push(areas[i]); }
    }

    if (unanswered.length) {
      resultBox.innerHTML = '<div class="result-box warn"><h3>Almost there!</h3><p>Please answer question(s) ' +
        unanswered.join(', ') + ' so we can give you an accurate verdict.</p></div>';
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    var verdict, cls, emoji;
    if (score >= 13) {
      verdict = 'Yes — you look adoption-ready!';
      emoji = '🎉'; cls = '';
    } else if (score >= 8) {
      verdict = 'Almost ready — fix a few things first.';
      emoji = '🟡'; cls = 'warn';
    } else {
      verdict = 'Not yet — and that\'s okay.';
      emoji = '🧡'; cls = 'warn';
    }

    var html = '<div class="result-box ' + cls + '"><h3>' + emoji + ' ' + verdict + '</h3>' +
      '<p><strong>Your score: ' + score + ' / 16</strong></p>';

    if (weakAreas.length) {
      html += '<p>Areas to strengthen before you adopt:</p><ul class="steps">';
      weakAreas.forEach(function (area) {
        PREP_STEPS[area].forEach(function (step) {
          html += '<li>' + step + '</li>';
        });
      });
      html += '</ul>';
    } else {
      html += '<p>You\'re in great shape. Next step: browse your local shelter and take our ' +
        '<a href="shelter-checklist.html">Shelter Visit Checklist</a> with you. Happy adopting! 🐾</p>';
    }
    html += '</div>';
    resultBox.innerHTML = html;
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
