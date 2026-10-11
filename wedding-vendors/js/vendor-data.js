/* VendorCompare — 2026 USA wedding vendor cost data (estimates, based on The Knot 2026 Real Weddings Study + industry reporting). All figures USD. */
var VENDOR_DATA = {
  photographer: {
    name: "Wedding Photographer", icon: "📸",
    typical: 3000, low: 1500, high: 6000, unit: "flat",
    desc: "Full-day coverage (6–8 hrs), edited gallery, online delivery.",
    includes: ["6–8 hrs coverage", "Edited hi-res gallery", "Online delivery", "Engagement session (often)", "Second shooter (premium pkgs)"],
    redFlags: ["No contract offered", "Won't show a full wedding gallery", "Requires 100% upfront", "No backup equipment plan", "No liability insurance"],
    questions: "Ask: full gallery samples, backup gear, second shooter cost, overtime rate, delivery timeline."
  },
  videographer: {
    name: "Wedding Videographer", icon: "🎬",
    typical: 2300, low: 1200, high: 4500, unit: "flat",
    desc: "Highlight film + ceremony coverage, 4–8 weeks delivery.",
    includes: ["Highlight reel (3–8 min)", "Full ceremony film", "Licensed music", "Drone footage (premium)"],
    redFlags: ["No audio backup plan", "Can't show full films", "Unclear delivery timeline", "No contract"],
    questions: "Ask: audio backup (lav mics), delivery timeline, raw footage cost, drone included?"
  },
  florist: {
    name: "Florist", icon: "💐",
    typical: 2800, low: 1000, high: 5000, unit: "flat",
    desc: "Bouquets, boutonnieres, ceremony + reception arrangements.",
    includes: ["Bridal bouquet", "Boutonnieres/corsages", "Ceremony florals", "Centerpieces", "Setup & teardown"],
    redFlags: ["Won't itemize the proposal", "No flower-substitution clause", "No setup/teardown included", "Vague delivery timing"],
    questions: "Ask: itemized proposal, substitution policy, setup/teardown included, who handles rentals?"
  },
  dj: {
    name: "DJ", icon: "🎧",
    typical: 1800, low: 800, high: 3000, unit: "flat",
    desc: "4–5 hrs reception, MC services, pro sound + lighting basics.",
    includes: ["4–5 hrs performance", "MC services", "Pro sound system", "Dance lighting", "Online planning portal"],
    redFlags: ["No backup DJ plan", "Uses only laptop speakers", "No liability insurance", "No written timeline coordination"],
    questions: "Ask: backup plan, MC experience, equipment quality, overtime rate, do they coordinate with planner?"
  },
  band: {
    name: "Live Band", icon: "🎺",
    typical: 4500, low: 2500, high: 10000, unit: "flat",
    desc: "4–6 piece band, 3–4 hrs, breaks covered by DJ tracks.",
    includes: ["3–4 hrs live music", "Break music (DJ tracks)", "Sound engineer", "Stage lighting"],
    redFlags: ["No demo video of live performance", "Fewer musicians than advertised on the day", "No contract with set list terms"],
    questions: "Ask: live demo video, exact lineup, break coverage, overtime, load-in requirements."
  },
  caterer: {
    name: "Caterer (per person)", icon: "🍽️",
    typical: 80, low: 50, high: 150, unit: "per-person",
    desc: "Plated or buffet dinner service, per guest.",
    includes: ["Cocktail hour", "Plated/buffet dinner", "Service staff", "Cake cutting (often)"],
    redFlags: ["Quote excludes tax/service/gratuity", "No tasting offered", "Vague staffing ratio", "No rain-plan for outdoor"],
    questions: "Ask: loaded total incl. tax/service/gratuity, tasting included, staff-to-guest ratio, cake-cutting fee?"
  },
  planner: {
    name: "Wedding Planner (full)", icon: "📋",
    typical: 5000, low: 3000, high: 9000, unit: "flat",
    desc: "Full-service planning from engagement to wedding day.",
    includes: ["Vendor sourcing", "Budget management", "Design direction", "Day-of coordination team"],
    redFlags: ["No vendor commission disclosure", "No written scope of work", "Charges % with no cap"],
    questions: "Ask: flat fee vs %, commission disclosure, team size on the day, how many weddings per year?"
  },
  coordinator: {
    name: "Day-of Coordinator", icon: "✅",
    typical: 1800, low: 1000, high: 2800, unit: "flat",
    desc: "Takes over 4–6 weeks out; runs the wedding day.",
    includes: ["Final vendor confirmations", "Timeline creation", "Rehearsal direction", "Day-of team"],
    redFlags: ["Only shows up day-of with no prep", "No assistant for 100+ guests", "No emergency kit"],
    questions: "Ask: when do they take over, assistant included, rehearsal included, timeline sample?"
  },
  cake: {
    name: "Wedding Cake", icon: "🍰",
    typical: 540, low: 300, high: 950, unit: "flat",
    desc: "3-tier cake serving ~100, delivery + setup.",
    includes: ["Tasting", "3-tier design", "Delivery & setup", "Cake stand (rental)"],
    redFlags: ["No tasting before deposit", "Delivery fee hidden", "No contract on design"],
    questions: "Ask: tasting included, delivery/setup fee, servings per tier, design change policy?"
  },
  hairmakeup: {
    name: "Hair & Makeup (bride)", icon: "💄",
    typical: 300, low: 200, high: 650, unit: "flat",
    desc: "Bridal hair + makeup, on-location, incl. trial separately.",
    includes: ["Bridal hair", "Bridal makeup", "Lashes", "On-location service"],
    redFlags: ["No trial offered", "No airbrush option discussed", "Vague timing schedule"],
    questions: "Ask: trial cost, timing schedule, bridal party rates, touch-up kit?"
  },
  officiant: {
    name: "Officiant", icon: "💍",
    typical: 260, low: 150, high: 550, unit: "flat",
    desc: "Custom ceremony, rehearsal attendance, filing license.",
    includes: ["Custom ceremony script", "Rehearsal", "License filing guidance"],
    redFlags: ["Reads generic script only", "Won't attend rehearsal", "No backup plan"],
    questions: "Ask: custom vows help, rehearsal included, how they file the license?"
  },
  transport: {
    name: "Transportation", icon: "🚗",
    typical: 1100, low: 600, high: 2200, unit: "flat",
    desc: "Getaway car or shuttle, 3–4 hrs.",
    includes: ["3–4 hr service", "Chauffeur", "Red carpet/champagne (limo)"],
    redFlags: ["No backup vehicle", "Overtime rate hidden", "Vague pickup schedule"],
    questions: "Ask: backup vehicle, overtime rate, exact pickup timeline?"
  },
  stationery: {
    name: "Invitations & Stationery", icon: "✉️",
    typical: 510, low: 250, high: 1200, unit: "flat",
    desc: "100 invitation suites + day-of paper goods.",
    includes: ["Invitations + envelopes", "RSVP cards", "Day-of signage/menus"],
    redFlags: ["No proof approval process", "Postage not discussed", "Rush fees hidden"],
    questions: "Ask: proof rounds, postage guidance, assembly included?"
  },
  decor: {
    name: "Lighting & Décor", icon: "✨",
    typical: 1900, low: 800, high: 4500, unit: "flat",
    desc: "Uplighting, candles, linens upgrades, install.",
    includes: ["Uplighting", "Candle package", "Install & strike"],
    redFlags: ["No site visit", "Strike/teardown not included", "No power-load plan"],
    questions: "Ask: site visit, install/strike included, power requirements?"
  }
};

var REGION_MULT = {
  "northeast": { name: "Northeast (NY, Boston, DC)", mult: 1.25 },
  "west":      { name: "West Coast (LA, SF, Seattle)", mult: 1.20 },
  "midwest":   { name: "Midwest (Chicago, Minneapolis)", mult: 0.95 },
  "south":     { name: "South (Atlanta, Dallas, Nashville)", mult: 0.90 },
  "mountain":  { name: "Mountain (Denver, Phoenix)", mult: 1.00 }
};

function fmt(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
function adjRange(v, regionKey) {
  var m = REGION_MULT[regionKey] ? REGION_MULT[regionKey].mult : 1.0;
  return { low: v.low * m, typical: v.typical * m, high: v.high * m, unit: v.unit };
}
function verdictFor(quote, typical) {
  var ratio = quote / typical;
  if (ratio < 0.7) return { cls: "low", text: "Well below typical — verify what's included" };
  if (ratio <= 1.3) return { cls: "fair", text: "Fair — within the normal range" };
  return { cls: "high", text: "Above typical — negotiate or compare more quotes" };
}
