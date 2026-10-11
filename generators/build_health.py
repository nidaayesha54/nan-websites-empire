"""Build Site 3: HealthInsuranceHub -> ~/workspace/free-sites/health-insurance-hub/"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sitegen import build_site

SITE = {
    "dir": os.path.expanduser("~/workspace/free-sites/health-insurance-hub"),
    "name": "HealthInsuranceHub",
    "mark": "\U0001f3e5",
    "base": "https://nan-healthinsurance.surge.sh",
    "index_title": "HealthInsuranceHub: Health Plan Tools & Guides",
    "index_desc": "Compare health plans' true yearly costs, estimate ACA subsidies & master deductibles with free interactive tools. 2026 guides. Educational only.",
    "theme": {"primary": "#0e7c7b", "primary_dark": "#095c5b", "accent": "#f59e0b", "accent_soft": "#fff6e6"},
}

COPY = {
    "h1": "Free Health Insurance Tools & 2026 Guides",
    "hero_sub": "Compare plans by true yearly cost, estimate your ACA subsidy, and finally understand deductibles \u2014 free, no signup, plain English.",
    "tools_h2": "Health Insurance Tools",
    "tools_sub": "Interactive tools that reveal what you'll really pay. All results are estimates for education, not quotes.",
    "guides_h2": "2026 Health Insurance Guides",
    "guides_sub": "Choosing a plan, decoding deductibles, and understanding subsidies \u2014 explained simply.",
    "blog_h2": "From the Blog",
    "blog_sub": "HSAs, FSAs, open enrollment, and smart ways to cut health costs.",
}

PC_JS = """'use strict';
/* True annual cost = 12 x monthly premium + patient share of medical bills.
   patient share = min(OOPmax, min(bills, deductible) + coinsurance% x max(0, bills - deductible)) */
