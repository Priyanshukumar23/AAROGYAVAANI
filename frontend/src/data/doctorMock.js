// Enriched, Mongo-ready mock data for the Doctor workflow.
// Shape mirrors future Mongo collections: patients, tokens/queue, cases, documents, alerts.
// Swap MOCK_* with API responses later — components consume via doctorApi.js, not directly.

export const AVG_CONSULT_MIN = 6;
export const ROOM_LABEL = 'Room 104';

// Queue patients: token, demographics, wait, priority, AI summary status.
// aiStatus: 'ready' | 'processing' | 'unavailable'
export const MOCK_OPD_QUEUE = [
  { tokenNo: 'A-127', name: 'Devendra Singh', age: 65, sex: 'M', gender: 'Male', complaint: 'Severe dizziness & HTN', priority: 'P1', waitMin: 0, wait: 'In chamber', status: 'in-chamber', aiStatus: 'ready', aiConfidence: 91 },
  { tokenNo: 'A-142', name: 'Ramesh Kumar Sharma', age: 48, sex: 'M', gender: 'Male', complaint: 'Severe chest discomfort with exertional dyspnea (~24h)', priority: 'P1', waitMin: 12, wait: '12 min', status: 'waiting', aiStatus: 'ready', aiConfidence: 96 },
  { tokenNo: 'A-130', name: 'Priya Patel', age: 29, sex: 'F', gender: 'Female', complaint: 'Acute right lower quadrant abdominal pain', priority: 'P2', waitMin: 29, wait: '29 min', status: 'waiting', aiStatus: 'ready', aiConfidence: 89 },
  { tokenNo: 'A-127B', name: 'Ramesh Kumar', age: 42, sex: 'M', gender: 'Male', complaint: 'Chest heaviness, exertional dyspnea', priority: 'P2', waitMin: 8, wait: '8 min', status: 'waiting', aiStatus: 'ready', aiConfidence: 96 },
  { tokenNo: 'A-128', name: 'Sunita Devi', age: 54, sex: 'F', gender: 'Female', complaint: 'Persistent dry cough, mild fever 3 days', priority: 'P3', waitMin: 18, wait: '18 min', status: 'waiting', aiStatus: 'processing', aiConfidence: null },
  { tokenNo: 'A-129', name: 'Mohammed Arif', age: 62, sex: 'M', gender: 'Male', complaint: 'Follow-up Type 2 Diabetes, fasting glucose check', priority: 'P3', waitMin: 24, wait: '24 min', status: 'waiting', aiStatus: 'unavailable', aiConfidence: null },
  { tokenNo: 'A-131', name: 'Kavita Rao', age: 35, sex: 'F', gender: 'Female', complaint: 'Migraine, photophobia 2 days', priority: 'P3', waitMin: 31, wait: '31 min', status: 'waiting', aiStatus: 'processing', aiConfidence: null },
];

export const MOCK_RED_FLAGS = [
  {
    id: 'a1',
    tokenNo: 'A-142',
    patientName: 'Ramesh Kumar Sharma',
    reason: 'Possible emergency symptoms detected — exertional chest heaviness 8/10 + dyspnea + HTN 150/94',
    severity: 'STAT',
    priority: 'P1',
    kind: 'Emergency',
  },
  {
    id: 'a2',
    tokenNo: 'A-130',
    patientName: 'Priya Patel',
    reason: 'Acute RLQ abdominal pain with flagged vitals — rule out appendicitis',
    severity: 'Urgent',
    priority: 'P2',
    kind: 'Urgent',
  },
];

export const MOCK_OCR_STACK = [
  { id: 'ocr1', fileName: 'Report_A142_CBC.pdf', status: 'processing', progress: 96, confidence: 96, label: 'OCR Processing · 96%' },
  { id: 'ocr2', fileName: 'Rx_2024_old.jpg', status: 'complete', progress: 100, confidence: 88, label: 'OCR Complete · 88%' },
  { id: 'ocr3', fileName: 'ECG_A142.png', status: 'queued', progress: 15, confidence: null, label: 'Queued' },
];

// Full clinical case per token — powers PatientCase / AI Summary / Docs / Timeline pages.
export const MOCK_PATIENT_CASES = {
  'A-142': {
    tokenNo: 'A-142',
    name: 'Ramesh Kumar Sharma',
    age: 48,
    sex: 'M',
    aiConfidence: 96,
    aiStatus: 'ready',
    chiefComplaint: 'Severe chest discomfort with exertional dyspnea (~24h).',
    hpi: 'Sudden retrosternal heaviness after climbing stairs, pressing quality, radiates to left shoulder + jaw, 8/10 at peak, 5–10 min episodes ×3 in 24h, provoked by exertion/cold.',
    pastHistory: 'Hypertension on Amlodipine 5mg OD · Dyslipidemia on Atorvastatin 10mg HS · No known diabetes.',
    medications: ['Amlodipine 5mg OD', 'Atorvastatin 10mg HS'],
    allergies: ['Penicillin — rash / anaphylaxis risk (avoid amoxicillin & penicillins)'],
    familyHistory: 'Father: CAD at 58 · Mother: Hypertension.',
    reviewOfSystems: 'Diaphoresis + · Orthopnea − · Palpitations − · Fever − · Cough −.',
    redFlags: ['Suspected ACS · HEART ~6 (high)', 'HTN 150/94', 'Penicillin allergy'],
    documents: ['Report_A142_CBC.pdf', 'Rx_2024_old.jpg', 'ECG_A142.png'],
    timeline: ['Today · Kiosk intake — P1 triage, vitals synced, ECG ordered', 'Mar 2025 · HTN follow-up · BP 146/92', 'Nov 2024 · Lipids: LDL 148, HbA1c 6.1'],
  },
  'A-130': {
    tokenNo: 'A-130',
    name: 'Priya Patel',
    age: 29,
    sex: 'F',
    aiConfidence: 89,
    aiStatus: 'ready',
    chiefComplaint: 'Acute right lower quadrant abdominal pain.',
    hpi: 'Acute RLQ pain, 12h, sharp, worsened by movement, with nausea. No fever reported at triage.',
    pastHistory: 'No chronic illness · No prior surgery.',
    medications: [],
    allergies: ['None recorded'],
    familyHistory: 'Non-contributory.',
    reviewOfSystems: 'Nausea + · Vomiting − · Fever − · Dysuria −.',
    redFlags: ['Acute abdomen — rule out appendicitis'],
    documents: [],
    timeline: ['Today · Kiosk intake — P2 triage'],
  },
};

export function priorityLabel(p) {
  if (p === 'P1') return 'Priority 1 · Emergency';
  if (p === 'P2') return 'Priority 2 · Urgent';
  return 'Routine';
}

export function aiStatusLabel(s, conf) {
  if (s === 'ready') return conf ? `AI Summary Ready · ${conf}%` : 'AI Summary Ready';
  if (s === 'processing') return 'Processing';
  return 'Not Available';
}
