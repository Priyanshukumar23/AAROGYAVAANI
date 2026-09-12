import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../data/api';

const DEMO = [
  ['DOC-104', 'doctor123', 'doctor'],
  ['NUR-88421', 'nurse123', 'nurse'],
  ['ADM-01', 'admin123', 'admin']
];
const ROUTE = { doctor: '/doctor/dashboard', nurse: '/triage/dashboard', admin: '/admin/dashboard' };

export default function StaffLogin() {
  const nav = useNavigate();
  const { patch } = useApp();
  const [staffId, setStaffId] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');

  const signin = async (e) => {
    e.preventDefault(); setErr('');
    try {
      const r = await api.login(staffId.trim(), pw);
      const user = r.user || r;
      const role = user.role || 'doctor';
      patch({ staff: { name: user.name || staffId, role } });
      nav(ROUTE[role] || '/doctor/dashboard');
      return;
    } catch {}
    const hit = DEMO.find(([id, p]) => id.toLowerCase() === staffId.trim().toLowerCase() && p === pw);
    if (!hit) { setErr('Invalid credentials. Try a demo ID below.'); return; }
    patch({ staff: { name: hit[0], role: hit[2] } });
    nav(ROUTE[hit[2]]);
  };

  return (
    <div className="login-wrap">
      <div className="login-side">
        <Link to="/" style={{ color: '#fff' }}>← Welcome Screen</Link>
        <div className="tag tag-info" style={{ alignSelf: 'flex-start' }}>Secure Hospital Staff Access</div>
        <h1>Hospital Staff Login</h1>
        <p style={{ opacity: .85 }}>Sign in to access your authorized MediKiosk workspace. Authentication → Role detection → Doctor, Triage, or Admin portal.</p>
        <ul className="small" style={{ lineHeight: 2 }}>
          <li>✓ ABDM-linked OPD queue + triage</li>
          <li>✓ AI intake, OCR &amp; red-flag escalation</li>
          <li>✓ NABH-audited vitals &amp; e-sign · activity logged</li>
        </ul>
        <h4>Demo credentials</h4>
        <div className="table-wrap"><table className="tbl"><thead><tr><th>ID</th><th>Password</th><th>Role</th></tr></thead>
          <tbody>{DEMO.map(d => <tr key={d[0]}><td>{d[0]}</td><td>{d[1]}</td><td>{d[2]}</td></tr>)}</tbody></table></div>
      </div>
      <form onSubmit={signin} className="login-form">
        <h2>Sign In</h2><p className="muted small">Use staff ID + password. Role auto-routes to the right workspace.</p>
        {err && <div className="alert-banner alert-p2 small" style={{ marginBottom: 12 }}>{err}</div>}
        <div className="field"><label>Staff ID · badge</label><input className="input staff" value={staffId} onChange={e => setStaffId(e.target.value)} placeholder="DOC-104" /></div>
        <div className="field"><label>Password</label>
          <div style={{ display: 'flex', gap: 6 }}><input type={show ? 'text' : 'password'} className="input staff" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••" style={{ flex: 1 }} />
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'}</button></div></div>
        <button className="btn btn-primary btn-block" type="submit">Sign In →</button>
        <p className="small muted" style={{ marginTop: 8 }}>doctor → /doctor/dashboard · nurse → /triage/dashboard · admin → /admin/dashboard</p>
      </form>
    </div>
  );
}
