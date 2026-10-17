# AdMob Setup — Rozana Calculators

AdMob ads are **prepared but NOT active**. The app works 100% without them.
Follow these steps once to turn ads on.

## Step 1 — Create the AdMob app (free)

1. Go to [admob.com](https://admob.com) → sign in with your Google account.
2. **Apps → Add app → Android** → enter app name **Rozana Calculators**.
3. AdMob gives you an **App ID** like `ca-app-pub-1234567890123456~1234567890`.

## Step 2 — Create 2 ad units

Inside your new app in AdMob:
1. **Ad units → Add ad unit → Banner** → name it `rozana_banner` → copy its **Ad unit ID** (`ca-app-pub-.../...`).
2. **Ad units → Add ad unit → Interstitial** → name it `rozana_interstitial` → copy its **Ad unit ID**.

## Step 3 — Paste the 3 IDs into the code

| ID | Where to paste |
|---|---|
| App ID (`...~...`) | `package.json` → `cordova.plugins["admob-plus-cordova"].APP_ID_ANDROID` (replace the `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXX` placeholder) |
| Banner Ad unit ID | `www/js/admob.js` → `BANNER_ID` (replace the `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX` placeholder) |
| Interstitial Ad unit ID | `www/js/admob.js` → `INTERSTITIAL_ID` (replace the placeholder) |

## Step 4 — Rebuild

Push the change to GitHub → the **Build Debug APK** workflow runs automatically →
download the new APK from Actions → Artifacts and install it on your phone.

## Ad behaviour (policy-safe)

- **Banner**: shows at the bottom of calculator screens, always visible.
- **Interstitial**: shows when switching tabs, **max 1 per 2 minutes** (`INTERSTITIAL_MIN_GAP_MS` in `admob.js`).
  Never on app start, never during calculation — this keeps you inside AdMob policy.

## Testing first (recommended)

Before using real IDs, test with Google's official test IDs so you don't risk your account:
- Banner test: `ca-app-pub-3940256099942544/6300978111`
- Interstitial test: `ca-app-pub-3940256099942544/1033173712`
- App ID test: `ca-app-pub-3940256099942544~3347511713`

Real ads only start after you paste YOUR IDs and publish. Test IDs never earn money.
