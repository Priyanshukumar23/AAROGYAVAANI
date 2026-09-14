import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar, StatusTag } from '../../components/ui';
import { updateQueueToken } from '../../data/queueStore';

export default function ReviewComplete() {
  const { state } = useApp();
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const i = state.intake || {};
  const done = async () => {
    if (!ok) { setErr('Please confirm the information is correct.'); return; }
    const tokenNo = state.token?.tokenNo;
    const summary = i.chiefComplaint || `Symptoms: ${(i.symptoms || []).join(', ')}`;
    if (tokenNo) {
      updateQueueToken(tokenNo, {
        complaint: summary,
        chiefComplaint: i.chiefComplaint || summary,
        aiStatus: 'ready',
        aiConfidence: 94,
      });
      try { fetch(`/api/tokens/${encodeURIComponent(tokenNo)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ complaint: summary, chiefComplaint: i.chiefComplaint || summary, aiStatus: 'ready' }) }); } catch {}
    }
    try { await fetch('/api/intakes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tokenNo, patient: state.patient, token: state.token, intake: i }) }); } catch {}
    nav('/documents/intro');
  };
  return (
    <KioskShell stepLabel="STEP 2 · CLINICAL HISTORY" title="Review & Complete" back="/history/past-history" progress={92} onNext={done} nextLabel="Complete History">
      <VoiceBar text="Review your answers, then complete your clinical history." />
      <div className="card" style={{ marginBottom: 12 }}>
        <StatusTag kind="info">Chief complaint</StatusTag>
        <p style={{ marginTop: 8 }}>{i.chiefComplaint || '—'}</p>
        <StatusTag kind="neutral">Symptoms: {(i.symptoms || []).join(', ') || '—'}</StatusTag>
        <div className="grid cols-3" style={{ marginTop: 10 }}>
          <div className="card tight"><b>Severity</b><br />{i.followUp?.severity || i.details?.vas || '—'}/10</div>
          <div className="card tight"><b>Duration</b><br />{i.followUp?.duration || i.details?.onset || '—'}</div>
          <div className="card tight"><b>Conditions</b><br />{(i.pastHistory?.conds || []).join(', ') || '—'}</div>
        </div>
        <p className="small muted" style={{ marginTop: 8 }}>Meds: {i.pastHistory?.meds || '—'} · Allergies: {i.pastHistory?.allergies || '—'} · Smoking: {i.pastHistory?.smoke || '—'} · Alcohol: {i.pastHistory?.alcohol || '—'}</p>
      </div>
      <label className="checkrow"><input type="checkbox" checked={ok} onChange={(e) => { setOk(e.target.checked); setErr(''); }} /><span>I confirm this information is correct to my knowledge.</span></label>
      {err && <div className="small" style={{ color: 'var(--p1)', marginTop: 6 }}>{err}</div>}
      <div style={{ marginTop: 10 }}><button className="btn btn-primary btn-block" onClick={done}>Complete History</button></div>
    </KioskShell>
  );
}
