import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';

const EVENTS = [
  { d: 'Today · Kiosk intake', t: 'OPD', c: 'Chest discomfort triaged P1 · vitals synced · ECG ordered' },
  { d: 'Mar 2025 · OPD Gen Med', t: 'OPD', c: 'HTN follow-up · Amlodipine 5mg · BP 146/92' },
  { d: 'Nov 2024 · Lab', t: 'Labs', c: 'Lipids: LDL 148, HbA1c 6.1 · CBC normal' },
  { d: 'Aug 2024 · OPD', t: 'OPD', c: 'Viral URI · resolved' },
  { d: 'Feb 2024 · Rx', t: 'Prescriptions', c: 'Amlodipine 5mg OD · Atorvastatin 10mg HS' },
];

export default function MedicalTimeline() {
  const { id = 'A-142' } = useParams();
  const [f, setF] = useState('All');
  const [notes, setNotes] = useState(['Nurse: ECG leads placed, tracing sent to cardiology.']);
  const [draft, setDraft] = useState('');
  const list = EVENTS.filter(e => f === 'All' || e.t === f);
  return (
    <StaffShell role="doctor" title={`Clinical Timeline · ${id}`} subtitle="ABDM-linked longitudinal record (FHIR R4)">
      <div className="card" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['All', 'OPD', 'Prescriptions', 'Labs'].map(x => (
          <button key={x} className={'btn btn-sm ' + (f === x ? 'btn-blue' : 'btn-ghost')} onClick={() => setF(x)}>{x}</button>
        ))}
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>⬇ Export EHR</button>
          <Link className="btn btn-ghost btn-sm" to={`/doctor/case/${id}`}>Back to Case</Link>
        </span>
      </div>
      <div className="card timeline" style={{ marginTop: 12 }}>
        {list.map((e, i) => <div key={i} className="t-item"><span className="tag tag-neutral">{e.t}</span> <strong>{e.d}</strong><p className="muted" style={{ margin: '4px 0' }}>{e.c}</p></div>)}
        {notes.map((n, i) => <div key={'n' + i} className="t-item"><span className="tag tag-info">Note</span><p style={{ margin: '4px 0' }}>{n}</p></div>)}
      </div>
      <div className="card" style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <input className="input staff" placeholder="Add note — visible to care team…" value={draft} onChange={e => setDraft(e.target.value)} style={{ flex: 1 }} />
        <button className="btn btn-primary btn-sm" onClick={() => { if (draft.trim()) { setNotes(n => [...n, draft.trim()]); setDraft(''); } }}>Add Note</button>
      </div>
    </StaffShell>
  );
}
