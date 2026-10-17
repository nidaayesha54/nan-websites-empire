/* NAN Barcode Studio — app logic (JsBarcode 3.11.6) */
var FORMATS = {
  code128: {
    name: "CODE128",
    en: "The universal barcode — encodes any text & numbers. Use for shipping labels, internal tracking, warehouse stock.",
    ur: "Aam barcode — koi bhi text ya numbers. Shipping labels, warehouse stock aur internal tracking ke liye.",
    hint: "e.g. SKU-12345"
  },
  ean13: {
    name: "EAN-13",
    en: "The retail barcode on products worldwide. Needs 12 digits — the 13th check digit is added automatically.",
    ur: "Dukano par lagne wala retail barcode. 12 digits likhein — 13va check digit khud lag jayega.",
    hint: "e.g. 590123412345"
  },
  upc: {
    name: "UPC-A",
    en: "The US/Canada retail barcode. Needs 11 digits — the 12th check digit is added automatically.",
    ur: "USA/Canada ka retail barcode. 11 digits likhein — 12va check digit khud lag jayega.",
    hint: "e.g. 03600029145"
  },
  code39: {
    name: "CODE39",
    en: "Simple industrial barcode. Only A–Z, 0–9 and - . space $ / + % allowed — uppercase letters only.",
    ur: "Simple industrial barcode. Sirf A–Z, 0–9 aur - . space $ / + % — baray harf istemal karein.",
    hint: "e.g. PROD-42"
  }
};
var active = "code128";
var LANG = "en";
var saved = [];

var I18N = {
  en: {
    h1: "Free Barcode Generator Online",
    hero: "Create Code128, EAN-13, UPC-A & Code39 barcodes free in your browser. Customize size and colors, download as PNG — no signup, nothing uploaded.",
    fmt: "Barcode format",
    val: "Value / data",
    w: "Bar width", h: "Barcode height",
    fg: "Bar color", bgc: "Background",
    showt: "Show value text under barcode",
    gen: "Generate barcode", dl: "Download PNG", save: "+ Save to batch",
    placeholder: "Your barcode appears here",
    batch: "Saved batch (up to 5 — print together)",
    batchp: "Save up to 5 barcodes and download each PNG for batch printing (shop labels, product tags).",
    howh: "How it works",
    howp: "Pick a format, type the data, press Generate. Everything runs in your browser — your data never leaves your device. For batch printing, save up to 5 barcodes and download each as PNG.",
    articlelink: "📖 Full guide: which barcode format to use (and how to make one)",
    empty: "Type a value first.",
    eanDigits: "EAN-13 needs 12 or 13 digits only (numbers 0–9).",
    upcDigits: "UPC-A needs 11 or 12 digits only (numbers 0–9).",
    c39chars: "Code39 allows only A–Z, 0–9 and - . space $ / + % (uppercase).",
    c128ascii: "Code128 needs plain ASCII text (no special symbols).",
    full: "Batch is full (5). Download some, then refresh to clear.",
    checksumNote: "✓ Check digit added automatically",
    itemDl: "PNG", toggleLabel: "اردو"
  },
  ur: {
    h1: "Muft Barcode Generator Online",
    hero: "Browser mein muft Code128, EAN-13, UPC-A aur Code39 barcodes banayein. Size aur rang badlein, PNG download karein — koi signup nahi.",
    fmt: "Barcode ka format",
    val: "Qeemat / data",
    w: "Lakiron ki chaurai", h: "Barcode ki lambai",
    fg: "Lakiron ka rang", bgc: "Pis-manzar",
    showt: "Barcode ke neeche value likhein",
    gen: "Barcode banayein", dl: "PNG download", save: "+ Batch mein shamil",
    placeholder: "Apka barcode yahan aayega",
    batch: "Mehfooz batch (5 tak — ek sath print karein)",
    batchp: "5 tak barcodes save karein aur batch printing ke liye har PNG download karein (shop labels, product tags).",
    howh: "Yeh kaam kaise karta hai",
    howp: "Format chunein, data likhein, Generate dabayein. Sab kuch apke browser mein hota hai — data kahin nahi jata. Batch printing ke liye 5 barcodes save karke har PNG download karein.",
    articlelink: "📖 Mukammal guide: kaunsa barcode format use karein (aur kaise banayein)",
    empty: "Pehle koi value likhein.",
    eanDigits: "EAN-13 ke liye sirf 12 ya 13 digits (0–9).",
    upcDigits: "UPC-A ke liye sirf 11 ya 12 digits (0–9).",
    c39chars: "Code39 mein sirf A–Z, 0–9 aur - . space $ / + % (baray harf).",
    c128ascii: "Code128 mein sada ASCII text (khass alamat nahi).",
    full: "Batch bhar gaya (5). Kuch download karke page refresh karein.",
    checksumNote: "✓ Check digit khud lag gaya",
    itemDl: "PNG", toggleLabel: "English"
  }
};
function t(k) { return I18N[LANG][k] || k; }

function renderFormats() {
  var grid = document.getElementById("fmtGrid");
  grid.innerHTML = "";
  Object.keys(FORMATS).forEach(function (key) {
    var f = FORMATS[key];
    var d = document.createElement("div");
    d.className = "fmt" + (key === active ? " active" : "");
    d.innerHTML = "<div>" + f.name + "</div><div class='explainer'>" + (LANG === "ur" ? f.ur : f.en) + "</div>";
    d.onclick = function () { active = key; renderFormats(); };
    grid.appendChild(d);
  });
  document.getElementById("valInput").placeholder = FORMATS[active].hint;
}

