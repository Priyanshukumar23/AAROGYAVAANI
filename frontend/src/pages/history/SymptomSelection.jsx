import { useState } from 'react';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar } from '../../components/ui';
import { SYMPTOMS } from '../../data/mock';

export default function SymptomSelection() {
  const { state, patchIntake } = useApp();
  const [sel, setSel] = useState(state.intake?.symptoms || ['chest']);
  const toggle = (id) => {
    const next = sel.includes(id) ? sel.filter((s) => s !== id) : [...sel, ...[id]];
    setSel(next); patchIntake({ symptoms: next });
  };
  return (
    <KioskShell stepLabel="STEP 2 · CLINICAL HISTORY" title="Select All Symptoms You Have" back="/history/chief-complaint" next="/history/ai-followup" nextLabel={`Continue (${sel.length})`} progress={74}>
      <VoiceBar text="Tap all symptoms you are experiencing. You can select more than one." />
      <div className="tile-grid">
        {SYMPTOMS.map((s) => (
          <div key={s.id} className={`card selectable tile ${sel.includes(s.id) ? 'selected' : ''}`} onClick={() => toggle(s.id)}>
            <span className="tick">{sel.includes(s.id) ? '✓' : ''}</span>
            <span className="icon">{s.icon}</span>
            <b>{s.label}</b>
          </div>
        ))}
      </div>
    </KioskShell>
  );
}
