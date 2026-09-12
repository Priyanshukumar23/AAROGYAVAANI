import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);
const KEY = 'medikiosk_state_v1';

const initial = {
  language: 'English',
  accessibility: { voice: true, largeText: false, slowVoice: false, highContrast: false },
  patient: { name: 'Ramesh Kumar Sharma', age: 48, gender: 'Male', mobile: '+91 98765 43210', state: 'Delhi', city: 'South Delhi', abha: '91-4582-9012-3456', uhid: 'AIIMS-2025-08492' },
  department: null,
  token: { tokenNo: 'A-142', room: 'Room 104', position: 14, waitMin: 42, nowServing: 'A-127' },
  intake: { chiefComplaint: '', symptoms: [], followUp: {}, details: {}, pastHistory: {}, redFlag: false, transcript: [] },
  docs: [],
  staff: null
};

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...initial, ...JSON.parse(raw) } : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state]);
  const patch = (p) => setState(s => ({ ...s, ...p }));
  const patchPatient = (p) => setState(s => ({ ...s, patient: { ...s.patient, ...p } }));
  const patchIntake = (p) => setState(s => ({ ...s, intake: { ...s.intake, ...p } }));
  const resetKiosk = () => setState(s => ({ ...initial, staff: s.staff }));
  return <Ctx.Provider value={{ state, patch, patchPatient, patchIntake, resetKiosk, setState }}>{children}</Ctx.Provider>;
}
export const useApp = () => useContext(Ctx);
