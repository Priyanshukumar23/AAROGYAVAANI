import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { PriorityTag, StatusTag } from '../../components/ui';
import { api } from '../../data/api';

const FALLBACK = [
  { id: 'AL-1', cat: 'Emergency', level: 'P1', title: 'A-142 · suspected ACS', detail: 'Chest pain + HTN 150/94 · ECG pending · sla 04:12', sla: '04:12', ack: false },
  { id: 'AL-2', cat: 'Vitals', level: 'P2', title: 'B-088 · SpO2 91% on exertion', detail: 'Ortho waiting · recheck vitals · nurse notified', sla: '12:40', ack: false },
];

export default function AdminAlertCenter() {
  const [alerts, setAlerts] = useState(FALLBACK);
  const [filter, setFilter] = useState('All');
  const [chime, setChime] = useState(true);
  useEffect(() => {
    api.get('/alerts').then(d => {
      const list = Array.isArray(d) ? d : d.alerts;
      if (list?.length) setAlerts(list);
    }).catch(() => {});
  }, []);
  const filtered = alerts.filter(a => filter === 'All' || a.cat === filter);
  const ack = (id) => setAlerts(x => x.map(a => a.id === id ? { ...a, ack: true } : a));
  return (
    <StaffShell role="admin" title="Alert Center" subtitle="Emergency · priority · vitals · system" actions={<label className="small">🔔 Chime <input type="checkbox" checked={chime} onChange={e => setChime(e.target.checked)} /></label>}>
      <div className="card" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['All', 'Emergency', 'Priority', 'Vitals', 'System'].map(f => (
          <button key={f} className={'btn btn-sm ' + (filter === f ? 'btn-blue' : 'btn-ghost')} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <span className="small muted" style={{ marginLeft: 'auto' }}>{filtered.filter(a => !a.ack).length} unacknowledged</span>
      </div>
      <div style={{ marginTop: 12 }}>
        {filtered.map(a => (
          <div key={a.id} className="card" style={{ marginBottom: 10, opacity: a.ack ? 0.65 : 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <PriorityTag level={a.level || 'P2'} />
              <strong>{a.title}</strong>
              <StatusTag kind={a.ack ? 'ok' : 'warn'}>{a.ack ? 'Acknowledged' : 'SLA ' + (a.sla || '—')}</StatusTag>
              <span className="tag tag-neutral">{a.cat}</span>
            </div>
            <p className="small muted">{a.detail}</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {!a.ack && <button className="btn btn-blue btn-sm" onClick={() => ack(a.id)}>Acknowledge</button>}
              <button className="btn btn-ghost btn-sm" onClick={() => ack(a.id)}>Assign</button>
              <Link className="btn btn-ghost btn-sm" to="/doctor/case/A-142">View</Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="notice">No alerts in this bucket. 🎉</div>}
      </div>
    </StaffShell>
  );
}
