#!/usr/bin/env python3
"""Build script for MultilingualVoiceHub static site. All content inline."""
import os, textwrap

BASE = os.path.expanduser("~/workspace/free-sites/multilingual-voice-hub")
SITE = "https://nan-multivoice.surge.sh"
BRAND = "MultilingualVoiceHub"
LOGO = "🌍 MultilingualVoiceHub"

ADSLOT = """<!-- AD-SLOT -->
<!-- Adsterra Banner 300x250 for nidaayesha.com - verified from Nida's own dashboard 2026-10-12 -->
<script>
atOptions = {
  'key' : '99bbb8d1f41996e5ce9f8c14b86321a2',
  'format' : 'iframe',
  'height' : 250,
  'width' : 300,
  'params' : {}
};
</script>
<script src="https://www.highrevenueformat.com/99bbb8d1f41996e5ce9f8c14b86321a2/invoke.js"></script>"""

FOOTER = f"""<footer class="site">
<p>Built by <a href="https://nidaayesha.com" target="_blank" rel="noopener">NAN Marketing Agency</a> | <span>Our sites: <a href="https://aivideodetector.site" target="_blank" rel="noopener">AI Video Detector</a> \u00b7 <a href="https://epstopikpakistan.blogspot.com" target="_blank" rel="noopener">EpsTopik Pakistan</a></span> \u00b7 Free multilingual AI voice tools for creators</p>
</footer>"""

def head(title, desc, canon, extra_ld="", css_path="css/style.css"):
    assert len(title) <= 70, title
    assert len(desc) <= 170, desc
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canon}">
<link rel="stylesheet" href="{css_path}">
{extra_ld}</head>
<body>"""

def nav_home():
    return f"""<header class="site"><nav class="nav">
<a class="logo" href="index.html">{LOGO}</a>
<div class="navlinks">
<a href="tools/language-voice-tester.html">Voice Tester</a>
<a href="tools/dubbing-planner.html">Dubbing Planner</a>
<a href="tools/translation-glossary.html">Glossary Builder</a>
<a href="tools/voice-tool-finder.html">Tool Finder Quiz</a>
<a href="guides/best-multilingual-ai-voice-tools-2026.html">Guides</a>
<a href="blog/index.html">Blog</a>
</div></nav></header>"""

def nav_sub(depth):
    p = "../" * depth
    return f"""<header class="site"><nav class="nav">
<a class="logo" href="{p}index.html">{LOGO}</a>
<div class="navlinks">
<a href="{p}tools/language-voice-tester.html">Voice Tester</a>
<a href="{p}tools/dubbing-planner.html">Dubbing Planner</a>
<a href="{p}tools/translation-glossary.html">Glossary Builder</a>
<a href="{p}tools/voice-tool-finder.html">Tool Finder Quiz</a>
<a href="{p}guides/best-multilingual-ai-voice-tools-2026.html">Guides</a>
<a href="{p}blog/index.html">Blog</a>
</div></nav></header>"""

def webapp_ld(name):
    return f"""<script type="application/ld+json">
{{"@context":"https://schema.org","@type":"WebApplication","name":"{name}","applicationCategory":"MultimediaApplication","operatingSystem":"Any","offers":{{"@type":"Offer","price":"0"}}}}
</script>"""

def article_ld(headline, url, desc):
    return f"""<script type="application/ld+json">
{{"@context":"https://schema.org","@type":"Article","headline":"{headline}","description":"{desc}","url":"{url}","author":{{"@type":"Organization","name":"NAN Marketing Agency"}},"publisher":{{"@type":"Organization","name":"NAN Marketing Agency"}},"datePublished":"2026-10-12","dateModified":"2026-10-12","mainEntityOfPage":{{"@type":"WebPage","@id":"{url}"}}}}
</script>"""

def w(path, content):
    full = os.path.join(BASE, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w") as f:
        f.write(content)
    print("wrote", path, len(content), "bytes")

# ---------------------------------------------------------------- CSS
CSS = """:root{
  --bg:#0c1220; --bg2:#101828; --card:#162032; --line:#2a3a58;
  --text:#f2f5ff; --muted:#a8b4d2; --accent:#34d399; --accent2:#38bdf8;
  --grad:linear-gradient(135deg,#34d399,#38bdf8);
  --radius:14px;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);line-height:1.65}
