// LPN (Licensed Practical Nurse) mean annual wage by state.
// Estimates for 2026 derived from U.S. Bureau of Labor Statistics OEWS data (SOC 29-2061).
window.LPN_STATE_WAGE = {
"Alabama":52240,"Alaska":79510,"Arizona":62790,"Arkansas":52150,"California":78120,
"Colorado":63760,"Connecticut":70590,"Delaware":66120,"District of Columbia":68230,"Florida":59540,
"Georgia":57430,"Hawaii":71340,"Idaho":58640,"Illinois":65420,"Indiana":58390,
"Iowa":57860,"Kansas":55320,"Kentucky":56110,"Louisiana":54230,"Maine":64920,
"Maryland":67850,"Massachusetts":76450,"Michigan":60230,"Minnesota":65780,"Mississippi":51190,
"Missouri":56890,"Montana":60450,"Nebraska":58120,"Nevada":70230,"New Hampshire":67120,
"New Jersey":68900,"New Mexico":60120,"New York":68740,"North Carolina":58670,"North Dakota":60890,
"Ohio":59120,"Oklahoma":55670,"Oregon":72340,"Pennsylvania":60980,"Rhode Island":71120,
"South Carolina":57340,"South Dakota":56450,"Tennessee":56780,"Texas":59870,"Utah":60230,
"Vermont":66780,"Virginia":61340,"Washington":76890,"West Virginia":52340,"Wisconsin":60120,
"Wyoming":64560
};
// Multipliers vs. the state mean.
window.LPN_SPECIALTY_MULT = {
  "Hospital (acute care)":1.00,
  "Long-term care / nursing home":0.94,
  "Home health":1.02,
  "Physician office / clinic":0.90,
  "Outpatient / government facility":1.08,
  "Travel / contract LPN":1.45
};
window.LPN_EXP_MULT = {
  "0–1 years":0.92,
  "1–3 years":0.97,
  "3–5 years":1.02,
  "5–10 years":1.08,
  "10+ years":1.14
};
