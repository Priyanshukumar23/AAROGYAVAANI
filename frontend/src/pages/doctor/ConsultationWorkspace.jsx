import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { PriorityTag } from '../../components/ui';
import { api } from '../../data/api';

export default function ConsultationWorkspace() {
  const nav = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  
  const [dx, setDx] = useState('');
  const [rx, setRx] = useState([]);
  const [advice, setAdvice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/patients/${id || 'A-142'}/case`).then(d => {
      setData(d);
      setDx(d?.hpi?.aiNotes || d?.aiNote || 'Pending verification.');
    }).catch(console.error);
  }, [id]);

  if (!data) return <StaffShell role="doctor" title="Workspace"><div className="card">Loading...</div></StaffShell>;

  const token = data.token || {};
  const patient = data.patient || {};
  const patientName = patient.name || token.patientName || 'Unknown';
  const ageSex = `${patient.age || '--'}${patient.gender ? patient.gender[0] : 'M'}`;
  
  const setRow = (i, k, v) => setRx(r => r.map((row, j) => j === i ? { ...row, [k]: v } : row));

  const complete = async () => {
    setSaving(true);
    try { 
      await api.post('/consultations', { tokenNo: id, dx, rx, advice, patientName }); 
    } catch {}
    nav(`/doctor/complete/${id}`);
  };

  return (
    <StaffShell role="doctor" title={`Consultation Workspace — ${id}`} subtitle="3-pane: summary — prescribe — safety">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', gap: 12 }}>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Patient</h4>
          <p className="small"><strong>{patientName}, {ageSex}</strong><br />{token.chiefComplaint || 'Consultation'}</p>
          <h4>AI Summary / Draft Assessment</h4>
          <p className="small muted">{data?.hpi?.aiNotes || data?.aiNote}</p>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Doctor's Assessment & Diagnosis (Edit AI Analysis)</h4>
          <textarea className="input staff" rows={4} value={dx} onChange={e => setDx(e.target.value)} />
          
          <h4>Prescription {rx.length > 0 && <span className="tag tag-neutral">{rx.length}</span>}</h4>
          {rx.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <input className="input staff" placeholder="Drug/Test" value={r.drug} onChange={e => setRow(i, 'drug', e.target.value)} />
              <input className="input staff" placeholder="Dose/Notes" value={r.dose} onChange={e => setRow(i, 'dose', e.target.value)} style={{ maxWidth: 80 }} />
              <input className="input staff" placeholder="Days" value={r.days} onChange={e => setRow(i, 'days', e.target.value)} style={{ maxWidth: 60 }} />
              <button className="btn btn-ghost btn-sm" onClick={() => setRx(r => r.filter((_, j) => j !== i))}>✕</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setRx(r => [...r, { drug: '', dose: '', days: '7' }])}>+ Add Drug / Test</button>
          </div>
          
          <h4>Clinical Advice / Follow-up</h4>
          <textarea className="input staff" rows={2} value={advice} onChange={e => setAdvice(e.target.value)} />
          <button className="btn btn-primary" style={{ marginTop: 10 }} disabled={saving} onClick={complete}>{saving ? 'Saving...' : 'Complete Consultation ➔'}</button>
        </div>
        <div>
          <div className="card">
            <h4 style={{ marginTop: 0 }}>Case Documents</h4>
            <div className="small muted">View past reports and OCR scans.</div>
            <Link className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 8 }} to="/doctor/documents">Open Docs</Link>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
