import { Link } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { speakText } from '../../components/ui';

export default function ReadyCall() {
  const { state } = useApp();
  const t = state.token || {};
  return (
    <KioskShell stepLabel="STEP 6 · YOUR TURN" title="🔔 You Are Being Called" progress={100} hideNav>
      <div className="call-hero">
        <div className="small" style={{ fontWeight: 800 }}>NOW CALLING</div>
        <h1 className="kiosk-display mono">{t.tokenNo || 'A-142'}</h1>
        <p><b>Please proceed to {t.room || 'Room 104'}</b> · Dr. A. Verma is ready for you.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 }}>
          <button className="btn btn-blue" onClick={() => speakText(`Token ${t.tokenNo}, please proceed to Room 104`)}>🔊 Repeat Call</button>
          <button className="btn btn-secondary" onClick={() => window.print()}>Print Slip</button>
        </div>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h4>Wayfinding — Hall B → Room 104</h4>
        <p className="small">1. Exit waiting Hall B → 2. Turn right, follow blue line → 3. Room 104, 2nd door on left (~40m).</p>
        <Link className="btn btn-primary btn-block" to="/exit/completed">Start Consultation (Exit Demo)</Link>
      </div>
    </KioskShell>
  );
}
