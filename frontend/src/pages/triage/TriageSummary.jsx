import { useNavigate, useParams } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { PriorityTag } from '../../components/ui';
import { api } from '../../data/api';

export default function TriageSummary() {
  const { id = 'A-142' } = useParams();
  const nav = useNavigate();
  const dispatch = async () => {
    try { await api.patch(`/tokens/${id}`, { status: 'with-doctor' }); } catch {}
    nav(`/triage/handoff/${id}`);
  };
  return (
    <StaffShell role="nurse" title={`Triage Summary · ${id}`} subtitle="Consolidated review before dispatch">
      <div className="card">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><h3 style={{ margin: 0 }}>Ramesh Kumar Sharma, 48M</h3><PriorityTag level="P1" /></div>
        <p className="small"><strong>Complaint:</strong> exertional chest heaviness 24h → L shoulder/jaw + diaphoresis<br />
          <strong>Vitals:</strong> BP 150/94 · HR 88 · SpO2 98% · Pain 8/10 · <strong>Allergy: Penicillin</strong></p>
        <div className="notice small">✓ Checklist 5/5 — vitals done · allergy banded · ECG ordered · consent · ABDM synced</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button className="btn btn-primary" onClick={dispatch}>Dispatch to Doctor →</button>
        </div>
      </div>
    </StaffShell>
  );
}
