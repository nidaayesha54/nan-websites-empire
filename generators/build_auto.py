"""Build Site 2: AutoInsuranceHub -> ~/workspace/free-sites/auto-insurance-hub/"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sitegen import build_site

SITE = {
    "dir": os.path.expanduser("~/workspace/free-sites/auto-insurance-hub"),
    "name": "AutoInsuranceHub",
    "mark": "\U0001f3ce\ufe0f",
    "base": "https://nan-autoinsurance.surge.sh",
    "index_title": "AutoInsuranceHub: Car Insurance Calculators",
    "index_desc": "Free car insurance premium estimator, liability vs full coverage tool & discount finder, plus 2026 state-by-state guides. Educational only.",
    "theme": {"primary": "#c1121f", "primary_dark": "#7f0d16", "accent": "#f59e0b", "accent_soft": "#fff4e0"},
}

COPY = {
    "h1": "Free Car Insurance Calculators & 2026 Guides",
    "hero_sub": "Estimate your premium, decide between liability and full coverage, and find every discount you qualify for \u2014 free, no signup, no spam calls.",
    "tools_h2": "Car Insurance Calculators",
    "tools_sub": "Interactive tools that estimate your costs. All results are labeled estimates, not quotes.",
    "guides_h2": "2026 Car Insurance Guides",
    "guides_sub": "State-by-state pricing, coverage advice, and discount strategies in plain English.",
    "blog_h2": "From the Blog",
    "blog_sub": "Why rates move, new insurance tech, and money-saving tactics.",
}

PREM_JS = """'use strict';
/* 6-month premium estimator. Factors multiply a $800 national base 6-month premium. */
var STATE_F = { AL:1.00, AK:1.10, AZ:1.10, AR:1.00, CA:1.22, CO:1.08, CT:1.08, DE:1.10, DC:1.25,
  FL:1.35, GA:1.12, HI:1.05, ID:0.85, IL:1.08, IN:0.95, IA:0.85, KS:0.95, KY:1.00, LA:1.30,
  ME:0.82, MD:1.10, MA:1.05, MI:1.45, MN:0.95, MS:1.05, MO:0.98, MT:0.92, NE:0.92, NV:1.25,
  NH:0.88, NJ:1.28, NM:1.05, NY:1.32, NC:0.95, ND:0.90, OH:0.92, OK:1.05, OR:1.02, PA:1.00,
  RI:1.12, SC:1.05, SD:0.90, TN:0.98, TX:1.15, UT:0.95, VT:0.80, VA:0.95, WA:1.05,
  WV:0.95, WI:0.92, WY:0.95 };
var STATE_NAMES = { AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California', CO:'Colorado',
  CT:'Connecticut', DE:'Delaware', DC:'District of Columbia', FL:'Florida', GA:'Georgia', HI:'Hawaii',
  ID:'Idaho', IL:'Illinois', IN:'Indiana', IA:'Iowa', KS:'Kansas', KY:'Kentucky', LA:'Louisiana',
  ME:'Maine', MD:'Maryland', MA:'Massachusetts', MI:'Michigan', MN:'Minnesota', MS:'Mississippi',
  MO:'Missouri', MT:'Montana', NE:'Nebraska', NV:'Nevada', NH:'New Hampshire', NJ:'New Jersey',
  NM:'New Mexico', NY:'New York', NC:'North Carolina', ND:'North Dakota', OH:'Ohio', OK:'Oklahoma',
  OR:'Oregon', PA:'Pennsylvania', RI:'Rhode Island', SC:'South Carolina', SD:'South Dakota',
  TN:'Tennessee', TX:'Texas', UT:'Utah', VT:'Vermont', VA:'Virginia', WA:'Washington',
  WV:'West Virginia', WI:'Wisconsin', WY:'Wyoming' };
var AGE_F = { under25: 1.6, a25to39: 1.0, a40to64: 0.9, senior: 1.1 };
var RECORD_F = { clean: 1.0, ticket: 1.15, accident: 1.30, dui: 1.80 };
var COV_F = { liability: 0.55, standard: 1.0, full: 1.45 };
var BASE_6MO = 800;

