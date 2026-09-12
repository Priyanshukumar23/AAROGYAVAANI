import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { Steps } from '../../components/ui';
import { MOCK_QUEUE, MOCK_VITALS } from '../../data/mock';

const STEPS = ['Intro', 'Physician Summary', 'Important Findings', 'Token Queue', 'Live Waiting Monitor', 'Final Pass'];

export default function DoctorReview() {
  const [s, setS] = useState(0);
  const nav = useNavigate();
  const body = [
    <div key="0"><h3>Shift Intro</h3><p className="muted">Tue OPD · Room 104 · 42 scheduled · ABDM sync live · 2 red flags need review before consults.</p></div>,
    <div key="1"><h3>Physician Summary</h3><p>Dr. Rajesh Sharma · Gen Med · 27 done · avg 6 min · 1 in chamber (A-127).</p></div>,
    <div key="2"><h3>Important Findings</h3><div className="vital-grid">{MOCK_VITALS.slice(0, 4).map(v => <div key={v.k} className={'vital ' + v.warn}><div className="small muted">{v.k}</div><strong>{v.v}</strong></div>)}</div><div className="alert-banner alert-p1 small" style={{ marginTop: 8 }}>🚨 A-142 ?ACS · penicillin allergy · ECG stat</div></div>,
    <div key="3"><h3>Token Queue</h3>{MOCK_QUEUE.map(t => <div key={t.tokenNo} className="queue-item"><span><strong>{t.tokenNo}</strong> {t.name}</span><span className="tag tag-neutral">{t.priority}</span></div>)}</div>,
    <div key="4"><h3>Live Waiting Monitor</h3><p className="muted">Avg wait 18 min · longest A-130 (29 min, P2 abdominal pain) · 3 routine can batch-counsel.</p><div className="notice">🟢 Kiosk 01/03 online · Triage desk staffed · ECG room free</div></div>,
    <div key="5"><h3>Final Pass</h3><p>Checklist 5/5: red flags read · allergies noted · ECG ordered · consent · e-sign ready.</p><Link className="btn btn-ghost btn-sm" to="/doctor/alerts">Re-check Red Flags</Link></div>,
  ];
  return (
    <StaffShell role="doctor" title="Doctor Review Wizard" subtitle="6-step pre-OPD briefing · one file">
      <div className="card"><Steps items={STEPS} active={s} />
        <div style={{ margin: '14px 0' }}>{body[s]}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" disabled={s === 0} onClick={() => setS(x => x - 1)}>← Back</button>
          {s < STEPS.length - 1
            ? <button className="btn btn-blue btn-sm" onClick={() => setS(x => x + 1)}>Next →</button>
            : <button className="btn btn-primary btn-sm" onClick={() => nav('/doctor/workspace')}>Finish → Workspace</button>}
          <span className="small muted" style={{ marginLeft: 'auto' }}>Step {s + 1} / {STEPS.length}</span>
        </div>
      </div>
    </StaffShell>
  );
}
