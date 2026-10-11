"""Shared static-site generator for the insurance hub sites.

Enforces the shared rules:
  - <title> <= 70 chars, meta description <= 170 chars (asserted)
  - exactly one <h1> per page (checked by scripts/verify.py)
  - <!-- AD-SLOT --> placeholder on every content page
  - required footer on every page
  - tool disclaimer on every tool page
"""
import json
import os

AD_SLOT = "<!-- AD-SLOT -->"

FOOTER_HTML = (
    '<footer class="site-footer">\n'
    '  <div class="container">\n'
    '    <p>Built by <a href="https://nidaayesha.com" target="_blank" rel="noopener">NAN Marketing Agency</a> | '
    '<span>Our sites: <a href="https://aivideodetector.site" target="_blank" rel="noopener">AI Video Detector</a> '
    '\u00b7 <a href="https://epstopikpakistan.blogspot.com" target="_blank" rel="noopener">EpsTopik Pakistan</a></span></p>\n'
    '    <p class="footer-note">All content is educational and for general information only \u2014 not financial advice. '
    'Calculator results are estimates, not quotes.</p>\n'
    '  </div>\n'
    '</footer>'
)

TOOL_DISCLAIMER = "Educational purposes only \u2014 not financial advice. Estimates, not quotes."

MAIN_JS = """'use strict';
/* Shared site JS: mobile nav + FAQ accordion */
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  var faqButtons = document.querySelectorAll('.faq-q');
  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var ans = item.querySelector('.faq-a');
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      ans.hidden = expanded;
    });
  });
});
"""


def check_seo(title, desc):
    assert len(title) <= 70, "title too long (%d): %s" % (len(title), title)
    assert len(desc) <= 170, "description too long (%d): %s" % (len(desc), desc)


def page_head(site, title, desc, canonical, css_rel, schemas):
    check_seo(title, desc)
    schema_tags = "\n".join(
        '  <script type="application/ld+json">\n' + json.dumps(s, indent=2) + '\n  </script>'
        for s in schemas
    )
    return (
        "<!DOCTYPE html>\n"
        '<html lang="en">\n'
        "<head>\n"
        '<meta charset="UTF-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        "<title>%s</title>\n"
        '<meta name="description" content="%s">\n'
        '<link rel="canonical" href="%s">\n'
        '<link rel="stylesheet" href="%s">\n'
        "%s\n"
        "</head>\n<body>\n"
    ) % (title, desc, canonical, css_rel, schema_tags)


def site_header(site, rel):
    return (
        '<header class="site-header">\n'
        '  <div class="container nav-wrap">\n'
        '    <a class="logo" href="%sindex.html"><span class="logo-mark">%s</span> %s</a>\n'
        '    <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">\u2630</button>\n'
        '    <nav class="main-nav" id="mainNav" aria-label="Main navigation">\n'
        '      <a href="%sindex.html">Home</a>\n'
        '      <a href="%sindex.html#tools">Calculators</a>\n'
        '      <a href="%sindex.html#guides">Guides</a>\n'
        '      <a href="%sindex.html#blog">Blog</a>\n'
        "    </nav>\n"
        "  </div>\n"
        "</header>\n"
    ) % (rel, site["mark"], site["name"], rel, rel, rel, rel)


def breadcrumb(rel, trail):
    # trail: list of (label, href or None)
    parts = ['<nav class="breadcrumb" aria-label="Breadcrumb">']
    bits = []
    for label, href in trail:
        if href:
            bits.append('<a href="%s">%s</a>' % (href, label))
        else:
            bits.append("<span>%s</span>" % label)
    parts.append(" \u203a ".join(bits))
    parts.append("</nav>")
    return "\n".join(parts)


def website_schema(site):
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": site["name"],
        "url": site["base"] + "/",
    }


def faq_schema(faqs):
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a},
            }
            for q, a in faqs
        ],
    }


def article_schema(site, art, canonical):
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": art["title"],
        "description": art["desc"],
        "author": {"@type": "Organization", "name": site["name"]},
        "publisher": {"@type": "Organization", "name": site["name"]},
        "datePublished": art.get("date", "2026-10-12"),
        "mainEntityOfPage": {"@type": "WebPage", "@id": canonical},
    }


def tool_schema(site, tool, canonical):
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": tool["title"],
        "url": canonical,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
    }


