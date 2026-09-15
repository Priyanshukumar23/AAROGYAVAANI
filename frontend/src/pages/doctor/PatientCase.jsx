import { Link, useParams } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { PriorityTag } from '../../components/ui';
import { MOCK_VITALS } from '../../data/mock';
import { getQueue } from '../../data/queueStore';

const OPQRST = [
  ['Onset', 'Sudden, ~24h ago, after climbing stairs'],
  ['Provokes', 'Exertion, cold exposure'],
  ['Quality', 'Pressing / heaviness, retrosternal'],
  ['Radiates', 'Left shoulder + jaw'],
  ['Severity', '8/10 at peak, 4/10 at rest'],
  ['Time', 'Episodes 5–10 min, 3× in 24h'],
];

export default function PatientCase() {
  const { tokenNo = 'A-142' } = useParams();
  const id = tokenNo;
  const queued = getQueue().find((t) => t.tokenNo === id || t.uhid === id);
  const patientName = queued?.name || queued?.patientName || 'Ramesh Kumar Sharma';
  const ageSex = queued ? `${queued.age || ''}${queued.sex || ''}`.trim() || '48M' : '48M';
  const uhid = queued?.uhid || '84-2210-9913';
  const priority = queued?.priority || 'P1';
  const complaint = queued?.complaint || queued?.chiefComplaint || 'Severe chest discomfort with exertional dyspnea (~24h).';
  const initials = patientName.split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('') || 'RK';
  return (
    <StaffShell role="doctor" title={`Case ${id} · ${patientName}`} subtitle={`${ageSex} · UHID ${uhid} · ABDM linked · ${priority} ${priority === 'P1' ? 'Emergency' : priority === 'P2' ? 'Urgent' : 'Routine'}`}>
      <div className="alert-banner alert-p1">🚨 RED FLAG — Suspected ACS · Chest pain + HTN 150/94 · ECG pending · <Link to="/doctor/alerts" style={{ color: '#fff', fontWeight: 800 }}>View STAT alert</Link></div>
      <div className="notice small" style={{ marginTop: 12 }}>
        🤖 AI Case Summary Ready · 96% confidence — <Link to="/doctor/summary">open AI Clinical Summary</Link>
        {' · '}Chief Complaint · HPI · Past History · Medications · Allergies · Family History · Review of Systems · Red Flags ·{' '}
        <Link to="/doctor/documents">Documents</Link> · <Link to={`/doctor/timeline/${id}`}>Timeline</Link>
        <div className="muted" style={{ marginTop: 4 }}>AI-generated clinical information. Verify all AI-generated information before making clinical decisions. AI does not diagnose, prescribe, or finalize care.</div>
      </div>
      <div className="card doc-head" style={{ marginTop: 12 }}>
        <div className="avatar">{initials}</div>
        <div><h3 style={{ margin: 0 }}>{patientName}, {ageSex}</h3><div className="muted small">Hindi · Kiosk intake · Allergies: Penicillin (rash)</div></div>
        <span style={{ marginLeft: 'auto' }}><PriorityTag level={priority} /></span>
      </div>
      <div className="split split-2" style={{ marginTop: 12 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Chief Complaint</h3>
          <p><strong>{complaint}</strong></p>
          <div className="notice small">🎙 Audio transcript (Hindi→EN): “कल सीढ़ी चढ़ते समय सीने में भारीपन हुआ, बाएँ कंधे तक दर्द गया…” — <Link to={`/doctor/transcript/${id}`}>full transcript</Link></div>
          <h4>OPQRST — HPI</h4>
          <div className="vital-grid">{OPQRST.map(([k, v]) => <div key={k} className="vital"><div className="small muted">{k}</div><strong>{v}</strong></div>)}</div>
        </div>
        <div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Vitals <span className="tag tag-p1">2 abnormal</span></h3>
            <div className="vital-grid">{MOCK_VITALS.map(v => <div key={v.k} className={'vital ' + v.warn}><div className="small muted">{v.k}</div><strong>{v.v}</strong><div className="small">{v.s}</div></div>)}</div>
          </div>
          <div className="alert-banner alert-p2" style={{ marginTop: 12 }}>⚠️ Allergy: <strong>Penicillin — rash / anaphylaxis risk.</strong> Avoid amoxicillin &amp; penicillins.</div>
          <div className="card" style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link className="btn btn-blue btn-sm" to={`/doctor/transcript/${id}`}>View Transcript</Link>
            <Link className="btn btn-ghost btn-sm" to={`/doctor/timeline/${id}`}>Timeline</Link>
            <Link className="btn btn-ghost btn-sm" to="/doctor/documents">Documents</Link>
            <Link className="btn btn-primary btn-sm" to="/doctor/workspace">Start Consultation →</Link>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
