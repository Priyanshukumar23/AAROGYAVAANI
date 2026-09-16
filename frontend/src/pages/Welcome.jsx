import { Link } from 'react-router-dom';
import KioskShell from '../components/KioskShell';
import { useApp } from '../context/AppContext';
import { VoiceBar, speakText } from '../components/ui';
import { LANGUAGES } from '../data/mock';
import { BrandText } from '../components/BrandLogo';

export default function Welcome() {
  const { state, patch } = useApp();

  const getTranslated = (key) => {
    const t = {
      title: { English: <>Welcome to <BrandText /></>, 'हिन्दी': <><BrandText /> में आपका स्वागत है</>, 'ਪੰਜਾਬੀ': <><BrandText /> ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ</> },
      subtitle: { English: 'Complete your medical history before your doctor consultation.', 'हिन्दी': 'डॉक्टर के परामर्श से पहले अपना चिकित्सा इतिहास पूरा करें।', 'ਪੰਜਾਬੀ': 'ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਲੈਣ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣਾ ਡਾਕਟਰੀ ਇਤਿਹਾਸ ਪੂਰਾ ਕਰੋ।' },
      voice: { English: 'Welcome to AAROGYAVAANI. Patients tap Start Check-In. Staff tap Staff Login.', 'हिन्दी': 'आरोग्यवाणी में आपका स्वागत है। मरीज चेक-इन शुरू करें पर टैप करें। स्टाफ स्टाफ लॉगिन पर टैप करें।', 'ਪੰਜਾਬੀ': 'ਆਰੋਗਿਆਵਾਨੀ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਮਰੀਜ਼ ਸਟਾਰਟ ਚੈੱਕ-ਇਨ ਟੈਪ ਕਰੋ। ਸਟਾਫ ਸਟਾਫ ਲੌਗਇਨ ਟੈਪ ਕਰੋ।' },
      patientsTitle: { English: 'For Patients', 'हिन्दी': 'मरीजों के लिए', 'ਪੰਜਾਬੀ': 'ਮਰੀਜ਼ਾਂ ਲਈ' },
      patientsDesc: { English: 'Check in, get your token, and record symptoms with AI guidance.', 'हिन्दी': 'चेक इन करें, अपना टोकन प्राप्त करें और AI मार्गदर्शन के साथ लक्षण दर्ज करें।', 'ਪੰਜਾਬੀ': 'ਚੈੱਕ ਇਨ ਕਰੋ, ਆਪਣਾ ਟੋਕਨ ਪ੍ਰਾਪਤ ਕਰੋ, ਅਤੇ AI ਮਾਰਗਦਰਸ਼ਨ ਨਾਲ ਲੱਛਣ ਦਰਜ ਕਰੋ।' },
      startBtn: { English: 'Start Patient Check-In', 'हिन्दी': 'मरीज चेक-इन शुरू करें', 'ਪੰਜਾਬੀ': 'ਮਰੀਜ਼ ਚੈੱਕ-ਇਨ ਸ਼ੁਰੂ ਕਰੋ' },
      patientsFoot: { English: 'Takes ~5 minutes · Available in 3 languages', 'हिन्दी': 'लगभग 5 मिनट लगते हैं · 3 भाषाओं में उपलब्ध है', 'ਪੰਜਾਬੀ': 'ਲਗਭਗ 5 ਮਿੰਟ ਲੱਗਦੇ ਹਨ · 3 ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ ਹੈ' },
      staffTitle: { English: 'For Staff', 'हिन्दी': 'स्टाफ के लिए', 'ਪੰਜਾਬੀ': 'ਸਟਾਫ ਲਈ' },
      staffDesc: { English: 'Doctors, nurses and admins — manage queue, triage and consultations.', 'हिन्दी': 'डॉक्टर, नर्स और एडमिन — कतार, ट्राइएज और परामर्श प्रबंधित करें।', 'ਪੰਜਾਬੀ': 'ਡਾਕਟਰ, ਨਰਸਾਂ ਅਤੇ ਐਡਮਿਨ — ਕਤਾਰ, ਟਰਾਈਏਜ ਅਤੇ ਸਲਾਹ-ਮਸ਼ਵਰੇ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ।' },
      staffBtn: { English: 'Hospital Staff Login', 'हिन्दी': 'अस्पताल स्टाफ लॉगिन', 'ਪੰਜਾਬੀ': 'ਹਸਪਤਾਲ ਸਟਾਫ ਲੌਗਇਨ' },
      staffFoot: { English: 'Doctor · Nurse · Admin access', 'हिन्दी': 'डॉक्टर · नर्स · एडमिन एक्सेस', 'ਪੰਜਾਬੀ': 'ਡਾਕਟਰ · ਨਰਸ · ਐਡਮਿਨ ਪਹੁੰਚ' },
      quickLang: { English: 'Quick language / भाषा चुनें / ਭਾਸ਼ਾ ਚੁਣੋ', 'हिन्दी': 'Quick language / भाषा चुनें / ਭਾਸ਼ਾ ਚੁਣੋ', 'ਪੰਜਾਬੀ': 'Quick language / भाषा चुनें / ਭਾਸ਼ਾ ਚੁਣੋ' },
      voiceGuide: { English: '🔊 Voice guidance is available at every step. Tap 🔊 Listen to hear instructions aloud.', 'हिन्दी': '🔊 हर कदम पर वॉयस मार्गदर्शन उपलब्ध है। निर्देश सुनने के लिए 🔊 सुनें पर टैप करें।', 'ਪੰਜਾਬੀ': '🔊 ਹਰ ਕਦਮ \'ਤੇ ਆਵਾਜ਼ ਮਾਰਗਦਰਸ਼ਨ ਉਪਲਬਧ ਹੈ। ਹਦਾਇਤਾਂ ਸੁਣਨ ਲਈ 🔊 ਸੁਣੋ \'ਤੇ ਟੈਪ ਕਰੋ।' },
      aboutTitle: { English: 'About', 'हिन्दी': 'के बारे में', 'ਪੰਜਾਬੀ': 'ਬਾਰੇ' },
      aboutDesc: { English: 'A modern AI-powered health intake system designed to reduce wait times and capture accurate patient histories.', 'हिन्दी': 'इंतजार के समय को कम करने और सटीक रोगी इतिहास कैप्चर करने के लिए डिज़ाइन किया गया एक आधुनिक AI-संचालित स्वास्थ्य सेवन सिस्टम।', 'ਪੰਜਾਬੀ': 'ਇੱਕ ਆਧੁਨਿਕ AI-ਸੰਚਾਲਿਤ ਸਿਹਤ ਦਾਖਲੇ ਸਿਸਟਮ ਜੋ ਉਡੀਕ ਦੇ ਸਮੇਂ ਨੂੰ ਘਟਾਉਣ ਅਤੇ ਮਰੀਜ਼ ਦੇ ਇਤਿਹਾਸ ਨੂੰ ਸਹੀ ਕੈਪਚਰ ਕਰਨ ਲਈ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਹੈ।' }
    };
    return t[key][state.language] || t[key]['English'];
  };

  return (
    <KioskShell hideNav>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 className="kiosk-display" style={{ textShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>{getTranslated('title')}</h1>
        <p style={{ fontSize: 20 }}>{getTranslated('subtitle')}</p>
      </div>
      <VoiceBar text={getTranslated('voice')} />
      <div className="card ui-3d-card" style={{ marginBottom: 16 }}>
        <h4 style={{ margin: 0 }}>{getTranslated('quickLang')}</h4>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
          {LANGUAGES.slice(0, 3).map((l) => (
            <button
              key={l.code}
              className={`btn btn-sm ui-3d-btn-sm ${state.language === l.label ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => { patch({ language: l.label }); speakText(l.greet); }}
            >
              {l.label}
            </button>
          ))}
        </div>
        <p className="small muted" style={{ marginTop: 10, marginBottom: 0 }}>{getTranslated('voiceGuide')}</p>
      </div>
      
      <div className="hero-split">
        <div className="card welcome-card selected ui-3d-card">
          <div className="big-icon">🧑‍⚕️</div>
          <h3>{getTranslated('patientsTitle')}</h3>
          <p>{getTranslated('patientsDesc')}</p>
          <Link className="btn btn-primary btn-block ui-3d-btn" to="/checkin/language">{getTranslated('startBtn')}</Link>
          <span className="small muted">{getTranslated('patientsFoot')}</span>
        </div>
        <div className="card welcome-card staff-selected ui-3d-card">
          <div className="big-icon">🏥</div>
          <h3>{getTranslated('staffTitle')}</h3>
          <p>{getTranslated('staffDesc')}</p>
          <Link className="btn btn-secondary btn-block ui-3d-btn-sec" to="/staff/login">{getTranslated('staffBtn')}</Link>
          <span className="small muted">{getTranslated('staffFoot')}</span>
        </div>
      </div>
      <div className="card ui-3d-card" style={{ marginTop: 16, background: 'var(--blue-soft)', border: '1px solid var(--blue-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>🇮🇳</div>
          <div>
            <h4 style={{ margin: 0, color: 'var(--blue-dark)' }}>{getTranslated('aboutTitle')} <BrandText /></h4>
            <p className="small" style={{ margin: 0, marginTop: 4, color: 'var(--blue-dark)' }}>
              {getTranslated('aboutDesc')}
            </p>
          </div>
        </div>
      </div>
    </KioskShell>
  );
}
