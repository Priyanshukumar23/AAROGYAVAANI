// In-memory fallback store (used when MongoDB is unavailable).
// Mirrors the shape of the Mongoose collections so the API works out-of-the-box.
let seq = 142;
const store = {
  patients: [
    { _id: 'p1', name: 'Ramesh Kumar Sharma', age: 48, gender: 'Male', mobile: '+91 98765 43210', abhaId: '91-4582-9012-3456', uhid: 'AIIMS-2025-08492', state: 'Delhi', city: 'South Delhi', language: 'Hindi' },
    { _id: 'p2', name: 'Priya Patel', age: 29, gender: 'Female', mobile: '+91 98250 11223', abhaId: '91-4402-8819-2042', uhid: 'AIIMS-2024-9102', state: 'Gujarat', city: 'Ahmedabad', language: 'Gujarati' },
    { _id: 'p3', name: 'Sunita Devi', age: 54, gender: 'Female', mobile: '+91 98111 22334', abhaId: '91-4402-8819-2043', uhid: 'AIIMS-2024-8119', state: 'Delhi', city: 'Central Delhi', language: 'Hindi' }
  ],
  tokens: [
    { _id: 't1', tokenNo: 'A-127', patientName: 'Devendra Singh', uhid: 'AIIMS-2024-0829', department: 'General Medicine', room: 'Room 104', doctor: 'Dr. Rajesh Sharma', priority: 'P2', status: 'in-chamber', chiefComplaint: 'Severe dizziness & HTN', position: 0, estimatedWaitMin: 0 },
    { _id: 't2', tokenNo: 'A-142', patientName: 'Ramesh Kumar Sharma', uhid: 'AIIMS-2025-08492', department: 'General Medicine', room: 'Room 104', doctor: 'Dr. Rajesh Sharma', priority: 'P1', status: 'waiting', chiefComplaint: 'Severe chest discomfort with exertional dyspnea (~24h)', position: 14, estimatedWaitMin: 42, vitals: { bp: '150/94', hr: 88, spo2: 98, temp: '98.4 F', rr: 18, pain: 8 } },
    { _id: 't3', tokenNo: 'A-130', patientName: 'Priya Patel', uhid: 'AIIMS-2024-9102', department: 'General Medicine', room: 'Room 104', doctor: 'Dr. Rajesh Sharma', priority: 'P2', status: 'waiting', chiefComplaint: 'Acute right lower quadrant abdominal pain', position: 3, estimatedWaitMin: 29 },
    { _id: 't4', tokenNo: 'A-128', patientName: 'Sunita Devi', uhid: 'AIIMS-2024-8119', department: 'General Medicine', room: 'Room 104', doctor: 'Dr. Rajesh Sharma', priority: 'P3', status: 'waiting', chiefComplaint: 'Persistent dry cough, mild fever 3 days', position: 1, estimatedWaitMin: 18 },
    { _id: 't5', tokenNo: 'A-129', patientName: 'Mohammed Arif', uhid: 'AIIMS-2024-6512', department: 'General Medicine', room: 'Room 104', doctor: 'Dr. Rajesh Sharma', priority: 'P3', status: 'waiting', chiefComplaint: 'Follow-up Type 2 Diabetes, fasting glucose check', position: 2, estimatedWaitMin: 24 }
  ],
  intakes: [],
  docs: [
    { _id: 'd1', tokenNo: 'A-142', category: 'Outpatient Prescription', hospital: 'AIIMS New Delhi Cardiology', doctor: 'Dr. A. K. Verma', date: '12 July 2025', medicines: [{ name: 'Telmisartan 40mg', dose: 'OD' }, { name: 'Metformin 500mg', dose: 'BD' }], ocrConfidence: 89 },
    { _id: 'd2', tokenNo: 'A-142', category: 'Lab Report', hospital: 'Max Lab', doctor: '', date: '18 Aug 2025', labs: [{ name: 'Hemoglobin', value: '10.2 g/dL', flag: 'low' }, { name: 'Fasting Glucose', value: '148 mg/dL', flag: 'high' }], ocrConfidence: 92 }
  ],
  consultations: [],
  staff: [
    { staffId: 'DOC-104', password: 'doctor123', name: 'Dr. Rajesh Sharma', role: 'doctor', department: 'General Medicine', room: 'Room 104' },
    { staffId: 'NUR-88421', password: 'nurse123', name: 'Sr. Nurse Meena Kumari', role: 'nurse', department: 'Triage', room: 'Counter 02' },
    { staffId: 'ADM-01', password: 'admin123', name: 'Dr. Vikramaditya Sen', role: 'admin', department: 'Administration', room: 'Exec Node #04' }
  ],
  alerts: [
    { _id: 'a1', tokenNo: 'A-142', patientName: 'Ramesh Kumar Sharma', type: 'red-flag', priority: 'P1', message: 'Acute chest heaviness 8/10 with exertional breathlessness + penicillin anaphylaxis history', acknowledged: false },
    { _id: 'a2', tokenNo: 'A-130', patientName: 'Priya Patel', type: 'red-flag', priority: 'P2', message: 'Acute RLQ abdominal pain, flagged vitals', acknowledged: false }
  ],
  kiosks: [
    { kioskId: 'KSK-01', location: 'Main OPD Lobby, Ground Floor', status: 'online', step: 'Patient Intake Active (Step 3)', battery: 92, latencyMs: 12, paperRoll: 78 },
    { kioskId: 'KSK-02', location: 'Cardiology Wing Block B', status: 'online', step: 'Waiting Next Token', battery: 78, latencyMs: 14, paperRoll: 64 },
    { kioskId: 'KSK-03', location: 'Emergency Triage Bay', status: 'online', step: 'Audio Assisted Interview (Hindi)', battery: 88, latencyMs: 14, paperRoll: 14 }
  ]
};
function nextTokenNo() { seq += 1; return 'A-' + seq; }
module.exports = { store, nextTokenNo };
