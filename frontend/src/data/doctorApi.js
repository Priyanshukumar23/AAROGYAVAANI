// Clean backend-ready service functions for the Doctor workflow.
// Each function tries the real REST API first, then falls back to local mock/store.
// Future: point VITE_API_URL at Mongo-backed server — no UI changes needed.
//
//   GET    /api/doctor/dashboard
//   GET    /api/opd/queue
//   POST   /api/opd/call-next
//   PATCH  /api/opd/:token/status
//   GET    /api/patients/:id/case
//   GET    /api/patients/:id/documents
//   GET    /api/patients/:id/timeline
//   GET    /api/alerts/red-flags
//   POST   /api/consultations

import { api } from './api';
import { MOCK_OPD_QUEUE, MOCK_RED_FLAGS, MOCK_OCR_STACK, MOCK_PATIENT_CASES } from './doctorMock';
import { getQueue, callNextInStore, setTokenStatus, getCalledToken } from './queueStore';

async function tryApi(fn, fallback) {
  try {
    const r = await fn();
    if (r !== undefined && r !== null) return r;
  } catch { /* offline / demo — use mock */ }
  return typeof fallback === 'function' ? fallback() : fallback;
}

// Backend tokens use patientName/chiefComplaint/estimatedWaitMin;
// frontend cards use name/complaint/waitMin/aiStatus. Normalize both shapes.
export function normalizeToken(t = {}) {
  const waitMin = t.waitMin ?? t.estimatedWaitMin ?? 0;
  return {
    ...t,
    tokenNo: t.tokenNo || t.token,
    name: t.name || t.patientName || 'Patient',
    complaint: t.complaint || t.chiefComplaint || '',
    age: t.age ?? 0,
    sex: t.sex || (t.gender ? String(t.gender)[0] : '') || '',
    waitMin,
    wait: t.wait || (t.status === 'in-chamber' ? 'In chamber' : `${waitMin} min`),
    aiStatus: t.aiStatus || (t.priority === 'P3' ? 'processing' : 'ready'),
    aiConfidence: t.aiConfidence ?? (t.priority === 'P1' ? 92 : t.priority === 'P2' ? 89 : null),
  };
}

function normalizeQueue(list) {
  const arr = Array.isArray(list) ? list : list?.queue || list?.tokens || [];
  return arr.map(normalizeToken);
}

export const doctorApi = {
  getDashboard: () =>
    tryApi(async () => {
      const d = await api.get('/doctor/dashboard');
      if (d?.queue) return { ...d, queue: normalizeQueue(d.queue) };
      return d;
    }, () => ({
      queue: getQueue(),
      called: getCalledToken(),
      redFlags: MOCK_RED_FLAGS,
      ocrStack: MOCK_OCR_STACK,
    })),

  getQueue: () =>
    tryApi(async () => normalizeQueue(await api.get('/opd/queue')), () => getQueue()),

  callNext: (room = 'Room 104') =>
    tryApi(async () => {
      const r = await api.post('/opd/call-next', { room });
      if (r?.queue) return { ...r, queue: normalizeQueue(r.queue) };
      if (Array.isArray(r)) return { called: null, queue: normalizeQueue(r) };
      return r;
    }, () => callNextInStore(room)),

  setTokenStatus: (tokenNo, status) =>
    tryApi(() => api.patch(`/opd/${encodeURIComponent(tokenNo)}/status`, { status }), () =>
      setTokenStatus(tokenNo, status)),

  getCase: (id) =>
    tryApi(() => api.get(`/patients/${encodeURIComponent(id)}/case`), () => MOCK_PATIENT_CASES[id] || null),

  getDocuments: (id) =>
    tryApi(() => api.get(`/patients/${encodeURIComponent(id)}/documents`), () =>
      MOCK_OCR_STACK.filter(() => true)),

  getTimeline: (id) =>
    tryApi(() => api.get(`/patients/${encodeURIComponent(id)}/timeline`), () =>
      (MOCK_PATIENT_CASES[id]?.timeline || []).map((c, i) => ({ id: `${id}-t${i}`, text: c }))),

  getRedFlags: () =>
    tryApi(() => api.get('/alerts/red-flags'), () => MOCK_RED_FLAGS),

  completeConsultation: (payload) =>
    tryApi(() => api.post('/consultations', payload), () => {
      setTokenStatus(payload.tokenNo, 'completed');
      return { ok: true, ...payload };
    }),
};
