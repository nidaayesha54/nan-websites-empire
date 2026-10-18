/* nan-chat-widget.js — NAN Marketing Agency website chat widget
 * Embed: <script src="https://nan-chat-widget-demo.surge.sh/nan-chat-widget.js"></script>
 * Optional config BEFORE the script tag:
 *   <script>window.NANChatConfig={businessName:'NAN Marketing Agency',whatsappNumber:'923177415702',accent:'#14B8A6',endpoint:null};</script>
 * Vanilla JS, zero dependencies, shadow-DOM isolated. <30KB.
 */
(function () {
  'use strict';
  var CFG = Object.assign({
    businessName: 'NAN Marketing Agency',
    whatsappNumber: '923177415702',
    navy: '#0A1628',
    accent: '#14B8A6',
    welcomeDelay: 6000,
    endpoint: null // optional: POST leads JSON here when set
  }, window.NANChatConfig || {});

  /* ---------- language detect (Roman Urdu <-> English) ---------- */
  var URDU_HINTS = ['salam', 'assalam', 'kya', 'kia', 'hai', 'haan', 'han', 'nahi', 'ni',
    'aap', 'ap', 'mujhe', 'mujhy', 'chahiye', 'chaeye', 'kaise', 'kese',
    'kitna', 'kitne', 'kahan', 'kab', 'kyun', 'kaam', 'paisa', 'paisay',
    'bata', 'batayen', 'batao', 'dekho', 'dikhao', 'shukriya',
    'acha', 'theek', 'sahi', 'wala', 'wali', 'liye', 'aur', 'mein', 'par',
    'ko', 'se', 'ka', 'ki', 'ke', 'ho', 'hain', 'kar', 'karo', 'banwana'];
  function detectLang(text) {
    var t = ' ' + (text || '').toLowerCase() + ' ';
    if (/\b(salam|assalam|salaam|aoa)\b/.test(t)) return 'ru';
    var hits = 0;
    for (var i = 0; i < URDU_HINTS.length; i++) {
      if (t.indexOf(URDU_HINTS[i]) !== -1) hits++;
      if (hits >= 2) return 'ru';
    }
    return 'en';
  }

  /* ---------- reply bank ---------- */
  var R = {
    welcome: {
      ru: "Assalam-o-Alaikum! \uD83D\uDC4B " + CFG.businessName + " me khush aamdeed! Aap kis business ke liye services chahte hain?",
      en: "Hello! \uD83D\uDC4B Welcome to " + CFG.businessName + "! Which business do you need our services for?"
    },
    chip_video: {
      ru: "\uD83C\uDFAC AI Video Ads — aapke business ke liye scroll-stopping ads jo customers laate hain! Price kaam par depend karta hai (custom quote).",
      en: "\uD83C\uDFAC AI Video Ads — scroll-stopping ads that bring customers! Pricing depends on the project (custom quote)."
    },
    chip_social: {
      ru: "\uD83D\uDCF1 Social Media Management — posts, reels aur full page handling, sab hum sambhalte hain! Packages aapki zaroorat ke hisaab se.",
      en: "\uD83D\uDCF1 Social Media Management — posts, reels and full page handling, we take care of it all! Packages tailored to your needs."
    },
    chip_app: {
      ru: "\uD83D\uDCBB Custom Mobile Apps — aapke business ke liye professional app sirf $2,000 me! Offline + online, dono chalta hai.",
      en: "\uD83D\uDCBB Custom Mobile Apps — a professional app for your business at just $2,000! Works offline + online."
    },
    chip_bot: {
      ru: "\uD83E\uDD16 WhatsApp Chatbots — $500\u2013$2,000 me 24/7 auto-replies, aapke clients ka jawab kabhi miss nahi hoga!",
      en: "\uD83E\uDD16 WhatsApp Chatbots — $500\u2013$2,000 for 24/7 auto-replies, never miss a client message again!"
    },
    chip_other: {
      ru: "Zaroor! \uD83D\uDE0A Batayen aapko exactly kya chahiye?",
      en: "Of course! \uD83D\uDE0A Tell me exactly what you need?"
    },
    ask_contact: {
      ru: "Apna naam aur WhatsApp number likh dein, Ayesha khud rabta karengi \uD83D\uDE42",
      en: "Please share your name and WhatsApp number — Ayesha will contact you personally \uD83D\uDE42"
    },
    lead_saved: {
      ru: "Shukriya! \u2705 Aapki detail save ho gayi — Ayesha jald rabta karengi \uD83D\uDE42",
      en: "Thank you! \u2705 Your details are saved — Ayesha will reach out soon \uD83D\uDE42"
    },
    price: {
      ru: "Price kaam par depend karta hai \uD83D\uDCB0 — custom apps $2,000 se, WhatsApp bots $500\u2013$2,000, video/social ka custom quote. Detail batayen, exact quote de dungi \uD83D\uDE42",
      en: "Pricing depends on the project \uD83D\uDCB0 — custom apps from $2,000, WhatsApp bots $500\u2013$2,000, custom quote for video/social. Share details for an exact quote \uD83D\uDE42"
    },
    portfolio: {
      ru: "Hamara kaam yahan dekhen \uD83D\uDC40\n\uD83D\uDC49 nidaayesha.com",
      en: "Check out our work here \uD83D\uDC40\n\uD83D\uDC49 nidaayesha.com"
    },
    timing: {
      ru: "Aam tor par 3\u20137 din me delivery \u23F1\uFE0F (kaam par depend karta hai)",
      en: "Usually delivered in 3\u20137 days \u23F1\uFE0F (depends on the project)"
    },
    contact: {
      ru: "Aap direct WhatsApp par bhi rabta kar sakte hain \uD83D\uDCDE\n\uD83D\uDC49 https://wa.me/" + CFG.whatsappNumber,
      en: "You can also reach us directly on WhatsApp \uD83D\uDCDE\n\uD83D\uDC49 https://wa.me/" + CFG.whatsappNumber
    },
    fallback: {
      ru: "Ye Ayesha behtar bata sakti hain — apna naam aur number chhor dein, wo khud call karengi \uD83D\uDE42",
      en: "Ayesha can answer this best — leave your name and number, she'll call you herself \uD83D\uDE42"
    }
  };
  var ROUTES = [
    { key: 'price', words: ['price', 'cost', 'paisa', 'paisay', 'kitna', 'kitne', 'rate', 'charge', 'fees', 'kimat', 'qimat', 'budget', 'pese'] },
    { key: 'portfolio', words: ['portfolio', 'dikhao', 'dekho', 'samples', 'sample', 'work', 'example', 'kaam dekha', 'kaam dikhao'] },
    { key: 'timing', words: ['kitna time', 'how long', 'delivery', 'kab tak', 'time lagega', 'duration', 'der'] },
    { key: 'contact', words: ['number', 'whatsapp', 'contact', 'rabta', 'call karo', 'phone'] }
  ];
  function route(text) {
    var t = (text || '').toLowerCase();
    for (var i = 0; i < ROUTES.length; i++) {
      for (var j = 0; j < ROUTES[i].words.length; j++) {
        if (t.indexOf(ROUTES[i].words[j]) !== -1) return ROUTES[i].key;
      }
    }
    return null;
  }

  /* ---------- leads ---------- */
  function getLeads() {
    try { return JSON.parse(localStorage.getItem('nan_chat_leads') || '[]'); } catch (e) { return []; }
  }
  function saveLead(entry) {
    try {
      var leads = getLeads(); leads.push(entry);
      localStorage.setItem('nan_chat_leads', JSON.stringify(leads));
    } catch (e) { /* never crash */ }
    if (CFG.endpoint) {
      try {
        fetch(CFG.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry) });
      } catch (e) { /* fire-and-forget */ }
    }
  }

  /* ---------- widget UI ---------- */
  function init() {
    if (document.getElementById('nan-chat-root')) return; // already mounted
    var host = document.createElement('div');
    host.id = 'nan-chat-root';
    host.style.cssText = 'position:fixed;bottom:0;right:0;z-index:2147483647;pointer-events:none;';
    document.body.appendChild(host);
    var shadow = host.attachShadow({ mode: 'open' });

    var css = ''
      + '.ncw{pointer-events:auto;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;}'
      + '.ncw-bubble{position:fixed;bottom:22px;right:22px;width:60px;height:60px;border-radius:50%;background:' + CFG.navy + ';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 4px 18px rgba(0,0,0,.35);}'
      + '.ncw-bubble::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:3px solid ' + CFG.accent + ';opacity:0;animation:ncw-pulse 2s infinite;}'
      + '@keyframes ncw-pulse{0%{transform:scale(.85);opacity:.9}70%{transform:scale(1.15);opacity:0}100%{opacity:0}}'
      + '.ncw-teaser{position:fixed;bottom:94px;right:22px;max-width:270px;background:#fff;color:#111;border-radius:14px 14px 4px 14px;padding:12px 36px 12px 14px;font-size:14px;line-height:1.45;box-shadow:0 6px 24px rgba(0,0,0,.25);cursor:pointer;transform:translateY(12px);opacity:0;transition:all .35s ease;}'
      + '.ncw-teaser.show{transform:translateY(0);opacity:1;}'
      + '.ncw-teaser-x{position:absolute;top:4px;right:8px;border:none;background:none;font-size:16px;cursor:pointer;color:#999;}'
      + '.ncw-panel{position:fixed;bottom:94px;right:22px;width:360px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 130px);background:#fff;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.3);display:none;flex-direction:column;overflow:hidden;}'
      + '.ncw-panel.open{display:flex;}'
      + '.ncw-head{background:' + CFG.navy + ';color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px;}'
      + '.ncw-avatar{width:38px;height:38px;border-radius:50%;background:' + CFG.accent + ';display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}'
      + '.ncw-title{font-size:15px;font-weight:700;}'
      + '.ncw-online{font-size:12px;color:#7ee2a8;display:flex;align-items:center;gap:5px;}'
      + '.ncw-online::before{content:"";width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;}'
      + '.ncw-x{margin-left:auto;border:none;background:none;color:#fff;font-size:20px;cursor:pointer;}'
      + '.ncw-msgs{flex:1;overflow-y:auto;padding:14px;background:#f1f5f9;display:flex;flex-direction:column;gap:10px;}'
      + '.ncw-msg{max-width:82%;padding:10px 13px;border-radius:14px;font-size:14px;line-height:1.5;white-space:pre-line;word-wrap:break-word;}'
      + '.ncw-bot{background:#fff;color:#111;border-radius:14px 14px 14px 4px;align-self:flex-start;box-shadow:0 1px 3px rgba(0,0,0,.1);}'
      + '.ncw-user{background:' + CFG.navy + ';color:#fff;border-radius:14px 14px 4px 14px;align-self:flex-end;}'
      + '.ncw-typing{align-self:flex-start;background:#fff;padding:12px 16px;border-radius:14px;}'
      + '.ncw-typing span{width:7px;height:7px;background:#94a3b8;border-radius:50%;display:inline-block;margin-right:4px;animation:ncw-blink 1.2s infinite;}'
      + '.ncw-typing span:nth-child(2){animation-delay:.2s}.ncw-typing span:nth-child(3){animation-delay:.4s}'
      + '@keyframes ncw-blink{0%,60%,100%{opacity:.25}30%{opacity:1}}'
      + '.ncw-chips{display:flex;gap:8px;padding:10px 12px;overflow-x:auto;background:#fff;border-top:1px solid #e2e8f0;}'
      + '.ncw-chip{flex-shrink:0;border:1.5px solid ' + CFG.accent + ';color:' + CFG.navy + ';background:#fff;border-radius:20px;padding:7px 13px;font-size:13px;cursor:pointer;white-space:nowrap;}'
      + '.ncw-chip:hover{background:' + CFG.accent + ';color:#fff;}'
      + '.ncw-input{display:flex;gap:8px;padding:10px 12px;background:#fff;border-top:1px solid #e2e8f0;}'
      + '.ncw-input input{flex:1;border:1.5px solid #cbd5e1;border-radius:20px;padding:9px 14px;font-size:14px;outline:none;}'
      + '.ncw-input input:focus{border-color:' + CFG.accent + ';}'
      + '.ncw-send{border:none;background:' + CFG.accent + ';color:#fff;width:40px;height:40px;border-radius:50%;cursor:pointer;font-size:17px;flex-shrink:0;}'
      + '.ncw-foot{text-align:center;font-size:10px;color:#94a3b8;padding:5px;background:#fff;}';

    shadow.innerHTML = '<style>' + css + '</style>'
      + '<div class="ncw">'
      + '<div class="ncw-teaser" id="ncwTeaser"><button class="ncw-teaser-x" id="ncwTeaserX">\u00D7</button><span id="ncwTeaserText"></span></div>'
      + '<div class="ncw-panel" id="ncwPanel">'
      + '<div class="ncw-head"><div class="ncw-avatar">\uD83D\uDCAC</div>'
      + '<div><div class="ncw-title">' + esc(CFG.businessName) + '</div><div class="ncw-online">Online — replies instantly</div></div>'
      + '<button class="ncw-x" id="ncwClose">\u00D7</button></div>'
      + '<div class="ncw-msgs" id="ncwMsgs"></div>'
      + '<div class="ncw-chips" id="ncwChips"></div>'
      + '<div class="ncw-input"><input id="ncwText" type="text" placeholder="Type a message..." maxlength="500" />'
      + '<button class="ncw-send" id="ncwSend">\u27A4</button></div>'
      + '<div class="ncw-foot">Powered by NAN</div>'
      + '</div>'
      + '<button class="ncw-bubble" id="ncwBubble" aria-label="Chat">\uD83D\uDCAC</button>'
      + '</div>';

    var $ = function (id) { return shadow.getElementById(id); };
    var msgsEl = $('ncwMsgs'), chipsEl = $('ncwChips'), panel = $('ncwPanel'),
        teaser = $('ncwTeaser'), bubble = $('ncwBubble'), input = $('ncwText');
    var lang = 'ru', greeted = false, awaitingContact = false;

    function esc(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
    function scrollDown() { msgsEl.scrollTop = msgsEl.scrollHeight; }
    function addMsg(text, who) {
      var d = document.createElement('div');
      d.className = 'ncw-msg ' + (who === 'user' ? 'ncw-user' : 'ncw-bot');
      d.textContent = text; // textContent = XSS-safe
      msgsEl.appendChild(d); scrollDown();
    }
    function typing(on) {
      var t = shadow.getElementById('ncwTyping');
      if (on && !t) {
        t = document.createElement('div');
        t.id = 'ncwTyping'; t.className = 'ncw-typing';
        t.innerHTML = '<span></span><span></span><span></span>';
        msgsEl.appendChild(t); scrollDown();
      } else if (!on && t) { t.remove(); }
    }
    function botSay(text) {
      typing(true);
      setTimeout(function () { typing(false); addMsg(text, 'bot'); }, 700 + Math.random() * 500);
    }
    function showChips() {
      var chips = [
        ['\uD83C\uDFAC Video Ad', 'chip_video'],
        ['\uD83D\uDCF1 Social Media', 'chip_social'],
        ['\uD83D\uDCBB Mobile App', 'chip_app'],
        ['\uD83E\uDD16 WhatsApp Bot', 'chip_bot'],
        ['\uD83D\uDCAC Kuch aur', 'chip_other']
      ];
      chipsEl.innerHTML = '';
      chips.forEach(function (c) {
        var b = document.createElement('button');
        b.className = 'ncw-chip'; b.textContent = c[0];
        b.onclick = function () { onChip(c[0], c[1]); };
        chipsEl.appendChild(b);
      });
    }
    function openChat() {
      panel.classList.add('open'); teaser.classList.remove('show');
      if (!greeted) {
        greeted = true;
        botSay(R.welcome[lang]);
        setTimeout(showChips, 1400);
      }
    }
    function onChip(label, key) {
      addMsg(label, 'user');
      lang = detectLang(label);
      botSay(R[key][lang]);
      setTimeout(function () { botSay(R.ask_contact[lang]); awaitingContact = true; }, 2200);
    }
    function handleText(raw) {
      var text = (raw || '').trim();
      if (!text) return;
      addMsg(text, 'user');
      var l = detectLang(text); lang = l;

      // contact capture mode
      if (awaitingContact) {
        var digits = text.replace(/\D/g, '');
        saveLead({ name: text.slice(0, 80), phone_guess: digits.length >= 7 ? digits : '', raw: text, ts: new Date().toISOString(), page: location.href });
        awaitingContact = false;
        botSay(R.lead_saved[l]);
        setTimeout(function () {
          botSay((l === 'ru' ? 'Ya foran WhatsApp par baat karein \uD83D\uDCDE\n\uD83D\uDC49 https://wa.me/' : 'Or chat instantly on WhatsApp \uD83D\uDCDE\n\uD83D\uDC49 https://wa.me/') + CFG.whatsappNumber);
        }, 2400);
        return;
      }
      // greeting
      if (/^(hi+|hello+|hey+|salam|assalam|salaam|aoa)[\s!.,]*$/i.test(text)) {
        botSay(R.welcome[l]); setTimeout(showChips, 1400); return;
      }
      // keyword routes
      var key = route(text);
      if (key && R[key]) {
        botSay(R[key][l]);
        if (key === 'price' || key === 'contact') {
          setTimeout(function () { botSay(R.ask_contact[l]); awaitingContact = true; }, 2200);
        }
        return;
      }
      // fallback → human handoff + ask contact
      saveLead({ type: 'NEEDS-HUMAN', raw: text.slice(0, 200), ts: new Date().toISOString(), page: location.href });
      botSay(R.fallback[l]);
      setTimeout(function () { awaitingContact = true; }, 1500);
    }

    // events
    bubble.onclick = openChat;
    teaser.onclick = function (e) {
      if (e.target.id === 'ncwTeaserX') return;
      openChat();
    };
    $('ncwTeaserX').onclick = function (e) { e.stopPropagation(); teaser.classList.remove('show'); };
    $('ncwClose').onclick = function () { panel.classList.remove('open'); };
    $('ncwSend').onclick = function () { handleText(input.value); input.value = ''; };
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { handleText(input.value); input.value = ''; }
    });

    // proactive welcome (once per session)
    var seen = false;
    try { seen = sessionStorage.getItem('nan_chat_welcomed') === '1'; } catch (e) {}
    if (!seen) {
      setTimeout(function () {
        if (panel.classList.contains('open')) return;
        $('ncwTeaserText').textContent = R.welcome[lang];
        teaser.classList.add('show');
        try { sessionStorage.setItem('nan_chat_welcomed', '1'); } catch (e) {}
        setTimeout(function () { teaser.classList.remove('show'); }, 12000);
      }, CFG.welcomeDelay);
    }

    // public API
    window.NANChat = {
      open: openChat,
      config: CFG,
      getLeads: getLeads,
      version: '1.0.0'
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
