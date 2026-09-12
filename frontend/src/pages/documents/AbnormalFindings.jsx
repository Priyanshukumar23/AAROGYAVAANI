import KioskShell from '../../components/KioskShell';
import { VoiceBar, PriorityTag } from '../../components/ui';

const LABS = [
  { t: 'Haemoglobin', v: '10.2 g/dL', r: '13–17', s: 'Low', level: 'P2' },
  { t: 'Fasting Glucose', v: '148 mg/dL', r: '70–100', s: 'High', level: 'P2' },
  { t: 'Creatinine', v: '0.9 mg/dL', r: '0.6–1.2', s: 'Normal', level: 'P3' }
];

export default function AbnormalFindings() {
  return (
    <KioskShell stepLabel="STEP 4 · DOCUMENTS" title="Lab Highlights" back="/documents/review" next="/documents/timeline" nextLabel="Continue" progress={97}>
      <VoiceBar text="Two values are outside the normal range. This is not a diagnosis." />
      <div className="alert-banner alert-info" style={{ marginBottom: 12 }}>ℹ️ <span><b>Note:</b> These are highlights only — <b>NOT a diagnosis</b>. Your doctor will interpret them.</span></div>
      <div className="grid cols-3">
        {LABS.map((l) => (
          <div key={l.t} className="card tight">
            <PriorityTag level={l.level} label={l.s} />
            <h4 style={{ marginTop: 8 }}>{l.t}</h4>
            <div className="mono" style={{ fontSize: 22 }}><b>{l.v}</b></div>
            <div className="small muted">Normal: {l.r}</div>
          </div>
        ))}
      </div>
    </KioskShell>
  );
}
