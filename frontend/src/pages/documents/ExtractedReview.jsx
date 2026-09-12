import { useState } from 'react';
import KioskShell from '../../components/KioskShell';
import { VoiceBar, StatusTag } from '../../components/ui';

const ROWS = [
  { k: 'Category', v: 'Prescription' },
  { k: 'Hospital', v: 'AIIMS OPD' },
  { k: 'Doctor', v: 'Dr. A. Verma' },
  { k: 'Date', v: '12 Aug 2026' },
  { k: 'Diagnosis', v: 'BA00 — Essential hypertension' },
  { k: 'Medicines', v: 'Telmisartan 40mg OD · Metformin 500mg BD' }
];

export default function ExtractedReview() {
  const [edit, setEdit] = useState(false);
  const [vals, setVals] = useState(Object.fromEntries(ROWS.map((r) => [r.k, r.v])));
  const set = (k, v) => setVals((s) => ({ ...s, [k]: v }));
  return (
    <KioskShell stepLabel="STEP 4 · DOCUMENTS" title="Check Extracted Details" back="/documents/processing" next="/documents/abnormal" nextLabel="Confirm & Continue" progress={96}>
      <VoiceBar text="Check the extracted details. Tap Correct if anything is wrong." />
      <div className="card">
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}><StatusTag kind="info">OCR confidence 94%</StatusTag><button className="btn btn-ghost btn-sm" onClick={() => setEdit((v) => !v)}>{edit ? 'Done editing' : '✏️ Edit'}</button></div>
        {ROWS.map((r) => (
          <div key={r.k} className="field" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ minWidth: 110 }}><b>{r.k}</b></div>
            {edit
              ? <input className="input" value={vals[r.k]} onChange={(e) => set(r.k, e.target.value)} />
              : <span style={{ flex: 1 }}>{vals[r.k]}</span>}
            <button className="btn btn-ghost btn-sm" onClick={() => { const v = prompt(`Correct ${r.k}:`, vals[r.k]); if (v !== null) set(r.k, v); }}>Correct</button>
          </div>
        ))}
      </div>
    </KioskShell>
  );
}
