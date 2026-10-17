/* NAN Image Tools — app.js (100% client-side, canvas API only) */

/* ---------- tabs ---------- */
function showTab(id, btn) {
  ['compress', 'resize', 'convert'].forEach(function (t) {
    document.getElementById('tool-' + t).style.display = (t === id ? 'block' : 'none');
  });
  document.querySelectorAll('.tab').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
}

/* ---------- i18n ---------- */
const STR = {
  ur: {
    nav_tools: "ٹولز", nav_guide: "رہنمائی",
    h1: "مفت آن لائن امیج ٹولز",
    lede: "تصاویر کمپریس کریں، سائز تبدیل کریں اور فارمیٹ بدلیں — براہِ راست آپ کے براؤزر میں۔ <strong>100% مفت، کوئی رجسٹریشن نہیں۔</strong> آپ کی تصاویر کبھی آپ کے ڈیوائس سے باہر نہیں جاتیں۔",
    tab1: "🗜️ کمپریسر", tab2: "📐 ری سائزر", tab3: "🔁 کنورٹر",
    c_h: "امیج کمپریسر — فائل کا سائز کم کریں", c_d: "JPG، PNG یا WebP تصویر اپ لوڈ کریں، کوالٹی سلائیڈر گھمائیں اور فائل کا سائز لائیو کم ہوتے دیکھیں۔",
    drop_c: "تصویر منتخب کرنے کے لیے ٹیپ کریں یا یہاں ڈراپ کریں", c_quality: "کوالٹی", c_format: "آؤٹ پٹ فارمیٹ",
    fmt_orig: "اصل فارمیٹ", fmt_jpg: "JPG (تصاویر کے لیے)", fmt_webp: "WebP (سب سے چھوٹی)", fmt_png: "PNG (بغیر نقصان)",
    c_before: "اصل سائز", c_after: "نیا سائز", c_saved: "بچت", c_btn: "کمپریس کریں ⬇",
    ready: "آپ کی تصویر تیار ہے:", dl_now: "ڈاؤن لوڈ کریں",
    r_h: "امیج ری سائزر — بالکل درست پکسلز", r_d: "تصویر اپ لوڈ کریں، چوڑائی اور اونچائی درج کریں (تناسب برقرار رکھنے کا آپشن)، اور ڈاؤن لوڈ کریں۔",
    drop_r: "تصویر منتخب کرنے کے لیے ٹیپ کریں یا یہاں ڈراپ کریں", r_w: "چوڑائی (px)", r_hl: "اونچائی (px)",
    r_lock: "تناسب برقرار رکھیں", r_preset: "تیار سائز:", r_format: "فارمیٹ", r_btn: "ری سائز کریں ⬇",
    v_h: "فارمیٹ کنورٹر — JPG، PNG، WebP", v_d: "تصویر اپ لوڈ کریں اور JPG، PNG یا WebP میں تبدیل کریں۔",
    drop_v: "تصویر منتخب کرنے کے لیے ٹیپ کریں یا یہاں ڈراپ کریں", v_target: "تبدیل کریں:", v_quality: "کوالٹی (JPG/WebP)", v_btn: "کنورٹ کریں ⬇",
    add_first: "پہلے کوئی تصویر منتخب کریں", bad_size: "چوڑائی اور اونچائی درست درج کریں",
    priv_h: "پرائیویسی:", priv_d: "تمام پروسیسنگ آپ کے براؤزر میں Canvas API سے ہوتی ہے۔ تصاویر کبھی کسی سرور پر اپ لوڈ نہیں ہوتیں — ذاتی تصاویر اور دستاویزات کے لیے محفوظ۔",
    guides: "رہنمائی", guides_d: "کمپریس، ری سائز اور کنورٹ کا مکمل طریقہ، بہترین سیٹنگز اور سوالات۔",
    faq: "سوالات",
    q1: "کیا یہ ٹولز واقعی مفت ہیں؟", a1: "جی ہاں — تینوں ٹولز 100% مفت ہیں، کوئی رجسٹریشن، واٹرمارک یا فائل کی حد نہیں (صرف آپ کے ڈیوائس کی میموری حد ہے)۔",
    q2: "کیا میری تصاویر کہیں اپ لوڈ ہوتی ہیں؟", a2: "نہیں۔ سب کچھ آپ کے براؤزر میں Canvas API سے ہوتا ہے۔ تصاویر آپ کے فون یا کمپیوٹر سے باہر نہیں جاتیں۔",
    q3: "بہترین کوالٹی سیٹنگ کون سی ہے؟", a3: "ویب سائٹس اور سوشل میڈیا کے لیے 70–85% بہترین توازن ہے — زیادہ تر تصاویر اصل جیسی ہی لگتی ہیں۔",
    q4: "کیا میں تصویر کا سائز بالکل درست پکسلز میں کر سکتا ہوں؟", a4: "جی ہاں — ری سائزر میں چوڑائی اور اونچائی خود درج کریں یا تیار سائز (Instagram، YouTube وغیرہ) منتخب کریں۔",
    q5: "کون سی فارمیٹس سپورٹ ہیں؟", a5: "ان پٹ: JPG، PNG، WebP، GIF، BMP۔ آؤٹ پٹ: JPG، PNG، WebP۔",
    foot: "مفت آن لائن امیج ٹولز — کمپریس، ری سائز اور فارمیٹ کنورٹ کریں۔ پرائیویٹ، تیز، کوئی رجسٹریشن نہیں۔", tools_h: "ٹولز"
  },
  en: {
    nav_tools: "Tools", nav_guide: "Guide",
    h1: "Free Online Image Tools",
    lede: "Compress images, resize to exact pixels, and convert formats — right in your browser. <strong>100% free, no signup.</strong> Your images never leave your device.",
    tab1: "🗜️ Compressor", tab2: "📐 Resizer", tab3: "🔁 Converter",
    c_h: "Image Compressor — shrink file size", c_d: "Upload a JPG, PNG or WebP, drag the quality slider and watch the file size drop live.",
    drop_c: "Tap to choose an image, or drag & drop here", c_quality: "Quality", c_format: "Output format",
    fmt_orig: "Keep original", fmt_jpg: "JPG (photos)", fmt_webp: "WebP (smallest)", fmt_png: "PNG (lossless)",
    c_before: "Original", c_after: "Compressed", c_saved: "Saved", c_btn: "Compress ⬇",
    ready: "Your image is ready:", dl_now: "Download",
    r_h: "Image Resizer — exact pixel dimensions", r_d: "Upload an image, type the width and height (optionally locked to the original aspect ratio), then download.",
    drop_r: "Tap to choose an image, or drag & drop here", r_w: "Width (px)", r_hl: "Height (px)",
    r_lock: "Keep aspect ratio", r_preset: "Presets:", r_format: "Format", r_btn: "Resize ⬇",
    v_h: "Format Converter — JPG, PNG, WebP", v_d: "Upload an image and convert it to JPG, PNG or WebP.",
    drop_v: "Tap to choose an image, or drag & drop here", v_target: "Convert to:", v_quality: "Quality (JPG/WebP)", v_btn: "Convert ⬇",
    add_first: "Please choose an image first", bad_size: "Please enter valid width and height",
    priv_h: "Private by design:", priv_d: "All processing happens inside your browser with the Canvas API. Images are never uploaded to any server — safe for personal photos and documents.",
    guides: "Guides", guides_d: "Full how-to for compressing, resizing and converting, best settings and FAQs.",
    faq: "FAQs",
    q1: "Are these tools really free?", a1: "Yes — all three tools are 100% free with no signup, no watermark and no file limit imposed by us (only your device's memory).",
    q2: "Are my images uploaded anywhere?", a2: "No. Everything runs locally in your browser using the Canvas API. Images never leave your phone or computer.",
    q3: "What quality setting should I use?", a3: "For websites and social media, 70–85% is the sweet spot — most photos look identical to the original.",
    q4: "Can I resize to exact pixel dimensions?", a4: "Yes — type any width and height in the resizer, or pick a preset (Instagram, YouTube, Facebook, Open Graph).",
    q5: "Which formats are supported?", a5: "Input: JPG, PNG, WebP, GIF, BMP. Output: JPG, PNG, WebP.",
    foot: "Free online image tools — compress, resize and convert images. Private, fast, no signup.", tools_h: "Tools"
  }
};
let lang = 'en';
function toggleLang() {
  lang = (lang === 'en' ? 'ur' : 'en');
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'ur' ? 'rtl' : 'ltr');
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    const k = el.getAttribute('data-i18n');
    if (STR[lang][k]) el.innerHTML = STR[lang][k];
  });
  document.getElementById('langToggle').textContent = (lang === 'en' ? 'اردو' : 'English');
}

