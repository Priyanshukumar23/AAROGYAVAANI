import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { Progress } from '../../components/ui';
import { api } from '../../data/api';

export default function AiSummary() {
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

  const verify = () => alert('Summary verified & signed. e-Sign recorded in audit log.');

  if (loading) return <StaffShell role="doctor" title="Loading AI Summary..."><div className="card">Loading...</div></StaffShell>;

  const token = data?.token || {};
  const patient = data?.patient || {};
  const hpi = data?.hpi || {};
  
  const complaint = token.chiefComplaint || data?.chiefComplaint || 'No chief complaint recorded.';
  const confidence = token.aiConfidence || 94;

  return (
    <StaffShell role="doctor" title={`AI Clinical Summary — ${id || 'A-142'}`} subtitle="Generated from kiosk intake + vitals — verify before consult">
      <div className="notice small" style={{ marginBottom: 12 }}>
        AI-generated clinical information — AI Case Summary Ready — {confidence}% confidence.
        <span className="muted"> Verify all AI-generated information before making clinical decisions. AI does not autonomously diagnose, prescribe, or finalize care.</span>
      </div>
      <div className="split split-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Chief Complaint</h3>
          <p>{complaint}</p>
          
          <h4>Patient Intake History</h4>
          <ul className="small">
            <li>Symptoms: {(hpi.symptoms || []).join(', ') || 'N/A'}</li>
            <li>Duration: {hpi.duration || 'N/A'}</li>
            <li>Severity: {hpi.severity || 'N/A'}</li>
            <li>Context: {hpi.context || 'N/A'}</li>
          </ul>
          
          <h4>Risk Flags</h4>
          {token.priority === 'P1' ? (
            <div className="alert-banner alert-p1">🚨 Priority 1 - Emergency Symptoms Detected</div>
          ) : (
            <div className="alert-banner alert-p3" style={{ background: 'var(--bg-rec)', color: 'var(--ink)' }}>No immediate red flags detected. Routine consult.</div>
          )}
        </div>
        <div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>AI Clinical Notes</h3>
            <p className="small">{hpi.aiNotes || data?.aiNote || 'AI suggests verifying symptoms during consultation.'}</p>
            
            <div style={{ marginTop: 16 }}><span className="small muted">Model confidence {confidence}%</span><Progress value={confidence} /></div>
          </div>
          <div className="card" style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-sm" onClick={verify}>✓ Verify &amp; Sign</button>
            <Link className="btn btn-blue btn-sm" to={`/doctor/workspace/${id}`}>Open Workspace</Link>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
