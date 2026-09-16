import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar, PriorityTag } from '../../components/ui';
import { updateQueueToken } from '../../data/queueStore';

const CHIPS = ['Chest pain', 'Fever', 'Cough', 'Breathlessness', 'Headache', 'Stomach pain', 'Follow-up visit'];
const RED = ['chest pain', 'breathless', 'bleeding', 'suicide', 'severe'];

export default function ChiefComplaint() {
  const { state, patchIntake } = useApp();
  const [text, setText] = useState(state.intake?.chiefComplaint || '');
  const [listening, setListening] = useState(false);
  const nav = useNavigate();
  const lower = text.toLowerCase();
  const hit = RED.find((k) => lower.includes(k));
  const next = () => {
    if (text.trim().length < 10) { alert('Please describe your problem in at least 10 characters.'); return; }
    const redFlag = !!hit;
    patchIntake({ chiefComplaint: text.trim(), redFlag });
    const tokenNo = state.token?.tokenNo;
    if (tokenNo) {
      updateQueueToken(tokenNo, {
        complaint: text.trim(),
        chiefComplaint: text.trim(),
        priority: redFlag ? 'P1' : state.token?.priority || 'P2',
        aiStatus: 'ready',
        aiConfidence: redFlag ? 96 : 89,
      });
      try { fetch(`/api/tokens/${encodeURIComponent(tokenNo)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ complaint: text.trim(), chiefComplaint: text.trim(), priority: redFlag ? 'P1' : 'P2' }) }); } catch {}
    }
    nav(redFlag ? '/emergency/assessment' : '/history/symptoms');
  };
  return (
    <KioskShell stepLabel="STEP 2 · CLINICAL HISTORY" title="What is your main problem today?" back="/history/intro" progress={70} onNext={next} nextLabel="Continue">
      <VoiceBar text="Describe your main problem in your own words." />
      {hit && <div style={{ marginBottom: 10 }}><PriorityTag level="P1" label={`Possible red flag: ${hit}`} /></div>}
      <div className="card">
        <div className="field">
          <label>Describe in your own words (min 10 characters)</label>
          <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. I have severe chest discomfort since yesterday evening…" rows={4} />
          <div className="small muted">{text.trim().length}/10 minimum</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button className="btn btn-blue btn-sm" onClick={() => { setListening((v) => !v); if (!listening) setTimeout(() => setListening(false), 2000); }}>{listening ? '● Listening…' : '🎤 Speak'}</button>
          {CHIPS.map((c) => <button key={c} className="btn btn-ghost btn-sm" onClick={() => setText((t) => (t ? t + ' ' : '') + c)}>{c}</button>)}
        </div>
        <button className="btn btn-primary btn-block" onClick={next}>Continue</button>
      </div>
    </KioskShell>
  );
}
