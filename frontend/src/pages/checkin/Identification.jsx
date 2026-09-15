import { Link } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { VoiceBar } from '../../components/ui';

import { useApp } from '../../context/AppContext';

export default function Identification() {
  const { state } = useApp();

  const getTranslated = (key) => {
    const t = {
      stepLabel: { English: 'STEP 1 · CHECK-IN', 'हिन्दी': 'चरण 1 · चेक-इन', 'ਪੰਜਾਬੀ': 'ਕਦਮ 1 · ਚੈੱਕ-ਇਨ' },
      title: { English: 'How would you like to identify yourself?', 'हिन्दी': 'आप अपनी पहचान कैसे बताना चाहेंगे?', 'ਪੰਜਾਬੀ': 'ਤੁਸੀਂ ਆਪਣੀ ਪਛਾਣ ਕਿਵੇਂ ਕਰਨਾ ਚਾਹੋਗੇ?' },
      voice: { English: 'Choose how to identify yourself: scan QR, enter number, or register.', 'हिन्दी': 'अपनी पहचान बताने का तरीका चुनें: QR स्कैन करें, नंबर डालें, या पंजीकरण करें।', 'ਪੰਜਾਬੀ': 'ਆਪਣੀ ਪਛਾਣ ਕਰਨ ਦਾ ਤਰੀਕਾ ਚੁਣੋ: QR ਸਕੈਨ ਕਰੋ, ਨੰਬਰ ਦਰਜ ਕਰੋ, ਜਾਂ ਰਜਿਸਟਰ ਕਰੋ।' },
      scanQR: { English: 'Scan ABHA QR', 'हिन्दी': 'ABHA QR स्कैन करें', 'ਪੰਜਾਬੀ': 'ABHA QR ਸਕੈਨ ਕਰੋ' },
      scanDesc: { English: 'Fastest — scan the QR on your ABHA card or phone', 'हिन्दी': 'सबसे तेज़ — अपने ABHA कार्ड या फ़ोन पर QR स्कैन करें', 'ਪੰਜਾਬੀ': 'ਸਭ ਤੋਂ ਤੇਜ਼ — ਆਪਣੇ ABHA ਕਾਰਡ ਜਾਂ ਫ਼ੋਨ \'ਤੇ QR ਸਕੈਨ ਕਰੋ' },
      enterNum: { English: 'Enter ABHA / Mobile', 'हिन्दी': 'ABHA / मोबाइल दर्ज करें', 'ਪੰਜਾਬੀ': 'ABHA / ਮੋਬਾਈਲ ਦਰਜ ਕਰੋ' },
      enterDesc: { English: 'Type your 14-digit ABHA or 10-digit mobile number', 'हिन्दी': 'अपना 14-अंकीय ABHA या 10-अंकीय मोबाइल नंबर टाइप करें', 'ਪੰਜਾਬੀ': 'ਆਪਣਾ 14-ਅੰਕਾਂ ਵਾਲਾ ABHA ਜਾਂ 10-ਅੰਕਾਂ ਵਾਲਾ ਮੋਬਾਈਲ ਨੰਬਰ ਟਾਈਪ ਕਰੋ' },
      newReg: { English: 'New Registration', 'हिन्दी': 'नया पंजीकरण', 'ਪੰਜਾਬੀ': 'ਨਵੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ' },
      newRegDesc: { English: 'First visit? Register in under a minute', 'हिन्दी': 'पहली बार आए हैं? एक मिनट से कम समय में पंजीकरण करें', 'ਪੰਜਾਬੀ': 'ਪਹਿਲੀ ਫੇਰੀ? ਇੱਕ ਮਿੰਟ ਤੋਂ ਵੀ ਘੱਟ ਸਮੇਂ ਵਿੱਚ ਰਜਿਸਟਰ ਕਰੋ' },
      select: { English: 'Select', 'हिन्दी': 'चुनें', 'ਪੰਜਾਬੀ': 'ਚੁਣੋ' },
      backBtn: { English: 'Back', 'हिन्दी': 'वापस', 'ਪੰਜਾਬੀ': 'ਵਾਪਸ' }
    };
    return t[key][state.language] || t[key]['English'];
  };

  const cards = [
    { to: '/checkin/abha-qr', icon: '📷', t: getTranslated('scanQR'), d: getTranslated('scanDesc') },
    { to: '/checkin/abha-mobile', icon: '🔢', t: getTranslated('enterNum'), d: getTranslated('enterDesc') },
    { to: '/checkin/register', icon: '📝', t: getTranslated('newReg'), d: getTranslated('newRegDesc') }
  ];

  return (
    <KioskShell stepLabel={getTranslated('stepLabel')} title={getTranslated('title')} back="/checkin/accessibility" progress={25} hideNav>
      <VoiceBar text={getTranslated('voice')} />
      <div className="grid cols-3" style={{ alignItems: 'stretch' }}>
        {cards.map((c) => (
          <Link key={c.to} to={c.to} style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>
            <div className="card selectable" style={{ textAlign: 'center', minHeight: 280, height: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'flex-start' }}>
              <div style={{ fontSize: 48 }}>{c.icon}</div>
              <h3>{c.t}</h3>
              <p className="small muted" style={{ minHeight: 44, margin: 0 }}>{c.d}</p>
              <span className="btn btn-primary btn-block" style={{ marginTop: 'auto' }}>{getTranslated('select')}</span>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
        <Link className="btn btn-secondary" to="/checkin/accessibility">{getTranslated('backBtn')}</Link>
      </div>
    </KioskShell>
  );
}
