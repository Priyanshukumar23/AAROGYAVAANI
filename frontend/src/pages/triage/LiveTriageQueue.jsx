import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { PriorityTag } from '../../components/ui';
import { MOCK_QUEUE } from '../../data/mock';
import { api } from '../../data/api';
import { getQueue, subscribeQueue } from '../../data/queueStore';

export default function LiveTriageQueue() {
  const [rows, setRows] = useState(() => getQueue());
  const [f, setF] = useState('All');
  const [tick, setTick] = useState(10);

  const fetchRows = () => {
    api.get('/tokens').then(d => {
      const list = Array.isArray(d) ? d : d.tokens || d.queue;
      if (list?.length) {
        setRows(prev => {
          const localByToken = new Map(prev.map(t => [t.tokenNo, t]));
          const merged = list.map(t => ({ ...(localByToken.get(t.tokenNo) || {}), ...t, tokenNo: t.tokenNo || t.token, name: t.name || t.patientName || localByToken.get(t.tokenNo)?.name || 'Patient', complaint: t.complaint || t.chiefComplaint || localByToken.get(t.tokenNo)?.complaint || '' }));
          localByToken.forEach((v, k) => { if (!merged.find(m => m.tokenNo === k)) merged.push(v); });
          return merged;
        });
      }
    }).catch(() => {});
    setTick(10);
  };
  useEffect(() => { fetchRows(); const offQ = subscribeQueue((list) => { if (Array.isArray(list) && list.length) setRows(list); }); return () => offQ(); }, []);
  useEffect(() => {
    const t = setInterval(() => setTick(s => {
      if (s <= 1) { fetchRows(); return 10; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, []);

  const filtered = rows.filter(r => f === 'All' || (f === 'Emergency' && r.priority === 'P1') || (f === 'Urgent' && r.priority === 'P2') || (f === 'Routine' && r.priority === 'P3'));
  const addWalkin = () => {
    const name = prompt('Walk-in patient name?');
    if (!name) return;
    setRows(r => [...r, { tokenNo: 'W-' + Math.floor(100 + Math.random() * 900), name, age: 30, sex: '—', complaint: 'Walk-in · to assess', priority: 'P3', wait: '0 min', status: 'waiting' }]);
  };

  return (
    <StaffShell role="nurse" title="Live Triage Queue" subtitle={`Auto-refresh in ${tick}s · live stream from kiosks`}>
      <div className="card" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className="tag tag-info">🟢 LIVE · {filtered.length} shown</span>
        {['All', 'Emergency', 'Urgent', 'Routine'].map(x => (
          <button key={x} className={'btn btn-sm ' + (f === x ? 'btn-blue' : 'btn-ghost')} onClick={() => setF(x)}>{x}</button>
        ))}
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={fetchRows}>↻ Refresh now</button>
          <button className="btn btn-primary btn-sm" onClick={addWalkin}>+ Walk-in</button>
        </span>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="table-wrap"><table className="tbl">
          <thead><tr><th>Token</th><th>Patient</th><th>Complaint</th><th>Wait</th><th>Pri</th><th></th></tr></thead>
          <tbody>{filtered.map(t => (
            <tr key={t.tokenNo}><td><strong>{t.tokenNo}</strong></td><td>{t.name}</td><td className="small">{t.complaint}</td><td>{t.wait}</td><td><PriorityTag level={t.priority} /></td>
              <td><Link className="btn btn-blue btn-sm" to={`/triage/assessment/${t.tokenNo}`}>Assess</Link></td></tr>
          ))}</tbody></table></div>
      </div>
    </StaffShell>
  );
}
