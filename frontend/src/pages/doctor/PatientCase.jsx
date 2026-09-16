import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { PriorityTag, StatusTag } from '../../components/ui';
import { api } from '../../data/api';

export default function PatientCase() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/patients/${id || 'A-142'}/case`).then(d => {
      setData(d);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <StaffShell role="doctor" title="Loading Case..."><div className="card">Loading patient data...</div></StaffShell>;
  
  const token = data?.token || {};
  const patient = data?.patient || {};
  const hpi = data?.hpi || {};
  
  const patientName = patient.name || token.patientName || 'Unknown Patient';
  const ageSex = `${patient.age || '--'}${patient.gender ? patient.gender[0] : 'M'}`;
  const uhid = patient.uhid || token.uhid || '--';
  const priority = token.priority || 'P3';
  const complaint = token.chiefComplaint || data?.chiefComplaint || 'No chief complaint recorded.';
  
  const initials = patientName.split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('') || 'PT';

  return (
    <StaffShell role="doctor" title={`Case ${id} — ${patientName}`} subtitle={`${ageSex} — UHID ${uhid} — ABDM linked — ${priority} ${priority === 'P1' ? 'Emergency' : priority === 'P2' ? 'Urgent' : 'Routine'}`}>
      
      {priority === 'P1' && (
        <div className="alert-banner alert-p1">🚨 RED FLAG - Suspected Emergency — Immediate Attention Required</div>
      )}

      <div className="notice small" style={{ marginTop: 12 }}>
        ✨ AI Case Summary Ready — <Link to={`/doctor/summary/${id}`}>open AI Clinical Summary</Link>
        {' • '}Chief Complaint • HPI • Past History • Medications • Allergies
        <div className="muted" style={{ marginTop: 4 }}>AI-generated clinical information. Verify all AI-generated information before making clinical decisions.</div>
      </div>

      <div className="card doc-head" style={{ marginTop: 12 }}>
        <div className="avatar">{initials}</div>
        <div>
          <h3 style={{ margin: 0 }}>{patientName}, {ageSex}</h3>
          <div className="muted small">{patient.language || 'English'} • Kiosk intake</div>
        </div>
        <span style={{ marginLeft: 'auto' }}><PriorityTag level={priority} /></span>
      </div>

      <div className="split split-2" style={{ marginTop: 12 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Chief Complaint</h3>
          <p><strong>{complaint}</strong></p>
          
          <div className="notice small">
            AI Extracted Symptoms: <strong>{hpi.symptoms?.join(', ') || 'None recorded'}</strong>
          </div>
          
          <h4>AI Assessment (Editable in Workspace)</h4>
          <p className="small">{hpi.aiNotes || data?.aiNote || 'AI suggests verifying symptoms during consultation.'}</p>
          
          <h4>Past History</h4>
          <p className="small">{data?.pastHistory?.conds?.join(', ') || 'No known conditions'}</p>
        </div>

        <div>
          <div className="card" style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link className="btn btn-blue btn-sm" to={`/doctor/transcript/${id}`}>View Transcript</Link>
            <Link className="btn btn-ghost btn-sm" to="/doctor/documents">Documents</Link>
            <Link className="btn btn-primary btn-sm" to={`/doctor/workspace/${id}`}>Start Consultation ➔</Link>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
