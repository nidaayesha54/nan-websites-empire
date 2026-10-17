/* NAN Text Tools — app.js (100% client-side, no server) */
/* ---------- tabs ---------- */
function showTab(id, btn) {
  ['counter', 'case', 'dedupe', 'clean'].forEach(function (t) {
    var p = document.getElementById('tool-' + t);
    if (p) p.style.display = (t === id ? 'block' : 'none');
  });
  var tabs = document.querySelectorAll('.tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  btn.classList.add('active');
}

/* ---------- i18n ---------- */
var STR = {
  en: {
    nav_tools: "Tools", nav_guide: "Guide",
    h1: "Free Online Text Tools",
    lede: "Count words and characters, convert text case, remove duplicate lines and clean whitespace — right in your browser. <strong>100% free, no signup.</strong> Your text never leaves your device.",
    tab1: "🔢 Word Counter", tab2: "🔠 Case Converter", tab3: "🧹 Duplicate Lines", tab4: "✨ Whitespace Cleaner",
    t1h: "Word Counter — live stats as you type",
    t1d: "Paste or type your text below. Words, characters, sentences, paragraphs and reading time update instantly.",
    ph: "Type or paste your text here…",
    lbl_words: "Words", lbl_chars: "Characters", lbl_chars_nospace: "Characters (no spaces)",
    lbl_sent: "Sentences", lbl_para: "Paragraphs", lbl_read: "Reading time",
    btn_copy_stats: "Copy stats", btn_clear: "Clear", btn_copy: "Copy",
    copied: "Copied!",
    t2h: "Case Converter — fix text formatting in one click",
    t2d: "Paste your text, pick a style, and copy the result. Perfect for fixing caps-lock accidents, headings and social posts.",
    t3h: "Remove Duplicate Lines",
    t3d: "Paste a list — one item per line. Duplicates are removed and the cleaned list appears below.",
    opt_casesens: "Case-sensitive matching",
    btn_dedupe: "Remove duplicates",
    dupes_removed: "duplicate lines removed",
    dedupe_out_ph: "The cleaned list will appear here…",
    t4h: "Whitespace Cleaner",
    t4d: "Tidy messy text: trim each line, collapse extra spaces, and drop empty lines.",
    opt_trim: "Trim each line", opt_collapse: "Collapse multiple spaces into one", opt_empty: "Remove empty lines",
    btn_clean: "Clean whitespace",
    clean_out_ph: "The cleaned text will appear here…",
    priv_h: "Private by design:", priv_d: "Everything runs in your browser with plain JavaScript. Your text is never uploaded to any server.",
    guides: "Guides", guides_d: "Full guide: how word counting works, case styles, platform character limits and FAQs.",
    faq: "FAQs",
    q1: "Is the word counter free?", a1: "Yes — 100% free, unlimited use, no signup. Everything runs in your browser.",
    q2: "Does my text leave my browser?", a2: "No. All counting and conversion happens locally on your device. Nothing is uploaded or stored.",
    q3: "How are words counted?", a3: "Text is split on whitespace. \"Don't\" and \"well-known\" each count as one word. Standalone punctuation is ignored.",
    q4: "How is reading time calculated?", a4: "Words ÷ 200 per minute — the average adult silent reading speed.",
    foot: "Free online text tools — word counter, character counter, case converter, duplicate line remover and whitespace cleaner. Private, fast, no signup.",
    tools_h: "Tools"
  },
  ur: {
    nav_tools: "ٹولز", nav_guide: "رہنمائی",
    h1: "مفت آن لائن ٹیکسٹ ٹولز",
    lede: "الفاظ اور حروف گنیں، ٹیکسٹ کا کیس بدلیں، دہرائی گئی لائنیں ہٹائیں اور فالتو اسپیس صاف کریں — براہِ راست آپ کے براؤزر میں۔ <strong>100% مفت، کوئی رجسٹریشن نہیں۔</strong> آپ کا متن آپ کے ڈیوائس سے باہر نہیں جاتا۔",
    tab1: "🔢 ورڈ کاؤنٹر", tab2: "🔠 کیس کنورٹر", tab3: "🧹 ڈپلیکیٹ لائنیں", tab4: "✨ اسپیس کلینر",
    t1h: "ورڈ کاؤنٹر — ٹائپ کرتے ہی لائیو اعداد",
    t1d: "اپنا متن نیچے پیسٹ یا ٹائپ کریں۔ الفاظ، حروف، جملے، پیراگراف اور پڑھنے کا وقت فوراً اپ ڈیٹ ہوتا ہے۔",
    ph: "اپنا متن یہاں ٹائپ یا پیسٹ کریں…",
    lbl_words: "الفاظ", lbl_chars: "حروف", lbl_chars_nospace: "حروف (بغیر اسپیس)",
    lbl_sent: "جملے", lbl_para: "پیراگراف", lbl_read: "پڑھنے کا وقت",
    btn_copy_stats: "اعداد کاپی کریں", btn_clear: "صاف کریں", btn_copy: "کاپی",
    copied: "کاپی ہو گیا!",
    t2h: "کیس کنورٹر — ایک کلک میں متن کی شکل درست کریں",
    t2d: "متن پیسٹ کریں، انداز منتخب کریں اور نتیجہ کاپی کریں۔ کیپس لاک کی غلطیوں، سرخیوں اور سوشل پوسٹس کے لیے بہترین۔",
    t3h: "دہرائی گئی لائنیں ہٹائیں",
    t3d: "فہرست پیسٹ کریں — ہر آئٹم الگ لائن میں۔ دہرائی گئی لائنیں ہٹ جائیں گی اور صاف فہرست نیچے نظر آئے گی۔",
    opt_casesens: "کیس حساس میچنگ",
    btn_dedupe: "ڈپلیکیٹ ہٹائیں",
    dupes_removed: "دہرائی گئی لائنیں ہٹا دی گئیں",
    dedupe_out_ph: "صاف فہرست یہاں نظر آئے گی…",
    t4h: "اسپیس کلینر",
    t4d: "بے ترتیب متن صاف کریں: ہر لائن تراشیں، فالتو اسپیس ایک میں کریں اور خالی لائنیں ہٹائیں۔",
    opt_trim: "ہر لائن تراشیں", opt_collapse: "متعدد اسپیس ایک میں کریں", opt_empty: "خالی لائنیں ہٹائیں",
    btn_clean: "اسپیس صاف کریں",
    clean_out_ph: "صاف متن یہاں نظر آئے گا…",
    priv_h: "پرائیویسی:", priv_d: "سب کچھ آپ کے براؤزر میں سادہ JavaScript سے ہوتا ہے۔ آپ کا متن کبھی کسی سرور پر نہیں بھیجا جاتا۔",
    guides: "رہنمائی", guides_d: "مکمل رہنمائی: لفظ گننے کا طریقہ، کیس کے انداز، پلیٹ فارمز کی حدود اور سوالات۔",
    faq: "سوالات",
    q1: "کیا ورڈ کاؤنٹر مفت ہے؟", a1: "جی ہاں — 100% مفت، لامحدود استعمال، کوئی رجسٹریشن نہیں۔ سب کچھ آپ کے براؤزر میں چلتا ہے۔",
    q2: "کیا میرا متن براؤزر سے باہر جاتا ہے؟", a2: "نہیں۔ گنتی اور تبدیلی سب آپ کے ڈیوائس پر مقامی طور پر ہوتی ہے۔ کچھ بھی اپ لوڈ یا محفوظ نہیں ہوتا۔",
    q3: "الفاظ کیسے گنے جاتے ہیں؟", a3: "\"Don't\" اور \"well-known\" ہر ایک ایک لفظ گنا جاتا ہے۔ متن کو اسپیس کی بنیاد پر تقسیم کیا جاتا ہے؛ اکیلے نشانات شمار نہیں ہوتے۔",
    q4: "پڑھنے کا وقت کیسے نکالا جاتا ہے؟", a4: "الفاظ ÷ 200 فی منٹ — بالغوں کی اوسط خاموش پڑھنے کی رفتار۔",
    foot: "مفت آن لائن ٹیکسٹ ٹولز — ورڈ کاؤنٹر، کریکٹر کاؤنٹر، کیس کنورٹر، ڈپلیکیٹ لائن ریموور اور اسپیس کلینر۔ پرائیویٹ، تیز، کوئی رجسٹریشن نہیں۔",
    tools_h: "ٹولز"
  }
};

var lang = 'en';
function toggleLang() {
  lang = (lang === 'en' ? 'ur' : 'en');
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'ur' ? 'rtl' : 'ltr');
  var els = document.querySelectorAll('[data-i18n]');
  for (var i = 0; i < els.length; i++) {
    var k = els[i].getAttribute('data-i18n');
    if (STR[lang][k]) els[i].innerHTML = STR[lang][k];
  }
  var phs = document.querySelectorAll('[data-i18n-ph]');
  for (var j = 0; j < phs.length; j++) {
    var pk = phs[j].getAttribute('data-i18n-ph');
    if (STR[lang][pk]) phs[j].placeholder = STR[lang][pk];
  }
  document.getElementById('langToggle').textContent = (lang === 'en' ? 'اردو' : 'English');
  updateCounter();
}

