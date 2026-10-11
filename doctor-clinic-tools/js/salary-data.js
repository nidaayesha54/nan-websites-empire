// Doctor salary data — approximate 2026 figures based on Medscape Physician
// Compensation Report & BLS Occupational Employment data patterns.
const SPECIALTIES = [
  { id: 'orthopedics', name: 'Orthopedic Surgery', salary: 655000, residency: 5 },
  { id: 'cardiology', name: 'Cardiology', salary: 475000, residency: 6 },
  { id: 'urology', name: 'Urology', salary: 480000, residency: 5 },
  { id: 'gastroenterology', name: 'Gastroenterology', salary: 500000, residency: 6 },
  { id: 'radiology', name: 'Radiology', salary: 470000, residency: 5 },
  { id: 'anesthesiology', name: 'Anesthesiology', salary: 460000, residency: 4 },
  { id: 'oncology', name: 'Oncology (Hematology)', salary: 460000, residency: 6 },
  { id: 'dermatology', name: 'Dermatology', salary: 455000, residency: 4 },
  { id: 'ophthalmology', name: 'Ophthalmology', salary: 430000, residency: 4 },
  { id: 'general-surgery', name: 'General Surgery', salary: 425000, residency: 5 },
  { id: 'emergency-medicine', name: 'Emergency Medicine', salary: 390000, residency: 4 },
  { id: 'obgyn', name: 'Obstetrics & Gynecology', salary: 370000, residency: 4 },
  { id: 'neurology', name: 'Neurology', salary: 340000, residency: 4 },
  { id: 'internal-medicine', name: 'Internal Medicine', salary: 330000, residency: 3 },
  { id: 'psychiatry', name: 'Psychiatry', salary: 320000, residency: 4 },
  { id: 'family-medicine', name: 'Family Medicine', salary: 305000, residency: 3 },
  { id: 'pediatrics', name: 'Pediatrics', salary: 270000, residency: 3 }
];

// Approximate regional pay adjustment factors (1.00 = national average),
// reflecting published Medscape/BLS regional compensation patterns.
const STATE_FACTORS = {
  'Alabama': 0.98, 'Alaska': 1.20, 'Arizona': 1.05, 'Arkansas': 0.95,
  'California': 1.15, 'Colorado': 1.08, 'Connecticut': 1.05, 'Delaware': 1.05,
  'District of Columbia': 1.10, 'Florida': 1.00, 'Georgia': 1.02, 'Hawaii': 1.12,
  'Idaho': 1.08, 'Illinois': 1.05, 'Indiana': 1.08, 'Iowa': 1.10,
  'Kansas': 1.08, 'Kentucky': 0.98, 'Louisiana': 0.98, 'Maine': 1.05,
  'Maryland': 1.02, 'Massachusetts': 1.02, 'Michigan': 1.05, 'Minnesota': 1.08,
  'Mississippi': 0.95, 'Missouri': 1.05, 'Montana': 1.10, 'Nebraska': 1.10,
  'Nevada': 1.08, 'New Hampshire': 1.08, 'New Jersey': 1.05, 'New Mexico': 1.05,
  'New York': 1.08, 'North Carolina': 1.02, 'North Dakota': 1.12, 'Ohio': 1.02,
  'Oklahoma': 1.02, 'Oregon': 1.08, 'Pennsylvania': 1.02, 'Rhode Island': 1.00,
  'South Carolina': 1.00, 'South Dakota': 1.12, 'Tennessee': 1.00, 'Texas': 1.05,
  'Utah': 1.08, 'Vermont': 1.05, 'Virginia': 1.02, 'Washington': 1.08,
  'West Virginia': 0.95, 'Wisconsin': 1.10, 'Wyoming': 1.15
};

function specialtyById(id) {
  for (var i = 0; i < SPECIALTIES.length; i++) {
    if (SPECIALTIES[i].id === id) return SPECIALTIES[i];
  }
  return null;
}
