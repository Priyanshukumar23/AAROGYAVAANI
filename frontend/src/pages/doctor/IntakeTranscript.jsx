import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { speakText } from '../../components/ui';

const TURNS = [
  { who: 'AI', lang: 'Hindi', text: 'नमस्ते! आपको क्या तकलीफ़ है? / What brings you in today?' },
  { who: 'Patient', lang: 'Hindi', text: 'कल से सीने में भारीपन है, सीढ़ी चढ़ने पर बढ़ जाता है।' },
  { who: 'AI', lang: 'Hindi', text: 'दर्द कहीं फैलता है? पसीना या साँस फूलना हुआ?' },
  { who: 'Patient', lang: 'Hindi', text: 'बाएँ कंधे और जबड़े तक जाता है, थोड़ा पसीना भी आया।' },
  { who: 'AI', lang: 'English', text: 'Any BP / sugar / allergy history?' },
  { who: 'Patient', lang: 'Hindi+EN', text: 'BP रहता है, penicillin से allergy है — दाने हो जाते हैं।' },
];

export default function IntakeTranscript() {
  const { id = 'A-142' } = useParams();
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const full = TURNS.map(t => `${t.who}: ${t.text}`).join('\n');
  return (
    <StaffShell role="doctor" title={`Intake Transcript · ${id}`} subtitle="Kiosk 03 · 4m 18s · STT 96.4% · Hindi + English · audit-logged">
      <div className="card" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="tag tag-info">🎙 Kiosk 03</span><span className="tag tag-neutral">⏱ 4m 18s</span><span className="tag tag-neutral">STT 96.4%</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => speakText(full)}>▶ Play Audio</button>
          <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>⬇ Export PDF</button>
        </span>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        {TURNS.map((t, i) => (
          <div key={i} className="t-item"><span className={`tag ${t.who === 'AI' ? 'tag-info' : 'tag-neutral'}`}>{t.who} · {t.lang}</span><p style={{ margin: '6px 0' }}>{t.text}</p></div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h3 style={{ marginTop: 0 }}>Correct Interpretation</h3>
        <div className="field"><textarea className="input staff" rows={3} placeholder="Fix STT / translation errors — saved to audit log…" value={note} onChange={e => setNote(e.target.value)} /></div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn btn-primary btn-sm" onClick={() => setSaved(true)}>Save Correction</button>
          {saved && <span className="tag tag-info">✓ Saved to audit log</span>}
          <Link className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} to={`/doctor/case/${id}`}>Back to Case</Link>
        </div>
      </div>
    </StaffShell>
  );
}
