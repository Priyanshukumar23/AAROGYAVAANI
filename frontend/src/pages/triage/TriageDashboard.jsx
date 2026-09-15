import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { Kpi, PriorityTag } from '../../components/ui';
import { MOCK_QUEUE } from '../../data/mock';
import { api } from '../../data/api';
import { getQueue, subscribeQueue } from '../../data/queueStore';

export default function TriageDashboard() {
  const nav = useNavigate();
  const [queue, setQueue] = useState(() => getQueue());
  useEffect(() => {
    api.get('/tokens').then(d => {
      const list = Array.isArray(d) ? d : d.tokens || d.queue;
      if (list?.length) {
        // Merge backend tokens with local kiosk registrations (local wins on conflict).
        setQueue(prev => {
          const localByToken = new Map(prev.map(t => [t.tokenNo, t]));
          const merged = list.map(t => ({ ...(localByToken.get(t.tokenNo) || {}), ...t, tokenNo: t.tokenNo || t.token, name: t.name || t.patientName || localByToken.get(t.tokenNo)?.name || 'Patient', complaint: t.complaint || t.chiefComplaint || localByToken.get(t.tokenNo)?.complaint || '' }));
          localByToken.forEach((v, k) => { if (!merged.find(m => m.tokenNo === k)) merged.push(v); });
          return merged;
        });
      }
    }).catch(() => {});
    const offQ = subscribeQueue((list) => { if (Array.isArray(list) && list.length) setQueue(list); });
    return () => offQ();
  }, []);
  return (
    <StaffShell role="nurse" title="Triage Desk · Namaste 🙏" subtitle="OPD Central · shift live · NABH protocol">
      <div className="kpi-row">
        <Kpi v="8" l="Waiting" /><Kpi v="4.2m" l="Avg Assess" /><Kpi v="2" l="Assessing" />
        <Kpi v="3" l="Priority" /><Kpi v="1" l="STAT" /><Kpi v="34" l="Done" />
      </div>
      <div className="alert-banner alert-p1" style={{ marginTop: 12 }}>🚨 P1 STAT — <strong>A-142 Ramesh K. Sharma</strong> · chest pain + HTN · nurse escort to ECG NOW · <Link to="/triage/assessment/A-142" style={{ color: '#fff', fontWeight: 800 }}>Start Triage →</Link></div>
      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ marginTop: 0 }}>Waiting for Triage</h3>
          <form onSubmit={(e) => { e.preventDefault(); const val = e.target.elements.uhid.value.trim(); if(val) nav(`/triage/assessment/${val}`); }} style={{ display: 'flex', gap: 8, marginBottom: 12, background: 'var(--bg-rec)', padding: '8px 12px', borderRadius: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 600 }}>🔍 Fetch Patient:</span>
            <input name="uhid" className="input staff" placeholder="Enter UHID..." style={{ flex: 1 }} required />
            <button type="submit" className="btn btn-secondary btn-sm">Search</button>
          </form>
        </div>
        <div className="table-wrap"><table className="tbl">
          <thead><tr><th>Token</th><th>Patient</th><th>Complaint</th><th>Pri</th><th></th></tr></thead>
          <tbody>{queue.map(t => (
            <tr key={t.tokenNo}><td><strong>{t.tokenNo}</strong></td><td>{t.name} <span className="muted small">{t.age}/{t.sex}</span></td><td className="small">{t.complaint}</td><td><PriorityTag level={t.priority} /></td>
              <td><Link className="btn btn-blue btn-sm" to={`/triage/assessment/${t.tokenNo}`}>Start Triage</Link></td></tr>
          ))}</tbody></table></div>
      </div>
    </StaffShell>
  );
}
