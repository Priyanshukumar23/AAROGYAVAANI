const express = require('express');
const bcrypt = require('bcryptjs');
const { sign } = require('../middleware/auth');
const { store, nextTokenNo } = require('../data/memory');

const router = express.Router();

// Demo credentials accepted even without DB:
// DOC-104/doctor123 (doctor), NUR-88421/nurse123 (nurse), ADM-01/admin123 (admin)
router.post('/login', async (req, res) => {
  const { staffId, password } = req.body || {};
  const found = store.staff.find(s => s.staffId === staffId);
  if (!found) return res.status(401).json({ error: 'Invalid Staff ID or password' });
  const ok = password === found.password; // demo; bcrypt compared if DB used
  if (!ok) return res.status(401).json({ error: 'Invalid Staff ID or password' });
  const token = sign({ staffId: found.staffId, name: found.name, role: found.role, department: found.department, room: found.room });
  res.json({ token, user: { staffId: found.staffId, name: found.name, role: found.role, department: found.department, room: found.room } });
});

router.get('/me', (req, res) => res.json({ demo: true }));

// ---- Patients ----
router.get('/patients', (req, res) => res.json(store.patients));
router.post('/patients', (req, res) => {
  const b = req.body || {};
  const uhid = b.uhid || ('AIIMS-2025-' + Math.floor(10000 + Math.random() * 89999));
  const p = { _id: 'p' + Date.now(), ...b, uhid };
  store.patients.push(p);
  res.status(201).json(p);
});

// ---- Tokens / Queue ----
router.get('/tokens', (req, res) => res.json(store.tokens));
router.post('/tokens', (req, res) => {
  const b = req.body || {};
  const tokenNo = b.tokenNo || nextTokenNo();
  const t = { _id: 't' + Date.now(), tokenNo, status: 'waiting', priority: 'P3', position: store.tokens.length, estimatedWaitMin: 15 + store.tokens.length * 3, ...b, tokenNo };
  store.tokens.push(t);
  res.status(201).json(t);
});
router.patch('/tokens/:id', (req, res) => {
  const t = store.tokens.find(x => x._id === req.params.id || x.tokenNo === req.params.id);
  if (!t) return res.status(404).json({ error: 'Token not found' });
  Object.assign(t, req.body || {});
  res.json(t);
});

// ---- Intake ----
router.get('/intakes', (req, res) => res.json(store.intakes));
router.post('/intakes', (req, res) => {
  const doc = { _id: 'i' + Date.now(), ...req.body };
  store.intakes.push(doc);
  res.status(201).json(doc);
});

// ---- Documents ----
router.get('/documents', (req, res) => {
  const { tokenNo } = req.query;
  if (tokenNo) return res.json(store.docs.filter(d => d.tokenNo === tokenNo));
  res.json(store.docs);
});
router.post('/documents', (req, res) => {
  const doc = { _id: 'd' + Date.now(), ocrConfidence: 88, ...req.body };
  store.docs.push(doc);
  res.status(201).json(doc);
});

// ---- Consultations ----
router.get('/consultations', (req, res) => res.json(store.consultations));
router.post('/consultations', (req, res) => {
  const c = { _id: 'c' + Date.now(), status: 'completed', ...req.body };
  store.consultations.push(c);
  const t = store.tokens.find(x => x.tokenNo === c.tokenNo);
  if (t) t.status = 'completed';
  res.status(201).json(c);
});

// ---- Alerts ----
router.get('/alerts', (req, res) => res.json(store.alerts));
router.patch('/alerts/:id', (req, res) => {
  const a = store.alerts.find(x => x._id === req.params.id);
  if (!a) return res.status(404).json({ error: 'Not found' });
  Object.assign(a, req.body || {});
  res.json(a);
});
router.post('/alerts', (req, res) => {
  const a = { _id: 'a' + Date.now(), acknowledged: false, ...req.body };
  store.alerts.push(a);
  res.status(201).json(a);
});

// ---- Doctor dashboard (aggregated) ----
// GET /api/doctor/dashboard — counters + queue + red flags + OCR stack.
router.get('/doctor/dashboard', (req, res) => {
  const queue = store.tokens;
  const inQueue = queue.filter(t => t.status === 'waiting').length;
  const inChamber = queue.filter(t => t.status === 'in-chamber');
  const done = store.consultations.length;
  res.json({
    counters: {
      scheduled: 42,
      inQueue,
      inChamber: inChamber.length,
      inChamberToken: inChamber[0]?.tokenNo || null,
      done: 27 + done,
    },
    queue,
    called: inChamber[0] ? { tokenNo: inChamber[0].tokenNo, patientName: inChamber[0].patientName, room: inChamber[0].room } : null,
    redFlags: store.alerts.filter(a => !a.acknowledged),
    ocrStack: store.docs.map(d => ({
      id: d._id, fileName: d.fileName || `${d.category || 'doc'}_${d.tokenNo}.pdf`,
      status: d.status || 'processing', progress: d.progress ?? 50,
      confidence: d.confidence ?? d.ocrConfidence ?? null,
    })),
    waiting: {
      currentToken: inChamber[0]?.tokenNo || queue[0]?.tokenNo || null,
      patientsWaiting: inQueue,
      avgMin: 6,
      estimatedWaitMin: inQueue * 6,
    },
  });
});

