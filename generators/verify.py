"""Verify built insurance hub sites:
- exactly one <h1> per page
- <!-- AD-SLOT --> on every content page
- required footer + tool disclaimer
- title <= 70, meta description <= 170
- zero broken internal links
Run: python3 scripts/verify.py <site-dir> [<site-dir> ...]
"""
import os
import re
import subprocess
import sys
from html.parser import HTMLParser


class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "a" and a.get("href"):
            self.links.append(("href", a["href"]))
        if tag in ("link", "script", "img") and a.get("href") or a.get("src"):
            key = "href" if tag == "link" else "src"
            if a.get(key):
                self.links.append((key, a[key]))


FOOTER_NEEDLE = 'href="https://nidaayesha.com"'
DISCLAIMER_NEEDLE = "Educational purposes only \u2014 not financial advice. Estimates, not quotes."

errors = []


def err(site, path, msg):
    errors.append("[%s] %s: %s" % (site, path, msg))


def check_site(d):
    site = os.path.basename(d.rstrip("/"))
    html_files = []
    for root, _dirs, files in os.walk(d):
        for f in files:
            if f.endswith(".html"):
                html_files.append(os.path.join(root, f))
    if not html_files:
        err(site, d, "no html files found")
        return
    for path in sorted(html_files):
        rel = os.path.relpath(path, d)
        with open(path, encoding="utf-8") as fh:
            src = fh.read()
        # one h1
        h1s = len(re.findall(r"<h1[\s>]", src))
        if h1s != 1:
            err(site, rel, "expected 1 <h1>, found %d" % h1s)
        # ad slot
        if "<!-- AD-SLOT -->" not in src:
            err(site, rel, "missing <!-- AD-SLOT -->")
        # footer
        if FOOTER_NEEDLE not in src:
            err(site, rel, "missing required footer")
        # disclaimer on tool pages
        if "/tools/" in rel.replace(os.sep, "/") and DISCLAIMER_NEEDLE not in src:
            err(site, rel, "missing tool disclaimer")
        # title / description lengths
        m = re.search(r"<title>(.*?)</title>", src, re.S)
        if not m:
            err(site, rel, "missing <title>")
        elif len(m.group(1)) > 70:
            err(site, rel, "title too long (%d chars)" % len(m.group(1)))
        m = re.search(r'<meta name="description" content="(.*?)">', src, re.S)
        if not m:
            err(site, rel, "missing meta description")
        elif len(m.group(1)) > 170:
            err(site, rel, "description too long (%d chars)" % len(m.group(1)))
        # internal links
        p = LinkParser()
        p.feed(src)
        for kind, url in p.links:
            if url.startswith(("http://", "https://", "mailto:", "#", "data:")) or url == "":
                continue
            url = url.split("#", 1)[0].split("?", 1)[0]
            if not url:
                continue
            target = os.path.normpath(os.path.join(os.path.dirname(path), url))
            if not os.path.exists(target):
                err(site, rel, "broken %s -> %s" % (kind, url))
    # node --check on all js
    for root, _dirs, files in os.walk(d):
        for f in files:
            if f.endswith(".js"):
                path = os.path.join(root, f)
                r = subprocess.run(["node", "--check", path], capture_output=True, text=True)
                if r.returncode != 0:
                    err(site, os.path.relpath(path, d), "node --check FAILED: %s" % r.stderr.strip())


def main():
    for d in sys.argv[1:]:
        check_site(d)
    if errors:
        print("FAILURES (%d):" % len(errors))
        for e in errors:
            print(" ", e)
        sys.exit(1)
    print("ALL CHECKS PASSED for: %s" % ", ".join(sys.argv[1:]))


if __name__ == "__main__":
    main()
