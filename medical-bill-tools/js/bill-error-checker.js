/* Bill Error Checker logic */
(function () {
  'use strict';

  var ERROR_INFO = {
    duplicate: { title: 'Duplicate charges', action: 'Circle both line items. Ask billing to remove one and re-issue the bill.' },
    notreceived: { title: 'Services never received', action: 'Write down what you actually remember receiving. Dispute each unknown line in writing.' },
    upcoding: { title: 'Suspicious coding (upcoding)', action: 'Ask for the CPT codes and look them up. A patient advocate or your insurer can confirm if the code matches the care.' },
    unbundling: { title: 'Unbundled charges', action: 'Ask billing whether these services are normally billed as a bundle — request rebundling.' },
    wrongpatient: { title: 'Wrong patient info or dates', action: 'Get demographics corrected first — wrong info can cause insurance denials that land on you.' },
    balancebill: { title: 'Possibly illegal balance billing', action: 'Use the No Surprises Act checker. If protected, file a complaint: 1-800-985-3059 or cms.gov/nosurprises.' },
    operating: { title: 'OR / time-based errors', action: 'Compare billed OR minutes against the operative report. Dispute phantom time.' },
    meds: { title: 'Medication overcharges', action: 'Compare drug charges to typical prices. Dispute meds you never took.' },
    cancelled: { title: 'Cancelled procedures billed', action: 'Provide the cancellation record and demand removal of the charge.' },
    insurance: { title: 'Insurance not applied', action: 'Call your insurer with the claim number and ask why the negotiated rate is missing.' }
  };

  function init() {
    var btn = document.getElementById('checkBtn');
    if (!btn) return;
    btn.addEventListener('click', generate);
  }

  function generate() {
    var checked = [];
    var boxes = document.querySelectorAll('#errorChecklist input[type="checkbox"]');
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].checked) checked.push(boxes[i].value);
    }

    var total = parseFloat(document.getElementById('billTotal').value) || 0;
    var disputed = parseFloat(document.getElementById('disputedTotal').value) || 0;
    var provider = document.getElementById('patientName').value.trim();

    var box = document.getElementById('resultBox');
    var html = '';

    if (checked.length === 0 && disputed <= 0) {
      box.className = 'result-box show result-ok';
      box.innerHTML = '<h3>✅ No red flags selected</h3><p>That\'s a good sign — but still verify: request the itemized bill, confirm your insurance was applied, and compare the total against your insurer\'s Explanation of Benefits (EOB).</p>';
      return;
    }

    var cls = checked.length >= 4 ? 'result-bad' : 'result-warn';
    box.className = 'result-box show ' + cls;

    html += '<h3>🚩 ' + checked.length + ' potential error' + (checked.length === 1 ? '' : 's') + ' flagged' + (provider ? ' on your ' + window.mbhEsc(provider) + ' bill' : '') + '</h3>';
    html += '<ul>';
    for (var j = 0; j < checked.length; j++) {
      var info = ERROR_INFO[checked[j]];
      if (info) html += '<li><strong>' + window.mbhEsc(info.title) + ':</strong> ' + window.mbhEsc(info.action) + '</li>';
    }
    html += '</ul>';

    if (disputed > 0) {
      html += '<p><strong>Disputed amount:</strong> ' + window.mbhMoney(disputed);
      if (total > 0) {
        var pct = Math.round((disputed / total) * 100);
        html += ' (' + pct + '% of your ' + window.mbhMoney(total) + ' bill)';
      }
      html += '</p>';
    }

    html += '<p><strong>Your action plan:</strong></p><ol>' +
      '<li>Request an <strong>itemized bill</strong> (with CPT codes) if you don\'t have one.</li>' +
      '<li>Dispute each flagged charge with the billing department — <strong>in writing</strong> (email or certified mail).</li>' +
      '<li>Ask about <strong>financial assistance / charity care</strong> while you\'re at it.</li>' +
      '<li>If a balance bill looks illegal, check the <a href="no-surprises-checker.html">No Surprises Act checker</a>.</li>' +
      '</ol>' +
      '<p class="disclaimer">General information only — not legal or financial advice.</p>';

    box.innerHTML = html;
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
