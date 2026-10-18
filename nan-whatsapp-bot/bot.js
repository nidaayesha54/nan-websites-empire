// bot.js — NAN Marketing Agency WhatsApp bot conversation engine
// SIMPLE by design (Nida: "mere bus clients k msg ka jawab dy").
// No menus, no multi-step flows. Warm greeting + smart keyword answers + human handoff.

const fs = require('fs');
const path = require('path');

const LEADS_FILE = path.join(__dirname, 'leads.jsonl');
const seenSenders = new Set(); // in-memory; swap for Redis/DB in production

// ---------- language detection ----------
const URDU_HINTS = [
  'salam', 'assalam', 'kya', 'kia', 'hai', 'haan', 'han', 'nahi', 'ni',
  'aap', 'ap', 'mujhe', 'mujhy', 'chahiye', 'chaeye', 'kaise', 'kese',
  'kitna', 'kitne', 'kahan', 'kab', 'kyun', 'kaam', 'paisa', 'paisay',
  'bata', 'batayen', 'batao', 'dekho', 'dikhao', 'shukriya', 'meherbani',
  'acha', 'theek', 'sahi', 'wala', 'wali', 'liye', 'saath', 'tarah',
  'aur', 'mein', 'me', 'par', 'ko', 'se', 'ka', 'ki', 'ke', 'ho', 'hain',
  'kar', 'karo', 'kari', 'karte', 'banwana', 'banani'
];

function detectLang(text) {
  const t = ' ' + text.toLowerCase() + ' ';
  // strong single-word signals
  if (/\b(salam|assalam|salaam|aoa)\b/.test(t)) return 'ru';
  let hits = 0;
  for (const w of URDU_HINTS) {
    if (t.includes(' ' + w + ' ') || t.includes(' ' + w) || t.includes(w + ' ')) hits++;
    if (hits >= 2) return 'ru';
  }
  return 'en';
}

// ---------- reply bank (short, WhatsApp-style, max ~3 lines) ----------
const R = {
  greeting: {
    ru: "Assalam-o-Alaikum! 👋 NAN Marketing Agency me khush aamdeed! Me Ayesha ki assistant hun — batayen, me aapki kya madad kar sakti hun?",
    en: "Hello! 👋 Welcome to NAN Marketing Agency! I'm Ayesha's assistant — how can I help you today?"
  },
  services: {
    ru: "Hum AI video ads 🎬, social media management 📱, UGC content ✨ aur AI chatbots 🤖 banate hain. Aapko kis cheez me dilchaspi hai?",
    en: "We create AI video ads 🎬, social media management 📱, UGC content ✨ and AI chatbots 🤖. Which one are you interested in?"
  },
  price: {
    ru: "Price kaam par depend karta hai — custom apps $2,000 se shuru hote hain 💰 Apne kaam ki detail batayen, exact quote de dungi 🙂",
    en: "Pricing depends on the project — custom apps start at $2,000 💰 Tell me what you need and I'll share an exact quote 🙂"
  },
  portfolio: {
    ru: "Zaroor! Hamara kaam yahan dekhen 👀\n👉 nidaayesha.com\nKoi khas style pasand aaye to batayen!",
    en: "Sure! Check out our work here 👀\n👉 nidaayesha.com\nLet me know if any style catches your eye!"
  },
  timing: {
    ru: "Aam tor par 3–7 din me delivery ho jati hai ⏱️ (kaam ki noiyat par depend karta hai)",
    en: "Usually delivered in 3–7 days ⏱️ (depends on the project)"
  },
  location: {
    ru: "Hum Pakistan se kaam karte hain, aur duniya bhar ke clients ke sath 🌍",
    en: "We're based in Pakistan and work with clients worldwide 🌍"
  },
  human: {
    ru: "Bilkul! Ye Ayesha khud batayengi — aapka message un tak pahuncha diya hai 🙂",
    en: "Of course! Ayesha will personally reply — I've passed your message to her 🙂"
  },
  fallback: {
    ru: "Ye Ayesha khud batayengi, aapka message un tak pahuncha diya hai 🙂",
    en: "Ayesha will answer this herself — I've passed your message to her 🙂"
  }
};

// ---------- keyword routing ----------
const ROUTES = [
  { key: 'services', words: ['service', 'services', 'kya karti', 'kya karte', 'what do you do', 'kaam kya', 'offer'] },
  { key: 'price', words: ['price', 'cost', 'paisa', 'paisay', 'kitna', 'kitne', 'rate', 'charge', 'fees', 'kimat', 'qimat', 'budget'] },
  { key: 'portfolio', words: ['portfolio', 'dikhao', 'dekho', 'samples', 'sample', 'work', 'example', 'kaam dekha'] },
  { key: 'timing', words: ['kitna time', 'how long', 'delivery', 'kab tak', 'time lagega', 'duration'] },
  { key: 'location', words: ['kahan se', 'where', 'location', 'based', 'country', 'rehti'] },
  { key: 'human', words: ['insaan', 'human', 'call', 'phone kro', 'baat karni', 'speak to', 'talk to', 'real person', 'ayesha se'] }
];

function route(text) {
  const t = text.toLowerCase();
  for (const r of ROUTES) {
    for (const w of r.words) {
      if (t.includes(w)) return r.key;
    }
  }
  return null;
}

// ---------- lead logging ----------
function saveLead(entry) {
  try {
    fs.appendFileSync(LEADS_FILE, JSON.stringify(entry) + '\n');
  } catch (e) { /* never crash on logging */ }
}

// ---------- main handler ----------
function handleMessage(senderPhone, text) {
  const lang = detectLang(text || '');
  const isFirst = !seenSenders.has(senderPhone);
  const clean = (text || '').trim();

  // First contact (or explicit greeting) → warm greeting
  if (isFirst) {
    seenSenders.add(senderPhone);
    return { reply: R.greeting[lang], lang, tag: 'greeting' };
  }
  if (/^(hi+|hello+|hey+|salam|assalam|salaam)[\s!.,]*$/i.test(clean)) {
    return { reply: R.greeting[lang], lang, tag: 'greeting' };
  }

  // Keyword answers
  const key = route(clean);
  if (key === 'human') {
    saveLead({ type: 'HOT', phone: senderPhone, message: clean, ts: new Date().toISOString() });
    return { reply: R.human[lang], lang, tag: 'human' };
  }
  if (key && R[key]) {
    return { reply: R[key][lang], lang, tag: key };
  }

  // Anything else → human handoff + log
  saveLead({ type: 'NEEDS-HUMAN', phone: senderPhone, message: clean, ts: new Date().toISOString() });
  return { reply: R.fallback[lang], lang, tag: 'needs-human' };
}

module.exports = { handleMessage, detectLang, route, R };
