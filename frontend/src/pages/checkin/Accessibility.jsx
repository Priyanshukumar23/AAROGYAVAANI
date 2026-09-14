import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar, speakText } from '../../components/ui';

const OPTS = [
  { k: 'voice', label: 'Voice guidance', desc: 'Hear every instruction aloud' },
  { k: 'largeText', label: 'Large text', desc: 'Bigger fonts for easy reading' },
  { k: 'slowVoice', label: 'Slow voice', desc: 'Slower audio prompts' },
  { k: 'highContrast', label: 'High contrast', desc: 'Easier to see in bright light' }
];

export default function Accessibility() {
  const { state, patch } = useApp();
  const a = state.accessibility || {};
  const toggle = (k) => patch({ accessibility: { ...a, [k]: !a[k] } });
  const test = () => {
    speakText('This is a MediKiosk audio test. Please follow the on-screen steps.', state.language);
  };
  return (
    <KioskShell stepLabel="STEP 1 · CHECK-IN" title="Comfort & Accessibility" back="/checkin/language" next="/checkin/identify" progress={18}>
      <VoiceBar text="Adjust comfort settings. You can change these anytime." />
      <div className="grid" style={{ marginBottom: 16 }}>
        {OPTS.map((o) => (
          <label key={o.k} className="checkrow">
            <input type="checkbox" checked={!!a[o.k]} onChange={() => toggle(o.k)} />
            <span><b>{o.label}</b><br /><span className="small muted">{o.desc}</span></span>
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-blue" onClick={test}>🔊 Test Audio</button>
        <span className="small muted" style={{ alignSelf: 'center' }}>Audio {a.voice ? 'ON' : 'OFF'} · Text {a.largeText ? 'Large' : 'Normal'}</span>
      </div>
    </KioskShell>
  );
}
