// Shared OPD queue store — single source of truth for doctor + patient screens.
// - Persists to localStorage so Call Next reflects on the patient waiting screen.
// - Emits window CustomEvents so all open tabs/components update live.
// - Realtime-ready: replace emit() internals with Socket.IO (socket.emit('queue:update', …))
//   and subscribe server pushes (socket.on('queue:update', …)) — no component changes needed.
//
// Workflow: check-in → token → waiting → (call-next) → in-chamber → (consult) → completed
// Priority order for call-next: P1 Emergency → P2 Urgent → P3 Routine, then lowest waitMin.

import { MOCK_OPD_QUEUE } from './doctorMock';

const QUEUE_KEY = 'medikiosk_opd_queue_v1';
const CALLED_KEY = 'medikiosk_called_token_v1';
const DONE_BASE = 27; // consulted earlier today (kept for dashboard continuity)
const SCHEDULED = 42;

function readQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length) return list;
    }
  } catch { /* ignore */ }
  return MOCK_OPD_QUEUE.map((t) => ({ ...t }));
}

function writeQueue(list) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(list)); } catch { /* ignore */ }
  emit('medikiosk:queue', list);
}

function readCalled() {
  try {
    const raw = localStorage.getItem(CALLED_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  const inChamber = readQueue().find((t) => t.status === 'in-chamber');
  return inChamber ? { tokenNo: inChamber.tokenNo, name: inChamber.name, room: 'Room 104', at: null } : null;
}

function writeCalled(called) {
  try { localStorage.setItem(CALLED_KEY, JSON.stringify(called)); } catch { /* ignore */ }
  // Patient waiting screens listen for this event (+ future Socket.IO push).
  emit('medikiosk:called', called);
  try {
    // Also mirror into kiosk patient token so /queue/live + /queue/ready pick it up.
    const raw = localStorage.getItem('medikiosk_state_v1');
    const s = raw ? JSON.parse(raw) : {};
    const nowServing = called?.tokenNo;
    localStorage.setItem(
      'medikiosk_state_v1',
      JSON.stringify({ ...s, token: { ...(s.token || {}), nowServing, calledToken: nowServing, calledRoom: called?.room || 'Room 104' } })
    );
  } catch { /* ignore */ }
}

function emit(name, detail) {
  try { window.dispatchEvent(new CustomEvent(name, { detail })); } catch { /* ignore */ }
  // TODO(realtime): socket.emit('queue:update', { name, detail });
}

export function subscribeQueue(cb) {
  const h = (e) => cb(e.detail);
  window.addEventListener('medikiosk:queue', h);
  return () => window.removeEventListener('medikiosk:queue', h);
}

export function subscribeCalled(cb) {
  const h = (e) => cb(e.detail);
  window.addEventListener('medikiosk:called', h);
  const storage = (e) => {
    if (e.key === CALLED_KEY && e.newValue) { try { cb(JSON.parse(e.newValue)); } catch { /* ignore */ } }
    if (e.key === QUEUE_KEY && e.newValue) { /* queue changed elsewhere */ }
  };
  window.addEventListener('storage', storage);
  return () => {
    window.removeEventListener('medikiosk:called', h);
    window.removeEventListener('storage', storage);
  };
  // TODO(realtime): socket.on('queue:update', (msg) => cb(msg.detail));
}

export function getQueue() { return readQueue(); }
export function getCalledToken() { return readCalled(); }
export function resetQueueStore() {
  try { localStorage.removeItem(QUEUE_KEY); localStorage.removeItem(CALLED_KEY); } catch { /* ignore */ }
}

export function setTokenStatus(tokenNo, status) {
  const list = readQueue().map((t) =>
    t.tokenNo === tokenNo
      ? { ...t, status, wait: status === 'in-chamber' ? 'In chamber' : status === 'completed' ? 'Done' : t.wait }
      : t
  );
  writeQueue(list);
  return list.find((t) => t.tokenNo === tokenNo) || null;
}

// Patient kiosk → staff sync: insert new registration or patch existing token.
// Call after token issue, department select, chief complaint, history complete.
export function upsertQueuePatient(entry = {}) {
  if (!entry.tokenNo) return null;
  const list = readQueue();
  const idx = list.findIndex((t) => t.tokenNo === entry.tokenNo);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...entry };
  } else {
    list.push({
      status: 'waiting',
      priority: 'P3',
      waitMin: 15,
      wait: '15 min',
      aiStatus: 'processing',
      aiConfidence: null,
      ...entry,
    });
  }
  writeQueue(list);
  return list.find((t) => t.tokenNo === entry.tokenNo) || null;
}

export function updateQueueToken(tokenNo, patch = {}) {
  if (!tokenNo) return null;
  return upsertQueuePatient({ tokenNo, ...patch });
}

const PRI_RANK = { P1: 0, P2: 1, P3: 2 };

export function pickNext(queue) {
  const waiting = queue.filter((t) => t.status === 'waiting');
  if (!waiting.length) return null;
  return [...waiting].sort(
    (a, b) => (PRI_RANK[a.priority] ?? 9) - (PRI_RANK[b.priority] ?? 9) || (a.waitMin ?? 99) - (b.waitMin ?? 99)
  )[0];
}

// Doctor clicks "Call Next": next eligible waiting → in-chamber, broadcast to patient screens.
export function callNextInStore(room = 'Room 104') {
  const list = readQueue();
  const next = pickNext(list);
  if (!next) return { called: null, queue: list };
  const updated = list.map((t) =>
    t.tokenNo === next.tokenNo ? { ...t, status: 'in-chamber', wait: 'In chamber', waitMin: 0 } : t
  );
  writeQueue(updated);
  const called = { tokenNo: next.tokenNo, name: next.name, room, at: new Date().toISOString() };
  writeCalled(called);
  return { called, queue: updated };
}

export function dashboardCounters(queue) {
  const inQueue = queue.filter((t) => t.status === 'waiting').length;
  const inChamberList = queue.filter((t) => t.status === 'in-chamber');
  const doneSession = queue.filter((t) => t.status === 'completed').length;
  return {
    scheduled: SCHEDULED,
    inQueue,
    inChamber: inChamberList.length,
    inChamberToken: inChamberList[0]?.tokenNo || '—',
    done: DONE_BASE + doneSession,
    doneSession,
  };
}

export function waitingInfo(queue, avgMin = 6) {
  const waiting = queue.filter((t) => t.status === 'waiting');
  const inChamber = queue.find((t) => t.status === 'in-chamber');
  const totalWait = waiting.reduce((s, t) => s + (t.waitMin || 0), 0);
  return {
    currentToken: inChamber?.tokenNo || queue[0]?.tokenNo || '—',
    patientsWaiting: waiting.length,
    avgMin,
    estimatedWaitMin: waiting.length * avgMin,
    totalWaitMin: totalWait,
  };
}
