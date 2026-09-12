import { Link } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { Progress } from '../../components/ui';

export default function AiSummary() {
  const verify = () => alert('Summary verified & signed. e-Sign recorded in audit log.');
  return (
    <StaffShell role="doctor" title="AI Clinical Summary" subtitle="Generated from kiosk intake + vitals · verify before consult">
      <div className="split split-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Chief Complaint</h3>
          <p>48M with 24h exertional retrosternal heaviness radiating to left shoulder/jaw, diaphoresis, HTN.</p>
          <h4>OPQRST</h4>
          <ul className="small"><li>Onset 24h · exertional · pressing quality</li><li>Radiation + · Severity 8/10 · 5–10 min episodes ×3</li></ul>
          <h4>Risk Flags</h4>
          <div className="alert-banner alert-p1">🚨 Possible ACS · HEART score ~6 (high) · HTN 150/94 · Penicillin allergy</div>
        </div>
        <div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Suggested Differentials</h3>
            <ul className="small"><li>1. Acute coronary syndrome (NSTEMI/UA) — most likely</li><li>2. Stable angina with HTN urgency</li><li>3. GERD / MSK — less likely</li></ul>
            <h4>Suggested Investigations</h4>
            <ul className="small"><li>STAT ECG · Troponin I ×2 · CBC, KFT, Lipids</li><li>Echo if troponin + · Chest X-ray</li></ul>
            <div style={{ marginTop: 8 }}><span className="small muted">Model confidence 94%</span><Progress value={94} /></div>
          </div>
          <div className="card" style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-sm" onClick={verify}>✓ Verify &amp; Sign</button>
            <Link className="btn btn-blue btn-sm" to="/doctor/workspace">Open Workspace</Link>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
