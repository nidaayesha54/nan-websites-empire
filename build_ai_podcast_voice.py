#!/usr/bin/env python3
"""Builds the ai-podcast-voice static site."""
import os, json, re, html, subprocess, sys

BASE = os.path.expanduser('~/workspace/free-sites')
KEY = 'ai-podcast-voice'
DATE = '2026-10-12'
ADSLOT = '<!-- AD-SLOT -->'
FOOTER_BRAND = ('Built by <a href="https://nidaayesha.com" target="_blank" rel="noopener">NAN Marketing Agency</a> | '
                '<span>Our sites: <a href="https://aivideodetector.site" target="_blank" rel="noopener">AI Video Detector</a> &middot; '
                '<a href="https://epstopikpakistan.blogspot.com" target="_blank" rel="noopener">EpsTopik Pakistan</a></span>')

SITE = {
  'name':'AIPodcastVoice','brand':'AI<span>Podcast</span>Voice',
  'base':'https://nan-aipodcastvoice.surge.sh/',
  'index_h1':'Free AI Podcast Tools: Planner, Script Writer & Voice Picker',
  'index_title':'AIPodcastVoice — Free AI Podcast Tools: Planner, Scripts & Voices',
  'index_desc':'Free AI podcast tools: episode planner with segment timers, script writer for interview/solo/narrative formats, AI voice picker quiz, and a TTS voice demo.',
  'hero_lede':'Plan, write, and voice your podcast with free browser tools. Build episode outlines with timers, generate structured scripts, pick the perfect AI voice — then preview it instantly. No signup.',
}

TOOLS = [
  {'slug':'episode-planner','name':'Episode Planner','js':'episode-planner.js',
   'card':'Topic in, full outline out: intro, segments with talking points, and outro — plus a live countdown timer per segment and total runtime.',
   'title':'Podcast Episode Planner: Outline + Segment Timers | AIPodcastVoice',
   'desc':'Free podcast episode planner: turn any topic into a timed outline with intro, segments, outro, talking points, and live segment countdown timers.',
   'h1':'Podcast Episode Planner: Outline Generator + Segment Timers',
   'lede':'Enter your topic and target length. Get a ready-to-record outline with timed segments, talking points, hooks — and a live countdown timer for every segment.'},
  {'slug':'podcast-script-writer','name':'Script Writer','js':'podcast-script-writer.js',
   'card':'Pick a format — interview, solo, or narrative — and get a full structured script with timestamps, speaker cues, and music/SFX notes.',
   'title':'Podcast Script Writer: Interview, Solo & Narrative | AIPodcastVoice',
   'desc':'Free podcast script writer: choose interview, solo, or narrative format and get a structured, timestamped script with speaker cues and SFX notes.',
   'h1':'Podcast Script Writer: Interview, Solo & Narrative Templates',
   'lede':'Stop staring at a blank page. Choose your format and topic — get a complete structured script with timestamps, who says what, and production cues.'},
  {'slug':'voice-picker','name':'AI Voice Picker','js':'voice-picker.js',
   'card':'Answer a 5-question quiz about tone, audience, and genre — get a recommended AI voice style with exact rate, pitch, and pause settings.',
   'title':'AI Voice Picker for Podcasts: Find Your Voice Style | AIPodcastVoice',
   'desc':'Free AI voice picker quiz: answer 5 questions about tone, audience, and genre to get your recommended podcast voice style and settings.',
   'h1':'AI Voice Picker: Find the Right Voice Style for Your Podcast',
   'lede':'The wrong voice kills a great episode. Answer 5 quick questions and get a voice-style recommendation with the exact settings to use.'},
  {'slug':'tts-demo','name':'TTS Voice Demo','js':'tts-demo.js',
   'card':'Paste your intro script and hear it read aloud in your browser with podcast-style rate and pitch — using the Web Speech API.',
   'title':'Free Podcast TTS Demo: Hear Your Script Read Aloud | AIPodcastVoice',
   'desc':'Free text-to-speech demo for podcasters: paste your script, pick a voice, adjust rate and pitch, and hear your intro read aloud in your browser.',
   'h1':'Free Podcast TTS Demo: Preview Your Script Out Loud',
   'lede':'Paste your intro or ad read, pick a voice, tune the rate and pitch — and hear how it sounds before you record. Runs entirely in your browser.'},
]

GUIDES = [
  {'slug':'best-ai-voices-for-podcasts-2026',
   'title':'Best AI Voices for Podcasts in 2026 (Ranked & Compared) | AIPodcastVoice',
   'desc':'The best AI voices for podcasts in 2026, ranked: ElevenLabs, PlayHT, Murf, Descript Overdub, WellSaid Labs and more — compared on quality, price, and podcast fit.',
   'h1':'Best AI Voices for Podcasts in 2026: Ranked & Compared'},
  {'slug':'how-to-start-ai-podcast',
   'title':'How to Start an AI Podcast in 2026: Step-by-Step | AIPodcastVoice',
   'desc':'How to start an AI podcast in 2026: pick a niche, plan episodes, write scripts, choose an AI voice, edit, publish on Spotify, and grow — step by step.',
   'h1':'How to Start an AI Podcast in 2026: The Complete Step-by-Step Guide'},
]

POSTS = [
  {'slug':'ai-vs-human-podcast-voices',
   'title':'AI vs Human Podcast Voices: Pros, Cons & the Hybrid Sweet Spot | AIPodcastVoice',
   'desc':'AI vs human podcast voices: where AI narration wins, where it still falls short, and the hybrid workflow top solo podcasters actually use.',
   'h1':'AI vs Human Podcast Voices: An Honest Comparison'},
  {'slug':'plan-podcast-episodes-faster',
   'title':'How to Plan Podcast Episodes in Half the Time (5-Step Workflow) | AIPodcastVoice',
   'desc':'Plan podcast episodes in half the time: a 5-step workflow — topic, outline, timing, script, voice check — with free tools that do the heavy lifting.',
   'h1':'Plan Podcast Episodes in Half the Time: A 5-Step Workflow'},
]

