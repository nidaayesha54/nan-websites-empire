// Eligibility Verification Checklist Generator
var CHECKLISTS = {
  new: [
    'Confirm patient full name and date of birth match the insurance card',
    'Verify insurance is active for the date of service',
    'Check copay / coinsurance / deductible amounts',
    'Confirm the plan covers the scheduled service or procedure',
    'Verify prior authorization requirements — obtain auth if needed',
    'Confirm referral is on file if the plan requires one',
    'Check whether the provider is in-network for this plan',
    'Collect copay / patient responsibility at time of service',
    'Scan insurance card (front and back) into the record',
    'Confirm coordination of benefits if patient has secondary insurance'
  ],
  returning: [
    'Re-verify insurance is still active (plans change at renewal)',
    'Check for changes in copay / deductible since last visit',
    'Confirm coverage for today\'s service or procedure',
    'Verify prior authorization requirements for today\'s service',
    'Update scanned insurance card if a new card was issued',
    'Collect any outstanding patient balance if applicable'
  ],
  medicare: [
    'Verify Medicare Part A / Part B eligibility and effective dates',
    'Check for a Medicare Advantage plan (replaces Original Medicare)',
    'Confirm the provider accepts Medicare assignment',
    'Verify ABN is signed for any potentially non-covered service',
    'Check secondary insurance / Medigap coverage',
    'Confirm medical necessity documentation supports the claim'
  ],
  selfpay: [
    'Provide a Good Faith Estimate (No Surprises Act requirement)',
    'Confirm the patient understands self-pay rates and payment options',
    'Offer payment plan options before the visit if needed',
    'Collect payment or deposit at time of service',
    'Document the patient\'s self-pay election in the record'
  ]
};

function genChecklist() {
  var type = document.getElementById('el-type').value;
  var items = CHECKLISTS[type] || CHECKLISTS.new;
  var ul = document.getElementById('el-list');
  ul.innerHTML = '';
  items.forEach(function (text, i) {
    var li = document.createElement('li');
    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = 'el-item-' + i;
    cb.addEventListener('change', function () { li.classList.toggle('done', cb.checked); updateProgress(); });
    var span = document.createElement('span');
    span.textContent = text;
    li.appendChild(cb);
    li.appendChild(span);
    ul.appendChild(li);
  });
  document.getElementById('el-box').classList.add('show');
  updateProgress();
}

function updateProgress() {
  var boxes = document.querySelectorAll('#el-list input[type=checkbox]');
  var done = document.querySelectorAll('#el-list input[type=checkbox]:checked').length;
  var p = document.getElementById('el-progress');
  if (boxes.length) p.textContent = done + ' of ' + boxes.length + ' checks complete';
}

function copyChecklist() {
  var lines = [];
  document.querySelectorAll('#el-list li span').forEach(function (s, i) {
    var checked = document.querySelectorAll('#el-list input[type=checkbox]')[i].checked ? '[x]' : '[ ]';
    lines.push(checked + ' ' + s.textContent);
  });
  var text = 'Patient Eligibility Verification Checklist\n\n' + lines.join('\n');
  navigator.clipboard.writeText(text).then(function () {
    alert('Checklist copied to clipboard!');
  });
}

function printChecklist() { window.print(); }

document.addEventListener('DOMContentLoaded', genChecklist);
