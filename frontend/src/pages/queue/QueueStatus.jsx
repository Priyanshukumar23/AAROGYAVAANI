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

  const getTranslated = (key) => {
    const d = {
      stepLabel: { English: 'STEP 5 · QUEUE', 'हिन्दी': 'चरण 5 · कतार', 'ਪੰਜਾਬੀ': 'ਕਦਮ 5 · ਕਤਾਰ' },
      title: { English: 'Your Queue Status', 'हिन्दी': 'आपकी कतार की स्थिति', 'ਪੰਜਾਬੀ': 'ਤੁਹਾਡੀ ਕਤਾਰ ਦੀ ਸਥਿਤੀ' },
      voice: { 
        English: `Token ${t.tokenNo}. Now serving ${t.nowServing}. About ${t.waitMin} minutes wait.`,
        'हिन्दी': `टोकन ${t.tokenNo}. अब सेवा में ${t.nowServing}. लगभग ${t.waitMin} मिनट की प्रतीक्षा।`,
        'ਪੰਜਾਬੀ': `ਟੋਕਨ ${t.tokenNo}. ਹੁਣ ਸੇਵਾ ਵਿੱਚ ${t.nowServing}. ਲਗਭਗ ${t.waitMin} ਮਿੰਟ ਉਡੀਕ।`
      },
      official: { English: 'OFFICIAL OPD TOKEN · UHID', 'हिन्दी': 'आधिकारिक ओपीडी टोकन · UHID', 'ਪੰਜਾਬੀ': 'ਅਧਿਕਾਰਤ ਓਪੀਡੀ ਟੋਕਨ · UHID' },
      serving: { English: 'Now serving', 'हिन्दी': 'अब सेवा में', 'ਪੰਜਾਬੀ': 'ਹੁਣ ਸੇਵਾ ਵਿੱਚ' },
      ahead: { English: 'Ahead of you', 'हिन्दी': 'आपसे आगे', 'ਪੰਜਾਬੀ': 'ਤੁਹਾਡੇ ਤੋਂ ਅੱਗੇ' },
      patients: { English: 'patients', 'हिन्दी': 'मरीज', 'ਪੰਜਾਬੀ': 'ਮਰੀਜ਼' },
      wait: { English: 'Wait', 'हिन्दी': 'प्रतीक्षा', 'ਪੰਜਾਬੀ': 'ਉਡੀਕ' },
      min: { English: 'min', 'हिन्दी': 'मिनट', 'ਪੰਜਾਬੀ': 'ਮਿੰਟ' },
      slots: { English: '68% of morning slots completed', 'हिन्दी': '68% सुबह के स्लॉट पूरे हुए', 'ਪੰਜਾਬੀ': 'ਸਵੇਰ ਦੇ ਸਲਾਟ ਦਾ 68% ਪੂਰਾ ਹੋਇਆ' },
      where: { English: 'Where to go', 'हिन्दी': 'कहाँ जाएँ', 'ਪੰਜਾਬੀ': 'ਕਿੱਥੇ ਜਾਣਾ ਹੈ' },
      hall: { English: 'Waiting Hall B · Gate 2', 'हिन्दी': 'प्रतीक्षा कक्ष B · गेट 2', 'ਪੰਜਾਬੀ': 'ਵੇਟਿੰਗ ਹਾਲ B · ਗੇਟ 2' },
      listen: { English: 'Listen for announcements', 'हिन्दी': 'घोषणाओं को सुनें', 'ਪੰਜਾਬੀ': 'ਘੋਸ਼ਣਾਵਾਂ ਨੂੰ ਸੁਣੋ' },
      smsStr: { English: 'SMS alerts', 'हिन्दी': 'SMS अलर्ट', 'ਪੰਜਾਬੀ': 'SMS ਅਲਰਟ' },
      on: { English: 'ON', 'हिन्दी': 'चालू', 'ਪੰਜਾਬੀ': 'ਚਾਲੂ' },
      off: { English: 'OFF', 'हिन्दी': 'बंद', 'ਪੰਜਾਬੀ': 'ਬੰਦ' },
      live: { English: 'Live Monitor', 'हिन्दी': 'लाइव मॉनिटर', 'ਪੰਜਾਬੀ': 'ਲਾਈਵ ਮਾਨੀਟਰ' },
      print: { English: 'Print', 'हिन्दी': 'प्रिंट करें', 'ਪੰਜਾਬੀ': 'ਪ੍ਰਿੰਟ ਕਰੋ' },
      toMob: { English: 'to', 'हिन्दी': 'पर', 'ਪੰਜਾਬੀ': 'ਤੇ' }
    };
    return d[key][state.language] || d[key]['English'];
  };

  return (
    <KioskShell stepLabel={getTranslated('stepLabel')} title={getTranslated('title')} progress={100} hideNav>
      <VoiceBar text={getTranslated('voice')} />
      <div className="token-hero" style={{ marginBottom: 14 }}>
        <div className="small" style={{ fontWeight: 800, letterSpacing: '.08em' }}>{getTranslated('official')} {p.uhid || '—'}</div>
        <div className="num mono">{t.tokenNo || 'A-142'}</div>
        <div><b>{p.name}</b> · {dept.name}</div>
        <div className="grid cols-3" style={{ marginTop: 12 }}>
          <div className="card tight"><b>{getTranslated('serving')}</b><br /><span className="mono">{t.nowServing || 'A-127'}</span></div>
          <div className="card tight"><b>{getTranslated('ahead')}</b><br />{(t.position || 14) - 1} {getTranslated('patients')}</div>
          <div className="card tight"><b>{getTranslated('wait')}</b><br />~{t.waitMin || 42} {getTranslated('min')}</div>
        </div>
        <div style={{ marginTop: 12 }}><Progress value={68} /><div className="small muted">{getTranslated('slots')}</div></div>
      </div>
      <div className="grid cols-2">
        <div className="card"><h4>{getTranslated('where')}</h4><p>👨‍⚕️ Dr. A. Verma · {t.room || dept.room}<br />🪑 {getTranslated('hall')}<br />🔔 {getTranslated('listen')}</p></div>
        <div className="card">
          <label className="checkrow"><input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} /><span>{getTranslated('smsStr')} {sms ? getTranslated('on') : getTranslated('off')} <span className="small muted">· {getTranslated('toMob')} {p.mobile || 'mobile'}</span></span></label>
          <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
            <Link className="btn btn-primary" to="/queue/live">{getTranslated('live')}</Link>
            <button className="btn btn-secondary" onClick={() => window.print()}>{getTranslated('print')}</button>
          </div>
        </div>
      </div>
    </KioskShell>
  );
}
