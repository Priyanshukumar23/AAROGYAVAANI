import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar } from '../../components/ui';

export default function PastHistory() {
  const { state, patchIntake } = useApp();
  const prev = state.intake?.pastHistory || {};
  const [conds, setConds] = useState(prev.conds || ['Hypertension']);
  const [meds, setMeds] = useState(prev.meds || '');
  const [allergies, setAllergies] = useState(prev.allergies || 'Penicillin');
  const [smoke, setSmoke] = useState(prev.smoke || 'No');
  const [alcohol, setAlcohol] = useState(prev.alcohol || 'No');
  const nav = useNavigate();
  const toggle = (c) => setConds((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  const save = () => { patchIntake({ pastHistory: { conds, meds, allergies, smoke, alcohol } }); nav('/history/review'); };
  const radio = (v, setV) => ['No', 'Yes', 'Quit'].map((o) => {
    const label = state.language === 'हिन्दी' ? (o === 'No' ? 'नहीं' : o === 'Yes' ? 'हाँ' : 'छोड़ दिया') : o;
    return <button key={o} type="button" className={`btn btn-sm ${v === o ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setV(o)}>{label}</button>;
  });

  const getTranslated = (key) => {
    const t = {
      stepLabel: { English: 'STEP 2 · CLINICAL HISTORY', 'हिन्दी': 'चरण 2 · नैदानिक इतिहास', 'ਪੰਜਾਬੀ': 'ਕਦਮ 2 · ਕਲੀਨਿਕਲ ਇਤਿਹਾਸ' },
      title: { English: 'Past Medical History', 'हिन्दी': 'पिछला चिकित्सा इतिहास', 'ਪੰਜਾਬੀ': 'ਪਿਛਲਾ ਡਾਕਟਰੀ ਇਤਿਹਾਸ' },
      voice: { English: 'Tell us about long-term conditions, medicines and allergies.', 'हिन्दी': 'हमें दीर्घकालिक स्थितियों, दवाओं और एलर्जी के बारे में बताएं।', 'ਪੰਜਾਬੀ': 'ਸਾਨੂੰ ਲੰਬੇ ਸਮੇਂ ਦੀਆਂ ਸਥਿਤੀਆਂ, ਦਵਾਈਆਂ ਅਤੇ ਐਲਰਜੀ ਬਾਰੇ ਦੱਸੋ।' },
      condsLabel: { English: 'Conditions (tap all that apply)', 'हिन्दी': 'स्थितियाँ (लागू होने वाले सभी पर टैप करें)', 'ਪੰਜਾਬੀ': 'ਸਥਿਤੀਆਂ (ਜੋ ਲਾਗੂ ਹੁੰਦੀਆਂ ਹਨ)' },
      medsLabel: { English: 'Current medications', 'हिन्दी': 'वर्तमान दवाएं', 'ਪੰਜਾਬੀ': 'ਮੌਜੂਦਾ ਦਵਾਈਆਂ' },
      allergiesLabel: { English: 'Allergies', 'हिन्दी': 'एलर्जी', 'ਪੰਜਾਬੀ': 'ਐਲਰਜੀ' },
      smokeLabel: { English: 'Smoking?', 'हिन्दी': 'धूम्रपान?', 'ਪੰਜਾਬੀ': 'ਸਿਗਰਟਨੋਸ਼ੀ?' },
      alcoholLabel: { English: 'Alcohol?', 'हिन्दी': 'शराब?', 'ਪੰਜਾਬੀ': 'ਸ਼ਰਾਬ?' },
      saveBtn: { English: 'Save & Review', 'हिन्दी': 'सहेजें और समीक्षा करें', 'ਪੰਜਾਬੀ': 'ਸੇਵ ਕਰੋ ਅਤੇ ਸਮੀਖਿਆ ਕਰੋ' }
    };
    return t[key][state.language] || t[key]['English'];
  };

  const CONDS = {
    'Hypertension': { English: 'Hypertension', 'हिन्दी': 'उच्च रक्तचाप', 'ਪੰਜਾਬੀ': 'ਹਾਈਪਰਟੈਨਸ਼ਨ' },
    'Diabetes': { English: 'Diabetes', 'हिन्दी': 'मधुमेह', 'ਪੰਜਾਬੀ': 'ਸ਼ੂਗਰ' },
    'Asthma': { English: 'Asthma', 'हिन्दी': 'अस्थमा', 'ਪੰਜਾਬੀ': 'ਦਮਾ' },
    'Heart disease': { English: 'Heart disease', 'हिन्दी': 'हृदय रोग', 'ਪੰਜਾਬੀ': 'ਦਿਲ ਦੀ ਬਿਮਾਰੀ' },
    'Thyroid': { English: 'Thyroid', 'हिन्दी': 'थायराइड', 'ਪੰਜਾਬੀ': 'ਥਾਇਰਾਇਡ' },
    'Kidney disease': { English: 'Kidney disease', 'हिन्दी': 'गुर्दे की बीमारी', 'ਪੰਜਾਬੀ': 'ਗੁਰਦੇ ਦੀ ਬਿਮਾਰੀ' },
    'None': { English: 'None', 'हिन्दी': 'कोई नहीं', 'ਪੰਜਾਬੀ': 'ਕੋਈ ਨਹੀਂ' }
  };

  return (
    <KioskShell stepLabel={getTranslated('stepLabel')} title={getTranslated('title')} back="/history/details" progress={88} onNext={save} nextLabel={getTranslated('saveBtn')}>
      <VoiceBar text={getTranslated('voice')} />
      <div className="card">
        <div className="field">
          <label>{getTranslated('condsLabel')}</label>
          <div className="grid cols-3">
            {Object.keys(CONDS).map((c) => (
              <label key={c} className="checkrow">
                <input type="checkbox" checked={conds.includes(c)} onChange={() => toggle(c)} />
                {CONDS[c][state.language] || c}
              </label>
            ))}
          </div>
        </div>
        <div className="field"><label>{getTranslated('medsLabel')}</label><textarea className="textarea" value={meds} onChange={(e) => setMeds(e.target.value)} rows={2} /></div>
        <div className="field"><label>{getTranslated('allergiesLabel')}</label><textarea className="textarea" value={allergies} onChange={(e) => setAllergies(e.target.value)} rows={2} /></div>
        <div className="grid cols-2">
          <div className="field"><label>{getTranslated('smokeLabel')}</label><div style={{ display: 'flex', gap: 8 }}>{radio(smoke, setSmoke)}</div></div>
          <div className="field"><label>{getTranslated('alcoholLabel')}</label><div style={{ display: 'flex', gap: 8 }}>{radio(alcohol, setAlcohol)}</div></div>
        </div>
        <button className="btn btn-primary btn-block" onClick={save}>{getTranslated('saveBtn')}</button>
      </div>
    </KioskShell>
  );
}
