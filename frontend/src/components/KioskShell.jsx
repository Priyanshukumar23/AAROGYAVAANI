import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Progress } from './ui';

export default function KioskShell({ children, stepLabel, progress, back, next, nextLabel = 'Continue', onNext, hideNav = false, title }) {
  const { state } = useApp();
  const nav = useNavigate();
  const goBack = () => { if (back) nav(back); else nav(-1); };
  const goNext = () => { if (onNext) { onNext(); return; } if (next) nav(next); };
  return (
    <div className="page">
      <header className="kiosk-top">
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
          <div className="kiosk-brand"><span className="logo">+</span><span>MediKiosk<div className="sub">AI-Powered Clinical Intake</div></span></div>
        </Link>
        <div className="kiosk-tools">
          <span className="tool-btn">{state.language} / Hindi</span>
          <button className="tool-btn" onClick={() => { try { window.speechSynthesis.cancel(); } catch {} }}>Audio</button>
          <Link className="tool-btn" to="/staff/login" style={{ textDecoration: 'none' }}>Help</Link>
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
