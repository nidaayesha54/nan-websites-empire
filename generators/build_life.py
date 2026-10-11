"""Build Site 1: LifeInsuranceHub -> ~/workspace/free-sites/life-insurance-hub/"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sitegen import build_site

SITE = {
    "dir": os.path.expanduser("~/workspace/free-sites/life-insurance-hub"),
    "name": "LifeInsuranceHub",
    "mark": "\U0001f6e1\ufe0f",
    "base": "https://nan-lifeinsurance.surge.sh",
    "index_title": "LifeInsuranceHub: Free Life Insurance Calculators",
    "index_desc": "Free DIME needs calculator, term vs whole cost tool & premium estimator, plus plain-English 2026 guides. Educational only.",
    "theme": {"primary": "#123a7a", "primary_dark": "#0b2554", "accent": "#c9962e", "accent_soft": "#fdf3dd"},
}

COPY = {
    "h1": "Free Life Insurance Calculators & 2026 Guides",
    "hero_sub": "Figure out exactly how much coverage you need, compare term vs whole life costs, and estimate your premium \u2014 free, no signup, no sales calls.",
    "tools_h2": "Life Insurance Calculators",
    "tools_sub": "Interactive tools that do the math for you. All results are estimates for education, not quotes.",
    "guides_h2": "2026 Life Insurance Guides",
    "guides_sub": "Plain-English explainers written for real people, not insurance agents.",
    "blog_h2": "From the Blog",
    "blog_sub": "Practical tips on policies, riders, and saving money on coverage.",
}

LIFE_NEEDS_JS = """'use strict';
/* DIME method: coverage = Debts + Income*years + Mortgage + Education - Assets */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('dimeForm');
  var result = document.getElementById('dimeResult');
  function num(id) {
    var v = parseFloat(document.getElementById(id).value);
    return (isNaN(v) || v < 0) ? 0 : v;
  }
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var debts = num('debts');
    var income = num('income');
    var years = num('years');
    var mortgage = num('mortgage');
    var education = num('education');
    var assets = num('assets');
    var incomeNeed = income * years;
    var gross = debts + incomeNeed + mortgage + education;
    var coverage = Math.max(0, gross - assets);
    var html = '<h2>Your estimated coverage need</h2>'
      + '<p class="big">' + fmt(coverage) + '</p>'
      + '<div class="table-wrap"><table><thead><tr><th>DIME component</th><th>Amount</th></tr></thead><tbody>'
      + '<tr><td><strong>D</strong>ebts</td><td>' + fmt(debts) + '</td></tr>'
      + '<tr><td><strong>I</strong>ncome replacement (' + fmt(income) + ' \u00d7 ' + years + ' yrs)</td><td>' + fmt(incomeNeed) + '</td></tr>'
      + '<tr><td><strong>M</strong>ortgage balance</td><td>' + fmt(mortgage) + '</td></tr>'
      + '<tr><td><strong>E</strong>ducation costs</td><td>' + fmt(education) + '</td></tr>'
      + '<tr><td>Minus existing assets &amp; coverage</td><td>\u2212' + fmt(assets) + '</td></tr>'
      + '<tr><td><strong>Total coverage needed</strong></td><td><strong>' + fmt(coverage) + '</strong></td></tr>'
      + '</tbody></table></div>'
      + '<p class="meta">Estimate only \u2014 round up to the nearest $50k\u2013$100k when shopping, since policies come in standard face amounts.</p>';
    result.innerHTML = html;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
"""

TERM_WHOLE_JS = """'use strict';
/* Term vs whole life 30-year cost comparison.
   termRatePer1k = estimated ANNUAL term premium per $1,000 of coverage (healthy non-smoker).
   Whole life estimated at ~11x the term annual premium (industry rule of thumb: 10-15x). */
var TERM_RATE_PER_1K = { '20s': 0.60, '30s': 0.75, '40s': 1.50, '50s': 3.60, '60s': 9.00 };
var WHOLE_MULT = 11;

