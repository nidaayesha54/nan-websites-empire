# Apni WordPress Website par Chat Widget Lagana (nidaayesha.com)

**Asaan tareeqa (recommended) — "Insert Headers and Footers" plugin:**

1. WordPress admin me login karein.
2. **Plugins → Add New** → search karein **"Insert Headers and Footers"** (WPCode wala) → **Install** → **Activate**.
3. **Code Snippets → Header & Footer** (ya Settings → Insert Headers and Footers) kholein.
4. **Footer** wale box me ye 2 lines paste karein:

```html
<script>window.NANChatConfig={businessName:'NAN Marketing Agency',whatsappNumber:'923177415702'};</script>
<script src="https://nan-chat-widget-demo.surge.sh/nan-chat-widget.js"></script>
```

5. **Save** dabayein. Ho gaya! ✅

**Check karein:** apni website kholein (mobile par bhi) → 6 second wait karein → neeche right corner me 💬 bubble ke upar welcome message aana chahiye: *"Assalam-o-Alaikum! 👋 NAN Marketing Agency me khush aamdeed!..."*

**Settings (optional):** `NANChatConfig` me ye change kar sakti hain:
- `welcomeDelay: 6000` — kitne ms baad welcome aaye (6000 = 6 second)
- `accent: '#14B8A6'` — button ka color
- `endpoint: 'https://...'` — agar leads apne server par bhejni hon (abhi browser me save hoti hain)

**Leads kahan jati hain?** Abhi visitor ka naam/number uske browser me save hota hai + widget ke zariye WhatsApp par baat ho sakti hai. Jab chahein, batayein — me leads ko email/Google Sheet par bhejne ka system laga dunga.

**Note:** Theme File Editor (footer.php) wala tareeqa bhi hai, lekin plugin wala safe hai — theme update par code nahi urega.
