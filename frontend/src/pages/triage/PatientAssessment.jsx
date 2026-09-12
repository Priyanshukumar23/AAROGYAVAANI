import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';

export default function PatientAssessment() {
  const { token = 'A-142' } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ consciousness: 'Alert', pain: '8', notes: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <StaffShell role="nurse" title={`Assessment · ${token}`} subtitle="Ramesh Kumar Sharma, 48M · kiosk intake summary">
      <div className="split split-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Intake Summary</h3>
          <p className="small"><strong>Chest heaviness + exertional dyspnea ~24h</strong>, radiates to L shoulder/jaw, diaphoresis. HTN history. BP 150/94.</p>
          <h4>Symptoms</h4>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}><span className="tag tag-p1">Chest pain</span><span className="tag tag-p2">Breathlessness</span><span className="tag tag-neutral">Diaphoresis</span></div>
          <div className="alert-banner alert-p2" style={{ marginTop: 10 }}>⚠️ Allergy: <strong>Penicillin (rash)</strong> — flag on wristband + EMR.</div>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Rapid Assessment</h3>
          <div className="field"><label>Consciousness</label><select className="input staff" value={form.consciousness} onChange={e => set('consciousness', e.target.value)}><option>Alert</option><option>Voice-responsive</option><option>Pain-responsive</option><option>Unresponsive</option></select></div>
          <div className="field"><label>Pain VAS (0–10): {form.pain}</label><input type="range" min="0" max="10" value={form.pain} onChange={e => set('pain', e.target.value)} style={{ width: '100%' }} /></div>
          <div className="field"><label>Notes</label><textarea className="input staff" rows={3} placeholder="Breathing, skin, neuro…" value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={() => nav(`/triage/vitals/${token}`)}>Save &amp; Vitals →</button>
            <Link className="btn btn-ghost btn-sm" to="/triage/dashboard">Cancel</Link>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
