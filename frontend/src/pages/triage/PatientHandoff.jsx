import { Link, useParams } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';

export default function PatientHandoff() {
  const { id = 'A-142' } = useParams();
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  return (
    <StaffShell role="nurse" title="Handoff Complete ✓" subtitle={`${id} transmitted to Doctor · Room 104`}>
      <div className="card" style={{ textAlign: 'center', padding: 28 }}>
        <div style={{ fontSize: 44 }}>📡</div>
        <h2>Transmission successful</h2>
        <p className="muted small">EMR synced {time} · NABH checklist 5/5 passed</p>
        <p><span className="tag tag-info">Triage Desk</span> → <span className="tag tag-p1">Dr. Sharma · Room 104</span></p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
          <Link className="btn btn-ghost" to="/triage/dashboard">Return Queue</Link>
          <Link className="btn btn-primary" to={`/doctor/case/${id}`}>View Dossier →</Link>
        </div>
      </div>
    </StaffShell>
  );
}
