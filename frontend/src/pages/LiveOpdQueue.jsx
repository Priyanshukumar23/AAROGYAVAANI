import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StaffShell from '../components/StaffShell';
import { Kpi, PriorityTag } from '../components/ui';
import { doctorApi } from '../data/doctorApi';
import { subscribeQueue, subscribeCalled } from '../data/queueStore';

export default function LiveOpdQueue() {
  const [queue, setQueue] = useState([]);
  const [called, setCalled] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let live = true;
    doctorApi.getQueue().then((list) => {
      if (live && Array.isArray(list) && list.length) setQueue(list);
    }).catch(() => {});
    doctorApi.getDashboard().then((d) => {
      if (live && d?.called) setCalled(d.called);
    }).catch(() => {});
    const offQ = subscribeQueue((list) => setQueue(list || []));
    const offC = subscribeCalled((c) => setCalled(c));
    return () => { live = false; offQ(); offC(); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 10000);
    return () => clearInterval(t);
  }, []);

  const now = called
    ? queue.find((t) => t.tokenNo === called.tokenNo) || { tokenNo: called.tokenNo, name: called.name, complaint: '' }
    : queue.find((t) => t.status === 'in-chamber') || queue[0];

  const callNext = async () => {
    const res = await doctorApi.callNext('Room 104');
    if (res?.queue) setQueue(res.queue);
    if (res?.called) setCalled(res.called);
  };

  return (
    <StaffShell role="doctor" title="Live OPD Queue" subtitle="Now-serving board · auto-refresh 10s">
      <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div><div className="small muted">NOW SERVING</div><div style={{ fontSize: 32, fontWeight: 800 }}>{now?.tokenNo || '—'}</div><div className="small">{now?.name} · {now?.complaint || now?.chiefComplaint || ''}</div></div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-blue btn-sm" onClick={callNext}>📢 Call Next</button>
          <Link className="btn btn-ghost btn-sm" to="/doctor/dashboard">Dashboard</Link>
        </div>
      </div>
      <div className="kpi-row" style={{ marginTop: 12 }}>
        <Kpi v={String(queue.filter((t) => t.status === 'waiting').length)} l="In Queue" /><Kpi v={queue.filter((t) => t.status === 'in-chamber').length || 1} l="In Chamber" sub={now?.tokenNo} /><Kpi v="6m" l="Avg Wait" /><Kpi v={String(queue.filter((t) => t.priority === 'P1').length)} l="STAT" />
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="table-wrap"><table className="tbl">
          <thead><tr><th>Token</th><th>Patient</th><th>Complaint</th><th>Wait</th><th>Pri</th><th>Status</th><th></th></tr></thead>
          <tbody>{queue.map((t) => (
            <tr key={t.tokenNo}><td><strong>{t.tokenNo}</strong></td><td>{t.name} <span className="muted small">{t.age}/{t.sex}</span></td>
              <td className="small">{t.complaint}</td><td>{t.status === 'in-chamber' ? 'In chamber' : t.waitMin != null ? `${t.waitMin} min` : t.wait}</td><td><PriorityTag level={t.priority} /></td><td className="small">{t.status}</td>
              <td><Link className="btn btn-ghost btn-sm" to={`/doctor/case/${t.tokenNo}`}>Open</Link></td></tr>
          ))}</tbody></table></div>
        <div className="small muted" style={{ marginTop: 6 }}>Auto-refreshes every 10s · last tick #{tick} · realtime-ready via queue store</div>
      </div>
    </StaffShell>
  );
}