function ageGroup(age) {
  if (age < 30) return '20s';
  if (age < 40) return '30s';
  if (age < 50) return '40s';
  if (age < 60) return '50s';
  return '60s';
}
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('twForm');
  var result = document.getElementById('twResult');
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var age = Math.max(18, Math.min(75, parseInt(document.getElementById('twAge').value, 10) || 35));
    var coverage = parseFloat(document.getElementById('twCoverage').value) || 500000;
    var termYears = parseInt(document.getElementById('twTerm').value, 10) || 20;
    var rate = TERM_RATE_PER_1K[ageGroup(age)];
    var termAnnual = (coverage / 1000) * rate;
    var wholeAnnual = termAnnual * WHOLE_MULT;
    var termTotal = termAnnual * termYears;
    var wholeTotal = wholeAnnual * 30;
    var ratio = termTotal > 0 ? wholeTotal / termTotal : 0;
    var verdict;
    if (termYears < 30) {
      verdict = 'For <strong>' + termYears + ' years of coverage</strong>, term costs about <strong>' + fmt(termTotal)
        + '</strong> total vs <strong>' + fmt(wholeTotal) + '</strong> for 30 years of whole life \u2014 roughly <strong>'
        + ratio.toFixed(1) + '\u00d7 cheaper</strong>. Term wins on price; whole life wins on permanence (it never expires and builds cash value).';
    } else {
      verdict = 'Even over a full 30 years, term totals about <strong>' + fmt(termTotal) + '</strong> vs <strong>'
        + fmt(wholeTotal) + '</strong> for whole life \u2014 roughly <strong>' + ratio.toFixed(1)
        + '\u00d7 cheaper</strong>. Choose whole life only if you specifically want lifelong coverage plus a cash-value component.';
    }
    result.innerHTML = '<h2>30-year cost comparison (estimates)</h2>'
      + '<div class="table-wrap"><table><thead><tr><th>Policy type</th><th>Est. annual premium</th><th>Years covered</th><th>Est. 30-yr total</th></tr></thead><tbody>'
      + '<tr><td><strong>Term life</strong> (' + termYears + '-yr)</td><td>' + fmt(termAnnual) + '/yr</td><td>' + termYears + '</td><td>' + fmt(termTotal) + '</td></tr>'
      + '<tr><td><strong>Whole life</strong></td><td>' + fmt(wholeAnnual) + '/yr</td><td>Permanent</td><td>' + fmt(wholeTotal) + '</td></tr>'
      + '</tbody></table></div>'
      + '<p><strong>Verdict:</strong> ' + verdict + '</p>'
      + '<p class="meta">Estimates for a healthy non-smoker; actual premiums vary by insurer, health class, and state. Term premiums shown assume level premiums for the full term length.</p>';
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
"""

QUOTE_JS = """'use strict';
/* Monthly premium range estimator: base monthly rate per $100k by age band,
   adjusted by smoker, health class and term length multipliers. */
var BASE_MONTHLY_PER_100K = { '20s': 12, '30s': 15, '40s': 25, '50s': 45, '60s': 85 };
var SMOKER_F = { no: 1.0, yes: 2.2 };
var HEALTH_F = { preferred: 0.9, standard: 1.0, substandard: 1.4 };
var TERM_F = { '10': 0.7, '20': 1.0, '30': 1.35 };

