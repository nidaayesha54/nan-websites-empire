# NAN Chat Widget

Embeddable website chatbot for NAN Marketing Agency (and clients).

## Files
- `nan-chat-widget.js` — the widget (vanilla JS, shadow-DOM isolated, ~17KB). `node --check` clean.
- `demo/index.html` — live demo landing page.
- `WP_INSTALL_URDU.md` — Roman Urdu WordPress install guide.

## Embed (one tag)
```html
<script>window.NANChatConfig={businessName:'NAN Marketing Agency',whatsappNumber:'923177415702'};</script>
<script src="https://nan-chat-widget-demo.surge.sh/nan-chat-widget.js"></script>
```

## Behavior
- Floating 💬 bubble (bottom-right, navy + teal, pulse).
- Proactive welcome 6s after load (once per session): *"Assalam-o-Alaikum! 👋 NAN Marketing Agency me khush aamdeed! Aap kis business ke liye services chahte hain?"*
- Quick-reply chips: 🎬 Video Ad | 📱 Social Media | 💻 Mobile App | 🤖 WhatsApp Bot | 💬 Kuch aur → each answers (2–3 lines, price hints: apps $2,000, bots $500–$2,000, video/social custom) then asks for name + WhatsApp number.
- Free-text: EN + Roman Urdu keyword matching (price, portfolio, timing, contact); fallback → human handoff + lead capture.
- Leads → `localStorage` (`nan_chat_leads`); optional POST to `NANChatConfig.endpoint`.
- Public API: `window.NANChat.open()`, `window.NANChat.getLeads()`.

## Deploy
Demo: https://nan-chat-widget-demo.surge.sh/
