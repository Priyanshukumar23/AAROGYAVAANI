import { useState } from 'react';
import { Link } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { PriorityTag } from '../../components/ui';
import { MOCK_QUEUE } from '../../data/mock';

const EXTRA = Array.from({ length: 8 }, (_, i) => ({
  tokenNo: `A-${131 + i}`, name: ['Kavita Rao', 'Amit Verma', 'Farah Khan', 'Suresh Nair', 'Geeta Yadav', 'Ravi Menon', 'Anita Das', 'Vikram Joshi'][i],
  complaint: ['Fever 2d', 'Back pain', 'Cough', 'BP review', 'Skin rash', 'Headache', 'Joint pain', 'Diabetes f/u'][i],
  priority: ['P2', 'P3', 'P3', 'P2', 'P3', 'P2', 'P3', 'P3'][i], time: `${9 + i}:1${i} AM`,
}));

export default function TriageHistory() {
  const [f, setF] = useState('All');
  const [q, setQ] = useState('');
  const rows = [...MOCK_QUEUE, ...EXTRA].filter(r =>
    (f === 'All' || r.priority === f) && (!q || (r.name + r.tokenNo).toLowerCase().includes(q.toLowerCase())));
  const csv = () => {
    const blob = new Blob([['token', 'name', 'complaint', 'priority'].join(',') + '\n' + rows.map(r => [r.tokenNo, `"${r.name}"`, `"${r.complaint}"`, r.priority].join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'triage-shift.csv'; a.click();
  };
  return (
    <StaffShell role="nurse" title="Triage History" subtitle="Shift audit · 34 encounters">
      <div className="card" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {['All', 'P1', 'P2', 'P3'].map(x => <button key={x} className={'btn btn-sm ' + (f === x ? 'btn-blue' : 'btn-ghost')} onClick={() => setF(x)}>{x}</button>)}
        <input className="input staff" placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} style={{ maxWidth: 160 }} />
        <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={csv}>⬇ CSV</button>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="table-wrap"><table className="tbl"><thead><tr><th>Token</th><th>Patient</th><th>Pri</th><th></th></tr></thead>
          <tbody>{rows.map(r => <tr key={r.tokenNo}><td><strong>{r.tokenNo}</strong></td><td>{r.name}<br /><span className="small muted">{r.complaint}</span></td><td><PriorityTag level={r.priority} /></td><td><Link className="btn btn-ghost btn-sm" to={`/doctor/case/${r.tokenNo}`}>Open</Link></td></tr>)}</tbody></table></div>
      </div>
    </StaffShell>
  );
}
