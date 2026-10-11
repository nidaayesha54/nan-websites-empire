/* Rule-based chatbot builder UI. Depends on js/embed-builder.js (matchResponse, buildEmbedCode). */
(function () {
  var rulesWrap, chatBody, chatInput, codeOut;

  function ruleRow(triggers, response) {
    var div = document.createElement('div');
    div.className = 'rule-row';
    div.innerHTML =
      '<button type="button" class="remove" aria-label="Remove rule">&times;</button>' +
      '<label>When user says (comma-separated keywords)</label>' +
      '<input type="text" class="r-triggers" placeholder="e.g. price, cost, how much" value="">' +
      '<label>Bot replies</label>' +
      '<textarea class="r-response" placeholder="e.g. Our plans start at $19/month."></textarea>';
    if (triggers) div.querySelector('.r-triggers').value = triggers;
    if (response) div.querySelector('.r-response').value = response;
    div.querySelector('.remove').addEventListener('click', function () { div.remove(); });
    return div;
  }

  function collectRules() {
    var out = [];
    rulesWrap.querySelectorAll('.rule-row').forEach(function (row) {
      var t = row.querySelector('.r-triggers').value.trim();
      var r = row.querySelector('.r-response').value.trim();
      if (t && r) out.push({ triggers: t, response: r });
    });
    return out;
  }

  function addMsg(text, who) {
    var d = document.createElement('div');
    d.className = 'msg ' + who;
    d.textContent = text;
    chatBody.appendChild(d);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function sendChat() {
    var v = chatInput.value.trim();
    if (!v) return;
    addMsg(v, 'user');
    chatInput.value = '';
    var tp = document.createElement('div');
    tp.className = 'msg bot typing';
    tp.textContent = 'Typing...';
    chatBody.appendChild(tp);
    chatBody.scrollTop = chatBody.scrollHeight;
    var rules = collectRules();
    var fb = document.getElementById('fallback').value.trim();
    setTimeout(function () {
      chatBody.removeChild(tp);
      addMsg(matchResponse(v, rules, fb), 'bot');
    }, 600);
  }

  function generateCode() {
    var name = document.getElementById('botname').value.trim() || 'My Chatbot';
    var fb = document.getElementById('fallback').value.trim();
    var rules = collectRules();
    if (!rules.length) {
      codeOut.textContent = '// Add at least one Q&A rule above, then click Generate again.';
      return;
    }
    var code = buildEmbedCode(name, rules, fb);
    codeOut.textContent = '<!-- Paste this before </body> on any website -->\n<script>\n' + code + '\n<\/script>';
  }

  function copyCode() {
    var t = document.createElement('textarea');
    t.value = codeOut.textContent;
    document.body.appendChild(t);
    t.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(t);
    var b = document.getElementById('copybtn');
    b.textContent = 'Copied!';
    setTimeout(function () { b.textContent = 'Copy Code'; }, 1500);
  }

  document.addEventListener('DOMContentLoaded', function () {
    rulesWrap = document.getElementById('rules');
    chatBody = document.getElementById('demo-body');
    chatInput = document.getElementById('demo-input');
    codeOut = document.getElementById('embed-code');

    // Starter rules so the demo works instantly
    rulesWrap.appendChild(ruleRow('hello, hi, hey', 'Hello! Welcome. Ask me about pricing, features, or support.'));
    rulesWrap.appendChild(ruleRow('price, cost, how much, pricing', 'Our Starter plan is free, Pro is $19/month, and Business is $49/month.'));
    rulesWrap.appendChild(ruleRow('refund, money back, cancel', 'You can cancel anytime. We offer a 30-day money-back guarantee, no questions asked.'));

    document.getElementById('addrule').addEventListener('click', function () {
      rulesWrap.appendChild(ruleRow('', ''));
    });
    document.getElementById('demosend').addEventListener('click', sendChat);
    chatInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') sendChat(); });
    document.getElementById('gencode').addEventListener('click', generateCode);
    document.getElementById('copybtn').addEventListener('click', copyCode);

    setTimeout(function () { addMsg("Hi! I'm your demo bot. Try asking about pricing.", 'bot'); }, 500);
  });
})();
