=== NAN Calculators ===
Contributors: nanmarketingagency
Tags: calculator, eobi, pension, overtime, gratuity, age calculator, pakistan, urdu
Requires at least: 5.8
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Clean Pakistan calculator shortcodes — EOBI pension, overtime, gratuity and age calculators with English/Urdu support. No tracking, no external calls.

== Description ==

NAN Calculators adds four clean, mobile-friendly calculators to any post, page or widget using simple shortcodes:

* `[nan_eobi]` — EOBI pension estimator: (average wage × years) ÷ 50, Rs 11,500 minimum, plus the old-age grant rule for under 14.5 years of service.
* `[nan_overtime]` — Overtime pay: hourly = (monthly × 12) ÷ (52 × weekly hours), overtime at double rate.
* `[nan_gratuity]` — Gratuity: monthly ÷ 26 × 30 × years of service.
* `[nan_age]` — Age calculator with Urdu numerals option (۰۱۲۳۴۵۶۷۸۹), birth weekday, total days and next-birthday countdown.

Each shortcode accepts `lang="en"` or `lang="ur"` (default `en`), e.g. `[nan_eobi lang="ur"]`.

Privacy-first: all calculations happen in the visitor's browser. No data is collected, stored or sent anywhere. No external HTTP calls.

== Installation ==

1. Upload the `nan-calculators` folder to `/wp-content/plugins/` or install via Plugins → Add New → Upload Plugin.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Add any shortcode to a post, page or text widget, e.g. `[nan_eobi lang="ur"]`.

== Frequently Asked Questions ==

= Do the calculators work offline? =
Yes. All math runs in JavaScript in the visitor's browser; the plugin makes zero external requests.

= Can I use Urdu? =
Yes — add `lang="ur"` to any shortcode for a fully Urdu interface (RTL supported).

= Are the formulas accurate for Pakistan? =
The formulas follow EOBI rules (minimum pension Rs 11,500 since Jan 2026), the Factories Act overtime rule (double the ordinary rate) and the standard gratuity rule (30 days' wages per year, daily wage = monthly ÷ 26). Results are estimates — official bodies may apply rounding or updates.

= Will it slow down my site? =
No. CSS and JS load only on pages where a shortcode is present.

== Screenshots ==

1. EOBI pension calculator (English)
2. Overtime calculator (Urdu)
3. Gratuity calculator result
4. Age calculator with Urdu numerals

== Changelog ==

= 1.0.0 =
* Initial release: 4 shortcodes (nan_eobi, nan_overtime, nan_gratuity, nan_age), EN/UR support, privacy-first (no external calls).
