import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { Kpi, PriorityTag } from '../../components/ui';
import { MOCK_QUEUE } from '../../data/mock';
import { api } from '../../data/api';

export default function TriageDashboard() {
  const [queue, setQueue] = useState(MOCK_QUEUE);
  useEffect(() => {
    api.get('/tokens').then(d => {
      const list = Array.isArray(d) ? d : d.tokens || d.queue;
      if (list?.length) setQueue(list);
    }).catch(() => {});
  }, []);
  return (
    <StaffShell role="nurse" title="Triage Desk · Namaste 🙏" subtitle="OPD Central · shift live · NABH protocol">
      <div className="kpi-row">
        <Kpi v="8" l="Waiting" /><Kpi v="4.2m" l="Avg Assess" /><Kpi v="2" l="Assessing" />
        <Kpi v="3" l="Priority" /><Kpi v="1" l="STAT" /><Kpi v="34" l="Done" />
      </div>
      <div className="alert-banner alert-p1" style={{ marginTop: 12 }}>🚨 P1 STAT — <strong>A-142 Ramesh K. Sharma</strong> · chest pain + HTN · nurse escort to ECG NOW · <Link to="/triage/assessment/A-142" style={{ color: '#fff', fontWeight: 800 }}>Start Triage →</Link></div>
      <div className="card" style={{ marginTop: 12 }}>
        <h3 style={{ marginTop: 0 }}>Waiting for Triage</h3>
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