def render_blocks(blocks):
    out = []
    for b in blocks:
        kind = b[0]
        if kind == "lead":
            out.append('<p class="lead">%s</p>' % b[1])
        elif kind == "p":
            out.append("<p>%s</p>" % b[1])
        elif kind == "h2":
            out.append("<h2>%s</h2>" % b[1])
        elif kind == "h3":
            out.append("<h3>%s</h3>" % b[1])
        elif kind == "ul":
            out.append("<ul>\n" + "".join("<li>%s</li>\n" % i for i in b[1]) + "</ul>")
        elif kind == "ol":
            out.append("<ol>\n" + "".join("<li>%s</li>\n" % i for i in b[1]) + "</ol>")
        elif kind == "note":
            out.append('<div class="callout"><p><strong>Note:</strong> %s</p></div>' % b[1])
        elif kind == "table":
            # b[1] = headers list, b[2] = rows list of lists
            h = "".join("<th>%s</th>" % c for c in b[1])
            r = "".join("<tr>" + "".join("<td>%s</td>" % c for c in row) + "</tr>\n" for row in b[2])
            out.append('<div class="table-wrap"><table>\n<thead><tr>%s</tr></thead>\n<tbody>\n%s</tbody>\n</table></div>' % (h, r))
    return "\n".join(out)


def related_box(title, links):
    items = "".join('<li><a href="%s">%s</a></li>\n' % (href, label) for href, label in links)
    return '<aside class="related"><h2>%s</h2>\n<ul>\n%s</ul></aside>' % (title, items)


def tool_cta_box(tool, rel):
    return (
        '<div class="callout cta-box">\n'
        "<p><strong>Try it yourself:</strong> use our free "
        '<a href="%stools/%s.html">%s</a> to get a personalized estimate in under a minute.</p>\n'
        "</div>"
    ) % (rel, tool["slug"], tool["title"])