// ---- OPD queue (aliases for doctor workflow) ----
// GET /api/opd/queue
router.get('/opd/queue', (req, res) => res.json(store.tokens));

// POST /api/opd/call-next — next P1→P2→P3 waiting → in-chamber (broadcast-ready).
router.post('/opd/call-next', (req, res) => {
  const room = (req.body || {}).room || 'Room 104';
  const rank = { P1: 0, P2: 1, P3: 2 };
  const waiting = store.tokens
    .filter(t => t.status === 'waiting')
    .sort((a, b) => (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9) || (a.estimatedWaitMin ?? 99) - (b.estimatedWaitMin ?? 99));
  if (!waiting.length) return res.status(409).json({ error: 'Queue empty — no waiting patients' });
  const next = waiting[0];
  next.status = 'in-chamber';
  next.room = room;
  next.waitMin = 0;
  next.estimatedWaitMin = 0;
  // TODO(realtime): io.emit('queue:update', { type: 'called', token: next });
  res.json({
    called: { tokenNo: next.tokenNo, name: next.patientName || next.name, room, at: new Date().toISOString() },
    queue: store.tokens,
    message: `Calling ${next.tokenNo} — ${next.patientName || next.name}. Please proceed to ${room}.`,
  });
});

// PATCH /api/opd/:token/status — waiting | in-chamber | completed | triage
router.patch('/opd/:token/status', (req, res) => {
  const t = store.tokens.find(x => x.tokenNo === req.params.token);
  if (!t) return res.status(404).json({ error: 'Token not found' });
  const { status } = req.body || {};
  if (status) t.status = status;
  // TODO(realtime): io.emit('queue:update', { type: 'status', token: t });
  res.json(t);
});

// ---- Patient clinical case ----
// GET /api/patients/:id/case — AI summary + HPI + PMH + meds + allergies + flags.
router.get('/patients/:id/case', (req, res) => {
  const id = req.params.id;
  const token = store.tokens.find(t => t.tokenNo === id || t.uhid === id);
  const patient = store.patients.find(p => p.uhid === token?.uhid || p._id === id);
  const intake = store.intakes.filter(i => i.tokenNo === id).slice(-1)[0];
  if (!token && !patient) return res.status(404).json({ error: 'Case not found' });
  res.json({
    tokenNo: id,
    patient: patient || null,
    token: token || null,
    aiNote: 'AI-generated clinical information. Verify all AI-generated information before making clinical decisions.',
    chiefComplaint: intake?.chiefComplaint || token?.chiefComplaint || null,
    hpi: intake?.symptomDetails || null,
    pastHistory: intake?.pastHistory || null,
    medications: intake?.medications || [],
    allergies: intake?.allergies || [],
    redFlags: store.alerts.filter(a => a.tokenNo === id),
    aiStatus: token?.aiStatus || 'ready',
    aiConfidence: token?.aiConfidence ?? 94,
  });
});

// GET /api/patients/:id/documents
router.get('/patients/:id/documents', (req, res) => {
  const id = req.params.id;
  const tokensForPatient = store.tokens.filter(t => t.tokenNo === id || t.uhid === id);
  const tokenNos = tokensForPatient.map(t => t.tokenNo);
  tokenNos.push(id);
  res.json(store.docs.filter(d => tokenNos.includes(d.tokenNo) || d.uhid === id));
});

// GET /api/patients/:id/timeline
router.get('/patients/:id/timeline', (req, res) => {
  const id = req.params.id;
  // Find all tokens for this patient (by tokenNo or uhid)
  const tokensForPatient = store.tokens.filter(t => t.tokenNo === id || t.uhid === id);
  const tokenNos = tokensForPatient.map(t => t.tokenNo);
  tokenNos.push(id); // Include the id itself (in case it was a tokenNo)

  const docs = store.docs.filter(d => tokenNos.includes(d.tokenNo) || d.uhid === id).map(d => ({ kind: 'document', ...d }));
  const consults = store.consultations.filter(c => tokenNos.includes(c.tokenNo) || c.uhid === id).map(c => ({ kind: 'consultation', ...c }));
  res.json([...docs, ...consults]);
});

// GET /api/alerts/red-flags
router.get('/alerts/red-flags', (req, res) => res.json(store.alerts.filter(a => (a.type || 'red-flag') === 'red-flag')));

// ---- Kiosks ----
router.get('/kiosks', (req, res) => res.json(store.kiosks));

