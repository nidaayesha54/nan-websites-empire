#!/usr/bin/env python3
"""Builds the 3 finance static sites: retirement-hub, mortgage-tools, credit-tools."""
import os, json, re, html

BASE = os.path.expanduser('~/workspace/free-sites')
DATE = '2026-10-12'
DISCLAIMER = '<p class="disclaimer"><strong>Disclaimer:</strong> Educational purposes only &mdash; not financial advice.</p>'
ADSLOT = '<!-- AD-SLOT -->'
FOOTER_BRAND = ('Built by <a href="https://nidaayesha.com" target="_blank" rel="noopener">NAN Marketing Agency</a> | '
                '<span>Our sites: <a href="https://aivideodetector.site" target="_blank" rel="noopener">AI Video Detector</a> &middot; '
                '<a href="https://epstopikpakistan.blogspot.com" target="_blank" rel="noopener">EpsTopik Pakistan</a></span>')

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>{title}</title>
<meta name="description" content="{desc}"/>
<link rel="canonical" href="{canonical}"/>
<link rel="stylesheet" href="{root}css/style.css"/>
{jsonld}</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap header-inner">
<a class="brand" href="{root}index.html">{brand}</a>
<button class="nav-toggle" aria-label="Menu" aria-expanded="false">&#9776;</button>
<nav class="main-nav" id="mainNav">
<a href="{root}index.html"{nav_home}>Home</a>
<a href="{root}tools/index.html"{nav_tools}>Calculators</a>
<a href="{root}guides/index.html"{nav_guides}>Guides</a>
<a href="{root}blog/index.html"{nav_blog}>Blog</a>
</nav></div></header>
<main id="main">{body}</main>
<div class="wrap"><div class="ad-slot">{adslot}</div></div>
<footer class="site-footer"><div class="wrap">
<p>{footer_brand}</p>
<nav class="footer-nav">
<a href="{root}index.html">Home</a>
<a href="{root}tools/index.html">Calculators</a>
<a href="{root}guides/index.html">Guides</a>
<a href="{root}blog/index.html">Blog</a>
</nav>
<p class="footer-note">All calculators are educational tools only &mdash; not financial advice. Figures are estimates.</p>
</div></footer>
<script src="{root}js/main.js"></script>
{scripts}</body>
</html>
"""

def faq_jsonld(faqs):
    ents = [{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in faqs]
    return {"@context":"https://schema.org","@graph":[
        {"@type":"WebSite","name":"{name}","url":"{base}"},
        {"@type":"FAQPage","mainEntity":ents}]}

def article_jsonld(site, headline, desc, canonical):
    return {"@context":"https://schema.org","@type":"Article",
        "headline":headline,"description":desc,
        "author":{"@type":"Organization","name":site['name']},
        "datePublished":DATE,"dateModified":DATE,
        "mainEntityOfPage":{"@type":"WebPage","@id":canonical}}

def ld(obj, site):
    s = json.dumps(obj, separators=(',',':'))
    s = s.replace('{name}', site['name']).replace('{base}', site['base'])
    return '<script type="application/ld+json">\n'+s+'\n</script>'

# ---------------------------------------------------------------- site configs
SITES = {}

SITES['retirement-hub'] = {
  'name':'RetirementHub','brand':'Retirement<span>Hub</span>','base':'https://nan-retirementhub.surge.sh/',
  'hero_lede':'Free, no-signup retirement calculators and plain-English guides. Find your number, project your 401(k), and time Social Security right.',
  'tools':[
    {'slug':'retirement-calculator','name':'Retirement Calculator','js':'retirement-calculator.js',
     'card':'How much do you need to retire? Enter your age, spending, inflation and returns to get your nest-egg number and required monthly savings.',
     'title':'Retirement Calculator: How Much Do You Need? | RetirementHub',
     'desc':'Free retirement calculator: enter your age, retirement spending, inflation and expected returns to find your nest egg and monthly savings target.',
     'h1':'Retirement Calculator: How Much Do You Need to Retire?',
     'lede':'Answer the biggest retirement question — your number — with inflation-adjusted math and a clear monthly savings target.'},
    {'slug':'401k-calculator','name':'401(k) Projector','js':'401k-calculator.js',
     'card':'See your 401(k) balance year by year. Includes employer match, contributions vs growth breakdown, and a visual growth chart.',
     'title':'401(k) Calculator: Project Your Balance | RetirementHub',
     'desc':'Free 401(k) calculator with employer match: project your balance year by year and see contributions vs investment growth.',
     'h1':'401(k) Calculator: Project Your Future Balance',
     'lede':'Plug in your balance, salary, contribution rate and employer match to see your 401(k) grow year by year.'},
    {'slug':'social-security','name':'Social Security Timing Analyzer','js':'social-security.js',
     'card':'Claim at 62, 67, or 70? Compare monthly benefits and lifetime totals side by side with an interactive claiming-age slider.',
     'title':'Social Security Timing Analyzer | RetirementHub',
     'desc':'Should you claim Social Security at 62, 67, or 70? Compare monthly benefits and lifetime totals with our free timing analyzer.',
     'h1':'Social Security Timing Analyzer: 62 vs 67 vs 70',
     'lede':'Your claiming age permanently changes your benefit. Slide through ages 62–70 to compare monthly checks and lifetime totals.'},
  ],
  'guides':[
    {'slug':'how-much-to-retire','title':'How Much to Retire Comfortably in 2026 | RetirementHub',
     'desc':'How much do you need to retire comfortably in 2026? Learn the 25x rule, the 4% rule, and how inflation changes your number.',
     'h1':'How Much Do You Need to Retire Comfortably in 2026?'},
    {'slug':'401k-vs-ira','title':'401(k) vs IRA: Which Is Better in 2026? | RetirementHub',
     'desc':'401(k) vs IRA in 2026: contribution limits, taxes, employer match, and which account to fund first — explained in plain English.',
     'h1':'401(k) vs IRA: Which Is Better in 2026?'},
    {'slug':'when-to-take-social-security','title':'When to Take Social Security: 62, 67 or 70? | RetirementHub',
     'desc':'When should you take Social Security? Compare claiming at 62 vs 67 vs 70, break-even ages, and who should wait.',
     'h1':'When Should You Take Social Security: 62, 67, or 70?'},
  ],
  'posts':[
    {'slug':'retirement-mistakes-30s','title':'5 Retirement Mistakes to Avoid in Your 30s | RetirementHub',
     'desc':'The 5 biggest retirement mistakes people make in their 30s — and how to fix each one before it costs you six figures.',
     'h1':'5 Retirement Mistakes to Avoid in Your 30s'},
    {'slug':'roth-vs-traditional-401k','title':'Roth vs Traditional 401(k) in 2026 | RetirementHub',
     'desc':'Roth vs traditional 401(k): how to choose in 2026 based on your tax bracket now vs in retirement, with a simple decision rule.',
     'h1':'Roth vs Traditional 401(k): How to Choose in 2026'},
  ],
  'faqs':[
    ("How much do I need to retire?","A common rule of thumb is 25 times your annual retirement spending (the inverse of the 4% rule). If you will spend $60,000 per year, target roughly $1.5 million in today's dollars — then adjust for inflation to your retirement year with our retirement calculator."),
    ("What is the 4% rule?","The 4% rule suggests you can withdraw 4% of your portfolio in the first year of retirement, then adjust for inflation each year, with low odds of running out over 30 years. It is a planning guideline, not a guarantee."),
    ("How much should I contribute to my 401(k)?","At minimum, contribute enough to capture the full employer match — it is an instant 50–100% return. Many planners suggest 15% of income (including the match) as a baseline savings rate."),
    ("Is it better to claim Social Security at 62 or 70?","Claiming at 62 permanently reduces your benefit to about 70% of your full amount; waiting until 70 raises it to about 124%. If you expect an average or longer lifespan, waiting usually pays more over your lifetime."),
    ("Roth or traditional 401(k)?","Choose Roth if you expect to be in a higher tax bracket in retirement than today; choose traditional if you expect a lower bracket. When in doubt, splitting contributions hedges your tax bet."),
  ],
}

SITES['mortgage-tools'] = {
  'name':'MortgageTools','brand':'Mortgage<span>Tools</span>','base':'https://nan-mortgagetools.surge.sh/',
  'hero_lede':'Free mortgage calculators with taxes, insurance and PMI built in. Compare refinance break-evens, build amortization schedules, and learn how much house you can really afford.',
  'tools':[
    {'slug':'mortgage-calculator','name':'Mortgage Calculator','js':'mortgage-calculator.js',
     'card':'True monthly payment with property tax, home insurance and PMI — the full PITI breakdown, not just principal and interest.',
     'title':'Mortgage Calculator with Taxes & PMI | MortgageTools',
     'desc':'Free mortgage calculator with property tax, insurance and PMI. See your full PITI payment breakdown instantly.',
     'h1':'Mortgage Calculator: Your True Monthly Payment (PITI)',
     'lede':'Principal and interest is only part of the bill. Add taxes, insurance and PMI for the payment your lender actually cares about.'},
    {'slug':'refinance-calculator','name':'Refinance Calculator','js':'refinance-calculator.js',
     'card':'Is refinancing worth it? Enter your current loan and the new offer to get your break-even month and lifetime savings.',
     'title':'Refinance Calculator: Break-Even & Savings | MortgageTools',
     'desc':'Free refinance calculator: find your break-even month, monthly savings, and lifetime savings net of closing costs.',
     'h1':'Refinance Calculator: Break-Even & Lifetime Savings',
     'lede':'A lower rate is not automatically a good deal. See exactly when refinancing pays for itself — and when it does not.'},
    {'slug':'amortization','name':'Amortization Schedule Generator','js':'amortization.js',
     'card':'Full payment-by-payment schedule: principal vs interest every month, totals, and a downloadable CSV for your records.',
     'title':'Amortization Schedule Calculator (CSV) | MortgageTools',
     'desc':'Generate a full mortgage amortization schedule: every payment split into principal and interest, with totals and CSV download.',
     'h1':'Amortization Schedule Generator',
     'lede':'See where every dollar goes over the life of your loan — and download the full schedule as a CSV.'},
  ],
  'guides':[
    {'slug':'how-much-house-can-i-afford','title':'How Much House Can I Afford in 2026? | MortgageTools',
     'desc':'How much house can you afford in 2026? Use the 28/36 rule, DTI limits, and real payment math to find your safe price range.',
     'h1':'How Much House Can I Afford in 2026?'},
    {'slug':'refinance-rates-explained','title':'Refinance Rates Explained (2026 Guide) | MortgageTools',
     'desc':'Refinance rates explained: when refinancing makes sense, the 1% rule myth, break-even math, and costs to watch in 2026.',
     'h1':'Refinance Rates Explained: When Does It Make Sense?'},
    {'slug':'15-vs-30-year-mortgage','title':'15 vs 30 Year Mortgage: Which Wins? | MortgageTools',
     'desc':'15 vs 30 year mortgage compared: monthly payments, total interest, and who should pick which term in 2026.',
     'h1':'15 vs 30 Year Mortgage: Which One Wins?'},
  ],
  'posts':[
    {'slug':'first-time-buyer-mistakes','title':'7 First-Time Home Buyer Mistakes | MortgageTools',
     'desc':'The 7 costliest first-time home buyer mistakes — from skipping pre-approval to draining savings for the down payment.',
     'h1':'7 First-Time Home Buyer Mistakes to Avoid'},
    {'slug':'mortgage-points-worth-it','title':'Are Mortgage Points Worth It? | MortgageTools',
     'desc':'Are mortgage points worth it? How discount points work, the break-even math, and when paying points pays off.',
     'h1':'Are Mortgage Points Worth It?'},
  ],
  'faqs':[
    ("How is a mortgage payment calculated?","With the standard formula M = P·r(1+r)^n / ((1+r)^n − 1), where P is the loan amount, r the monthly rate, and n the number of payments. Taxes, insurance and PMI are added on top to get PITI."),
    ("What is PITI?","PITI stands for Principal, Interest, Taxes, and Insurance — the four parts of a typical mortgage payment. Lenders use PITI (plus PMI if your down payment is under 20%) to judge affordability."),
    ("When should I refinance?","Refinance when the monthly savings recover your closing costs well before you plan to sell or refinance again. A common shortcut: divide closing costs by monthly savings — that is your break-even in months."),
    ("Is a 15-year mortgage better than a 30-year?","A 15-year loan charges far less total interest and usually a lower rate, but the payment is much higher. Choose 15 years if the payment fits comfortably; choose 30 if you need flexibility."),
    ("How much house can I afford?","Lenders generally cap housing costs at 28% of gross income and total debts at 36–43%. Our mortgage calculator shows the real PITI payment so you can test price points against your budget."),
  ],
}

SITES['credit-tools'] = {
  'name':'CreditTools','brand':'Credit<span>Tools</span>','base':'https://nan-credittools.surge.sh/',
  'hero_lede':'Free credit and debt calculators: simulate what moves your score, compare avalanche vs snowball payoff, and check your debt-to-income ratio in seconds.',
  'tools':[
    {'slug':'credit-score-simulator','name':'Credit Score Simulator','js':'credit-score-simulator.js',
     'card':'Move the sliders — payment history, utilization, credit age — and watch an estimated score change, with personalized tips.',
     'title':'Credit Score Simulator: What Moves It | CreditTools',
     'desc':'Free credit score simulator: see how payment history, utilization, and credit age move an estimated score, with tips to improve.',
     'h1':'Credit Score Simulator: What Affects Your Score?',
     'lede':'Your score is a weighted mix of five factors. Slide each one to see how it moves an estimated score — and get tips to improve.'},
    {'slug':'debt-payoff','name':'Debt Payoff Calculator','js':'debt-payoff.js',
     'card':'Avalanche vs snowball, side by side: enter your debts and extra payment to see payoff dates, total interest, and the winner.',
     'title':'Debt Payoff Calculator: Avalanche vs Snowball | CreditTools',
     'desc':'Free debt payoff calculator: compare avalanche vs snowball payoff timelines, total interest, and see which strategy wins.',
     'h1':'Debt Payoff Calculator: Avalanche vs Snowball',
     'lede':'Two proven strategies, one verdict. Enter your debts and monthly extra payment to compare them side by side.'},
    {'slug':'dti-calculator','name':'DTI Calculator','js':'dti-calculator.js',
     'card':'Debt-to-income ratio in seconds: enter monthly debts and income for your DTI % and a mortgage-readiness verdict.',
     'title':'DTI Calculator: Debt-to-Income Ratio | CreditTools',
     'desc':'Free DTI calculator: compute your debt-to-income ratio and see if you meet mortgage lender thresholds.',
     'h1':'DTI Calculator: What Is Your Debt-to-Income Ratio?',
     'lede':'Lenders live by this number. Enter your monthly debts and gross income to get your DTI and a mortgage-readiness verdict.'},
  ],
  'guides':[
    {'slug':'how-to-build-credit-fast','title':'How to Build Credit Fast in 2026 | CreditTools',
     'desc':'How to build credit fast in 2026: 7 legitimate moves that raise your score, from utilization tricks to credit-builder loans.',
     'h1':'How to Build Credit Fast in 2026'},
    {'slug':'debt-avalanche-vs-snowball','title':'Debt Avalanche vs Snowball: Winner? | CreditTools',
     'desc':'Debt avalanche vs snowball: how each payoff method works, the math on interest saved, and which one to pick.',
     'h1':'Debt Avalanche vs Snowball: Which Payoff Method Wins?'},
    {'slug':'what-is-good-dti','title':'What Is a Good DTI Ratio? | CreditTools',
     'desc':'What is a good DTI ratio? Lender thresholds for mortgages, auto loans, and credit cards — plus how to lower yours.',
     'h1':'What Is a Good Debt-to-Income (DTI) Ratio?'},
  ],
  'posts':[
    {'slug':'credit-utilization-myths','title':'5 Credit Utilization Myths Debunked | CreditTools',
     'desc':'5 credit utilization myths debunked: 0% vs 1%, per-card vs overall, and what actually moves your score.',
     'h1':'5 Credit Utilization Myths Debunked'},
    {'slug':'pay-off-debt-or-save','title':'Pay Off Debt or Save First? | CreditTools',
     'desc':'Pay off debt or save first? A simple framework: emergency fund, high-interest debt, then investing — in order.',
     'h1':'Pay Off Debt or Save First?'},
  ],
  'faqs':[
    ("What affects my credit score the most?","Payment history (35%) and credit utilization (30%) together drive about two-thirds of a FICO score. Length of history, new credit, and credit mix make up the rest."),
    ("What is a good credit utilization ratio?","Under 30% is the standard guideline; under 10% is ideal for the best scores. Both per-card and overall utilization matter."),
    ("Avalanche or snowball — which pays off debt faster?","Avalanche (highest APR first) almost always costs less in interest. Snowball (smallest balance first) gives faster psychological wins. Our calculator compares both on your actual debts."),
    ("What is a good DTI ratio?","Under 36% is considered good and comfortably qualifies for most mortgages; 36–43% is the caution zone and the upper limit for many qualified mortgages; over 43% is high."),
    ("How fast can I build credit?","Utilization improvements can lift scores in 1–2 billing cycles. Late-payment recovery and new positive history take months. There is no legitimate overnight fix — beware anyone selling one."),
  ],
}

# ------------------------------------------------------------- page builders
def card(title, url, text, tag=None):
    t = '<span class="tag">'+tag+'</span>' if tag else ''
    return '<div class="card">'+t+'<h3><a href="'+url+'">'+title+'</a></h3><p>'+text+'</p><a class="card-link" href="'+url+'">Open &rarr;</a></div>'

def index_body(site):
    tools = ''.join(card(t['name'], 'tools/'+t['slug']+'.html', t['card'], 'Calculator') for t in site['tools'])
    guides = ''.join(card(g['h1'][:60], 'guides/'+g['slug']+'.html', g['desc'], 'Guide') for g in site['guides'])
    posts = ''.join(card(p['h1'][:60], 'blog/'+p['slug']+'.html', p['desc'], 'Blog') for p in site['posts'])
    faqs = ''.join('<details><summary>'+html.escape(q)+'</summary><div class="faq-a"><p>'+a+'</p></div></details>' for q,a in site['faqs'])
    return ('<section class="hero"><div class="wrap"><h1>'+site['index_h1']+'</h1>'
            '<p class="lede">'+site['hero_lede']+'</p>'
            '<div class="hero-ctas"><a class="btn" href="tools/index.html">Use the free calculators</a>'
            '<a class="btn btn-outline" href="guides/index.html">Read the guides</a></div></div></section>'
            '<section class="section"><div class="wrap"><h2>Free financial calculators</h2>'
            '<p class="sub">No signup, no spam — just math that works in your browser.</p>'
            '<div class="cards">'+tools+'</div></div></section>'
            '<section class="section section-alt"><div class="wrap"><h2>Guides &amp; articles</h2>'
            '<p class="sub">Plain-English explainers, updated for 2026.</p>'
            '<div class="cards">'+guides+posts+'</div></div></section>'
            '<section class="section"><div class="wrap"><h2>Frequently asked questions</h2><div class="faq">'+faqs+'</div></div></section>')

def list_body(title_text, h1, lede, items, urlfn, tag):
    cards = ''.join(card(i['h1'] if 'h1' in i else i['name'], urlfn(i), i.get('desc', i.get('card','')), tag) for i in items)
    return ('<div class="wrap page"><h1>'+h1+'</h1><p class="lede">'+lede+'</p>'
            '<div class="cards" style="margin-top:28px">'+cards+'</div></div>')

def article_body(h1, desc, body_html, related):
    rel = ''.join('<li><a href="'+u+'">'+t+'</a></li>' for t,u in related)
    return ('<div class="wrap page"><article><h1>'+h1+'</h1>'
            '<p class="article-meta">Updated '+DATE+'</p>'
            '<p class="lede">'+desc+'</p>'+body_html+
            '<section class="related"><h2>Related</h2><ul>'+rel+'</ul></section></article></div>')

def write_page(site_key, site, rel, title, desc, h1, body, jsonld='', scripts='', nav=''):
    root = '../' if '/' in rel else ''
    navs = {'nav_home':'','nav_tools':'','nav_guides':'','nav_blog':''}
    if nav: navs[nav] = ' class="active"'
    out = TEMPLATE.format(title=html.escape(title), desc=html.escape(desc),
        canonical=site['base']+rel, root=root, brand=site['brand'],
        body=body, jsonld=jsonld, scripts=scripts, adslot=ADSLOT,
        footer_brand=FOOTER_BRAND, **navs)
    p = os.path.join(BASE, site_key, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p,'w').write(out)
    return p

# per-site index H1s
SITES['retirement-hub']['index_h1'] = 'Free Retirement Calculators & Guides for 2026'
SITES['mortgage-tools']['index_h1'] = 'Free Mortgage Calculators & Home Loan Guides'
SITES['credit-tools']['index_h1'] = 'Free Credit & Debt Calculators That Actually Work'
for sk in SITES:
    SITES[sk]['index_title'] = {
        'retirement-hub':'RetirementHub — Free Retirement Calculators & Guides',
        'mortgage-tools':'MortgageTools — Free Mortgage Calculators & Guides',
        'credit-tools':'CreditTools — Free Credit & Debt Calculators'}[sk]
    SITES[sk]['index_desc'] = {
        'retirement-hub':'Free retirement calculators and guides: find your nest egg number, project your 401(k), and time Social Security right.',
        'mortgage-tools':'Free mortgage calculators: true PITI payments, refinance break-even, amortization schedules, and home-buying guides.',
        'credit-tools':'Free credit tools: score simulator, avalanche vs snowball debt payoff, DTI calculator, and credit-building guides.'}[sk]

# ------------------------------------------------------------- tool forms + explainers
FORMS = {}
EXPLAINERS = {}

# ---- retirement-hub ----
FORMS[('retirement-hub','retirement-calculator')] = """
<form id="retForm" class="tool-form">
<div class="field-row">
<div class="field"><label for="curAge">Current age</label><input type="number" id="curAge" min="18" max="90" value="35" required></div>
<div class="field"><label for="retAge">Retirement age</label><input type="number" id="retAge" min="19" max="94" value="65" required></div>
</div>
<div class="field"><label for="expenses">Annual expenses in retirement (today's dollars, $)</label><input type="number" id="expenses" min="1" step="1000" value="60000" required><div class="hint">What you expect to spend per year, in today's purchasing power.</div></div>
<div class="field-row">
<div class="field"><label for="inflation">Inflation (% per year)</label><input type="number" id="inflation" min="0" max="15" step="0.1" value="3" required></div>
<div class="field"><label for="retReturn">Expected investment return (% per year)</label><input type="number" id="retReturn" min="0" max="15" step="0.1" value="7" required></div>
</div>
<button type="submit" class="btn btn-primary">Calculate my number</button>
</form>"""
EXPLAINERS[('retirement-hub','retirement-calculator')] = """
<h2>How the math works</h2>
<p>First, your annual spending is grown by inflation to your retirement year: <strong>E &times; (1 + i)<sup>n</sup></strong>. Then we compute the lump sum needed at retirement to fund that spending through age 95 — the present value of an annuity: <strong>Nest egg = E<sub>ret</sub> &times; [1 &minus; (1+r)<sup>&minus;m</sup>] / r</strong>, where <em>m</em> is years in retirement. Finally, the monthly savings figure is the payment that grows to the nest egg at your expected return.</p>
<div class="formula">Nest egg = E&middot;(1+i)<sup>n</sup> &middot; [1 &minus; (1+r)<sup>&minus;m</sup>] / r &nbsp;&middot;&nbsp; Monthly = Nest egg &middot; (r/12) / ((1+r/12)<sup>12n</sup> &minus; 1)</div>
<h2>Tips</h2>
<ul><li>Social Security will cover part of your spending — subtract your expected benefit from expenses for a lower target.</li>
<li>Healthcare is the wildcard: Fidelity estimates a 65-year-old couple needs roughly $330,000 for medical costs in retirement.</li>
<li>Re-run the numbers yearly; small changes in return assumptions swing the target a lot.</li></ul>"""

FORMS[('retirement-hub','401k-calculator')] = """
<form id="k401Form" class="tool-form">
<div class="field-row">
<div class="field"><label for="kBalance">Current 401(k) balance ($)</label><input type="number" id="kBalance" min="0" step="1000" value="50000" required></div>
<div class="field"><label for="kSalary">Annual salary ($)</label><input type="number" id="kSalary" min="1" step="1000" value="90000" required></div>
</div>
<div class="field-row">
<div class="field"><label for="kContrib">Your contribution (% of salary)</label><input type="number" id="kContrib" min="0" max="100" step="0.5" value="10" required></div>
<div class="field"><label for="kReturn">Expected annual return (%)</label><input type="number" id="kReturn" min="0" max="15" step="0.1" value="7" required></div>
</div>
<div class="field-row">
<div class="field"><label for="kMatch">Employer match (% of salary)</label><input type="number" id="kMatch" min="0" max="100" step="0.5" value="50" required><div class="hint">e.g. 50 = employer adds 50&cent; per $1 you contribute</div></div>
<div class="field"><label for="kMatchCap">Match applies up to (% of salary)</label><input type="number" id="kMatchCap" min="0" max="100" step="0.5" value="6" required></div>
</div>
<div class="field"><label for="kYears">Years until retirement</label><input type="number" id="kYears" min="1" max="50" value="30" required></div>
<button type="submit" class="btn btn-primary">Project my 401(k)</button>
</form>"""
EXPLAINERS[('retirement-hub','401k-calculator')] = """
<h2>How the math works</h2>
<p>Each year, your balance grows by the expected return, then your contributions land: <strong>Balance<sub>next</sub> = Balance &times; (1 + r) + your contribution + employer match</strong>. Your contribution is salary &times; your %, and the employer match is salary &times; min(your %, cap %) &times; match %. The chart splits every dollar of growth from every dollar contributed so you can see compounding do the heavy lifting.</p>
<h2>Tips</h2>
<ul><li>Always contribute enough to get the <strong>full employer match</strong> — it is an instant 50&ndash;100% return.</li>
<li>In 2026, the 401(k) elective deferral limit is $24,500 ($31,000 if 50+). This projector ignores IRS caps — check yours.</li>
<li>Fees matter: a 1% higher expense ratio can cost six figures over a career. Prefer low-cost index funds.</li></ul>"""

FORMS[('retirement-hub','social-security')] = """
<form id="ssForm" class="tool-form">
<div class="field"><label for="fraBenefit">Estimated monthly benefit at full retirement age (67) ($)</label><input type="number" id="fraBenefit" min="1" step="10" value="2000" required><div class="hint">Find your estimate at ssa.gov — this is your PIA-based FRA amount.</div></div>
<div class="field"><label for="lifeExp">Life expectancy (age)</label><input type="number" id="lifeExp" min="63" max="110" value="85" required></div>
<div class="field"><label for="claimAge">Claiming age: <span class="range-val" id="claimAgeVal">67</span></label><input type="range" id="claimAge" min="62" max="70" step="1" value="67"></div>
<button type="submit" class="btn btn-primary">Compare claiming ages</button>
</form>"""
EXPLAINERS[('retirement-hub','social-security')] = """
<h2>How the math works</h2>
<p>Claiming before your full retirement age of 67 shrinks your check: <strong>5/9 of 1% per month for the first 36 months early, then 5/12 of 1% per month</strong>. That is why age 62 pays ~70%. Each year you delay past 67 adds <strong>8% delayed retirement credits</strong> until 70 (~124%). Lifetime totals multiply the monthly benefit by the years from claiming age to life expectancy.</p>
<h2>Tips</h2>
<ul><li>If you are married, coordinate: often the higher earner delays to 70 to maximize the survivor benefit.</li>
<li>Claiming early while still working can trigger the earnings test, temporarily reducing benefits.</li>
<li>Break-even between 62 and 70 is typically around age 78&ndash;80 — live longer and waiting wins.</li></ul>"""

# ---- mortgage-tools ----
FORMS[('mortgage-tools','mortgage-calculator')] = """
<form id="mtgForm" class="tool-form">
<div class="field-row">
<div class="field"><label for="homePrice">Home price ($)</label><input type="number" id="homePrice" min="1" step="1000" value="400000" required></div>
<div class="field"><label for="downPct">Down payment (%)</label><input type="number" id="downPct" min="0" max="99" step="0.5" value="20" required></div>
</div>
<div class="field-row">
<div class="field"><label for="mtgRate">Interest rate (% APR)</label><input type="number" id="mtgRate" min="0" max="20" step="0.125" value="6.5" required></div>
<div class="field"><label for="mtgTerm">Loan term</label><select id="mtgTerm"><option value="30" selected>30 years</option><option value="20">20 years</option><option value="15">15 years</option><option value="10">10 years</option></select></div>
</div>
<div class="field-row">
<div class="field"><label for="propTax">Annual property tax ($)</label><input type="number" id="propTax" min="0" step="100" value="4800"></div>
<div class="field"><label for="homeIns">Annual home insurance ($)</label><input type="number" id="homeIns" min="0" step="50" value="1800"></div>
</div>
<div class="field"><label for="pmi">Monthly PMI ($, 0 if 20%+ down)</label><input type="number" id="pmi" min="0" step="5" value="0"></div>
<button type="submit" class="btn btn-primary">Calculate payment</button>
</form>"""
EXPLAINERS[('mortgage-tools','mortgage-calculator')] = """
<h2>How the math works</h2>
<p>Principal &amp; interest uses the standard amortization formula: <strong>M = P&middot;r(1+r)<sup>n</sup> / ((1+r)<sup>n</sup> &minus; 1)</strong>, with r = APR/12 and n = years &times; 12. Property tax and insurance are divided by 12 and added, plus any PMI, to give PITI — the number lenders actually underwrite.</p>
<div class="formula">M = P&middot;r(1+r)<sup>n</sup> / ((1+r)<sup>n</sup> &minus; 1) &nbsp;&middot;&nbsp; PITI = M + tax/12 + insurance/12 + PMI</div>
<h2>Tips</h2>
<ul><li>Lenders generally want PITI under 28% of gross monthly income.</li>
<li>Less than 20% down usually means PMI ($30&ndash;$70 per $100k borrowed, monthly) until you reach 20% equity.</li>
<li>One extra payment per year on a 30-year loan cuts roughly 4&ndash;5 years off the term.</li></ul>"""

FORMS[('mortgage-tools','refinance-calculator')] = """
<form id="refiForm" class="tool-form">
<h3 style="margin-top:0">Your current loan</h3>
<div class="field-row">
<div class="field"><label for="curBalance">Remaining balance ($)</label><input type="number" id="curBalance" min="1" step="1000" value="280000" required></div>
<div class="field"><label for="curRate">Current rate (% APR)</label><input type="number" id="curRate" min="0" max="20" step="0.125" value="7" required></div>
</div>
<div class="field"><label for="remainYears">Years remaining</label><input type="number" id="remainYears" min="1" max="40" step="0.5" value="25" required></div>
<h3>The new loan</h3>
<div class="field-row">
<div class="field"><label for="newRate">New rate (% APR)</label><input type="number" id="newRate" min="0" max="20" step="0.125" value="5.75" required></div>
<div class="field"><label for="newTerm">New term</label><select id="newTerm"><option value="30" selected>30 years</option><option value="20">20 years</option><option value="15">15 years</option></select></div>
</div>
<div class="field"><label for="closingCosts">Closing costs ($)</label><input type="number" id="closingCosts" min="0" step="100" value="6000" required><div class="hint">Typically 2&ndash;5% of the loan amount: origination, appraisal, title, points.</div></div>
<button type="submit" class="btn btn-primary">Analyze refinance</button>
</form>"""
EXPLAINERS[('mortgage-tools','refinance-calculator')] = """
<h2>How the math works</h2>
<p>Both payments use the standard mortgage formula on the same balance. <strong>Break-even (months) = closing costs &divide; monthly savings</strong>. Lifetime savings = all remaining payments on the old loan &minus; all payments on the new loan &minus; closing costs. A longer new term can lower the payment while <em>raising</em> lifetime cost — watch both numbers.</p>
<h2>Tips</h2>
<ul><li>Forget the old "1% rule" — break-even math beats rules of thumb.</li>
<li>A no-closing-cost refinance just rolls costs into a higher rate; compare its break-even too.</li>
<li>If you will move or refinance again before break-even, do not refinance now.</li></ul>"""

FORMS[('mortgage-tools','amortization')] = """
<form id="amortForm" class="tool-form">
<div class="field"><label for="loanAmount">Loan amount ($)</label><input type="number" id="loanAmount" min="1" step="1000" value="350000" required></div>
<div class="field-row">
<div class="field"><label for="amortRate">Interest rate (% APR)</label><input type="number" id="amortRate" min="0" max="20" step="0.125" value="6.5" required></div>
<div class="field"><label for="amortTerm">Term (years)</label><input type="number" id="amortTerm" min="1" max="50" value="30" required></div>
</div>
<button type="submit" class="btn btn-primary">Generate schedule</button>
</form>"""
EXPLAINERS[('mortgage-tools','amortization')] = """
<h2>How the math works</h2>
<p>Each month, interest = remaining balance &times; APR/12; the rest of your fixed payment reduces principal. Early payments are mostly interest — on a 30-year loan at 6.5%, only about 15% of your first payment touches principal. The table recomputes this split for every payment until the balance hits zero.</p>
<h2>Tips</h2>
<ul><li>Extra principal payments early in the loan save the most interest.</li>
<li>Use the CSV download to model "what if I pay $200 extra?" scenarios in a spreadsheet.</li>
<li>Biweekly payments (26 half-payments/year) equal one extra full payment annually.</li></ul>"""

# ---- credit-tools ----
FORMS[('credit-tools','credit-score-simulator')] = """
<form id="csForm" class="tool-form">
<div class="field"><label for="ontime">On-time payments: <span class="range-val" id="ontimeVal">100%</span></label><input type="range" id="ontime" min="50" max="100" step="1" value="100"><div class="hint">Share of payments made on time (35% of score)</div></div>
<div class="field"><label for="util">Credit utilization: <span class="range-val" id="utilVal">10%</span></label><input type="range" id="util" min="0" max="100" step="1" value="10"><div class="hint">Balances as % of limits (30% of score)</div></div>
<div class="field"><label for="ageYears">Age of oldest account: <span class="range-val" id="ageYearsVal">8 yrs</span></label><input type="range" id="ageYears" min="0" max="25" step="1" value="8"><div class="hint">Length of credit history (15% of score)</div></div>
<div class="field"><label for="inquiries">Hard inquiries (last 2 years): <span class="range-val" id="inquiriesVal">1</span></label><input type="range" id="inquiries" min="0" max="10" step="1" value="1"><div class="hint">New credit applications (10% of score)</div></div>
<div class="field"><label for="mixTypes">Types of credit: <span class="range-val" id="mixTypesVal">2</span></label><input type="range" id="mixTypes" min="0" max="5" step="1" value="2"><div class="hint">e.g. cards, auto loan, mortgage (10% of score)</div></div>
<button type="submit" class="btn btn-primary">Estimate my score</button>
</form>"""
EXPLAINERS[('credit-tools','credit-score-simulator')] = """
<h2>How the estimate works</h2>
<p>This simulator mirrors the well-known FICO factor weights: <strong>payment history 35%, amounts owed (utilization) 30%, length of history 15%, new credit 10%, credit mix 10%</strong>. Each slider is normalized to 0&ndash;1, weighted, and mapped to the 300&ndash;850 range. It is an <strong>educational model</strong> — your real score comes from bureau data and proprietary formulas.</p>
<h2>Score bands</h2>
<ul><li><strong>800&ndash;850 Exceptional</strong> — best rates and approvals</li>
<li><strong>740&ndash;799 Very Good</strong> — above-average rates</li>
<li><strong>670&ndash;739 Good</strong> — most approvals, near-median rates</li>
<li><strong>580&ndash;669 Fair</strong> — subprime offers, higher rates</li>
<li><strong>300&ndash;579 Poor</strong> — rebuild with secured cards</li></ul>"""

FORMS[('credit-tools','debt-payoff')] = """
<form id="debtForm" class="tool-form">
<div id="debtList"></div>
<p><button type="button" class="btn btn-small btn-outline" id="addDebt" style="color:var(--primary);border-color:var(--primary)">+ Add debt</button></p>
<div class="field"><label for="extraPay">Extra payment per month ($)</label><input type="number" id="extraPay" min="0" step="10" value="200" required><div class="hint">On top of all minimum payments, thrown at the priority debt.</div></div>
<button type="submit" class="btn btn-primary">Compare strategies</button>
</form>"""
EXPLAINERS[('credit-tools','debt-payoff')] = """
<h2>How the math works</h2>
<p>Each month the simulator accrues interest on every balance (APR/12), applies your minimums to all debts, then throws the extra payment at the priority debt — highest APR for <strong>avalanche</strong>, smallest balance for <strong>snowball</strong> — cascading to the next debt as each is cleared. Avalanche almost always minimizes interest; snowball delivers faster first wins.</p>
<h2>Tips</h2>
<ul><li>Never miss minimums — one 30-day late can cost 60&ndash;110 score points.</li>
<li>If minimums do not cover interest, no strategy works: raise payments or negotiate APRs first.</li>
<li>Consider a 0% balance-transfer card for high-APR debt — but only with a payoff plan before the promo ends.</li></ul>"""

FORMS[('credit-tools','dti-calculator')] = """
<form id="dtiForm" class="tool-form">
<div class="field"><label for="grossIncome">Gross monthly income — before taxes ($)</label><input type="number" id="grossIncome" min="1" step="100" value="7000" required></div>
<h3 style="margin-top:6px">Monthly debt payments (minimums)</h3>
<div class="field"><label for="dHousing">Housing (rent or PITI) ($)</label><input type="number" id="dHousing" min="0" step="10" value="1800" required></div>
<div class="field-row">
<div class="field"><label for="dCar">Auto loan ($)</label><input type="number" id="dCar" min="0" step="10" value="350" required></div>
<div class="field"><label for="dCards">Credit cards ($)</label><input type="number" id="dCards" min="0" step="10" value="120" required></div>
</div>
<div class="field-row">
<div class="field"><label for="dStudent">Student loans ($)</label><input type="number" id="dStudent" min="0" step="10" value="200" required></div>
<div class="field"><label for="dOther">Other debts ($)</label><input type="number" id="dOther" min="0" step="10" value="0" required></div>
</div>
<button type="submit" class="btn btn-primary">Calculate DTI</button>
</form>"""
EXPLAINERS[('credit-tools','dti-calculator')] = """
<h2>How the math works</h2>
<p><strong>DTI = total monthly debt payments &divide; gross monthly income &times; 100</strong>. Lenders use two flavors: front-end (housing only) and back-end (all debts). This calculator shows back-end DTI, the number that decides most mortgage approvals.</p>
<div class="formula">DTI = (housing + auto + cards + student + other) / gross monthly income &times; 100</div>
<h2>Lender thresholds</h2>
<ul><li><strong>Under 36%</strong> — good; comfortably qualifies for conventional mortgages.</li>
<li><strong>36&ndash;43%</strong> — caution; the upper limit for many qualified mortgages.</li>
<li><strong>Over 43%</strong> — high; most conventional lenders decline, FHA may stretch to 50%+ with compensating factors.</li></ul>"""

RESULT_IDS = {
  'retirement-calculator':'retResults','401k-calculator':'k401Results','social-security':'ssResults',
  'mortgage-calculator':'mtgResults','refinance-calculator':'refiResults','amortization':'amortResults',
  'credit-score-simulator':'csResults','debt-payoff':'debtResults','dti-calculator':'dtiResults'}

def tool_body(site_key, site, t):
    key = (site_key, t['slug'])
    others = [o for o in site['tools'] if o['slug'] != t['slug']]
    rel = ''.join('<li><a href="'+o['slug']+'.html">'+o['name']+'</a></li>' for o in others)
    rel += ''.join('<li><a href="../guides/'+g['slug']+'.html">'+g['h1']+'</a></li>' for g in site['guides'][:2])
    scripts = '<script src="../js/'+t['js']+'"></script>'
    body = ('<div class="wrap page"><h1>'+t['h1']+'</h1><p class="lede">'+t['lede']+'</p>'+DISCLAIMER+
      '<div class="tool-grid"><div>'+FORMS[key]+'</div>'+
      '<div class="tool-results" id="'+RESULT_IDS[t['slug']]+'" aria-live="polite"><p class="hint">Fill in the form and submit to see your results.</p></div></div>'+
      '<div class="tool-explainer">'+EXPLAINERS[key]+'</div>'+
      '<section class="related"><h2>Related tools &amp; guides</h2><ul>'+rel+'</ul></section></div>')
    return body, scripts

# ------------------------------------------------------------- article bodies
GUIDES = {}
POSTS = {}

# ================= SITE 1 =================
GUIDES[('retirement-hub','how-much-to-retire')] = """
<h2>The short answer: 25x your annual spending</h2>
<p>The most-used rule of thumb in retirement planning is simple: save <strong>25 times what you plan to spend in one year</strong>. Spend $60,000 a year in retirement? Your target is about $1.5 million in today's dollars. This is the inverse of the famous <strong>4% rule</strong> — withdraw 4% in year one, adjust for inflation after, and history says the money lasts 30 years.</p>
<h2>Why "today's dollars" matters</h2>
<p>$1.5 million sounds big until inflation shrinks it. At 3% inflation, $1.5 million of purchasing power today requires about <strong>$2.43 million in 30 years</strong>. That is why our <a href="../tools/retirement-calculator.html">retirement calculator</a> grows your spending by inflation first, then computes the nest egg — most people underestimate their number by ignoring this step.</p>
<h2>Adjust the rule to your life</h2>
<ul>
<li><strong>Retiring early?</strong> Use 30–33x spending (a 3–3.3% withdrawal rate) for a 40+ year retirement.</li>
<li><strong>Big Social Security check?</strong> Subtract expected benefits from your spending before multiplying. A $24,000/year benefit cuts a $1.5M target by $600,000.</li>
<li><strong>High-cost city?</strong> Housing dominates retirement budgets; relocating can cut your number by six figures.</li>
</ul>
<h2>The savings rate that gets you there</h2>
<p>Rules of thumb for targets are useless without a savings plan. Financial planners often suggest saving <strong>15% of income (including employer match)</strong> starting in your 20s or 30s. Starting at 35 with a 7% return, 15% of a $90,000 salary plus a typical match grows to roughly $1.5M by 65 — run your own numbers in our <a href="../tools/401k-calculator.html">401(k) projector</a>.</p>
<h2>Don't forget healthcare</h2>
<p>Fidelity estimates a 65-year-old couple retiring in 2026 needs around <strong>$330,000 for healthcare</strong> alone. An HSA — triple tax-advantaged — is the best tool for this bucket if you have a high-deductible plan.</p>
<h2>Bottom line</h2>
<p>Start with 25x spending, adjust for inflation, subtract Social Security, and save 15% along the way. Then personalize it: <a href="../tools/retirement-calculator.html">calculate your exact number</a> and revisit it every year.</p>"""

GUIDES[('retirement-hub','401k-vs-ira')] = """
<h2>The one-sentence answer</h2>
<p><strong>Fund the 401(k) up to the employer match first, then an IRA, then back to the 401(k).</strong> That order captures free money, then the IRA's flexibility, then the 401(k)'s high limits.</p>
<h2>2026 contribution limits</h2>
<ul>
<li><strong>401(k):</strong> $24,500 elective deferrals ($31,000 if 50+); $70,000 total with employer contributions.</li>
<li><strong>Traditional/Roth IRA:</strong> $7,500 ($8,600 if 50+), but deductibility and Roth eligibility phase out at higher incomes.</li>
</ul>
<h2>Where each account wins</h2>
<h3>401(k) advantages</h3>
<ul><li><strong>Employer match</strong> — an instant 50–100% return you cannot get in an IRA.</li>
<li>Much higher contribution limits for big savers.</li>
<li>Automatic payroll deduction (you never see the money).</li></ul>
<h3>IRA advantages</h3>
<ul><li><strong>Unlimited investment choice</strong> — any stock, bond, or fund, vs your plan's menu.</li>
<li>Usually lower fees than 401(k) plans.</li>
<li>Roth IRA: tax-free withdrawals <em>and</em> penalty-free access to contributions anytime.</li></ul>
<h2>The funding order that works for most people</h2>
<ol>
<li>401(k) to the full match — see what compounding does in our <a href="../tools/401k-calculator.html">401(k) projector</a>.</li>
<li>Max a Roth IRA (if eligible) for tax diversification.</li>
<li>Back to the 401(k) up to the max.</li>
<li>Taxable brokerage for the rest.</li>
</ol>
<h2>Roth vs traditional within each</h2>
<p>This is a separate decision from 401(k)-vs-IRA: it is about <em>when</em> you pay tax. Our guide to <a href="../blog/roth-vs-traditional-401k.html">Roth vs traditional 401(k)</a> walks through the decision rule.</p>
<h2>Bottom line</h2>
<p>Do not leave match money on the table, use the IRA for flexibility and fund choice, and let the 401(k)'s big limits do the heavy lifting after that.</p>"""

GUIDES[('retirement-hub','when-to-take-social-security')] = """
<h2>The three numbers that matter</h2>
<p>With a full retirement age of 67: claim at <strong>62 and you get ~70%</strong> of your full benefit for life; at <strong>67 you get 100%</strong>; wait until <strong>70 and you get ~124%</strong>. There is no benefit to waiting past 70. Try the slider in our <a href="../tools/social-security.html">Social Security timing analyzer</a> to see your own numbers.</p>
<h2>The break-even math</h2>
<p>Claiming at 62 vs 70 is a bet on longevity. With a $2,000 FRA benefit: 62 pays $1,400/mo, 70 pays $2,480/mo. The 70-claimer catches up around <strong>age 78–80</strong> and pulls ahead every year after. Live to 90 and waiting was worth roughly $200,000+ in extra lifetime benefits.</p>
<h2>When claiming early makes sense</h2>
<ul><li>Health issues or family history suggest a shorter lifespan.</li>
<li>You need the income and have no other bridge funds.</li>
<li>You are the lower-earning spouse and the higher earner is delaying (maximizing the survivor benefit).</li></ul>
<h2>When waiting wins</h2>
<ul><li>You are healthy with longevity in the family.</li>
<li>You can fund ages 62–70 from savings or part-time work.</li>
<li>You are the higher earner — your delayed benefit becomes your spouse's survivor benefit.</li></ul>
<h2>Watch the earnings test</h2>
<p>Claim before FRA while earning above ~$23,400 (2026) and Social Security withholds $1 for every $2 over the limit. It is not lost forever — benefits are recalculated at FRA — but it can surprise early claimers.</p>
<h2>Bottom line</h2>
<p>Single and average health? The math favors waiting if you can afford the bridge years. Compare your scenarios in the <a href="../tools/social-security.html">timing analyzer</a> before you file — the decision is largely irreversible after 12 months.</p>"""

POSTS[('retirement-hub','retirement-mistakes-30s')] = """
<p>Your 30s are the highest-leverage decade in retirement planning: every dollar invested now has 30+ years to compound. Here are the five mistakes that cost thirty-somethings six figures.</p>
<h2>1. Leaving the employer match on the table</h2>
<p>A 50% match on 6% of salary is a <strong>3% raise you throw away</strong> every year you skip it. Over 30 years at 7%, that neglected match alone compounds to hundreds of thousands. Contribute at least to the match — today.</p>
<h2>2. Keeping everything in the default fund</h2>
<p>Target-date funds are fine, but many 401(k)s default to ultra-conservative options. At 35, you can weather volatility — check that your allocation matches a 30-year horizon, not a 3-year one.</p>
<h2>3. Ignoring fees</h2>
<p>A 1% annual fee vs 0.1% sounds trivial. On $500,000 over 25 years at 7%, it is the difference of roughly <strong>$200,000</strong>. Favor low-cost index funds; your plan's fee disclosure is worth 10 minutes.</p>
<h2>4. No Roth diversification</h2>
<p>All-traditional savings is a tax time bomb if rates rise. Even small Roth contributions in your 30s — when earnings (and brackets) are often lower — buy valuable tax-free income later. See <a href="roth-vs-traditional-401k.html">Roth vs traditional</a>.</p>
<h2>5. Lifestyle inflation eating every raise</h2>
<p>The fix that requires zero sacrifice: <strong>save half of every raise</strong>. A 3% raise becomes 1.5% more spending and 1.5% more saving — your lifestyle still grows, and your savings rate climbs on autopilot.</p>
<h2>The fix in one afternoon</h2>
<p>Raise contributions to the match, check your fund allocation and fees, open a Roth IRA, and automate half-raise savings. Then <a href="../tools/retirement-calculator.html">calculate your number</a> so you know exactly what you are aiming at.</p>"""

POSTS[('retirement-hub','roth-vs-traditional-401k')] = """
<h2>The decision rule</h2>
<p>Pay tax now (Roth) or later (traditional)? <strong>Choose Roth if your tax rate in retirement will be higher than today; traditional if it will be lower.</strong> Young earners early in their careers usually win with Roth; peak earners usually win with traditional.</p>
<h2>How they differ</h2>
<ul><li><strong>Traditional:</strong> pre-tax contributions cut today's tax bill; withdrawals taxed as income in retirement. Required minimum distributions start at 75.</li>
<li><strong>Roth 401(k):</strong> after-tax contributions; qualified withdrawals (59&frac12; + 5-year rule) are tax-free, including all growth. No RMDs for the original owner.</li></ul>
<h2>When Roth wins</h2>
<ul><li>You are in the 12% bracket now and expect 22%+ later.</li>
<li>You want tax-free income to manage Medicare IRMAA brackets in retirement.</li>
<li>You expect a pension or large traditional balance already pushing up future taxable income.</li></ul>
<h2>When traditional wins</h2>
<ul><li>You are in the 32%+ bracket now and expect lower income in retirement.</li>
<li>You need the deduction today to afford maxing contributions.</li>
<li>You plan early retirement with low-income Roth-conversion years.</li></ul>
<h2>The hedge: split it</h2>
<p>Uncertain? Split contributions — say 50/50. Tax diversification is the only free lunch here: it lets future-you withdraw strategically from whichever bucket is cheapest each year.</p>
<h2>Bottom line</h2>
<p>Match your choice to your lifetime tax curve, not this year's refund. And whichever you pick, the <a href="../tools/401k-calculator.html">401(k) projector</a> shows what decades of compounding do with it.</p>"""

# ================= SITE 2 =================
GUIDES[('mortgage-tools','how-much-house-can-i-afford')] = """
<h2>The 28/36 rule lenders use</h2>
<p>Most lenders cap your <strong>housing costs at 28% of gross monthly income</strong> and your <strong>total debts at 36%</strong> (up to 43–45% for qualified mortgages with compensating factors). On a $100,000 salary ($8,333/month), that means roughly $2,333/month for PITI — principal, interest, taxes, and insurance.</p>
<h2>Work backward from the payment</h2>
<p>Forget price-first shopping: start from the monthly payment you can afford, then see what price that buys at today's rates. Our <a href="../tools/mortgage-calculator.html">mortgage calculator</a> includes taxes, insurance, and PMI so you test the <em>real</em> payment, not just principal and interest. At 6.5% with 20% down, a $2,333 PITI payment buys roughly a $330,000–$350,000 home depending on local taxes.</p>
<h2>The costs buyers forget</h2>
<ul><li><strong>Closing costs:</strong> 2–5% of the price, due at signing.</li>
<li><strong>Maintenance:</strong> budget ~1% of home value per year.</li>
<li><strong>PMI:</strong> under 20% down adds $30–$70/month per $100k borrowed.</li>
<li><strong>HOA dues</strong> — and special assessments.</li></ul>
<h2>Down payment: how much is enough?</h2>
<p>20% avoids PMI, but waiting years to save it while prices and rents rise can cost more than PMI itself. Many buyers do fine with 10% down; 3–5% works with FHA or conventional low-down programs if the payment fits the 28% rule.</p>
<h2>Stress-test before you offer</h2>
<p>Run three scenarios in the calculator: today's rate, rate +1%, and one income drop. If the payment still fits your budget in all three, you can buy with confidence. Also generate an <a href="../tools/amortization.html">amortization schedule</a> to see total interest before you commit.</p>
<h2>Bottom line</h2>
<p>Affordability = payment, not price. Stay near 28% of gross income for housing, keep total debts under 36–43%, and keep a 3–6 month emergency fund <em>after</em> closing.</p>"""

GUIDES[('mortgage-tools','refinance-rates-explained')] = """
<h2>What a refinance actually does</h2>
<p>Refinancing replaces your current mortgage with a new one — ideally at a lower rate, a shorter term, or both. You pay <strong>closing costs of 2–5%</strong> for the privilege, so the deal only works if the savings repay those costs before you sell or refinance again.</p>
<h2>Forget the "1% rule"</h2>
<p>The old advice — refinance when rates drop 1% — ignores costs and timelines. The only number that matters is <strong>break-even: closing costs ÷ monthly savings</strong>. A 0.5% rate drop with low costs and a long stay can beat a 1% drop with $12,000 in fees. Run your exact numbers in our <a href="../tools/refinance-calculator.html">refinance calculator</a>.</p>
<h2>Three refinance flavors</h2>
<ul><li><strong>Rate-and-term:</strong> lower rate or shorter term, same balance. The classic win.</li>
<li><strong>Cash-out:</strong> borrow more than you owe, pocket the difference. Useful for high-interest debt payoff; risky as lifestyle funding.</li>
<li><strong>No-closing-cost:</strong> costs rolled into a slightly higher rate. Break-even is instant, but lifetime cost is higher — compare both.</li></ul>
<h2>Costs to watch</h2>
<p>Origination fees, discount points, appraisal, title insurance, and prepaid escrows. Get a Loan Estimate from at least three lenders — the same rate can hide very different fees.</p>
<h2>The term trap</h2>
<p>Refinancing a 25-years-remaining loan into a new 30-year loan almost always lowers the payment — and often <em>raises</em> total interest paid. If you refinance, consider keeping the term close to what remains, or commit to paying extra principal.</p>
<h2>Bottom line</h2>
<p>Refinance when break-even lands well before your horizon and lifetime savings are positive net of costs. Verify with the <a href="../tools/refinance-calculator.html">break-even calculator</a> — not a rule of thumb.</p>"""

GUIDES[('mortgage-tools','15-vs-30-year-mortgage')] = """
<h2>The payment gap</h2>
<p>On a $350,000 loan at typical 2026 rates (say 6.0% for 15-yr vs 6.5% for 30-yr): the 15-year payment is about <strong>$2,950/month</strong> vs <strong>$2,210/month</strong> for 30 years — roughly 33% higher. That gap is the whole decision.</p>
<h2>Total interest: no contest</h2>
<p>The 15-year loan costs about <strong>$181,000 in total interest</strong>; the 30-year costs about <strong>$446,000</strong> — a $265,000 difference. Shorter term + usually lower rate = massive savings, <em>if</em> you can afford the payment.</p>
<h2>When 15 years wins</h2>
<ul><li>The higher payment still leaves 3–6 months of emergency savings intact.</li>
<li>You are buying well below your max approval (payment &lt; 25% of income).</li>
<li>You value being mortgage-free before retirement over flexibility.</li></ul>
<h2>When 30 years wins</h2>
<ul><li>The 15-year payment would strain your budget — a stretched buyer should never take it.</li>
<li>You invest the difference: 30-year + investing the $740/month gap often beats 15-year at historical market returns (with more risk).</li>
<li>You want flexibility for career changes, kids, or variable income.</li></ul>
<h2>The hybrid: 30-year loan, 15-year behavior</h2>
<p>Take the 30-year for safety, then pay extra principal to mimic a 15-year payoff. You keep the lower required payment as a safety valve. Model it with an <a href="../tools/amortization.html">amortization schedule</a>.</p>
<h2>Bottom line</h2>
<p>15 years builds equity furiously; 30 years buys flexibility. The wrong choice is the one whose payment keeps you up at night — run both in the <a href="../tools/mortgage-calculator.html">mortgage calculator</a> first.</p>"""

POSTS[('mortgage-tools','first-time-buyer-mistakes')] = """
<h2>1. House-hunting before pre-approval</h2>
<p>Falling for a home you cannot finance wastes everyone's time — and in hot markets, sellers ignore offers without a pre-approval letter. Get pre-approved <em>before</em> the first showing.</p>
<h2>2. Draining every dollar for the down payment</h2>
<p>Putting 20% down then having $2,000 left is how one roof leak becomes a credit-card crisis. Keep a <strong>3–6 month emergency fund after closing</strong>, even if it means 10% down plus PMI.</p>
<h2>3. Ignoring the true monthly payment</h2>
<p>Principal and interest is maybe 70% of the bill. Taxes, insurance, PMI, and HOA make up the rest — always budget the full <a href="../tools/mortgage-calculator.html">PITI payment</a>.</p>
<h2>4. Big purchases before closing</h2>
<p>Financing furniture or a car between pre-approval and closing changes your debt-to-income ratio and can kill the loan. Freeze new credit until keys are in hand.</p>
<h2>5. Skipping the inspection to "win" the bid</h2>
<p>Waiving inspection on a 40-year-old house is gambling five figures to save $500. At minimum, get an informational inspection even if you do not make it a contingency.</p>
<h2>6. Shopping lenders once</h2>
<p>Rates and fees vary wildly. Three Loan Estimates take an afternoon and routinely save <strong>$3,000–$10,000</strong> over the loan's life.</p>
<h2>7. Forgetting closing costs</h2>
<p>Budget 2–5% of the price on top of the down payment. On a $400,000 home, that is $8,000–$20,000 due at the table.</p>
<h2>Buy smart</h2>
<p>Avoid these seven and you are ahead of most buyers. Start with <a href="../guides/how-much-house-can-i-afford.html">how much house you can afford</a>, then run the payment math before every offer.</p>"""

POSTS[('mortgage-tools','mortgage-points-worth-it')] = """
<h2>What points are</h2>
<p>One <strong>discount point</strong> costs 1% of the loan amount upfront and typically cuts your rate by about 0.25%. On a $350,000 loan, one point = $3,500 for roughly 0.25% off your rate.</p>
<h2>The break-even math</h2>
<p>Divide the point cost by the monthly savings. If $3,500 in points saves $55/month, break-even is <strong>64 months</strong> — over 5 years. Sell or refinance before then and you lost money; stay longer and you profit every month after.</p>
<h2>When points make sense</h2>
<ul><li>You will stay well past break-even (7+ years is the sweet spot).</li>
<li>You have extra cash <em>after</em> down payment and emergency fund.</li>
<li>Rates are high and you expect to hold the loan long-term.</li></ul>
<h2>When points are a bad deal</h2>
<ul><li>You might move or refinance within 5 years.</li>
<li>Paying points drains your emergency fund.</li>
<li>The lender's "points" are mostly origination markup — compare the APR, not just the rate.</li></ul>
<h2>Negative points (lender credits)</h2>
<p>The mirror image: accept a slightly higher rate in exchange for the lender covering closing costs. Smart if cash is tight or your horizon is short.</p>
<h2>Bottom line</h2>
<p>Points are a bet on how long you keep the loan. Do the break-even division honestly — our <a href="../tools/refinance-calculator.html">refinance calculator</a> uses the same logic and works for purchase points too.</p>"""

# ================= SITE 3 =================
GUIDES[('credit-tools','how-to-build-credit-fast')] = """
<h2>First: what "fast" realistically means</h2>
<p>No legitimate method rebuilds credit overnight. But <strong>utilization changes can lift scores in 1–2 billing cycles</strong>, and several other moves compound over 3–6 months. Here are the seven that actually work, in order of impact.</p>
<h2>1. Crush utilization below 30% (then 10%)</h2>
<p>Utilization is 30% of your score and has no memory — last month's high balance stops hurting once reported low. Pay cards <em>before</em> the statement closes so a low balance gets reported. Model the impact in our <a href="../tools/credit-score-simulator.html">score simulator</a>.</p>
<h2>2. Never miss a payment again — autopay everything</h2>
<p>Payment history is 35% of your score and late payments linger 7 years. Set at least the minimum on autopay today; this single habit prevents the most damage.</p>
<h2>3. Become an authorized user</h2>
<p>Added to a family member's old, clean, low-balance card, their history can appear on your report — sometimes worth dozens of points within a month or two.</p>
<h2>4. Get a credit-builder loan or secured card</h2>
<p>No score at all? A secured card (deposit = limit) or credit-builder loan creates the positive history algorithms need. Use lightly, pay in full.</p>
<h2>5. Keep old cards open</h2>
<p>Closing your oldest card shortens your average account age and cuts available credit — both hurt. Use it for a small recurring charge instead.</p>
<h2>6. Dispute genuine errors</h2>
<p>About 1 in 5 reports has an error. Pull free reports at AnnualCreditReport.com and dispute anything wrong with all three bureaus — removals can jump scores fast.</p>
<h2>7. Ask for limit increases (not new cards)</h2>
<p>A higher limit with the same balance instantly lowers utilization — without a hard inquiry if you ask the right way (many issuers do soft pulls for this).</p>
<h2>What to avoid</h2>
<p>Anyone promising a "new credit identity," disputing accurate negatives en masse, or charging upfront fees is selling a scam. Real building is boring: on-time payments, low utilization, time.</p>"""

GUIDES[('credit-tools','debt-avalanche-vs-snowball')] = """
<h2>The two methods</h2>
<ul><li><strong>Avalanche:</strong> pay minimums on everything, throw all extra cash at the <em>highest APR</em> debt first.</li>
<li><strong>Snowball:</strong> pay minimums on everything, throw all extra cash at the <em>smallest balance</em> first.</li></ul>
<p>Both beat minimum-only payments by years. The question is only which priority order fits you.</p>
<h2>The math: avalanche wins on interest</h2>
<p>Avalanche targets the most expensive debt first, so it almost always minimizes total interest. On $15,000 across three cards with a $300/month extra payment, avalanche typically saves <strong>hundreds to thousands</strong> vs snowball. See your exact numbers in our <a href="../tools/debt-payoff.html">side-by-side calculator</a> — on real debt profiles the gap is often $1,000–$5,000.</p>
<h2>The psychology: snowball wins on momentum</h2>
<p>Killing a small debt in 3 months delivers a dopamine hit that keeps people going; grinding a $12,000 balance for a year can feel hopeless. Studies on debt payoff find <strong>completion rates are higher with snowball</strong> — the mathematically inferior method people actually finish beats the perfect plan they abandon.</p>
<h2>How to choose</h2>
<ul><li><strong>Pick avalanche</strong> if the interest gap is large ($1,000+) and you are disciplined — it is free money.</li>
<li><strong>Pick snowball</strong> if you have many small debts, have quit payoff plans before, or need quick wins.</li>
<li><strong>Hybrid:</strong> snowball the tiny nuisance debts first (2–3 months), then switch to avalanche for the big balances.</li></ul>
<h2>Prerequisites for either</h2>
<p>Minimums must cover interest on every debt (else balances grow forever), and you need a small emergency buffer ($1,000 starter) so one car repair does not restart the cycle.</p>
<h2>Bottom line</h2>
<p>Run both on your debts in the <a href="../tools/debt-payoff.html">debt payoff calculator</a>. If avalanche saves little, take snowball's motivation; if it saves thousands, take the money.</p>"""

GUIDES[('credit-tools','what-is-good-dti')] = """
<h2>DTI in one sentence</h2>
<p>Your debt-to-income ratio is <strong>total monthly debt payments ÷ gross monthly income</strong>. $2,500 in debts on $7,000 income = 35.7% DTI. Check yours in seconds with our <a href="../tools/dti-calculator.html">DTI calculator</a>.</p>
<h2>The thresholds lenders use</h2>
<ul><li><strong>Under 36% — good.</strong> The classic "healthy" zone; qualifies for the best conventional mortgage terms.</li>
<li><strong>36–43% — caution.</strong> 43% is the general ceiling for Qualified Mortgages; approvals get stricter and rates worse.</li>
<li><strong>Over 43% — high.</strong> Most conventional lenders decline. FHA loans may stretch to 50–57% with strong compensating factors (big reserves, high credit score).</li></ul>
<h2>Front-end vs back-end DTI</h2>
<p>Mortgage lenders check two numbers: <strong>front-end</strong> (housing costs only — target ≤28%) and <strong>back-end</strong> (all debts — target ≤36%). Auto lenders and landlords mostly care about the back-end number.</p>
<h2>What counts as debt?</h2>
<p>Minimum monthly payments on: mortgage/rent, auto loans, student loans, credit cards, personal loans, child support. Groceries, utilities, insurance, and taxes do <em>not</em> count — only debt payments.</p>
<h2>How to lower your DTI fast</h2>
<ul><li><strong>Pay off small debts entirely</strong> — eliminating a $150 minimum moves DTI more than trimming a big balance.</li>
<li>Refinance high-payment debts to longer terms (lowers the monthly, the only thing DTI sees).</li>
<li>Raise income — a side gig counts once documented.</li>
<li>Avoid new debt before applying: that car loan can single-handedly kill a mortgage approval.</li></ul>
<h2>Bottom line</h2>
<p>Under 36% keeps every door open. If you are buying a home within a year, get DTI down <em>before</em> the application — not after a denial.</p>"""

POSTS[('credit-tools','credit-utilization-myths')] = """
<h2>Myth 1: "0% utilization is best"</h2>
<p>Slightly false. Scoring models slightly prefer <strong>1–9% over 0%</strong> — a tiny reported balance shows active, responsible use. The difference is small (a few points), but 0% across all cards is not the optimum people claim.</p>
<h2>Myth 2: "Only overall utilization matters"</h2>
<p>Both matter. Maxing out one card at 95% while others sit at 0% still hurts, even if overall utilization is 20%. Keep <strong>each card under 30%</strong>, not just the total.</p>
<h2>Myth 3: "Paying in full means low utilization"</h2>
<p>Only if you pay <em>before the statement closes</em>. Issuers report the statement balance — charge $3,000, pay in full after the statement, and the bureaus still saw 60% utilization that month. Test the effect in our <a href="../tools/credit-score-simulator.html">simulator</a>.</p>
<h2>Myth 4: "High utilization damage is permanent"</h2>
<p>Utilization has <strong>no memory</strong> in current scoring models. Last month's 90% stops mattering the moment a low balance is reported. It is the fastest-healing factor in your score.</p>
<h2>Myth 5: "Closing a card helps utilization"</h2>
<p>The opposite — closing a card deletes its limit from your available credit, instantly <em>raising</em> utilization. Keep old cards open with a small recurring charge.</p>
<h2>The real rule</h2>
<p>Under 30% everywhere, under 10% for the best scores, reported on the statement date. Everything else is noise.</p>"""

POSTS[('credit-tools','pay-off-debt-or-save')] = """
<h2>The order of operations</h2>
<p>Personal finance has a correct sequence, and skipping steps is expensive:</p>
<ol><li><strong>$1,000 starter emergency fund</strong> — so one surprise does not become new debt.</li>
<li><strong>Kill high-interest debt (roughly 7%+ APR)</strong> — credit cards first. A 22% APR costs more than any safe investment earns.</li>
<li><strong>Full 3–6 month emergency fund.</strong></li>
<li><strong>Invest while paying low-interest debt</strong> — a 4% student loan vs 8–10% market returns favors investing (with risk tolerance).</li></ol>
<h2>The math behind it</h2>
<p>Paying off a 22% APR card is a <strong>guaranteed, tax-free 22% return</strong> — unbeatable. But holding zero savings while doing it means the next emergency goes right back on the card at 22%. The starter fund breaks that cycle.</p>
<h2>The exceptions</h2>
<ul><li><strong>401(k) match:</strong> contribute to the match <em>while</em> paying debt — a 50–100% instant return beats any APR.</li>
<li><strong>0% promo debt:</strong> pay minimums, park cash in high-yield savings, kill it before the promo ends.</li>
<li><strong>Tax-advantaged deadlines:</strong> an IRA contribution you skip this year is gone forever; debt can wait weeks.</li></ul>
<h2>Run your payoff plan</h2>
<p>Once you commit to the debt phase, our <a href="../tools/debt-payoff.html">avalanche vs snowball calculator</a> shows exactly how fast extra payments clear everything — and which strategy saves you more.</p>
<h2>Bottom line</h2>
<p>Starter fund → high-interest debt → full fund → invest. In that order, no skipping, and the match always gets fed first.</p>"""

# ------------------------------------------------------------- generate all pages
def build_site(site_key):
    site = SITES[site_key]
    made = []
    # index
    idx_body = index_body(site)
    faq_ld = faq_jsonld(site['faqs'])
    write_page(site_key, site, 'index.html', site['index_title'], site['index_desc'],
               site['index_h1'], idx_body, jsonld=ld(faq_ld, site), nav='nav_home'); made.append('index.html')
    # tools index
    ti = list_body('tools', 'Free Financial Calculators', 'Every calculator is free, private (runs in your browser), and needs no signup.',
                   site['tools'], lambda t:t['slug']+'.html', 'Calculator')
    write_page(site_key, site, 'tools/index.html', 'Free Financial Calculators | '+site['name'],
               'All free '+site['name']+' calculators in one place: no signup, private, instant results.',
               'Free Financial Calculators', ti, nav='nav_tools'); made.append('tools/index.html')
    # tool pages
    for t in site['tools']:
        body, scripts = tool_body(site_key, site, t)
        write_page(site_key, site, 'tools/'+t['slug']+'.html', t['title'], t['desc'], t['h1'], body, scripts=scripts, nav='nav_tools')
        made.append('tools/'+t['slug']+'.html')
    # guides index
    gi = list_body('guides', site['name']+' Guides', 'In-depth, plain-English guides updated for 2026.',
                   site['guides'], lambda g:g['slug']+'.html', 'Guide')
    write_page(site_key, site, 'guides/index.html', site['name']+' Guides & How-Tos',
               'Plain-English '+site['name'].lower()+' guides and how-tos, updated for 2026.',
               site['name']+' Guides & How-Tos', gi, nav='nav_guides'); made.append('guides/index.html')
    # guide pages
    for g in site['guides']:
        rel_links = [(t['name'],'../tools/'+t['slug']+'.html') for t in site['tools'][:2]]
        rel_links += [(o['h1'],'../guides/'+o['slug']+'.html') for o in site['guides'] if o['slug']!=g['slug']][:2]
        body = article_body(g['h1'], g['desc'], GUIDES[(site_key,g['slug'])], rel_links)
        write_page(site_key, site, 'guides/'+g['slug']+'.html', g['title'], g['desc'], g['h1'], body,
                   jsonld=ld(article_jsonld(site, g['h1'], g['desc'], site['base']+'guides/'+g['slug']+'.html'), site), nav='nav_guides')
        made.append('guides/'+g['slug']+'.html')
    # blog index
    bi = list_body('blog', site['name']+' Blog', 'Practical money articles — short, actionable, no fluff.',
                   site['posts'], lambda p:p['slug']+'.html', 'Article')
    write_page(site_key, site, 'blog/index.html', site['name']+' Blog',
               site['name']+' blog: practical money articles, tips, and explainers.',
               site['name']+' Blog', bi, nav='nav_blog'); made.append('blog/index.html')
    # blog posts
    for p in site['posts']:
        rel_links = [(t['name'],'../tools/'+t['slug']+'.html') for t in site['tools'][:2]]
        rel_links += [(gg['h1'],'../guides/'+gg['slug']+'.html') for gg in site['guides'][:2]]
        body = article_body(p['h1'], p['desc'], POSTS[(site_key,p['slug'])], rel_links)
        write_page(site_key, site, 'blog/'+p['slug']+'.html', p['title'], p['desc'], p['h1'], body,
                   jsonld=ld(article_jsonld(site, p['h1'], p['desc'], site['base']+'blog/'+p['slug']+'.html'), site), nav='nav_blog')
        made.append('blog/'+p['slug']+'.html')
    return made

# ------------------------------------------------------------- verify
def verify(site_key):
    site = SITES[site_key]
    errs = []
    pages = []
    for root_,_,files in os.walk(os.path.join(BASE, site_key)):
        for f in files:
            if f.endswith('.html'): pages.append(os.path.join(root_,f))
    for p in pages:
        s = open(p).read()
        rel = os.path.relpath(p, os.path.join(BASE, site_key))
        m = re.search(r'<title>(.*?)</title>', s)
        if not m: errs.append(rel+': missing title'); continue
        if len(m.group(1)) > 70: errs.append(rel+': title %d chars' % len(m.group(1)))
        d = re.search(r'<meta name="description" content="(.*?)"', s)
        if not d: errs.append(rel+': missing meta description')
        elif len(d.group(1)) > 170: errs.append(rel+': desc %d chars' % len(d.group(1)))
        if len(re.findall(r'<h1[ >]', s)) != 1: errs.append(rel+': h1 count = %d' % len(re.findall(r'<h1[ >]', s)))
        if ADSLOT not in s: errs.append(rel+': missing AD-SLOT')
        if 'https://nidaayesha.com' not in s: errs.append(rel+': missing footer brand link')
        if 'aivideodetector.site' not in s or 'epstopikpakistan.blogspot.com' not in s: errs.append(rel+': missing our-sites links')
        if '/tools/' in rel and 'not financial advice' not in s: errs.append(rel+': missing disclaimer')
        c = re.search(r'<link rel="canonical" href="(.*?)"', s)
        if not c or not c.group(1).startswith(site['base']): errs.append(rel+': bad canonical '+str(c.group(1) if c else None))
        # internal links
        for href in re.findall(r'href="([^"#]+?\.html)"', s):
            if href.startswith('http'): continue
            target = os.path.normpath(os.path.join(os.path.dirname(p), href))
            if not os.path.isfile(target): errs.append(rel+': broken link -> '+href)
        # script srcs
        for src in re.findall(r'<script src="([^"]+)"', s):
            if src.startswith('http'): continue
            target = os.path.normpath(os.path.join(os.path.dirname(p), src))
            if not os.path.isfile(target): errs.append(rel+': broken script -> '+src)
        # css
        for href in re.findall(r'href="([^"]+?\.css)"', s):
            target = os.path.normpath(os.path.join(os.path.dirname(p), href))
            if not os.path.isfile(target): errs.append(rel+': broken css -> '+href)
    return pages, errs

if __name__ == '__main__':
    for sk in SITES:
        made = build_site(sk)
        print(sk+': wrote %d pages' % len(made))
    print()
    total_errs = 0
    for sk in SITES:
        pages, errs = verify(sk)
        print(sk+': %d pages checked, %d errors' % (len(pages), len(errs)))
        for e in errs: print('  !!', e)
        total_errs += len(errs)
    print('\nTOTAL ERRORS:', total_errs)
