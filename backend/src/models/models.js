const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  mobile: String,
  abhaId: String,
  uhid: { type: String, unique: true },
  state: String,
  city: String,
  language: { type: String, default: 'English' },
  createdAt: { type: Date, default: Date.now }
});

const tokenSchema = new mongoose.Schema({
  tokenNo: { type: String, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  patientName: String,
  uhid: String,
  department: { type: String, default: 'General Medicine' },
  room: { type: String, default: 'Room 104' },
  doctor: { type: String, default: 'Dr. Rajesh Sharma' },
  priority: { type: String, enum: ['P1', 'P2', 'P3'], default: 'P3' },
  status: { type: String, enum: ['waiting', 'in-chamber', 'triage', 'completed', 'called'], default: 'waiting' },
  chiefComplaint: String,
  vitals: Object,
  position: Number,
  estimatedWaitMin: Number,
  createdAt: { type: Date, default: Date.now }
});

const intakeSchema = new mongoose.Schema({
  tokenNo: String,
  uhid: String,
  language: String,
  chiefComplaint: String,
  symptoms: [String],
  aiFollowUp: Object,
  symptomDetails: Object,
  pastHistory: Object,
  medications: [String],
  allergies: [String],
  redFlag: { type: Boolean, default: false },
  transcript: Array,
  aiSummary: String,
  status: { type: String, default: 'draft' },
  createdAt: { type: Date, default: Date.now }
});

const documentSchema = new mongoose.Schema({
  tokenNo: String,
  uhid: String,
  category: String,
  hospital: String,
  doctor: String,
  date: String,
  diagnosis: [Object],
  medicines: [Object],
  labs: [Object],
  ocrConfidence: Number,
  status: { type: String, default: 'digitized' },
  createdAt: { type: Date, default: Date.now }
});

const consultationSchema = new mongoose.Schema({
  tokenNo: String,
  uhid: String,
  doctor: String,
  diagnosis: String,
  prescription: [Object],
  advice: String,
  followUpDays: Number,
  status: { type: String, default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

const staffSchema = new mongoose.Schema({
  name: String,
  staffId: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['doctor', 'nurse', 'admin'], default: 'doctor' },
  department: String,
  room: String,
  onDuty: { type: Boolean, default: true }
});

const alertSchema = new mongoose.Schema({
  tokenNo: String,
  patientName: String,
  type: { type: String, enum: ['red-flag', 'vitals', 'doctor-request', 'system'], default: 'red-flag' },
  priority: { type: String, default: 'P1' },
  message: String,
  acknowledged: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const kioskSchema = new mongoose.Schema({
  kioskId: { type: String, unique: true },
  location: String,
  status: { type: String, default: 'online' },
  step: String,
  battery: Number,
  latencyMs: Number,
  paperRoll: Number,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = {
  Patient: mongoose.model('Patient', patientSchema),
  Token: mongoose.model('Token', tokenSchema),
  Intake: mongoose.model('Intake', intakeSchema),
  MedDoc: mongoose.model('MedDoc', documentSchema),
  Consultation: mongoose.model('Consultation', consultationSchema),
  Staff: mongoose.model('Staff', staffSchema),
  Alert: mongoose.model('Alert', alertSchema),
  Kiosk: mongoose.model('Kiosk', kioskSchema)
};
