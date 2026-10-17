# Rozana Calculators — Publish Guide (Nida ke liye)

Tumhari app bilkul tayyar hai — code, design, calculators sab. Ab sirf **3 kaam tumhe khud karne hain** (ye Google ke accounts hain, is liye tumhari ID se hi banenge):

## 1️⃣ Google Play Developer Account — $25 (one-time)

- [play.google.com/console/signup](https://play.google.com/console/signup) par jao
- Apni Google ID se sign in karo, **$25 one-time fee** pay karo (debit/credit card se)
- Identity verify karo (CNIC/Passport) — 1-2 din lag sakte hain
- ⚠️ Ye account tumhare naam par hoga, is liye main nahi bana sakta

## 2️⃣ AdMob Account — FREE (ads se earning ke liye)

- [admob.com](https://admob.com) par free account banao
- App add karo → **Rozana Calculators** (Android)
- 2 ad units banao: **Banner** + **Interstitial** — dono ke IDs copy karo
- IDs kahan paste karne hain: `ADMOB_SETUP.md` me exact jagah likhi hai (3 lines change karni hain)
- IDs paste karke GitHub par push karo → nayi APK automatic ban jayegi

## 3️⃣ APK download karke phone par test karo

- GitHub repo kholo: `nidaayesha54/nan-websites-empire` → **Actions** tab → latest **Build Debug APK** run → **Artifacts** se `rozana-calculators-debug-apk` download karo
- Phone par install karo (Settings → "Install unknown apps" allow karna parega — sirf is APK ke liye)
- 4 calculators check karo: EOBI, Overtime, Gratuity, Age — Urdu/English toggle bhi try karo

## Phir Play Store par publish (jab ready ho)

1. Play Console → **Create app** → naam: Rozana Calculators
2. **Release APK nahi, AAB chahiye**: GitHub Actions wali APK testing ke liye hai. Release ke liye mujhe bolo — main release AAB banane ka workflow add kar dunga (signed, Play Console ke liye)
3. Store listing: app icon, screenshots (phone se le lena), short + full description (main likh dunga)
4. Content rating questionnaire bharo (calculator app = Everyone)
5. Privacy policy ka link dena parega — main bana dunga
6. **Rollout → Production** → review me 3-7 din lagte hain

## Earning kaise hogi?

- Banner ad har screen par + Interstitial ad tab switch par (max 1 per 2 min)
- Jitne zyada log app use karenge, utni earning — is liye app ko WhatsApp/Facebook par share karna
- Pehle 1000+ installs ka target rakho, phir earning start hogi

Koi step samajh na aaye to mujh se poocho — main har step par guide karunga. 💪
