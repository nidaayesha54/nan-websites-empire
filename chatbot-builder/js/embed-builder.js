/* ChatbotBuilder embed engine — pure JS, no DOM. Shared by the live demo
   and embedded (via toString) into exported bot widgets, so both behave identically. */

function normalizeText(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/* Match a user message against rules.
   Each rule: { triggers: "comma, separated, keywords", response: "..." }
   Score = how many trigger keywords appear in the message. Best score wins.
   Returns fallback when nothing matches. */
function matchResponse(message, rules, fallback) {
  var msg = ' ' + normalizeText(message) + ' ';
  var best = null, bestScore = 0;
  for (var i = 0; i < rules.length; i++) {
    var r = rules[i];
    if (!r || !r.response) continue;
    var keys = (r.triggers || '').split(',').map(function (k) { return normalizeText(k); }).filter(Boolean);
    var score = 0;
    for (var j = 0; j < keys.length; j++) {
      if (msg.indexOf(' ' + keys[j] + ' ') !== -1 || msg.indexOf(keys[j]) !== -1) score++;
    }
    if (score > bestScore) { bestScore = score; best = r; }
  }
  if (best) return best.response;
  return fallback || "I'm not sure I understand. Could you rephrase that?";
}

/* Build a fully working, self-contained embeddable chatbot widget.
   Paste the returned code into any website's HTML and the bot just works. */
function buildEmbedCode(botName, rules, fallback) {
  var safeRules = JSON.stringify(rules || []);
  var safeName = JSON.stringify(botName || 'Chatbot');
  var safeFallback = JSON.stringify(fallback || "I'm not sure I understand. Could you rephrase that?");
  var matchSrc = matchResponse.toString();
  var normSrc = normalizeText.toString();

  var code = '(function(){\n' +
    'var BOT_NAME=' + safeName + ';\n' +
    'var RULES=' + safeRules + ';\n' +
    'var FALLBACK=' + safeFallback + ';\n' +
    normSrc + '\n' +
    matchSrc + '\n' +
    'var css="#cbb-launcher{position:fixed;bottom:22px;right:22px;width:60px;height:60px;border-radius:50%;background:#1d6ff2;color:#fff;border:none;font-size:26px;cursor:pointer;z-index:99998;box-shadow:0 6px 18px rgba(0,0,0,.25)}"\n' +
    '+ "#cbb-win{display:none;position:fixed;bottom:94px;right:22px;width:340px;max-width:92vw;height:440px;background:#fff;border-radius:14px;overflow:hidden;z-index:99999;box-shadow:0 12px 40px rgba(0,0,0,.25);flex-direction:column;font-family:Arial,sans-serif}"\n' +
    '+ "#cbb-win.open{display:flex}"\n' +
    '+ "#cbb-head{background:#1d6ff2;color:#fff;padding:12px 16px;font-weight:bold}"\n' +
    '+ "#cbb-body{flex:1;overflow-y:auto;padding:14px;background:#f4f8ff}"\n' +
    '+ ".cbb-m{max-width:80%;padding:8px 12px;border-radius:14px;margin:6px 0;clear:both;font-size:14px;line-height:1.45}"\n' +
    '+ ".cbb-b{background:#fff;border:1px solid #dbe7fb;float:left;border-bottom-left-radius:4px}"\n' +
    '+ ".cbb-u{background:#1d6ff2;color:#fff;float:right;border-bottom-right-radius:4px}"\n' +
    '+ "#cbb-in{display:flex;border-top:1px solid #e3ecfa}"\n' +
    '+ "#cbb-in input{flex:1;border:none;padding:12px;outline:none;font-size:14px}"\n' +
    '+ "#cbb-in button{background:#1d6ff2;color:#fff;border:none;padding:0 18px;cursor:pointer;font-weight:bold}";\n' +
    'var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);\n' +
    'var btn=document.createElement("button");btn.id="cbb-launcher";btn.innerHTML="&#128172;";btn.setAttribute("aria-label","Open chat");document.body.appendChild(btn);\n' +
    'var win=document.createElement("div");win.id="cbb-win";\n' +
    'win.innerHTML=\'<div id="cbb-head">\'+BOT_NAME.replace(/</g,"&lt;")+\'</div><div id="cbb-body"></div><div id="cbb-in"><input type="text" placeholder="Type a message..." aria-label="Type a message"><button>Send</button></div>\';\n' +
    'document.body.appendChild(win);\n' +
    'var body=win.querySelector("#cbb-body"),input=win.querySelector("input"),sendBtn=win.querySelector("button");\n' +
    'function addMsg(t,who){var d=document.createElement("div");d.className="cbb-m "+(who==="u"?"cbb-u":"cbb-b");d.textContent=t;body.appendChild(d);body.scrollTop=body.scrollHeight;}\n' +
    'btn.onclick=function(){win.classList.toggle("open");if(win.classList.contains("open")&&!body.children.length){setTimeout(function(){addMsg("Hi! I\'m "+BOT_NAME+". How can I help you today?","b");},400);}};\n' +
    'function reply(){var v=input.value.trim();if(!v)return;addMsg(v,"u");input.value="";var tp=document.createElement("div");tp.className="cbb-m cbb-b";tp.textContent="Typing...";body.appendChild(tp);body.scrollTop=body.scrollHeight;setTimeout(function(){body.removeChild(tp);addMsg(matchResponse(v,RULES,FALLBACK),"b");},600);}\n' +
    'sendBtn.onclick=reply;input.addEventListener("keydown",function(e){if(e.key==="Enter")reply();});\n' +
    '})();';
  return code;
}

/* Export for Node testing (ignored in browsers) */
try { if (typeof module !== 'undefined') { module.exports = { matchResponse: matchResponse, buildEmbedCode: buildEmbedCode, normalizeText: normalizeText }; } } catch (e) {}
