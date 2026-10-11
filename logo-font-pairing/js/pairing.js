/* LogoFontPairing — font pairing tool logic (vanilla JS) */
(function () {
  "use strict";

  var STYLES = {
    "bold-sans": {
      name: "Bold Sans",
      desc: "Strong, confident, modern",
      headline: { name: "Anton", family: "'Anton', Impact, sans-serif" },
      pairings: [
        { name: "Inter", family: "'Inter', sans-serif", why: "A neutral workhorse with excellent legibility — lets the bold headline do all the talking." },
        { name: "Roboto", family: "'Roboto', sans-serif", why: "Friendly geometric curves soften Anton's aggression while staying thoroughly modern." },
        { name: "Open Sans", family: "'Open Sans', sans-serif", why: "Wide, open letterforms keep long taglines readable under a heavy display headline." }
      ]
    },
    "elegant-serif": {
      name: "Elegant Serif",
      desc: "Refined, luxurious, timeless",
      headline: { name: "Playfair Display", family: "'Playfair Display', Georgia, serif" },
      pairings: [
        { name: "Lato", family: "'Lato', sans-serif", why: "Warm humanist sans that echoes Playfair's elegance without competing with its high-contrast strokes." },
        { name: "Source Sans 3", family: "'Source Sans 3', sans-serif", why: "Adobe's clean grotesque gives editorial polish — perfect for luxury taglines and body copy." },
        { name: "Nunito Sans", family: "'Nunito Sans', sans-serif", why: "Rounded terminals add a touch of approachability to formal serif headlines." }
      ]
    },
    "modern-geometric": {
      name: "Modern Geometric",
      desc: "Clean, techy, minimal",
      headline: { name: "Montserrat", family: "'Montserrat', sans-serif" },
      pairings: [
        { name: "Open Sans", family: "'Open Sans', sans-serif", why: "Shares Montserrat's humanist warmth but stays quieter — ideal for UI and paragraphs." },
        { name: "Raleway", family: "'Raleway', sans-serif", why: "Its elegant thin weights contrast beautifully with Montserrat's bold headline cuts." },
        { name: "Work Sans", family: "'Work Sans', sans-serif", why: "Optimized for screens; a practical partner for digital-first brands." }
      ]
    },
    "playful": {
      name: "Playful Display",
      desc: "Fun, friendly, quirky",
      headline: { name: "Fredoka", family: "'Fredoka', 'Comic Sans MS', sans-serif" },
      pairings: [
        { name: "Nunito", family: "'Nunito', sans-serif", why: "Rounded and cheerful — matches Fredoka's friendliness while staying highly readable." },
        { name: "Quicksand", family: "'Quicksand', sans-serif", why: "Geometric roundness keeps the playful mood consistent across headlines and body." },
        { name: "Baloo 2", family: "'Baloo 2', sans-serif", why: "Bouncy and bold for sub-heads that need to keep up with a loud display font." }
      ]
    },
    "vintage": {
      name: "Vintage Display",
      desc: "Retro, crafted, nostalgic",
      headline: { name: "Abril Fatface", family: "'Abril Fatface', Georgia, serif" },
      pairings: [
        { name: "Lora", family: "'Lora', Georgia, serif", why: "A calligraphic serif that shares Abril's old-style soul — great for heritage brands." },
        { name: "Libre Franklin", family: "'Libre Franklin', sans-serif", why: "Classic American grotesque adds structure and contrast to the flamboyant display face." },
        { name: "Josefin Sans", family: "'Josefin Sans', sans-serif", why: "Art-deco geometry completes the vintage poster look for taglines." }
      ]
    },
    "script": {
      name: "Handwritten Script",
      desc: "Personal, artistic, signature",
      headline: { name: "Pacifico", family: "'Pacifico', cursive" },
      pairings: [
        { name: "Poppins", family: "'Poppins', sans-serif", why: "Clean geometric sans balances the script's informality with professional structure." },
        { name: "Montserrat", family: "'Montserrat', sans-serif", why: "All-caps Montserrat taglines under a script logo is a proven, timeless combination." },
        { name: "Nunito Sans", family: "'Nunito Sans', sans-serif", why: "Soft and legible for longer text where the script would be unreadable." }
      ]
    }
  };

  var DEFAULT_HEADLINE = "Your Brand Name";
  var DEFAULT_BODY = "A short tagline or description goes here. Good body fonts stay quiet and readable so the headline can shine.";

  var styleGrid = document.getElementById("styleGrid");
  var pairSection = document.getElementById("pairSection");
  var pairRow = document.getElementById("pairRow");
  var pairMeta = document.getElementById("pairMeta");
  var prevHead = document.getElementById("prevHead");
  var prevBody = document.getElementById("prevBody");
  var cssBtn = document.getElementById("copyCss");
  var copyMsg = document.getElementById("copyMsg");
  var resetBtn = document.getElementById("resetText");

  var currentStyle = null;
  var currentPair = null;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  // Render the 6 headline-style cards
  Object.keys(STYLES).forEach(function (key) {
    var s = STYLES[key];
    var card = el("div", "style-card");
    card.setAttribute("data-key", key);
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.appendChild(el("span", "swatch", '<span style="font-family:' + s.headline.family + ';font-size:2rem">Ag</span>'));
    card.appendChild(el("span", "sname", s.name));
    card.appendChild(el("span", "sdesc", s.desc));
    function choose() { selectStyle(key); }
    card.addEventListener("click", choose);
    card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(); } });
    styleGrid.appendChild(card);
  });

  function selectStyle(key) {
    currentStyle = STYLES[key];
    var cards = styleGrid.querySelectorAll(".style-card");
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.toggle("sel", cards[i].getAttribute("data-key") === key);
    }
    pairSection.style.display = "block";
    pairRow.innerHTML = "";
    currentStyle.pairings.forEach(function (p, idx) {
      var b = el("button", "pair-btn" + (idx === 0 ? " sel" : ""), '<span style="font-family:' + p.family + '">' + p.name + "</span>");
      b.setAttribute("type", "button");
      b.addEventListener("click", function () { selectPair(idx); });
      pairRow.appendChild(b);
    });
    selectPair(0);
    pairSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function selectPair(idx) {
    currentPair = currentStyle.pairings[idx];
    var btns = pairRow.querySelectorAll(".pair-btn");
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle("sel", i === idx);
    }
    prevHead.style.fontFamily = currentStyle.headline.family;
    prevBody.style.fontFamily = currentPair.family;
    pairMeta.innerHTML = "<strong>Headline:</strong> " + currentStyle.headline.name +
      " &nbsp;·&nbsp; <strong>Body:</strong> " + currentPair.name +
      "<br><em>Why it works:</em> " + currentPair.why;
    copyMsg.textContent = "";
  }

  function getCss() {
    return "/* " + currentStyle.name + " + " + currentPair.name + " — via LogoFontPairing */\n" +
      ".logo-headline {\n  font-family: " + currentStyle.headline.family + ";\n}\n\n" +
      ".logo-body {\n  font-family: " + currentPair.family + ";\n}";
  }

  cssBtn.addEventListener("click", function () {
    if (!currentStyle) return;
    var css = getCss();
    function done() { copyMsg.textContent = "CSS copied — paste it into your stylesheet."; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(css).then(done, function () { fallbackCopy(css); done(); });
    } else {
      fallbackCopy(css); done();
    }
  });

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* clipboard unavailable */ }
    document.body.removeChild(ta);
  }

  resetBtn.addEventListener("click", function () {
    prevHead.textContent = DEFAULT_HEADLINE;
    prevBody.textContent = DEFAULT_BODY;
  });

  prevHead.textContent = DEFAULT_HEADLINE;
  prevBody.textContent = DEFAULT_BODY;
})();
