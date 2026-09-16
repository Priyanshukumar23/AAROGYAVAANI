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
      patFeatTitle: { English: '👨‍👩‍👧‍👦 For Patients', 'हिन्दी': '👨‍👩‍👧‍👦 मरीजों के लिए', 'ਪੰਜਾਬੀ': '👨‍👩‍👧‍👦 ਮਰੀਜ਼ਾਂ ਲਈ' },
      patFeat1: { English: '🎤 Speak to AI in your native language or scan reports via OCR.', 'हिन्दी': '🎤 अपनी भाषा में AI से बात करें या OCR के माध्यम से रिपोर्ट स्कैन करें।', 'ਪੰਜਾਬੀ': '🎤 ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ AI ਨਾਲ ਗੱਲ ਕਰੋ ਜਾਂ OCR ਰਾਹੀਂ ਰਿਪੋਰਟਾਂ ਸਕੈਨ ਕਰੋ।' },
      patFeat2: { English: '🚨 Trigger Emergency with live GPS tracking and AI first-aid.', 'हिन्दी': '🚨 लाइव GPS ट्रैकिंग और AI प्राथमिक चिकित्सा के साथ आपातकाल ट्रिगर करें।', 'ਪੰਜਾਬੀ': '🚨 ਲਾਈਵ GPS ਟਰੈਕਿੰਗ ਅਤੇ AI ਫਸਟ ਏਡ ਨਾਲ ਐਮਰਜੈਂਸੀ ਨੂੰ ਟਰਿੱਗਰ ਕਰੋ।' },
      patFeat3: { English: '🏥 View nearby hospitals and download your digital prescriptions.', 'हिन्दी': '🏥 आस-पास के अस्पताल देखें और अपने डिजिटल नुस्खे डाउनलोड करें।', 'ਪੰਜਾਬੀ': '🏥 ਨੇੜਲੇ ਹਸਪਤਾਲਾਂ ਨੂੰ ਦੇਖੋ ਅਤੇ ਆਪਣੇ ਡਿਜੀਟਲ ਨੁਸਖੇ ਡਾਊਨਲੋਡ ਕਰੋ।' },
      docFeatTitle: { English: '🩺 For Doctors & Staff', 'हिन्दी': '🩺 डॉक्टरों और कर्मचारियों के लिए', 'ਪੰਜਾਬੀ': '🩺 ਡਾਕਟਰਾਂ ਅਤੇ ਸਟਾਫ ਲਈ' },
      docFeat1: { English: '⚡ View real-time AI triage reports and patient vitals.', 'हिन्दी': '⚡ रीयल-टाइम AI ट्राइएज रिपोर्ट और रोगी के महत्वपूर्ण अंग देखें।', 'ਪੰਜਾਬੀ': '⚡ ਰੀਅਲ-ਟਾਈਮ AI ਟ੍ਰਾਈਜ ਰਿਪੋਰਟਾਂ ਅਤੇ ਮਰੀਜ਼ ਦੇ ਜ਼ਰੂਰੀ ਅੰਗ ਦੇਖੋ।' },
      docFeat2: { English: '📋 Verify patient history, OCR scans, and active emergency cases.', 'हिन्दी': '📋 रोगी के इतिहास, OCR स्कैन और सक्रिय आपातकालीन मामलों की जांच करें।', 'ਪੰਜਾਬੀ': '📋 ਮਰੀਜ਼ ਦੇ ਇਤਿਹਾਸ, OCR ਸਕੈਨ, ਅਤੇ ਸਰਗਰਮ ਐਮਰਜੈਂਸੀ ਮਾਮਲਿਆਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ।' },
      docFeat3: { English: '💊 Add prescriptions directly and send them to the patient portal.', 'हिन्दी': '💊 नुस्खे सीधे जोड़ें और उन्हें रोगी पोर्टल पर भेजें।', 'ਪੰਜਾਬੀ': '💊 ਨੁਸਖੇ ਸਿੱਧੇ ਸ਼ਾਮਲ ਕਰੋ ਅਤੇ ਉਹਨਾਂ ਨੂੰ ਮਰੀਜ਼ ਦੇ ਪੋਰਟਲ \'ਤੇ ਭੇਜੋ।' }
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
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--blue-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: 24 }}>🇮🇳</span> {getTranslated('aboutTitle')} <BrandText />
        </h3>
        
        <div className="grid cols-2" style={{ gap: '20px', alignItems: 'start' }}>
          <div style={{ background: 'rgba(255,255,255,0.7)', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>{getTranslated('patFeatTitle')}</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', color: '#334155', fontSize: '15px' }}>
              <li>{getTranslated('patFeat1')}</li>
              <li>{getTranslated('patFeat2')}</li>
              <li>{getTranslated('patFeat3')}</li>
            </ul>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.7)', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>{getTranslated('docFeatTitle')}</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', color: '#334155', fontSize: '15px' }}>
              <li>{getTranslated('docFeat1')}</li>
              <li>{getTranslated('docFeat2')}</li>
              <li>{getTranslated('docFeat3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </KioskShell>
  );
}
