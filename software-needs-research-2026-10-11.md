# Software Needs Research — What Free Tools Do USA People Want?
Date: 2026-10-11 | Focus: tools buildable as STATIC sites (HTML/CSS/JS, no backend)

## Winning formula (cross-cutting evidence)
1. Client-side everything — "files never leave your browser" is the #1 cited reason people switch tools (privacy).
2. No signup, no daily caps — "free until you need to download" bait-and-switch is the #1 complaint.
3. One keyword = one dedicated page (SEO).
4. Mobile-first — incumbents are desktop-era UIs.
5. Formula/table/FAQ content per tool page for long-tail SEO.

## Top 15 software/tool needs (ranked by demand)

| # | Tool | Problem it solves | Search evidence | Competition weakness | Static-buildable? | Build difficulty |
|---|------|-------------------|-----------------|----------------------|-------------------|------------------|
| 1 | PDF tools suite (merge, split, compress, PDF→Word) | Editing/working with PDFs without Adobe | ilovepdf.com ~325M visits/mo (global rank ~99); smallpdf.com ~56.7M/mo; ~17.75M USA visits for ilovepdf | Daily caps, paywalled OCR/large files, files uploaded to servers (privacy gap), constant upsells | ✅ via pdf-lib/PDF.js | Medium — 1 hub page + 4-5 tool pages |
| 2 | Image compressor w/ target-KB + quality slider | Hitting exact file-size limits (job/school forms), WebP conversion | Appears in every 2026 "useful free websites" roundup; high-intent USA long-tail: "compress image to 50KB/100KB" | TinyPNG: 20-image/5MB caps, no quality slider, no target-size option, server uploads; compressor.io has quotas | ✅ Canvas/WASM, fully browser-native | Low-medium |
| 3 | Online calculators hub (micro-calculator cluster) | Everyday math: loans, percentages, age, salary, construction | calculator.net ~67.5M visits/mo (SEMrush Sep 2026, global rank #583), ~27M from USA, 60% mobile | 2010s UI, cluttered ad-heavy pages, poor mobile UX, no interactive sliders/charts | ✅ vanilla JS | Low per calculator; cluster = 1 hub + 6-8 tools |
| 4 | QR code generator (privacy-first, client-side) | Menus, business cards, WiFi sharing, vCards without tracking | Multiple full 2026 comparison guides; demand for no-signup static codes | QR Code Monkey & co are server-side (privacy flagged in guides); dynamic codes paywalled; free codes carry ads | ✅ qrcode.js + logo overlay + SVG/PNG export | Low |
| 5 | Freelance contract builder (→ PDF, no signup) | Freelancers need legal contracts without $29/mo or $200-500 lawyer fees | Reddit freelancer/legal communities constantly share manual templates; 2026 guide documents "free until download" bait-and-switch across competitors | Bonsai $29/mo; competitors gate PDF download | ✅ JS form → template → print-CSS → browser PDF (services agreement, NDA, retainer) | Medium |
| 6 | Unit converter hub (modern) | Everyday conversions: cm↔in, kg↔lb, °C↔°F | SEMrush global ranks #466 (rapidtables) & #505 (unitconverters.net) — enormous organic footprint | 2005-era designs, clunky navigation, heavy display ads, weak mobile, no instant search | ✅ vanilla JS | Low-medium |
| 7 | Weekly school-lunch planner for parents | 7 AM "fridge open + picky kids + rotation fatigue" scramble | Community validation of the lunch-planning pain point; meal planners (Ollie, Mealime) are subscription-gated; lunch-specific gap | No dedicated lunch planner; general meal planners decision-heavy & paid | ✅ rotation logic, nut-free/allergy toggle, auto grocery list, printable | Low-medium |
| 8 | Sleep calculator (bedtime⇄wake + shift-worker mode) | "What time should I sleep to wake up at X?" | Evergreen massive search volume | Incumbent sleepyti.me is ancient and barely maintained | ✅ 90-min cycle math | Very low |
| 9 | Text tools hub (word counter, case converter, keyword density) | Essay limits (students), SEO writing, social char limits | WordCounter.net is the trusted default; recurring demand | Incumbents are dated single tools; bundle opportunity | ✅ vanilla JS | Low |
| 10 | Invoice generator (no signup, no watermark, niche templates) | Small business billing without subscriptions | Heavy search demand; "no signup" modifier dominates queries | Most "free" rivals are signup-walled; niche templates (hourly consulting, photography) missing | ✅ jsPDF, localStorage | Low-medium |
| 11 | Color picker + palette + WCAG contrast checker | Designer/dev color work | Steady designer traffic | Fragmented competition, no clear leader | ✅ vanilla JS | Low |
| 12 | Password generator + strength checker | Account security | LastPass's web generator is "one of the most trafficked on Google" | Thin content on most; best as cluster filler | ✅ vanilla JS | Very low |
| 13 | Gym micro-tools (1RM, plate calculator, macro) | Workout planning | Steady fitness long-tail | Weak mobile on incumbents | ✅ vanilla JS | Very low |
| 14 | Resume builder / ATS checker | Job applications | High demand BUT saturated (RxResume fully open-source free) | Crowded | ✅ | Low — but crowded, deprioritize |
| 15 | Free AI headshot generator | Professional LinkedIn photos | Strong demand; free tiers crippled (1-3/day, watermarks, face-training data terms) | Quality needs paid GPU inference | ❌ not static-feasible at quality | High — defer |

## AI tool gaps (noted, mostly not static-buildable yet)
- Headshot, voiceover, upscaler: demand is real but quality requires paid GPU inference → defer.
- Technical note: some tools now run in-browser via WASM (model downloads once, works offline) — a viable static pattern for future AI tools.
- AI image generators: saturated with free no-signup options (Craiyon, Stable Diffusion); skip.

## Overlap warnings (do NOT duplicate existing sites)
- nan-creatorcalcs: freelance margin/break-even calculators
- nan-kamai-calc: freelance rate calculator (Hindi)
- nan-campustools: GPA, citation generator
- business-intel: ROI + break-even calculators

## Sources consulted
- browser.search (en): free-online-tools roundups 2025-2026, Smallpdf/ilovepdf traffic (Similarweb/HypeStat), invoice generator comparisons, AI image/headshot/background-remover guides, no-signup demand threads
- Raw agent notes: ~/workspace/free-sites/software-needs-notes-competitors.md, ~/workspace/free-sites/software-needs-notes-gaps.md
