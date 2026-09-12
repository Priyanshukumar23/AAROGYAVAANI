import { Link } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { VoiceBar } from '../../components/ui';

export default function DocScanner() {
  return (
    <KioskShell stepLabel="STEP 4 · DOCUMENTS" title="Place Document on Scanner" back="/documents/intro" progress={94} hideNav>
      <VoiceBar text="Place your prescription face down and tap Capture." />
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="qrbox" style={{ width: '100%', maxWidth: 480, height: 260, fontSize: 20 }}>📄 Prescription preview (mock frame)<br />— align edges —</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" to="/documents/processing">📷 Capture</Link>
          <Link className="btn btn-ghost" to="/documents/intro">Retake</Link>
        </div>
      </div>
    </KioskShell>
  );
}
