import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StaffShell from '../components/StaffShell';
import { Kpi, PriorityTag } from '../components/ui';
import { MOCK_QUEUE } from '../data/mock';
import { api } from '../data/api';

export default function LiveOpdQueue() {
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    api.get('/tokens').then(d => {
      const list = Array.isArray(d) ? d : d.tokens || d.queue;
      if (list?.length) setQueue(list);
    }).catch(() => {});
  }, [tick]);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 10000);
    return () => clearInterval(t);
  }, []);
  const now = queue[0];
  const callNext = () => setQueue(q => {
    if (q.length < 2) return q;
    const [done, next, ...rest] = q;
    return [{ ...next, status: 'in-chamber', wait: 'In chamber' }, ...rest, { ...done, status: 'done', wait: 'Done' }];
  });
  return (
    <StaffShell role="doctor" title="Live OPD Queue" subtitle="Now-serving board · auto-refresh 10s">
      <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div><div className="small muted">NOW SERVING</div><div style={{ fontSize: 32, fontWeight: 800 }}>{now?.tokenNo || '—'}</div><div className="small">{now?.name} · {now?.complaint}</div></div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-blue btn-sm" onClick={callNext}>📢 Call Next</button>
          <Link className="btn btn-ghost btn-sm" to="/doctor/dashboard">Dashboard</Link>
        </div>
      </div>
      <div className="kpi-row" style={{ marginTop: 12 }}>
        <Kpi v={String(queue.length)} l="In Queue" /><Kpi v="1" l="In Chamber" sub={now?.tokenNo} /><Kpi v="6m" l="Avg Wait" /><Kpi v={String(queue.filter(t => t.priority === 'P1').length)} l="STAT" />
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="table-wrap"><table className="tbl">
          <thead><tr><th>Token</th><th>Patient</th><th>Complaint</th><th>Wait</th><th>Pri</th><th>Status</th><th></th></tr></thead>
          <tbody>{queue.map(t => (
            <tr key={t.tokenNo}><td><strong>{t.tokenNo}</strong></td><td>{t.name} <span className="muted small">{t.age}/{t.sex}</span></td>
              <td className="small">{t.complaint}</td><td>{t.wait}</td><td><PriorityTag level={t.priority} /></td><td className="small">{t.status}</td>
              <td><Link className="btn btn-ghost btn-sm" to={`/doctor/case/${t.tokenNo}`}>Open</Link></td></tr>
          ))}</tbody></table></div>
        <div className="small muted" style={{ marginTop: 6 }}>Auto-refreshes every 10s · last tick #{tick}</div>
      </div>
    </StaffShell>
  );
}