/* ---------- helpers ---------- */
function fmtBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1048576).toFixed(2) + ' MB';
}
function loadImageFromFile(file) {
  return new Promise(function (res, rej) {
    const u = URL.createObjectURL(file);
    const im = new Image();
    im.onload = function () { URL.revokeObjectURL(u); res(im); };
    im.onerror = function () { URL.revokeObjectURL(u); rej(new Error('bad-image')); };
    im.src = u;
  });
}
async function blobFromDataUrl(dataUrl) {
  const r = await fetch(dataUrl);
  return new Uint8Array(await r.arrayBuffer());
}
function prog(id, frac) {
  const p = document.getElementById(id);
  p.style.display = 'block';
  p.firstElementChild.style.width = Math.round(frac * 100) + '%';
  if (frac >= 1) setTimeout(function () { p.style.display = 'none'; }, 800);
}
function showDownload(dlId, aId, bytes, mime, name) {
  const a = document.getElementById(aId);
  if (a.href && a.href.indexOf('blob:') === 0) URL.revokeObjectURL(a.href);
  a.href = URL.createObjectURL(new Blob([bytes], { type: mime }));
  a.download = name;
  document.getElementById(dlId).style.display = 'block';
}
function baseName(fn) { const i = fn.lastIndexOf('.'); return i > 0 ? fn.slice(0, i) : fn; }
function extOf(mime) { return mime === 'image/png' ? 'png' : (mime === 'image/webp' ? 'webp' : 'jpg'); }
function normOutMime(mime) {
  if (mime === 'image/jpeg' || mime === 'image/webp') return mime;
  return 'image/png';
}
function dropWire(zoneId, inputId, cb) {
  const z = document.getElementById(zoneId);
  ['dragover', 'dragenter'].forEach(function (e) {
    z.addEventListener(e, function (ev) { ev.preventDefault(); z.classList.add('over'); });
  });
  ['dragleave', 'drop'].forEach(function (e) {
    z.addEventListener(e, function (ev) { ev.preventDefault(); z.classList.remove('over'); });
  });
  z.addEventListener('drop', function (ev) { cb(ev.dataTransfer.files); });
  document.getElementById(inputId).addEventListener('change', function (ev) {
    cb(ev.target.files); ev.target.value = '';
  });
}
function drawToCanvas(img, w, h, mime) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  if (mime === 'image/jpeg') { x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h); }
  x.drawImage(img, 0, 0, w, h);
  return c;
}
function showPreview(pref, file, img) {
  const pv = document.getElementById(pref + 'Prev');
  pv.style.display = 'flex';
  document.getElementById(pref + 'Thumb').src = URL.createObjectURL(file);
  document.getElementById(pref + 'Name').textContent = file.name;
  document.getElementById(pref + 'Orig').textContent =
    fmtBytes(file.size) + ' · ' + img.naturalWidth + '×' + img.naturalHeight + ' px';
}
const S = { comp: null, rsz: null, conv: null };

