import { Link } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { PriorityTag } from '../../components/ui';

export default function RedFlag() {
  const { state } = useApp();
  const reason = state.intake?.chiefComplaint || 'Severe symptom detected';
  return (
    <KioskShell stepLabel="STEP 2 · CLINICAL HISTORY" title="Important Safety Notice" progress={84} hideNav>
      <div className="alert-banner alert-p1">
        <span style={{ fontSize: 32 }}>🚨</span>
        <div>
          <PriorityTag level="P1" label="Emergency · Red flag detected" />
          <h3 style={{ marginTop: 8 }}>Staff notified — please stay seated.</h3>
          <p>Detected reason: <b>“{reason}”</b>. A nurse will check on you shortly. Do not leave the kiosk area.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
            <button className="btn btn-danger" onClick={() => alert('Help requested. A nurse is on the way to this kiosk.')}>Call Help Now</button>
            <Link className="btn btn-primary" to="/history/past-history">I Understand — Continue</Link>
          </div>
        </div>
      </div>
    </KioskShell>
  );
}