function toggleLang() {
  LANG = LANG === "en" ? "ur" : "en";
  document.getElementById("rootHtml").lang = LANG;
  document.getElementById("rootHtml").dir = LANG === "ur" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    var k = el.getAttribute("data-i18n");
    if (I18N[LANG][k]) el.textContent = I18N[LANG][k];
  });
  document.getElementById("langToggle").textContent = I18N[LANG].toggleLabel;
  renderFormats();
  renderSaved();
}

function showErr(msg) {
  var box = document.getElementById("errBox");
  box.textContent = msg;
  box.style.display = "block";
}
function hideErr() { document.getElementById("errBox").style.display = "none"; }

function checkDigit(code) {
  var sum = 0;
  for (var i = 0; i < code.length; i++) {
    var d = parseInt(code[i], 10);
    sum += (i % 2 === 0) ? d : d * 3;
  }
  return String((10 - (sum % 10)) % 10);
}

function validate(value) {
  var v = value.trim();
  if (!v) return { ok: false, msg: t("empty") };
  if (active === "ean13") {
    if (!/^\d{12,13}$/.test(v)) return { ok: false, msg: t("eanDigits") };
    if (v.length === 12) return { ok: true, value: v + checkDigit(v), note: t("checksumNote") };
    return { ok: true, value: v };
  }
  if (active === "upc") {
    if (!/^\d{11,12}$/.test(v)) return { ok: false, msg: t("upcDigits") };
    if (v.length === 11) return { ok: true, value: v + checkDigit(v), note: t("checksumNote") };
    return { ok: true, value: v };
  }
  if (active === "code39") {
    if (!/^[A-Z0-9\-\.\ \$ /\+%]+$/.test(v)) return { ok: false, msg: t("c39chars") };
    return { ok: true, value: v };
  }
  /* code128 */
  if (!/^[\x20-\x7E]*$/.test(v)) return { ok: false, msg: t("c128ascii") };
  return { ok: true, value: v };
}

function buildConfig() {
  return {
    format: active,
    lineColor: document.getElementById("optFg").value,
    background: document.getElementById("optBg").value,
    width: parseFloat(document.getElementById("optWidth").value),
    height: parseInt(document.getElementById("optHeight").value, 10),
    displayValue: document.getElementById("optText").checked,
    fontSize: 16,
    margin: 10
  };
}

function renderInto(svgEl, value, cfg) {
  JsBarcode(svgEl, value, cfg);
}

function generateBarcode() {
  hideErr();
  var res = validate(document.getElementById("valInput").value);
  if (!res.ok) { showErr(res.msg); return; }
  var box = document.getElementById("barcodeBox");
  box.innerHTML = "";
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  box.appendChild(svg);
  try {
    renderInto(svg, res.value, buildConfig());
  } catch (e) {
    showErr(String(e && e.message ? e.message : e));
    box.innerHTML = "";
    return;
  }
  var note = document.getElementById("autoNote");
  if (res.note) { note.textContent = res.note; note.style.display = "block"; }
  else { note.style.display = "none"; }
}

function downloadPNG(boxId, fname) {
  var svg = document.querySelector("#" + boxId + " svg");
  if (!svg) { showErr(t("empty")); return; }
  var xml = new XMLSerializer().serializeToString(svg);
  var img = new Image();
  img.onload = function () {
    var scale = 3;
    var c = document.createElement("canvas");
    c.width = img.width * scale;
    c.height = img.height * scale;
    var ctx = c.getContext("2d");
    ctx.fillStyle = document.getElementById("optBg").value;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    var a = document.createElement("a");
    a.download = fname + ".png";
    a.href = c.toDataURL("image/png");
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
}

function saveToList() {
  hideErr();
  if (saved.length >= 5) { showErr(t("full")); return; }
  var res = validate(document.getElementById("valInput").value);
  if (!res.ok) { showErr(res.msg); return; }
  saved.push({ value: res.value, cfg: buildConfig(), fmt: FORMATS[active].name });
  renderSaved();
}

function renderSaved() {
  var list = document.getElementById("savList");
  list.innerHTML = "";
  saved.forEach(function (s, i) {
    var d = document.createElement("div");
    d.className = "savitem";
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "savedSvg" + i;
    d.appendChild(svg);
    var cap = document.createElement("div");
    cap.className = "cap";
    cap.textContent = s.fmt + " — " + s.value;
    d.appendChild(cap);
    var b = document.createElement("button");
    b.className = "btn sec";
    b.textContent = t("itemDl");
    b.onclick = function () { downloadSaved(i); };
    d.appendChild(b);
    list.appendChild(d);
    try { renderInto(svg, s.value, s.cfg); } catch (e) { cap.textContent = "error"; }
  });
}

function downloadSaved(i) {
  var s = saved[i];
  var box = document.getElementById("savList");
  var items = box.children;
  /* reuse downloadPNG logic on the specific svg */
  var svg = items[i].querySelector("svg");
  var xml = new XMLSerializer().serializeToString(svg);
  var img = new Image();
  img.onload = function () {
    var c = document.createElement("canvas");
    c.width = img.width * 3; c.height = img.height * 3;
    var ctx = c.getContext("2d");
    ctx.fillStyle = s.cfg.background;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    var a = document.createElement("a");
    a.download = "barcode-" + s.fmt.toLowerCase() + "-" + s.value + ".png";
    a.href = c.toDataURL("image/png");
    document.body.appendChild(a); a.click(); a.remove();
  };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
}

document.getElementById("optWidth").addEventListener("input", function (e) {
  document.getElementById("wVal").textContent = e.target.value;
});
document.getElementById("optHeight").addEventListener("input", function (e) {
  document.getElementById("hVal").textContent = e.target.value;
});

renderFormats();
