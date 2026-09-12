import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar, speakText } from '../../components/ui';
import { LANGUAGES } from '../../data/mock';

export default function LanguageSelection() {
  const { state, patch } = useApp();
  const [sel, setSel] = useState(state.language || 'English');
  const nav = useNavigate();
  const choose = (l) => { setSel(l.label); patch({ language: l.label }); };
  return (
    <KioskShell
      stepLabel="STEP 1 · PATIENT CHECK-IN"
      title="Choose Your Language"
      back="/"
      progress={10}
      nextLabel="Continue"
      onNext={() => { patch({ language: sel }); nav('/checkin/accessibility'); }}
    >
      <VoiceBar text="Please choose your language. अपनी भाषा चुनें।" />
      <div className="lang-grid">
        {LANGUAGES.map((l) => (
          <div key={l.code} className={`card selectable lang-card ${sel === l.label ? 'selected' : ''}`} onClick={() => choose(l)}>
            <div style={{ fontSize: 22 }}>{l.label}</div>
            <div className="small muted">{l.greet}</div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ marginTop: 8 }}
              onClick={(e) => { e.stopPropagation(); speakText(l.greet, l.code); }}
            >
              🔊 Listen
            </button>
          </div>
        ))}
      </div>
      <p className="small muted" style={{ marginTop: 12 }}>Selected: <b>{sel}</b> · All further screens and voice prompts will use this language.</p>
    </KioskShell>
  );
}