/* ---------- clipboard + toast ---------- */
function toast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(t._h);
  t._h = setTimeout(function () { t.style.display = 'none'; }, 1600);
}
function copyValue(val) {
  var done = function () { toast(STR[lang].copied); };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(val).then(done, function () { legacyCopy(val, done); });
  } else {
    legacyCopy(val, done);
  }
}
function legacyCopy(val, done) {
  var ta = document.createElement('textarea');
  ta.value = val;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (e) { /* noop */ }
  document.body.removeChild(ta);
  done();
}
function copyArea(id) {
  copyValue(document.getElementById(id).value);
}
function clearArea(id) {
  document.getElementById(id).value = '';
  if (id === 'wcIn') updateCounter();
}

/* ---------- 1. WORD COUNTER ---------- */
var LATEST = { words: 0, chars: 0, charsNo: 0, sent: 0, para: 0, read: '0s' };
function updateCounter() {
  var t = document.getElementById('wcIn').value;
  var words = (t.trim().match(/\S+/g) || []).length;
  var chars = Array.from(t).length;
  var charsNo = Array.from(t.replace(/\s/g, '')).length;
  var sent = t.split(/[.!?…]+/).filter(function (s) { return s.trim().length > 0; }).length;
  var para = t.trim() === '' ? 0 : t.split(/\n+/).filter(function (p) { return p.trim().length > 0; }).length;
  var totalSec = Math.round(words / 200 * 60);
  var read = totalSec < 60 ? totalSec + 's' : Math.floor(totalSec / 60) + 'm ' + (totalSec % 60) + 's';
  LATEST = { words: words, chars: chars, charsNo: charsNo, sent: sent, para: para, read: read };
  document.getElementById('statWords').textContent = words;
  document.getElementById('statChars').textContent = chars;
  document.getElementById('statCharsNo').textContent = charsNo;
  document.getElementById('statSent').textContent = sent;
  document.getElementById('statPara').textContent = para;
  document.getElementById('statRead').textContent = read;
}
function copyStats() {
  var S = STR[lang];
  var txt = S.lbl_words + ': ' + LATEST.words + '\n' +
    S.lbl_chars + ': ' + LATEST.chars + '\n' +
    S.lbl_chars_nospace + ': ' + LATEST.charsNo + '\n' +
    S.lbl_sent + ': ' + LATEST.sent + '\n' +
    S.lbl_para + ': ' + LATEST.para + '\n' +
    S.lbl_read + ': ' + LATEST.read;
  copyValue(txt);
}

