import { Link } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';

export default function ConsultationComplete() {
  return (
    <StaffShell role="doctor" title="Consultation Complete ✓" subtitle="A-142 · Ramesh Kumar Sharma · synced to ABDM">
      <div className="card" style={{ textAlign: 'center', padding: 28 }}>
        <div style={{ fontSize: 44 }}>✅</div>
        <h2 style={{ margin: '8px 0' }}>Consultation recorded &amp; e-signed</h2>
        <p className="muted">Dx: Unstable angina (?NSTEMI) · Troponin + ECG ordered · Cardiology referral sent</p>
        <div className="table-wrap"><table className="tbl"><thead><tr><th>Drug</th><th>Dose</th><th>Days</th></tr></thead>
          <tbody><tr><td>Aspirin</td><td>75mg</td><td>30</td></tr><tr><td>Atorvastatin</td><td>40mg</td><td>30</td></tr></tbody></table></div>
        <p className="small muted">Follow-up: tomorrow with troponin/ECG · SOS chest pain → ED immediately</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
          <Link className="btn btn-primary" to="/exit/summary">Visit Summary →</Link>
          <Link className="btn btn-ghost" to="/doctor/dashboard">Back to Dashboard</Link>
        </div>
      </div>
    </StaffShell>
  );
}
