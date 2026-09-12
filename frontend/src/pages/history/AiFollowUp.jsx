import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar } from '../../components/ui';

const Q = {
  chest: 'Does the chest pain spread to your shoulder, arm, neck or jaw?',
  breath: 'Do you feel breathless even while resting?',
  fever: 'Is your fever continuous or does it come and go?',
  cough: 'Is your cough dry or with phlegm?',
  default: 'Can you tell us more about this symptom?'
};

export default function AiFollowUp() {
  const { state, patchIntake } = useApp();
  const first = (state.intake?.symptoms || ['chest'])[0] || 'chest';
  const [severity, setSeverity] = useState(state.intake?.followUp?.severity || 8);
  const [duration, setDuration] = useState(state.intake?.followUp?.duration || '~24 hours');
  const [radiation, setRadiation] = useState(state.intake?.followUp?.radiation || 'Left arm');
  const [typing, setTyping] = useState(true);
  const nav = useNavigate();
  useEffect(() => { const t = setTimeout(() => setTyping(false), 1200); return () => clearTimeout(t); }, []);
  const save = () => {
    patchIntake({ followUp: { symptom: first, severity, duration, radiation } });
    nav('/history/details');
  };
  return (
    <KioskShell stepLabel="STEP 2 · CLINICAL HISTORY" title="AI Follow-Up Questions" back="/history/symptoms" progress={78} onNext={save} nextLabel="Save & Continue">
      <VoiceBar text="Please answer these follow-up questions about your main symptom." />
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="small muted">🤖 AI Assistant · asking about <b>{first}</b></div>
        <h4 style={{ marginTop: 6 }}>{Q[first] || Q.default}</h4>
        {typing && <div className="small muted">●●● AI is typing…</div>}
      </div>
      <div className="card">
        <div className="field"><label>Pain / severity (1–10): {severity}</label><input type="range" min="1" max="10" value={severity} onChange={(e) => setSeverity(+e.target.value)} style={{ width: '100%', minHeight: 44 }} /></div>
        <div className="field"><label>How long?</label><select className="select" value={duration} onChange={(e) => setDuration(e.target.value)}><option>Less than 6 hours</option><option>~24 hours</option><option>2–3 days</option><option>More than a week</option></select></div>
        <div className="field"><label>Where does it spread?</label><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{['Nowhere', 'Left arm', 'Neck / jaw', 'Back'].map((r) => <button key={r} type="button" className={`btn btn-sm ${radiation === r ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setRadiation(r)}>{r}</button>)}</div></div>
        <button className="btn btn-primary btn-block" onClick={save}>Save & Continue</button>
      </div>
    </KioskShell>
  );
}
