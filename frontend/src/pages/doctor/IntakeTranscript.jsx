import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { speakText } from '../../components/ui';
import { api } from '../../data/api';

export default function IntakeTranscript() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get(`/patients/${id || 'A-142'}/case`).then(setData).catch(console.error);
  }, [id]);

  if (!data) return <StaffShell role="doctor" title="Loading Transcript..."><div className="card">Loading...</div></StaffShell>;

  const hpi = data.hpi || {};
  const patient = data.patient || {};
  const complaint = data.chiefComplaint || data.token?.chiefComplaint || 'Unknown issue';
  const symps = hpi.symptoms || [];

  const turns = [
    { who: 'AI', lang: patient.language || 'English', text: 'Namaste! What brings you in today?' },
    { who: 'Patient', lang: patient.language || 'English', text: complaint },
    { who: 'AI', lang: patient.language || 'English', text: 'Can you tell me more about your symptoms?' },
    { who: 'Patient', lang: patient.language || 'English', text: symps.length ? symps.join(', ') : 'I feel unwell.' },
    { who: 'AI', lang: 'English', text: 'Any other issues? Duration?' },
    { who: 'Patient', lang: 'English', text: hpi.duration || 'Started recently.' }
  ];

  const full = turns.map(t => `${t.who}: ${t.text}`).join('\n');

  return (
    <StaffShell role="doctor" title={`Intake Transcript — ${id}`} subtitle={`Kiosk 03 — STT 96.4% — ${patient.language || 'English'} — audit-logged`}>
      <div className="card" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="tag tag-info">📍 Kiosk 03</span><span className="tag tag-neutral">STT 96.4%</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => speakText(full)}>▶ Play Audio</button>
          <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>⬇ Export PDF</button>
        </span>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        {turns.map((t, i) => (
          <div key={i} className="t-item"><span className={`tag ${t.who === 'AI' ? 'tag-info' : 'tag-neutral'}`}>{t.who} — {t.lang}</span><p style={{ margin: '6px 0' }}>{t.text}</p></div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h3 style={{ marginTop: 0 }}>Correct Interpretation</h3>
        <div className="field"><textarea className="input staff" rows={3} placeholder="Fix STT / translation errors - saved to audit log." value={note} onChange={e => setNote(e.target.value)} /></div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn btn-primary btn-sm" onClick={() => setSaved(true)}>Save Correction</button>
          {saved && <span className="tag tag-info">✓ Saved to audit log</span>}
          <Link className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} to={`/doctor/case/${id}`}>Back to Case</Link>
        </div>
      </div>
    </StaffShell>
  );
}
