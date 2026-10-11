/* Chat demo page — two pre-built bots with realistic scripted flows. */
(function () {
  var body, input, current = 'support';

  var BOTS = {
    support: {
      name: 'ShopHelp — Customer Support',
      greeting: "Hi! I'm ShopHelp. I can help with: 1) Order status  2) Returns  3) Shipping info. Just type a number or ask!",
      reply: function (msg) {
        var m = msg.toLowerCase();
        if (/\b(1|order|status|track)\b/.test(m)) return "To track your order, I need your order number (it starts with #). What's your order number?";
        if (/#\w+/.test(msg)) return "Thanks! Order " + msg.match(/#\w+/)[0] + " is out for delivery and should arrive within 2 business days. Anything else?";
        if (/\b(2|return|refund|exchange)\b/.test(m)) return "No problem! You have 30 days to return any item. Would you like me to email you a prepaid return label? (yes/no)";
        if (/\byes\b/.test(m)) return "Done! I've sent the return label to your email. Drop the package at any carrier point.";
        if (/\b(3|ship|delivery|long)\b/.test(m)) return "Standard shipping takes 3-5 business days and is free over $50. Express (1-2 days) is $9.99.";
        if (/\b(human|agent|person|real)\b/.test(m)) return "Connecting you to a human agent... average wait time is 2 minutes. Meanwhile, is there anything else I can help with?";
        if (/\b(hi|hello|hey)\b/.test(m)) return "Hello! I can help with: 1) Order status  2) Returns  3) Shipping info.";
        if (/\b(thank|thanks)\b/.test(m)) return "You're very welcome! Anything else I can do for you today?";
        return "I can help with order status, returns, or shipping info — just type 1, 2, or 3, or ask me directly!";
      }
    },
    leadgen: {
      name: 'LeadBot — Lead Capture',
      greeting: "Hey! I'm LeadBot. Want a free quote? First, what's your name?",
      step: 0,
      data: {},
      reply: function (msg) {
        var m = msg.trim();
        if (this.step === 0) { this.data.name = m; this.step = 1; return "Nice to meet you, " + m.split(' ')[0] + "! What's the best email to reach you?"; }
        if (this.step === 1) {
          if (!/^\S+@\S+\.\S+$/.test(m)) return "Hmm, that doesn't look like a valid email. Could you double-check it?";
          this.data.email = m; this.step = 2;
          return "Thanks! What service are you interested in? (web design / marketing / chatbots)";
        }
        if (this.step === 2) { this.data.interest = m; this.step = 3;
          return "Great choice! Our team will send a tailored quote to " + this.data.email + " within 24 hours. Anything else, " + this.data.name.split(' ')[0] + "? (type 'restart' to start over)";
        }
        if (/\brestart\b/.test(m.toLowerCase())) { this.step = 0; this.data = {}; return "Starting over — what's your name?"; }
        return "Got it! We've saved your details. Type 'restart' to begin again.";
      }
    }
  };

  function addMsg(text, who) {
    var d = document.createElement('div');
    d.className = 'msg ' + who;
    d.textContent = text;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  }

  function botReply() {
    var bot = BOTS[current];
    var tp = document.createElement('div');
    tp.className = 'msg bot typing';
    tp.textContent = 'Typing...';
    body.appendChild(tp);
    body.scrollTop = body.scrollHeight;
    setTimeout(function () {
      body.removeChild(tp);
      addMsg(bot.reply(lastUser), 'bot');
    }, 700);
  }

  var lastUser = '';
  function send() {
    var v = input.value.trim();
    if (!v) return;
    lastUser = v;
    addMsg(v, 'user');
    input.value = '';
    botReply();
  }

  function switchBot(key) {
    current = key;
    if (current === 'leadgen') { BOTS.leadgen.step = 0; BOTS.leadgen.data = {}; }
    body.innerHTML = '';
    document.getElementById('bot-title').textContent = BOTS[key].name;
    document.querySelectorAll('.bot-tab').forEach(function (b) {
      b.classList.toggle('btn-primary', b.dataset.bot === key);
    });
    setTimeout(function () { addMsg(BOTS[key].greeting, 'bot'); }, 400);
  }

  document.addEventListener('DOMContentLoaded', function () {
    body = document.getElementById('chat-body');
    input = document.getElementById('chat-input');
    document.getElementById('chat-send').addEventListener('click', send);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
    document.querySelectorAll('.bot-tab').forEach(function (b) {
      b.addEventListener('click', function () { switchBot(b.dataset.bot); });
    });
    switchBot('support');
  });
})();
