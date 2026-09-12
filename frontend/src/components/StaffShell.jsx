import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { STAFF_LINKS } from '../data/mock';

export default function StaffShell({ children, role = 'doctor', title, subtitle, actions }) {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const links = STAFF_LINKS[role] || STAFF_LINKS.doctor;
  const user = state.staff || (role === 'doctor'
    ? { name: 'Dr. Rajesh Sharma', meta: 'Dept. of General Medicine · Room 104 · AIIMS New Delhi' }
    : role === 'nurse'
      ? { name: 'Sr. Nurse Meena Kumari, RN', meta: 'OPD Central Triage Desk · AIIMS New Delhi' }
      : { name: 'Dr. Vikramaditya Sen', meta: 'Hospital Administrator (Super Admin)' });
  const logout = () => { patch({ staff: null }); nav('/staff/login'); };
  return (
    <div className="staff-layout">
      <aside className="sidebar">
        <div className="brand">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ width: 38, height: 38, borderRadius: 8, background: '#fff', color: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>+</span>
            <div><div style={{ fontWeight: 800, fontFamily: 'var(--font-head)' }}>MediKiosk</div><div className="sub small" style={{ opacity: .75 }}>{role === 'doctor' ? 'Doctor Portal' : role === 'nurse' ? 'Nurse Portal · Triage' : 'Enterprise Ops'}</div></div>
          </div>
        </div>
        <nav>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => 'side-link' + (isActive ? ' active' : '')}>
              <span>{l.icon}</span><span className="label">{l.label}</span>
            </NavLink>
          ))}
          <Link to="/" className="side-link"><span>🏠</span><span className="label">Kiosk Welcome</span></Link>
          <button onClick={logout} className="side-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}><span>⎋</span><span className="label">Logout / Handover</span></button>
        </nav>
        <div className="doc-card"><div style={{ fontWeight: 700 }}>{user.name}</div><div style={{ opacity: .8 }}>{user.meta}</div><div className="small" style={{ marginTop: 6 }}>🟢 Available · ABDM Sync Live</div></div>
      </aside>
      <div className="staff-main">
        <div className="topbar">
          <div className="search"><input className="input staff" placeholder="Search — token, patient, UHID…  (⌘K)" /></div>
          <span className="tag tag-info">ABDM v2 Sync</span>
          <span className="tag tag-neutral">AIIMS New Delhi</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }} className="no-print">
            <span title="Notifications">🔔 3</span>
            <div className="avatar" style={{ width: 36, height: 36 }}>RS</div>
            {actions}
          </div>
        </div>
        <div className="staff-body">
          {(title || subtitle) && (
            <div className="doc-head">
              <div><h2>{title}</h2>{subtitle && <div className="muted">{subtitle}</div>}</div>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
