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

  const getTranslated = (key) => {
    const d = {
      stepLabel: { English: 'STEP 5 · QUEUE', 'हिन्दी': 'चरण 5 · कतार', 'ਪੰਜਾਬੀ': 'ਕਦਮ 5 · ਕਤਾਰ' },
      title: { English: '🔔 You Are Being Called', 'हिन्दी': '🔔 आपको बुलाया जा रहा है', 'ਪੰਜਾਬੀ': '🔔 ਤੁਹਾਨੂੰ ਬੁਲਾਇਆ ਜਾ ਰਿਹਾ ਹੈ' },
      nowCalling: { English: 'NOW CALLING', 'हिन्दी': 'अब बुला रहे हैं', 'ਪੰਜਾਬੀ': 'ਹੁਣ ਬੁਲਾ ਰਿਹਾ ਹੈ' },
      proceed: { 
        English: `Please proceed to ${room} · Dr. A. Verma is ready for you.`,
        'हिन्दी': `कृपया ${room} की ओर बढ़ें · डॉ. ए. वर्मा आपके लिए तैयार हैं।`,
        'ਪੰਜਾਬੀ': `ਕਿਰਪਾ ਕਰਕੇ ${room} ਵੱਲ ਜਾਓ · ਡਾ. ਏ. ਵਰਮਾ ਤੁਹਾਡੇ ਲਈ ਤਿਆਰ ਹਨ।`
      },
      repeatBtn: { English: '🔊 Repeat Call', 'हिन्दी': '🔊 फिर से बुलाएं', 'ਪੰਜਾਬੀ': '🔊 ਦੁਬਾਰਾ ਬੁਲਾਓ' },
      printBtn: { English: 'Print Slip', 'हिन्दी': 'पर्ची प्रिंट करें', 'ਪੰਜਾਬੀ': 'ਪਰਚੀ ਛਾਪੋ' },
      wayfind: { English: `Wayfinding — Hall B → ${room}`, 'हिन्दी': `रास्ता — हॉल B → ${room}`, 'ਪੰਜਾਬੀ': `ਰਸਤਾ — ਹਾਲ B → ${room}` },
      dirs: { 
        English: `1. Exit waiting Hall B → 2. Turn right, follow blue line → 3. ${room}, 2nd door on left (~40m).`,
        'हिन्दी': `1. प्रतीक्षा हॉल B से बाहर निकलें → 2. दाएँ मुड़ें, नीली रेखा का पालन करें → 3. ${room}, बाईं ओर दूसरा दरवाज़ा (~40m)।`,
        'ਪੰਜਾਬੀ': `1. ਵੇਟਿੰਗ ਹਾਲ B ਤੋਂ ਬਾਹਰ ਜਾਓ → 2. ਸੱਜੇ ਮੁੜੋ, ਨੀਲੀ ਲਾਈਨ ਦਾ ਪਾਲਣ ਕਰੋ → 3. ${room}, ਖੱਬੇ ਪਾਸੇ ਦੂਜਾ ਦਰਵਾਜ਼ਾ (~40m)।`
      },
      exitBtn: { English: 'Start Consultation (Exit Demo)', 'हिन्दी': 'परामर्श शुरू करें (डेमो समाप्त)', 'ਪੰਜਾਬੀ': 'ਸਲਾਹ-ਮਸ਼ਵਰਾ ਸ਼ੁਰੂ ਕਰੋ (ਡੈਮੋ ਸਮਾਪਤ)' }
    };
    return d[key][state.language] || d[key]['English'];
  };

  const handleRepeat = () => {
    let msg = `Token ${tokenNo}, please proceed to ${room}`;
    let langCode = 'en-US';
    if (state.language === 'हिन्दी') {
      msg = `टोकन ${tokenNo}, कृपया ${room} की ओर बढ़ें`;
      langCode = 'hi-IN';
    } else if (state.language === 'ਪੰਜਾਬੀ') {
      msg = `ਟੋਕਨ ${tokenNo}, ਕਿਰਪਾ ਕਰਕੇ ${room} ਵੱਲ ਜਾਓ`;
      langCode = 'pa-IN';
    }
    speakText(msg, langCode);
  };

  return (
    <KioskShell stepLabel={getTranslated('stepLabel')} title={getTranslated('title')} progress={100} hideNav>
      <div className="call-hero">
        <div className="small" style={{ fontWeight: 800 }}>{getTranslated('nowCalling')}</div>
        <h1 className="kiosk-display mono">{tokenNo}</h1>
        {name && <p style={{ marginBottom: 4 }}><b>{name}</b></p>}
        <p><b>{getTranslated('proceed')}</b></p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 }}>
          <button className="btn btn-blue" onClick={handleRepeat}>{getTranslated('repeatBtn')}</button>
          <button className="btn btn-secondary" onClick={() => window.print()}>{getTranslated('printBtn')}</button>
        </div>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h4>{getTranslated('wayfind')}</h4>
        <p className="small">{getTranslated('dirs')}</p>
        <Link className="btn btn-primary btn-block" to="/exit/completed">{getTranslated('exitBtn')}</Link>
      </div>
    </KioskShell>
  );
}
