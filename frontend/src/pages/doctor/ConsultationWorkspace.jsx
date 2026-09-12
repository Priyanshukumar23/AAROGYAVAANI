import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { PriorityTag } from '../../components/ui';
import { MOCK_QUEUE, MOCK_VITALS } from '../../data/mock';
import { api } from '../../data/api';

const BANNED = ['amoxicillin', 'penicillin'];
export default function ConsultationWorkspace() {
  const nav = useNavigate();
  const [dx, setDx] = useState('Unstable angina, ?NSTEMI — troponin awaited. HTN Stage 2.');
  const [rx, setRx] = useState([{ drug: 'Aspirin', dose: '75mg', days: '30' }, { drug: 'Atorvastatin', dose: '40mg', days: '30' }]);
  const [advice, setAdvice] = useState('No exertion · low salt · SOS cardiology · review with troponin/ECG tomorrow.');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const setRow = (i, k, v) => setRx(r => r.map((row, j) => j === i ? { ...row, [k]: v } : row));
  const check = (drug) => BANNED.some(b => drug.toLowerCase().includes(b));

  const complete = async () => {
    const bad = rx.find(r => check(r.drug));
    if (bad) { setErr(`⛔ BLOCKED: ${bad.drug} contraindicated — penicillin allergy on record.`); return; }
    if (!dx.trim()) { setErr('Add a diagnosis before completing.'); return; }
    setErr(''); setSaving(true);
    try { await api.post('/consultations', { tokenNo: 'A-142', dx, rx, advice }); } catch {}
    nav('/doctor/complete');
  };

  return (
    <StaffShell role="doctor" title="Consultation Workspace · A-142" subtitle="3-pane: summary · prescribe · safety">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', gap: 12 }}>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Patient</h4>
          <p className="small"><strong>Ramesh Kumar Sharma, 48M</strong><br />Chest heaviness 24h · P1 <PriorityTag level="P1" /><br />Allergy: <strong>Penicillin</strong></p>
          <h4>Vitals</h4>{MOCK_VITALS.slice(0, 4).map(v => <div key={v.k} className="small">{v.k}: <strong>{v.v}</strong></div>)}
          <h4>AI Summary</h4><p className="small muted">?ACS · HEART ~6 · ECG + troponin advised. <Link to="/doctor/case/A-142">Full case</Link></p>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Diagnosis</h4>
          <textarea className="input staff" rows={2} value={dx} onChange={e => setDx(e.target.value)} />
          <h4>Prescription {rx.length > 0 && <span className="tag tag-neutral">{rx.length}</span>}</h4>
          {rx.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <input className="input staff" placeholder="Drug" value={r.drug} onChange={e => setRow(i, 'drug', e.target.value)} />
              <input className="input staff" placeholder="Dose" value={r.dose} onChange={e => setRow(i, 'dose', e.target.value)} style={{ maxWidth: 80 }} />
              <input className="input staff" placeholder="Days" value={r.days} onChange={e => setRow(i, 'days', e.target.value)} style={{ maxWidth: 60 }} />
              <button className="btn btn-ghost btn-sm" onClick={() => setRx(r => r.filter((_, j) => j !== i))}>✕</button>
            </div>
          ))}
          {err && <div className="alert-banner alert-p1 small">{err}</div>}
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setRx(r => [...r, { drug: '', dose: '', days: '7' }])}>+ Add Drug</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setRx(r => [...r, { drug: 'Amoxicillin', dose: '500mg', days: '5' }]); setErr(''); }}>Test allergy block</button>
          </div>
          <h4>Advice</h4>
          <textarea className="input staff" rows={2} value={advice} onChange={e => setAdvice(e.target.value)} />
          <button className="btn btn-primary" style={{ marginTop: 10 }} disabled={saving} onClick={complete}>{saving ? 'Saving…' : 'Complete Consultation →'}</button>
        </div>
        <div>
          <div className="alert-banner alert-p1 small">🚨 RED FLAG: ?ACS · ECG stat · monitor vitals</div>
          <div className="card" style={{ marginTop: 12 }}><h4 style={{ marginTop: 0 }}>Next in Queue</h4>{MOCK_QUEUE.slice(1, 4).map(t => <div key={t.tokenNo} className="small" style={{ padding: '4px 0' }}><strong>{t.tokenNo}</strong> {t.name} · {t.priority}</div>)}</div>
        </div>
      </div>
    </StaffShell>
  );
}
