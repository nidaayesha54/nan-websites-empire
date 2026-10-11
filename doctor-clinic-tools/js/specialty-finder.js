document.addEventListener('DOMContentLoaded', function () {
  var RESULTS = {
    'cardiologist': { name: 'Cardiologist', desc: 'Heart and blood vessel specialist. Tests like EKGs and echocardiograms fall in their lane.' },
    'orthopedic': { name: 'Orthopedic Surgeon / Sports Medicine', desc: 'Bones, joints, ligaments, and tendons. Start with your primary care doctor or sports medicine for minor injuries.' },
    'dermatologist': { name: 'Dermatologist', desc: 'Skin, hair, and nail specialist — rashes, moles, acne, and skin checks.' },
    'ophthalmologist': { name: 'Ophthalmologist', desc: 'Medical eye doctor (can perform surgery). For routine vision checks and glasses, an optometrist works too.' },
    'ent': { name: 'ENT (Otolaryngologist)', desc: 'Ear, nose, and throat specialist — hearing issues, sinus problems, tonsils.' },
    'gastroenterologist': { name: 'Gastroenterologist', desc: 'Digestive system specialist — stomach, intestines, liver.' },
    'neurologist': { name: 'Neurologist', desc: 'Brain and nervous system specialist — headaches, seizures, numbness.' },
    'psychiatrist': { name: 'Psychiatrist / Psychologist', desc: 'Mental health professionals. Psychiatrists can prescribe medication; psychologists focus on therapy.' },
    'obgyn': { name: 'OB/GYN', desc: "Women's reproductive health, pregnancy, and annual exams." },
    'urologist': { name: 'Urologist', desc: 'Urinary tract specialist for all genders; also covers male reproductive health.' },
    'pediatrician': { name: 'Pediatrician', desc: 'Doctor for infants, children, and teens.' },
    'pulmonologist': { name: 'Pulmonologist', desc: 'Lung and breathing specialist.' },
    'endocrinologist': { name: 'Endocrinologist', desc: 'Hormone specialist — diabetes, thyroid, metabolism.' },
    'dentist': { name: 'Dentist', desc: 'Teeth and mouth care is handled by dentists, not physicians — book a dental office.' },
    'pcp': { name: 'Primary Care Doctor', desc: 'Start with a family medicine or internal medicine doctor. They handle general concerns and refer you to the right specialist.' }
  };

  var QUESTIONS = [
    { q: 'Which area is your concern about?', options: [
      ['Heart or chest', 'cardiologist', true],
      ['Bones, joints, or muscles', 'orthopedic', false],
      ['Skin, hair, or nails', 'dermatologist', false],
      ['Eyes or vision', 'ophthalmologist', false],
      ['Ears, nose, or throat', 'ent', false],
      ['Stomach or digestion', 'gastroenterologist', false]
    ]},
    { q: 'Or is it one of these?', options: [
      ['Brain, nerves, headaches', 'neurologist', false],
      ['Mental health / mood', 'psychiatrist', false],
      ["Women's health / pregnancy", 'obgyn', false],
      ['Urinary / bladder issues', 'urologist', false],
      ['A child (under 18)', 'pediatrician', false],
      ['Teeth or mouth', 'dentist', false]
    ]},
    { q: 'Last one — anything else?', options: [
      ['Lungs / breathing trouble', 'pulmonologist', false],
      ['Hormones / diabetes / thyroid', 'endocrinologist', false],
      ['General checkup / not sure', 'pcp', false],
      ['Something else entirely', 'pcp', false]
    ]}
  ];

  var step = 0, box = document.getElementById('quiz'), res = document.getElementById('result');

  function render() {
    if (step >= QUESTIONS.length) return;
    var q = QUESTIONS[step];
    var html = '<div class="form-card"><h2 style="font-size:1.25rem;margin-bottom:16px">' + esc(q.q) + '</h2>';
    q.options.forEach(function (opt) {
      html += '<button type="button" class="quiz-option" data-key="' + opt[1] + '" data-emg="' + (opt[2] ? '1' : '0') + '">' + esc(opt[0]) + '</button>';
    });
    html += (step > 0 ? '<p style="margin-top:10px"><a href="#" id="back">← Back</a></p>' : '') + '</div>';
    box.innerHTML = html;
    box.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.addEventListener('click', function () { showResult(btn.dataset.key, btn.dataset.emg === '1'); });
    });
    var back = document.getElementById('back');
    if (back) back.addEventListener('click', function (e) { e.preventDefault(); step--; render(); });
  }

  function showResult(key, emergency) {
    var r = RESULTS[key];
    var emgNote = emergency
      ? '<div class="warn-box"><strong>⚠️ Important:</strong> Chest pain or pressure can be a heart attack. Do NOT wait for an appointment — call 911 or go to the ER immediately.</div>'
      : '';
    res.classList.add('show');
    res.innerHTML = emgNote +
      '<h3>Recommended: ' + esc(r.name) + '</h3>' +
      '<p>' + esc(r.desc) + '</p>' +
      '<p class="note">This is general guidance only — not a diagnosis. Describe your symptoms to your primary care doctor, who can confirm the right specialist and provide a referral if your insurance requires one.</p>' +
      '<p style="margin-top:12px"><a href="#" id="restart">↺ Start over</a> · <a href="../guides/choose-primary-care-doctor.html">How to choose a primary care doctor →</a></p>';
    document.getElementById('restart').addEventListener('click', function (e) {
      e.preventDefault(); step = 0; res.classList.remove('show'); render();
      box.scrollIntoView({ behavior: 'smooth' });
    });
    res.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  render();
});
