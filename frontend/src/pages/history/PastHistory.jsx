import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar } from '../../components/ui';

const CONDS = ['Hypertension', 'Diabetes', 'Asthma', 'Heart disease', 'Thyroid', 'Kidney disease', 'None'];

export default function PastHistory() {
  const { state, patchIntake } = useApp();
  const prev = state.intake?.pastHistory || {};
  const [conds, setConds] = useState(prev.conds || ['Hypertension']);
  const [meds, setMeds] = useState(prev.meds || '');
  const [allergies, setAllergies] = useState(prev.allergies || 'Penicillin');
  const [smoke, setSmoke] = useState(prev.smoke || 'No');
  const [alcohol, setAlcohol] = useState(prev.alcohol || 'No');
  const nav = useNavigate();
  const toggle = (c) => setConds((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  const save = () => { patchIntake({ pastHistory: { conds, meds, allergies, smoke, alcohol } }); nav('/history/review'); };
  const radio = (v, setV) => ['No', 'Yes', 'Quit'].map((o) => <button key={o} type="button" className={`btn btn-sm ${v === o ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setV(o)}>{o}</button>);
  return (
    <KioskShell stepLabel="STEP 2 · CLINICAL HISTORY" title="Past Medical History" back="/history/details" progress={88} onNext={save} nextLabel="Save & Review">
      <VoiceBar text="Tell us about long-term conditions, medicines and allergies." />
      <div className="card">
        <div className="field"><label>Conditions (tap all that apply)</label><div className="grid cols-3">{CONDS.map((c) => <label key={c} className="checkrow"><input type="checkbox" checked={conds.includes(c)} onChange={() => toggle(c)} />{c}</label>)}</div></div>
        <div className="field"><label>Current medications</label><textarea className="textarea" value={meds} onChange={(e) => setMeds(e.target.value)} placeholder="e.g. Telmisartan 40mg every morning" rows={2} /></div>
        <div className="field"><label>Allergies (especially Penicillin)</label><textarea className="textarea" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. Penicillin — rash" rows={2} /></div>
        <div className="grid cols-2">
          <div className="field"><label>Smoking?</label><div style={{ display: 'flex', gap: 8 }}>{radio(smoke, setSmoke)}</div></div>
          <div className="field"><label>Alcohol?</label><div style={{ display: 'flex', gap: 8 }}>{radio(alcohol, setAlcohol)}</div></div>
        </div>
        <button className="btn btn-primary btn-block" onClick={save}>Save & Review</button>
      </div>
    </KioskShell>
  );
}
