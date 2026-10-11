/* Nurse salary dataset — estimates based on U.S. Bureau of Labor Statistics
   Occupational Employment & Wage Statistics (May 2024), adjusted to 2026
   levels. Figures are national/state MEAN annual wages for Registered Nurses
   (SOC 29-1141). Specialty and experience adjustments are modeled from
   published BLS + Medscape salary report differentials. Treat as estimates. */
const NURSE_DATA = {
  source: "BLS OEWS May 2024, adjusted to 2026; specialty differentials modeled from Medscape/BLS reports",
  baseRN: 101000, // national mean estimate 2026
  states: {
    "California":146550,"Hawaii":119710,"Massachusetts":109770,"Oregon":108110,
    "Alaska":107210,"New York":106840,"Washington":105400,"District of Columbia":109000,
    "New Jersey":102330,"Connecticut":101250,"Minnesota":98330,"Nevada":97020,
    "Maryland":96470,"Rhode Island":95400,"New Hampshire":94000,"Vermont":94600,
    "Pennsylvania":93400,"Delaware":92700,"Colorado":92200,"Texas":91700,
    "Arizona":91200,"Illinois":90100,"Virginia":89400,"Ohio":88600,
    "Florida":87700,"North Carolina":86700,"Georgia":85800,"Michigan":84200,
    "Tennessee":84600,"South Carolina":83500,"Indiana":82900,"Missouri":82300,
    "Wisconsin":82000,"Nebraska":81000,"New Mexico":80500,"Louisiana":80000,
    "Wyoming":79600,"Idaho":79400,"Montana":79000,"Iowa":78900,"Utah":78700,
    "North Dakota":78600,"Maine":83000,"Kansas":78000,"Oklahoma":77000,
    "Arkansas":76000,"Kentucky":75000,"Mississippi":74000,"Alabama":73000,
    "West Virginia":72000,"South Dakota":71000
  },
  specialties: {
    "Staff RN / Med-Surg":1.00,
    "Emergency (ED/ER)":1.08,
    "ICU / Critical Care":1.10,
    "Operating Room (OR)":1.09,
    "Labor & Delivery":1.07,
    "Oncology":1.06,
    "Psychiatric / Mental Health":1.04,
    "Pediatrics":0.97,
    "Home Health":0.95,
    "School Nurse":0.90,
    "Nurse Educator":0.96,
    "Case Management":1.03,
    "Nurse Manager":1.12
  },
  experience: {
    "0–2 years":0.90,"3–5 years":1.00,"6–9 years":1.08,"10–14 years":1.14,
    "15–19 years":1.18,"20+ years":1.22
  },
  education: {"ADN / Diploma":0.97,"BSN":1.03,"MSN":1.12}
};

function fmtUSD(n){return "$"+Math.round(n).toLocaleString("en-US");}