function ageGroup(age) {
  if (age < 30) return '20s';
  if (age < 40) return '30s';
  if (age < 50) return '40s';
  if (age < 60) return '50s';
  return '60s';
}
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('qForm');
  var result = document.getElementById('qResult');
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var age = Math.max(18, Math.min(75, parseInt(document.getElementById('qAge').value, 10) || 35));
    var coverage = parseFloat(document.getElementById('qCoverage').value) || 250000;
    var avg = BASE_MONTHLY_PER_100K[ageGroup(age)]
      * (coverage / 100000)
      * SMOKER_F[document.getElementById('qSmoker').value]
      * HEALTH_F[document.getElementById('qHealth').value]
      * TERM_F[document.getElementById('qTerm').value];
    var low = avg * 0.8, high = avg * 1.25;
    result.innerHTML = '<h2>Estimated monthly premium range</h2>'
      + '<p class="big">' + fmt(low) + ' \u2013 ' + fmt(high) + '<span style="font-size:1rem;font-weight:400">/mo</span></p>'
      + '<div class="table-wrap"><table><thead><tr><th>Estimate</th><th>Monthly</th><th>Annual</th></tr></thead><tbody>'
      + '<tr><td>Low</td><td>' + fmt(low) + '</td><td>' + fmt(low * 12) + '</td></tr>'
      + '<tr><td>Average</td><td>' + fmt(avg) + '</td><td>' + fmt(avg * 12) + '</td></tr>'
      + '<tr><td>High</td><td>' + fmt(high) + '</td><td>' + fmt(high * 12) + '</td></tr>'
      + '</tbody></table></div>'
      + '<p class="meta">Labeled estimates, not quotes. Real premiums depend on the insurer, your exact health profile, state, and underwriting.</p>';
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
"""

TOOLS = [
    {
        "slug": "life-needs",
        "short": "DIME Needs Calculator",
        "title": "DIME Life Insurance Needs Calculator (2026)",
        "h1": "DIME Life Insurance Needs Calculator",
        "desc": "Free DIME calculator: add debts, income replacement, mortgage & education, subtract assets. Get your coverage need in 60 seconds.",
        "icon": "\U0001f4ca",
        "blurb": "Use the DIME method (Debts, Income, Mortgage, Education) to find exactly how much life insurance your family needs.",
        "result_id": "dimeResult",
        "js": LIFE_NEEDS_JS,
        "intro": "The DIME method is the financial-planning standard for sizing life insurance: add up what your family would owe and need, then subtract what you already have.",
        "form_html": """<form id="dimeForm">
  <div class="form-grid">
    <div class="field"><label for="debts">Debts (D)</label><input type="number" id="debts" min="0" step="1000" value="20000"><p class="hint">Credit cards, car loans, personal loans.</p></div>
    <div class="field"><label for="income">Annual income (I)</label><input type="number" id="income" min="0" step="1000" value="80000"><p class="hint">Income your family would lose.</p></div>
    <div class="field"><label for="years">Years of income to replace</label><input type="number" id="years" min="0" max="50" value="15"><p class="hint">Until kids are grown / mortgage paid.</p></div>
    <div class="field"><label for="mortgage">Mortgage balance (M)</label><input type="number" id="mortgage" min="0" step="1000" value="250000"></div>
    <div class="field"><label for="education">Future education costs (E)</label><input type="number" id="education" min="0" step="1000" value="100000"><p class="hint">College funds, etc.</p></div>
    <div class="field"><label for="assets">Existing assets &amp; coverage</label><input type="number" id="assets" min="0" step="1000" value="50000"><p class="hint">Savings, investments, current policies.</p></div>
  </div>
  <button class="btn" type="submit">Calculate My Coverage</button>
