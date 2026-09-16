import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { api } from '../../data/api';

export default function MedicalTimeline() {
  const { id } = useParams();
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [f, setF] = useState('All');
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    api.get(`/patients/${id || 'A-142'}/timeline`).then(data => {
      setTimeline(data.reverse());
      setLoading(false);
    }).catch(console.error);
  }, [id]);

  const list = timeline.filter(e => f === 'All' || (f === 'Consultations' && e.kind === 'consultation') || (f === 'Documents' && e.kind === 'document'));

  return (
    <StaffShell role="doctor" title={`Clinical Timeline — ${id}`} subtitle="ABDM-linked longitudinal record (FHIR R4)">
      <div className="card" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['All', 'Consultations', 'Documents'].map(x => (
          <button key={x} className={'btn btn-sm ' + (f === x ? 'btn-blue' : 'btn-ghost')} onClick={() => setF(x)}>{x}</button>
        ))}
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>⬇ Export EHR</button>
          <Link className="btn btn-ghost btn-sm" to={`/doctor/case/${id}`}>Back to Case</Link>
        </span>
      </div>
      <div className="card timeline" style={{ marginTop: 12 }}>
        {loading && <div className="muted small">Loading patient history...</div>}
        {!loading && list.length === 0 && <div className="muted small">No past records found for this patient.</div>}
        
        {list.map((e, i) => (
          <div key={i} className="t-item">
            <span className="tag tag-neutral" style={{ textTransform: 'capitalize' }}>{e.kind}</span>
            <strong>{new Date(e.timestamp || e._id?.replace(/^[a-z]+/, '') * 1 || Date.now()).toLocaleDateString()}</strong>
            
            {e.kind === 'consultation' && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontWeight: 600, color: 'var(--blue-dark)' }}>{e.dx || 'Clinical Encounter'}</div>
                {e.rx && e.rx.length > 0 && (
                  <div className="small muted" style={{ marginTop: 4 }}>
                    <strong>Prescriptions:</strong> {e.rx.map(r => `${r.drug} (${r.dose})`).join(', ')}
                  </div>
                )}
                {e.advice && (
                  <div className="small muted" style={{ marginTop: 4 }}>
                    <strong>Advice:</strong> {e.advice}
                  </div>
                )}
              </div>
            )}
            
            {e.kind === 'document' && (
              <p className="muted" style={{ margin: '4px 0' }}>📄 Document Uploaded</p>
            )}
          </div>
        ))}

        {notes.map((n, i) => <div key={'n' + i} className="t-item"><span className="tag tag-info">Note</span><p style={{ margin: '4px 0' }}>{n}</p></div>)}
      </div>
      <div className="card" style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <input className="input staff" placeholder="Add note — visible to care team." value={draft} onChange={e => setDraft(e.target.value)} style={{ flex: 1 }} />
        <button className="btn btn-primary btn-sm" onClick={() => { if (draft.trim()) { setNotes(n => [...n, draft.trim()]); setDraft(''); } }}>Add Note</button>
      </div>
    </StaffShell>
  );
}