def css_text(theme):
    return """:root{
  --primary: %s;
  --primary-dark: %s;
  --accent: %s;
  --accent-soft: %s;
  --bg: #f6f8fb;
  --card: #ffffff;
  --text: #1d2635;
  --muted: #5c6b82;
  --border: #e2e8f2;
  --radius: 12px;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:var(--text);background:var(--bg);line-height:1.65}
.container{max-width:1080px;margin:0 auto;padding:0 20px}
a{color:var(--primary)}
.site-header{background:var(--primary);color:#fff;position:sticky;top:0;z-index:50;box-shadow:0 2px 10px rgba(0,0,0,.15)}
.nav-wrap{display:flex;align-items:center;justify-content:space-between;padding:14px 20px}
.logo{color:#fff;text-decoration:none;font-weight:800;font-size:1.15rem;display:flex;align-items:center;gap:8px}
.logo-mark{background:var(--accent);color:#fff;width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-size:1rem}
.main-nav{display:flex;gap:4px}
.main-nav a{color:#fff;text-decoration:none;padding:8px 14px;border-radius:8px;font-weight:600}
.main-nav a:hover{background:rgba(255,255,255,.15)}
.nav-toggle{display:none;background:none;border:1px solid rgba(255,255,255,.5);color:#fff;font-size:1.3rem;border-radius:8px;padding:4px 10px;cursor:pointer}
.hero{background:linear-gradient(135deg,var(--primary) 0%%,var(--primary-dark) 100%%);color:#fff;padding:64px 0;text-align:center}
.hero h1{font-size:2.3rem;margin-bottom:12px;line-height:1.25}
.hero p{font-size:1.1rem;opacity:.92;max-width:720px;margin:0 auto 24px}
.hero .btn-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn{display:inline-block;background:var(--accent);color:#fff;text-decoration:none;font-weight:700;padding:12px 26px;border-radius:10px;border:none;cursor:pointer;font-size:1rem}
.btn:hover{filter:brightness(1.08)}
.btn-outline{background:transparent;border:2px solid #fff;color:#fff}
.btn-outline:hover{background:rgba(255,255,255,.12);filter:none}
section.block{padding:48px 0}
section.block h2.section-title{font-size:1.7rem;margin-bottom:6px}
.section-sub{color:var(--muted);margin-bottom:24px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;display:flex;flex-direction:column;box-shadow:0 2px 8px rgba(20,40,80,.05)}
.card .icon{font-size:1.8rem;margin-bottom:10px}
.card h3{font-size:1.15rem;margin-bottom:8px}
.card h3 a{color:var(--text);text-decoration:none}
.card h3 a:hover{color:var(--primary)}
.card p{color:var(--muted);font-size:.95rem;flex:1;margin-bottom:14px}
.card .card-link{font-weight:700;text-decoration:none}
.breadcrumb{font-size:.9rem;color:var(--muted);padding:18px 0 0}
.breadcrumb a{color:var(--primary);text-decoration:none}
.page-head{padding:26px 0 6px}
.page-head h1{font-size:2rem;line-height:1.3;margin-bottom:10px}
.page-head .lead{font-size:1.08rem;color:var(--muted)}
article.prose{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:32px;margin:24px 0}
article.prose h2{font-size:1.4rem;margin:28px 0 10px;color:var(--primary-dark)}
article.prose h3{font-size:1.15rem;margin:20px 0 8px}
article.prose p{margin-bottom:14px}
article.prose ul,article.prose ol{margin:0 0 16px 22px}
article.prose li{margin-bottom:6px}
.lead{font-size:1.12rem;color:var(--muted)}
.callout{background:var(--accent-soft);border-left:4px solid var(--accent);border-radius:8px;padding:16px 18px;margin:22px 0}
.callout p{margin:0}
.tool-wrap{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:32px;margin:24px 0}
.form-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px;margin-bottom:20px}
.field label{display:block;font-weight:700;margin-bottom:6px;font-size:.95rem}
.field input,.field select{width:100%%;padding:11px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;background:#fff;color:var(--text)}
.field input:focus,.field select:focus{outline:2px solid var(--accent);border-color:var(--accent)}
.field .hint{font-size:.82rem;color:var(--muted);margin-top:4px}
.checks{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;margin:6px 0 20px}
.check{display:flex;gap:10px;align-items:flex-start;background:#fbfcfe;border:1px solid var(--border);border-radius:8px;padding:12px;cursor:pointer}
.check input{margin-top:4px;transform:scale(1.2)}
.check strong{display:block;font-size:.95rem}
.check span{font-size:.85rem;color:var(--muted)}
.result{background:#fbfcfe;border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-top:24px}
.result h2{font-size:1.35rem;margin-bottom:12px;color:var(--primary-dark)}
.result .big{font-size:2rem;font-weight:800;color:var(--primary);margin:8px 0}
.table-wrap{overflow-x:auto;margin:14px 0}
table{width:100%%;border-collapse:collapse;font-size:.95rem}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--border)}
th{background:var(--primary);color:#fff}
tr:last-child td{border-bottom:none}
tbody tr:nth-child(even){background:#f7fafd}
tr.winner td{background:#eaf7ef;font-weight:700}
.disclaimer-box{background:#fff8e6;border:1px solid #f0d878;border-radius:8px;padding:14px 16px;margin:24px 0;font-size:.92rem;color:#6b5b1e}
.faq-item{background:var(--card);border:1px solid var(--border);border-radius:10px;margin-bottom:12px;overflow:hidden}
.faq-q{width:100%%;text-align:left;background:none;border:none;padding:16px 18px;font-size:1rem;font-weight:700;cursor:pointer;color:var(--text);display:flex;justify-content:space-between;align-items:center;gap:12px}
.faq-q::after{content:"+";font-size:1.4rem;color:var(--accent);flex-shrink:0}
.faq-q[aria-expanded="true"]::after{content:"\\2212"}
.faq-a{padding:0 18px 18px;color:var(--muted)}
.related{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin:24px 0}
.related h2{font-size:1.2rem;margin-bottom:10px}
.related ul{margin-left:20px}
.related li{margin-bottom:6px}
.bar-stack{display:flex;height:34px;border-radius:8px;overflow:hidden;margin:14px 0;border:1px solid var(--border)}
.bar-you{background:var(--accent)}
.bar-insurer{background:var(--primary)}
.legend{display:flex;gap:18px;font-size:.9rem;margin-bottom:6px;flex-wrap:wrap}
.legend i{display:inline-block;width:14px;height:14px;border-radius:4px;margin-right:6px;vertical-align:baseline}
input[type=range]{width:100%%;accent-color:var(--primary)}
.slider-row{margin-bottom:16px}
.slider-row label{display:flex;justify-content:space-between;font-weight:700;margin-bottom:6px}
.slider-row output{color:var(--primary)}
.site-footer{background:var(--primary-dark);color:#dfe7f3;padding:30px 0;margin-top:40px;font-size:.92rem}
.site-footer a{color:#fff}
.site-footer .footer-note{opacity:.75;font-size:.82rem;margin-top:8px}
.meta{color:var(--muted);font-size:.88rem;margin-bottom:6px}
@media(max-width:720px){
  .main-nav{display:none;flex-direction:column;position:absolute;top:100%%;left:0;right:0;background:var(--primary);padding:10px 20px 16px}
  .main-nav.open{display:flex}
  .nav-wrap{position:relative;flex-wrap:wrap}
  .nav-toggle{display:block}
  .hero h1{font-size:1.8rem}
  article.prose,.tool-wrap{padding:20px}
}
""" % (theme["primary"], theme["primary_dark"], theme["accent"], theme["accent_soft"])


