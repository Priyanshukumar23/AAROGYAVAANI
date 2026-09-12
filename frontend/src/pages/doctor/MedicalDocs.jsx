import { useState } from 'react';
import { Link } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { Progress } from '../../components/ui';

const DOCS = [
  { id: 'd1', name: 'CBC_Report_A142.pdf', type: 'Lab', conf: 96, meds: ['Hb 13.2 g/dL (N)'], labs: ['WBC 8.1k', 'Plt 220k'], text: 'CBC within normal limits. No anemia / leukocytosis.' },
  { id: 'd2', name: 'Old_Rx_2024.jpg', type: 'Prescription', conf: 88, meds: ['Amlodipine 5mg OD', 'Atorvastatin 10mg HS'], labs: [], text: 'HTN + dyslipidemia on treatment. Adherence reported good.' },
  { id: 'd3', name: 'ECG_A142.png', type: 'ECG', conf: 72, meds: [], labs: ['HR 88', 'ST: flat T V4–V6 — review'], text: 'Borderline ST changes — overread by cardiology advised.' },
];

export default function MedicalDocs() {
  const [sel, setSel] = useState(DOCS[0]);
  const [verified, setVerified] = useState({});
  return (
    <StaffShell role="doctor" title="Medical Documents & OCR" subtitle="Auto-extracted meds + labs · verify before e-sign">
      <div className="split split-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>OCR Inbox (3)</h3>
          {DOCS.map(d => (
            <div key={d.id} className="queue-item" style={{ cursor: 'pointer', border: sel.id === d.id ? '2px solid var(--blue)' : undefined }} onClick={() => setSel(d)}>
              <div><strong>📄 {d.name}</strong><br /><span className="small muted">{d.type} · conf {d.conf}% {verified[d.id] ? '· ✓ verified' : ''}</span></div>
              <span className="tag tag-neutral">{d.type}</span>
            </div>
          ))}
          <Link className="btn btn-ghost btn-sm" to="/doctor/timeline/A-142">View in Timeline</Link>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>{sel.name}</h3>
          <span className="small muted">Extraction confidence {sel.conf}%</span><Progress value={sel.conf} />
          <p className="small">{sel.text}</p>
          <h4>Extracted Meds</h4><ul className="small">{sel.meds.length ? sel.meds.map(m => <li key={m}>{m}</li>) : <li className="muted">— none —</li>}</ul>
          <h4>Extracted Labs</h4><ul className="small">{sel.labs.length ? sel.labs.map(m => <li key={m}>{m}</li>) : <li className="muted">— none —</li>}</ul>
          <button className="btn btn-primary btn-sm" onClick={() => setVerified(v => ({ ...v, [sel.id]: true }))}>{verified[sel.id] ? '✓ Verified' : 'Verify Document'}</button>
        </div>
      </div>
    </StaffShell>
  );
}
