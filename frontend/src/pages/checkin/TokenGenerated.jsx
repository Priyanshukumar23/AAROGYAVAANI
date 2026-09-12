import { Link } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar, speakText } from '../../components/ui';

export default function TokenGenerated() {
  const { state } = useApp();
  const t = state.token || {};
  const p = state.patient || {};
  const dept = state.department || { name: 'General Medicine', room: 'Room 104' };
  const announce = () => speakText(`Token ${t.tokenNo}. ${p.name}. Please proceed to ${dept.room}.`);
  return (
    <KioskShell stepLabel="STEP 1 · PATIENT CHECK-IN" title="Your Token is Ready" progress={62} hideNav>
      <VoiceBar text={`Your token number is ${t.tokenNo}. Please note it down.`} />
      <div className="token-hero">
        <div className="small" style={{ fontWeight: 800, letterSpacing: '.08em' }}>OFFICIAL OPD TOKEN</div>
        <div className="num mono">{t.tokenNo || 'A-142'}</div>
        <p><b>{p.name}</b> · {dept.name} · {t.room || dept.room}</p>
        <div className="grid cols-3" style={{ marginTop: 12 }}>
          <div className="card tight"><b>Now serving</b><br /><span className="mono">{t.nowServing || 'A-127'}</span></div>
          <div className="card tight"><b>Position</b><br />#{t.position || 14}</div>
          <div className="card tight"><b>Wait</b><br />~{t.waitMin || 42} min</div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          <button className="btn btn-blue" onClick={announce}>🔊 Announce</button>
          <button className="btn btn-secondary" onClick={() => alert(`SMS sent to ${p.mobile || 'registered mobile'} with token ${t.tokenNo}.`)}>Send SMS</button>
          <button className="btn btn-secondary" onClick={() => window.print()}>Print Slip</button>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" to="/history/intro">Continue to Clinical History</Link>
          <Link className="btn btn-ghost" to="/">Exit</Link>
        </div>
      </div>
    </KioskShell>
  );
}
