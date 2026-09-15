import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Progress, speakText } from './ui';
import BrandLogo from './BrandLogo';
import HelpModal from './HelpModal';
import PatientProfileModal from './PatientProfileModal';

export default function KioskShell({ children, stepLabel, progress, back, next, nextLabel, onNext, hideNav = false, title, isListening = false }) {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const loc = useLocation();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (state.accessibility?.voice) {
      const timer = setTimeout(() => {
        const textToRead = title || stepLabel;
        if (textToRead && typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const langCode = state.language === 'हिन्दी' ? 'hi-IN' : (state.language === 'ਪੰਜਾਬੀ' ? 'pa-IN' : 'en-US');
          speakText(textToRead, langCode);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [title, stepLabel, state.accessibility?.voice, state.language]);

  const goBack = () => { if (back) nav(back); else nav(-1); };
  const goNext = () => { if (onNext) { onNext(); return; } if (next) nav(next); };

  const getTranslated = (key) => {
    const t = {
      backBtn: { English: 'Back', 'हिन्दी': 'वापस', 'ਪੰਜਾਬੀ': 'ਵਾਪਸ' },
      callAttendant: { English: 'Call Attendant', 'हिन्दी': 'स्टाफ बुलाएं', 'ਪੰਜਾਬੀ': 'ਸਟਾਫ ਬੁਲਾਓ' },
      continueBtn: { English: 'Continue', 'हिन्दी': 'आगे बढ़ें', 'ਪੰਜਾਬੀ': 'ਜਾਰੀ ਰੱਖੋ' },
      audioStr: { English: 'Audio', 'हिन्दी': 'ऑडियो', 'ਪੰਜਾਬੀ': 'ਆਡੀਓ' },
      helpStr: { English: 'Help', 'हिन्दी': 'मदद', 'ਪੰਜਾਬੀ': 'ਮਦਦ' },
      aiIntake: { English: 'AI-Powered Clinical Intake', 'हिन्दी': 'AI-संचालित क्लिनिकल चेक-इन', 'ਪੰਜਾਬੀ': 'AI-ਸੰਚਾਲਿਤ ਕਲੀਨਿਕਲ ਚੈੱਕ-ਇਨ' },
      themeLight: { English: 'Light', 'हिन्दी': 'लाइट', 'ਪੰਜਾਬੀ': 'ਰੌਸ਼ਨੀ' },
      themeDark: { English: 'Dark', 'हिन्दी': 'डार्क', 'ਪੰਜਾਬੀ': 'ਹਨੇਰਾ' },
      profileStr: { English: 'Profile', 'हिन्दी': 'प्रोफ़ाइल', 'ਪੰਜਾਬੀ': 'ਪ੍ਰੋਫਾਈਲ' },
      staffStr: { English: 'Staff', 'हिन्दी': 'स्टाफ', 'ਪੰਜਾਬੀ': 'ਸਟਾਫ' }
    };
    return t[key][state.language] || t[key]['English'];
  };

  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const setLanguage = (lang) => {
    patch({ language: lang });
    setLangMenuOpen(false);
    try {
      if (lang === 'हिन्दी') speakText('भाषा बदलकर हिन्दी कर दी गई है।', 'hi-IN');
      else if (lang === 'ਪੰਜਾਬੀ') speakText('ਭਾਸ਼ਾ ਬਦਲ ਕੇ ਪੰਜਾਬੀ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ।', 'pa-IN');
      else speakText('Language set to English.', 'en-US');
    } catch {}
  };

  const handleAudio = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      } else {
        const textToRead = title || stepLabel || 'AAROGYAVAANI AI-Powered Clinical Intake. Please choose an option to continue.';
        const langCode = state.language === 'हिन्दी' ? 'hi-IN' : (state.language === 'ਪੰਜਾਬੀ' ? 'pa-IN' : 'en-US');
        speakText(textToRead, langCode);
      }
    }
  };

  const finalNextLabel = nextLabel || getTranslated('continueBtn');

  return (
    <div className="page">
      <header className="kiosk-top">
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
          <BrandLogo size={24} isListening={isListening} />
          <div className="sub" style={{ marginTop: 2, fontSize: '0.85em', opacity: 0.9 }}>{getTranslated('aiIntake')}</div>
        </Link>
        <div className="kiosk-tools">
          <button type="button" className="tool-btn" onClick={() => patch({ theme: state.theme === 'dark' ? 'light' : 'dark' })} title="Toggle Theme">
            <span style={{ fontSize: 16, display: 'inline-flex', alignItems: 'center' }}>{state.theme === 'dark' ? '☀️' : '🌙'}</span>
            <span>{state.theme === 'dark' ? getTranslated('themeLight') : getTranslated('themeDark')}</span>
          </button>
          <div style={{ position: 'relative' }}>
            <button type="button" className="tool-btn" onClick={() => setLangMenuOpen(!langMenuOpen)} title="Switch language">
              <span style={{ fontSize: 16, display: 'inline-flex', alignItems: 'center' }}>🌐</span>
              <span>{state.language === 'हिन्दी' ? 'हिन्दी' : (state.language === 'ਪੰਜਾਬੀ' ? 'ਪੰਜਾਬੀ' : 'English')} <span style={{ fontSize: 12, opacity: 0.7 }}>▼</span></span>
            </button>
            {langMenuOpen && (
              <div className="ui-dropdown-menu" style={{ position: 'absolute', top: '100%', right: 0, marginTop: 12, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, boxShadow: 'var(--shadow-2)', zIndex: 100, padding: 8, minWidth: 150, animation: 'dropdown-pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                {['English', 'हिन्दी', 'ਪੰਜਾਬੀ'].map(l => (
                  <button key={l} type="button" onClick={() => setLanguage(l)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 16px', border: 'none', background: state.language === l ? 'var(--blue-soft)' : 'transparent', borderRadius: 6, cursor: 'pointer', fontWeight: state.language === l ? 700 : 500, color: 'var(--ink)', transition: 'background 0.1s' }}>
                    <span>{l}</span>
                    {state.language === l && <span style={{ color: 'var(--blue)', fontSize: 14 }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button type="button" className="tool-btn" onClick={handleAudio} title="Audio guidance">
            <span style={{ fontSize: 16, display: 'inline-flex', alignItems: 'center' }}>🔊</span>
            <span>{getTranslated('audioStr')}</span>
          </button>
          <button type="button" className="tool-btn" onClick={() => setIsHelpOpen(true)} title="Help">
            <span style={{ fontSize: 16, display: 'inline-flex', alignItems: 'center' }}>❓</span>
            <span>{getTranslated('helpStr')}</span>
          </button>
          
          {(state.patient && loc.pathname !== '/' && !loc.pathname.startsWith('/checkin/identify') && !loc.pathname.startsWith('/checkin/language') && !loc.pathname.startsWith('/checkin/accessibility') && !loc.pathname.startsWith('/staff')) ? (
            <button type="button" className="tool-btn" onClick={() => setIsProfileOpen(true)} title="Patient Profile" style={{ background: 'var(--blue-soft)', color: 'var(--blue-dark)', fontWeight: 700, borderRadius: 8 }}>
              <span style={{ fontSize: 16, display: 'inline-flex', alignItems: 'center' }}>👤</span>
              <span>{getTranslated('profileStr')}</span>
            </button>
          ) : (
            <Link className="tool-btn" to="/staff/login" title="Staff Access">
              <span style={{ fontSize: 16, display: 'inline-flex', alignItems: 'center' }}>🏥</span>
              <span>{getTranslated('staffStr')}</span>
            </Link>
          )}
        </div>
      </header>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <PatientProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <main className="kiosk-body">
        <div className="container kiosk">
          {(stepLabel || title) && (
            <div style={{ marginBottom: 12 }}>
              {stepLabel && <div className="small" style={{ fontWeight: 800, letterSpacing: '.06em', color: 'var(--blue-dark)' }}>{stepLabel}</div>}
              {title && <h2 style={{ marginTop: 4 }}>{title}</h2>}
              {typeof progress === 'number' && <div style={{ marginTop: 10 }}><Progress value={progress} /></div>}
            </div>
          )}
          {children}
        </div>
      </main>
      {!hideNav && (
        <footer className="kiosk-nav">
          <button className="btn btn-secondary" onClick={goBack}>{getTranslated('backBtn')}</button>
          <span className="spacer" />
          <button className="btn btn-ghost" onClick={() => alert('Attendant called. Hospital staff is on the way to this kiosk.')}>{getTranslated('callAttendant')}</button>
          {next || onNext ? <button className="btn btn-primary" onClick={goNext}>{finalNextLabel}</button> : <span />}
        </footer>
      )}
    </div>
  );
}
