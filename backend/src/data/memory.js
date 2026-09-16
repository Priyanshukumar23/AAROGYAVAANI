// In-memory fallback store (used when MongoDB is unavailable).
// Mirrors the shape of the Mongoose collections so the API works out-of-the-box.
let seq = 142;
const store = {
  patients: [
    { _id: 'p0', name: 'Priyansh', age: 24, gender: 'Male', mobile: '+91 12345 56789', abhaId: '1234556789', uhid: 'AIIMS-2026-99999', state: 'Punjab', city: 'Jalandhar', language: 'English' },
    { _id: 'p1', name: 'Ramesh Kumar Sharma', age: 48, gender: 'Male', mobile: '+91 98765 43210', abhaId: '91-4582-9012-3456', uhid: 'AIIMS-2025-08492', state: 'Delhi', city: 'South Delhi', language: 'Hindi' },
    { _id: 'p2', name: 'Priya Patel', age: 29, gender: 'Female', mobile: '+91 98250 11223', abhaId: '91-4402-8819-2042', uhid: 'AIIMS-2024-9102', state: 'Gujarat', city: 'Ahmedabad', language: 'Gujarati' },
    { _id: 'p3', name: 'Sunita Devi', age: 54, gender: 'Female', mobile: '+91 98111 22334', abhaId: '91-4402-8819-2043', uhid: 'AIIMS-2024-8119', state: 'Delhi', city: 'Central Delhi', language: 'Hindi' }
  ],
  tokens: [],
  intakes: [],
  docs: [],
  consultations: [],
  staff: [
    { staffId: 'DOC-104', password: 'doctor123', name: 'Dr. Rajesh Sharma', role: 'doctor', department: 'General Medicine', room: 'Room 104' },
    { staffId: 'NUR-88421', password: 'nurse123', name: 'Sr. Nurse Meena Kumari', role: 'nurse', department: 'Triage', room: 'Counter 02' },
    { staffId: 'ADM-01', password: 'admin123', name: 'Dr. Vikramaditya Sen', role: 'admin', department: 'Administration', room: 'Exec Node #04' }
  ],
  alerts: [
    { _id: 'a1', tokenNo: 'A-142', patientName: 'Ramesh Kumar Sharma', type: 'red-flag', priority: 'P1', severity: 'STAT', kind: 'Emergency', reason: 'Possible emergency symptoms detected — exertional chest heaviness 8/10 + dyspnea + HTN 150/94', message: 'Acute chest heaviness 8/10 with exertional breathlessness + penicillin anaphylaxis history', acknowledged: false },
    { _id: 'a2', tokenNo: 'A-130', patientName: 'Priya Patel', type: 'red-flag', priority: 'P2', severity: 'Urgent', kind: 'Urgent', reason: 'Acute RLQ abdominal pain with flagged vitals — rule out appendicitis', message: 'Acute RLQ abdominal pain, flagged vitals', acknowledged: false }
  ],
  kiosks: [
    { kioskId: 'KSK-01', location: 'Main OPD Lobby, Ground Floor', status: 'online', step: 'Patient Intake Active (Step 3)', battery: 92, latencyMs: 12, paperRoll: 78 },
    { kioskId: 'KSK-02', location: 'Cardiology Wing Block B', status: 'online', step: 'Waiting Next Token', battery: 78, latencyMs: 14, paperRoll: 64 },
    { kioskId: 'KSK-03', location: 'Emergency Triage Bay', status: 'online', step: 'Audio Assisted Interview (Hindi)', battery: 88, latencyMs: 14, paperRoll: 14 }
  ]
};
function nextTokenNo() { seq += 1; return 'A-' + seq; }
module.exports = { store, nextTokenNo };
