# WhatsApp Bot Setup Guide — Roman Urdu 🇵🇰

Tumhara bot **taiyar hai** — code likha hua, demo bhi live hai. Ab sirf Meta (WhatsApp) se connect karna hai. Ye steps **tumhare** hain (15–20 min), kyunke Meta account aur phone number tumhara hai.

**Pehle se ho chuka (tumhe kuch nahi karna):**
- ✅ Bot ka code (server + dimagh)
- ✅ Live demo: https://nan-whatsapp-bot-demo.surge.sh/

---

## STEP 1 — Meta Developer Account banao (5 min) 👤 TUMHARA KAAM

1. Jao: **developers.facebook.com** → "Get Started" → apne Facebook account se login karo
2. "Developer" account confirm karo (bas 2-3 click)

## STEP 2 — App banao + WhatsApp lagao (5 min) 👤 TUMHARA KAAM

1. Dashboard → **"Create App"** → naam likho: `NAN WhatsApp Bot` → Create
2. Left side **"Add Product"** → **WhatsApp** → Set up
3. Wahan tumhe **test phone number** milega (Meta ka free test number) — is par bot ko test kar sakti ho

## STEP 3 — Apna number connect karo (5 min) 👤 TUMHARA KAAM

1. WhatsApp → **API Setup** page par jao
2. "Add phone number" → apna business number likho: **+92 317 7415702**
3. WhatsApp par aane wala **OTP code** dalo → number verify ho jayega
4. Isi page se 2 cheezen **copy kar ke sambhal ke rakho**:
   - **Phone Number ID** (number ke neeche likha hota hai)
   - **Temporary token** (baad me permanent token banana — neeche Step 5)

## STEP 4 — Bot ko free hosting par lagao (5 min) 👤 TUMHARA KAAM

1. Jao: **render.com** → free account banao (GitHub se login easiest hai)
2. **New → Web Service** → repository connect karo: `nidaayesha54/nan-websites-empire`
   - Root Directory: `nan-whatsapp-bot`
   - Build Command: `npm install`
   - Start Command: `npm start`
3. **Environment Variables** me ye 3 dalo:
   - `VERIFY_TOKEN` = koi bhi apni marzi ka secret lafz (yaad rakho!)
   - `PHONE_NUMBER_ID` = Step 3 wala
   - `WHATSAPP_TOKEN` = Step 3 wala token (pehle temporary, baad me permanent)
4. Deploy dabao → 2-3 min me tumhara bot online! URL milega: `https://nan-whatsapp-bot.onrender.com`

## STEP 5 — Permanent token banao (5 min) 👤 TUMHARA KAAM

Temporary token kuch ghanton me expire ho jata hai. Permanent ke liye:
1. **business.facebook.com** → apna Business account banao/confirm karo
2. Business Settings → **System Users** → Add → naam `whatsapp-bot` → Admin
3. **Add Assets** → tumhari WhatsApp App select karo
4. **Generate Token** → `whatsapp_business_messaging` permission tick karo → token copy karo
5. Render me ja kar `WHATSAPP_TOKEN` ko is naye token se **update** karo → Redeploy

## STEP 6 — Webhook connect karo (3 min) 👤 TUMHARA KAAM

1. Meta dashboard → tumhari App → WhatsApp → **Configuration**
2. Webhook → **Edit** → URL dalo: `https://nan-whatsapp-bot.onrender.com/webhook`
3. Verify Token dalo: wohi jo Step 4 me `VERIFY_TOKEN` rakha tha
4. **Verify and Save** dabao → ✅
5. Neeche **"messages"** field par **Subscribe** tick karo

## STEP 7 — Test karo! 🎉

Apne kisi dost ke phone se (ya doosri SIM se) **+92 317 7415702** par WhatsApp message bhejo: `Salam!`

Bot ko jawab dena chahiye: *"Assalam-o-Alaikum! 👋 NAN Marketing Agency me khush aamdeed!..."*

Kaam na kare to Render ke **Logs** me dekho — error wahan likha hoga.

---

## Yaad rakhne wali baatein

- 🔑 **Token kisi ko mat dena** — ye tumhare WhatsApp ka password jaisa hai
- 💤 Render free tier 15 min idle ke baad **so jata hai** — pehla message 30 sec late aa sakta hai, phir normal
- 📝 Har "mujhe insaan chahiye" wala message **leads.jsonl** me save hota hai — roz check karo
- 🧪 Pehle test number par khelo, phir asli number par lagao

**Atke to mujhe batao — step number ke saath!**
