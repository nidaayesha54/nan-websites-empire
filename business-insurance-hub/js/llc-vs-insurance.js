// LLC vs Insurance decision helper
function decideLLC() {
  var debt = document.getElementById('d-debt').checked;
  var customers = document.getElementById('d-customers').checked;
  var advice = document.getElementById('d-advice').checked;
  var employees = document.getElementById('d-employees').checked;
  var contracts = document.getElementById('d-contracts').checked;

  var needLLC = debt;
  var needIns = customers || advice || employees || contracts;

  var html = '<h3>⚖️ Your Verdict</h3>';
  if (needLLC && needIns) {
    html += '<p><strong>You need BOTH an LLC and business insurance.</strong></p>' +
      '<div class="cov-item"><strong>🏛️ LLC</strong><div class="why">You may take on business debt or sign leases — the LLC wall protects your personal assets.</div></div>' +
      '<div class="cov-item"><strong>🛡️ Insurance</strong><div class="why">Your operations create real liability exposure. Start with our <a href="coverage-finder.html">coverage finder quiz</a> to pick the right policies.</div></div>';
  } else if (needIns) {
    html += '<p><strong>Insurance is your priority.</strong></p>' +
      '<div class="cov-item"><strong>🛡️ Business insurance first</strong><div class="why">Your biggest risks are lawsuits, injuries, or client claims — only insurance pays for those. An LLC is still worth considering as you grow.</div></div>';
  } else if (needLLC) {
    html += '<p><strong>Start with the LLC.</strong></p>' +
      '<div class="cov-item"><strong>🏛️ LLC first</strong><div class="why">With mainly financial exposure, the liability wall matters most right now. Add insurance before you take on customers, staff, or contracts.</div></div>';
  } else {
    html += '<p><strong>You\'re low-risk right now — but don\'t skip the basics.</strong></p>' +
      '<div class="cov-item"><strong>📋 Minimum sensible setup</strong><div class="why">Even solo freelancers benefit from a cheap general liability policy ($400–$600/yr). Revisit this quiz as soon as you hire, sign a lease, or take client work.</div></div>';
  }
  html += '<p style="margin-top:12px;font-size:.9rem;color:var(--muted)">Educational guidance only — confirm with a licensed attorney and insurance agent.</p>';

  var res = document.getElementById('result');
  res.innerHTML = html;
  res.classList.add('show');
  res.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
