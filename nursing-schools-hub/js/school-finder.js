/* Nursing Program Finder Quiz logic */
(function () {
  'use strict';

  var PROGRAMS = {
    adn: {
      title: 'ADN — Associate Degree in Nursing',
      length: '2 years',
      cost: 'Typical total: $8,000–$25,000 (community college)',
      points: [
        'Fastest, most affordable path to RN licensure',
        'Offered mainly by community colleges',
        'Same NCLEX-RN exam as BSN graduates take'
      ]
    },
    bsn: {
      title: 'BSN — Bachelor of Science in Nursing',
      length: '4 years',
      cost: 'Typical total: $40,000–$120,000+ (public vs private)',
      points: [
        'Preferred by most hospitals; required for management, military, and many specialties',
        'Opens doors to graduate school (MSN, DNP)',
        'Strongest long-term salary trajectory'
      ]
    },
    absn: {
      title: 'ABSN — Accelerated Bachelor of Science in Nursing',
      length: '12–18 months',
      cost: 'Typical total: $35,000–$80,000',
      points: [
        'For students who already hold a bachelor\'s in another field',
        'Intense, full-time — working during the program is rarely possible',
        'Same BSN degree and NCLEX eligibility as a traditional BSN'
      ]
    },
    rnbsn: {
      title: 'RN-to-BSN Bridge Program',
      length: '12–24 months (often online)',
      cost: 'Typical total: $10,000–$35,000',
      points: [
        'Designed for licensed RNs (ADN) or LPNs/LVNs upgrading',
        'Mostly online; you can keep working',
        'Many employers offer tuition reimbursement for this exact step'
      ]
    }
  };

  var REGION_LABELS = {
    northeast: 'the Northeast', midwest: 'the Midwest', south: 'the South',
    west: 'the West', online: 'flexible/online options'
  };

  function recommend(a) {
    var base = PROGRAMS[a.degree];
    var why = base.points.slice();

    if (a.degree === 'adn' && a.budget === 'low') {
      why.push('Community-college ADN programs are the best fit for a sub-$20k budget.');
    } else if (a.budget === 'low' && a.degree !== 'adn') {
      why.push('On a tight budget, prioritize public in-state universities — they can cut BSN costs in half versus private schools.');
    }
    if (a.budget === 'high') {
      why.push('With budget flexibility, you can weigh private programs with premium clinical placements and higher NCLEX pass rates.');
    }

    if (a.schedule === 'parttime' || a.schedule === 'evening') {
      why.push('Look for programs explicitly advertising part-time or evening/weekend tracks — not all schools offer them.');
    }
    if (a.schedule === 'hybrid') {
      why.push('Hybrid programs let you do coursework online, but you will still complete clinicals in person near your location.');
    }
    if (a.schedule === 'fulltime' && a.degree === 'absn') {
      why.push('Accelerated programs demand full-time commitment — plan finances so you can pause work for 12–18 months.');
    }

    if (a.region === 'online') {
      why.push('Verify any online program is accredited (ACEN or CCNE) and arranges clinicals in your state — some don\'t.');
    } else {
      why.push('Focus your search on accredited programs in ' + REGION_LABELS[a.region] + ' so clinical rotations stay commutable.');
    }

    return { title: base.title, length: base.length, cost: base.cost, why: why };
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('finder-form');
    var results = document.getElementById('results');
    if (!form || !results) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var a = {
        degree: document.getElementById('degree').value,
        budget: document.getElementById('budget').value,
        region: document.getElementById('region').value,
        schedule: document.getElementById('schedule').value
      };
      var r = recommend(a);
      var html = '<div class="result-card" style="grid-column:1/-1">' +
        '<span class="badge">Your best match</span>' +
        '<h3>' + esc(r.title) + '</h3>' +
        '<p><strong>Length:</strong> ' + esc(r.length) + '<br><strong>Cost:</strong> ' + esc(r.cost) + '</p>' +
        '<ul>' + r.why.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>' +
        '</div>';
      results.innerHTML = html;
      results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