function vehFactor(v) {
  if (v < 10000) return 0.85;
  if (v < 25000) return 1.0;
  if (v < 50000) return 1.15;
  return 1.3;
}
document.addEventListener('DOMContentLoaded', function () {
  var stateSel = document.getElementById('peState');
  Object.keys(STATE_F).sort().forEach(function (abbr) {
    var o = document.createElement('option');
    o.value = abbr; o.textContent = STATE_NAMES[abbr];
    if (abbr === 'TX') o.selected = true;
    stateSel.appendChild(o);
  });
  var form = document.getElementById('peForm');
  var result = document.getElementById('peResult');
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = parseFloat(document.getElementById('peValue').value);
    v = (isNaN(v) || v < 0) ? 20000 : v;
    var est = BASE_6MO
      * (STATE_F[stateSel.value] || 1.0)
      * AGE_F[document.getElementById('peAge').value]
      * vehFactor(v)
      * RECORD_F[document.getElementById('peRecord').value]
      * COV_F[document.getElementById('peCoverage').value];
    var low = est * 0.85, high = est * 1.2;
    result.innerHTML = '<h2>Estimated 6-month premium</h2>'
      + '<p class="big">' + fmt(low) + ' \u2013 ' + fmt(high) + '</p>'
      + '<div class="table-wrap"><table><thead><tr><th>Estimate</th><th>Per 6 months</th><th>Per month</th></tr></thead><tbody>'
      + '<tr><td>Low</td><td>' + fmt(low) + '</td><td>' + fmt(low / 6) + '</td></tr>'
      + '<tr><td>Average</td><td>' + fmt(est) + '</td><td>' + fmt(est / 6) + '</td></tr>'
      + '<tr><td>High</td><td>' + fmt(high) + '</td><td>' + fmt(high / 6) + '</td></tr>'
      + '</tbody></table></div>'
      + '<p class="meta">Labeled estimate, not a quote. Your real premium depends on the insurer, exact vehicle, mileage, credit (where allowed), and underwriting.</p>';
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
"""

CC_JS = """'use strict';
/* Liability-only vs full coverage break-even.
   annualExtra = extra 6-month premium for full coverage x 2.
   paybackYears = vehicleValue / annualExtra  (years of extra premiums to equal the car's value). */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('ccForm');
  var result = document.getElementById('ccResult');
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = parseFloat(document.getElementById('ccValue').value);
    var extra = parseFloat(document.getElementById('ccExtra').value);
    v = (isNaN(v) || v < 0) ? 0 : v;
    extra = (isNaN(extra) || extra < 0) ? 0 : extra;
    var annualExtra = extra * 2;
    var fiveYr = annualExtra * 5;
    var payback = annualExtra > 0 ? v / annualExtra : Infinity;
    var verdict, cls = '';
    if (annualExtra <= 0) {
      verdict = 'Enter the extra amount full coverage costs per 6 months to see the break-even math.';
    } else if (payback <= 4) {
      verdict = 'Full coverage costs you the value of your car every <strong>' + payback.toFixed(1)
        + ' years</strong>. <strong>Consider liability-only</strong> and self-insuring \u2014 bank the savings instead.';
      cls = 'winner';
    } else if (payback >= 8) {
      verdict = 'It would take <strong>' + payback.toFixed(1)
        + ' years</strong> of extra premiums to equal your car\u2019s value. <strong>Keep full coverage</strong> \u2014 one accident could wipe out the car\u2019s worth.';
      cls = 'winner';
    } else {
      verdict = 'Break-even is <strong>' + payback.toFixed(1) + ' years</strong> \u2014 the <strong>borderline zone</strong>. '
        + 'Keep full coverage if you couldn\u2019t comfortably replace the car out of pocket; drop it if you have a solid emergency fund.';
    }
    result.innerHTML = '<h2>Break-even analysis</h2>'
      + '<div class="table-wrap"><table><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>'
      + '<tr><td>Vehicle value</td><td>' + fmt(v) + '</td></tr>'
      + '<tr><td>Extra cost of full coverage (annual)</td><td>' + fmt(annualExtra) + '</td></tr>'
      + '<tr class="' + cls + '"><td><strong>Break-even (years of premiums = car value)</strong></td><td><strong>'
      + (isFinite(payback) ? payback.toFixed(1) + ' years' : '\u2014') + '</strong></td></tr>'
      + '<tr><td>Extra premiums paid over 5 years</td><td>' + fmt(fiveYr) + '</td></tr>'
      + '</tbody></table></div>'
      + '<p><strong>Verdict:</strong> ' + verdict + '</p>'
      + '<p class="meta">Rule of thumb: when annual full-coverage surcharge exceeds ~10% of the car\u2019s value, liability-only usually wins. Estimates only.</p>';
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
"""

DF_JS = """'use strict';
/* Discount finder quiz: each discount has an estimated % saving off a $1,800/yr base premium. */
var DISCOUNTS = [
  { id: 'goodStudent', name: 'Good student discount', desc: 'B average or better (usually under 25)', pct: 10 },
  { id: 'bundle', name: 'Bundle home / renters', desc: 'Same insurer for auto + home or renters', pct: 15 },
  { id: 'telematics', name: 'Telematics / usage-based', desc: 'Safe driving tracked via app or plug-in device', pct: 20 },
  { id: 'lowMileage', name: 'Low-mileage discount', desc: 'Drive under ~7,500 miles per year', pct: 8 },
  { id: 'defensive', name: 'Defensive driving course', desc: 'State-approved course (great for 55+ and new drivers)', pct: 5 },
  { id: 'paidFull', name: 'Paid-in-full discount', desc: 'Pay the full 6-month premium upfront', pct: 7 },
  { id: 'paperless', name: 'Paperless + autopay', desc: 'E-statements with automatic payments', pct: 5 },
  { id: 'multiCar', name: 'Multi-car discount', desc: 'Insure 2 or more vehicles', pct: 12 },
  { id: 'loyalty', name: 'Loyalty discount', desc: '3\u20135+ years with the same insurer', pct: 5 }
];
var BASE_ANNUAL = 1800;
var CAP_PCT = 40;
document.addEventListener('DOMContentLoaded', function () {
  var box = document.getElementById('dfChecks');
  DISCOUNTS.forEach(function (d) {
    var label = document.createElement('label');
    label.className = 'check';
    label.innerHTML = '<input type="checkbox" id="df_' + d.id + '">'
      + '<span><strong>' + d.name + '</strong><span>' + d.desc + ' \u2014 est. ' + d.pct + '% off</span></span>';
    box.appendChild(label);
  });
  var form = document.getElementById('dfForm');
  var result = document.getElementById('dfResult');
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var qualified = DISCOUNTS.filter(function (d) {
      return document.getElementById('df_' + d.id).checked;
    });
    var totalPct = qualified.reduce(function (s, d) { return s + d.pct; }, 0);
    var capped = Math.min(totalPct, CAP_PCT);
    var savings = BASE_ANNUAL * capped / 100;
    var list = qualified.length
      ? '<ul>' + qualified.map(function (d) {
          return '<li><strong>' + d.name + '</strong> \u2014 est. ' + d.pct + '% off (' + d.desc + ')</li>';
        }).join('') + '</ul>'
      : '<p>No boxes checked \u2014 check every discount that applies to you, then run the quiz again.</p>';
    var capNote = totalPct > CAP_PCT
      ? '<p class="meta">Your discounts total ' + totalPct + '%, but insurers cap stacking \u2014 we applied a realistic ' + CAP_PCT + '% cap.</p>' : '';
    result.innerHTML = '<h2>Your discount results</h2>' + list
      + '<p class="big">' + capped + '% <span style="font-size:1rem;font-weight:400">est. total \u2248 ' + fmt(savings) + '/yr off a ' + fmt(BASE_ANNUAL) + ' premium</span></p>'
      + capNote
      + '<p class="meta">Estimated savings only \u2014 availability and exact percentages vary by insurer and state. Ask your agent to apply every discount you qualify for.</p>';
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
"""

TOOLS = [
    {
        "slug": "premium-estimator",
        "short": "Premium Estimator",
        "title": "Car Insurance Premium Estimator (2026)",
        "h1": "Car Insurance Premium Estimator",
        "desc": "Estimate your 6-month car insurance premium by state, age, vehicle value, driving record & coverage level. Labeled estimates.",
        "icon": "\U0001f4ca",
        "blurb": "Pick your state, age, car value, driving record and coverage level to see a realistic 6-month premium range.",
        "result_id": "peResult",
        "js": PREM_JS,
        "intro": "Car insurance pricing varies wildly by state, age, and driving history. This estimator multiplies a national base premium by the factors insurers actually use.",
        "form_html": """<form id="peForm">
  <div class="form-grid">
    <div class="field"><label for="peState">State</label><select id="peState"></select></div>
    <div class="field"><label for="peAge">Age group</label><select id="peAge"><option value="under25">Under 25</option><option value="a25to39" selected>25\u201339</option><option value="a40to64">40\u201364</option><option value="senior">65+</option></select></div>
    <div class="field"><label for="peValue">Vehicle value ($)</label><input type="number" id="peValue" min="0" step="500" value="20000"><p class="hint">Current market value of your car.</p></div>
    <div class="field"><label for="peRecord">Driving record</label><select id="peRecord"><option value="clean" selected>Clean record</option><option value="ticket">1 speeding ticket</option><option value="accident">At-fault accident</option><option value="dui">DUI</option></select></div>
    <div class="field"><label for="peCoverage">Coverage level</label><select id="peCoverage"><option value="liability">Liability only</option><option value="standard" selected>Standard</option><option value="full">Full coverage</option></select></div>
  </div>
  <button class="btn" type="submit">Estimate My Premium</button>
</form>""",
        "how": [
            ("h2", "How the estimate is calculated"),
            ("p", "We start from an <strong>$800 national base 6-month premium</strong> and multiply by five rating factors:"),
            ("ul", [
                "<strong>State</strong> (0.80\u20131.45): Michigan and Florida are the priciest; Vermont and Maine among the cheapest \u2014 reflecting repair costs, litigation, and weather risk.",
                "<strong>Age</strong>: under 25 pays 1.6\u00d7 (highest crash risk); 40\u201364 gets 0.9\u00d7; 65+ ticks up to 1.1\u00d7.",
                "<strong>Vehicle value</strong>: pricier cars cost more to repair/replace (0.85\u00d7\u20131.3\u00d7).",
                "<strong>Driving record</strong>: clean 1.0\u00d7, ticket 1.15\u00d7, at-fault accident 1.30\u00d7, DUI 1.80\u00d7.",
                "<strong>Coverage level</strong>: liability-only 0.55\u00d7, standard 1.0\u00d7, full coverage 1.45\u00d7.",
            ]),
            ("p", "The range shown is 85%\u2013120% of the central estimate, reflecting how much quotes vary between insurers for the same driver."),
            ("note", "Insurers also weigh mileage, credit-based insurance scores (where legal), and garaging ZIP code \u2014 so treat this as a planning estimate, then compare real quotes."),
        ],
    },
    {
        "slug": "coverage-comparator",
        "short": "Liability vs Full Coverage",
        "title": "Liability vs Full Coverage: Break-Even Tool",
        "h1": "Liability-Only vs Full Coverage: Break-Even Analysis",
        "desc": "Is full coverage worth it on your car? Enter vehicle value & premium difference to see the break-even math and a clear verdict.",
        "icon": "\u2696\ufe0f",
        "blurb": "Find out exactly when full coverage stops being worth it on an older car \u2014 with a break-even verdict.",
        "result_id": "ccResult",
        "js": CC_JS,
        "intro": "Full coverage on a $4,000 car can cost more than the car is worth within a few years. This tool finds your break-even point.",
        "form_html": """<form id="ccForm">
  <div class="form-grid">
    <div class="field"><label for="ccValue">Vehicle value ($)</label><input type="number" id="ccValue" min="0" step="500" value="6000"><p class="hint">What you could sell it for today.</p></div>
    <div class="field"><label for="ccExtra">Extra cost of full coverage ($ / 6 months)</label><input type="number" id="ccExtra" min="0" step="10" value="350"><p class="hint">Full-coverage quote MINUS liability-only quote.</p></div>
  </div>
  <button class="btn" type="submit">Run Break-Even Analysis</button>
</form>""",
        "how": [
            ("h2", "How the break-even math works"),
            ("p", "Full coverage = liability + <strong>collision</strong> (your car in an at-fault crash) + <strong>comprehensive</strong> (theft, hail, deer). The question is whether the extra premium is worth the protection on <em>your</em> car's value."),
            ("ul", [
                "<strong>Annual extra cost</strong> = extra 6-month premium \u00d7 2.",
                "<strong>Break-even years</strong> = vehicle value \u00f7 annual extra cost \u2014 how fast you'd pay the car's full value in extra premiums.",
                "<strong>\u2264 4 years \u2192</strong> liability-only usually wins; bank the savings as a self-insurance fund.",
                "<strong>\u2265 8 years \u2192</strong> keep full coverage; one loss wipes out years of savings.",
                "<strong>4\u20138 years \u2192</strong> borderline: decide by whether you could replace the car from savings.",
            ]),
            ("note", "Also consider raising your collision deductible (e.g., $500 \u2192 $1,000) as a middle path \u2014 it cuts the surcharge while keeping catastrophe protection."),
        ],
    },
    {
        "slug": "discount-finder",
        "short": "Discount Finder Quiz",
        "title": "Car Insurance Discount Finder Quiz (2026)",
        "h1": "Car Insurance Discount Finder Quiz",
        "desc": "Check the discounts you qualify for \u2014 good student, bundling, telematics, low mileage & more \u2014 with estimated yearly savings.",
        "icon": "\U0001f3af",
        "blurb": "Answer 9 quick questions to uncover every discount you likely qualify for \u2014 and your estimated yearly savings.",
        "result_id": "dfResult",
        "js": DF_JS,
        "intro": "Drivers leave hundreds on the table by never asking about discounts. Check everything that applies \u2014 most take one phone call to activate.",
        "form_html": """<form id="dfForm">
  <div class="checks" id="dfChecks"></div>
  <button class="btn" type="submit">Find My Discounts</button>
</form>""",
        "how": [
            ("h2", "How the savings are estimated"),
            ("p", "Each discount carries an <strong>estimated percentage off</strong> a $1,800/year base premium (near the national average for full coverage): bundling ~15%, telematics up to ~20%, good student ~10%, multi-car ~12%, and smaller 3\u20138% discounts for paperless, paid-in-full, low mileage, defensive driving, and loyalty."),
            ("p", "Because insurers cap how discounts stack, we apply a realistic <strong>40% total cap</strong> \u2014 even if your checked discounts sum higher."),
            ("note", "Discount names and values vary by insurer and state. Use your results as a checklist when you call your agent \u2014 \"Am I getting the ___ discount?\" is the highest-ROI sentence in insurance."),
        ],
    },
]

GUIDES = [
    {
        "slug": "cheapest-car-insurance",
        "short": "Cheapest by State Guide",
        "title": "Cheapest Car Insurance by State \u2014 2026 Guide",
        "h1": "Cheapest Car Insurance by State: 2026 Guide",
        "desc": "Which states have the cheapest car insurance in 2026? Sample state averages, why prices differ, and how to pay less wherever you live.",
        "date": "2026-10-12", "read": "7",
        "cta_tool": 0,
        "body": [
            ("lead", "Where you live swings your car insurance bill more than almost anything else \u2014 the gap between the cheapest and priciest states is over 3\u00d7. Here's the 2026 landscape."),
            ("h2", "Sample average annual full-coverage premiums (2026 estimates)"),
            ("p", "Illustrative estimates to show the spread \u2014 your quote will differ:"),
            ("table", ["Cheapest states", "Est. annual", "Priciest states", "Est. annual"],
             [["Vermont", "$1,050", "Michigan", "$3,400"],
              ["Maine", "$1,080", "Florida", "$3,100"],
              ["Idaho", "$1,120", "New York", "$2,950"],
              ["Iowa", "$1,150", "Louisiana", "$2,900"],
              ["Ohio", "$1,180", "New Jersey", "$2,800"]]),
            ("h2", "Why your state matters so much"),
            ("ul", [
                "<strong>No-fault & litigation:</strong> Michigan's unlimited injury benefits and Florida's fraud/litigation rates push premiums sky-high.",
                "<strong>Weather:</strong> hail in Texas, hurricanes in Florida/Louisiana, and deer in the Midwest all show up in comprehensive claims.",
                "<strong>Repair costs & theft:</strong> dense cities mean pricier labor and more theft \u2014 urban ZIP codes pay more than rural ones in the same state.",
                "<strong>State rules:</strong> some states ban credit-based pricing or tightly regulate rates, compressing the range.",
            ]),
            ("h2", "How to pay less in ANY state"),
            ("ol", [
                "<strong>Compare 5+ quotes every renewal.</strong> Insurers weight factors differently \u2014 the cheapest company for your neighbor may be the priciest for you.",
                "<strong>Raise deductibles</strong> to $1,000 if you have an emergency fund; it can cut collision/comprehensive 15\u201330%.",
                "<strong>Claim every discount</strong> \u2014 run our <a href=\"../tools/discount-finder.html\">discount finder quiz</a> before you call.",
                "<strong>Right-size coverage</strong> on older cars with our <a href=\"../tools/coverage-comparator.html\">liability vs full coverage tool</a>.",
                "<strong>Try telematics</strong> if you're a careful driver \u2014 safe drivers routinely save 15\u201325%.",
            ]),
            ("note", "Moving soon? Get quotes for the new ZIP <em>before</em> you move \u2014 a 20-mile move can change your premium by hundreds per year."),
        ],
    },
    {
        "slug": "how-much-car-insurance",
        "short": "How Much Coverage Guide",
        "title": "How Much Car Insurance Do I Need?",
        "h1": "How Much Car Insurance Do I Need?",
        "desc": "State minimums vs recommended coverage: liability limits, when you need full coverage, and the 100/300/100 rule explained simply.",
        "date": "2026-10-12", "read": "7",
        "cta_tool": 1,
        "body": [
            ("lead", "State minimums are legal minimums \u2014 not adequate protection. Here's how to pick limits that actually protect your assets."),
            ("h2", "Start with the numbers: 100/300/100"),
            ("p", "The widely recommended baseline is <strong>100/300/100</strong>: $100k bodily injury per person, $300k per accident, $100k property damage. State minimums (often 25/50/25 or lower) can be exhausted by a single ER visit \u2014 after that, <em>your</em> assets pay the rest."),
            ("h2", "Liability: buy more than the minimum"),
            ("p", "One serious at-fault accident can easily cause $200k+ in medical bills across multiple people. If your net worth (home equity, savings, future wages) exceeds your limits, you're exposed. Match liability limits to what you have to protect."),
            ("h2", "When do you need full coverage?"),
            ("ul", [
                "<strong>Loan or lease:</strong> lenders require collision + comprehensive \u2014 non-negotiable.",
                "<strong>Car worth $8k+:</strong> full coverage usually still pencils out.",
                "<strong>Car under ~$4k:</strong> run our <a href=\"../tools/coverage-comparator.html\">break-even tool</a> \u2014 liability-only plus a repair fund often wins.",
            ]),
            ("h2", "Don't forget uninsured motorist coverage"),
            ("p", "About 1 in 8 US drivers is uninsured. <strong>Uninsured/underinsured motorist (UM/UIM)</strong> coverage is cheap and protects <em>you</em> when the at-fault driver can't pay. Match it to your liability limits."),
            ("h2", "Consider an umbrella policy"),
            ("p", "If you have significant assets, a $1M <strong>umbrella policy</strong> typically costs just $150\u2013$350/year and kicks in when auto (or home) liability limits run out. It's the cheapest asset protection in insurance."),
            ("note", "Review limits yearly: a raise, a new home, or a growing family all raise the amount worth protecting."),
        ],
    },
    {
        "slug": "car-insurance-discounts",
        "short": "Discounts Guide",
        "title": "15 Car Insurance Discounts You Should Claim",
        "h1": "15 Car Insurance Discounts You Should Claim in 2026",
        "desc": "The complete list of car insurance discounts \u2014 bundling, telematics, good student, low mileage & 11 more \u2014 with typical savings for each.",
        "date": "2026-10-12", "read": "8",
        "cta_tool": 2,
        "body": [
            ("lead", "Insurers rarely volunteer discounts \u2014 you have to ask. Here are 15 worth claiming, with typical savings. First, run our <a href=\"../tools/discount-finder.html\">discount finder quiz</a> to see which ones fit you."),
            ("h2", "The big three (10\u201325% each)"),
            ("ul", [
                "<strong>1. Bundling (up to ~25%):</strong> auto + home or renters with one insurer. The single biggest easy win.",
                "<strong>2. Telematics / usage-based (up to ~25%):</strong> an app or device scores your driving; safe drivers save big.",
                "<strong>3. Good student (up to ~15%):</strong> B average or better, usually under age 25.",
            ]),
            ("h2", "Vehicle & policy discounts"),
            ("ul", [
                "<strong>4. Multi-car (~12%):</strong> insuring 2+ vehicles together.",
                "<strong>5. Paid-in-full (~7%):</strong> pay the 6-month term upfront instead of monthly.",
                "<strong>6. Paperless + autopay (~5%):</strong> e-billing with automatic payments.",
                "<strong>7. New car (~10%):</strong> some insurers discount vehicles under 3 years old.",
                "<strong>8. Safety features (~5%):</strong> anti-lock brakes, airbags, anti-theft systems.",
                "<strong>9. Green vehicle (~5%):</strong> hybrid/EV discounts at several major insurers.",
            ]),
            ("h2", "Driver-profile discounts"),
            ("ul", [
                "<strong>10. Low mileage (~8%):</strong> under ~7,500 miles/year.",
                "<strong>11. Defensive driving course (~5%):</strong> state-approved courses; required for some senior discounts.",
                "<strong>12. Loyalty (~5%):</strong> 3\u20135+ years with the same company.",
                "<strong>13. Good driver / accident-free (~10\u201320%):</strong> clean record for 3\u20135 years.",
                "<strong>14. Affinity groups (~5%):</strong> alumni, professional, or employer associations.",
                "<strong>15. Military (~5\u201315%):</strong> active duty, veterans, and families at military-focused insurers.",
            ]),
            ("note", "Stacking is capped \u2014 insurers limit combined discounts (often ~25\u201340%). Prioritize the big three first, then layer the easy 3\u20138% wins like paperless and autopay."),
        ],
    },
]

BLOG = [
    {
        "slug": "why-rates-up-2026",
        "short": "Why Rates Rose",
        "title": "Why Did My Car Insurance Go Up in 2026?",
        "h1": "Why Did My Car Insurance Go Up in 2026?",
        "desc": "Clean record but higher premium? The 5 real reasons car insurance keeps rising \u2014 and 6 proven ways to bring your bill back down.",
        "date": "2026-10-12", "read": "6",
        "cta_tool": 0,
        "body": [
            ("lead", "Your driving didn't change \u2014 but your premium did. You're not imagining it: US auto premiums have risen sharply, and the causes have little to do with you personally."),
            ("h2", "The 5 real reasons"),
            ("ol", [
                "<strong>Repair costs exploded.</strong> Bumpers now hide radar sensors and cameras; a simple fender-bender can cost $3,000\u2013$5,000. EVs and ADAS-equipped cars cost even more to fix.",
                "<strong>Medical & litigation costs rose.</strong> Bodily injury claims are bigger, and attorney involvement in claims keeps climbing.",
                "<strong>More severe accidents.</strong> Distracted driving and higher speeds raised claim severity even as cars got safer.",
                "<strong>Catastrophe losses.</strong> Hail, floods, and wildfires hammered comprehensive claims in many states.",
                "<strong>Insurers are catching up.</strong> Several years of underwriting losses forced double-digit rate filings \u2014 regulators approve them in batches, so increases arrive in waves.",
            ]),
            ("h2", "6 ways to fight back"),
            ("ol", [
                "Shop 5+ insurers \u2014 rate increases hit companies unevenly; someone is always cheaper for your profile.",
                "Raise collision/comprehensive deductibles to $1,000.",
                "Enroll in telematics if you drive carefully.",
                "Audit your discounts with our <a href=\"../tools/discount-finder.html\">discount finder</a>.",
                "Drop full coverage on low-value cars (check the <a href=\"../tools/coverage-comparator.html\">break-even tool</a>).",
                "Improve your credit-based insurance score where it's used \u2014 on-time payments matter.",
            ]),
            ("note", "Never just accept a renewal increase. A 15-minute comparison shop is the highest-paid quarter-hour in personal finance."),
        ],
    },
    {
        "slug": "telematics-worth-it",
        "short": "Telematics Guide",
        "title": "Telematics Insurance: Is It Worth It?",
        "h1": "Telematics Insurance: Is It Worth It?",
        "desc": "Usage-based insurance promises up to 25% off for safe driving. How telematics works, what it tracks, the privacy trade-offs, and who should enroll.",
        "date": "2026-10-12", "read": "6",
        "cta_tool": 2,
        "body": [
            ("lead", "<strong>Telematics</strong> (usage-based insurance) tracks how you actually drive \u2014 then prices your policy on it. Safe drivers can save 15\u201325%. But is the trade-off worth it?"),
            ("h2", "How it works"),
            ("p", "You install an app or plug a small device into your car's OBD-II port for a monitoring period (typically 3\u20136 months, sometimes ongoing). It scores braking, acceleration, cornering, speed, phone use, and time of day. Good scores earn discounts; most programs promise your rate won't rise from the data \u2014 only the discount varies."),
            ("h2", "What it actually tracks"),
            ("ul", [
                "Hard braking and rapid acceleration events.",
                "Late-night driving (midnight\u20134am is highest risk).",
                "Mileage and trip patterns.",
                "Phone handling while driving (app-based programs).",
            ]),
            ("h2", "Who should enroll"),
            ("ul", [
                "<strong>Low-mileage, smooth drivers:</strong> the ideal profile \u2014 biggest discounts.",
                "<strong>Young drivers:</strong> telematics can undercut the brutal under-25 surcharge faster than waiting to age out of it.",
                "<strong>Second cars</strong> that sit in the garage most days.",
            ]),
            ("h2", "Who should skip it"),
            ("ul", [
                "Night-shift workers or frequent late-night drivers (scored as high risk).",
                "Aggressive brakers in stop-and-go commute traffic.",
                "Anyone uncomfortable with location and driving data on insurer servers \u2014 read the privacy policy first.",
            ]),
            ("note", "Most programs give a small participation discount (5\u201310%) just for enrolling, with the full safe-driver discount after the monitoring period. If your score disappoints, you can usually opt out at renewal."),
        ],
    },
]

FAQS = [
    ("How much is car insurance per month in 2026?",
     "The national average is roughly $190/month for full coverage and about $65/month for liability-only \u2014 but your state, age, car, and record move that number dramatically. Use our free premium estimator for your profile."),
    ("What is the cheapest car insurance company?",
     "There's no universal cheapest \u2014 Geico, Progressive, State Farm, and USAA frequently rank cheapest, but the winner depends on your age, state, and record. Comparing 5+ quotes beats any brand recommendation."),
    ("How much car insurance do I need?",
     "At minimum, your state's legal requirement \u2014 but experts recommend 100/300/100 liability limits ($100k per person, $300k per accident, $100k property). Add full coverage if you have a loan or a car worth $8k+."),
    ("Does a speeding ticket raise insurance rates?",
     "Yes \u2014 typically 15\u201325% for about 3 years. An at-fault accident raises rates ~30%, and a DUI can raise them ~80% or get you non-renewed. Some insurers offer accident/ticket forgiveness programs."),
    ("Can I switch car insurance at any time?",
     "Yes. There's no penalty for switching mid-policy \u2014 you'll get a prorated refund of unused premium. Just have the new policy active before canceling the old one so there's no coverage gap."),
    ("What discounts lower car insurance the most?",
     "Bundling home + auto (up to ~25%), telematics/usage-based programs (up to ~25%), and good-student discounts (up to ~15%) are the biggest. Run our discount finder quiz to see everything you qualify for."),
]


def main():
    build_site(SITE, TOOLS, GUIDES, BLOG, FAQS, COPY)


if __name__ == "__main__":
    main()