def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def build_index(site, tools, guides, blog, faqs, copy):
    base = site["base"]
    tool_cards = "\n".join(
        '<div class="card"><div class="icon">%s</div><h3><a href="tools/%s.html">%s</a></h3><p>%s</p>'
        '<a class="card-link" href="tools/%s.html">Use this calculator \u2192</a></div>'
        % (t.get("icon", "\U0001f4ca"), t["slug"], t["title"], t["blurb"], t["slug"])
        for t in tools
    )
    guide_cards = "\n".join(
        '<div class="card"><div class="icon">\U0001f4d6</div><h3><a href="guides/%s.html">%s</a></h3><p>%s</p>'
        '<a class="card-link" href="guides/%s.html">Read the guide \u2192</a></div>'
        % (g["slug"], g["title"], g["desc"], g["slug"])
        for g in guides
    )
    blog_cards = "\n".join(
        '<div class="card"><div class="icon">\U0001f4dd</div><h3><a href="blog/%s.html">%s</a></h3><p>%s</p>'
        '<a class="card-link" href="blog/%s.html">Read article \u2192</a></div>'
        % (b["slug"], b["title"], b["desc"], b["slug"])
        for b in blog
    )
    faq_items = "\n".join(
        '<div class="faq-item"><button class="faq-q" aria-expanded="false">%s</button>'
        '<div class="faq-a" hidden><p>%s</p></div></div>' % (q, a)
        for q, a in faqs
    )
    body = (
        site_header(site, "")
        + '<main>\n'
        + '<section class="hero"><div class="container">\n'
        "<h1>%s</h1>\n<p>%s</p>\n"
        '<div class="btn-row"><a class="btn" href="#tools">Free Calculators</a>'
        '<a class="btn btn-outline" href="#guides">2026 Guides</a></div>\n'
        "</div></section>\n" % (copy["h1"], copy["hero_sub"])
        + '<div class="container">\n' + AD_SLOT + "\n</div>\n"
        + '<section class="block" id="tools"><div class="container">\n'
        '<h2 class="section-title">%s</h2>\n<p class="section-sub">%s</p>\n<div class="cards">\n%s\n</div>\n</div></section>\n'
        % (copy["tools_h2"], copy["tools_sub"], tool_cards)
        + '<section class="block" id="guides"><div class="container">\n'
        '<h2 class="section-title">%s</h2>\n<p class="section-sub">%s</p>\n<div class="cards">\n%s\n</div>\n</div></section>\n'
        % (copy["guides_h2"], copy["guides_sub"], guide_cards)
        + '<section class="block" id="blog"><div class="container">\n'
        '<h2 class="section-title">%s</h2>\n<p class="section-sub">%s</p>\n<div class="cards">\n%s\n</div>\n</div></section>\n'
        % (copy["blog_h2"], copy["blog_sub"], blog_cards)
        + '<section class="block" id="faq"><div class="container">\n'
        '<h2 class="section-title">Frequently Asked Questions</h2>\n<p class="section-sub">Quick answers to the questions we hear most.</p>\n%s\n</div></section>\n'
        % faq_items
        + "</main>\n"
        + FOOTER_HTML
        + '\n<script src="js/main.js"></script>\n</body>\n</html>\n'
    )
    head = page_head(
        site, site["index_title"], site["index_desc"], base + "/",
        "css/style.css", [website_schema(site), faq_schema(faqs)],
    )
    return head + body


