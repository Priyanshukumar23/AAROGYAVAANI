import { useState } from 'react';
import { Link } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar, Kpi } from '../../components/ui';

export default function LiveQueue() {
  const { state, patch } = useApp();
  const t = state.token || {};
  const [wait, setWait] = useState(t.waitMin || 42);
  const refresh = () => { const w = Math.max(2, wait - 1); setWait(w); patch({ token: { ...t, waitMin: w } }); };
  return (
    <KioskShell stepLabel="STEP 6 · LIVE QUEUE" title="Live OPD Monitor" back="/queue/status" progress={100} hideNav>
      <VoiceBar text="Live queue. Now inside A-127. Your token is 14th in line." />
      <div className="grid cols-3" style={{ marginBottom: 12 }}>
        <div className="card" style={{ textAlign: 'center' }}><div className="small muted">NOW INSIDE</div><h2 className="mono">A-127</h2></div>
        <div className="card" style={{ textAlign: 'center' }}><div className="small muted">NEXT</div><h2 className="mono">A-128</h2></div>
        <div className="card" style={{ textAlign: 'center' }}><div className="small muted">IN LOUNGE</div><h2>13 tokens</h2></div>
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <h3>Your token <span className="mono">{t.tokenNo || 'A-142'}</span> · 14th · ~{wait} min</h3>
        <div className="kpi-row" style={{ marginTop: 10, gridTemplateColumns: 'repeat(3,1fr)' }}>
          <Kpi v="3.1m" l="Avg per patient" />
          <Kpi v={wait + 'm'} l="Your wait" />
          <Kpi v="Hall B" l="Wait here" />
        </div>
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <h4>Event log</h4>
        <div className="small mono">09:42 A-127 entered Room 104<br />09:39 A-126 completed · prescription issued<br />09:36 A-125 completed · labs ordered</div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={refresh}>↻ Refresh</button>
        <Link className="btn btn-primary" to="/queue/ready">I&apos;m Called</Link>
        <Link className="btn btn-ghost" to="/queue/status">Back</Link>
      </div>
    </KioskShell>
  );
}
