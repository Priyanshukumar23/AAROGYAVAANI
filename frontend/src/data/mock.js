export const LANGUAGES = [
  { code: 'en', label: 'English', greet: 'Hello · Welcome' },
  { code: 'hi', label: 'हिन्दी', greet: 'नमस्ते · स्वागत है' },
  { code: 'ta', label: 'தமிழ்', greet: 'வணக்கம்' },
  { code: 'te', label: 'తెలుగు', greet: 'నమస్కారం' },
  { code: 'kn', label: 'ಕನ್ನಡ', greet: 'ನಮಸ್ಕಾರ' },
  { code: 'bn', label: 'বাংলা', greet: 'নমস্কার' },
  { code: 'gu', label: 'ગુજરાતી', greet: 'નમસ્તે' },
  { code: 'ml', label: 'മലയാളം', greet: 'നമസ്കാരം' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', greet: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ' }
];

export const DEPARTMENTS = [
  { id: 'general', name: 'General Medicine', hi: 'सामान्य चिकित्सा', desc: 'Fever, cough, BP, health check', icon: '🩺', room: 'Room 104' },
  { id: 'ortho', name: 'Orthopedics', hi: 'हड्डी रोग', desc: 'Bone, joints, fracture, back pain', icon: '🦴', room: 'Room 201' },
  { id: 'peds', name: 'Pediatrics / Child', hi: 'बाल रोग', desc: 'Children and infant health', icon: '🧒', room: 'Room 112' },
  { id: 'eye', name: 'Eye Care', hi: 'नेत्र रोग', desc: 'Vision, eye redness, irritation', icon: '👁️', room: 'Room 118' },
  { id: 'ent', name: 'ENT', hi: 'नाक, कान, गला', desc: 'Ear, nose, throat', icon: '👂', room: 'Room 121' },
  { id: 'dental', name: 'Dental', hi: 'दंत चिकित्सा', desc: 'Teeth, mouth pain', icon: '🦷', room: 'Room 130' }
];

export const SYMPTOMS = [
  { id: 'chest', label: 'Chest pain / heaviness', icon: '❤️' },
  { id: 'breath', label: 'Breathlessness', icon: '😮‍💨' },
  { id: 'fever', label: 'Fever', icon: '🌡️' },
  { id: 'cough', label: 'Cough / Cold', icon: '🤧' },
  { id: 'abdomen', label: 'Abdominal pain', icon: '🤰' },
  { id: 'headache', label: 'Headache / Migraine', icon: '🤕' },
  { id: 'bp', label: 'BP / Sugar review', icon: '💓' },
  { id: 'joint', label: 'Joint / Back pain', icon: '🦵' },
  { id: 'skin', label: 'Skin / Allergy', icon: '🖐️' }
];

export const MOCK_QUEUE = [
  { tokenNo: 'A-127', name: 'Devendra Singh', age: 65, sex: 'M', complaint: 'Severe dizziness & HTN', priority: 'P1', wait: 'In chamber', status: 'in-chamber' },
  { tokenNo: 'A-142', name: 'Ramesh Kumar Sharma', age: 48, sex: 'M', complaint: 'Severe chest discomfort with exertional dyspnea (~24h)', priority: 'P1', wait: '12 min', status: 'waiting' },
  { tokenNo: 'A-130', name: 'Priya Patel', age: 29, sex: 'F', complaint: 'Acute right lower quadrant abdominal pain', priority: 'P2', wait: '29 min', status: 'waiting' },
  { tokenNo: 'A-128', name: 'Sunita Devi', age: 54, sex: 'F', complaint: 'Persistent dry cough, mild fever 3 days', priority: 'P3', wait: '18 min', status: 'waiting' },
  { tokenNo: 'A-129', name: 'Mohammed Arif', age: 62, sex: 'M', complaint: 'Follow-up Type 2 Diabetes, fasting glucose check', priority: 'P3', wait: '24 min', status: 'waiting' }
];

export const MOCK_VITALS = [
  { k: 'Blood Pressure', v: '150/94 mmHg', s: 'Stage 2 HTN · Outside range', warn: 'warn' },
  { k: 'Heart Rate', v: '88 bpm', s: 'Regular · 60–100 target', warn: '' },
  { k: 'SpO2 (Room Air)', v: '98%', s: 'Normal · >95% target', warn: '' },
  { k: 'Temperature', v: '98.4 °F', s: 'Afebrile / Normal', warn: '' },
  { k: 'Respiratory Rate', v: '18 /min', s: 'Normal · 12–20 target', warn: '' },
  { k: 'Pain (VAS)', v: '8 / 10', s: 'Severe chest pain', warn: 'warn' }
];

export const STAFF_LINKS = {
  doctor: [
    { to: '/doctor/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/doctor/queue', label: 'OPD Queue · 24 Live', icon: '👥' },
    { to: '/doctor/case/A-142', label: 'Patients & Cases', icon: '📂' },
    { to: '/doctor/alerts', label: 'Red Flag Alerts', icon: '⚠️' },
    { to: '/doctor/documents', label: 'Medical Documents & OCR', icon: '📄' },
    { to: '/doctor/timeline/A-142', label: 'Clinical Timeline', icon: '🕒' },
    { to: '/doctor/workspace', label: 'Consultation Workspace', icon: '🩺' },
    { to: '/admin/analytics', label: 'Reports & Analytics', icon: '📈' }
  ],
  nurse: [
    { to: '/triage/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/triage/queue', label: 'Triage Queue · 8 Waiting', icon: '📋' },
    { to: '/triage/assessment/A-142', label: 'Patients & Intake', icon: '📂' },
    { to: '/triage/vitals/A-142', label: 'Vital Signs', icon: '💓' },
    { to: '/triage/alerts', label: 'Alerts & Red Flags', icon: '🔔' },
    { to: '/doctor/documents', label: 'Documents', icon: '📄' },
    { to: '/triage/history', label: 'Reports & History', icon: '📈' }
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Overview / Dashboard', icon: '📊' },
    { to: '/admin/kiosks', label: 'Kiosk Fleet', icon: '🖥️' },
    { to: '/admin/staff', label: 'Staff & Doctors', icon: '🩺' },
    { to: '/admin/opd', label: 'OPD Operations', icon: '🏥' },
    { to: '/admin/analytics', label: 'Analytics & Reports', icon: '📈' },
    { to: '/admin/audit', label: 'Audit & Access', icon: '🛡️' },
    { to: '/admin/settings', label: 'System & Compliance', icon: '⚙️' },
    { to: '/admin/alerts', label: 'Alert Center', icon: '🔔' }
  ]
};
