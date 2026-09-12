import { useState } from 'react';
import StaffShell from '../../components/StaffShell';
import { Kpi } from '../../components/ui';
import { api } from '../../data/api';

const SEED = [
  { id: 'a1', level: 'P1', title: 'A-142 · ?ACS chest pain + HTN', sub: 'ECG pending 12 min · escalate if troponin +' },
  { id: 'a2', level: 'P1', title: 'A-127 · Severe dizziness, in chamber', sub: 'Neuro check due · fall risk' },
  { id: 'a3', level: 'P2', title: 'A-130 · RLQ pain 29 min wait', sub: 'Appendicitis screen · counselled' },
  { id: 'a4', level: 'P2', title: 'Vitals breach · A-129 glucose HI', sub: 'Recheck glucometer · inform MD' },
  { id: 'a5', level: 'P3', title: 'Doctor request · old Rx upload', sub: 'A-129 2024 Rx needs OCR verify' },
];

export default function AlertCenter() {
  const [alerts, setAlerts] = useState(SEED);
  const [acked, setAcked] = useState({});
  const ack = async (a) => {
    try { await api.patch(`/alerts/${a.id}`, { status: 'ack' }); } catch {}
    setAcked(s => ({ ...s, [a.id]: true }));
  };
  return (
    <StaffShell role="nurse" title="Nurse Alert Center" subtitle="Red + priority + vitals + doctor requests">
      <div className="kpi-row"><Kpi v="2" l="Red" /><Kpi v="3" l="Priority" /><Kpi v="2" l="Vitals" /><Kpi v="1" l="Doctor Req" /></div>
      <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
        {alerts.map(a => (
          <div key={a.id} className={`alert-banner ${a.level === 'P1' ? 'alert-p1' : a.level === 'P2' ? 'alert-p2' : 'alert-info'}`}>
            <strong>{a.level === 'P1' ? '🚨 ' : '⚠️ '}{a.title}</strong><br /><span className="small">{a.sub}</span>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-sm" style={{ background: '#fff' }} onClick={() => ack(a)}>{acked[a.id] ? '✓ Acknowledged' : 'Acknowledge'}</button>
              <button className="btn btn-sm" style={{ background: '#fff' }} onClick={() => alert('Doctor paged for ' + a.title)}>📞 Call Doctor</button>
              {a.level === 'P1' && <button className="btn btn-sm" style={{ background: '#fff', color: '#b91c1c', fontWeight: 800 }} onClick={() => alert('Escalated to ED.')}>Escalate ED</button>}
            </div>
          </div>
        ))}
      </div>
    </StaffShell>
  );
}