a{color:var(--accent2);text-decoration:none}
a:hover{text-decoration:underline}
header.site{position:sticky;top:0;z-index:50;background:rgba(12,18,32,.93);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.nav{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:14px 20px;gap:12px}
.logo{font-weight:800;font-size:1.25rem;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;white-space:nowrap}
.navlinks{display:flex;gap:16px;flex-wrap:wrap}
.navlinks a{color:var(--muted);font-size:.95rem}
.navlinks a:hover{color:var(--text)}
.wrap{max-width:1100px;margin:0 auto;padding:24px 20px}
.hero{text-align:center;padding:56px 20px 40px}
.hero h1{font-size:2.4rem;line-height:1.25;margin-bottom:14px}
.hero h1 span{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p{color:var(--muted);max-width:680px;margin:0 auto 24px;font-size:1.08rem}
.btn{display:inline-block;background:var(--grad);color:#07131f;font-weight:800;padding:12px 26px;border-radius:999px;border:0;cursor:pointer;font-size:1rem}
.btn:hover{filter:brightness(1.1);text-decoration:none;color:#07131f}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;margin:30px 0}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:22px;transition:transform .15s}
.card:hover{transform:translateY(-3px)}
.card h3{margin-bottom:8px;font-size:1.1rem}
.card p{color:var(--muted);font-size:.93rem;margin-bottom:12px}
.section{margin:44px 0}
.section h2{font-size:1.6rem;margin-bottom:14px}
.toolbox{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:24px;margin:20px 0}
label{display:block;font-weight:600;margin:12px 0 6px}
input,select,textarea{background:#0b1222;border:1px solid var(--line);color:var(--text);border-radius:10px;padding:10px 12px;width:100%;font-size:1rem}
textarea{min-height:140px;resize:vertical}
button.btn-sm{background:var(--grad);color:#07131f;border:0;border-radius:8px;padding:8px 16px;cursor:pointer;font-weight:700}
button.btn-sm:hover{filter:brightness(1.12)}
button.btn-sm.ghost{background:transparent;border:1px solid var(--line);color:var(--text)}
.result{background:#0b1222;border:1px dashed var(--accent);border-radius:10px;padding:16px;margin-top:16px}
.result b{color:var(--accent)}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin:16px 0}
.stat{background:#0b1222;border:1px solid var(--line);border-radius:10px;padding:12px;text-align:center}
.stat .num{font-size:1.5rem;font-weight:800;color:var(--accent)}
.stat .lbl{font-size:.8rem;color:var(--muted)}
.tip{background:#0e2233;border-left:3px solid var(--accent);border-radius:0 8px 8px 0;padding:10px 14px;margin:8px 0;font-size:.93rem;color:#dbeafe}
.warn{background:#2b1a10;border-left:3px solid #f59e0b;border-radius:0 8px 8px 0;padding:10px 14px;margin:8px 0;font-size:.93rem;color:#fde68a}
table{width:100%;border-collapse:collapse;margin:14px 0}
th,td{border:1px solid var(--line);padding:10px;text-align:left;font-size:.93rem}
th{background:#1f2a45}
.faq details{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 18px;margin-bottom:10px}
.faq summary{cursor:pointer;font-weight:600}
.faq p{color:var(--muted);margin-top:8px}
footer.site{border-top:1px solid var(--line);margin-top:50px;padding:26px 20px;text-align:center;color:var(--muted);font-size:.9rem}
article.content h2{margin:26px 0 10px;font-size:1.4rem}
article.content h3{margin:20px 0 8px}
article.content p,article.content li{color:#d7dcf0}
article.content ul,article.content ol{margin:8px 0 8px 22px}
.breadcrumb{font-size:.85rem;color:var(--muted);margin-bottom:10px}
.checkbox-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:8px 0}
.checkbox-grid label{font-weight:400;display:flex;align-items:center;gap:8px;margin:4px 0;cursor:pointer}
.checkbox-grid input{width:auto}
.gloss-table td:last-child{white-space:nowrap}
.quiz-q{margin:14px 0}
.quiz-q p{font-weight:600;margin-bottom:6px}
.quiz-opts{display:flex;gap:8px;flex-wrap:wrap}
.quiz-opts button{background:#0b1222;border:1px solid var(--line);color:var(--text);border-radius:999px;padding:8px 18px;cursor:pointer;font-size:.93rem}
.quiz-opts button.sel{background:var(--grad);color:#07131f;font-weight:700;border-color:transparent}
.step{opacity:.35}.step.active{opacity:1}
.tag{display:inline-block;background:#0e2233;color:var(--accent2);border-radius:999px;padding:3px 12px;font-size:.8rem;margin:2px 4px 2px 0}
"""
w("css/style.css", CSS)

# ---------------------------------------------------------------- index.html
def build_index():
    ld_web = f"""<script type="application/ld+json">
{{"@context":"https://schema.org","@type":"WebSite","name":"{BRAND}","url":"{SITE}/","description":"Free multilingual AI voice tools: language voice tester, video dubbing planner, translation glossary builder, and a quiz to find the right multilingual voice tool."}}
</script>"""
    ld_faq = """<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"Which languages do AI voice tools support in 2026?","acceptedAnswer":{"@type":"Answer","text":"Top multilingual AI voice platforms now support 30–140+ languages. ElevenLabs covers 32 languages, Murf 20+, PlayHT 140+, and Google Cloud TTS 50+. Check the actual language list before paying — coverage quality varies a lot beyond English, Spanish, French, and German."}},
{"@type":"Question","name":"Can AI dub my videos into other languages automatically?","acceptedAnswer":{"@type":"Answer","text":"Yes — tools like HeyGen, Rask AI, and Captions translate, generate voiceovers, and even sync lip movements. For best results, plan word-count differences per language with our free dubbing planner, since translations can run 10–30% longer than English."}},
{"@type":"Question","name":"How do I test which browser voice speaks my language?","acceptedAnswer":{"@type":"Answer","text":"Use our free language voice tester: type any text, pick a language from the voices installed on your device, and hear it instantly. It uses the Web Speech API, so nothing is uploaded or stored."}},
{"@type":"Question","name":"What is the best free multilingual text-to-speech tool?","acceptedAnswer":{"@type":"Answer","text":"For quick tests, your browser's built-in voices (try our voice tester) cost nothing. For production use, ElevenLabs' free tier and Google Cloud TTS's generous free quota are the strongest free multilingual options. Take our 1-minute quiz to find your best match."}},
{"@type":"Question","name":"Do I need to label AI-dubbed videos?","acceptedAnswer":{"@type":"Answer","text":"Yes. YouTube, TikTok, and Meta require disclosure when AI generates or alters voices or lip-sync in your content. Undisclosed synthetic dubbing can trigger demonetization or removal. See our dubbing guide for platform rules."}}
]}
</script>"""
    body = head(
        "MultilingualVoiceHub — Free Multilingual AI Voice Tools & Dubbing",
        "Free multilingual AI voice toolkit: test voices in 30+ languages, plan video dubbing word counts, build glossaries, find the right voice tool. No signup.",
        f"{SITE}/",
        ld_web + "\n" + ld_faq)
    body += "\n" + nav_home() + """
<div class="wrap">
<section class="hero">
<h1>One voice. <span>Every language your audience speaks.</span></h1>
<p>Free multilingual AI voice tools for creators targeting the USA and beyond: test voices in 30+ languages right in your browser, plan AI dubbing projects, build translation glossaries, and find the perfect multilingual voice tool — no signup, no fees.</p>
<a class="btn" href="tools/language-voice-tester.html">Test voices now \u2192</a>
</section>

""" + ADSLOT + """

<section class="section">
<h2>\U0001f6e0\ufe0f Free multilingual voice tools</h2>
<div class="cards">
<div class="card"><h3>\U0001f50a Language Voice Tester</h3><p>Type text \u2192 pick a language from your device's voices \u2192 hear it instantly. Compare male/female voices, rates, and pitch in 30+ languages.</p><a href="tools/language-voice-tester.html">Open voice tester \u2192</a></div>
<div class="card"><h3>\U0001f3ac Dubbing Planner</h3><p>Enter your script and target languages \u2192 get per-language word targets, spoken-duration estimates, and timing fixes for lip-sync-friendly dubbing.</p><a href="tools/dubbing-planner.html">Plan my dub \u2192</a></div>
<div class="card"><h3>\U0001f4da Translation Glossary</h3><p>Build a consistent term list across languages: add terms + translations, export to CSV, or copy to clipboard for your dubbing team.</p><a href="tools/translation-glossary.html">Build glossary \u2192</a></div>
<div class="card"><h3>\U0001f9ed Tool Finder Quiz</h3><p>Answer 4 questions about your languages, budget, and use case \u2192 get your best-fit multilingual AI voice tool with a runner-up.</p><a href="tools/voice-tool-finder.html">Take the quiz \u2192</a></div>
</div>
</section>

""" + ADSLOT + """

<section class="section">
<h2>\U0001f4d6 Guides</h2>
<div class="cards">
<div class="card"><h3>Best Multilingual AI Voice Tools 2026</h3><p>ElevenLabs vs Murf vs PlayHT vs HeyGen vs Rask AI — language coverage, pricing, and voice quality compared honestly.</p><a href="guides/best-multilingual-ai-voice-tools-2026.html">Read guide \u2192</a></div>
<div class="card"><h3>How to Dub Videos with AI</h3><p>The complete workflow: script prep, translation, voice generation, lip-sync, timing fixes, and platform disclosure rules.</p><a href="guides/how-to-dub-videos-with-ai.html">Read guide \u2192</a></div>
<div class="card"><h3>From the blog</h3><p>Why multilingual content wins in the USA, and the AI dubbing mistakes that kill watch time.</p><a href="blog/index.html">Visit blog \u2192</a></div>
</div>
</section>

<section class="section faq">
<h2>\u2753 Frequently asked questions</h2>
<details class="faq-item" open><summary>Which languages do AI voice tools support in 2026?</summary><p>Top platforms support 30\u2013140+ languages. ElevenLabs covers 32, Murf 20+, PlayHT 140+, and Google Cloud TTS 50+. Coverage quality varies a lot beyond the big languages \u2014 compare them in our <a href="guides/best-multilingual-ai-voice-tools-2026.html">2026 guide</a>.</p></details>
<details class="faq-item"><summary>Can AI dub my videos into other languages automatically?</summary><p>Yes \u2014 tools like HeyGen, Rask AI, and Captions translate, voice, and even lip-sync. Plan word-count differences first with our free <a href="tools/dubbing-planner.html">dubbing planner</a>: translations run 10\u201330% longer than English.</p></details>
<details class="faq-item"><summary>How do I test which browser voice speaks my language?</summary><p>Use our free <a href="tools/language-voice-tester.html">language voice tester</a>: type any text, pick a language from your device's voices, and hear it instantly. Nothing is uploaded or stored.</p></details>
<details class="faq-item"><summary>What is the best free multilingual text-to-speech tool?</summary><p>Your browser's built-in voices cost nothing for quick tests; ElevenLabs' free tier and Google Cloud TTS's free quota lead for production. Take our <a href="tools/voice-tool-finder.html">1-minute quiz</a> for a personalized pick.</p></details>
<details class="faq-item"><summary>Do I need to label AI-dubbed videos?</summary><p>Yes \u2014 YouTube, TikTok, and Meta require disclosure for AI-generated or altered voices and lip-sync. See our <a href="guides/how-to-dub-videos-with-ai.html">dubbing guide</a> for platform-by-platform rules.</p></details>
</section>
</div>

""" + FOOTER + """
<script src="js/main.js"></script>
</body>
</html>"""
    w("index.html", body)

build_index()

# ---------------------------------------------------------------- tool pages
TOOLS_META = {
    "language-voice-tester": (
        "Language Voice Tester \u2014 Hear Your Text in 30+ Languages",
        "Free browser voice tester: type text, pick a language and voice, and hear it spoken instantly. Compare voices, rates, and pitch across 30+ languages.",
        "WebApplication"),
    "dubbing-planner": (
        "Video Dubbing Planner \u2014 Word Counts & Timing Per Language",
        "Plan AI video dubbing: enter your script, pick target languages, and get per-language word targets, duration estimates, and lip-sync timing notes.",
        "WebApplication"),
    "translation-glossary": (
        "Translation Glossary Builder \u2014 Export Terms to CSV",
        "Build a consistent multilingual glossary: add terms and translations per language, then copy or export to CSV for your dubbing and translation team.",
        "WebApplication"),
    "voice-tool-finder": (
        "Multilingual Voice Tool Finder Quiz \u2014 Pick in 60 Seconds",
        "Answer 4 questions about languages, budget, and use case to find the best multilingual AI voice tool for you, with a runner-up and why.",
        "WebApplication"),
}

def tool_page(slug, h1, intro, toolbox_html, js_file):
    title, desc, _ = TOOLS_META[slug]
    canon = f"{SITE}/tools/{slug}.html"
    html = head(title, desc, canon, webapp_ld(title.split(" \u2014")[0]) + "\n", "../css/style.css")
    html += "\n" + nav_sub(1) + f"""
<div class="wrap">
<div class="breadcrumb"><a href="../index.html">Home</a> \u2192 {h1}</div>
<h1>{h1}</h1>
<p style="color:var(--muted)">{intro}</p>

{ADSLOT}

<div class="toolbox">
{toolbox_html}
</div>
</div>

{FOOTER}
<script src="../js/{js_file}"></script>
</body>
</html>"""
    w(f"tools/{slug}.html", html)

VOICE_TESTER_BOX = """
<label for="vt-text">Text to speak</label>
<textarea id="vt-text" placeholder="Type or paste text here\u2026 try a line in the language you want to hear."></textarea>
<p style="color:var(--muted);font-size:.85rem;margin-top:6px"><span id="vt-words">0</span> words \u00b7 <span id="vt-chars">0</span> characters</p>
<div style="margin:10px 0;display:flex;gap:8px;flex-wrap:wrap">
<button class="btn-sm ghost" data-vt-sample="Hello! In the next few seconds, you\u2019ll hear how natural this voice sounds in your chosen language.">EN sample</button>
<button class="btn-sm ghost" data-vt-sample="\u00a1Hola! Escucha lo natural que suena esta voz en tu idioma. Perfecta para doblar tus videos al espa\u00f1ol.">ES sample</button>
<button class="btn-sm ghost" data-vt-sample="Bonjour ! \u00c9coutez la qualit\u00e9 naturelle de cette voix dans votre langue, id\u00e9ale pour doubler vos vid\u00e9os.">FR sample</button>
<button class="btn-sm ghost" data-vt-sample="\u0645\u0631\u062d\u0628\u0627\u064b! \u0627\u0633\u062a\u0645\u0639 \u0625\u0644\u0649 \u0637\u0628\u064a\u0639\u064a\u0629 \u0647\u0630\u0627 \u0627\u0644\u0635\u0648\u062a \u0628\u0644\u063a\u062a\u0643 \u0627\u0644\u0639\u0631\u0628\u064a\u0629.">AR sample</button>
</div>
<label for="vt-voice">Voice (grouped by language)</label>
<select id="vt-voice"><option value="">Loading voices\u2026</option></select>
<p style="color:var(--muted);font-size:.85rem" id="vt-voice-count"></p>
<label for="vt-rate">Speaking rate: <span id="vt-rate-lbl">1\u00d7</span></label>
<input id="vt-rate" type="range" min="0.5" max="2" step="0.05" value="1">
<label for="vt-pitch">Pitch: <span id="vt-pitch-lbl">1.0</span></label>
<input id="vt-pitch" type="range" min="0.5" max="2" step="0.1" value="1">
<div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">
<button class="btn-sm" id="vt-play">\u25b6 Play</button>
<button class="btn-sm ghost" id="vt-pause">\u23f8 Pause / Resume</button>
<button class="btn-sm ghost" id="vt-stop">\u23f9 Stop</button>
</div>
<div class="tip" id="vt-tip" style="display:none"></div>
<p style="color:var(--muted);font-size:.85rem;margin-top:12px">Tip: the voices you see are installed on <b>your device/browser</b> \u2014 a phone usually has more languages than a desktop. For production voiceovers in 30+ studio-quality languages, see our <a href="../guides/best-multilingual-ai-voice-tools-2026.html">2026 tools guide</a>.</p>
"""

DUBBING_BOX = """
<label for="dp-script">Your English source script (paste to auto-count words)</label>
<textarea id="dp-script" placeholder="Paste your video script here\u2026"></textarea>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:12px">
<div><label for="dp-words">Or enter word count manually</label><input id="dp-words" type="number" min="10" value="1500" style="margin-top:0"></div>
<div><label for="dp-duration">Target video duration (minutes)</label><input id="dp-duration" type="number" min="1" value="10" style="margin-top:0"></div>
<div><label for="dp-pace">Delivery pace</label><select id="dp-pace" style="margin-top:0"><option value="130">Slow / documentary (130 wpm)</option><option value="150" selected>Conversational (150 wpm)</option><option value="170">Fast / energetic (170 wpm)</option></select></div>
</div>
<label>Target languages</label>
<div class="checkbox-grid" id="dp-langs"></div>
<div style="margin-top:14px"><button class="btn-sm" id="dp-go">Calculate dubbing plan \u2192</button></div>
<div id="dp-result" class="result" style="display:none"></div>
<div class="warn" style="margin-top:14px">Dubbing timing is an estimate: word-expansion factors are averages. Always do a test voiceover pass on one scene before generating a full 30-minute dub. And remember platform disclosure rules \u2014 see our <a href="../guides/how-to-dub-videos-with-ai.html">dubbing guide</a>.</div>
"""

GLOSSARY_BOX = """
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px">
<div><label for="gl-term">Term (source)</label><input id="gl-term" placeholder="e.g. call to action" style="margin-top:0"></div>
<div><label for="gl-lang">Language</label><select id="gl-lang" style="margin-top:0">
<option value="">Select\u2026</option>
<option>Spanish</option><option>French</option><option>German</option><option>Portuguese</option><option>Italian</option><option>Dutch</option><option>Arabic</option><option>Hindi</option><option>Urdu</option><option>Mandarin</option><option>Japanese</option><option>Korean</option><option>Russian</option><option>Turkish</option><option>Polish</option><option>Other</option>
</select></div>
<div><label for="gl-trans">Translation</label><input id="gl-trans" placeholder="e.g. llamada a la acci\u00f3n" style="margin-top:0"></div>
<div><label for="gl-note">Context note (optional)</label><input id="gl-note" placeholder="e.g. end-screen button" style="margin-top:0"></div>
</div>
<div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">
<button class="btn-sm" id="gl-add">\u2795 Add term</button>
<button class="btn-sm ghost" id="gl-copy">\U0001f4cb Copy table</button>
<button class="btn-sm ghost" id="gl-csv">\u2b07\ufe0f Download CSV</button>
<button class="btn-sm ghost" id="gl-clear">\U0001f5d1\ufe0f Clear all</button>
</div>
<p style="color:var(--muted);font-size:.85rem;margin-top:8px"><span id="gl-count">0</span> terms saved \u2014 your glossary is stored in this browser only, nothing uploaded.</p>
<div id="gl-table-wrap"></div>
<div class="tip">Consistency tip: share the CSV with translators <b>before</b> dubbing starts \u2014 brand terms, product names, and CTAs must translate identically in every language. Pairs well with the <a href="dubbing-planner.html">dubbing planner</a>.</div>
"""

FINDER_BOX = """
<div id="quiz">
<div class="step active quiz-q" data-q="langs"><p>1. How many languages do you need?</p>
<div class="quiz-opts">
<button data-v="1-2">1\u20132</button><button data-v="3-10">3\u201310</button><button data-v="10+">10+</button>
</div></div>
<div class="step quiz-q" data-q="budget"><p>2. Monthly budget?</p>
<div class="quiz-opts">
<button data-v="free">Free only</button><button data-v="low">Under $25/mo</button><button data-v="mid">$25\u2013$100/mo</button><button data-v="high">$100+/mo</button>
</div></div>
<div class="step quiz-q" data-q="use"><p>3. Main use case?</p>
<div class="quiz-opts">
<button data-v="dub">Video dubbing / lip-sync</button><button data-v="narrate">Narration / voiceover</button><button data-v="realtime">Real-time / live</button><button data-v="podcast">Podcast / audiobooks</button>
</div></div>
<div class="step quiz-q" data-q="quality"><p>4. What matters most?</p>
<div class="quiz-opts">
<button data-v="natural">Most natural voice</button><button data-v="fast">Fast &amp; simple workflow</button><button data-v="api">API for automation</button>
</div></div>
</div>
<div style="margin-top:14px"><button class="btn-sm" id="quiz-go">Get my recommendation \u2192</button></div>
<div id="quiz-result" class="result" style="display:none"></div>
<p style="color:var(--muted);font-size:.85rem;margin-top:12px">Want the full comparison first? Read <a href="../guides/best-multilingual-ai-voice-tools-2026.html">Best Multilingual AI Voice Tools 2026</a>, or test free browser voices in our <a href="language-voice-tester.html">voice tester</a>.</p>
"""

tool_page("language-voice-tester", "\U0001f50a Language Voice Tester",
          "Hear your text in any language your device supports \u2014 free, instant, nothing leaves your browser. Perfect for previewing how a line will sound before you pay for a multilingual AI voice.",
          VOICE_TESTER_BOX, "language-voice-tester.js")
tool_page("dubbing-planner", "\U0001f3ac Video Dubbing Planner",
          "Translations change your timing: Spanish runs ~20% longer than English, Japanese shorter. Enter your script once and get word targets and timing notes for every language you dub into.",
          DUBBING_BOX, "dubbing-planner.js")
tool_page("translation-glossary", "\U0001f4da Translation Glossary Builder",
          "Keep every language consistent: brand terms, product names, and calls to action translated exactly the same way, every time. Build the list, export CSV, hand it to your translators.",
          GLOSSARY_BOX, "translation-glossary.js")
tool_page("voice-tool-finder", "\U0001f9ed Multilingual Voice Tool Finder",
          "ElevenLabs, Murf, PlayHT, HeyGen, Rask AI, Azure, Google \u2014 which one fits YOU? Answer four quick questions and get a personalized recommendation in under a minute.",
          FINDER_BOX, "voice-tool-finder.js")

# ---------------------------------------------------------------- guides + blog
def content_page(dir, slug, h1, title, desc, body_html):
    canon = f"{SITE}/{dir}/{slug}.html"
    ld = article_ld(title.split(" \u2014")[0], canon, desc)
    html = head(title, desc, canon, ld, "../css/style.css")
    html += "\n" + nav_sub(1) + f"""
<div class="wrap">
<div class="breadcrumb"><a href="../index.html">Home</a> \u2192 {h1}</div>
<article class="content">
<h1>{h1}</h1>
{body_html}
</article>
</div>

{FOOTER}
<script src="../js/main.js"></script>
</body>
</html>"""
    w(f"{dir}/{slug}.html", html)

GUIDE1_BODY = """<p style="color:var(--muted)"><em>Updated October 2026 \u00b7 9-minute read</em></p>
""" + ADSLOT + """
<p>If your audience is in the USA, "English only" leaves money on the table. Over 67 million US residents speak a language other than English at home \u2014 Spanish, Chinese, French, Arabic, Hindi, and Vietnamese audiences are massive, underserved, and hungry for content. Multilingual AI voice tools let one creator publish in a dozen languages without hiring a dozen voice actors. Here is the honest 2026 comparison.</p>

<h2>How we compare multilingual voice tools</h2>
<p>Three things decide whether a tool is worth your money: <strong>language coverage</strong> (not just the count \u2014 the <em>quality</em> of non-English voices), <strong>voice naturalness</strong> (does it pass the "would I watch 10 minutes of this?" test), and <strong>workflow</strong> (dubbing with lip-sync vs plain TTS vs API). Price matters, but a cheap tool that sounds robotic in Spanish costs you more in lost watch time.</p>

<h2>The top multilingual AI voice tools of 2026</h2>
<h3>1. ElevenLabs \u2014 best overall voice quality</h3>
<p>ElevenLabs remains the naturalness champion in 2026, supporting 32 languages with voices that regularly fool listeners in blind tests. Its killer feature for multilingual creators is <strong>voice cloning across languages</strong>: clone your voice once, then speak Spanish, Hindi, or French as "you." The free tier (10,000 characters/month) is genuinely usable for testing. Paid plans start around $5/month. Weakness: fewer languages than PlayHT or HeyGen.</p>
<h3>2. HeyGen \u2014 best AI video dubbing</h3>
<p>When you need your <em>video</em> dubbed \u2014 not just the audio \u2014 HeyGen leads with 175+ languages and dialects, AI translation, voice cloning, and lip-sync that matches the new audio to your mouth movements. It is the closest thing to "upload once, publish everywhere." Pricing starts around $29/month. Best for YouTubers and course creators dubbing talking-head content.</p>
<h3>3. Rask AI \u2014 best translation-first dubbing</h3>
<p>Rask AI covers 135 languages and is built around one job: turning your finished video into dubbed versions with translated subtitles and voiceovers. Its timing engine handles the word-expansion problem (Spanish runs ~20% longer than English) better than most. Plans start around $50/month. Pair it with our free <a href="../tools/dubbing-planner.html">dubbing planner</a> to sanity-check word counts first.</p>
<h3>4. PlayHT \u2014 most languages</h3>
<p>PlayHT supports 140+ languages with a strong API, making it the pick when your language list is long or unusual. Voice quality trails ElevenLabs slightly for the top languages but is excellent for the price. A solid choice for developers and agencies automating multilingual audio at scale.</p>
<h3>5. Murf \u2014 easiest for creators</h3>
<p>Murf's 20+ languages and 120+ voices come wrapped in the simplest studio interface in this list: paste a script, pick a voice, export. No API keys, no learning curve. Plans start around $19/month. The language list is shorter than competitors, but if your targets are Spanish, French, German, Portuguese, Hindi, or Arabic, Murf is the fastest path to finished audio.</p>
<h3>6. Google Cloud Text-to-Speech \u2014 best API value</h3>
<p>Fifty-plus languages, a generous free tier, and pay-as-you-go pricing that scales to millions of characters. The WaveNet and newer generative voices sound good \u2014 not ElevenLabs good, but good. If you are building an app or automating a content pipeline, start here.</p>
<h3>7. Azure AI Speech \u2014 best enterprise control</h3>
<p>Microsoft's 140+ locales, fine-grained SSML control, and real-time streaming make Azure the enterprise default. Overkill for a solo YouTuber; perfect for teams with compliance requirements or real-time needs.</p>
<h3>8. Captions \u2014 best for short-form</h3>
<p>Captions dubs short-form video (Reels, TikTok, Shorts) into 29 languages with lip-sync, right from your phone. Its free tier makes it the zero-risk way to test whether dubbing grows your audience before spending a dollar.</p>

<h2>Comparison table</h2>
<table>
<tr><th>Tool</th><th>Languages</th><th>Starts at</th><th>Best for</th></tr>
<tr><td><b>ElevenLabs</b></td><td>32</td><td>Free / $5 mo</td><td>Most natural voices, cloning</td></tr>
<tr><td><b>HeyGen</b></td><td>175+</td><td>~$29 mo</td><td>Video dubbing + lip-sync</td></tr>
<tr><td><b>Rask AI</b></td><td>135</td><td>~$50 mo</td><td>YouTube dubbing workflow</td></tr>
<tr><td><b>PlayHT</b></td><td>140+</td><td>~$19 mo</td><td>Long language lists, API</td></tr>
<tr><td><b>Murf</b></td><td>20+</td><td>~$19 mo</td><td>Simplest creator workflow</td></tr>
<tr><td><b>Google Cloud TTS</b></td><td>50+</td><td>Free / pay-go</td><td>API value at scale</td></tr>
<tr><td><b>Azure AI Speech</b></td><td>140+ locales</td><td>Pay-go</td><td>Enterprise, real-time</td></tr>
<tr><td><b>Captions</b></td><td>29</td><td>Free tier</td><td>Short-form dubbing</td></tr>
</table>

<h2>Which one should you pick?</h2>
<p>Still unsure? Take our <a href="../tools/voice-tool-finder.html">60-second tool finder quiz</a> \u2014 four questions about your languages, budget, and use case, and you get a personalized pick. Quick rules of thumb:</p>
<ul>
<li><strong>Solo creator, best quality:</strong> ElevenLabs.</li>
<li><strong>Dubbing talking-head videos:</strong> HeyGen (lip-sync) or Rask AI (workflow).</li>
<li><strong>Tight budget:</strong> Captions free tier, then ElevenLabs free tier.</li>
<li><strong>Developer / automation:</strong> Google Cloud TTS or PlayHT.</li>
</ul>

<h2>Free vs paid: when should you upgrade?</h2>
<p>Start free \u2014 seriously. Every tool on this list except Rask AI has a free tier or trial, and the free options are good enough to publish your first dubbed video. Upgrade when you hit a real limit, not before: you are dubbing more than 2\u20133 videos a month, you need voice cloning so every language sounds like you, or you need an API to automate a pipeline. A common upgrade path that works well for US creators is Captions (free short-form tests) \u2192 ElevenLabs Starter (natural narration and cloning) \u2192 HeyGen or Rask AI (full video dubbing with lip-sync) once multilingual views justify the spend. Track revenue per language for 60 days before committing to an annual plan \u2014 most creators find one or two languages drive 80% of their dubbed views, so pay for quality where it counts and stay free everywhere else.</p>

<h2>Don't skip the disclosure</h2>
<p>YouTube, TikTok, and Meta all require you to label AI-generated or AI-altered voices. Our <a href="how-to-dub-videos-with-ai.html">dubbing guide</a> covers the platform-by-platform rules \u2014 get this right before you publish your first dubbed video.</p>

<h2>Start free today</h2>
<p>Before spending anything, <a href="../tools/language-voice-tester.html">test voices in 30+ languages</a> free in your browser, and <a href="../tools/dubbing-planner.html">plan your dubbing word counts</a> so translations land on time.</p>
""" + ADSLOT

content_page("guides", "best-multilingual-ai-voice-tools-2026",
    "\U0001f30d Best Multilingual AI Voice Tools 2026",
    "Best Multilingual AI Voice Tools 2026 \u2014 8 Compared Honestly",
    "Honest 2026 comparison of multilingual AI voice tools: ElevenLabs vs HeyGen vs Rask AI vs PlayHT vs Murf \u2014 languages, pricing, and best picks.",
    GUIDE1_BODY)

GUIDE2_BODY = """<p style="color:var(--muted)"><em>Updated October 2026 \u00b7 7-minute read</em></p>
""" + ADSLOT + """
<p>AI dubbing turns one video into five, ten, or twenty \u2014 each speaking the viewer's own language. US creators are quietly doubling their audiences by dubbing into Spanish alone. Here is the complete workflow, from script to published dubbed video.</p>

<h2>Step 1: Prepare a dubbing-friendly script</h2>
<p>Dubbing starts before translation. Short sentences (12\u201318 words), one idea per sentence, and no untranslatable idioms ("it's raining cats and dogs" becomes "it's raining heavily"). Paste your script into our <a href="../tools/dubbing-planner.html">dubbing planner</a> to get your source word count and spoken duration \u2014 you will need both in step 3.</p>

<h2>Step 2: Translate \u2014 then adapt, don't just translate</h2>
<p>Machine translation gets you 80% there; a native speaker (or a careful review pass) gets you the last 20% that keeps viewers watching. Build a <a href="../tools/translation-glossary.html">translation glossary</a> first: your brand terms, product names, CTAs, and recurring phrases, translated identically every time. Inconsistent terms are the fastest way to sound amateur in a second language.</p>

<h2>Step 3: Fix the timing problem</h2>
<p>This is where most first dubs fail. Translated speech is rarely the same length as the original: Spanish runs ~20% longer than English, Arabic ~25% longer, while Japanese and Mandarin run ~15\u201320% <em>shorter</em>. Our <a href="../tools/dubbing-planner.html">dubbing planner</a> calculates per-language word targets and tells you whether to condense the script, raise delivery speed 5\u201310%, or add pauses and reaction beats to fill scenes.</p>

<h2>Step 4: Generate the voices</h2>
<p>Pick your tool based on the job (see our <a href="best-multilingual-ai-voice-tools-2026.html">2026 tools comparison</a>):</p>
<ul>
<li><strong>Talking-head with lip-sync:</strong> HeyGen or Rask AI \u2014 they match mouth movements to the new audio.</li>
<li><strong>Narration / voiceover:</strong> ElevenLabs or Murf \u2014 most natural delivery.</li>
<li><strong>Short-form:</strong> Captions \u2014 dub Reels and Shorts from your phone.</li>
</ul>
<p>Clone your own voice when the tool supports it \u2014 audiences trust a consistent voice across languages far more than a rotating cast of stock voices.</p>

<h2>Step 5: Sync, mix, and review</h2>
<p>Even the best AI dubbing needs a human review pass: watch each language version at full speed, check that emphasis lands on the right words, and confirm background music and sound effects sit correctly under the new voice. Budget 30 minutes of review per 10 minutes of video \u2014 this is the step that separates professional dubs from obvious AI output.</p>

<h2>Step 6: Disclose the AI \u2014 it's required</h2>
<p>YouTube requires disclosure for content with AI-altered voices or lip-sync (check the "altered content" box in YouTube Studio). TikTok and Meta have similar AI-label rules. Disclose every time: undisclosed synthetic dubbing risks demonetization or removal, and honest labeling does not hurt performance \u2014 viewers care about value, not how the voice was made.</p>

<h2>Step 7: Publish and measure per language</h2>
<p>Publish each language as its own video (or use YouTube's multi-language audio tracks for one video with many dubs). Track watch time per language for 30 days, then double down on the winners. Most US creators find Spanish dubs deliver the fastest ROI \u2014 43+ million US Spanish speakers are waiting.</p>

<h2>Quick checklist</h2>
<ul>
<li>Script written dubbing-friendly (short sentences, no idioms)</li>
<li><a href="../tools/translation-glossary.html">Glossary</a> built and shared with translators</li>
<li><a href="../tools/dubbing-planner.html">Word targets + timing</a> calculated per language</li>
<li>Voice cloned for consistency across languages</li>
<li>Full-speed human review of every language version</li>
<li>AI disclosure set on every platform</li>
</ul>
""" + ADSLOT

content_page("guides", "how-to-dub-videos-with-ai",
    "\U0001f3ac How to Dub Videos with AI (2026 Workflow)",
    "How to Dub Videos with AI \u2014 Full 2026 Workflow Guide",
    "The complete AI video dubbing workflow: script prep, translation, timing fixes, voice generation, lip-sync, review, and platform disclosure rules.",
    GUIDE2_BODY)

# ---------------------------------------------------------------- blog
def build_blog_index():
    ld = f"""<script type="application/ld+json">
{{"@context":"https://schema.org","@type":"Blog","name":"{BRAND} Blog","url":"{SITE}/blog/"}}
</script>"""
    html = head("MultilingualVoiceHub Blog \u2014 Voice AI Tips & Dubbing News",
        "The MultilingualVoiceHub blog: why multilingual content wins in the USA, AI dubbing mistakes to avoid, and practical multilingual voice tips.",
        f"{SITE}/blog/", ld, "../css/style.css")
    html += "\n" + nav_sub(1) + """
<div class="wrap">
<div class="breadcrumb"><a href="../index.html">Home</a> \u2192 Blog</div>
<h1>\U0001f4dd MultilingualVoiceHub Blog</h1>
<p style="color:var(--muted)">Practical notes on multilingual AI voice, dubbing, and reaching audiences in their own language.</p>

""" + ADSLOT + """

<div class="cards">
<div class="card"><h3>Why Multilingual Content Wins in the USA</h3><p>67 million US residents speak another language at home. Here's the data behind dubbing into Spanish, Chinese, Arabic, and more \u2014 and the ROI math.</p><a href="why-multilingual-content-wins-usa.html">Read article \u2192</a></div>
<div class="card"><h3>7 AI Dubbing Mistakes That Kill Watch Time</h3><p>Robotic pacing, inconsistent terms, skipped disclosure \u2014 the seven mistakes that make viewers click away from dubbed videos, and how to fix each one.</p><a href="ai-dubbing-mistakes.html">Read article \u2192</a></div>
</div>
</div>

""" + FOOTER + """
<script src="../js/main.js"></script>
</body>
</html>"""
    w("blog/index.html", html)

BLOG1 = """<p style="color:var(--muted)"><em>October 2026 \u00b7 5-minute read</em></p>
""" + ADSLOT + """
<p>Most US creators publish in English and call it a day. The numbers say that is a mistake: the US is one of the most linguistically diverse content markets on earth, and non-English audiences are dramatically underserved by creators.</p>

<h2>The audience is already there</h2>
<ul>
<li><strong>Spanish:</strong> 43+ million US speakers \u2014 the second-largest Spanish-speaking audience of any country.</li>
<li><strong>Chinese (Mandarin/Cantonese):</strong> 3.5+ million speakers, heavily concentrated in high-CPM metro areas.</li>
<li><strong>French, Arabic, Hindi, Vietnamese, Korean, Tagalog:</strong> each counts speakers in the millions.</li>
</ul>
<p>These viewers watch YouTube, TikTok, and Instagram like everyone else \u2014 but find far less content made for them. Less competition means cheaper attention.</p>

<h2>Why dubbing beats subtitling for growth</h2>
<p>Subtitles work, but dubbed audio wins on retention: viewers \u2014 especially on mobile \u2014 watch longer when they can listen instead of read. Platforms reward that watch time with more distribution. AI dubbing with tools like <a href="../guides/best-multilingual-ai-voice-tools-2026.html">HeyGen or Rask AI</a> now produces dubs good enough that most viewers never question them.</p>

<h2>The ROI math</h2>
<p>A 10-minute video takes roughly an extra 1\u20132 hours to dub into one language with AI (mostly review time). If that dub brings even 20% of the original's views from an audience your competitors ignore, the payback is enormous \u2014 and every future video compounds it, because you reuse the same <a href="../tools/translation-glossary.html">glossary</a>, voice clone, and workflow.</p>

<h2>Where to start</h2>
<p>Start with <strong>one</strong> language \u2014 Spanish for most US creators. <a href="../tools/dubbing-planner.html">Plan the timing</a>, follow our <a href="../guides/how-to-dub-videos-with-ai.html">dubbing workflow</a>, publish, and measure for 30 days. Then add language two. The creators winning multilingual in 2026 didn't start with ten languages; they started with one and kept going.</p>
""" + ADSLOT

BLOG2 = """<p style="color:var(--muted)"><em>October 2026 \u00b7 6-minute read</em></p>
""" + ADSLOT + """
<p>AI dubbing is easy to start and easy to get wrong. These seven mistakes are why most dubbed videos underperform \u2014 fix them and your dubs will hold viewers like the original.</p>

<h2>1. Ignoring word-expansion timing</h2>
<p>Spanish runs ~20% longer than English; Arabic ~25%. Dub without adjusting and your audio overruns every scene cut. Fix: run every script through a <a href="../tools/dubbing-planner.html">dubbing planner</a> before generating voices.</p>

<h2>2. Inconsistent terminology</h2>
<p>Your product called three different things across three languages looks unprofessional. Fix: build a <a href="../tools/translation-glossary.html">translation glossary</a> before dubbing starts and share it with every translator.</p>

<h2>3. Skipping AI disclosure</h2>
<p>YouTube, TikTok, and Meta require labeling AI-generated voices and lip-sync. Undisclosed dubs risk demonetization. Fix: set the disclosure on every upload \u2014 it does not hurt performance.</p>

<h2>4. Using a different stock voice per language</h2>
<p>Viewers bond with a voice. A rotating cast of generic voices breaks trust. Fix: clone your own voice (ElevenLabs, HeyGen) so "you" speak every language.</p>

<h2>5. Translating idioms literally</h2>
<p>"Break a leg" dubbed word-for-word confuses everyone. Fix: write dubbing-friendly scripts \u2014 short sentences, no idioms \u2014 or adapt during translation review.</p>

<h2>6. No human review pass</h2>
<p>AI misplaces emphasis and mispronounces names. Publishing raw output is the most common quality killer. Fix: watch every language version at full speed; budget 30 min review per 10 min of video.</p>

<h2>7. Dubbing everything instead of testing one language</h2>
<p>Ten mediocre dubs lose to one excellent dub. Fix: start with Spanish, measure 30 days, then expand. Our <a href="../guides/how-to-dub-videos-with-ai.html">dubbing guide</a> walks through the full workflow.</p>

<h2>The pattern</h2>
<p>Every mistake on this list is a <em>process</em> failure, not a tool failure. The tools in our <a href="../guides/best-multilingual-ai-voice-tools-2026.html">2026 comparison</a> are all capable of excellent dubs \u2014 the difference is the workflow around them. Plan timing, lock terms, clone your voice, review like a professional, disclose honestly.</p>
""" + ADSLOT

content_page("blog", "why-multilingual-content-wins-usa",
    "\U0001f4ca Why Multilingual Content Wins in the USA",
    "Why Multilingual Content Wins in the USA \u2014 Data & ROI",
    "67M US residents speak another language at home. The data behind multilingual content, why dubbing beats subtitling, and the ROI math for creators.",
    BLOG1)
content_page("blog", "ai-dubbing-mistakes",
    "\u26a0\ufe0f 7 AI Dubbing Mistakes That Kill Watch Time",
    "7 AI Dubbing Mistakes That Kill Watch Time (And Fixes)",
    "The 7 AI dubbing mistakes that make viewers click away: timing, terminology, disclosure, voice consistency \u2014 and how to fix each one.",
    BLOG2)
build_blog_index()
print("ALL BUILT OK")
