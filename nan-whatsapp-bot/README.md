# NAN WhatsApp Bot 🤖

Official WhatsApp Cloud API (Meta) chatbot for **NAN Marketing Agency**.
Simple by design: warm greeting + smart keyword answers + human handoff. No menus, no flows.

## How it works

```
Client WhatsApp message
        │ (Meta WhatsApp Cloud API)
        ▼
POST /webhook  →  bot.js handleMessage()
        │
        ├── first message / greeting → warm welcome (Roman Urdu or English)
        ├── keywords: services / price / portfolio / timing / location → short answer
        ├── "human / call / Ayesha se baat" → handoff reply + HOT lead saved
        └── anything else → handoff reply + NEEDS-HUMAN lead saved
        │
        ▼
Reply sent via Graph API  +  lead appended to leads.jsonl
```

## Files

| File | Purpose |
|---|---|
| `server.js` | Express webhook (GET verify + POST messages), sends replies via Graph API |
| `bot.js` | Conversation brain: language detect, keyword routing, reply bank, lead logging |
| `leads.jsonl` | Append-only lead log `{type, phone, message, ts}` — types: `HOT`, `NEEDS-HUMAN` |
| `.env.example` | Copy to `.env` and fill (never commit real `.env`) |

## Env vars (no hardcoded secrets)

- `WHATSAPP_TOKEN` — permanent system-user token from Meta
- `PHONE_NUMBER_ID` — from WhatsApp → API Setup in Meta dashboard
- `VERIFY_TOKEN` — any random string YOU invent (used once at webhook registration)
- `PORT` — default 3000

## Run locally

```bash
npm install
cp .env.example .env   # fill values
npm start
```

## Deploy (free)

**Render.com** (recommended, free tier):
1. Push this folder to GitHub (already at `nan-websites-empire/nan-whatsapp-bot/`)
2. Render → New → Web Service → connect repo → set env vars → deploy
3. Your webhook URL: `https://<your-app>.onrender.com/webhook`
4. Paste it in Meta dashboard → WhatsApp → Configuration → Webhook → Subscribe to `messages`

**Railway.app** works the same way.

## Test the conversation now

Live demo (same brain, runs in browser): **https://nan-whatsapp-bot-demo.surge.sh/**

## Production notes

- `seenSenders` is in-memory — on Render free tier it resets on restart (fine; greeting repeats). For persistence use Redis/DB.
- `leads.jsonl` is local — back it up or ship to Google Sheets (append via Sheets API) for a real pipeline.
- Webhook must be HTTPS with a valid cert (Render/Railway provide this).
