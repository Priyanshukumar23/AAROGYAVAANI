import { Link } from 'react-router-dom';
import KioskShell from '../components/KioskShell';
import { useApp } from '../context/AppContext';
import { VoiceBar } from '../components/ui';
import { MOCK_VITALS } from '../data/mock';

export default function VitalsInfo() {
  const { state } = useApp();
  const t = state.token || {};
  return (
    <KioskShell stepLabel="STEP 4 · VITALS" title="Vitals at Counter 02" back="/documents/complete" progress={100} hideNav>
      <VoiceBar text="Please get your vitals checked at Counter 2, then watch your queue status." />
      <div className="grid cols-2">
        <div className="card">
          <h3>What to do now</h3>
          <p>1️⃣ Walk to <b>Counter 02</b> (near the waiting hall).<br />2️⃣ Show your token <b className="mono">{t.tokenNo || 'A-142'}</b>.<br />3️⃣ Staff will record BP, SpO2, pulse & temperature.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
            <Link className="btn btn-primary" to="/queue/status">Go to Queue Status</Link>
            <Link className="btn btn-secondary" to={`/triage/vitals/${t.tokenNo || 'A-142'}`}>Staff: Record Vitals</Link>
          </div>
        </div>
        <div className="card">
          <h3>Preview (example)</h3>
          {MOCK_VITALS.slice(0, 4).map((v) => <div key={v.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--line)' }}><span>{v.k}</span><b className="mono">{v.v}</b></div>)}
          <p className="small muted" style={{ marginTop: 8 }}>Actual vitals are recorded by staff at the counter.</p>
        </div>
      </div>
    </KioskShell>
  );
}
