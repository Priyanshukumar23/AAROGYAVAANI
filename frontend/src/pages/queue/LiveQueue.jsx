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

  const getTranslated = (key) => {
    const d = {
      stepLabel: { English: 'STEP 5 · QUEUE', 'हिन्दी': 'चरण 5 · कतार', 'ਪੰਜਾਬੀ': 'ਕਦਮ 5 · ਕਤਾਰ' },
      title: { English: 'Live OPD Monitor', 'हिन्दी': 'लाइव ओपीडी मॉनिटर', 'ਪੰਜਾਬੀ': 'ਲਾਈਵ ਓਪੀਡੀ ਮਾਨੀਟਰ' },
      voice: { 
        English: `Live queue. Now inside ${nowServing}. Your token is 14th in line.`,
        'हिन्दी': `लाइव कतार। अब अंदर ${nowServing}। आपका टोकन पंक्ति में 14वां है।`,
        'ਪੰਜਾਬੀ': `ਲਾਈਵ ਕਤਾਰ। ਹੁਣ ਅੰਦਰ ${nowServing}। ਤੁਹਾਡਾ ਟੋਕਨ ਲਾਈਨ ਵਿੱਚ 14ਵਾਂ ਹੈ।`
      },
      calling: { English: '🔔 NOW CALLING YOU', 'हिन्दी': '🔔 अब आपको बुलाया जा रहा है', 'ਪੰਜਾਬੀ': '🔔 ਹੁਣ ਤੁਹਾਨੂੰ ਬੁਲਾ ਰਿਹਾ ਹੈ' },
      proceed: { English: 'Please proceed to', 'हिन्दी': 'कृपया आगे बढ़ें', 'ਪੰਜਾਬੀ': 'ਕਿਰਪਾ ਕਰਕੇ ਅੱਗੇ ਵਧੋ' },
      imCalled: { English: 'I\'m Called', 'हिन्दी': 'मुझे बुलाया गया है', 'ਪੰਜਾਬੀ': 'ਮੈਨੂੰ ਬੁਲਾਇਆ ਗਿਆ ਹੈ' },
      nowInside: { English: 'NOW INSIDE', 'हिन्दी': 'अब अंदर', 'ਪੰਜਾਬੀ': 'ਹੁਣ ਅੰਦਰ' },
      next: { English: 'NEXT', 'हिन्दी': 'अगला', 'ਪੰਜਾਬੀ': 'ਅਗਲਾ' },
      inLounge: { English: 'IN LOUNGE', 'हिन्दी': 'लाउंज में', 'ਪੰਜਾਬੀ': 'ਲਾਉਂਜ ਵਿੱਚ' },
      tokens: { English: 'tokens', 'हिन्दी': 'टोकन', 'ਪੰਜਾਬੀ': 'ਟੋਕਨ' },
      yourToken: { English: 'Your token', 'हिन्दी': 'आपका टोकन', 'ਪੰਜਾਬੀ': 'ਤੁਹਾਡਾ ਟੋਕਨ' },
      th: { English: '14th', 'हिन्दी': '14वां', 'ਪੰਜਾਬੀ': '14ਵਾਂ' },
      min: { English: 'min', 'हिन्दी': 'मिनट', 'ਪੰਜਾਬੀ': 'ਮਿੰਟ' },
      avg: { English: 'Avg per patient', 'हिन्दी': 'प्रति मरीज औसत', 'ਪੰਜਾਬੀ': 'ਪ੍ਰਤੀ ਮਰੀਜ਼ ਔਸਤ' },
      yourWait: { English: 'Your wait', 'हिन्दी': 'आपकी प्रतीक्षा', 'ਪੰਜਾਬੀ': 'ਤੁਹਾਡੀ ਉਡੀਕ' },
      waitHere: { English: 'Wait here', 'हिन्दी': 'यहाँ प्रतीक्षा करें', 'ਪੰਜਾਬੀ': 'ਇੱਥੇ ਉਡੀਕ ਕਰੋ' },
      eventLog: { English: 'Event log', 'हिन्दी': 'इवेंट लॉग', 'ਪੰਜਾਬੀ': 'ਈਵੈਂਟ ਲੌਗ' },
      refresh: { English: '↻ Refresh', 'हिन्दी': '↻ रिफ्रेश करें', 'ਪੰਜਾਬੀ': '↻ ਤਾਜ਼ਾ ਕਰੋ' },
      back: { English: 'Back', 'हिन्दी': 'वापस', 'ਪੰਜਾਬੀ': 'ਵਾਪਸ' }
    };
    return d[key][state.language] || d[key]['English'];
  };

  return (
    <KioskShell stepLabel={getTranslated('stepLabel')} title={getTranslated('title')} back="/queue/status" progress={100} hideNav>
      <VoiceBar text={getTranslated('voice')} />
      {isMyTurn && (
        <div className="call-hero" style={{ marginBottom: 12 }}>
          <div className="small" style={{ fontWeight: 800 }}>{getTranslated('calling')}</div>
          <h2 className="mono">{called.tokenNo} · {called.name}</h2>
          <p><b>{getTranslated('proceed')} {called.room || 'Room 104'}.</b></p>
          <Link className="btn btn-primary" to="/queue/ready">{getTranslated('imCalled')}</Link>
        </div>
      )}
      <div className="grid cols-3" style={{ marginBottom: 12 }}>
        <div className="card" style={{ textAlign: 'center' }}><div className="small muted">{getTranslated('nowInside')}</div><h2 className="mono">{nowServing}</h2></div>
        <div className="card" style={{ textAlign: 'center' }}><div className="small muted">{getTranslated('next')}</div><h2 className="mono">{nextUp}</h2></div>
        <div className="card" style={{ textAlign: 'center' }}><div className="small muted">{getTranslated('inLounge')}</div><h2>{waiting.length} {getTranslated('tokens')}</h2></div>
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <h3>{getTranslated('yourToken')} <span className="mono">{myToken}</span> · {getTranslated('th')} · ~{wait} {getTranslated('min')}</h3>
        <div className="kpi-row" style={{ marginTop: 10, gridTemplateColumns: 'repeat(3,1fr)' }}>
          <Kpi v="3.1m" l={getTranslated('avg')} />
          <Kpi v={wait + 'm'} l={getTranslated('yourWait')} />
          <Kpi v="Hall B" l={getTranslated('waitHere')} />
        </div>
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <h4>{getTranslated('eventLog')}</h4>
        <div className="small mono">
          {called ? `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${called.tokenNo} called → ${called.room}\n` : ''}
          09:42 {nowServing} entered Room 104<br />09:39 A-126 completed · prescription issued<br />09:36 A-125 completed · labs ordered
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={refresh}>{getTranslated('refresh')}</button>
        <Link className="btn btn-primary" to="/queue/ready">{getTranslated('imCalled')}</Link>
        <Link className="btn btn-ghost" to="/queue/status">{getTranslated('back')}</Link>
      </div>
    </KioskShell>
  );
}
