import { Link } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar, speakText } from '../../components/ui';

export default function TokenGenerated() {
  const { state } = useApp();
  const t = state.token || {};
  const p = state.patient || {};
  const dept = state.department || { name: 'General Medicine', room: 'Room 104' };

  const getTranslated = (key) => {
    const d = {
      stepLabel: { English: 'STEP 1 · CHECK-IN', 'हिन्दी': 'चरण 1 · चेक-इन', 'ਪੰਜਾਬੀ': 'ਕਦਮ 1 · ਚੈੱਕ-ਇਨ' },
      title: { English: 'Your Token is Ready', 'हिन्दी': 'आपका टोकन तैयार है', 'ਪੰਜਾਬੀ': 'ਤੁਹਾਡਾ ਟੋਕਨ ਤਿਆਰ ਹੈ' },
      voice: { 
        English: `Your token number is ${t.tokenNo}. Please note it down.`,
        'हिन्दी': `आपका टोकन नंबर ${t.tokenNo} है। कृपया इसे नोट कर लें।`,
        'ਪੰਜਾਬੀ': `ਤੁਹਾਡਾ ਟੋਕਨ ਨੰਬਰ ${t.tokenNo} ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਸਨੂੰ ਨੋਟ ਕਰੋ।`
      },
      official: { English: 'OFFICIAL OPD TOKEN', 'हिन्दी': 'आधिकारिक ओपीडी टोकन', 'ਪੰਜਾਬੀ': 'ਅਧਿਕਾਰਤ ਓਪੀਡੀ ਟੋਕਨ' },
      serving: { English: 'Now serving', 'हिन्दी': 'अब सेवा में', 'ਪੰਜਾਬੀ': 'ਹੁਣ ਸੇਵਾ ਵਿੱਚ' },
      pos: { English: 'Position', 'हिन्दी': 'स्थिति', 'ਪੰਜਾਬੀ': 'ਸਥਿਤੀ' },
      waitStr: { English: 'Wait', 'हिन्दी': 'प्रतीक्षा', 'ਪੰਜਾਬੀ': 'ਉਡੀਕ' },
      min: { English: 'min', 'हिन्दी': 'मिनट', 'ਪੰਜਾਬੀ': 'ਮਿੰਟ' },
      announceBtn: { English: '🔊 Announce', 'हिन्दी': '🔊 घोषणा करें', 'ਪੰਜਾਬੀ': '🔊 ਘੋਸ਼ਣਾ ਕਰੋ' },
      smsBtn: { English: 'Send SMS', 'हिन्दी': 'SMS भेजें', 'ਪੰਜਾਬੀ': 'SMS ਭੇਜੋ' },
      printBtn: { English: 'Print Slip', 'हिन्दी': 'पर्ची प्रिंट करें', 'ਪੰਜਾਬੀ': 'ਪਰਚੀ ਛਾਪੋ' },
      queueBtn: { English: 'Continue to Queue', 'हिन्दी': 'कतार में आगे बढ़ें', 'ਪੰਜਾਬੀ': 'ਕਤਾਰ ਵਿੱਚ ਅੱਗੇ ਵਧੋ' },
      exitBtn: { English: 'Exit', 'हिन्दी': 'बाहर निकलें', 'ਪੰਜਾਬੀ': 'ਬਾਹਰ ਜਾਓ' }
    };
    return d[key][state.language] || d[key]['English'];
  };

  const announce = () => {
    let msg = `Token ${t.tokenNo}. ${p.name}. Please proceed to ${dept.room}.`;
    let langCode = 'en-US';
    if (state.language === 'हिन्दी') {
      msg = `टोकन ${t.tokenNo}. ${p.name}. कृपया ${dept.room} की ओर बढ़ें।`;
      langCode = 'hi-IN';
    } else if (state.language === 'ਪੰਜਾਬੀ') {
      msg = `ਟੋਕਨ ${t.tokenNo}. ${p.name}. ਕਿਰਪਾ ਕਰਕੇ ${dept.room} ਵੱਲ ਜਾਓ।`;
      langCode = 'pa-IN';
    }
    speakText(msg, langCode);
  };

  return (
    <KioskShell stepLabel={getTranslated('stepLabel')} title={getTranslated('title')} progress={62} hideNav>
      <VoiceBar text={getTranslated('voice')} />
      <div className="token-hero">
        <div className="small" style={{ fontWeight: 800, letterSpacing: '.08em' }}>{getTranslated('official')}</div>
        <div className="num mono">{t.tokenNo || 'A-142'}</div>
        <p><b>{p.name}</b> · {dept.name} · {t.room || dept.room}</p>
        <div className="grid cols-3" style={{ marginTop: 12 }}>
          <div className="card tight"><b>{getTranslated('serving')}</b><br /><span className="mono">{t.nowServing || 'A-127'}</span></div>
          <div className="card tight"><b>{getTranslated('pos')}</b><br />#{t.position || 14}</div>
          <div className="card tight"><b>{getTranslated('waitStr')}</b><br />~{t.waitMin || 42} {getTranslated('min')}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          <button className="btn btn-blue" onClick={announce}>{getTranslated('announceBtn')}</button>
          <button className="btn btn-secondary" onClick={() => alert(`SMS sent to ${p.mobile || 'registered mobile'} with token ${t.tokenNo}.`)}>{getTranslated('smsBtn')}</button>
          <button className="btn btn-secondary" onClick={() => window.print()}>{getTranslated('printBtn')}</button>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" to="/queue/status">{getTranslated('queueBtn')}</Link>
          <Link className="btn btn-ghost" to="/">{getTranslated('exitBtn')}</Link>
        </div>
      </div>
    </KioskShell>
  );
}
