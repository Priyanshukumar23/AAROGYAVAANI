import { useState } from 'react';
import StaffShell from '../../components/StaffShell';
import { StatusTag } from '../../components/ui';

const LOGS = [
  { who: 'Dr. R. Sharma (DOC-104)', when: '09:42 · Tue', action: 'Opened case A-142', token: 'A-142', tag: 'ABDM' },
  { who: 'Meena Kumari (NRS-201)', when: '09:31 · Tue', action: 'Triage P1 assigned A-142', token: 'A-142', tag: 'NABH' },
  { who: 'V. Sen (ADM-001)', when: '09:12 · Tue', action: 'Rebooted KSK-03', token: '—', tag: 'System' },
  { who: 'Dr. S. Iyer (DOC-201)', when: '08:58 · Tue', action: 'E-signed Rx B-088', token: 'B-088', tag: 'ABDM' },
  { who: 'System', when: '08:40 · Tue', action: 'FHIR sync 342 records OK', token: '—', tag: 'ABDM' },
];
const ROLES = ['Doctor', 'Nurse', 'Technician', 'Admin'];
const PERMS = ['Queue', 'Cases', 'Triage', 'Kiosks', 'Analytics', 'Settings'];
const MATRIX = { Doctor: [1, 1, 0, 0, 1, 0], Nurse: [1, 0, 1, 0, 0, 0], Technician: [0, 0, 0, 1, 0, 0], Admin: [1, 1, 1, 1, 1, 1] };

export default function AuditAccess() {
  const [q, setQ] = useState('');
  const [m, setM] = useState(MATRIX);
  const rows = LOGS.filter(l => !q || (l.who + l.action + l.token).toLowerCase().includes(q.toLowerCase()));
  const toggle = (r, i) => setM(x => ({ ...x, [r]: x[r].map((v, j) => (j === i ? (v ? 0 : 1) : v)) }));
  const csv = () => {
    const blob = new Blob([['who', 'when', 'action', 'token', 'tag'].join(',') + '\n' + rows.map(r => [`"${r.who}"`, `"${r.when}"`, `"${r.action}"`, r.token, r.tag].join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'access-log.csv'; a.click();
  };
  return (
    <StaffShell role="admin" title="Audit & Access" subtitle="ABDM / NABH access trail · role matrix" actions={<button className="btn btn-blue btn-sm" onClick={csv}>Export CSV</button>}>
      <div className="card" style={{ display: 'flex', gap: 8 }}>
        <input className="input staff" placeholder="Search who / action / token…" value={q} onChange={e => setQ(e.target.value)} style={{ flex: 1 }} />
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h3 style={{ marginTop: 0 }}>Access Log</h3>
        <div className="table-wrap"><table className="tbl">
          <thead><tr><th>Who</th><th>When</th><th>Action</th><th>Token</th><th>Tag</th></tr></thead>
          <tbody>{rows.map((l, i) => (
            <tr key={i}><td>{l.who}</td><td className="small">{l.when}</td><td className="small">{l.action}</td><td><strong>{l.token}</strong></td>
              <td><StatusTag kind={l.tag === 'ABDM' ? 'info' : l.tag === 'NABH' ? 'ok' : 'neutral'}>{l.tag}</StatusTag></td></tr>
          ))}</tbody></table></div>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h3 style={{ marginTop: 0 }}>Role Matrix</h3>
        <div className="table-wrap"><table className="tbl">
          <thead><tr><th>Role</th>{PERMS.map(p => <th key={p}>{p}</th>)}</tr></thead>
          <tbody>{ROLES.map(r => (
            <tr key={r}><td><strong>{r}</strong></td>{m[r].map((v, i) => (
              <td key={i}><input type="checkbox" checked={!!v} onChange={() => toggle(r, i)} /></td>
            ))}</tr>
          ))}</tbody></table></div>
      </div>
    </StaffShell>
  );
}
