import { Link, useParams } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';

export default function ConsultationComplete() {
  const { id } = useParams();
  
  return (
    <StaffShell role="doctor" title="Consultation Complete ✅" subtitle={`${id || 'A-142'} — synced to Patient Portal & ABDM`}>
      <div className="card" style={{ textAlign: 'center', padding: 28 }}>
        <div style={{ fontSize: 44 }}>📝</div>
        <h2 style={{ margin: '8px 0' }}>Consultation recorded & sent to patient</h2>
        <p className="muted">The diagnosis, prescription, and advice have been securely sent to the patient's dashboard.</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}>
          <Link className="btn btn-primary" to="/doctor/dashboard">Back to OPD Queue</Link>
        </div>
      </div>
    </StaffShell>
  );
}
