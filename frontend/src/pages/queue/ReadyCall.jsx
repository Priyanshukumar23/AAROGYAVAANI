import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { speakText } from '../../components/ui';
import { getCalledToken, subscribeCalled } from '../../data/queueStore';

export default function ReadyCall() {
  const { state } = useApp();
  const t = state.token || {};
  const [called, setCalled] = useState(() => getCalledToken());

  useEffect(() => subscribeCalled((c) => setCalled(c)), []);

  const tokenNo = called?.tokenNo || t.tokenNo || 'A-142';
  const room = called?.room || t.room || 'Room 104';
  const name = called?.name || state.patient?.name || '';

  return (
    <KioskShell stepLabel="STEP 5 · QUEUE" title="🔔 You Are Being Called" progress={100} hideNav>
      <div className="call-hero">
        <div className="small" style={{ fontWeight: 800 }}>NOW CALLING</div>
        <h1 className="kiosk-display mono">{tokenNo}</h1>
        {name && <p style={{ marginBottom: 4 }}><b>{name}</b></p>}
        <p><b>Please proceed to {room}</b> · Dr. A. Verma is ready for you.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 }}>
          <button className="btn btn-blue" onClick={() => speakText(`Token ${tokenNo}, please proceed to ${room}`)}>🔊 Repeat Call</button>
          <button className="btn btn-secondary" onClick={() => window.print()}>Print Slip</button>
        </div>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h4>Wayfinding — Hall B → {room}</h4>
        <p className="small">1. Exit waiting Hall B → 2. Turn right, follow blue line → 3. {room}, 2nd door on left (~40m).</p>
        <Link className="btn btn-primary btn-block" to="/exit/completed">Start Consultation (Exit Demo)</Link>
      </div>
    </KioskShell>
  );
}