FAQS = [
  ("What is an AI podcast voice?","An AI podcast voice is a synthetic narration voice created with text-to-speech technology. You type or paste your script, pick a voice, and the AI reads it aloud — many 2026 voices are nearly indistinguishable from human narration for short-form content."),
  ("Are AI-voiced podcasts allowed on Spotify and Apple Podcasts?","Yes. Both platforms allow AI-generated audio as long as it is not spam, does not impersonate real people without consent, and follows each platform's content policies. Disclosing AI use in your show notes is strongly recommended for listener trust."),
  ("Do I need to disclose that my podcast uses an AI voice?","There is no single global law yet, but transparency builds trust: most successful AI podcasters note it in the show description or episode notes. The FTC expects endorsements and claims to be truthful regardless of who — or what — reads them."),
  ("How long should a podcast episode be?","It depends on your audience: 20–30 minutes suits commute listening, 45–60 minutes suits deep-dive and interview shows, and under 15 minutes works for daily news or tips formats. Consistency matters more than length — our episode planner helps you hit your target runtime."),
  ("Can I use the Web Speech API demo for my final audio?","The built-in demo is for previewing how your script sounds with different rates, pitches, and voices. For publish-quality audio, use a dedicated AI voice service like ElevenLabs, PlayHT, or Murf, which offer higher-fidelity models, voice cloning, and commercial licenses."),
  ("How do I pick the right AI voice for my show?","Match the voice to your tone, audience, and genre: warm and conversational for lifestyle shows, authoritative for business and news, energetic for comedy and sports. Take our free AI voice picker quiz — it recommends a style and the exact settings to use."),
]

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
<a href="{root}tools/index.html"{nav_tools}>Tools</a>
<a href="{root}guides/index.html"{nav_guides}>Guides</a>
<a href="{root}blog/index.html"{nav_blog}>Blog</a>
</nav></div></header>
<main id="main">{body}</main>
<div class="wrap"><div class="ad-slot">{adslot}</div></div>
<footer class="site-footer"><div class="wrap">
<p>{footer_brand}</p>
<nav class="footer-nav">
<a href="{root}index.html">Home</a>
<a href="{root}tools/index.html">Tools</a>
<a href="{root}guides/index.html">Guides</a>
<a href="{root}blog/index.html">Blog</a>
</nav>
<p class="footer-note">All tools are free and run in your browser. Educational content only — not professional advice.</p>
</div></footer>
<script src="{root}js/main.js"></script>
{scripts}</body>
</html>
"""

def ld_script(obj):
    return '<script type="application/ld+json">\n'+json.dumps(obj, separators=(',',':'))+'\n</script>'

def faq_ld():
    ents = [{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in FAQS]
    return ld_script({"@context":"https://schema.org","@graph":[
        {"@type":"WebSite","name":"AIPodcastVoice","url":SITE['base']},
        {"@type":"FAQPage","mainEntity":ents}]})

def article_ld(headline, desc, canonical):
    return ld_script({"@context":"https://schema.org","@type":"Article",
        "headline":headline,"description":desc,
        "author":{"@type":"Organization","name":"AIPodcastVoice"},
        "datePublished":DATE,"dateModified":DATE,
        "mainEntityOfPage":{"@type":"WebPage","@id":canonical}})

def card(title, url, text, tag=None):
    t = '<span class="tag">'+tag+'</span>' if tag else ''
    return '<div class="card">'+t+'<h3><a href="'+url+'">'+html.escape(title)+'</a></h3><p>'+text+'</p><a class="card-link" href="'+url+'">Open &rarr;</a></div>'

def write_page(rel, title, desc, body, jsonld='', scripts='', nav=''):
    root = '../' if '/' in rel else ''
    navs = {'nav_home':'','nav_tools':'','nav_guides':'','nav_blog':''}
    if nav: navs[nav] = ' class="active"'
    out = TEMPLATE.format(title=html.escape(title), desc=html.escape(desc),
        canonical=SITE['base']+rel, root=root, brand=SITE['brand'],
        body=body, jsonld=jsonld, scripts=scripts, adslot=ADSLOT,
        footer_brand=FOOTER_BRAND, **navs)
    p = os.path.join(BASE, KEY, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p,'w').write(out)
    return p

# ------------------------------------------------------------- CSS
CSS = """:root{
  --primary:#7c3aed; --primary-dark:#4c1d95; --accent:#f59e0b; --accent-soft:#fef3e2;
  --bg:#ffffff; --bg-soft:#f7f5fd; --text:#22303f; --muted:#5d7186; --border:#e2dcf4;
  --good:#1c7a3d; --good-bg:#e7f5ec; --warn:#9a6712; --warn-bg:#fdf3e0; --bad:#b3372f; --bad-bg:#fbe9e8;
  --radius:12px; --shadow:0 2px 14px rgba(76,29,149,.08);
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:var(--text);line-height:1.65;background:var(--bg);font-size:17px}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
a{color:var(--primary)}
img{max-width:100%}
.site-header{background:var(--primary);color:#fff;position:sticky;top:0;z-index:60;box-shadow:0 2px 8px rgba(0,0,0,.15)}
.header-inner{display:flex;align-items:center;justify-content:space-between;padding:14px 20px}
.brand{color:#fff;text-decoration:none;font-weight:800;font-size:1.3rem;letter-spacing:.3px}
.brand span{color:var(--accent)}
.main-nav{display:flex;gap:6px}
.main-nav a{color:#eaf0f7;text-decoration:none;padding:8px 14px;border-radius:8px;font-weight:600;font-size:.95rem}
.main-nav a:hover,.main-nav a.active{background:rgba(255,255,255,.14);color:#fff}
.nav-toggle{display:none;background:none;border:2px solid rgba(255,255,255,.5);color:#fff;border-radius:8px;font-size:1.2rem;padding:4px 12px;cursor:pointer}
.skip{position:absolute;left:-9999px}
.hero{background:linear-gradient(135deg,var(--primary-dark),var(--primary));color:#fff;padding:64px 0 56px}
.hero h1{font-size:2.4rem;line-height:1.2;margin:0 0 14px;color:#fff}
.hero .lede{font-size:1.15rem;color:#e6ddf9;max-width:640px}
.hero-ctas{margin-top:24px;display:flex;gap:12px;flex-wrap:wrap}
.btn{display:inline-block;background:var(--accent);color:#1d1a08;font-weight:700;text-decoration:none;padding:13px 26px;border-radius:var(--radius);border:none;cursor:pointer;font-size:1rem}
.btn:hover{filter:brightness(1.06)}
.btn-outline{background:transparent;color:#fff;border:2px solid rgba(255,255,255,.7)}
.btn-outline:hover{background:rgba(255,255,255,.12)}
.btn-primary{background:var(--primary);color:#fff}
.btn-small{padding:8px 16px;font-size:.9rem}
.section{padding:52px 0}
.section-alt{background:var(--bg-soft)}
.section h2{font-size:1.7rem;margin:0 0 8px;color:var(--primary-dark)}
.section .sub{color:var(--muted);margin:0 0 28px;max-width:700px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
.card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:26px;box-shadow:var(--shadow);display:flex;flex-direction:column}
.card h3{margin:0 0 8px;font-size:1.2rem;color:var(--primary-dark)}
.card h3 a{color:var(--primary-dark);text-decoration:none}
.card h3 a:hover{color:var(--primary);text-decoration:underline}
.card p{color:var(--muted);flex:1;margin:0 0 16px}
.card .card-link{font-weight:700;color:var(--primary);text-decoration:none}
.card .tag{display:inline-block;background:var(--accent-soft);color:#92400e;font-size:.75rem;font-weight:700;padding:3px 10px;border-radius:20px;margin-bottom:10px;width:fit-content}
.page{padding:40px 0 20px}
.page h1{font-size:2.1rem;color:var(--primary-dark);margin:0 0 10px;line-height:1.25}
.page .lede{font-size:1.1rem;color:var(--muted);max-width:720px}
.page h2{color:var(--primary-dark);margin:38px 0 12px;font-size:1.5rem}
.page h3{color:var(--primary-dark);margin:26px 0 8px;font-size:1.2rem}
.page p{max-width:760px}
.page ul,.page ol{max-width:740px}
.page blockquote{border-left:4px solid var(--accent);margin:20px 0;padding:8px 18px;background:var(--accent-soft);border-radius:0 8px 8px 0;max-width:760px}
.article-meta{color:var(--muted);font-size:.9rem;margin:0 0 20px}
.tool-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin:28px 0;align-items:start}
.tool-form{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:26px;box-shadow:var(--shadow)}
.field{margin-bottom:16px}
.field label{display:block;font-weight:600;margin-bottom:6px;font-size:.95rem}
.field input[type=text],.field input[type=number],.field select,.field textarea{width:100%;padding:11px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:1rem;font-family:inherit}
.field textarea{min-height:130px;resize:vertical;line-height:1.6}
.field input:focus,.field select:focus,.field textarea:focus{outline:2px solid var(--primary);border-color:var(--primary)}
.field .hint{font-size:.82rem;color:var(--muted);margin-top:4px}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
input[type=range]{accent-color:var(--primary);padding:0}
.range-val{font-weight:700;color:var(--primary)}
.radio-row{display:flex;gap:14px;flex-wrap:wrap;margin-top:8px}
.radio-row label{display:inline-flex;align-items:center;gap:6px;font-weight:600;font-size:.95rem;background:var(--bg-soft);border:1px solid var(--border);border-radius:20px;padding:8px 16px;cursor:pointer}
.radio-row input{accent-color:var(--primary)}
.tool-results{background:var(--bg-soft);border:1px solid var(--border);border-radius:var(--radius);padding:26px;min-height:200px}
.result-hero{background:#fff;border-radius:var(--radius);padding:20px;margin-bottom:16px;border:1px solid var(--border);text-align:center}
.result-hero .big{font-size:2.3rem;font-weight:800;color:var(--primary-dark);margin:6px 0}
.result-hero .lbl{font-size:.9rem;color:var(--muted);text-transform:uppercase;letter-spacing:.5px}
.stat-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);font-size:.97rem}
.stat-row:last-child{border-bottom:none}
.stat-row .k{color:var(--muted)}
.stat-row .v{font-weight:700}
.formula{background:#fff;border:1px dashed var(--primary);border-radius:8px;padding:14px 16px;margin:18px 0;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.92rem;overflow-x:auto}
.table-wrap{overflow-x:auto;margin:20px 0;border:1px solid var(--border);border-radius:var(--radius)}
table{width:100%;border-collapse:collapse;font-size:.92rem;background:#fff}
th{background:var(--primary);color:#fff;text-align:left;padding:10px 12px;white-space:nowrap}
td{padding:9px 12px;border-top:1px solid var(--border)}
tr:nth-child(even) td{background:var(--bg-soft)}
.verdict{border-radius:var(--radius);padding:16px 18px;margin:16px 0;font-weight:600}
.verdict.good{background:var(--good-bg);color:#14532b;border:1px solid #bfe3cc}
.verdict.caution{background:var(--warn-bg);color:#7a520a;border:1px solid #f0dcae}
.verdict.bad{background:var(--bad-bg);color:#8f2b26;border:1px solid #f2c4c1}
.faq details{background:#fff;border:1px solid var(--border);border-radius:var(--radius);margin-bottom:12px;box-shadow:var(--shadow)}
.faq summary{padding:16px 20px;font-weight:700;cursor:pointer;color:var(--primary-dark);list-style:none}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";float:right;color:var(--accent);font-size:1.3rem}
.faq details[open] summary::after{content:"\2013"}
.faq .faq-a{padding:0 20px 18px;color:var(--muted)}
.related{background:var(--bg-soft);border-radius:var(--radius);padding:24px;margin:36px 0}
.related h2{margin-top:0}
.site-footer{background:var(--primary-dark);color:#d9ccf5;padding:36px 0;margin-top:40px;font-size:.92rem}
.site-footer a{color:#fff}
.footer-nav{display:flex;gap:18px;flex-wrap:wrap;margin:14px 0}
.footer-nav a{text-decoration:none;color:#e6ddf9}
.footer-note{color:#b8a6dd;font-size:.85rem}
.ad-slot{margin:32px auto;text-align:center;min-height:90px}
.tips{list-style:none;padding:0}
.tips li{background:#fff;border:1px solid var(--border);border-left:4px solid var(--accent);border-radius:0 8px 8px 0;padding:10px 14px;margin-bottom:10px}
.outline-block{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:18px;margin-bottom:14px}
.outline-block h3{margin:0 0 6px;font-size:1.1rem;color:var(--primary-dark)}
.outline-block .seg-time{font-size:.85rem;font-weight:700;color:#92400e;background:var(--accent-soft);padding:2px 10px;border-radius:14px;margin-left:8px}
.outline-block ul{margin:8px 0 0}
.outline-block p{margin:6px 0}
.timer{display:flex;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap}
.timer .clock{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:1.4rem;font-weight:800;color:var(--primary-dark);background:var(--bg-soft);padding:4px 14px;border-radius:8px;min-width:110px;text-align:center}
.timer button{padding:7px 14px;font-size:.88rem;border-radius:8px;border:1.5px solid var(--primary);background:#fff;color:var(--primary);font-weight:700;cursor:pointer}
.timer button:hover{background:var(--primary);color:#fff}
.timer button:disabled{opacity:.4;cursor:default}
.timer button:hover:disabled{background:#fff;color:var(--primary)}
.script-line{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;margin-bottom:12px}
.script-line .meta{display:flex;gap:10px;align-items:center;margin-bottom:6px;flex-wrap:wrap}
.script-line .ts{font-family:ui-monospace,Menlo,Consolas,monospace;font-weight:800;color:var(--primary);font-size:.9rem}
.script-line .speaker{background:var(--primary-dark);color:#fff;font-size:.75rem;font-weight:700;padding:2px 10px;border-radius:12px;letter-spacing:.5px}
.script-line .cue{color:#92400e;font-style:italic;font-size:.9rem}
.script-line p{margin:4px 0 0}
.quiz-q{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:18px;margin-bottom:14px}
.quiz-q h3{margin:0 0 10px;font-size:1.05rem}
.voice-card{background:#fff;border:2px solid var(--accent);border-radius:var(--radius);padding:22px;margin-bottom:16px}
.voice-card h3{margin:0 0 4px;color:var(--primary-dark);font-size:1.3rem}
.voice-card .tagline{color:#92400e;font-weight:700;margin-bottom:10px}
@media(max-width:860px){
  .tool-grid{grid-template-columns:1fr}
  .nav-toggle{display:block}
  .main-nav{display:none;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:var(--primary-dark);padding:10px 20px 16px}
  .main-nav.open{display:flex}
  .hero h1{font-size:1.8rem}
  .page h1{font-size:1.65rem}
  .field-row{grid-template-columns:1fr}
}
"""

MAIN_JS = """/* Shared helpers for AIPodcastVoice tools */
function $(id){ return document.getElementById(id); }

function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function words(n){ return Math.round(n).toLocaleString('en-US'); }

function mmss(totalSec){
  totalSec = Math.max(0, Math.round(totalSec));
  var m = Math.floor(totalSec/60), s = totalSec%60;
  return (m<10?'0':'')+m + ':' + (s<10?'0':'')+s;
}

function setError(boxId, msg){
  var box = $(boxId);
  if(box){ box.innerHTML = '<div class="verdict bad">' + msg + '</div>'; }
}

function copyText(text, btn){
  function done(){
    if(btn){ var old = btn.textContent; btn.textContent = 'Copied!'; setTimeout(function(){ btn.textContent = old; }, 1600); }
  }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done, function(){ fallback(); });
  } else { fallback(); }
  function fallback(){
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch(e){}
    document.body.removeChild(ta); done();
  }
}

/* Mobile nav toggle */
document.addEventListener('DOMContentLoaded', function(){
  var t = document.querySelector('.nav-toggle');
  var nav = document.getElementById('mainNav');
  if(t && nav){
    t.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
});
"""

# ------------------------------------------------------------- tool JS
EPISODE_PLANNER_JS = """/* Episode Planner: outline generator + per-segment countdown timers */
document.addEventListener('DOMContentLoaded', function(){
  var form = $('epForm');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    generateOutline();
  });
});

var HOOKS = {
  casual: 'a question everyone secretly wonders about',
  professional: 'a challenge your industry keeps getting wrong',
  humorous: 'something so ridiculous you will laugh out loud',
  inspiring: 'a story that might just change how you see things'
};

var ANGLES = [
  {t:'The story behind {topic}', p:['How this topic started and why it matters now','The key moment that changed everything','The people or ideas at the center of it']},
  {t:'What most people get wrong about {topic}', p:['The #1 misconception (and the truth)','Why this myth keeps spreading','What to believe instead']},
  {t:'Real-world examples of {topic}', p:['A success story listeners can copy','A cautionary tale (what not to do)','What the data actually says']},
  {t:'Actionable takeaways on {topic}', p:['One thing to try this week','A simple framework to remember','Where to go deeper (resources)']},
  {t:'Myths vs. facts: {topic} edition', p:['Myth 1 vs. the reality','Myth 2 vs. the reality','The one fact that surprises everyone']},
  {t:'The future of {topic}', p:['Where this is heading in the next 2 years','What early adopters are already doing','How to stay ahead of the curve']}
];

var TONE_LINES = {
  casual: 'Keep it conversational — talk like you would to a smart friend.',
  professional: 'Keep it crisp and credible — cite sources and stay on point.',
  humorous: 'Lean into the comedy — callbacks and playful exaggeration welcome.',
  inspiring: 'Speak to the heart — stories first, lessons second.'
};

function fill(s, topic){ return s.replace(/\\{topic\\}/g, topic); }

function generateOutline(){
  var box = $('epResults');
  var topic = ($('epTopic').value || '').trim();
  var totalMin = parseInt($('epDuration').value, 10) || 30;
  var nSeg = parseInt($('epSegments').value, 10) || 3;
  var tone = $('epTone').value || 'casual';
  if(topic.length < 3){ setError('epResults', 'Please enter a topic of at least 3 characters.'); return; }

  var introMin = Math.max(1, Math.round(totalMin * 0.08));
  var outroMin = Math.max(1, Math.round(totalMin * 0.07));
  var segBudget = totalMin - introMin - outroMin;
  var base = Math.floor(segBudget / nSeg), extra = segBudget % nSeg;
  var segMins = [];
  for(var i=0;i<nSeg;i++){ segMins.push(base + (i < extra ? 1 : 0)); }

  var topicCap = topic.charAt(0).toUpperCase() + topic.slice(1);
  var htmlOut = '<div class="result-hero"><div class="lbl">Total episode runtime</div><div class="big">' +
    totalMin + ' min</div><div class="lbl">' + (nSeg+2) + ' blocks &middot; ' + nSeg + ' segments</div></div>';

  /* intro */
  htmlOut += '<div class="outline-block"><h3>Intro <span class="seg-time">' + introMin + ' min</span></h3><ul>' +
    '<li><strong>Hook (30s):</strong> "' + esc(topicCap) + ' — ' + esc(HOOKS[tone]) + '."</li>' +
    '<li><strong>Welcome:</strong> who you are, what the show is about, one sentence.</li>' +
    '<li><strong>Preview:</strong> "Today: ' + segMins.map(function(m,i){ return (i+1)+'. '+esc(fill(ANGLES[i % ANGLES.length].t, topicCap)); }).join('; ') + '."</li>' +
    '<li><strong>Tone note:</strong> ' + esc(TONE_LINES[tone]) + '</li></ul>' +
    '<div class="timer" data-secs="' + (introMin*60) + '"></div></div>';

  /* segments */
  for(var s=0; s<nSeg; s++){
    var a = ANGLES[s % ANGLES.length];
    var title = fill(a.t, topicCap);
    var pts = a.p.map(function(pt){ return '<li>' + esc(fill(pt, topic)) + '</li>'; }).join('');
    htmlOut += '<div class="outline-block"><h3>Segment ' + (s+1) + ': ' + esc(title) + ' <span class="seg-time">' + segMins[s] + ' min</span></h3>' +
      '<p><strong>Transition in:</strong> "So let\\'s dig into ' + esc(title.charAt(0).toLowerCase() + title.slice(1)) + '..."</p>' +
      '<ul>' + pts + '</ul>' +
      '<div class="timer" data-secs="' + (segMins[s]*60) + '"></div></div>';
  }

  /* outro */
  htmlOut += '<div class="outline-block"><h3>Outro <span class="seg-time">' + outroMin + ' min</span></h3><ul>' +
    '<li><strong>Recap:</strong> the 2–3 biggest takeaways from today’s episode.</li>' +
    '<li><strong>CTA:</strong> subscribe, leave a review, share with one person who needs this.</li>' +
    '<li><strong>Tease:</strong> what’s coming in the next episode.</li>' +
    '<li><strong>Sign-off:</strong> your tagline + theme music fade.</li></ul>' +
    '<div class="timer" data-secs="' + (outroMin*60) + '"></div></div>';

  htmlOut += '<button type="button" class="btn btn-primary" id="copyOutline">Copy outline as text</button>';
  box.innerHTML = htmlOut;

  /* wire timers */
  var timers = box.querySelectorAll('.timer');
  timers.forEach(function(el){ initTimer(el, parseInt(el.getAttribute('data-secs'),10)); });

  /* copy handler */
  var plain = 'EPISODE OUTLINE: ' + topicCap + ' (' + totalMin + ' min)\\n\\n' +
    'INTRO (' + introMin + ' min)\\n- Hook, welcome, preview, tone\\n\\n';
  for(var j=0;j<nSeg;j++){
    var a2 = ANGLES[j % ANGLES.length];
    plain += 'SEGMENT ' + (j+1) + ': ' + fill(a2.t, topicCap) + ' (' + segMins[j] + ' min)\\n' +
      a2.p.map(function(pt){ return '- ' + fill(pt, topic); }).join('\\n') + '\\n\\n';
  }
  plain += 'OUTRO (' + outroMin + ' min)\\n- Recap, CTA, tease, sign-off\\n';
  $('copyOutline').addEventListener('click', function(){ copyText(plain, this); });
}

function initTimer(el, seconds){
  var remaining = seconds, running = false, iv = null;
  el.innerHTML = '<span class="clock">' + mmss(remaining) + '</span>' +
    '<button type="button" data-act="start">Start</button>' +
    '<button type="button" data-act="pause" disabled>Pause</button>' +
    '<button type="button" data-act="reset">Reset</button>';
  var clock = el.querySelector('.clock');
  var bStart = el.querySelector('[data-act=start]');
  var bPause = el.querySelector('[data-act=pause]');
  function render(){ clock.textContent = mmss(remaining); }
  function stop(){ running = false; if(iv){ clearInterval(iv); iv = null; } bStart.disabled = false; bPause.disabled = true; }
  bStart.addEventListener('click', function(){
    if(running || remaining <= 0) return;
    running = true; bStart.disabled = true; bPause.disabled = false;
    iv = setInterval(function(){
      remaining--;
      if(remaining <= 0){ remaining = 0; render(); stop(); clock.textContent = 'DONE'; return; }
      render();
    }, 1000);
  });
  bPause.addEventListener('click', function(){ stop(); });
  el.querySelector('[data-act=reset]').addEventListener('click', function(){ stop(); remaining = seconds; render(); });
}
"""

SCRIPT_WRITER_JS = """/* Podcast Script Writer: interview / solo / narrative structured scripts */
document.addEventListener('DOMContentLoaded', function(){
  var form = $('swForm');
  if(!form) return;
  form.querySelectorAll('input[name=format]').forEach(function(r){
    r.addEventListener('change', function(){
      $('guestField').style.display = (document.querySelector('input[name=format]:checked').value === 'interview') ? '' : 'none';
    });
  });
  form.addEventListener('submit', function(e){ e.preventDefault(); generateScript(); });
});

function tsAt(frac, totalMin){
  return mmss(Math.round(frac * totalMin * 60));
}

function generateScript(){
  var box = $('swResults');
  var title = ($('swTitle').value || '').trim();
  var topic = ($('swTopic').value || '').trim();
  var format = document.querySelector('input[name=format]:checked').value;
  var totalMin = parseInt($('swDuration').value, 10) || 30;
  var guest = ($('swGuest').value || '').trim() || 'our guest';
  if(title.length < 3 || topic.length < 3){ setError('swResults', 'Please enter an episode title and topic (at least 3 characters each).'); return; }

  var topicCap = topic.charAt(0).toUpperCase() + topic.slice(1);
  var lines = []; /* {t, speaker, cue, text} */

  if(format === 'interview'){
    lines = [
      {t:tsAt(0,totalMin), speaker:'HOST', cue:'[Cold open: best 20s clip from later in the episode]',
       text:'"' + topicCap + ' changed everything for me when..." — wait for it. This is ' + title + ', and today we go deep.'},
      {t:tsAt(0.03,totalMin), speaker:'HOST', cue:'[Theme music fades under]',
       text:'Welcome back to the show. I’m your host, and today we’re talking ' + topic + ' — what it really is, what the hype gets wrong, and what actually works. Joining me is ' + guest + '. Welcome!'},
      {t:tsAt(0.08,totalMin), speaker:'GUEST', cue:'',
       text:'Thanks for having me — this is one of my favorite topics, so let’s get into it.'},
      {t:tsAt(0.10,totalMin), speaker:'HOST', cue:'[Question 1: origin story]',
       text:'Let’s start at the beginning. How did you first get into ' + topic + ', and what pulled you in?'},
      {t:tsAt(0.28,totalMin), speaker:'HOST', cue:'[Question 2: the misconception]',
       text:'What’s the biggest misconception people have about ' + topic + '?'},
      {t:tsAt(0.46,totalMin), speaker:'HOST', cue:'[Question 3: practical]',
       text:'For someone listening who wants to start with ' + topic + ' this week — what’s the single most important first step?'},
      {t:tsAt(0.64,totalMin), speaker:'HOST', cue:'[Question 4: future]',
       text:'Where do you see ' + topic + ' going in the next two years? What should listeners watch for?'},
      {t:tsAt(0.80,totalMin), speaker:'HOST', cue:'[Lightning round: 30-second answers]',
       text:'Lightning round — quick answers. Best resource on ' + topic + '? One tool you can’t live without? Biggest mistake beginners make?'},
      {t:tsAt(0.88,totalMin), speaker:'HOST', cue:'[Wrap]',
       text: guest + ', this was fantastic. Where can listeners find you and your work on ' + topic + '?'},
      {t:tsAt(0.94,totalMin), speaker:'HOST', cue:'[Outro: CTA + theme music]',
       text:'That’s ' + title + '. If this helped you, share it with one person and leave a review — it keeps the show going. See you next time.'}
    ];
  } else if(format === 'solo'){
    lines = [
      {t:tsAt(0,totalMin), speaker:'HOST', cue:'[Hook: no intro music yet]',
       text:'Nobody talks about this side of ' + topic + ' — but after today, you’ll see it completely differently.'},
      {t:tsAt(0.04,totalMin), speaker:'HOST', cue:'[Theme music, then under]',
       text:'Welcome to ' + title + '. I’m your host. Today: ' + topic + ' — the full breakdown, no fluff. Three big ideas, let’s go.'},
      {t:tsAt(0.10,totalMin), speaker:'HOST', cue:'[Idea 1]',
       text:'Idea one: the foundation of ' + topic + '. Here’s what it actually means, in plain English... [tell a personal story or example here]'},
      {t:tsAt(0.38,totalMin), speaker:'HOST', cue:'[Idea 2]',
       text:'Idea two — and this is where most people mess up ' + topic + '. The mistake is... and here’s the fix...'},
      {t:tsAt(0.64,totalMin), speaker:'HOST', cue:'[Idea 3]',
       text:'Idea three: the advanced move. Once you’ve got the basics of ' + topic + ' down, this is what separates the pros...'},
      {t:tsAt(0.86,totalMin), speaker:'HOST', cue:'[Recap]',
       text:'Quick recap: one — [foundation]; two — [avoid the mistake]; three — [the pro move]. Write those down.'},
      {t:tsAt(0.94,totalMin), speaker:'HOST', cue:'[CTA + outro music]',
       text:'If you got value from this, subscribe and share it with someone learning ' + topic + '. See you in the next episode.'}
    ];
  } else {
    lines = [
      {t:tsAt(0,totalMin), speaker:'NARRATOR', cue:'[Cold open: ambient sound, a scene in progress]',
       text:'It was supposed to be an ordinary day. Then ' + topic + ' changed everything...'},
      {t:tsAt(0.05,totalMin), speaker:'NARRATOR', cue:'[Title card music]',
       text:'This is ' + title + ' — a story about ' + topic + '. I’m your narrator.'},
      {t:tsAt(0.10,totalMin), speaker:'NARRATOR', cue:'[Act 1: set the world]',
       text:'To understand what happened, you have to understand the world before ' + topic + '. Picture it: [describe the setting, the stakes, the people].'},
      {t:tsAt(0.38,totalMin), speaker:'NARRATOR', cue:'[Act 2: the turn — music shifts]',
       text:'And then, the turn. [Describe the pivotal moment around ' + topic + '. Raise the tension. End the act on a question.]'},
      {t:tsAt(0.66,totalMin), speaker:'NARRATOR', cue:'[Act 3: climax]',
       text:'This is the moment everything hinged on. [Describe the climax — the decision, the discovery, the confrontation involving ' + topic + '.]'},
      {t:tsAt(0.86,totalMin), speaker:'NARRATOR', cue:'[Resolution: music softens]',
       text:'In the end, ' + topic + ' taught us this: [the theme, the lesson, the lingering question].'},
      {t:tsAt(0.95,totalMin), speaker:'NARRATOR', cue:'[Credits + CTA]',
       text:'Thanks for listening to ' + title + '. Subscribe for the next story — and tell a friend who loves a good mystery.'}
    ];
  }

  var htmlOut = '<div class="result-hero"><div class="lbl">Structured script</div><div class="big">' + esc(title) + '</div>' +
    '<div class="lbl">' + format.charAt(0).toUpperCase()+format.slice(1) + ' format &middot; ~' + totalMin + ' min &middot; ' + lines.length + ' cues</div></div>';
  lines.forEach(function(l){
    htmlOut += '<div class="script-line"><div class="meta"><span class="ts">' + l.t + '</span><span class="speaker">' + esc(l.speaker) + '</span>' +
      (l.cue ? '<span class="cue">' + esc(l.cue) + '</span>' : '') + '</div><p>' + esc(l.text) + '</p></div>';
  });
  htmlOut += '<button type="button" class="btn btn-primary" id="copyScript">Copy script as text</button>';
  box.innerHTML = htmlOut;

  var plain = title.toUpperCase() + ' — ' + format.toUpperCase() + ' SCRIPT (~' + totalMin + ' min)\\nTopic: ' + topic + '\\n\\n' +
    lines.map(function(l){ return '[' + l.t + '] ' + l.speaker + (l.cue ? ' ' + l.cue : '') + '\\n' + l.text; }).join('\\n\\n');
  $('copyScript').addEventListener('click', function(){ copyText(plain, this); });
}
"""

VOICE_PICKER_JS = """/* AI Voice Picker: 5-question quiz -> voice style recommendation */
document.addEventListener('DOMContentLoaded', function(){
  var form = $('vpForm');
  if(!form) return;
  form.addEventListener('submit', function(e){ e.preventDefault(); recommend(); });
});

var ARCHETYPES = {
  warm: { name:'The Warm Conversationalist',
    tagline:'Friendly, relatable, like a smart friend',
    desc:'A natural, mid-range voice with gentle ups and downs — the default winner for lifestyle, self-improvement, parenting, and interview shows. Listeners describe it as "easy to trust."',
    settings:'Rate 0.95–1.0 · Pitch neutral · Pauses: short breaths between ideas · Warmth/style setting at medium-high' },
  authority: { name:'The Trusted Authority',
    tagline:'Confident, clear, credible',
    desc:'A steady, well-enunciated voice with minimal vocal fry — ideal for business, finance, news, and educational shows where credibility is the product.',
    settings:'Rate 1.0–1.05 · Pitch slightly low · Pauses: crisp, deliberate · Keep emotion subtle and even' },
  energetic: { name:'The High-Energy Entertainer',
    tagline:'Upbeat, youthful, full of momentum',
    desc:'A bright, fast-moving voice with big intonation swings — built for comedy, sports, pop culture, and daily shows that need to grab attention in the first 10 seconds.',
    settings:'Rate 1.05–1.15 · Pitch slightly high · Pauses: minimal · Energy/style setting at high' },
  storyteller: { name:'The Cinematic Storyteller',
    tagline:'Deep, dramatic, magnetic',
    desc:'A rich, lower-register voice that leans into pacing and pauses — perfect for true crime, mystery, history, and narrative fiction where atmosphere carries the episode.',
    settings:'Rate 0.9–0.95 · Pitch low · Pauses: long and dramatic · Use whisper/emphasis on key lines' },
  calm: { name:'The Calm Guide',
    tagline:'Soothing, steady, reassuring',
    desc:'A soft, unhurried voice with even pacing — the right pick for meditation, sleep stories, wellness, and kids & family shows where the listener needs to relax.',
    settings:'Rate 0.85–0.92 · Pitch neutral-low · Pauses: generous · Keep volume dynamics gentle' }
};

/* each answer adds points to archetypes */
var QUESTIONS = ['tone','audience','genre','pace','persona'];
var WEIGHTS = {
  tone: {
    warm:{warm:3,calm:1}, professional:{authority:3,warm:1},
    energetic:{energetic:3,storyteller:1}, calm:{calm:3,warm:1}
  },
  audience: {
    teens:{energetic:2,warm:1}, pros:{authority:3,warm:1},
    general:{warm:2,storyteller:1}, family:{calm:2,warm:2}
  },
  genre: {
    truecrime:{storyteller:3,authority:1}, business:{authority:3,storyteller:1},
    comedy:{energetic:3,warm:1}, education:{authority:2,warm:2,calm:1}, fiction:{storyteller:3,calm:1}
  },
  pace: {
    fast:{energetic:3,authority:1}, steady:{warm:2,authority:2}, slow:{calm:3,storyteller:2}
  },
  persona: {
    solo:{warm:2,authority:1}, cohost:{energetic:2,warm:2}, narrator:{storyteller:3,calm:1}
  }
};

function recommend(){
  var box = $('vpResults');
  var scores = {warm:0, authority:0, energetic:0, storyteller:0, calm:0};
  for(var i=0;i<QUESTIONS.length;i++){
    var q = QUESTIONS[i];
    var sel = document.querySelector('input[name='+q+']:checked');
    if(!sel){ setError('vpResults', 'Please answer all 5 questions, then see your recommendation.'); return; }
    var w = WEIGHTS[q][sel.value] || {};
    for(var k in w){ scores[k] += w[k]; }
  }
  var ranked = Object.keys(scores).sort(function(a,b){ return scores[b]-scores[a]; });
  var top = ARCHETYPES[ranked[0]], second = ARCHETYPES[ranked[1]];

  var htmlOut = '<div class="result-hero"><div class="lbl">Your recommended voice style</div><div class="big">' + esc(top.name) + '</div>' +
    '<div class="lbl">' + esc(top.tagline) + '</div></div>' +
    '<div class="voice-card"><h3>' + esc(top.name) + '</h3><div class="tagline">' + esc(top.tagline) + '</div>' +
    '<p>' + esc(top.desc) + '</p>' +
    '<div class="stat-row"><span class="k">Recommended settings</span><span class="v">' + esc(top.settings) + '</span></div>' +
    '<div class="stat-row"><span class="k">Where to find it</span><span class="v">ElevenLabs, PlayHT, Murf &amp; Speechify all offer this style — search their voice libraries for these traits.</span></div></div>' +
    '<div class="verdict good">Runner-up: <strong>' + esc(second.name) + '</strong> — ' + esc(second.tagline) + '. Worth A/B testing against your top pick.</div>' +
    '<p><a class="btn btn-small btn-primary" href="tts-demo.html">Preview a voice in the TTS demo &rarr;</a></p>';
  box.innerHTML = htmlOut;
  box.scrollIntoView({behavior:'smooth', block:'start'});
}
"""

TTS_DEMO_JS = """/* TTS Demo: Web Speech API podcast voice preview */
document.addEventListener('DOMContentLoaded', function(){
  if(!('speechSynthesis' in window)){
    setError('ttsResults', 'Sorry — your browser does not support the Web Speech API. Try Chrome, Edge, or Safari to preview voices.');
    return;
  }
  populateVoices();
  if('onvoiceschanged' in speechSynthesis){ speechSynthesis.onvoiceschanged = populateVoices; }

  $('rate').addEventListener('input', function(){ $('rateVal').textContent = parseFloat(this.value).toFixed(2) + '\\u00D7'; updateStats(); });
  $('pitch').addEventListener('input', function(){ $('pitchVal').textContent = parseFloat(this.value).toFixed(2) + '\\u00D7'; });
  $('demoText').addEventListener('input', updateStats);
  $('speakBtn').addEventListener('click', speak);
  $('pauseBtn').addEventListener('click', function(){ speechSynthesis.pause(); });
  $('resumeBtn').addEventListener('click', function(){ speechSynthesis.resume(); });
  $('stopBtn').addEventListener('click', function(){ speechSynthesis.cancel(); });
  $('sampleBtn').addEventListener('click', function(){
    $('demoText').value = 'Welcome to the show. Today we\\u2019re diving into the world of AI podcast voices — how they work, which ones sound the most human, and how you can use them to launch your own show this week. Grab your headphones. Let\\u2019s get into it.';
    updateStats();
  });
  updateStats();
});

function populateVoices(){
  var sel = $('voiceSelect');
  var voices = speechSynthesis.getVoices().slice();
  if(!voices.length) return;
  /* English (US) first, then other English, then the rest */
  voices.sort(function(a,b){
    var score = function(v){
      if(/^en[-_]US/i.test(v.lang)) return 0;
      if(/^en/i.test(v.lang)) return 1;
      return 2;
    };
    return score(a) - score(b) || a.name.localeCompare(b.name);
  });
  var keep = sel.value;
  sel.innerHTML = '';
  voices.forEach(function(v){
    var o = document.createElement('option');
    o.value = v.name;
    o.textContent = v.name + ' (' + v.lang + ')';
    sel.appendChild(o);
  });
  if(keep){ sel.value = keep; }
}

function updateStats(){
  var text = ($('demoText').value || '').trim();
  var w = text ? text.split(/\\s+/).length : 0;
  var secs = Math.round(w / 150 * 60); /* ~150 wpm podcast pace */
  $('wordCount').textContent = words(w) + ' words';
  $('estDur').textContent = '≈ ' + mmss(secs) + ' at podcast pace';
}

function speak(){
  var text = ($('demoText').value || '').trim();
  if(text.length < 5){ setError('ttsResults', 'Paste at least a sentence of script text first.'); return; }
  speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(text);
  var sel = $('voiceSelect');
  var voices = speechSynthesis.getVoices();
  for(var i=0;i<voices.length;i++){
    if(voices[i].name === sel.value){ u.voice = voices[i]; break; }
  }
  u.rate = parseFloat($('rate').value) || 1;
  u.pitch = parseFloat($('pitch').value) || 1;
  u.onstart = function(){ $('ttsStatus').textContent = 'Playing…'; };
  u.onend = u.onerror = function(){ $('ttsStatus').textContent = 'Ready.'; };
  $('ttsResults').innerHTML = '<div class="verdict good">Playing your script — listen for pacing, emphasis, and how the voice handles your hook.</div>';
  speechSynthesis.speak(u);
}
"""

# ------------------------------------------------------------- tool forms + explainers
FORMS = {}
EXPLAINERS = {}

FORMS['episode-planner'] = """
<form id="epForm" class="tool-form">
<div class="field"><label for="epTopic">Episode topic</label><input type="text" id="epTopic" maxlength="120" placeholder="e.g. how AI voices are made" required><div class="hint">One clear topic — the more specific, the better the outline.</div></div>
<div class="field-row">
<div class="field"><label for="epDuration">Target duration</label><select id="epDuration"><option value="15">15 minutes</option><option value="20">20 minutes</option><option value="30" selected>30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select></div>
<div class="field"><label for="epSegments">Segments</label><select id="epSegments"><option value="2">2 segments</option><option value="3" selected>3 segments</option><option value="4">4 segments</option><option value="5">5 segments</option></select></div>
</div>
<div class="field"><label for="epTone">Show tone</label><select id="epTone"><option value="casual" selected>Casual &amp; friendly</option><option value="professional">Professional</option><option value="humorous">Humorous</option><option value="inspiring">Inspiring</option></select></div>
<button type="submit" class="btn btn-primary">Generate my outline</button>
</form>"""
EXPLAINERS['episode-planner'] = """
<h2>How the planner works</h2>
<p>Your target runtime is split into blocks: roughly <strong>8% intro, 7% outro</strong>, and the rest divided evenly across your segments (leftover minutes go to the earliest segments). Each block gets a built-in countdown timer, so you can rehearse against the clock and learn your real pacing before you record.</p>
<h2>Why timed outlines work</h2>
<ul><li><strong>No rambling:</strong> a timer per segment forces one idea per block.</li><li><strong>Consistent length:</strong> listeners subscribe to shows that respect their commute.</li><li><strong>Easier editing:</strong> timed blocks map cleanly to chapters on Spotify and Apple Podcasts.</li></ul>
<h2>Tips</h2>
<ul class="tips"><li>Write your hook word-for-word; improvise the rest from the talking points.</li><li>Run the timers while rehearsing once — most hosts discover they talk 20% faster on mic.</li><li>End every segment with a one-line bridge into the next to keep listeners from dropping off.</li></ul>"""

FORMS['podcast-script-writer'] = """
<form id="swForm" class="tool-form">
<div class="field"><label for="swTitle">Episode title</label><input type="text" id="swTitle" maxlength="120" placeholder="e.g. The Truth About AI Voices" required></div>
<div class="field"><label for="swTopic">Episode topic</label><input type="text" id="swTopic" maxlength="120" placeholder="e.g. AI voice technology" required></div>
<div class="field"><label>Format</label><div class="radio-row">
<label><input type="radio" name="format" value="interview" checked> Interview</label>
<label><input type="radio" name="format" value="solo"> Solo</label>
<label><input type="radio" name="format" value="narrative"> Narrative</label>
</div></div>
<div class="field" id="guestField"><label for="swGuest">Guest name (interview format)</label><input type="text" id="swGuest" maxlength="80" placeholder="e.g. Dr. Jane Smith"></div>
<div class="field"><label for="swDuration">Target duration</label><select id="swDuration"><option value="15">15 minutes</option><option value="20">20 minutes</option><option value="30" selected>30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select><div class="hint">Timestamps scale automatically to your runtime.</div></div>
<button type="submit" class="btn btn-primary">Write my script</button>
</form>"""
EXPLAINERS['podcast-script-writer'] = """
<h2>How the script builder works</h2>
<p>Pick a format and the builder lays out the proven structure for it — <strong>interview</strong> (cold open, guest intro, 4 questions, lightning round, wrap), <strong>solo</strong> (hook, 3 big ideas, recap), or <strong>narrative</strong> (cold open, three acts, resolution). Every beat gets a timestamp scaled to your target runtime, a speaker label, and production cues like music and SFX.</p>
<h2>Why scripted beats win</h2>
<ul><li><strong>Tighter episodes:</strong> scripted shows routinely cut editing time in half.</li><li><strong>Better retention:</strong> hooks and act breaks are placed where drop-off spikes.</li><li><strong>AI-voice ready:</strong> the output pastes straight into ElevenLabs, PlayHT, or Murf.</li></ul>
<h2>Tips</h2>
<ul class="tips"><li>Write the cold open last — lift the most surprising 20 seconds from your recording.</li><li>For interviews, send questions to guests 48 hours ahead; spontaneity improves when guests feel safe.</li><li>Read narration scripts aloud once and mark where you naturally breathe — those are your edit points.</li></ul>"""

FORMS['voice-picker'] = """
<form id="vpForm" class="tool-form">
<div class="quiz-q"><h3>1. What tone fits your show?</h3><div class="radio-row">
<label><input type="radio" name="tone" value="warm"> Warm &amp; friendly</label>
<label><input type="radio" name="tone" value="professional"> Professional</label>
<label><input type="radio" name="tone" value="energetic"> Energetic &amp; fun</label>
<label><input type="radio" name="tone" value="calm"> Calm &amp; soothing</label></div></div>
<div class="quiz-q"><h3>2. Who is your core audience?</h3><div class="radio-row">
<label><input type="radio" name="audience" value="teens"> Teens &amp; 20s</label>
<label><input type="radio" name="audience" value="pros"> 25–40 professionals</label>
<label><input type="radio" name="audience" value="general"> 40+ general listeners</label>
<label><input type="radio" name="audience" value="family"> Kids &amp; family</label></div></div>
<div class="quiz-q"><h3>3. What genre is your podcast?</h3><div class="radio-row">
<label><input type="radio" name="genre" value="truecrime"> True crime / mystery</label>
<label><input type="radio" name="genre" value="business"> Business / finance</label>
<label><input type="radio" name="genre" value="comedy"> Comedy / pop culture</label>
<label><input type="radio" name="genre" value="education"> Education / how-to</label>
<label><input type="radio" name="genre" value="fiction"> Storytelling / fiction</label></div></div>
<div class="quiz-q"><h3>4. What pace do you want?</h3><div class="radio-row">
<label><input type="radio" name="pace" value="fast"> Fast-paced</label>
<label><input type="radio" name="pace" value="steady"> Steady &amp; natural</label>
<label><input type="radio" name="pace" value="slow"> Slow &amp; deliberate</label></div></div>
<div class="quiz-q"><h3>5. What is your host setup?</h3><div class="radio-row">
<label><input type="radio" name="persona" value="solo"> Solo host</label>
<label><input type="radio" name="persona" value="cohost"> Co-host banter</label>
<label><input type="radio" name="persona" value="narrator"> Narrator-led story</label></div></div>
<button type="submit" class="btn btn-primary">Get my voice recommendation</button>
</form>"""
EXPLAINERS['voice-picker'] = """
<h2>How the quiz works</h2>
<p>Each answer scores points toward five voice archetypes — <strong>Warm Conversationalist, Trusted Authority, High-Energy Entertainer, Cinematic Storyteller, and Calm Guide</strong>. Your top match comes with exact rate, pitch, and pause settings, plus a runner-up worth A/B testing.</p>
<h2>Why voice fit matters</h2>
<ul><li><strong>First 30 seconds:</strong> listeners decide whether to stay before your content even starts — voice is the packaging.</li><li><strong>Genre expectations:</strong> a true-crime show in a bubbly voice feels wrong; match the mood.</li><li><strong>Consistency:</strong> one voice style across episodes builds a recognizable brand.</li></ul>
<h2>Tips</h2>
<ul class="tips"><li>Test your top two picks on 5 real listeners before committing — ask which they'd subscribe to.</li><li>Keep the same voice for at least 10 episodes; switching early confuses returning listeners.</li><li>Disclose AI voice use in your show notes — transparency builds trust and it's increasingly expected.</li></ul>"""

FORMS['tts-demo'] = """
<form id="ttsForm" class="tool-form" onsubmit="return false;">
<div class="field"><label for="demoText">Your script</label><textarea id="demoText" maxlength="3000" placeholder="Paste your podcast intro, ad read, or episode opening here...">Welcome to the show. Today we're diving into the world of AI podcast voices.</textarea><div class="hint">Browsers typically handle up to a few paragraphs smoothly.</div></div>
<div class="field"><label for="voiceSelect">Voice</label><select id="voiceSelect"><option>Loading voices…</option></select><div class="hint">Voices come from your device/browser — Chrome and Edge offer the most.</div></div>
<div class="field"><label for="rate">Rate (speed): <span class="range-val" id="rateVal">1.00&times;</span></label><input type="range" id="rate" min="0.5" max="1.5" step="0.05" value="1"><div class="hint">Podcast sweet spot: 0.95–1.05 for narration.</div></div>
<div class="field"><label for="pitch">Pitch: <span class="range-val" id="pitchVal">1.00&times;</span></label><input type="range" id="pitch" min="0.5" max="2" step="0.05" value="1"></div>
<div class="field-row">
<div class="field"><button type="button" class="btn btn-primary" id="speakBtn" style="width:100%">&#9654; Play</button></div>
<div class="field"><button type="button" class="btn btn-small" id="sampleBtn" style="width:100%;margin-top:4px">Load sample intro</button></div>
</div>
<div class="field-row">
<div class="field"><button type="button" class="btn btn-small" id="pauseBtn" style="width:100%">Pause</button></div>
<div class="field"><button type="button" class="btn btn-small" id="resumeBtn" style="width:100%">Resume</button></div>
<div class="field"><button type="button" class="btn btn-small" id="stopBtn" style="width:100%">Stop</button></div>
</div>
<div class="stat-row"><span class="k">Word count</span><span class="v" id="wordCount">—</span></div>
<div class="stat-row"><span class="k">Est. duration</span><span class="v" id="estDur">—</span></div>
<div class="stat-row"><span class="k">Status</span><span class="v" id="ttsStatus">Ready.</span></div>
</form>"""
EXPLAINERS['tts-demo'] = """
<h2>How the demo works</h2>
<p>This demo uses the <strong>Web Speech API</strong> built into your browser — no audio ever leaves your device. Pick any installed voice, tune the rate and pitch, and press play to hear your script read aloud. It's perfect for checking pacing, awkward phrasing, and whether your hook lands.</p>
<h2>Preview vs. production</h2>
<ul><li><strong>Preview (this tool):</strong> free, instant, private — great for rehearsal and script QA.</li><li><strong>Production:</strong> dedicated AI voice services (ElevenLabs, PlayHT, Murf) offer studio-quality models, voice cloning, and commercial licenses for published episodes.</li></ul>
<h2>Tips</h2>
<ul class="tips"><li>Read your intro at 1.0&times; first — if it drags there, it will drag at any speed.</li><li>Test the same script with 2–3 voices; the "best" voice is the one you stop noticing.</li><li>Mark breath points in your script with line breaks — most TTS engines pause slightly at paragraphs.</li></ul>"""

# ------------------------------------------------------------- guide + blog bodies
GUIDE_BODIES = {}

GUIDE_BODIES['best-ai-voices-for-podcasts-2026'] = """
<h2>What makes an AI voice great for podcasts?</h2>
<p>Not every text-to-speech voice belongs on a podcast. A voice that reads your banking alerts just fine can sound flat, robotic, or exhausting across a 30-minute episode. After testing the leading platforms with real podcast scripts, here is what actually separates podcast-grade AI voices from the rest:</p>
<ul>
<li><strong>Natural prosody:</strong> the rise and fall of real speech — emphasis on the right words, natural pauses at commas and line breaks. This is the single biggest quality gap between cheap and premium voices.</li>
<li><strong>Consistency:</strong> the voice must sound like the <em>same person</em> in episode 1 and episode 50. Voice cloning and locked voice IDs solve this; random per-generation voices do not.</li>
<li><strong>Emotional range:</strong> even nonfiction benefits from subtle emotion — curiosity, gravity, humor. The best 2026 models take style prompts ("read this like breaking news") instead of sounding neutral throughout.</li>
<li><strong>Pronunciation control:</strong> custom dictionaries for names, brands, and jargon. Nothing kills credibility like your host mispronouncing the guest's name every episode.</li>
<li><strong>Long-form stability:</strong> some voices drift in tone over long generations. Podcast-grade services are engineered for 30–60 minute renders without quality decay.</li>
<li><strong>Commercial license:</strong> check the terms. Free tiers of several tools are for personal use only — monetized podcasts need a paid plan with commercial rights.</li>
</ul>
<h2>The 7 best AI voices for podcasts in 2026</h2>
<h3>1. ElevenLabs — best overall quality</h3>
<p>ElevenLabs remains the benchmark for human-like narration. Its multilingual v3 models handle long-form content with remarkable consistency, and the voice library (thousands of community voices plus instant voice cloning) means you can find — or create — exactly your show's sound. The "Projects" workflow is built for long-form audio with chapter-level control. <strong>Best for:</strong> narrative shows, true crime, and any podcast where the voice <em>is</em> the brand. Pricing starts with a generous free tier; creator plans scale with character usage.</p>
<h3>2. PlayHT — best voice variety</h3>
<p>PlayHT offers 900+ voices across 140+ languages, with strong emotional range controls. Its podcast-specific features — including direct publishing workflows — make it a favorite for high-volume shows. <strong>Best for:</strong> multilingual podcasts and networks running multiple shows with distinct voices.</p>
<h3>3. Murf AI — best for business &amp; explainer podcasts</h3>
<p>Murf's studio interface feels like a video editor for voice: you can tweak pitch, emphasis, and pauses word by word. The voice catalog leans professional and clear rather than dramatic. <strong>Best for:</strong> business, finance, and educational podcasts, plus ad reads that need precise delivery.</p>
<h3>4. Descript Overdub — best for hybrid human/AI workflows</h3>
<p>Overdub clones <em>your own</em> voice, then lets you edit audio by editing text — fix a flubbed line by typing the correction. For hosts who record themselves but want AI cleanup and pickups, nothing beats it. <strong>Best for:</strong> solo hosts who want their real voice with AI-powered editing superpowers.</p>
<h3>5. WellSaid Labs — best for corporate &amp; news-style shows</h3>
<p>WellSaid's voices are trained for clarity and authority — think newsreader polish. Fewer dramatic options, but exceptional consistency for daily or news-format podcasts. <strong>Best for:</strong> daily news briefings and B2B podcasts.</p>
<h3>6. Speechify Studio — best ease of use</h3>
<p>Speechify's studio product turns scripts into narration in a couple of clicks, with 200+ voices and 60+ languages. Less fine-grained control than ElevenLabs or Murf, but the fastest path from script to audio. <strong>Best for:</strong> beginners and high-frequency short-form shows.</p>
<h3>7. Resemble AI — best voice cloning fidelity</h3>
<p>Resemble's cloning captures subtle vocal characteristics with impressive accuracy, including emotional states. Strong API for developers building custom podcast pipelines. <strong>Best for:</strong> cloning a specific host voice or building branded character voices.</p>
<h2>Side-by-side comparison</h2>
<div class="table-wrap"><table>
<tr><th>Service</th><th>Standout strength</th><th>Languages</th><th>Free tier</th><th>Best podcast fit</th></tr>
<tr><td>ElevenLabs</td><td>Most human-like</td><td>32+</td><td>Yes</td><td>Narrative, true crime</td></tr>
<tr><td>PlayHT</td><td>900+ voices</td><td>140+</td><td>Yes</td><td>Multilingual, networks</td></tr>
<tr><td>Murf AI</td><td>Word-level control</td><td>20+</td><td>Yes</td><td>Business, education</td></tr>
<tr><td>Descript Overdub</td><td>Your own voice, cloned</td><td>English-first</td><td>Trial</td><td>Solo hosts (hybrid)</td></tr>
<tr><td>WellSaid Labs</td><td>Newsreader polish</td><td>English-first</td><td>Trial</td><td>News, B2B</td></tr>
<tr><td>Speechify Studio</td><td>Fastest workflow</td><td>60+</td><td>Yes</td><td>Beginners, daily shorts</td></tr>
<tr><td>Resemble AI</td><td>Cloning fidelity</td><td>40+</td><td>Trial</td><td>Branded voices</td></tr>
</table></div>
<h2>How to choose the right AI voice in 5 steps</h2>
<ol>
<li><strong>Define your show's personality first.</strong> Warm? Authoritative? Dramatic? Our <a href="../tools/voice-picker.html">AI voice picker quiz</a> maps your tone, audience, and genre to a voice style in under a minute.</li>
<li><strong>Shortlist 3 voices, not 30.</strong> Decision fatigue is real. Pick three candidates and generate the <em>same</em> 60-second test script in each.</li>
<li><strong>Test on cheap earbuds.</strong> Most listeners use phone speakers or basic earbuds. A voice that shines on studio monitors but muddies on a phone speaker will lose listeners.</li>
<li><strong>Check long-form stability.</strong> Generate a full 10-minute segment, not just a demo sentence. Listen for tone drift, mispronounced names, and awkward pauses.</li>
<li><strong>Verify the license.</strong> Confirm your plan covers commercial, monetized podcast use — and keep a screenshot of the terms for your records.</li>
</ol>
<h2>A note on disclosure</h2>
<p>Listeners are increasingly comfortable with AI-voiced podcasts — but they dislike feeling deceived. Add one line to your show description ("Narrated with AI voice technology") and mention it in your first episode. Transparency costs nothing and protects your reputation if a listener asks. Both Spotify and Apple Podcasts permit AI-generated audio that follows their content policies; neither currently requires a label, but platform rules evolve — check before you publish.</p>
<h2>The bottom line</h2>
<p>For most podcasters in 2026, <strong>ElevenLabs</strong> is the safest starting point on pure quality, <strong>Descript Overdub</strong> is unbeatable if you want your own voice with AI editing, and <strong>Murf</strong> wins for business shows that need word-level control. Whichever you choose, preview your actual scripts first — paste your intro into our <a href="../tools/tts-demo.html">free TTS demo</a> to check pacing before you spend a dollar.</p>
"""

GUIDE_BODIES['how-to-start-ai-podcast'] = """
<h2>Step 1: Pick a niche you can sustain</h2>
<p>The #1 killer of new podcasts isn't bad audio — it's running out of things to say by episode 8. Pick a niche where you have genuine curiosity and at least 50 episode ideas. Good AI-podcast niches in 2026: daily news briefings, niche history stories, finance explainers, true crime retellings (public-domain cases), language learning, and bedtime stories. Validate demand by searching Spotify and Apple Podcasts — if the top shows have thousands of ratings, the audience exists.</p>
<h2>Step 2: Plan your episode format</h2>
<p>Decide three things before you record anything: <strong>length</strong> (15, 30, or 60 minutes — pick one and stay consistent), <strong>format</strong> (solo, interview, or narrative), and <strong>cadence</strong> (weekly beats daily for beginners; consistency beats frequency). Then use our <a href="../tools/episode-planner.html">episode planner</a> to turn each topic into a timed outline with intro, segments, and outro — plus countdown timers so you rehearse against the clock.</p>
<h2>Step 3: Write the script</h2>
<p>AI-voiced podcasts live or die by the script, because there's no charismatic host to rescue weak writing. Aim for ~150 spoken words per minute (a 30-minute episode ≈ 4,500 words). Write conversationally — contractions, short sentences, rhetorical questions. Our <a href="../tools/podcast-script-writer.html">script writer</a> generates a structured, timestamped script for interview, solo, or narrative formats; you fill in the substance. Read every script aloud once before generating audio — your ears catch what your eyes miss.</p>
<h2>Step 4: Choose your AI voice</h2>
<p>Match the voice to your genre: warm and conversational for lifestyle, authoritative for business, dramatic for true crime. Take the <a href="../tools/voice-picker.html">voice picker quiz</a> for a recommendation with exact settings, then compare finalists in our <a href="../tools/tts-demo.html">TTS demo</a> using your real intro script. For production audio, use a dedicated service like ElevenLabs, PlayHT, or Murf — see our <a href="best-ai-voices-for-podcasts-2026.html">ranked comparison of the best AI voices for podcasts in 2026</a>. Disclose AI narration in your show notes.</p>
<h2>Step 5: Generate and edit the audio</h2>
<p>Paste your script into your chosen voice service section by section (easier to fix mistakes), then assemble in a free editor like Audacity or Descript. Add royalty-free intro/outro music (YouTube Audio Library, Pixabay Music, or Uppbeat), normalize loudness to podcast standards (-16 LUFS stereo), and export as MP3 at 128 kbps. Listen to the full episode on phone speakers — that's how most of your audience will hear it.</p>
<h2>Step 6: Publish on Spotify and Apple Podcasts</h2>
<p>You need a podcast host to generate your RSS feed — Spotify for Creators (free), Buzzsprout, Transistor, or Podbean. Upload your cover art (3000×3000 px), write a keyword-rich show description, publish your first 3 episodes at once (gives new listeners something to binge), then submit the RSS feed to Spotify, Apple Podcasts, YouTube, and Amazon Music. Approval typically takes 1–5 days.</p>
<h2>Step 7: Grow and monetize</h2>
<p>Growth levers that work in 2026: audiogram clips on TikTok/Reels/Shorts, guest swaps with similar-size shows, SEO-optimized episode titles, and a simple newsletter. Monetization usually starts with affiliate links in show notes, then sponsorships around 1,000+ downloads per episode, plus premium feeds via Apple Podcasts Subscriptions or Patreon. Most shows take 6–12 months of consistent weekly episodes to find real traction — plan for the long game.</p>
<blockquote><strong>Reality check:</strong> AI voices remove the recording bottleneck, but not the content bottleneck. Shows that publish consistently for a year win; shows that chase perfect audio for three months and quit don't.</blockquote>
"""

POST_BODIES = {}

POST_BODIES['ai-vs-human-podcast-voices'] = """
<p>Every podcaster eventually faces the question: should a human or an AI read the script? The honest answer in 2026 is less dramatic than the debate suggests — each wins in different situations, and the smartest creators use both. Here's a clear-eyed breakdown.</p>
<h2>Where AI voices win</h2>
<ul>
<li><strong>Speed:</strong> a 30-minute episode's narration renders in minutes, not the hours of recording plus editing a human session needs.</li>
<li><strong>Consistency:</strong> no colds, no bad-mic days, no room tone changes. Episode 50 sounds exactly like episode 1.</li>
<li><strong>Cost:</strong> free tiers and $20–30/month plans replace studio time or voice-actor fees that run hundreds per episode.</li>
<li><strong>Iteration:</strong> rewrite a paragraph, regenerate just that section. Fixing a flub takes 60 seconds.</li>
<li><strong>Scale:</strong> daily shows, multilingual versions, and back-catalog updates become practical for one person.</li>
</ul>
<h2>Where human voices still win</h2>
<ul>
<li><strong>Emotional nuance:</strong> grief, irony, barely-contained laughter — humans still deliver subtext AI approximates.</li>
<li><strong>Interviews and banter:</strong> real conversation chemistry can't be synthesized (yet). Guest-driven shows should stay human.</li>
<li><strong>Trust in sensitive topics:</strong> mental health, personal storytelling, and opinion journalism benefit from a real person behind the mic.</li>
<li><strong>Listener loyalty:</strong> audiences bond with hosts. A distinctive human voice is a moat AI can't copy.</li>
</ul>
<h2>The hybrid sweet spot</h2>
<p>The workflow top solo podcasters actually use: <strong>human for the parts that need soul, AI for the parts that need scale.</strong> Record your own intro/outro and any personal stories (Descript's Overdub can even clone your voice for pickups), and use AI narration for research-heavy segments, news briefings, ad reads, and translated versions. You get the authenticity of a human host with the output of a production team.</p>
<h2>How to decide for your show</h2>
<p>Ask three questions: (1) Is the host's personality the product? If yes, stay human. (2) Is volume the bottleneck? If you're doing daily episodes solo, AI is the only sustainable path. (3) Would your listeners care? Survey them — most audiences accept disclosed AI narration for informational content and reject it for intimate storytelling. When in doubt, run the hybrid: disclose it, and let the content prove itself.</p>
<p><strong>Next step:</strong> compare your options in our <a href="../guides/best-ai-voices-for-podcasts-2026.html">ranked guide to the best AI voices for podcasts in 2026</a>, then preview candidates with the <a href="../tools/tts-demo.html">free TTS demo</a>.</p>
"""

POST_BODIES['plan-podcast-episodes-faster'] = """
<p>Planning used to be the slowest part of podcasting — most creators spend 2–3 hours outlining a single 30-minute episode. Here's a 5-step workflow that cuts it to under 45 minutes, using free tools that do the mechanical work while you focus on ideas.</p>
<h2>Step 1: Lock the topic in one sentence (5 min)</h2>
<p>If you can't state the episode's promise in one sentence — "By the end, listeners will understand X" — the topic is too vague. Write the sentence first; everything else serves it.</p>
<h2>Step 2: Generate a timed outline (10 min)</h2>
<p>Plug your topic into our <a href="../tools/episode-planner.html">episode planner</a>: pick your runtime, segment count, and tone, and get an intro/segments/outro structure with talking points and per-segment countdown timers. Edit the segment titles to match your angle — the structure is the starting point, not the finish line.</p>
<h2>Step 3: Draft the script from the outline (20 min)</h2>
<p>Feed the outline into the <a href="../tools/podcast-script-writer.html">script writer</a> with your format (interview, solo, or narrative). You'll get timestamps, speaker cues, and production notes. Now do the part only you can do: add your stories, examples, and opinions. Aim for 150 words per minute of runtime.</p>
<h2>Step 4: Voice-check the script (5 min)</h2>
<p>Paste your intro into the <a href="../tools/tts-demo.html">TTS demo</a> and listen. Awkward phrasing, tongue-twisters, and flat hooks reveal themselves instantly in audio. Fix them now — it's 10× cheaper than re-recording later.</p>
<h2>Step 5: Batch and template (5 min)</h2>
<p>Save your best-performing outline as a template and reuse the structure weekly. Batch-plan 4 episodes in one sitting: steps 1–2 for all four, then write scripts across the week. Batching is the single biggest time saver in podcasting — context-switching is the hidden tax.</p>
<h2>The math</h2>
<p>Old way: ~150 minutes per episode of planning and scripting. New way: ~45 minutes. Over a year of weekly episodes, that's <strong>90+ hours saved</strong> — time you can spend on promotion, guests, or simply not burning out. The tools are free and run in your browser; the only cost is building the habit.</p>
"""

# ------------------------------------------------------------- page assembly
def index_body():
    tools = ''.join(card(t['name'], 'tools/'+t['slug']+'.html', t['card'], 'Tool') for t in TOOLS)
    guides = ''.join(card(g['h1'][:70], 'guides/'+g['slug']+'.html', g['desc'], 'Guide') for g in GUIDES)
    posts = ''.join(card(p['h1'][:70], 'blog/'+p['slug']+'.html', p['desc'], 'Blog') for p in POSTS)
    faqs = ''.join('<details><summary>'+html.escape(q)+'</summary><div class="faq-a"><p>'+a+'</p></div></details>' for q,a in FAQS)
    return ('<section class="hero"><div class="wrap"><h1>'+SITE['index_h1']+'</h1>'
            '<p class="lede">'+SITE['hero_lede']+'</p>'
            '<div class="hero-ctas"><a class="btn" href="tools/index.html">Use the free tools</a>'
            '<a class="btn btn-outline" href="guides/index.html">Read the guides</a></div></div></section>'
            '<section class="section"><div class="wrap"><h2>Free AI podcast tools</h2>'
            '<p class="sub">No signup, no downloads — everything runs in your browser.</p>'
            '<div class="cards">'+tools+'</div></div></section>'
            '<section class="section section-alt"><div class="wrap"><h2>Guides &amp; articles</h2>'
            '<p class="sub">Research-backed guides for launching and growing an AI-voiced podcast in 2026.</p>'
            '<div class="cards">'+guides+posts+'</div></div></section>'
            '<section class="section"><div class="wrap"><h2>Frequently asked questions</h2><div class="faq">'+faqs+'</div></div></section>')

def list_body(h1, lede, items, urlfn, tag, key):
    cards = ''.join(card(i['h1'] if 'h1' in i else i['name'], urlfn(i), i.get('desc', i.get('card','')), tag) for i in items)
    return ('<div class="wrap page"><h1>'+h1+'</h1><p class="lede">'+lede+'</p>'
            '<div class="cards" style="margin-top:28px">'+cards+'</div></div>')

def tool_body(t):
    others = [o for o in TOOLS if o['slug'] != t['slug']]
    rel = ''.join('<li><a href="'+o['slug']+'.html">'+o['name']+'</a></li>' for o in others)
    rel += '<li><a href="../guides/best-ai-voices-for-podcasts-2026.html">Best AI Voices for Podcasts in 2026</a></li>'
    rel += '<li><a href="../guides/how-to-start-ai-podcast.html">How to Start an AI Podcast in 2026</a></li>'
    return ('<div class="wrap page"><h1>'+t['h1']+'</h1><p class="lede">'+t['lede']+'</p>'
            '<div class="tool-grid"><div>'+FORMS[t['slug']]+'</div>'
            '<div class="tool-results" id="'+{'episode-planner':'epResults','podcast-script-writer':'swResults','voice-picker':'vpResults','tts-demo':'ttsResults'}[t['slug']]+'" aria-live="polite"><p class="hint">Fill in the form and submit to see your results.</p></div></div>'
            '<div class="tool-explainer">'+EXPLAINERS[t['slug']]+'</div>'
            '<section class="related"><h2>Related tools &amp; guides</h2><ul>'+rel+'</ul></section></div>')

def article_body(h1, desc, body_html, related, canonical):
    rel = ''.join('<li><a href="'+u+'">'+tt+'</a></li>' for tt,u in related)
    return ('<div class="wrap page"><article><h1>'+h1+'</h1>'
            '<p class="article-meta">Updated '+DATE+' &middot; AIPodcastVoice</p>'
            '<p class="lede">'+desc+'</p>'+body_html+
            '<section class="related"><h2>Related</h2><ul>'+rel+'</ul></section></article></div>')

def build():
    files = []
    # static assets
    for rel, content in [('css/style.css', CSS), ('js/main.js', MAIN_JS),
                         ('js/episode-planner.js', EPISODE_PLANNER_JS),
                         ('js/podcast-script-writer.js', SCRIPT_WRITER_JS),
                         ('js/voice-picker.js', VOICE_PICKER_JS),
                         ('js/tts-demo.js', TTS_DEMO_JS)]:
        p = os.path.join(BASE, KEY, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        open(p,'w').write(content)
        files.append(p)
    # index
    files.append(write_page('index.html', SITE['index_title'], SITE['index_desc'], index_body(), jsonld=faq_ld(), nav='nav_home'))
    # tool list + tool pages
    files.append(write_page('tools/index.html', 'Free AI Podcast Tools | AIPodcastVoice',
        'All free AI podcast tools: episode planner, script writer, AI voice picker, and TTS voice demo — no signup.',
        list_body('Free AI Podcast Tools', 'Every tool runs free in your browser — plan episodes, write scripts, pick voices, and preview audio.',
                  TOOLS, lambda t: t['slug']+'.html', 'Tool', 'tools'), nav='nav_tools'))
    for t in TOOLS:
        files.append(write_page('tools/'+t['slug']+'.html', t['title'], t['desc'], tool_body(t),
            scripts='<script src="../js/'+t['js']+'"></script>', nav='nav_tools'))
    # guide list + guides
    files.append(write_page('guides/index.html', 'Podcast Guides | AIPodcastVoice',
        'In-depth guides: the best AI voices for podcasts in 2026, and how to start an AI podcast step by step.',
        list_body('Podcast Guides', 'Research-backed guides for launching, voicing, and growing your podcast.',
                  GUIDES, lambda g: g['slug']+'.html', 'Guide', 'guides'), nav='nav_guides'))
    guide_rels = [('How to Start an AI Podcast in 2026','how-to-start-ai-podcast.html'),
                  ('Best AI Voices for Podcasts in 2026','best-ai-voices-for-podcasts-2026.html'),
                  ('Episode Planner','../tools/episode-planner.html'),
                  ('TTS Voice Demo','../tools/tts-demo.html')]
    for g in GUIDES:
        rels = [(tt,u) for tt,u in guide_rels if g['slug']+'.html' != u]
        files.append(write_page('guides/'+g['slug']+'.html', g['title'], g['desc'],
            article_body(g['h1'], g['desc'], GUIDE_BODIES[g['slug']], rels, SITE['base']+'guides/'+g['slug']+'.html'),
            jsonld=article_ld(g['h1'], g['desc'], SITE['base']+'guides/'+g['slug']+'.html'), nav='nav_guides'))
    # blog list + posts
    files.append(write_page('blog/index.html', 'Blog | AIPodcastVoice',
        'AIPodcastVoice blog: AI vs human podcast voices, faster episode planning workflows, and podcast growth tips.',
        list_body('Blog', 'Practical articles on AI podcasting — voices, workflows, and growth.',
                  POSTS, lambda p: p['slug']+'.html', 'Blog', 'blog'), nav='nav_blog'))
    post_rels = [('Best AI Voices for Podcasts in 2026','../guides/best-ai-voices-for-podcasts-2026.html'),
                 ('Episode Planner','../tools/episode-planner.html'),
                 ('Script Writer','../tools/podcast-script-writer.html')]
    for i,p in enumerate(POSTS):
        others = [('Plan Podcast Episodes in Half the Time' if j==1 else 'AI vs Human Podcast Voices', POSTS[j]['slug']+'.html') for j in range(len(POSTS)) if j != i]
        files.append(write_page('blog/'+p['slug']+'.html', p['title'], p['desc'],
            article_body(p['h1'], p['desc'], POST_BODIES[p['slug']], others+post_rels, SITE['base']+'blog/'+p['slug']+'.html'),
            jsonld=article_ld(p['h1'], p['desc'], SITE['base']+'blog/'+p['slug']+'.html'), nav='nav_blog'))
    return files

def validate_links(files):
    problems = []
    for f in files:
        if not f.endswith('.html'): continue
        src = open(f).read()
        for m in re.finditer(r'href="([^"#]+)"', src):
            href = m.group(1)
            if href.startswith(('http://','https://','mailto:','//')): continue
            if href.startswith('#'): continue
            target = os.path.normpath(os.path.join(os.path.dirname(f), href))
            if not os.path.exists(target):
                problems.append(f'{os.path.relpath(f, os.path.join(BASE,KEY))} -> {href} MISSING')
    return problems

if __name__ == '__main__':
    files = build()
    print('wrote', len(files), 'files')
    probs = validate_links(files)
    if probs:
        print('BROKEN LINKS:'); [print(' ', x) for x in probs]; sys.exit(1)
    print('link check: OK (0 broken)')
    jsfiles = [f for f in files if f.endswith('.js')]
    for jf in jsfiles:
        r = subprocess.run(['node','--check',jf], capture_output=True, text=True)
        if r.returncode != 0:
            print('JS SYNTAX FAIL:', jf); print(r.stderr); sys.exit(1)
        print('node --check OK:', os.path.relpath(jf, os.path.join(BASE,KEY)))
    print('BUILD OK')
