import KioskShell from '../../components/KioskShell';
import { VoiceBar } from '../../components/ui';

const DOCS = [
  { d: '12 Aug 2026', t: 'Prescription — AIIMS OPD', s: 'Hypertension · Telmisartan' },
  { d: '02 May 2026', t: 'Lab report — CBC + Glucose', s: 'Hb low · Glucose high' },
  { d: '18 Jan 2026', t: 'ECG — OPD screening', s: 'Normal sinus rhythm' }
];

export default function DocTimeline() {
  return (
    <KioskShell stepLabel="STEP 3 · DOCUMENTS" title="Your Document Timeline" back="/documents/abnormal" next="/documents/complete" nextLabel="Finish Documents" progress={98}>
      <VoiceBar text="Your documents are arranged newest first." />
      <div className="card">
        {DOCS.map((x, i) => (
          <div key={x.t} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < DOCS.length - 1 ? '1px solid var(--line)' : 'none' }}>
            <div className="mono" style={{ minWidth: 110 }}><b>{x.d}</b></div>
            <div><b>{x.t}</b><br /><span className="small muted">{x.s}</span></div>
          </div>
        ))}
      </div>
    </KioskShell>
  );
}
