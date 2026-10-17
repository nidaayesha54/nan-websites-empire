/* NAN Poster Maker — canvas poster/flyer maker (client-side, 1080x1080) */
(function () {
'use strict';

var cv = document.getElementById('poster');
var ctx = cv.getContext('2d');
var W = 1080, H = 1080;
var FONT_STACK = '"Poppins","Noto Nastaliq Urdu",sans-serif';

/* ---------- state ---------- */
var S = {
  headline: 'MEGA SALE',
  subtext: 'Up to 50% OFF — everything must go!',
  foot: 'Shop now · Limited time only',
  size: 150,
  color: '#ffffff',
  shadow: true,
  bg: { type: 'grad', c1: '#ff512f', c2: '#dd2476' }
};

/* ---------- background swatches ---------- */
var SWATCHES = [
  { name: 'Sunset',  type: 'grad',  c1: '#ff512f', c2: '#dd2476' },
  { name: 'Ocean',   type: 'grad',  c1: '#2193b0', c2: '#6dd5ed' },
  { name: 'Navy',    type: 'grad',  c1: '#0A1628', c2: '#134e5e' },
  { name: 'Grape',   type: 'grad',  c1: '#8e2de2', c2: '#4a00e0' },
  { name: 'Forest',  type: 'grad',  c1: '#11998e', c2: '#38ef7d' },
  { name: 'Royal',   type: 'solid', c1: '#1e3a8a' },
  { name: 'Teal',    type: 'solid', c1: '#14B8A6' },
  { name: 'Cream',   type: 'solid', c1: '#fef3c7' }
];
var activeSw = 0;

/* ---------- templates ---------- */
var TPL = {
  sale:  { headline: 'MEGA SALE', subtext: 'Up to 50% OFF — everything must go!', foot: 'Shop now · Limited time only',
           size: 150, color: '#ffffff', shadow: true,  bg: { type: 'grad', c1: '#ff512f', c2: '#dd2476' } },
  event: { headline: 'Grand Opening', subtext: 'Live music · Food · Fun for the whole family', foot: 'Sat, 25 Oct · 5 PM · Main Street Hall',
           size: 110, color: '#ffffff', shadow: true,  bg: { type: 'grad', c1: '#0A1628', c2: '#134e5e' } },
  quote: { headline: '"Dream big, work hard, stay humble."', subtext: '', foot: '— NAN',
           size: 84,  color: '#f8fafc', shadow: false, bg: { type: 'grad', c1: '#232526', c2: '#414345' } }
};

/* ---------- helpers ---------- */
function $(id) { return document.getElementById(id); }

function wrap(text, maxW) {
  var words = String(text || '').split(/\s+/).filter(Boolean);
  var lines = [], cur = '';
  for (var i = 0; i < words.length; i++) {
    var t = cur ? cur + ' ' + words[i] : words[i];
    if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = words[i]; }
    else { cur = t; }
  }
  if (cur) lines.push(cur);
  return lines;
}

function draw() {
  ctx.save();
  ctx.clearRect(0, 0, W, H);

  /* background */
  if (S.bg.type === 'solid') { ctx.fillStyle = S.bg.c1; ctx.fillRect(0, 0, W, H); }
  else {
    var g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, S.bg.c1); g.addColorStop(1, S.bg.c2);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  /* text setup */
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = S.color;
  if (S.shadow) { ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 9; }
  else { ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; }

  /* headline (wrapped, centered) */
  ctx.font = '800 ' + S.size + 'px ' + FONT_STACK;
  var hLines = wrap(S.headline, W - 160);
  var lh = S.size * 1.18;
  var y = 440 - ((hLines.length - 1) * lh) / 2;
  for (var i = 0; i < hLines.length; i++) {
    ctx.fillText(hLines[i], W / 2, y + i * lh);
  }

  /* subtext */
  if (S.subtext.trim()) {
    ctx.font = '700 46px ' + FONT_STACK;
    var sLines = wrap(S.subtext, W - 200);
    var sy = 440 + ((hLines.length - 1) * lh) / 2 + lh * 0.75;
    for (var j = 0; j < sLines.length; j++) {
      ctx.fillText(sLines[j], W / 2, sy + j * 62);
    }
  }

  /* bottom line */
  if (S.foot.trim()) {
    ctx.font = '700 38px ' + FONT_STACK;
    var fLines = wrap(S.foot, W - 200);
    var fy = 990 - (fLines.length - 1) * 52;
    for (var k = 0; k < fLines.length; k++) {
      ctx.fillText(fLines[k], W / 2, fy + k * 52);
    }
  }
  ctx.restore();
}

/* ---------- state sync ---------- */
function syncState() {
  S.headline = $('inHead').value;
  S.subtext = $('inSub').value;
  S.foot = $('inFoot').value;
  S.size = parseInt($('inSize').value, 10) || 100;
  S.color = $('inTColor').value;
  S.shadow = $('inShadow').checked;
  $('sizeVal').textContent = S.size;
  draw();
}

function customBg(hex) {
  S.bg = { type: 'solid', c1: hex };
  activeSw = -1;
  paintSwatches();
  draw();
}

function paintSwatches() {
  var box = $('swatches');
  box.innerHTML = '';
  SWATCHES.forEach(function (sw, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'sw' + (i === activeSw ? ' active' : '');
    b.title = sw.name;
    b.setAttribute('aria-label', sw.name + ' background');
    b.style.background = sw.type === 'solid'
      ? sw.c1
      : 'linear-gradient(135deg,' + sw.c1 + ',' + sw.c2 + ')';
    b.onclick = function () {
      activeSw = i;
      S.bg = { type: sw.type, c1: sw.c1, c2: sw.c2 };
      paintSwatches();
      draw();
    };
    box.appendChild(b);
  });
}

function applyTemplate(name, btn) {
  var t = TPL[name];
  if (!t) return;
  S.headline = t.headline; S.subtext = t.subtext; S.foot = t.foot;
  S.size = t.size; S.color = t.color; S.shadow = t.shadow;
  S.bg = { type: t.bg.type, c1: t.bg.c1, c2: t.bg.c2 };
  $('inHead').value = t.headline;
  $('inSub').value = t.subtext;
  $('inFoot').value = t.foot;
  $('inSize').value = t.size;
  $('inTColor').value = t.color;
  $('inShadow').checked = t.shadow;
  $('sizeVal').textContent = t.size;
  activeSw = -1;
  document.querySelectorAll('.tpl').forEach(function (b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  paintSwatches();
  draw();
}

function downloadPNG() {
  var a = document.createElement('a');
  a.download = 'nan-poster-1080x1080.png';
  a.href = cv.toDataURL('image/png');
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* ---------- i18n ---------- */
var STR = {
  en: {
    nav_tools: 'Tools', nav_guide: 'Guide',
    h1: 'Free Online Poster Maker — Design Flyers Fast',
    lede: 'Create stunning sale posters, event flyers and quote graphics in seconds — right in your browser. Type in English or Urdu, pick a template and background, then download a crisp 1080×1080 PNG. 100% free, no signup, no watermark.',
    p_title: '🎨 Design your poster', p_prev: '👁 Live preview — 1080×1080',
    t_sale: '🔥 Sale', t_event: '🎉 Event', t_quote: '💬 Quote',
    l_head: 'Headline', l_sub: 'Sub text', l_foot: 'Bottom line (date / venue / CTA)',
    l_bg: 'Background', l_custom: 'Custom background color', l_size: 'Headline size',
    l_tcolor: 'Text color', l_shadow: 'Text shadow', dl: '⬇ Download PNG',
    ph_head: 'e.g. MEGA SALE — or اردو میں لکھیں', ph_sub: 'Supporting line…', ph_foot: 'Sat 25 Oct · 5 PM · Main Street Hall',
    how_h: 'How it works',
    s1: '<strong>Pick a template</strong> — Sale, Event or Quote sets the layout, colors and sizes instantly.',
    s2: '<strong>Type your text</strong> — English or Urdu. Urdu renders beautifully with Noto Nastaliq Urdu font.',
    s3: '<strong>Style it</strong> — choose a background, tune the headline size, text color and shadow.',
    s4: '<strong>Download</strong> — one tap gives you a sharp 1080×1080 PNG, ready for WhatsApp, Instagram or print.',
    g_h: '📖 New to poster design?',
    g_d: 'Read our step-by-step guide: tips, free flyer maker tools, and how to make a poster in Urdu.',
    g_a: 'Read the Free Poster Maker Guide →',
    faq: 'FAQs',
    q1: 'Is this poster maker really free?',
    a1: 'Yes — 100% free with no signup and no watermark on your downloads. Everything runs in your browser.',
    q2: 'Can I make posters in Urdu?',
    a2: 'Yes. Type Urdu directly into the text fields — the canvas renders it with the Noto Nastaliq Urdu font, right-to-left, exactly as you typed it.',
    q3: 'What size is the downloaded poster?',
    a3: '1080×1080 pixels — the perfect square format for Instagram posts, WhatsApp status, Facebook and printing small flyers.',
    q4: 'Do my designs get uploaded anywhere?',
    a4: 'No. Your text never leaves your device — all rendering happens locally on the canvas in your browser.',
    foot: 'Free online poster & flyer maker — sale posters, event flyers and quote graphics with Urdu + English support. Download sharp 1080×1080 PNGs, no signup.',
    tools_h: 'Tools'
  },
  ur: {
    nav_tools: 'ٹولز', nav_guide: 'رہنمائی',
    h1: 'مفت آن لائن پوسٹر میکر — فلائر جلدی ڈیزائن کریں',
    lede: 'سیکنڈوں میں شاندار سیل پوسٹر، ایونٹ فلائر اور اقوال کے گرافکس بنائیں — براہِ راست آپ کے براؤزر میں۔ انگریزی یا اردو میں لکھیں، ٹیمپلیٹ اور پس منظر چنیں، پھر واضح 1080×1080 PNG ڈاؤن لوڈ کریں۔ 100% مفت، کوئی رجسٹریشن نہیں، کوئی واٹر مارک نہیں۔',
    p_title: '🎨 اپنا پوسٹر ڈیزائن کریں', p_prev: '👁 لائیو پیش نظارہ — 1080×1080',
    t_sale: '🔥 سیل', t_event: '🎉 ایونٹ', t_quote: '💬 قول',
    l_head: 'سرخی', l_sub: 'ذیلی متن', l_foot: 'نیچے کی سطر (تاریخ / جگہ / کال ٹو ایکشن)',
    l_bg: 'پس منظر', l_custom: 'اپنا پس منظر کا رنگ', l_size: 'سرخی کا سائز',
    l_tcolor: 'متن کا رنگ', l_shadow: 'متن کا سایہ', dl: '⬇ PNG ڈاؤن لوڈ کریں',
    ph_head: 'مثلاً زبردست سیل — یا اردو میں لکھیں', ph_sub: 'معاون سطر…', ph_foot: 'ہفتہ 25 اکتوبر · شام 5 بجے · مین اسٹریٹ ہال',
    how_h: 'یہ کیسے کام کرتا ہے',
    s1: '<strong>ٹیمپلیٹ چنیں</strong> — سیل، ایونٹ یا قول لے آؤٹ، رنگ اور سائز فوراً سیٹ کر دیتا ہے۔',
    s2: '<strong>اپنا متن لکھیں</strong> — انگریزی یا اردو۔ اردو نستعلیق فونٹ میں خوبصورت نظر آتی ہے۔',
    s3: '<strong>اسٹائل کریں</strong> — پس منظر چنیں، سرخی کا سائز، متن کا رنگ اور سایہ درست کریں۔',
    s4: '<strong>ڈاؤن لوڈ کریں</strong> — ایک ٹیپ پر تیز 1080×1080 PNG، واٹس ایپ، انسٹاگرام یا پرنٹ کے لیے تیار۔',
    g_h: '📖 پوسٹر ڈیزائن میں نئے ہیں؟',
    g_d: 'ہماری مرحلہ وار رہنمائی پڑھیں: ٹپس، مفت فلائر میکر ٹولز، اور اردو میں پوسٹر کیسے بنائیں۔',
    g_a: 'مفت پوسٹر میکر گائیڈ پڑھیں →',
    faq: 'سوالات',
    q1: 'کیا یہ پوسٹر میکر واقعی مفت ہے؟',
    a1: 'جی ہاں — 100% مفت، کوئی رجسٹریشن نہیں اور ڈاؤن لوڈ پر کوئی واٹر مارک نہیں۔ سب کچھ آپ کے براؤزر میں چلتا ہے۔',
    q2: 'کیا میں اردو میں پوسٹر بنا سکتا/سکتی ہوں؟',
    a2: 'جی ہاں۔ متن کے خانوں میں براہِ راست اردو لکھیں — کینوس اسے نستعلیق فونٹ میں دائیں سے بائیں، بالکل ویسے ہی دکھاتا ہے جیسے آپ نے لکھا۔',
    q3: 'ڈاؤن لوڈ ہونے والا پوسٹر کس سائز کا ہوتا ہے؟',
    a3: '1080×1080 پکسل — انسٹاگرام پوسٹس، واٹس ایپ اسٹیٹس، فیس بک اور چھوٹے فلائر پرنٹ کرنے کے لیے بہترین مربع فارمیٹ۔',
    q4: 'کیا میرے ڈیزائن کہیں اپ لوڈ ہوتے ہیں؟',
    a4: 'نہیں۔ آپ کا متن آپ کے ڈیوائس سے باہر نہیں جاتا — تمام رینڈرنگ آپ کے براؤزر کے کینوس پر مقامی طور پر ہوتی ہے۔',
    foot: 'مفت آن لائن پوسٹر اور فلائر میکر — اردو اور انگریزی سپورٹ کے ساتھ سیل پوسٹر، ایونٹ فلائر اور اقوال کے گرافکس۔ تیز 1080×1080 PNG ڈاؤن لوڈ کریں، کوئی رجسٹریشن نہیں۔',
    tools_h: 'ٹولز'
  }
};
var lang = 'en';
function toggleLang() {
  lang = (lang === 'en' ? 'ur' : 'en');
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'ur' ? 'rtl' : 'ltr');
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var k = el.getAttribute('data-i18n');
    if (STR[lang][k]) el.innerHTML = STR[lang][k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
    var k = el.getAttribute('data-i18n-ph');
    if (STR[lang][k]) el.setAttribute('placeholder', STR[lang][k]);
  });
  $('langToggle').textContent = (lang === 'en' ? 'اردو' : 'English');
}

/* ---------- fonts, then first draw ---------- */
function init() {
  paintSwatches();
  syncState();
  var loads = [];
  try {
    loads.push(document.fonts.load('800 100px Poppins'));
    loads.push(document.fonts.load('700 100px "Noto Nastaliq Urdu"'));
  } catch (e) { /* fonts API unavailable — draw anyway */ }
  Promise.all(loads).then(function () { draw(); }).catch(function () { draw(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { draw(); }).catch(function () {});
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* expose for inline handlers */
window.syncState = syncState;
window.customBg = customBg;
window.applyTemplate = applyTemplate;
window.downloadPNG = downloadPNG;
window.toggleLang = toggleLang;

})();
