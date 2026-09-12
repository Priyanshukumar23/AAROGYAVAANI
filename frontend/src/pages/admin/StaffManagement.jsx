import { useState } from 'react';
import StaffShell from '../../components/StaffShell';
import { Kpi, StatusTag } from '../../components/ui';

const SEED = [
  { name: 'Dr. R. Sharma', id: 'DOC-104', role: 'Doctor', dept: 'General Medicine', room: 'Room 104', duty: true },
  { name: 'Dr. S. Iyer', id: 'DOC-201', role: 'Doctor', dept: 'Orthopedics', room: 'Room 201', duty: true },
  { name: 'Meena Kumari', id: 'NRS-201', role: 'Nurse', dept: 'Triage', room: 'Central Desk', duty: true },
  { name: 'A. Verma', id: 'TEC-310', role: 'Technician', dept: 'Radiology', room: 'ECG Room', duty: false },
  { name: 'V. Sen', id: 'ADM-001', role: 'Admin', dept: 'Operations', room: '—', duty: true },
];

export default function StaffManagement() {
  const [rows, setRows] = useState(SEED);
  const [dept, setDept] = useState('All');
  const [role, setRole] = useState('All');
  const [q, setQ] = useState('');
  const [f, setF] = useState({ name: '', id: '', role: 'Doctor', dept: 'General Medicine', room: '' });
  const filtered = rows.filter(r =>
    (dept === 'All' || r.dept === dept) && (role === 'All' || r.role === role) &&
    (!q || (r.name + r.id + r.room).toLowerCase().includes(q.toLowerCase())));
  const add = (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.id.trim()) return;
    setRows(r => [...r, { ...f, duty: true }]); setF({ name: '', id: '', role: 'Doctor', dept: 'General Medicine', room: '' });
  };
  return (
    <StaffShell role="admin" title="Staff & Doctors" subtitle="Roster · duty status · ABDM credentials">
      <div className="kpi-row"><Kpi v="128" l="Staff" sub="on rolls" /><Kpi v="36" l="On Duty" sub="now" /><Kpi v="6" l="Triage Desks" sub="staffed" /><Kpi v="100%" l="ABDM Creds" sub="verified" /></div>
      <div className="card" style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select className="input staff" value={dept} onChange={e => setDept(e.target.value)} style={{ maxWidth: 180 }}>{['All', 'General Medicine', 'Orthopedics', 'Triage', 'Radiology', 'Operations'].map(d => <option key={d}>{d}</option>)}</select>
        <select className="input staff" value={role} onChange={e => setRole(e.target.value)} style={{ maxWidth: 150 }}>{['All', 'Doctor', 'Nurse', 'Technician', 'Admin'].map(d => <option key={d}>{d}</option>)}</select>
        <input className="input staff" placeholder="Search name / ID / room…" value={q} onChange={e => setQ(e.target.value)} style={{ flex: 1, minWidth: 180 }} />
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="table-wrap"><table className="tbl">
          <thead><tr><th>Name</th><th>ID</th><th>Role</th><th>Dept</th><th>Room</th><th>Duty</th></tr></thead>
          <tbody>{filtered.map(r => (
            <tr key={r.id}><td><strong>{r.name}</strong></td><td>{r.id}</td><td>{r.role}</td><td>{r.dept}</td><td>{r.room}</td>
              <td><button className="btn btn-sm" onClick={() => setRows(x => x.map(y => y.id === r.id ? { ...y, duty: !y.duty } : y))} style={{ border: '1px solid var(--line)', borderRadius: 20, padding: '2px 10px' }}>{r.duty ? '🟢 On' : '⚪ Off'}</button></td></tr>
          ))}</tbody></table></div>
      </div>
      <form className="card" onSubmit={add} style={{ marginTop: 12 }}>
        <h3 style={{ marginTop: 0 }}>Register New Staff <StatusTag kind="info">ABDM e-sign auto</StatusTag></h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div className="field" style={{ flex: 1, minWidth: 140 }}><label>Name</label><input className="input staff" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="Dr. …" /></div>
          <div className="field" style={{ width: 120 }}><label>ID</label><input className="input staff" value={f.id} onChange={e => setF({ ...f, id: e.target.value })} placeholder="DOC-…" /></div>
          <div className="field" style={{ width: 130 }}><label>Role</label><select className="input staff" value={f.role} onChange={e => setF({ ...f, role: e.target.value })}><option>Doctor</option><option>Nurse</option><option>Technician</option><option>Admin</option></select></div>
          <div className="field" style={{ flex: 1, minWidth: 140 }}><label>Dept</label><input className="input staff" value={f.dept} onChange={e => setF({ ...f, dept: e.target.value })} /></div>
          <div className="field" style={{ width: 120 }}><label>Room</label><input className="input staff" value={f.room} onChange={e => setF({ ...f, room: e.target.value })} placeholder="Room …" /></div>
        </div>
        <button className="btn btn-blue btn-sm" type="submit">+ Register</button>
      </form>
    </StaffShell>
  );
}
