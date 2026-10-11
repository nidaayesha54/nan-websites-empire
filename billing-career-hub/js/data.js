// Salary data: 2026 estimates based on BLS May 2024 OES (Medical Records Specialists, 29-2072,
// median $50,250) projected forward. State factors approximate regional wage patterns.
const BILLER_BASE_MEDIAN = 52000; // national median, 2026 estimate

const STATE_FACTORS = {
  "Alabama":0.88,"Alaska":1.30,"Arizona":1.02,"Arkansas":0.86,"California":1.28,
  "Colorado":1.08,"Connecticut":1.15,"Delaware":1.08,"District of Columbia":1.25,"Florida":1.02,
  "Georgia":1.03,"Hawaii":1.18,"Idaho":0.93,"Illinois":1.08,"Indiana":0.97,
  "Iowa":0.97,"Kansas":0.95,"Kentucky":0.90,"Louisiana":0.92,"Maine":1.00,
  "Maryland":1.12,"Massachusetts":1.20,"Michigan":1.02,"Minnesota":1.07,"Mississippi":0.82,
  "Missouri":0.97,"Montana":0.95,"Nebraska":0.97,"Nevada":1.05,"New Hampshire":1.07,
  "New Jersey":1.17,"New Mexico":0.88,"New York":1.22,"North Carolina":1.02,"North Dakota":1.00,
  "Ohio":1.00,"Oklahoma":0.90,"Oregon":1.10,"Pennsylvania":1.05,"Rhode Island":1.08,
  "South Carolina":0.93,"South Dakota":0.93,"Tennessee":0.92,"Texas":1.05,"Utah":1.00,
  "Vermont":1.02,"Virginia":1.08,"Washington":1.18,"West Virginia":0.85,"Wisconsin":1.03,"Wyoming":1.02
};

const EXP_FACTORS = {
  "entry":  {label:"Entry level (0–1 yrs)", factor:0.85},
  "early":  {label:"1–2 years", factor:0.92},
  "mid":    {label:"3–5 years", factor:1.00},
  "senior": {label:"6–10 years", factor:1.12},
  "expert": {label:"10+ years", factor:1.22}
};

const CERT_FACTORS = {
  "none":  {label:"No certification", factor:1.00, note:"Certification typically adds 6–18%."},
  "cpb":   {label:"CPB (Certified Professional Biller)", factor:1.08, note:"AAPC billing credential; strong for revenue-cycle roles."},
  "cpc":   {label:"CPC (Certified Professional Coder)", factor:1.12, note:"AAPC coding credential; the most recognized coding cert."},
  "dual":  {label:"CPC + CPB (dual)", factor:1.18, note:"Coding + billing combo commands the highest premiums."},
  "crc":   {label:"CRC (Certified Risk Adjustment Coder)", factor:1.10, note:"High demand in Medicare Advantage / risk adjustment."},
  "ccs":   {label:"CCS (Certified Coding Specialist)", factor:1.15, note:"AHIMA inpatient credential; hospital roles pay more."},
  "cmrs":  {label:"CMRS (Certified Medical Reimbursement Specialist)", factor:1.06, note:"AMBA billing credential; good for office management."}
};

const SETTING_FACTORS = {
  "hospital":   {label:"Hospital / health system", factor:1.05},
  "physician":  {label:"Physician office / clinic", factor:1.00},
  "payer":      {label:"Insurance company / payer", factor:1.08},
  "billingco":  {label:"Billing company / RCM firm", factor:0.97},
  "remote":     {label:"Remote / work from home", factor:1.00}
};

// Certification profiles for quiz + reference
const CERTS = {
  cpc: {name:"CPC — Certified Professional Coder", org:"AAPC", cost:"~$399 exam (members); prep courses $1,500–$3,000",
        desc:"The gold standard for outpatient/physician coding. Best if you enjoy anatomy, guidelines, and detail work.",
        best:"Outpatient coding, physician offices, billing companies"},
  cpb: {name:"CPB — Certified Professional Biller", org:"AAPC", cost:"~$399 exam; prep courses $1,200–$2,500",
        desc:"Built for the billing side: claims, denials, AR follow-up, payer rules. Best if you like problem-solving and getting claims paid.",
        best:"Billing departments, RCM firms, clearinghouses"},
  crc: {name:"CRC — Certified Risk Adjustment Coder", org:"AAPC", cost:"~$399 exam; prep $1,000–$2,000",
        desc:"Specializes in HCC / risk-adjustment coding for Medicare Advantage. One of the fastest-growing, best-paid niches.",
        best:"Medicare Advantage plans, risk-adjustment vendors, remote roles"},
  ccs: {name:"CCS — Certified Coding Specialist", org:"AHIMA", cost:"~$399 exam; prep $1,500–$3,500",
        desc:"AHIMA's inpatient hospital credential. Harder exam, higher pay, hospital-focused.",
        best:"Hospitals, inpatient coding, health systems"},
  cmrs: {name:"CMRS — Certified Medical Reimbursement Specialist", org:"AMBA", cost:"~$325 exam; prep $800–$1,800",
        desc:"Billing-office management credential. Good path toward billing manager / practice administrator roles.",
        best:"Practice management, billing office leadership"},
  cbcs: {name:"CBCS — Certified Billing & Coding Specialist", org:"NHA", cost:"~$155 exam; prep often bundled with programs",
        desc:"Entry-level combined credential. A solid first step if you're brand new and want one exam covering both.",
        best:"Entry-level billing/coding jobs, career changers"}
};