/* ---------- COMPRESSOR ---------- */
let compSeq = 0;
dropWire('dropComp', 'fileComp', async function (files) {
  const f = files[0];
  if (!f || !f.type.startsWith('image/')) return;
  try {
    const img = await loadImageFromFile(f);
    S.comp = { file: f, img: img, out: null };
    showPreview('comp', f, img);
    updateCompress();
  } catch (e) { /* bad image, ignore */ }
});
document.getElementById('compQ').addEventListener('input', function () {
  document.getElementById('compQVal').textContent = this.value + '%';
  updateCompress();
});
document.getElementById('compFmt').addEventListener('change', updateCompress);
async function updateCompress() {
  if (!S.comp) return;
  const seq = ++compSeq;
  const q = (+document.getElementById('compQ').value) / 100;
  let mime = document.getElementById('compFmt').value;
  if (mime === 'orig') mime = S.comp.file.type.startsWith('image/') ? S.comp.file.type : 'image/jpeg';
  mime = normOutMime(mime);
  prog('progComp', 0.4);
  try {
    const im = S.comp.img;
    const c = drawToCanvas(im, im.naturalWidth, im.naturalHeight, mime);
    const bytes = await blobFromDataUrl(c.toDataURL(mime, q));
    if (seq !== compSeq) return; /* stale slider result */
    S.comp.out = { bytes: bytes, mime: mime };
    const orig = S.comp.file.size;
    const saved = orig > 0 ? Math.max(0, Math.round((1 - bytes.length / orig) * 100)) : 0;
    document.getElementById('statBefore').textContent = fmtBytes(orig);
    document.getElementById('statAfter').textContent = fmtBytes(bytes.length);
    document.getElementById('statSaved').textContent = saved + '%';
    document.getElementById('statsComp').style.display = 'flex';
    prog('progComp', 1);
  } catch (e) { prog('progComp', 1); }
}
function downloadComp() {
  if (!S.comp || !S.comp.out) { alert(STR[lang].add_first); return; }
  showDownload('dlComp', 'dlCompA', S.comp.out.bytes, S.comp.out.mime,
    baseName(S.comp.file.name) + '-compressed.' + extOf(S.comp.out.mime));
}