</form>""",
        "how": [
            ("h2", "How the DIME formula works"),
            ("p", "Coverage needed = <strong>Debts</strong> + (<strong>Income</strong> \u00d7 <strong>years</strong>) + <strong>Mortgage</strong> + <strong>Education</strong> \u2212 <strong>existing assets</strong>. Each letter is one thing your family would need money for if your income stopped tomorrow."),
            ("ul", [
                "<strong>D \u2014 Debts:</strong> everything you owe besides the mortgage: credit cards, auto loans, student loans.",
                "<strong>I \u2014 Income:</strong> your annual income times the number of years your family needs support (often 10\u201320, roughly until kids are independent).",
                "<strong>M \u2014 Mortgage:</strong> the remaining balance, so your family can stay in the home.",
                "<strong>E \u2014 Education:</strong> future college or schooling costs for your children.",
            ]),
            ("p", "Then subtract liquid assets and any life insurance you already own \u2014 that money already covers part of the need."),
            ("note", "DIME tends to give a thorough number. A quicker rule of thumb is 10\u201312\u00d7 your annual income; DIME is more personalized. Round your result <em>up</em> to the nearest standard face amount ($250k, $500k, $1M)."),
        ],
    },
    {
        "slug": "term-vs-whole",
        "short": "Term vs Whole Cost Tool",
        "title": "Term vs Whole Life Insurance: 30-Year Cost Tool",
        "h1": "Term vs Whole Life: 30-Year Cost Comparison",
        "desc": "Compare 30-year total costs of term vs whole life insurance by age and coverage. See the real price gap with a clear verdict.",
        "icon": "\u2696\ufe0f",
        "blurb": "Enter your age and coverage to see side-by-side 30-year total costs for term vs whole life \u2014 and which one actually makes sense.",
        "result_id": "twResult",
        "js": TERM_WHOLE_JS,
        "intro": "Whole life can cost 10\u201315\u00d7 more than term. This tool puts real estimated numbers on that gap over 30 years so you can decide with math, not marketing.",
        "form_html": """<form id="twForm">
  <div class="form-grid">
    <div class="field"><label for="twAge">Your age</label><input type="number" id="twAge" min="18" max="75" value="35"></div>
    <div class="field"><label for="twCoverage">Coverage amount</label><select id="twCoverage"><option value="100000">$100,000</option><option value="250000">$250,000</option><option value="500000" selected>$500,000</option><option value="1000000">$1,000,000</option></select></div>
    <div class="field"><label for="twTerm">Term length to compare</label><select id="twTerm"><option value="10">10-year term</option><option value="20" selected>20-year term</option><option value="30">30-year term</option></select></div>
  </div>
  <button class="btn" type="submit">Compare Costs</button>
</form>""",
        "how": [
            ("h2", "How the comparison is calculated"),
            ("p", "We estimate a healthy non-smoker's <strong>annual term premium per $1,000 of coverage</strong> by age band (roughly $0.60 in your 20s, $0.75 in your 30s, $1.50 in your 40s, $3.60 in your 50s, $9.00 in your 60s), multiply by your coverage, then project over 30 years. Whole life is estimated at <strong>11\u00d7 the term annual premium</strong> \u2014 the industry rule of thumb is 10\u201315\u00d7."),
            ("ul", [
                "<strong>Term total</strong> = annual term premium \u00d7 term length (you only pay while covered).",
                "<strong>Whole life total</strong> = annual whole premium \u00d7 30 (it never expires and builds cash value).",
                "The verdict divides the two totals to show the true price multiple.",
            ]),
            ("note", "Term looks dramatically cheaper because it covers a limited window. If you outlive the term and still need coverage, a new policy at an older age costs far more \u2014 factor that into long-term planning."),
        ],
    },
    {
        "slug": "quote-estimator",
        "short": "Premium Quote Estimator",
        "title": "Life Insurance Quote Estimator by Age (2026)",
        "h1": "Life Insurance Premium Estimator",
        "desc": "Estimate monthly term life premiums by age, smoker status, health class & term length. Low/average/high ranges in seconds.",
        "icon": "\U0001f4b2",
        "blurb": "Pick your age, health class, and term length to see a realistic low\u2013average\u2013high monthly premium range.",
        "result_id": "qResult",
        "js": QUOTE_JS,
        "intro": "Life insurance pricing follows predictable patterns: age is the biggest driver, then smoking, health class, and term length. This estimator applies those multipliers to give you a realistic range.",
        "form_html": """<form id="qForm">
  <div class="form-grid">
    <div class="field"><label for="qAge">Your age</label><input type="number" id="qAge" min="18" max="75" value="35"></div>
    <div class="field"><label for="qCoverage">Coverage amount</label><select id="qCoverage"><option value="100000">$100,000</option><option value="250000" selected>$250,000</option><option value="500000">$500,000</option><option value="1000000">$1,000,000</option></select></div>
    <div class="field"><label for="qSmoker">Tobacco use</label><select id="qSmoker"><option value="no" selected>Non-smoker</option><option value="yes">Smoker / tobacco user</option></select></div>
    <div class="field"><label for="qHealth">Health class</label><select id="qHealth"><option value="preferred" selected>Preferred (excellent health)</option><option value="standard">Standard (average health)</option><option value="substandard">Substandard (health issues)</option></select></div>
    <div class="field"><label for="qTerm">Term length</label><select id="qTerm"><option value="10">10 years</option><option value="20" selected>20 years</option><option value="30">30 years</option></select></div>
  </div>
  <button class="btn" type="submit">Estimate My Premium</button>
