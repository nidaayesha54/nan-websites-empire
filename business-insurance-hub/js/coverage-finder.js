// Coverage Finder quiz logic
function findCoverage() {
  var industry = document.getElementById('industry').value;
  var size = document.getElementById('size').value;
  var has = function (id) { return document.getElementById(id).checked; };

  var recs = [];

  function add(name, why, cost, priority) {
    recs.push({ name: name, why: why, cost: cost, priority: priority });
  }

  // General liability — recommended for nearly everyone
  add('General Liability Insurance',
      'Covers third-party bodily injury, property damage, and advertising injury claims. The foundation of business protection.',
      '$400–$1,500 / year', 1);

  // BOP for small businesses with location
  if ((size === 'solo' || size === 'small') && (has('c-location') || industry === 'retail' || industry === 'restaurant')) {
    add("Business Owner's Policy (BOP)",
        'Bundles general liability + commercial property at a discount — built for small businesses like yours.',
        '$350–$2,500 / year', 1);
  }

  // Professional liability
  if (has('c-advice') || industry === 'professional' || industry === 'healthcare' || industry === 'realestate') {
    add('Professional Liability (E&O)',
        'Covers claims that your advice, design, or service caused a client financial loss. Essential for service businesses.',
        '$500–$2,000 / year', 1);
  }

  // Workers comp
  if (size !== 'solo') {
    add("Workers' Compensation",
        'Legally required in nearly every US state once you hire employees. Covers work injuries and lost wages.',
        'Varies by payroll & risk class', 1);
  }

  // Commercial property
  if (has('c-location')) {
    add('Commercial Property Insurance',
        'Protects your building, equipment, and inventory against fire, theft, and storms.',
        '$500–$3,000 / year', 2);
  }

  // Commercial auto
  if (has('c-vehicles')) {
    add('Commercial Auto Insurance',
        'Personal auto policies exclude business use. Covers vehicles owned or used by the business.',
        '$600–$2,400 / vehicle / year', 2);
  }

  // Cyber
  if (has('c-data')) {
    add('Cyber Liability Insurance',
        'Covers data breaches, ransomware, and notification costs. Critical if you store customer data or take online payments.',
        '$1,000–$7,500 / year', 2);
  }

  // Product liability
  if (has('c-products') || industry === 'manufacturing' || industry === 'retail' || industry === 'restaurant') {
    add('Product Liability Insurance',
        'Covers injury or damage caused by products you sell or serve. Often bundled into general liability.',
        'Often included in GL / BOP', 2);
  }

  // Industry-specific
  if (industry === 'construction') {
    add("Contractor's Tools & Equipment / Builder's Risk",
        'Covers tools, equipment, and structures under construction — standard requirements on job sites.',
        '$500–$3,000 / year', 2);
  }
  if (industry === 'restaurant') {
    add('Liquor Liability (if you serve alcohol)',
        'Required in most states that allow alcohol sales. Covers alcohol-related injury claims.',
        '$300–$2,000 / year', 2);
  }
  if (industry === 'healthcare') {
    add('Medical Malpractice Insurance',
        'Specialized professional liability for healthcare providers. Requirements vary by state and specialty.',
        '$5,000–$30,000+ / year', 1);
  }
  if (industry === 'realestate') {
    add('Errors & Omissions for Real Estate',
        'Most states and brokerages require E&O. Covers transaction mistakes and disclosure claims.',
        '$400–$1,500 / year', 1);
  }
  if (industry === 'homebased') {
    add('Home-Based Business Endorsement',
        "Homeowner's insurance excludes business activity. A small rider or BOP covers equipment and liability.",
        '$150–$500 / year rider', 2);
  }
  if (has('c-clientsite')) {
    add('Inland Marine / Off-Premises Coverage',
        'Covers tools and equipment while working at client locations — standard property policies stop at your door.',
        '$200–$1,000 / year', 3);
  }

  // Sort by priority
  recs.sort(function (a, b) { return a.priority - b.priority; });

  var html = '<h3>🛡️ Your Recommended Coverages (' + recs.length + ')</h3>';
  html += '<p style="color:var(--muted);font-size:.92rem;margin-bottom:14px">Priority 1 = get first. Estimates are 2026 US small-business ranges.</p>';
  recs.forEach(function (r) {
    var tag = r.priority === 1 ? ' <span style="background:var(--navy);color:#fff;font-size:.72rem;padding:2px 8px;border-radius:10px;font-weight:700">START HERE</span>' : '';
    html += '<div class="cov-item"><strong>' + esc(r.name) + '</strong>' + tag +
      '<div class="why">' + esc(r.why) + '</div>' +
      '<div class="cost">Typical cost: ' + esc(r.cost) + '</div></div>';
  });
  html += '<p style="margin-top:14px"><a class="btn" href="cost-estimator.html">Estimate My Total Cost →</a></p>';

  var res = document.getElementById('result');
  res.innerHTML = html;
  res.classList.add('show');
  res.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
