// server.js — Express webhook for WhatsApp Cloud API (Meta)
// Config via env vars ONLY: WHATSAPP_TOKEN, PHONE_NUMBER_ID, VERIFY_TOKEN
// No hardcoded secrets.

const express = require('express');
const { handleMessage } = require('./bot');

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || '';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || '';
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || '';

// Health check
app.get('/', (req, res) => res.send('NAN WhatsApp bot running ✅'));

// 1) Webhook verification (Meta calls this once when you register the URL)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN && VERIFY_TOKEN) {
    console.log('Webhook verified ✅');
    return res.status(200).send(challenge);
  }
  console.warn('Webhook verification failed');
  return res.sendStatus(403);
});

// 2) Incoming messages
app.post('/webhook', async (req, res) => {
  res.sendStatus(200); // ACK fast; process async
  try {
    const entry = req.body.entry && req.body.entry[0];
    const change = entry && entry.changes && entry.changes[0];
    const value = change && change.value;
    const msg = value && value.messages && value.messages[0];
    if (!msg || msg.type !== 'text') return;

    const from = msg.from;
    const text = (msg.text && msg.text.body) || '';
    console.log('IN from', from, ':', text.slice(0, 80));

    const { reply } = handleMessage(from, text);
    await sendWhatsApp(from, reply);
  } catch (e) {
    console.error('webhook error:', e.message);
  }
});

async function sendWhatsApp(to, text) {
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.warn('Missing WHATSAPP_TOKEN/PHONE_NUMBER_ID — reply not sent (dev mode):', text.slice(0, 60));
    return;
  }
  const r = await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + WHATSAPP_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text }
    })
  });
  if (!r.ok) console.error('send failed:', r.status, await r.text().catch(() => ''));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('NAN WhatsApp bot listening on :' + PORT));
