// Scenario data: typical US cost ranges (2026 estimates, uninsured self-pay).
// insured = typical copay ranges.
const SCENARIOS = {
  'cold-flu':   { name: 'Cold / Flu / COVID-like symptoms', uc: [100, 200], er: [800, 1500], ucCopay: [25, 50], erCopay: [150, 350], rec: 'urgent-care', note: 'Rest, fluids, and OTC meds handle most cases. Seek care if breathing is difficult or fever exceeds 103°F for 3+ days.' },
  'ear-infection': { name: 'Ear infection', uc: [100, 200], er: [800, 1500], ucCopay: [25, 50], erCopay: [150, 350], rec: 'urgent-care', note: 'A quick exam and antibiotics if bacterial.' },
  'uti':        { name: 'UTI symptoms', uc: [100, 200], er: [800, 1500], ucCopay: [25, 50], erCopay: [150, 350], rec: 'urgent-care', note: 'Simple urine test + antibiotics. Go to ER if you have fever, back pain, or vomiting (possible kidney infection).' },
  'sprain':     { name: 'Sprained ankle / wrist', uc: [150, 250], er: [1000, 2000], ucCopay: [30, 75], erCopay: [150, 400], rec: 'urgent-care', note: 'Urgent care can X-ray on site. Go to ER if the bone looks deformed or you cannot bear any weight.' },
  'cut':        { name: 'Cut needing stitches', uc: [150, 300], er: [1200, 2500], ucCopay: [30, 75], erCopay: [150, 500], rec: 'urgent-care', note: 'Urgent care handles most lacerations. ER for deep wounds, heavy bleeding that will not stop, or face injuries.' },
  'fever':      { name: 'High fever (adult)', uc: [150, 250], er: [1000, 2000], ucCopay: [30, 75], erCopay: [150, 400], rec: 'urgent-care', note: 'ER if fever comes with stiff neck, confusion, rash, or trouble breathing.' },
  'fracture':   { name: 'Possible broken bone', uc: [200, 400], er: [1500, 3000], ucCopay: [40, 100], erCopay: [200, 500], rec: 'either', note: 'Urgent care can X-ray and splint simple fractures; complex breaks need the ER.' },
  'burn':       { name: 'Minor burn', uc: [150, 300], er: [1200, 2500], ucCopay: [30, 75], erCopay: [150, 500], rec: 'urgent-care', note: 'ER for burns larger than your palm, on the face/hands/feet, or any third-degree burn.' },
  'chest-pain': { name: 'Chest pain / pressure', uc: [0, 0], er: [2000, 5000], ucCopay: [0, 0], erCopay: [200, 750], rec: 'er-only', note: 'Can signal a heart attack. Call 911 — do not drive yourself.' },
  'breathing':  { name: 'Difficulty breathing', uc: [0, 0], er: [2000, 5000], ucCopay: [0, 0], erCopay: [200, 750], rec: 'er-only', note: 'Call 911. This is always an emergency.' },
  'head-injury': { name: 'Head injury', uc: [0, 0], er: [1500, 4000], ucCopay: [0, 0], erCopay: [200, 600], rec: 'er-only', note: 'ER for loss of consciousness, vomiting, confusion, or worsening headache.' },
  'severe-bleed': { name: 'Severe / uncontrolled bleeding', uc: [0, 0], er: [2000, 5000], ucCopay: [0, 0], erCopay: [200, 750], rec: 'er-only', note: 'Apply pressure and call 911.' }
};

document.addEventListener('DOMContentLoaded', function () {
  var sel = document.getElementById('scenario');
  Object.keys(SCENARIOS).forEach(function (k) {
    var o = document.createElement('option');
    o.value = k; o.textContent = SCENARIOS[k].name;
    sel.appendChild(o);
  });

  document.getElementById('calc').addEventListener('submit', function (e) {
    e.preventDefault();
    var s = SCENARIOS[sel.value];
    var insured = document.getElementById('insurance').value === 'yes';
    var res = document.getElementById('result');

    var ucRange = insured ? s.ucCopay : s.uc;
    var erRange = insured ? s.erCopay : s.er;

    var recHtml;
    if (s.rec === 'er-only') {
      recHtml = '<div class="warn-box"><strong>🚨 Go to the ER / call 911.</strong> ' + esc(s.note) + '</div>';
    } else if (s.rec === 'either') {
      recHtml = '<div class="info-box"><strong>Either can work.</strong> ' + esc(s.note) + '</div>';
    } else {
      recHtml = '<div class="info-box"><strong>✅ Urgent care is usually the right call</strong> — faster and far cheaper for this issue. ' + esc(s.note) + '</div>';
    }

    var ucCost = s.rec === 'er-only'
      ? '<p>Urgent care is <strong>not appropriate</strong> for this scenario.</p>'
      : '<div class="big-num">' + fmt(ucRange[0]) + ' – ' + fmt(ucRange[1]) + '</div><p class="note">' + (insured ? 'Typical copay' : 'Typical self-pay range') + ' at urgent care</p>';

    res.classList.add('show');
    res.innerHTML =
      '<h3>' + esc(s.name) + '</h3>' + recHtml +
      '<div class="stat-row"><span><strong>Urgent care</strong></span><span>' + (s.rec === 'er-only' ? 'Not appropriate' : fmt(ucRange[0]) + ' – ' + fmt(ucRange[1])) + '</span></div>' +
      '<div class="stat-row"><span><strong>Emergency room</strong></span><span>' + fmt(erRange[0]) + ' – ' + fmt(erRange[1]) + '</span></div>' +
      (s.rec !== 'er-only' ? '<div class="stat-row"><span><strong>You could save</strong></span><strong>' + fmt(erRange[0] - ucRange[1]) + '+</strong></div>' : '') +
      '<p class="note">Ranges are 2026 US estimates for ' + (insured ? 'insured copays (plan varies)' : 'uninsured self-pay') + '. Facility fees and tests can push ER bills higher. This is cost information only — not medical advice. When in doubt about severity, choose the ER.</p>';
    res.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
