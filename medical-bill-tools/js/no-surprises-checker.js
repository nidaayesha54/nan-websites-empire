/* No Surprises Act Checker quiz logic */
(function () {
  'use strict';

  function init() {
    var btn = document.getElementById('quizBtn');
    if (!btn) return;
    btn.addEventListener('click', evaluate);
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }

  function evaluate() {
    var q1 = val('q1'), q2 = val('q2'), q3 = val('q3'),
        q4 = val('q4'), q5 = val('q5'), q6 = val('q6');

    var box = document.getElementById('quizResult');

    if (!q1 || !q2 || !q3 || !q4 || !q5 || !q6) {
      box.className = 'result-box show result-warn';
      box.innerHTML = '<h3>⚠️ Almost there</h3><p>Please answer all 6 questions so the checker can give you a result.</p>';
      return;
    }

    var protectedReasons = [];
    var warnings = [];

    if (q6 === 'yes') {
      warnings.push('<strong>Ground ambulance is NOT covered</strong> by the No Surprises Act — this is a known gap in the law. You can still negotiate the bill and ask about financial assistance.');
    }
    if (q1 === 'yes') {
      protectedReasons.push('Emergency services are protected — your cost is limited to in-network cost-sharing amounts, even at out-of-network facilities.');
    }
    if (q2 === 'yes') {
      protectedReasons.push('Out-of-network providers at in-network facilities (anesthesiologists, radiologists, labs, etc.) generally cannot balance-bill you.');
    }
    if (q3 === 'yes') {
      protectedReasons.push('Air ambulance surprise billing is banned — your cost is limited to in-network cost-sharing.');
    }
    if (q4 === 'no') {
      warnings.push('As an uninsured/self-pay patient you should have received a <strong>good faith estimate</strong>. If the final bill is $400+ more than the estimate, you can start a patient-provider dispute at cms.gov/nosurprises.');
    } else if (q4 === 'yes') {
      protectedReasons.push('You received a good faith estimate — if the final bill exceeds it by $400 or more, you can dispute the difference.');
    }
    if (q5 === 'yes') {
      warnings.push('You signed a consent form for out-of-network charges. Protections may be limited — <strong>but</strong> consent is never valid for emergency care, and the form must meet strict federal requirements to count. When in doubt, file a complaint.');
    } else if (q5 === 'unsure') {
      warnings.push('Check whether you signed a "notice and consent" form. If you don\'t remember signing one, ask the provider for a copy.');
    }

    var html;
    if (protectedReasons.length > 0 && warnings.length === 0) {
      box.className = 'result-box show result-ok';
      html = '<h3>✅ You are likely protected</h3><p>Based on your answers, the No Surprises Act likely covers your situation:</p><ul>';
    } else if (protectedReasons.length > 0) {
      box.className = 'result-box show result-warn';
      html = '<h3>⚠️ You may be protected — with caveats</h3><p><strong>Protections that may apply:</strong></p><ul>';
    } else {
      box.className = 'result-box show result-warn';
      html = '<h3>⚠️ Protections are unclear for your situation</h3><p>Based on your answers, the No Surprises Act may not directly cover this bill. That doesn\'t mean you have no options:</p><ul>';
    }

    for (var i = 0; i < protectedReasons.length; i++) {
      html += '<li>' + protectedReasons[i] + '</li>';
    }
    html += '</ul>';

    if (warnings.length > 0) {
      html += '<p><strong>Important notes:</strong></p><ul>';
      for (var j = 0; j < warnings.length; j++) {
        html += '<li>' + warnings[j] + '</li>';
      }
      html += '</ul>';
    }

    html += '<p><strong>Next steps:</strong></p><ol>' +
      '<li>Do <strong>not</strong> pay a bill you believe is a surprise bill until you\'ve checked.</li>' +
      '<li>Call the federal No Surprises helpdesk: <strong>1-800-985-3059</strong>.</li>' +
      '<li>File a complaint at <a href="https://www.cms.gov/nosurprises" target="_blank" rel="noopener">cms.gov/nosurprises</a>.</li>' +
      '<li>Keep copies of the bill, your insurance card, and any consent forms.</li>' +
      '</ol>' +
      '<p class="disclaimer">General information only — not legal advice. Confirm your specific situation at cms.gov/nosurprises.</p>';

    box.innerHTML = html;
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
