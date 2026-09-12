import { Link } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { VoiceBar } from '../../components/ui';

export default function DocIntro() {
  return (
    <KioskShell stepLabel="STEP 4 · DOCUMENTS" title="Scan Your Medical Documents" back="/history/review" progress={93} hideNav>
      <VoiceBar text="Scan prescriptions or lab reports so your doctor can see them instantly." />
      <div className="card">
        <h3>Why scan?</h3>
        <div className="grid cols-3" style={{ marginTop: 10 }}>
          <div className="notice">📄 <b>Auto-read</b><br /><span className="small">AI extracts diagnosis & medicines.</span></div>
          <div className="notice">🕒 <b>Timeline</b><br /><span className="small">Builds your health history.</span></div>
          <div className="notice">⚠️ <b>Flags issues</b><br /><span className="small">Abnormal labs highlighted.</span></div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" to="/documents/scanner">Start Scanning</Link>
          <Link className="btn btn-ghost" to="/queue/status">Skip for now</Link>
        </div>
      </div>
    </KioskShell>
  );
}