var SCENARIOS = [
  { name: 'Low usage', bills: 1500, note: 'checkups + one minor issue' },
  { name: 'Medium usage', bills: 8000, note: 'ER visit or outpatient surgery' },
  { name: 'High usage', bills: 30000, note: 'hospitalization / chronic care' }
];
function patientCost(bills, ded, oop, coinPct) {
  var c = Math.max(0, Math.min(100, coinPct)) / 100;
  return Math.min(oop, Math.min(bills, ded) + c * Math.max(0, bills - ded));
}
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('pcForm');
  var result = document.getElementById('pcResult');
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function readPlan(i) {
    function n(id, dflt) {
      var v = parseFloat(document.getElementById(id).value);
      return (isNaN(v) || v < 0) ? dflt : v;
    }
    return {
      name: document.getElementById('pc' + i + 'name').value.trim() || ('Plan ' + 'ABC'[i]),
      prem: n('pc' + i + 'prem', 0),
      ded: n('pc' + i + 'ded', 0),
      oop: n('pc' + i + 'oop', 0),
      coin: n('pc' + i + 'coin', 20)
    };
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var plans = [readPlan(0), readPlan(1), readPlan(2)];
    var totals = plans.map(function (p) {
      return SCENARIOS.map(function (s) {
        return 12 * p.prem + patientCost(s.bills, p.ded, p.oop, p.coin);
      });
    });
    var winners = SCENARIOS.map(function (s, si) {
      var best = 0;
      for (var pi = 1; pi < plans.length; pi++) {
        if (totals[pi][si] < totals[best][si]) best = pi;
      }
      return best;
    });
    var winCount = [0, 0, 0];
    winners.forEach(function (w) { winCount[w]++; });
    var overall = winCount.indexOf(Math.max.apply(null, winCount));
    var head = '<tr><th>Plan</th>' + SCENARIOS.map(function (s) {
      return '<th>' + s.name + '<br><span style="font-weight:400;font-size:.8rem">(' + fmt(s.bills) + ' in bills)</span></th>';
    }).join('') + '</tr>';
    var rows = plans.map(function (p, pi) {
      var cells = totals[pi].map(function (t, si) { return '<td>' + fmt(t) + '</td>'; }).join('');
      return '<tr class="' + (pi === overall ? 'winner' : '') + '"><td><strong>' + p.name + '</strong><br>'
        + '<span style="font-size:.8rem;color:var(--muted)">' + fmt(p.prem) + '/mo \u00b7 ' + fmt(p.ded)
        + ' ded \u00b7 ' + fmt(p.oop) + ' OOP max</span></td>' + cells + '</tr>';
    }).join('');
    var verdict = '<p><strong>Winner overall: ' + plans[overall].name + '</strong> \u2014 cheapest in '
      + winCount[overall] + ' of 3 scenarios. ';
    var perScenario = SCENARIOS.map(function (s, si) {
      return s.name + ': <strong>' + plans[winners[si]].name + '</strong> (' + fmt(totals[winners[si]][si]) + ')';
    }).join(' \u00b7 ');
    verdict += 'By scenario \u2014 ' + perScenario + '.</p>'
      + '<p class="meta">Estimates assume all care is in-network and copays are folded into the bill totals. Real costs vary by plan details and providers.</p>';
    result.innerHTML = '<h2>True annual cost comparison</h2>'
      + '<div class="table-wrap"><table><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>'
      + verdict;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
"""

SE_JS = """'use strict';
/* ACA premium tax credit estimator (2026 estimates).
   FPL (approx 2026): $15,650 single + $5,490 per extra household member.
   Contribution rate: 2.07% at 133% FPL sliding to 9.83% at 400% FPL; 8.5% cap above 400%.
   subsidy = max(0, benchmark premium - income x rate / 12). */
var STATE_F = { AK: 1.4, HI: 1.2, NY: 1.1, NJ: 1.1, CT: 1.1, MA: 1.1, WY: 1.15 };
var BENCHMARK = 550;
function fplAmount(size) { return 15650 + (size - 1) * 5490; }
function contribRate(p) {
  if (p < 1.33) return 0.0207;
  if (p <= 4.0) return 0.0207 + ((p - 1.33) / (4.0 - 1.33)) * (0.0983 - 0.0207);
  return 0.085;
}
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('seForm');
  var result = document.getElementById('seResult');
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var size = parseInt(document.getElementById('seSize').value, 10) || 1;
    var income = parseFloat(document.getElementById('seIncome').value);
    income = (isNaN(income) || income < 0) ? 0 : income;
    var state = document.getElementById('seState').value;
    var fpl = fplAmount(size);
    var p = income / fpl;
    var benchmark = BENCHMARK * (STATE_F[state] || 1.0);
    var html;
    if (p < 1.0) {
      html = '<h2>Estimated subsidy</h2>'
        + '<p class="big">$0 <span style="font-size:1rem;font-weight:400">marketplace subsidy</span></p>'
        + '<p>At about <strong>' + Math.round(p * 100) + '% of the federal poverty level</strong> (' + fmt(income)
        + ' for a household of ' + size + '), you\u2019d likely qualify for <strong>Medicaid</strong> instead of marketplace subsidies in most states that expanded Medicaid. Check your state\u2019s Medicaid program.</p>';
    } else {
      var rate = contribRate(p);
      var contribMo = income * rate / 12;
      var subsidy = Math.max(0, benchmark - contribMo);
      var note = p > 4.0
        ? ' Above 400% of FPL, this uses the extended rule capping your benchmark-plan cost at 8.5% of income \u2014 confirm 2026 rules at enrollment, as subsidy law can change.'
        : '';
      html = '<h2>Estimated monthly subsidy (2026)</h2>'
        + '<p class="big">' + fmt(subsidy) + '<span style="font-size:1rem;font-weight:400">/mo \u2248 ' + fmt(subsidy * 12) + '/yr</span></p>'
        + '<div class="table-wrap"><table><tbody>'
        + '<tr><td>Household income vs poverty level</td><td><strong>' + Math.round(p * 100) + '% of FPL</strong></td></tr>'
        + '<tr><td>Benchmark plan (est.)</td><td>' + fmt(benchmark) + '/mo</td></tr>'
        + '<tr><td>Your expected contribution (' + (rate * 100).toFixed(2) + '% of income)</td><td>' + fmt(contribMo) + '/mo</td></tr>'
        + '<tr><td><strong>Estimated subsidy</strong></td><td><strong>' + fmt(subsidy) + '/mo</strong></td></tr>'
        + '</tbody></table></div>'
        + '<p class="meta">2026 estimates for education only \u2014 not an official determination.' + note
        + ' Final credits depend on the actual benchmark plan in your ZIP code and your finalized income.</p>';
    }
    result.innerHTML = html;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
"""

CE_JS = """'use strict';
/* Interactive deductible / OOP-max / coinsurance explainer for a hospital bill.
   patientPays = min(OOPmax, min(bill, deductible) + coinsurance% x max(0, bill - deductible)) */
document.addEventListener('DOMContentLoaded', function () {
  function $(id) { return document.getElementById(id); }
  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  var billEl = $('ceBill'), dedEl = $('ceDed'), oopEl = $('ceOop'), coinEl = $('ceCoin');
  function update() {
    var bill = +billEl.value, ded = +dedEl.value, oop = +oopEl.value, coin = +coinEl.value;
    $('ceBillOut').textContent = fmt(bill);
    $('ceDedOut').textContent = fmt(ded);
    $('ceOopOut').textContent = fmt(oop);
    $('ceCoinOut').textContent = coin + '%';
    var dedPart = Math.min(bill, ded);
    var coinPart = (coin / 100) * Math.max(0, bill - ded);
    var patient = Math.min(oop, dedPart + coinPart);
    var insurer = Math.max(0, bill - patient);
    var youPct = bill > 0 ? (patient / bill) * 100 : 0;
    $('ceYouBar').style.width = youPct + '%';
    $('ceInsBar').style.width = (100 - youPct) + '%';
    $('ceYouPay').textContent = fmt(patient);
    $('ceInsPay').textContent = fmt(insurer);
    $('ceBreakdown').innerHTML =
      '<li>You pay the deductible first: <strong>' + fmt(dedPart) + '</strong></li>'
      + '<li>You pay coinsurance (' + coin + '% of the remaining ' + fmt(Math.max(0, bill - ded)) + '): <strong>' + fmt(Math.min(coinPart, Math.max(0, oop - dedPart))) + '</strong></li>'
      + '<li>Out-of-pocket max caps your share at: <strong>' + fmt(oop) + '</strong>' + (dedPart + coinPart > oop ? ' (cap applied \u2713)' : '') + '</li>'
      + '<li>Insurer pays the rest: <strong>' + fmt(insurer) + '</strong></li>';
  }
  [billEl, dedEl, oopEl, coinEl].forEach(function (el) {
    el.addEventListener('input', update);
  });
  update();
});
"""

# plan input fieldsets (ids pc{i}name / prem / ded / oop / coin, matching plan-comparator JS)
PLAN_FIELDS = ""
_defaults = [("Balanced", 450, 2000, 7000, 20), ("High-deductible", 250, 6000, 9000, 30), ("Premium", 650, 500, 3000, 10)]
for _i, _d in enumerate(_defaults):
    PLAN_FIELDS += (
        '    <fieldset class="plan-fieldset">\n'
        '      <legend>Plan %d</legend>\n'
        '      <div class="form-grid">\n'
        '        <div class="field"><label for="pc%dname">Plan name</label><input type="text" id="pc%dname" value="%s"></div>\n'
        '        <div class="field"><label for="pc%dprem">Monthly premium ($)</label><input type="number" id="pc%dprem" min="0" value="%d"></div>\n'
        '        <div class="field"><label for="pc%dded">Deductible ($)</label><input type="number" id="pc%dded" min="0" value="%d"></div>\n'
        '        <div class="field"><label for="pc%doop">Out-of-pocket max ($)</label><input type="number" id="pc%doop" min="0" value="%d"></div>\n'
        '        <div class="field"><label for="pc%dcoin">Coinsurance \u2014 your share (%%)</label><input type="number" id="pc%dcoin" min="0" max="100" value="%d"></div>\n'
        '      </div>\n'
        '    </fieldset>\n'
    ) % (_i + 1, _i, _i, _d[0], _i, _i, _d[1], _i, _i, _d[2], _i, _i, _d[3], _i, _i, _d[4])

TOOLS = [
    {
        "slug": "plan-comparator",
        "short": "Plan Comparator",
        "title": "Health Plan Cost Comparator (2026)",
        "h1": "Health Plan Cost Comparator: True Annual Cost",
        "desc": "Compare 3 health plans side-by-side: true yearly cost at low, medium & high medical usage. The winner is highlighted automatically.",
        "icon": "\U0001f4ca",
        "blurb": "Enter premium, deductible, OOP max & coinsurance for up to 3 plans to see which is truly cheapest at every usage level.",
        "result_id": "pcResult",
        "js": PC_JS,
        "intro": "The cheapest premium is rarely the cheapest plan. This tool adds your premium to your likely out-of-pocket costs at three usage levels \u2014 revealing the true yearly price of each option.",
        "form_html": '<form id="pcForm">\n' + PLAN_FIELDS + '  <button class="btn" type="submit">Compare Plans</button>\n</form>',
        "how": [
            ("h2", "How true annual cost is calculated"),
            ("p", "For each plan and each usage scenario: <strong>true annual cost = 12 \u00d7 monthly premium + your share of the medical bills</strong>. Your share of bills is <strong>min(OOP max, min(bills, deductible) + coinsurance \u00d7 (bills \u2212 deductible))</strong> \u2014 you pay the deductible first, then your coinsurance percentage, capped by the out-of-pocket maximum."),
            ("ul", [
                "<strong>Low usage ($1,500):</strong> routine care year \u2014 cheap-premium, high-deductible plans usually win.",
                "<strong>Medium usage ($8,000):</strong> an ER visit or outpatient procedure \u2014 balanced plans often win.",
                "<strong>High usage ($30,000):</strong> hospitalization \u2014 low-OOP-max plans usually win despite high premiums.",
            ]),
            ("note", "Premiums are sunk cost \u2014 you pay them even in a healthy year. That's why comparing <em>premium + expected out-of-pocket</em> beats comparing premiums alone."),
        ],
    },
    {
        "slug": "subsidy-estimator",
        "short": "Subsidy Estimator",
        "title": "ACA Subsidy Estimator 2026 \u2014 Check Savings",
        "h1": "ACA Subsidy Estimator (2026)",
        "desc": "Estimate your 2026 ACA premium tax credit from household size, income & state. See your likely monthly savings in seconds.",
        "icon": "\U0001f4b2",
        "blurb": "Enter household size, income, and state to estimate your monthly ACA premium subsidy for 2026.",
        "result_id": "seResult",
        "js": SE_JS,
        "intro": "Most marketplace shoppers qualify for help \u2014 but few know how much. This estimator applies the federal subsidy formula to your income.",
        "form_html": """<form id="seForm">
  <div class="form-grid">
    <div class="field"><label for="seSize">Household size</label><select id="seSize"><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option></select></div>
    <div class="field"><label for="seIncome">Annual household income ($)</label><input type="number" id="seIncome" min="0" step="1000" value="35000"><p class="hint">Modified adjusted gross income.</p></div>
    <div class="field"><label for="seState">State</label><select id="seState"><option value="TX" selected>Texas</option><option value="CA">California</option><option value="FL">Florida</option><option value="NY">New York</option><option value="AK">Alaska</option><option value="HI">Hawaii</option><option value="OTHER">Other state</option></select><p class="hint">Adjusts the benchmark premium for high-cost states.</p></div>
  </div>
  <button class="btn" type="submit">Estimate My Subsidy</button>
</form>""",
        "how": [
            ("h2", "How the subsidy estimate works"),
            ("p", "The ACA premium tax credit caps what you pay for a benchmark Silver plan at a <strong>percentage of your income</strong>, based on where your income falls against the <strong>federal poverty level (FPL)</strong>:"),
            ("ul", [
                "<strong>FPL (2026 approx):</strong> $15,650 for one person + $5,490 per additional household member.",
                "<strong>Your share:</strong> slides from 2.07% of income at 133% FPL to 9.83% at 400% FPL (8.5% cap above 400% under extended rules).",
                "<strong>Subsidy</strong> = benchmark premium \u2212 your share. If that's negative, the subsidy is $0.",
                "<strong>Benchmark:</strong> we use a ~$550/month national average second-lowest-cost Silver plan, adjusted up for high-cost states (AK, HI, NY-area).",
            ]),
            ("note", "These are 2026 estimates for education. Subsidy law has changed before and can change again \u2014 confirm your actual credit at enrollment on Healthcare.gov or your state exchange."),
        ],
    },
    {
        "slug": "cost-explainer",
        "short": "Cost Explainer",
        "title": "Deductible vs Premium: Interactive Explainer",
        "h1": "Deductible, OOP Max & Coinsurance: Interactive Explainer",
        "desc": "Move the sliders on a $20,000 hospital bill to see exactly who pays what \u2014 you vs the insurer \u2014 under any deductible & coinsurance.",
        "icon": "\U0001f4a1",
        "blurb": "Drag sliders for a hospital bill, deductible, OOP max and coinsurance to watch who pays what \u2014 live.",
        "result_id": "ceLive",
        "skip_result": True,
        "js": CE_JS,
        "intro": "Health insurance jargon finally made visual: set a hospital bill and your plan's numbers, then watch the payment split between you and the insurer.",
        "form_html": """<div class="slider-row"><label for="ceBill">Hospital bill <output id="ceBillOut"></output></label><input type="range" id="ceBill" min="1000" max="100000" step="500" value="20000"></div>
<div class="slider-row"><label for="ceDed">Your deductible <output id="ceDedOut"></output></label><input type="range" id="ceDed" min="0" max="10000" step="250" value="2000"></div>
<div class="slider-row"><label for="ceOop">Your out-of-pocket max <output id="ceOopOut"></output></label><input type="range" id="ceOop" min="1000" max="20000" step="500" value="7000"></div>
<div class="slider-row"><label for="ceCoin">Your coinsurance share <output id="ceCoinOut"></output></label><input type="range" id="ceCoin" min="0" max="50" step="5" value="20"></div>
<div class="result" id="ceLive">
  <h2>Who pays what</h2>
  <div class="legend"><span><i class="bar-you" style="background:var(--accent)"></i>You pay: <strong id="ceYouPay"></strong></span><span><i class="bar-insurer" style="background:var(--primary)"></i>Insurer pays: <strong id="ceInsPay"></strong></span></div>
  <div class="bar-stack"><div class="bar-you" id="ceYouBar"></div><div class="bar-insurer" id="ceInsBar"></div></div>
  <ul id="ceBreakdown"></ul>
</div>""",
        "how": [
            ("h2", "The three terms, in plain English"),
            ("ul", [
                "<strong>Deductible:</strong> what you pay first each year before insurance helps (except free preventive care and copay visits).",
                "<strong>Coinsurance:</strong> after the deductible, you pay this percentage and the insurer pays the rest \u2014 e.g., 20% coinsurance on a $10,000 balance = $2,000 from you.",
                "<strong>Out-of-pocket max:</strong> your yearly safety net. Once your deductible + coinsurance (+ copays) hit this number, the insurer pays 100% of covered care for the rest of the year.",
            ]),
            ("p", "The math: <strong>you pay = min(OOP max, min(bill, deductible) + coinsurance \u00d7 (bill \u2212 deductible))</strong>. Try the extremes: a $0 deductible with 50% coinsurance vs a $10,000 deductible with 10% coinsurance \u2014 the OOP max decides more than people think."),
            ("note", "Premiums are separate \u2014 you pay those every month regardless. The explainer shows cost-sharing only."),
        ],
    },
]

GUIDES = [
    {
        "slug": "how-to-choose-health-insurance",
        "short": "How to Choose Guide",
        "title": "How to Choose Health Insurance in 2026",
        "h1": "How to Choose Health Insurance in 2026",
        "desc": "A step-by-step 2026 framework: metal tiers, HMO vs PPO, networks, and comparing true yearly cost \u2014 not just the premium.",
        "date": "2026-10-12", "read": "8",
        "cta_tool": 0,
        "body": [
            ("lead", "Choosing a health plan feels like gambling because most people compare only the monthly premium. The premium is just one of four numbers that decide what you'll actually pay. Here's the full framework."),
            ("h2", "Step 1: Know the metal tiers"),
            ("p", "Marketplace plans come in <strong>Bronze, Silver, Gold, and Platinum</strong> \u2014 tiers describe cost-sharing, not quality of care:"),
            ("ul", [
                "<strong>Bronze:</strong> lowest premium, highest deductible (~$7,000). Best if you're healthy and want catastrophe protection.",
                "<strong>Silver:</strong> the middle path \u2014 and the <em>only</em> tier where cost-sharing reductions apply if your income qualifies.",
                "<strong>Gold:</strong> higher premium, lower deductible (~$1,500). Best if you expect regular care.",
                "<strong>Platinum:</strong> highest premium, lowest out-of-pocket costs. Rarely the best value unless you have major planned care.",
            ]),
            ("h2", "Step 2: Pick the network type"),
            ("ul", [
                "<strong>HMO:</strong> cheapest; you need a primary-care referral for specialists and there's (almost) no out-of-network coverage. Fine if your doctors are in-network.",
                "<strong>PPO:</strong> pricier; see specialists without referrals and get partial out-of-network coverage. Worth it if you travel or want specific doctors.",
                "<strong>EPO:</strong> the middle ground \u2014 no referrals, but no out-of-network coverage either.",
            ]),
            ("h2", "Step 3: Compare TRUE yearly cost, not premiums"),
            ("p", "Add <strong>12 \u00d7 premium + expected out-of-pocket costs</strong> for your situation. Our <a href=\"../tools/plan-comparator.html\">health plan cost comparator</a> does this across low, medium, and high usage scenarios \u2014 the \"cheap\" Bronze plan often loses once real medical bills appear."),
            ("h2", "Step 4: Check your doctors and drugs"),
            ("p", "Before enrolling, verify two things in the plan's directory: (1) your primary-care doctor and any specialists are <strong>in-network</strong>, and (2) your prescriptions are on the plan's <strong>formulary</strong> at a reasonable tier. A plan that excludes your $400/month medication isn't a bargain."),
            ("h2", "Step 5: Factor in subsidies and HSAs"),
            ("p", "If your income is under ~400% of the poverty level, check your <a href=\"../tools/subsidy-estimator.html\">ACA subsidy estimate</a> \u2014 subsidies can make a Silver plan cheaper than Bronze. And if you pick a qualifying high-deductible plan, an <strong>HSA</strong> gives you triple tax advantages on medical savings."),
            ("note", "Never choose on premium alone. A $200/month cheaper premium with a $5,000 higher out-of-pocket max is a bad trade the first time anyone in the family needs surgery."),
        ],
    },
    {
        "slug": "deductible-vs-premium",
        "short": "Deductible vs Premium",
        "title": "Deductible vs Premium Explained Simply",
        "h1": "Deductible vs Premium, Explained Simply",
        "desc": "The deductible\u2013premium tradeoff with real numbers: when a high deductible saves you money, when it backfires, and how to decide.",
        "date": "2026-10-12", "read": "6",
        "cta_tool": 2,
        "body": [
            ("lead", "Every health plan forces the same tradeoff: <strong>low premium + high deductible</strong> or <strong>high premium + low deductible</strong>. Here's how to do the math instead of guessing."),
            ("h2", "The tradeoff in one paragraph"),
            ("p", "Insurers let you choose where the risk sits. A <strong>$250/month plan with a $6,000 deductible</strong> bets you're healthy \u2014 you save $2,400/year in premiums vs a $450/month plan, but owe the first $6,000 of care yourself. The <strong>$450/month plan with a $2,000 deductible</strong> costs more guaranteed, but caps a bad year much lower."),
            ("h2", "Do the math for YOUR situation"),
            ("p", "Compare <strong>total yearly cost = premiums + out-of-pocket</strong> at the usage level you expect. Try it live with our <a href=\"../tools/cost-explainer.html\">interactive deductible explainer</a> and <a href=\"../tools/plan-comparator.html\">plan comparator</a>. The pattern that emerges:"),
            ("ul", [
                "<strong>Healthy year ($1,500 in bills):</strong> the cheap-premium plan almost always wins \u2014 you pocket the premium savings and barely touch the deductible.",
                "<strong>Medium year ($8,000):</strong> often close; the balanced plan frequently wins.",
                "<strong>Bad year ($30,000+):</strong> the low-deductible/low-OOP-max plan usually wins \u2014 the OOP max is what saves you, not the deductible.",
            ]),
            ("h2", "Who should pick a high deductible?"),
            ("ul", [
                "You're healthy, rarely see doctors, and have the deductible saved in an emergency fund or HSA.",
                "You want HSA access (only qualifying high-deductible plans allow it) \u2014 the tax savings can outweigh the risk.",
                "You're buying mainly catastrophe protection and can self-fund routine care.",
            ]),
            ("h2", "Who should pick a low deductible?"),
            ("ul", [
                "You have a chronic condition, take expensive prescriptions, or have planned surgery/childbirth this year.",
                "You couldn't comfortably pay a $6,000 surprise bill.",
                "Someone in the family is pregnant or manages an ongoing condition.",
            ]),
            ("note", "The out-of-pocket max matters more than the deductible in bad years. A $6,000 deductible with a $7,000 OOP max can beat a $2,000 deductible with a $9,000 OOP max when bills get big."),
        ],
    },
    {
        "slug": "aca-subsidies-2026",
        "short": "ACA Subsidies Guide",
        "title": "ACA Subsidies 2026: Complete Explainer",
        "h1": "ACA Subsidies in 2026, Explained",
        "desc": "Who qualifies for ACA premium tax credits in 2026, how the subsidy is calculated from your income, and how to claim it \u2014 simply explained.",
        "date": "2026-10-12", "read": "7",
        "cta_tool": 1,
        "body": [
            ("lead", "Roughly 9 in 10 marketplace shoppers qualify for financial help \u2014 yet millions never check. Here's exactly how ACA subsidies work in 2026."),
            ("h2", "The two kinds of help"),
            ("ul", [
                "<strong>Premium tax credits</strong> lower your monthly premium. Available roughly between 100% and 400%+ of the federal poverty level (FPL).",
                "<strong>Cost-sharing reductions (CSRs)</strong> lower your deductible and out-of-pocket costs \u2014 but <em>only</em> on Silver plans, and only up to 250% of FPL.",
            ]),
            ("h2", "How your subsidy is calculated"),
            ("p", "The formula caps what you pay for the <strong>benchmark Silver plan</strong> (second-lowest-cost Silver in your area) at a <strong>percentage of your income</strong>: about 2.07% of income at 133% of FPL, sliding up to 9.83% at 400% of FPL. The government pays the rest. Get your number with our <a href=\"../tools/subsidy-estimator.html\">2026 subsidy estimator</a>."),
            ("h2", "Who qualifies?"),
            ("ul", [
                "Income roughly 100\u2013400%+ of FPL (about $15,650\u2013$62,600+ for one person in 2026; higher for families).",
                "No access to affordable employer coverage and not eligible for Medicaid/Medicare.",
                "Lawfully present in the US and filing taxes (married couples generally must file jointly).",
                "Below 100% FPL? You likely qualify for <strong>Medicaid</strong> instead (in expansion states).",
            ]),
            ("h2", "How to claim it"),
            ("ol", [
                "Apply on Healthcare.gov (or your state exchange) during open enrollment.",
                "Report your <em>estimated</em> income for the coverage year \u2014 most people take it as <strong>advance payments</strong> that lower each month's bill directly.",
                "Reconcile at tax time: earn more than estimated and you may repay some; earn less and you may get extra credit.",
            ]),
            ("note", "Subsidy rules have been extended and changed before \u2014 always confirm current-year rules at enrollment rather than relying on last year's experience. Estimates on this site are educational, not official determinations."),
        ],
    },
]

BLOG = [
    {
        "slug": "hsa-vs-fsa",
        "short": "HSA vs FSA",
        "title": "HSA vs FSA: Which Saves You More?",
        "h1": "HSA vs FSA: Which Saves You More?",
        "desc": "Health Savings Accounts vs Flexible Spending Accounts: contribution limits, rollover rules, tax benefits, and which one fits your plan.",
        "date": "2026-10-12", "read": "6",
        "cta_tool": 0,
        "body": [
            ("lead", "Both let you pay medical bills with pre-tax dollars \u2014 but they work very differently. Pick the wrong one and you can literally lose money."),
            ("h2", "HSA: the triple-tax superstar"),
            ("ul", [
                "<strong>Triple tax advantage:</strong> contributions are pre-tax (or deductible), growth is tax-free, and withdrawals for medical expenses are tax-free.",
                "<strong>The money is yours forever</strong> \u2014 it rolls over year after year and stays with you if you change jobs.",
                "<strong>Catch:</strong> you must be enrolled in a qualifying <strong>high-deductible health plan (HDHP)</strong>.",
                "2026 contribution limits are roughly $4,300 (individual) / $8,550 (family), plus a $1,000 catch-up at 55+.",
            ]),
            ("h2", "FSA: use it or lose it"),
            ("ul", [
                "<strong>Also pre-tax</strong> for medical expenses \u2014 same immediate tax saving as an HSA.",
                "<strong>Use-it-or-lose-it:</strong> funds generally don't roll over (employers may allow a small rollover ~$640 or a grace period \u2014 check yours).",
                "<strong>Available with any plan type</strong> \u2014 no HDHP required.",
                "Lower contribution limit (~$3,300 in 2026) and you <strong>lose it if you leave the job</strong>.",
            ]),
            ("h2", "Which saves more?"),
            ("p", "If you qualify for an HSA, it wins on almost every axis: higher limits, permanent ownership, investment growth, and portability. An HSA used as a retirement vehicle (pay medical bills from cash, let the HSA compound) is one of the best tax shelters available to middle-income earners."),
            ("p", "Choose the FSA when: you don't have an HDHP, you have predictable expenses (braces, LASIK, known prescriptions), and you're confident you'll spend the balance within the plan year."),
            ("note", "You generally <strong>can't contribute to both</strong> a full HSA and a general-purpose FSA in the same year (a limited-purpose FSA for dental/vision is the exception)."),
        ],
    },
    {
        "slug": "open-enrollment-2026",
        "short": "Open Enrollment 2026",
        "title": "Open Enrollment 2026: Dates & Checklist",
        "h1": "Open Enrollment 2026: Dates & Checklist",
        "desc": "2026 open enrollment dates, deadlines by state type, and a 10-point checklist to pick the right plan before the window closes.",
        "date": "2026-10-12", "read": "5",
        "cta_tool": 0,
        "body": [
            ("lead", "Miss the window and you're generally locked out until next year (unless you qualify for a special enrollment period). Here's everything to handle before the deadline."),
            ("h2", "Key 2026 dates"),
            ("ul", [
                "<strong>Healthcare.gov states:</strong> open enrollment typically runs <strong>November 1 \u2013 January 15</strong>. Enroll by December 15 for coverage starting January 1.",
                "<strong>State exchanges</strong> (CA, NY, CO, etc.) set their own windows \u2014 several extend past January 15. Check your state's exchange.",
                "<strong>Employer plans:</strong> usually a 2\u20134 week window in the fall \u2014 set by your employer, often October/November.",
                "<strong>Medicare:</strong> October 15 \u2013 December 7 (separate from marketplace open enrollment).",
            ]),
            ("h2", "Your 10-point checklist"),
            ("ol", [
                "Confirm your doctors are still in-network (networks change yearly).",
                "Check your prescriptions' formulary tier and cost.",
                "Estimate next year's care: any planned surgeries, pregnancies, or new diagnoses?",
                "Compare <strong>true yearly cost</strong> with our <a href=\"../tools/plan-comparator.html\">plan comparator</a> \u2014 not just premiums.",
                "Check your <a href=\"../tools/subsidy-estimator.html\">subsidy estimate</a> \u2014 income changes alter your credit.",
                "If picking Silver and income-qualifying, remember CSRs only apply to Silver.",
                "Decide on HSA vs FSA contributions for the year.",
                "Review dental/vision add-ons separately \u2014 they're rarely in medical plans.",
                "Update income and household info so advance credits are accurate.",
                "Save/print your enrollment confirmation and first premium due date.",
            ]),
            ("note", "Auto-renewal is convenient but dangerous: plans change premiums, networks, and formularies every year. A 20-minute review beats a nasty January surprise at the pharmacy."),
        ],
    },
]

FAQS = [
    ("What is a health insurance deductible?",
     "The amount you pay each year for covered care before your insurance starts sharing costs. After you meet it, you typically pay coinsurance (a percentage) until you hit your out-of-pocket maximum \u2014 then insurance pays 100%. Try our interactive explainer to see it visually."),
    ("How do ACA subsidies work?",
     "Premium tax credits cap what you pay for a benchmark Silver plan at a percentage of your income (about 2\u20139.8% depending on income). The government pays the insurer the difference each month. Estimate yours with our 2026 subsidy estimator."),
    ("What's the difference between HMO and PPO?",
     "HMOs cost less but require a primary-care referral for specialists and cover almost nothing out-of-network. PPOs cost more but let you see specialists directly and cover some out-of-network care."),
    ("When is open enrollment for 2026?",
     "For Healthcare.gov states, typically November 1 through January 15 (enroll by December 15 for January 1 coverage). State-run exchanges and employer plans set their own \u2014 usually similar fall windows."),
    ("Is a high-deductible health plan worth it?",
     "Often yes for healthy people: lower premiums plus HSA eligibility (triple tax advantage) usually beat richer plans in low-usage years. Use our plan comparator to check your own numbers across usage scenarios."),
    ("What counts toward the out-of-pocket maximum?",
     "Your deductible, coinsurance, and copays for covered in-network care all count. Monthly premiums do NOT count \u2014 and out-of-network care usually doesn't either."),
]


def main():
    build_site(SITE, TOOLS, GUIDES, BLOG, FAQS, COPY)


if __name__ == "__main__":
    main()
