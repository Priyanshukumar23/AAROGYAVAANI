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

  const getTranslated = (key) => {
    const t = {
      stepLabel: { English: 'STEP 1 · CHECK-IN', 'हिन्दी': 'चरण 1 · चेक-इन', 'ਪੰਜਾਬੀ': 'ਕਦਮ 1 · ਚੈੱਕ-ਇਨ' },
      title: { English: 'Choose Your Language', 'हिन्दी': 'अपनी भाषा चुनें', 'ਪੰਜਾਬੀ': 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ' },
      nextLabel: { English: 'Continue', 'हिन्दी': 'आगे बढ़ें', 'ਪੰਜਾਬੀ': 'ਜਾਰੀ ਰੱਖੋ' },
      voice: { English: 'Please choose your language.', 'हिन्दी': 'कृपया अपनी भाषा चुनें।', 'ਪੰਜਾਬੀ': 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ।' },
      listenBtn: { English: '🔊 Listen', 'हिन्दी': '🔊 सुनें', 'ਪੰਜਾਬੀ': '🔊 ਸੁਣੋ' },
      selectedText: { 
        English: `Selected: ${sel} · All further screens and voice prompts will use this language.`,
        'हिन्दी': `चयनित: ${sel} · आगे की सभी स्क्रीन और वॉयस प्रॉम्प्ट इसी भाषा का उपयोग करेंगे।`,
        'ਪੰਜਾਬੀ': `ਚੁਣਿਆ ਗਿਆ: ${sel} · ਅੱਗੇ ਦੀਆਂ ਸਾਰੀਆਂ ਸਕ੍ਰੀਨਾਂ ਅਤੇ ਆਵਾਜ਼ ਪ੍ਰੋਂਪਟ ਇਸ ਭਾਸ਼ਾ ਦੀ ਵਰਤੋਂ ਕਰਨਗੇ।`
      }
    };
    return t[key][state.language] || t[key]['English'];
  };

  return (
    <KioskShell
      stepLabel={getTranslated('stepLabel')}
      title={getTranslated('title')}
      back="/"
      progress={10}
      nextLabel={getTranslated('nextLabel')}
      onNext={() => { patch({ language: sel }); nav('/checkin/accessibility'); }}
    >
      <VoiceBar text={getTranslated('voice')} />
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
              {getTranslated('listenBtn')}
            </button>
          </div>
        ))}
      </div>
      <p className="small muted" style={{ marginTop: 12 }}>{getTranslated('selectedText')}</p>
    </KioskShell>
  );
}
