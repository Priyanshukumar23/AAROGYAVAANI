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

module.exports = router;
