import { Link } from 'react-router-dom';
import KioskShell from '../components/KioskShell';
import { useApp } from '../context/AppContext';
import { VoiceBar, speakText } from '../components/ui';
import { LANGUAGES } from '../data/mock';

export default function Welcome() {
  const { state, patch } = useApp();
  return (
    <KioskShell hideNav>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 className="kiosk-display">Welcome to MediKiosk</h1>
        <p style={{ fontSize: 20 }}>Complete your medical history before your doctor consultation.</p>
      </div>
      <VoiceBar text="Welcome to MediKiosk. Patients tap Start Check-In. Staff tap Staff Login." />
      <div className="hero-split">
        <div className="card welcome-card selected">
          <div className="big-icon">🧑‍⚕️</div>
          <h3>For Patients</h3>
          <p>Check in, get your token, and record symptoms with AI guidance.</p>
          <Link className="btn btn-primary btn-block" to="/checkin/language">Start Patient Check-In</Link>
          <span className="small muted">Takes ~5 minutes · Available in 9 languages</span>
        </div>
        <div className="card welcome-card">
          <div className="big-icon">🏥</div>
          <h3>For Staff</h3>
          <p>Doctors, nurses and admins — manage queue, triage and consultations.</p>
          <Link className="btn btn-secondary btn-block" to="/staff/login">Hospital Staff Login</Link>
          <span className="small muted">Doctor · Nurse · Admin access</span>
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h4>Quick language / भाषा चुनें</h4>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
          {LANGUAGES.slice(0, 6).map((l) => (
            <button
              key={l.code}
              className={`btn btn-sm ${state.language === l.label ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => { patch({ language: l.label }); speakText(l.greet); }}
            >
              {l.label}
            </button>
          ))}
          <Link className="btn btn-sm btn-ghost" to="/checkin/language">More…</Link>
        </div>
        <p className="small muted" style={{ marginTop: 10 }}>🔊 Voice guidance is available at every step. Tap 🔊 Listen to hear instructions aloud.</p>
      </div>
    </KioskShell>
  );
}
