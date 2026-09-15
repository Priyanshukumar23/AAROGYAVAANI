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

  const getTranslated = (key) => {
    const t = {
      stepLabel: { English: 'STEP 1 · CHECK-IN', 'हिन्दी': 'चरण 1 · चेक-इन', 'ਪੰਜਾਬੀ': 'ਕਦਮ 1 · ਚੈੱਕ-ਇਨ' },
      title: { English: 'Comfort & Accessibility', 'हिन्दी': 'आराम और पहुंच', 'ਪੰਜਾਬੀ': 'ਆਰਾਮ ਅਤੇ ਪਹੁੰਚ' },
      voiceBar: { English: 'Adjust comfort settings. You can change these anytime.', 'हिन्दी': 'आराम सेटिंग्स समायोजित करें। आप इन्हें कभी भी बदल सकते हैं।', 'ਪੰਜਾਬੀ': 'ਆਰਾਮ ਸੈਟਿੰਗਾਂ ਵਿਵਸਥਿਤ ਕਰੋ। ਤੁਸੀਂ ਇਹਨਾਂ ਨੂੰ ਕਿਸੇ ਵੀ ਸਮੇਂ ਬਦਲ ਸਕਦੇ ਹੋ।' },
      testAudio: { English: '🔊 Test Audio', 'हिन्दी': '🔊 ऑडियो परीक्षण', 'ਪੰਜਾਬੀ': '🔊 ਆਡੀਓ ਟੈਸਟ' },
      testMsg: { English: 'This is an AAROGYAVAANI audio test. Please follow the on-screen steps.', 'हिन्दी': 'यह आरोग्यवाणी ऑडियो परीक्षण है। कृपया स्क्रीन पर दिए गए चरणों का पालन करें।', 'ਪੰਜਾਬੀ': 'ਇਹ ਆਰੋਗਿਆਵਾਨੀ ਆਡੀਓ ਟੈਸਟ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਸਕ੍ਰੀਨ ' + "'ਤੇ ਦਿੱਤੇ ਕਦਮਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ।" },
      on: { English: 'ON', 'हिन्दी': 'चालू', 'ਪੰਜਾਬੀ': 'ਚਾਲੂ' },
      off: { English: 'OFF', 'हिन्दी': 'बंद', 'ਪੰਜਾਬੀ': 'ਬੰਦ' },
      large: { English: 'Large', 'हिन्दी': 'बड़ा', 'ਪੰਜਾਬੀ': 'ਵੱਡਾ' },
      normal: { English: 'Normal', 'हिन्दी': 'सामान्य', 'ਪੰਜਾਬੀ': 'ਆਮ' },
      audioStr: { English: 'Audio', 'हिन्दी': 'ऑडियो', 'ਪੰਜਾਬੀ': 'ਆਡੀਓ' },
      textStr: { English: 'Text', 'हिन्दी': 'टेक्स्ट', 'ਪੰਜਾਬੀ': 'ਟੈਕਸਟ' },
    };
    return t[key][state.language] || t[key]['English'];
  };

  const getOpts = () => {
    const lang = state.language;
    if (lang === 'हिन्दी') {
      return [
        { k: 'voice', label: 'वॉयस मार्गदर्शन', desc: 'हर निर्देश जोर से सुनें' },
        { k: 'largeText', label: 'बड़ा टेक्स्ट', desc: 'आसानी से पढ़ने के लिए बड़े फ़ॉन्ट' },
        { k: 'slowVoice', label: 'धीमी आवाज़', desc: 'धीमे ऑडियो प्रॉम्प्ट' },
        { k: 'highContrast', label: 'उच्च कंट्रास्ट', desc: 'तेज रोशनी में देखने में आसान' }
      ];
    }
    if (lang === 'ਪੰਜਾਬੀ') {
      return [
        { k: 'voice', label: 'ਆਵਾਜ਼ ਮਾਰਗਦਰਸ਼ਨ', desc: 'ਹਰ ਹਦਾਇਤ ਉੱਚੀ ਆਵਾਜ਼ ਵਿੱਚ ਸੁਣੋ' },
        { k: 'largeText', label: 'ਵੱਡਾ ਟੈਕਸਟ', desc: 'ਆਸਾਨੀ ਨਾਲ ਪੜ੍ਹਨ ਲਈ ਵੱਡੇ ਫੌਂਟ' },
        { k: 'slowVoice', label: 'ਹੌਲੀ ਆਵਾਜ਼', desc: 'ਹੌਲੀ ਆਡੀਓ ਪ੍ਰੋਂਪਟ' },
        { k: 'highContrast', label: 'ਹਾਈ ਕੰਟ੍ਰਾਸਟ', desc: 'ਤੇਜ਼ ਰੌਸ਼ਨੀ ਵਿੱਚ ਦੇਖਣਾ ਆਸਾਨ' }
      ];
    }
    return OPTS;
  };

  const test = () => {
    const langCode = state.language === 'हिन्दी' ? 'hi' : (state.language === 'ਪੰਜਾਬੀ' ? 'pa' : 'en');
    speakText(getTranslated('testMsg'), langCode);
  };

  return (
    <KioskShell stepLabel={getTranslated('stepLabel')} title={getTranslated('title')} back="/checkin/language" next="/checkin/identify" progress={18}>
      <VoiceBar text={getTranslated('voiceBar')} />
      <div className="grid" style={{ marginBottom: 16 }}>
        {getOpts().map((o) => (
          <label key={o.k} className="checkrow">
            <input type="checkbox" checked={!!a[o.k]} onChange={() => toggle(o.k)} />
            <span><b>{o.label}</b><br /><span className="small muted">{o.desc}</span></span>
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-blue" onClick={test}>{getTranslated('testAudio')}</button>
        <span className="small muted" style={{ alignSelf: 'center' }}>
          {getTranslated('audioStr')} {a.voice ? getTranslated('on') : getTranslated('off')} · {getTranslated('textStr')} {a.largeText ? getTranslated('large') : getTranslated('normal')}
        </span>
      </div>
    </KioskShell>
  );
}
