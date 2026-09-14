import { Link } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { VoiceBar, StatusTag } from '../../components/ui';

export default function DocComplete() {
  return (
    <KioskShell stepLabel="STEP 3 · DOCUMENTS" title="Documents Synced ✓" progress={99} hideNav>
      <VoiceBar text="Your documents are synced. Your doctor can see them now." />
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>✅</div>
        <h3>3 documents synced to your visit</h3>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '10px 0' }}><StatusTag kind="info">Synced to doctor</StatusTag><StatusTag kind="neutral">Dr. A. Verma · Room 104</StatusTag></div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
          <Link className="btn btn-primary" to="/vitals">Continue to Vitals</Link>
          <Link className="btn btn-secondary" to="/queue/status">View Queue</Link>
        </div>
      </div>
    </KioskShell>
  );
}