def build_tool_page(site, tool, tools):
    base = site["base"]
    canon = "%s/tools/%s.html" % (base, tool["slug"])
    others = [(t["slug"], t["title"]) for t in tools if t["slug"] != tool["slug"]]
    guide_links = [("guides/%s.html" % g["slug"], g["title"]) for g in site["_guides"]]
    result_div = "" if tool.get("skip_result") else '<div class="result" id="%s" hidden></div>\n' % tool["result_id"]
    body = (
        site_header(site, "../")
        + '<main><div class="container">\n'
        + breadcrumb("../", [("Home", "../index.html"), ("Calculators", "../index.html#tools"), (tool["short"], None)])
        + '<div class="page-head">\n<h1>%s</h1>\n<p class="lead">%s</p>\n</div>\n'
        % (tool["h1"], tool["intro"])
        + AD_SLOT + "\n"
        + '<div class="tool-wrap">\n%s\n%s</div>\n'
        % (tool["form_html"], result_div)
        + '<div class="disclaimer-box"><strong>Disclaimer:</strong> %s</div>\n' % TOOL_DISCLAIMER
        + "<article class=\"prose\">\n%s\n</article>\n" % render_blocks(tool["how"])
        + related_box("More free calculators", [("../tools/%s.html" % s, t) for s, t in others])
        + related_box("Learn more in our guides", [("../" + h, l) for h, l in guide_links])
        + "</div></main>\n"
        + FOOTER_HTML
        + '\n<script src="../js/main.js"></script>\n<script src="../js/%s.js"></script>\n</body>\n</html>\n' % tool["slug"]
    )
    head = page_head(
        site, tool["title"], tool["desc"], canon, "../css/style.css", [tool_schema(site, tool, canon)]
    )
    return head + body


def build_article_page(site, kind, art, tools, guides, blog):
    base = site["base"]
    canon = "%s/%s/%s.html" % (base, kind, art["slug"])
    kind_label = "Guides" if kind == "guides" else "Blog"
    others = [a for a in (guides if kind == "guides" else blog) if a["slug"] != art["slug"]]
    related = [(("guides/%s.html" if kind == "guides" else "blog/%s.html") % a["slug"], a["title"]) for a in others]
    body = (
        site_header(site, "../")
        + '<main><div class="container">\n'
        + breadcrumb("../", [("Home", "../index.html"), (kind_label, "../index.html#%s" % kind), (art["short"], None)])
        + '<div class="page-head">\n<h1>%s</h1>\n<p class="meta">%s \u00b7 %s min read</p>\n</div>\n'
        % (art["h1"], art.get("date", "2026-10-12"), art.get("read", "6"))
        + AD_SLOT + "\n"
        + '<article class="prose">\n%s\n' % render_blocks(art["body"])
        + tool_cta_box(tools[art.get("cta_tool", 0)], "../")
        + "</article>\n"
        + related_box("Related reading", [("../" + h, l) for h, l in related])
        + related_box("Free calculators", [("../tools/%s.html" % t["slug"], t["title"]) for t in tools])
        + "</div></main>\n"
        + FOOTER_HTML
        + '\n<script src="../js/main.js"></script>\n</body>\n</html>\n'
    )
    head = page_head(
        site, art["title"], art["desc"], canon, "../css/style.css",
        [article_schema(site, art, canon)],
    )
    return head + body


def build_sitemap(site, urls):
    items = "\n".join(
        "  <url><loc>%s</loc><changefreq>monthly</changefreq></url>" % u for u in urls
    )
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n%s\n</urlset>\n' % items


def build_site(site, tools, guides, blog, faqs, copy):
    site["_guides"] = guides
    d = site["dir"]
    base = site["base"]
    urls = [base + "/"]

    write(os.path.join(d, "css/style.css"), css_text(site["theme"]))
    write(os.path.join(d, "js/main.js"), MAIN_JS)
    for t in tools:
        write(os.path.join(d, "js/%s.js" % t["slug"]), t["js"])
        urls.append("%s/tools/%s.html" % (base, t["slug"]))

    write(os.path.join(d, "index.html"), build_index(site, tools, guides, blog, faqs, copy))
    for t in tools:
        write(os.path.join(d, "tools/%s.html" % t["slug"]), build_tool_page(site, t, tools))
    for g in guides:
        write(os.path.join(d, "guides/%s.html" % g["slug"]), build_article_page(site, "guides", g, tools, guides, blog))
        urls.append("%s/guides/%s.html" % (base, g["slug"]))
    for b in blog:
        write(os.path.join(d, "blog/%s.html" % b["slug"]), build_article_page(site, "blog", b, tools, guides, blog))
        urls.append("%s/blog/%s.html" % (base, b["slug"]))
    write(os.path.join(d, "sitemap.xml"), build_sitemap(site, urls))
    print("Built %s: %d pages" % (site["name"], len(urls)))
