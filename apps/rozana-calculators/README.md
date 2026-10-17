# Rozana Calculators 📱

Daily-use Pakistan calculators app — **EOBI Pension**, **Overtime**, **Gratuity**, **Age** — bilingual (Urdu + English), works 100% offline.

- **Live sites these formulas come from:** [nan-eobi-calculator.surge.sh](https://nan-eobi-calculator.surge.sh/) · [nan-labour-calculators.surge.sh](https://nan-labour-calculators.surge.sh/) · [nan-urage-calculator.surge.sh](https://nan-urage-calculator.surge.sh/)
- **Tech:** HTML5 + CSS + vanilla JS (no frameworks, no network calls) wrapped with [Capacitor](https://capacitorjs.com/) for Android.
- **Ads:** AdMob via `admob-plus-cordova` — prepared with placeholders, see [ADMOB_SETUP.md](ADMOB_SETUP.md).
- **Publishing:** [PUBLISH_GUIDE.md](PUBLISH_GUIDE.md) (Roman Urdu) — the 3 steps for Nida.

## Project layout

```
rozana-calculators/
├── www/                    # the app (webDir for Capacitor)
│   ├── index.html          # 4-tab UI
│   ├── css/app.css         # NAN theme
│   ├── js/calcs.js         # verified calculator formulas (offline)
│   ├── js/app.js           # tabs + language toggle
│   ├── js/admob.js         # AdMob glue (placeholders until real IDs)
│   └── img/icon.png        # app icon
├── capacitor.config.ts     # appId: com.nan.rozanacalculators
├── package.json
├── .github/workflows/build-apk.yml  # CI: builds debug APK on every push
├── ADMOB_SETUP.md
└── PUBLISH_GUIDE.md
```

## Local dev (optional)

```bash
cd apps/rozana-calculators
npm install
npx cap add android
npx cap sync android
# open android/ in Android Studio to run
```

Debug APKs are built automatically by GitHub Actions — download from the Actions tab.