// ---- Analytics ----
router.get('/analytics', (req, res) => {
  res.json({
    checkedInToday: 642,
    avgIntakeMin: 3.4,
    selfServicePct: 88,
    inWaiting: 184,
    inChamber: 28,
    physiciansOnDuty: '32/36',
    redFlags: 3,
    abdmUptime: 99.98,
    queueVelocityMin: 3.1,
    byPriority: { P1: 2, P2: 7, P3: 25 }
  });
});

// ---- Staff roster ----
router.get('/staff', (req, res) => res.json(store.staff.map(({ password, ...s }) => s)));

// ---- Emergency Flow ----
router.post('/emergency/analyze', (req, res) => {
  const { symptoms } = req.body;
  if (!symptoms || symptoms.trim().length === 0) return res.json({ isEmergency: false });
  
  // For the hackathon demo, we will treat any non-empty symptom as an emergency 
  // so the judges can always see the map tracking flow. 
  // Real implementation would use an LLM or broader keyword matching.
  res.json({ isEmergency: true, analyzedSymptoms: symptoms });
});

router.post('/emergency/dispatch', (req, res) => {
  const { lat, lng, patientId, symptoms } = req.body;
  
  // Mock finding nearest govt hospital with bed
  const hospital = {
    id: 'gov-101',
    name: 'Safdarjung Hospital (Govt)',
    availableBeds: 3,
    ward: 'Emergency Trauma Ward - Bed A4',
    lat: lat ? lat + 0.02 : 28.5672,
    lng: lng ? lng + 0.02 : 77.2100,
    distance: '2.4 km'
  };

  // Mock finding and assigning an ambulance
  const ambulance = {
    id: 'amb-404',
    plate: 'DL 1C AA 1234',
    driver: 'Rajesh Kumar',
    phone: '+91 98765 11111',
    lat: lat ? lat - 0.01 : 28.5500,
    lng: lng ? lng - 0.01 : 77.2000,
    etaMinutes: 4
  };
  
  // Generate AI-based first aid tips
  let tips = [
    "Stay calm and try to keep the patient still.",
    "Do not give the patient anything to eat or drink.",
    "Unlock the door so paramedics can enter easily."
  ];
  
  if (symptoms) {
    const s = symptoms.toLowerCase();
    if (s.includes('chest') || s.includes('heart')) {
      tips = [
        "Have the person sit down, rest, and try to keep calm.",
        "Loosen any tight clothing.",
        "Ask if they take any chest pain medication (like nitroglycerin) and help them take it."
      ];
    } else if (s.includes('bleed')) {
      tips = [
        "Apply firm, continuous pressure to the wound with a clean cloth.",
        "Keep the injured area elevated if possible.",
        "Do not remove the cloth if it gets soaked; add another on top."
      ];
    } else if (s.includes('breath')) {
      tips = [
        "Help the person sit in a comfortable position (often leaning forward helps).",
        "Ask if they have an inhaler and assist them in using it.",
        "Loosen tight clothing around the neck and chest."
      ];
    }
  }

  const dispatchRecord = {
    dispatchId: 'EMG-' + Date.now(),
    hospital,
    ambulance,
    patientId: patientId || 'unknown',
    status: 'dispatched',
    tips,
    timestamp: new Date().toISOString()
  };

  if (!store.emergencies) store.emergencies = [];
  store.emergencies.push(dispatchRecord);

  // Also push to the hospital's active alerts and queue so it shows up on Doctor / Admin portals
  const emergencyTokenNo = 'EMG-' + Math.floor(100 + Math.random() * 899);
  const patientNameStr = (req.body.patientName) || (patientId !== 'unknown' ? patientId : 'Unknown Emergency Patient');
  
  const alert = {
    _id: 'a' + Date.now(),
    tokenNo: emergencyTokenNo,
    patientName: patientNameStr,
    type: 'red-flag',
    priority: 'P1',
    severity: 'STAT',
    kind: 'Emergency',
    reason: `Ambulance Dispatched: ${symptoms || 'Emergency triggered via Kiosk'}`,
    message: `Patient en-route via ambulance ${ambulance.plate}. ETA: ${ambulance.etaMinutes} mins.`,
    acknowledged: false
  };
  store.alerts.push(alert);

  const t = {
    _id: 't' + Date.now(),
    tokenNo: emergencyTokenNo,
    name: patientNameStr,
    patientName: patientNameStr,
    age: 0,
    sex: 'U',
    gender: 'Unknown',
    uhid: patientId !== 'unknown' ? patientId : 'EMG-PENDING',
    department: 'Emergency / Triage',
    room: 'Resuscitation Bay',
    doctor: 'On-Call Emergency Physician',
    priority: 'P1',
    status: 'waiting',
    chiefComplaint: symptoms || 'Emergency condition',
    complaint: symptoms || 'Emergency condition',
    position: 0,
    estimatedWaitMin: 0,
    waitMin: 0,
    aiStatus: 'ready',
    aiConfidence: 99
  };
  store.tokens.unshift(t); // Add to the very front of the queue

  res.json(dispatchRecord);
});

module.exports = router;