/* ---------- 2. CASE CONVERTER ---------- */
function titleCase(s) {
  return s.toLowerCase().replace(/(^|[\s([{"\-])(\p{L})/gu, function (m, p1, p2) { return p1 + p2.toUpperCase(); });
}
function sentenceCase(s) {
  var t = s.toLowerCase();
  t = t.replace(/(^\s*\p{L})/u, function (m) { return m.toUpperCase(); });
  return t.replace(/([.!?]\s+)(\p{L})/gu, function (m, p1, p2) { return p1 + p2.toUpperCase(); });
}
function alternatingCase(s) {
  var out = '', up = true;
  for (const ch of s) {
    if (/\p{L}/u.test(ch)) { out += up ? ch.toUpperCase() : ch.toLowerCase(); up = !up; }
    else { out += ch; }
  }
  return out;
}
function convertCase(mode) {
  var ta = document.getElementById('caseIn');
  var v = ta.value;
  if (mode === 'upper') v = v.toUpperCase();
  else if (mode === 'lower') v = v.toLowerCase();
  else if (mode === 'title') v = titleCase(v);
  else if (mode === 'sentence') v = sentenceCase(v);
  else if (mode === 'alt') v = alternatingCase(v);
  ta.value = v;
}

/* ---------- 3. REMOVE DUPLICATE LINES ---------- */
function dedupeLines() {
  var ta = document.getElementById('dedupeIn');
  var cs = document.getElementById('caseSens').checked;
  var lines = ta.value.split('\n');
  var seen = {};
  var out = [], removed = 0;
  for (var i = 0; i < lines.length; i++) {
    var k = cs ? lines[i] : lines[i].toLowerCase();
    if (seen[k] !== undefined) { removed++; }
    else { seen[k] = 1; out.push(lines[i]); }
  }
  document.getElementById('dedupeOut').value = out.join('\n');
  var r = document.getElementById('dedupeRes');
  r.style.display = 'block';
  r.innerHTML = '<strong>' + removed + '</strong> ' + STR[lang].dupes_removed;
}

/* ---------- 4. WHITESPACE CLEANER ---------- */
function cleanWhitespace() {
  var ta = document.getElementById('cleanIn');
  var trim = document.getElementById('optTrim').checked;
  var collapse = document.getElementById('optCollapse').checked;
  var noEmpty = document.getElementById('optEmpty').checked;
  var lines = ta.value.split('\n');
  var out = [];
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i];
    if (trim) l = l.trim();
    if (collapse) l = l.replace(/[ \t]+/g, ' ');
    if (noEmpty && l.trim() === '') continue;
    out.push(l);
  }
  document.getElementById('cleanOut').value = out.join('\n');
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', function () { updateCounter(); });
