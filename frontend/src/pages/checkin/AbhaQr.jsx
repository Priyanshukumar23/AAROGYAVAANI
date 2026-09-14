import { Link, useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar } from '../../components/ui';

export default function AbhaQr() {
  const { patchPatient } = useApp();
  const nav = useNavigate();
  const simulate = () => {
    patchPatient({ name: 'Ramesh Kumar Sharma', age: 48, gender: 'Male', mobile: '+91 98765 43210', state: 'Delhi', city: 'South Delhi', abha: '91-4582-9012-3456', uhid: 'AIIMS-2025-08492' });
    nav('/checkin/confirm');
  };
  return (
    <KioskShell stepLabel="STEP 1 · CHECK-IN" title="Scan ABHA QR Code" back="/checkin/identify" progress={30} hideNav>
      <VoiceBar text="Hold your ABHA QR inside the frame to scan." />
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="qrbox">▦</div>
        <p className="muted" style={{ marginTop: 12 }}>Align the QR inside the frame · Camera active (mock)</p>
        <div className="ocr-bar" style={{ maxWidth: 320, margin: '12px auto' }}><div className="ocr-fill" style={{ width: '45%' }} /></div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={simulate}>Simulate Successful Scan</button>
          <Link className="btn btn-secondary" to="/checkin/abha-mobile">Enter number manually</Link>
        </div>
        <div style={{ marginTop: 12 }}><Link className="btn btn-ghost" to="/checkin/identify">Back</Link></div>
      </div>
    </KioskShell>
  );
}