</form>""",
        "how": [
            ("h2", "How the estimate is calculated"),
            ("p", "We start from a <strong>base monthly rate per $100,000 of coverage</strong> by age band ($12 in your 20s, $15 in your 30s, $25 in your 40s, $45 in your 50s, $85 in your 60s for healthy non-smokers), then apply multipliers:"),
            ("ul", [
                "<strong>Tobacco:</strong> smokers pay roughly 2.2\u00d7 more.",
                "<strong>Health class:</strong> preferred \u00d7 0.9, standard \u00d7 1.0, substandard \u00d7 1.4.",
                "<strong>Term length:</strong> 10-yr \u00d7 0.7, 20-yr \u00d7 1.0, 30-yr \u00d7 1.35.",
                "The low estimate is 80% and the high estimate 125% of the average, reflecting insurer price spread.",
            ]),
            ("note", "These are educational estimates, not quotes. Final premiums depend on underwriting: labs, medical history, family history, and lifestyle."),
        ],
    },
]

GUIDES = [
    {
        "slug": "how-much-life-insurance",
        "short": "How Much Coverage Guide",
        "title": "How Much Life Insurance Do I Need? (2026 Guide)",
        "h1": "How Much Life Insurance Do I Need in 2026?",
        "desc": "A simple 2026 framework for sizing life insurance: the DIME method, the 10x rule, common mistakes, and when to revisit your coverage.",
        "date": "2026-10-12", "read": "7",
        "cta_tool": 0,
        "body": [
            ("lead", "Most people either buy far too little life insurance or put off the decision entirely because the math feels intimidating. It isn't. Here is the exact framework financial planners use \u2014 and it takes about ten minutes."),
            ("h2", "The short answer"),
            ("p", "A common rule of thumb is <strong>10\u201312 times your annual income</strong>, plus your mortgage balance. If you earn $80,000 and owe $250,000 on your home, that's roughly $1\u2013$1.2 million in coverage. It's a decent starting point, but it ignores debts, education costs, and assets you already have."),
            ("h2", "The DIME method (the thorough way)"),
            ("p", "Financial planners prefer the <strong>DIME method</strong>: add up <strong>D</strong>ebts, <strong>I</strong>ncome replacement (annual income \u00d7 years your family needs support), <strong>M</strong>ortgage balance, and <strong>E</strong>ducation costs \u2014 then subtract existing assets and coverage. Our <a href=\"../tools/life-needs.html\">DIME life insurance calculator</a> runs this for you in under a minute."),
            ("ul", [
                "<strong>Debts:</strong> credit cards, car loans, student loans \u2014 everything except the mortgage.",
                "<strong>Income:</strong> multiply your salary by 10\u201320 years (until kids are independent or the mortgage is gone).",
                "<strong>Mortgage:</strong> the full remaining balance so your family can keep the home.",
                "<strong>Education:</strong> projected college costs per child.",
            ]),
            ("h2", "Three mistakes that leave families underinsured"),
            ("ol", [
                "<strong>Only covering the mortgage.</strong> The house is paid off but there's no income replacement \u2014 the most common gap.",
                "<strong>Forgetting the stay-at-home parent.</strong> Childcare, cooking, and household management would cost $50k+/year to replace.",
                "<strong>Never updating the policy.</strong> A $250k policy bought at 28 rarely fits life at 38 with two kids and a bigger mortgage.",
            ]),
            ("h2", "When to revisit your number"),
            ("p", "Recalculate after every major life event: marriage, a new child, buying a home, a big raise (or job loss), and divorce. Term life is cheap enough that layering a second policy later is usually smarter than guessing perfectly today."),
            ("note", "Round <em>up</em> to the nearest standard face amount \u2014 policies are sold in round figures like $250k, $500k, and $1M, and the price difference between bands is often tiny."),
        ],
    },
    {
        "slug": "term-vs-whole-life",
        "short": "Term vs Whole Guide",
        "title": "Term vs Whole Life Insurance: Pros, Cons & Costs",
        "h1": "Term vs Whole Life Insurance: Which Is Right for You?",
        "desc": "Term vs whole life explained: how each works, the real 30-year cost gap, and who should choose which. Includes a free cost comparison tool.",
        "date": "2026-10-12", "read": "8",
        "cta_tool": 1,
        "body": [
            ("lead", "This is the most-searched life insurance question in America, and agents have a financial incentive to push you toward the expensive answer. Here's the honest breakdown."),
            ("h2", "Term life in 30 seconds"),
            ("p", "<strong>Term life</strong> covers you for a set period \u2014 10, 20, or 30 years. If you die during the term, your beneficiaries get the payout. If you outlive it, coverage ends and you paid for peace of mind. It's pure protection, no savings component, and it's <strong>cheap</strong>: a healthy 30-year-old can get $500k for roughly $25\u2013$35/month."),
            ("h2", "Whole life in 30 seconds"),
            ("p", "<strong>Whole life</strong> covers you for your entire life and builds <strong>cash value</strong> you can borrow against. The catch: it costs roughly <strong>10\u201315 times more</strong> than term for the same death benefit. That same $500k policy might run $400\u2013$500/month."),
            ("h2", "The real 30-year cost gap"),
            ("p", "Run your own numbers with our <a href=\"../tools/term-vs-whole.html\">term vs whole 30-year cost comparison tool</a>. A typical result: 20-year term at 35 costs about $7,500 total over the term; whole life costs about $124,000 over 30 years. The most common strategy among fee-only planners: <strong>buy term and invest the difference</strong> in a retirement account, which historically outperforms whole life's cash value growth."),
            ("h2", "Who should choose term?"),
            ("ul", [
                "Parents who need maximum protection during working/child-raising years.",
                "Anyone on a budget \u2014 being underinsured with whole life is worse than being well-insured with term.",
                "People who already invest separately for retirement.",
            ]),
            ("h2", "Who might choose whole life?"),
            ("ul", [
                "High-net-worth families using it for estate planning and tax-advantaged wealth transfer.",
                "People who need <em>permanent</em> coverage (e.g., a special-needs dependent).",
                "Those who've maxed out other tax-advantaged accounts and want another vehicle.",
            ]),
            ("note", "Beware of agents presenting whole life as an \"investment.\" Compare its projected cash-value growth against simply buying term and investing the premium difference \u2014 the math rarely favors whole life for middle-income families."),
        ],
    },
    {
        "slug": "cheapest-life-insurance-by-age",
        "short": "Cheapest by Age Guide",
        "title": "Cheapest Life Insurance by Age \u2014 2026 Rate Guide",
        "h1": "Cheapest Life Insurance by Age: 2026 Rate Guide",
        "desc": "Sample 2026 term life rates by age band, why premiums rise with age, and 5 proven ways to lock in the lowest rate possible.",
        "date": "2026-10-12", "read": "6",
        "cta_tool": 2,
        "body": [
            ("lead", "Age is the single biggest driver of life insurance cost \u2014 every birthday makes coverage more expensive. Here's what people actually pay at each age, and how to keep your rate low."),
            ("h2", "Sample monthly rates: $250k, 20-year term (healthy non-smoker)"),
            ("p", "These are <strong>estimates</strong> for illustration, not quotes \u2014 but they show the pattern clearly:"),
            ("table", ["Age band", "Est. monthly premium", "Why"],
             [["20s", "$13\u2013$18", "Lowest mortality risk = lowest rates"],
              ["30s", "$16\u2013$24", "Still very affordable for most"],
              ["40s", "$26\u2013$40", "Rates start climbing noticeably"],
              ["50s", "$48\u2013$75", "Roughly 3\u00d7 the cost at 30"],
              ["60s", "$90\u2013$150", "Term gets expensive; many switch strategy"]]),
            ("h2", "Why age matters so much"),
            ("p", "Insurers price on <strong>mortality risk</strong>, which roughly doubles every 8\u20139 years of age. A policy bought at 28 locks in 28-year-old pricing for the whole term \u2014 waiting until 38 to buy the same 20-year term can easily double your premium."),
            ("h2", "5 ways to lock in the lowest rate"),
            ("ol", [
                "<strong>Buy young, even a small policy.</strong> You can layer more coverage later; the early years are the cheapest you'll ever see.",
                "<strong>Quit tobacco 12+ months before applying.</strong> Smokers pay ~2\u00d7 more; most insurers re-test and reward quitters.",
                "<strong>Apply as \"preferred\" health:</strong> healthy weight, normal blood pressure, and no recent ER visits move you into cheaper underwriting classes.",
                "<strong>Compare 5+ insurers.</strong> For the same 40-year-old, quotes can differ 40%+ between carriers.",
                "<strong>Choose the right term length.</strong> Don't pay for a 30-year term when a 20-year covers the need \u2014 use our <a href=\"../tools/quote-estimator.html\">premium estimator</a> to compare.",
            ]),
            ("note", "The cheapest policy is the one you actually keep. A slightly pricier policy from a financially strong insurer (A.M. Best A-rated or better) beats a bargain policy you let lapse."),
        ],
    },
]

BLOG = [
    {
        "slug": "riders-worth-considering",
        "short": "5 Riders Worth It",
        "title": "5 Life Insurance Riders Actually Worth Considering",
        "h1": "5 Life Insurance Riders Actually Worth Considering in 2026",
        "desc": "Riders add benefits to your life policy for a small extra premium. These 5 \u2014 from waiver of premium to child riders \u2014 are the ones worth it.",
        "date": "2026-10-12", "read": "5",
        "cta_tool": 2,
        "body": [
            ("lead", "A <strong>rider</strong> is an add-on that customizes your life insurance policy. Most are upsells \u2014 but a handful genuinely earn their keep."),
            ("h2", "1. Waiver of premium"),
            ("p", "If you become disabled and can't work, the insurer <strong>pays your premiums for you</strong> while coverage stays in force. It's usually only a few dollars a month \u2014 cheap protection for your protection."),
            ("h2", "2. Accelerated death benefit"),
            ("p", "Lets you access part of the death benefit early if diagnosed with a terminal illness. Many insurers now include a basic version <strong>for free</strong> \u2014 check before paying extra."),
            ("h2", "3. Child rider"),
            ("p", "A small amount of coverage (often $10k\u2013$25k) for all your children under one rider, usually under $10/month total. It also typically lets each child convert to their own policy later without a medical exam."),
            ("h2", "4. Guaranteed insurability"),
            ("p", "Lets you <strong>increase coverage at set life events</strong> (marriage, new child) without new underwriting. Valuable if your health might decline \u2014 you're buying future insurability at today's health status."),
            ("h2", "5. Long-term care / chronic illness rider"),
            ("p", "Allows the death benefit to pay for long-term care costs. Standalone LTC insurance is expensive and getting harder to buy; this hybrid approach is worth pricing if you're in your 40s\u201350s."),
            ("note", "Skip: accidental death riders (narrow coverage, poor value) and most \"return of premium\" add-ons (expensive for what amounts to a forced savings account with low returns)."),
        ],
    },
    {
        "slug": "medical-exam-what-to-expect",
        "short": "Medical Exam Guide",
        "title": "Life Insurance Medical Exam: What to Expect (2026)",
        "h1": "The Life Insurance Medical Exam: What to Expect",
        "desc": "What happens at a life insurance paramedical exam, how to prepare, what they test, and how results affect your premium.",
        "date": "2026-10-12", "read": "5",
        "cta_tool": 2,
        "body": [
            ("lead", "For the best rates on fully underwritten life insurance, you'll take a free <strong>paramedical exam</strong> \u2014 usually at your home or office, in about 20 minutes. Here's exactly what happens."),
            ("h2", "What they actually do"),
            ("ul", [
                "Record height, weight, blood pressure, and pulse.",
                "Draw blood and collect a urine sample.",
                "Ask a health questionnaire: medications, conditions, family history, tobacco/alcohol, risky hobbies.",
                "Sometimes an EKG for larger policies or older applicants.",
            ]),
            ("h2", "What the labs test for"),
            ("p", "Cholesterol and lipids, blood sugar (diabetes), liver and kidney function, HIV, and <strong>nicotine/cotinine</strong> \u2014 plus drug screening. Everything maps to an underwriting class (preferred, standard, substandard), which sets your price."),
            ("h2", "How to prepare (it matters)"),
            ("ol", [
                "<strong>Fast 8\u201312 hours</strong> before a morning exam for accurate cholesterol/glucose readings.",
                "Avoid alcohol for 48 hours and heavy exercise for 24 hours (both skew liver enzymes and blood pressure).",
                "Drink plenty of water \u2014 dehydration concentrates urine and blood markers.",
                "Get good sleep; schedule morning when blood pressure is naturally lower.",
                "Have your medication list and doctors' contact info ready.",
            ]),
            ("h2", "Can you skip it?"),
            ("p", "Yes \u2014 <strong>simplified-issue</strong> and <strong>no-exam</strong> policies skip the exam but cost 20\u201340% more and cap coverage lower. If you're reasonably healthy, the 20-minute exam usually pays for itself many times over."),
            ("note", "Be honest on the questionnaire. Insurers check prescription databases and medical records \u2014 undisclosed conditions found later can void a policy's payout."),
        ],
    },
]

FAQS = [
    ("How much life insurance do I need?",
     "A quick rule of thumb is 10\u201312\u00d7 your annual income plus your mortgage balance. For a precise number, use the DIME method \u2014 debts + income replacement + mortgage + education minus existing assets \u2014 with our free DIME calculator."),
    ("Is term or whole life insurance better?",
     "For most families, term: it costs roughly one-tenth of whole life for the same death benefit. Whole life makes sense mainly for estate planning or lifelong dependent needs. Compare both with our 30-year cost tool."),
    ("How much does life insurance cost per month?",
     "A healthy 30-year-old non-smoker typically pays about $15\u2013$30/month for a $250k 20-year term policy. Smokers pay roughly double; whole life for the same coverage runs $300\u2013$500/month. Get your range with our premium estimator."),
    ("Can I get life insurance without a medical exam?",
     "Yes \u2014 simplified-issue and no-exam policies skip the paramedical exam, but they cost 20\u201340% more and offer lower maximum coverage. Healthy applicants save significantly by taking the free exam."),
    ("What age should I buy life insurance?",
     "As early as you have dependents or debts someone else would inherit. Rates rise with every birthday \u2014 buying at 28 vs 38 can easily double your premium for the same policy."),
    ("Are life insurance payouts taxed?",
     "Generally no \u2014 death benefits are typically free from federal income tax for beneficiaries. (Estate taxes can apply to very large estates; consult a tax professional for your situation.)"),
]


def main():
    build_site(SITE, TOOLS, GUIDES, BLOG, FAQS, COPY)


if __name__ == "__main__":
    main()
