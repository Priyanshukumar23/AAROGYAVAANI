import { Link } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { VoiceBar } from '../../components/ui';

export default function Identification() {
  const cards = [
    { to: '/checkin/abha-qr', icon: '📷', t: 'Scan ABHA QR', d: 'Fastest — scan the QR on your ABHA card or phone' },
    { to: '/checkin/abha-mobile', icon: '🔢', t: 'Enter ABHA / Mobile', d: 'Type your 14-digit ABHA or 10-digit mobile number' },
    { to: '/checkin/register', icon: '📝', t: 'New Registration', d: 'First visit? Register in under a minute' }
  ];
  return (
    <KioskShell stepLabel="STEP 1 · PATIENT CHECK-IN" title="How would you like to identify yourself?" back="/checkin/accessibility" progress={25} hideNav>
      <VoiceBar text="Choose how to identify yourself: scan QR, enter number, or register." />
      <div className="grid cols-3">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card selectable" style={{ textAlign: 'center', minHeight: 200, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
              <div style={{ fontSize: 48 }}>{c.icon}</div>
              <h3>{c.t}</h3>
              <p className="small muted">{c.d}</p>
              <span className="btn btn-primary btn-block">Select</span>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
        <Link className="btn btn-secondary" to="/checkin/accessibility">Back</Link>
      </div>
    </KioskShell>
  );
}
