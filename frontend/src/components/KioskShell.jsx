import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Progress, speakText } from './ui';

export default function KioskShell({ children, stepLabel, progress, back, next, nextLabel = 'Continue', onNext, hideNav = false, title }) {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const goBack = () => { if (back) nav(back); else nav(-1); };
  const goNext = () => { if (onNext) { onNext(); return; } if (next) nav(next); };

  const toggleLanguage = () => {
    const nextLang = state.language === 'English' ? 'Hindi' : 'English';
    patch({ language: nextLang });
    try {
      speakText(nextLang === 'Hindi' ? 'भाषा बदलकर हिन्दी कर दी गई है।' : 'Language set to English.', nextLang);
    } catch {}
  };

  const handleAudio = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      } else {
        const textToRead = title || stepLabel || 'MediKiosk AI-Powered Clinical Intake. Please choose an option to continue.';
        speakText(textToRead, state.language);
      }
    }
  };

  return (
    <div className="page">
      <header className="kiosk-top">
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
          <div className="kiosk-brand"><span className="logo">+</span><span>MediKiosk<div className="sub">AI-Powered Clinical Intake</div></span></div>
        </Link>
        <div className="kiosk-tools">
          <button type="button" className="tool-btn" onClick={toggleLanguage} title="Switch language / भाषा बदलें">
            <span style={{ fontSize: 16, display: 'inline-flex', alignItems: 'center' }}>🌐</span>
            <span>{state.language === 'English' || !state.language ? 'English / हिन्दी' : `${state.language} / English`}</span>
          </button>
          <button type="button" className="tool-btn" onClick={handleAudio} title="Audio guidance">
            <span style={{ fontSize: 16, display: 'inline-flex', alignItems: 'center' }}>🔊</span>
            <span>Audio</span>
          </button>
          <Link className="tool-btn" to="/staff/login" title="Help & Staff Access">
            <span style={{ fontSize: 16, display: 'inline-flex', alignItems: 'center' }}>❓</span>
            <span>Help</span>
          </Link>
        </div>
      </header>
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
          <button className="btn btn-secondary" onClick={goBack}>Back</button>
          <span className="spacer" />
          <button className="btn btn-ghost" onClick={() => alert('Attendant called. Hospital staff is on the way to this kiosk.')}>Call Attendant</button>
          {next || onNext ? <button className="btn btn-primary" onClick={goNext}>{nextLabel}</button> : <span />}
        </footer>
      )}
    </div>
  );
}
