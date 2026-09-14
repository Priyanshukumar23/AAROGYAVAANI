import { useState } from 'react';
import { Link } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar, Progress } from '../../components/ui';

export default function QueueStatus() {
  const { state } = useApp();
  const t = state.token || {};
  const p = state.patient || {};
  const dept = state.department || { name: 'General Medicine', room: 'Room 104' };
  const [sms, setSms] = useState(true);
  return (
    <KioskShell stepLabel="STEP 5 · QUEUE" title="Your Queue Status" progress={100} hideNav>
      <VoiceBar text={`Token ${t.tokenNo}. Now serving ${t.nowServing}. About ${t.waitMin} minutes wait.`} />
      <div className="token-hero" style={{ marginBottom: 14 }}>
        <div className="small" style={{ fontWeight: 800, letterSpacing: '.08em' }}>OFFICIAL OPD TOKEN · UHID {p.uhid || '—'}</div>
        <div className="num mono">{t.tokenNo || 'A-142'}</div>
        <div><b>{p.name}</b> · {dept.name}</div>
        <div className="grid cols-3" style={{ marginTop: 12 }}>
          <div className="card tight"><b>Now serving</b><br /><span className="mono">{t.nowServing || 'A-127'}</span></div>
          <div className="card tight"><b>Ahead of you</b><br />{(t.position || 14) - 1} patients</div>
          <div className="card tight"><b>Wait</b><br />~{t.waitMin || 42} min</div>
        </div>
        <div style={{ marginTop: 12 }}><Progress value={68} /><div className="small muted">68% of morning slots completed</div></div>
      </div>
      <div className="grid cols-2">
        <div className="card"><h4>Where to go</h4><p>👨‍⚕️ Dr. A. Verma · {t.room || dept.room}<br />🪑 Waiting Hall B · Gate 2<br />🔔 Listen for announcements</p></div>
        <div className="card">
          <label className="checkrow"><input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} /><span>SMS alerts {sms ? 'ON' : 'OFF'} <span className="small muted">· to {p.mobile || 'your mobile'}</span></span></label>
          <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
            <Link className="btn btn-primary" to="/queue/live">Live Monitor</Link>
            <button className="btn btn-secondary" onClick={() => window.print()}>Print</button>
          </div>
        </div>
      </div>
    </KioskShell>
  );
}