/* ---------- RESIZER ---------- */
dropWire('dropRsz', 'fileRsz', async function (files) {
  const f = files[0];
  if (!f || !f.type.startsWith('image/')) return;
  try {
    const img = await loadImageFromFile(f);
    S.rsz = { file: f, img: img };
    showPreview('rsz', f, img);
    document.getElementById('rszW').value = img.naturalWidth;
    document.getElementById('rszH').value = img.naturalHeight;
  } catch (e) { /* bad image, ignore */ }
});
function lockAdjust(changed) {
  if (!S.rsz || !document.getElementById('lockAR').checked) return;
  const im = S.rsz.img;
  const wEl = document.getElementById('rszW'), hEl = document.getElementById('rszH');
  if (changed === 'w') {
    const w = parseInt(wEl.value, 10);
    if (w > 0) hEl.value = Math.round(w * im.naturalHeight / im.naturalWidth);
  } else {
    const h = parseInt(hEl.value, 10);
    if (h > 0) wEl.value = Math.round(h * im.naturalWidth / im.naturalHeight);
  }
}
document.getElementById('rszW').addEventListener('input', function () { lockAdjust('w'); });
document.getElementById('rszH').addEventListener('input', function () { lockAdjust('h'); });
function setPreset(w, h) {
  document.getElementById('rszW').value = w;
  document.getElementById('rszH').value = h;
}
function doResize() {
  if (!S.rsz) { alert(STR[lang].add_first); return; }
  const w = parseInt(document.getElementById('rszW').value, 10);
  const h = parseInt(document.getElementById('rszH').value, 10);
  if (!(w > 0) || !(h > 0)) { alert(STR[lang].bad_size); return; }
  prog('progRsz', 0.5);
  const mime = document.getElementById('rszFmt').value;
  const c = drawToCanvas(S.rsz.img, w, h, mime);
  blobFromDataUrl(c.toDataURL(mime, 0.92)).then(function (bytes) {
    document.getElementById('rszResult').textContent = w + '×' + h + ' px · ' + fmtBytes(bytes.length);
    document.getElementById('rszResult').style.display = 'block';
    showDownload('dlRsz', 'dlRszA', bytes, mime,
      baseName(S.rsz.file.name) + '-' + w + 'x' + h + '.' + extOf(mime));
    prog('progRsz', 1);
  });
}

/* ---------- CONVERTER ---------- */
dropWire('dropConv', 'fileConv', async function (files) {
  const f = files[0];
  if (!f || !f.type.startsWith('image/')) return;
  try {
    const img = await loadImageFromFile(f);
    S.conv = { file: f, img: img };
    showPreview('conv', f, img);
  } catch (e) { /* bad image, ignore */ }
});
document.getElementById('convQ').addEventListener('input', function () {
  document.getElementById('convQVal').textContent = this.value + '%';
});
function doConvert() {
  if (!S.conv) { alert(STR[lang].add_first); return; }
  prog('progConv', 0.5);
  const mime = document.getElementById('convFmt').value;
  const q = (+document.getElementById('convQ').value) / 100;
  const im = S.conv.img;
  const c = drawToCanvas(im, im.naturalWidth, im.naturalHeight, mime);
  blobFromDataUrl(c.toDataURL(mime, q)).then(function (bytes) {
    showDownload('dlConv', 'dlConvA', bytes, mime,
      baseName(S.conv.file.name) + '.' + extOf(mime));
    prog('progConv', 1);
  });
}
