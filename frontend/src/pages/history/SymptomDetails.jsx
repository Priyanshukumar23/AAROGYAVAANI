import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar } from '../../components/ui';

const ASSOC = ['Sweating', 'Nausea', 'Dizziness', 'Palpitations', 'Swelling in legs'];

export default function SymptomDetails() {
  const { state, patchIntake } = useApp();
  const [onset, setOnset] = useState(state.intake?.details?.onset || 'Yesterday evening');
  const [vas, setVas] = useState(state.intake?.details?.vas || 8);
  const [aggr, setAggr] = useState(state.intake?.details?.aggr || 'Walking / exertion');
  const [relief, setRelief] = useState(state.intake?.details?.relief || 'Rest');
  const [assoc, setAssoc] = useState(state.intake?.details?.assoc || ['Sweating']);
  const nav = useNavigate();
  const toggle = (a) => setAssoc((s) => (s.includes(a) ? s.filter((x) => x !== a) : [...s, a]));
  const save = () => {
    patchIntake({ details: { onset, vas, aggr, relief, assoc } });
    nav(state.intake?.redFlag ? '/history/red-flag' : '/history/past-history');
  };
  return (
    <KioskShell stepLabel="STEP 2 · CLINICAL HISTORY" title="Symptom Details" back="/history/ai-followup" progress={82} onNext={save} nextLabel="Save & Continue">
      <VoiceBar text="Tell us when it started, how severe it is, and what makes it better or worse." />
      <div className="card">
        <div className="field"><label>When did it start?</label><input className="input" value={onset} onChange={(e) => setOnset(e.target.value)} placeholder="e.g. Yesterday evening" /></div>
        <div className="field"><label>Severity (VAS 1–10): {vas}</label><input type="range" min="1" max="10" value={vas} onChange={(e) => setVas(+e.target.value)} style={{ width: '100%', minHeight: 44 }} /></div>
        <div className="grid cols-2">
          <div className="field"><label>What makes it worse?</label><input className="input" value={aggr} onChange={(e) => setAggr(e.target.value)} /></div>
          <div className="field"><label>What gives relief?</label><input className="input" value={relief} onChange={(e) => setRelief(e.target.value)} /></div>
        </div>
        <div className="field"><label>Associated symptoms</label><div className="grid cols-3">{ASSOC.map((a) => <label key={a} className="checkrow"><input type="checkbox" checked={assoc.includes(a)} onChange={() => toggle(a)} />{a}</label>)}</div></div>
        <button className="btn btn-primary btn-block" onClick={save}>Save & Continue</button>
      </div>
    </KioskShell>
  );
}
