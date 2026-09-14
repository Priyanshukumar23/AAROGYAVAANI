import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar, Kpi } from '../../components/ui';
import { getQueue, getCalledToken, subscribeQueue, subscribeCalled } from '../../data/queueStore';

export default function LiveQueue() {
  const { state, patch } = useApp();
  const t = state.token || {};
  const [wait, setWait] = useState(t.waitMin || 42);
  const [called, setCalled] = useState(() => getCalledToken());
  const [queue, setQueue] = useState(() => getQueue());

  useEffect(() => {
    const offQ = subscribeQueue((list) => setQueue(list || []));
    const offC = subscribeCalled((c) => setCalled(c));
    return () => { offQ(); offC(); };
  }, []);

  const nowServing = called?.tokenNo || queue.find((x) => x.status === 'in-chamber')?.tokenNo || 'A-127';
  const waiting = queue.filter((x) => x.status === 'waiting');
  const nextUp = waiting[0]?.tokenNo || 'A-128';
  const myToken = t.tokenNo || 'A-142';
  const isMyTurn = called && called.tokenNo === myToken;

  const refresh = () => { const w = Math.max(2, wait - 1); setWait(w); patch({ token: { ...t, waitMin: w } }); };

  return (
    <KioskShell stepLabel="STEP 5 · QUEUE" title="Live OPD Monitor" back="/queue/status" progress={100} hideNav>
      <VoiceBar text={`Live queue. Now inside ${nowServing}. Your token is 14th in line.`} />
      {isMyTurn && (
        <div className="call-hero" style={{ marginBottom: 12 }}>
          <div className="small" style={{ fontWeight: 800 }}>🔔 NOW CALLING YOU</div>
          <h2 className="mono">{called.tokenNo} · {called.name}</h2>
          <p><b>Please proceed to {called.room || 'Room 104'}.</b></p>
          <Link className="btn btn-primary" to="/queue/ready">I&apos;m Called</Link>
        </div>
      )}
      <div className="grid cols-3" style={{ marginBottom: 12 }}>
        <div className="card" style={{ textAlign: 'center' }}><div className="small muted">NOW INSIDE</div><h2 className="mono">{nowServing}</h2></div>
        <div className="card" style={{ textAlign: 'center' }}><div className="small muted">NEXT</div><h2 className="mono">{nextUp}</h2></div>
        <div className="card" style={{ textAlign: 'center' }}><div className="small muted">IN LOUNGE</div><h2>{waiting.length} tokens</h2></div>
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <h3>Your token <span className="mono">{myToken}</span> · 14th · ~{wait} min</h3>
        <div className="kpi-row" style={{ marginTop: 10, gridTemplateColumns: 'repeat(3,1fr)' }}>
          <Kpi v="3.1m" l="Avg per patient" />
          <Kpi v={wait + 'm'} l="Your wait" />
          <Kpi v="Hall B" l="Wait here" />
        </div>
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <h4>Event log</h4>
        <div className="small mono">
          {called ? `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${called.tokenNo} called → ${called.room}\n` : ''}
          09:42 {nowServing} entered Room 104<br />09:39 A-126 completed · prescription issued<br />09:36 A-125 completed · labs ordered
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={refresh}>↻ Refresh</button>
        <Link className="btn btn-primary" to="/queue/ready">I&apos;m Called</Link>
        <Link className="btn btn-ghost" to="/queue/status">Back</Link>
      </div>
    </KioskShell>
  );
}
