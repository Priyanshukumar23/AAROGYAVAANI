import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg, #f3f6fb)' }}>
      <div className="card" style={{ maxWidth: 460, textAlign: 'center', padding: 32 }}>
        <div style={{ fontSize: 56 }}>🧭</div>
        <h2>404 · Page not found</h2>
        <p className="muted">This MediKiosk screen doesn&apos;t exist. Pick a safe starting point:</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
          <Link className="btn btn-blue btn-sm" to="/">Kiosk Welcome</Link>
          <Link className="btn btn-ghost btn-sm" to="/doctor/dashboard">Doctor</Link>
          <Link className="btn btn-ghost btn-sm" to="/triage/dashboard">Triage</Link>
          <Link className="btn btn-ghost btn-sm" to="/admin/dashboard">Admin</Link>
        </div>
      </div>
    </div>
  );
}
