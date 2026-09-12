import { Link, useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar, StatusTag } from '../../components/ui';

export default function InfoConfirmation() {
  const { state, patch } = useApp();
  const p = state.patient || {};
  const nav = useNavigate();
  const issue = async () => {
    const tokenNo = 'A-14' + Math.floor(Math.random() * 9 + 1);
    const token = { tokenNo, room: 'Room 104', position: 14, waitMin: 42, nowServing: 'A-127' };
    patch({ token });
    try { await fetch('/api/tokens', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patient: p, token }) }); } catch {}
    nav('/checkin/department');
  };
  return (
    <KioskShell stepLabel="STEP 1 · PATIENT CHECK-IN" title="Confirm Your Details" back="/checkin/identify" progress={48} hideNav>
      <VoiceBar text="Please confirm your details are correct before we issue your token." />
      <div className="card">
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}><StatusTag kind="info">ABHA Verified</StatusTag><StatusTag kind="neutral">{p.uhid || 'UHID pending'}</StatusTag></div>
        <div className="grid cols-2">
          <div><b>Name</b><br />{p.name || '—'}</div>
          <div><b>Age / Gender</b><br />{p.age || '—'} · {p.gender || '—'}</div>
          <div><b>Mobile</b><br />{p.mobile || '—'}</div>
          <div><b>City / State</b><br />{p.city || '—'}, {p.state || '—'}</div>
          <div><b>ABHA</b><br /><span className="mono">{p.abha || '—'}</span></div>
          <div><b>UHID</b><br /><span className="mono">{p.uhid || '—'}</span></div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          <Link className="btn btn-secondary" to="/checkin/register">Make Changes</Link>
          <button className="btn btn-primary" onClick={issue}>Yes, Issue Token</button>
        </div>
      </div>
    </KioskShell>
  );
}
