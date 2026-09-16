import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { VoiceBar } from '../../components/ui';
import { useApp } from '../../context/AppContext';

export default function EmergencyAssessment() {
  const { state } = useApp();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isOcr, setIsOcr] = useState(false);
  const nav = useNavigate();
  const fileInputRef = useRef(null);

  const analyze = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/emergency/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms })
      });
      const data = await res.json();
      setLoading(false);
      setResult(data.isEmergency ? 'emergency' : 'normal');
      
      if (data.isEmergency) {
        setTimeout(() => nav('/emergency/tracking', { state: { symptoms } }), 2000);
      } else {
        setTimeout(() => nav('/checkin/language'), 3500);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = state.language === 'हिन्दी' ? 'hi-IN' : state.language === 'ਪੰਜਾਬੀ' ? 'pa-IN' : 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSymptoms(prev => prev + (prev ? ' ' : '') + transcript);
    };
    recognition.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsOcr(true);
    
    // Simulate AI OCR processing
    setTimeout(() => {
      const mockOcrText = `[Attached Report Data: Blood Pressure 180/110 mmHg, Heart Rate 112 bpm, SpO2 91%. Past History of severe asthma.]`;
      setSymptoms(prev => prev + (prev ? '\n\n' : '') + mockOcrText);
      setIsOcr(false);
    }, 2500);
  };

  const getTranslated = (key) => {
    const t = {
      stepLabel: { English: 'EMERGENCY ASSESSMENT', 'हिन्दी': 'आपातकालीन मूल्यांकन', 'ਪੰਜਾਬੀ': 'ਐਮਰਜੈਂਸੀ ਮੁਲਾਂਕਣ' },
      title: { English: 'AI Emergency Triage', 'हिन्दी': 'AI आपातकालीन ट्राइएज', 'ਪੰਜਾਬੀ': 'AI ਐਮਰਜੈਂਸੀ ਟਰਾਈਏਜ' },
      voice: { English: 'Please describe your emergency or symptoms in a few words.', 'हिन्दी': 'कृपया कुछ शब्दों में अपनी आपात स्थिति या लक्षणों का वर्णन करें।', 'ਪੰਜਾਬੀ': 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਐਮਰਜੈਂਸੀ ਜਾਂ ਲੱਛਣਾਂ ਦਾ ਕੁਝ ਸ਼ਬਦਾਂ ਵਿੱਚ ਵਰਣਨ ਕਰੋ।' },
      whatIs: { English: 'What is the emergency?', 'हिन्दी': 'आपात स्थिति क्या है?', 'ਪੰਜਾਬੀ': 'ਐਮਰਜੈਂਸੀ ਕੀ ਹੈ?' },
      example: { English: 'Example: "Severe chest pain", "Difficulty breathing", "Bleeding"', 'हिन्दी': 'उदाहरण: "गंभीर सीने में दर्द", "सांस लेने में कठिनाई", "खून बहना"', 'ਪੰਜਾਬੀ': 'ਉਦਾਹਰਨ: "ਛਾਤੀ ਵਿੱਚ ਭਾਰੀ ਦਰਦ", "ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ", "ਖੂਨ ਵਗਣਾ"' },
      placeholder: { English: 'Type symptoms here...', 'हिन्दी': 'यहाँ लक्षण टाइप करें...', 'ਪੰਜਾਬੀ': 'ਇੱਥੇ ਲੱਛਣ ਟਾਈਪ ਕਰੋ...' },
      cancel: { English: 'Cancel', 'हिन्दी': 'रद्द करें', 'ਪੰਜਾਬੀ': 'ਰੱਦ ਕਰੋ' },
      analyzeBtn: { English: 'Analyze Symptoms', 'हिन्दी': 'लक्षणों का विश्लेषण करें', 'ਪੰਜਾਬੀ': 'ਲੱਛਣਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ' },
      analyzing: { English: 'Analyzing...', 'हिन्दी': 'विश्लेषण किया जा रहा है...', 'ਪੰਜਾਬੀ': 'ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...' },
      speakBtn: { English: 'Speak', 'हिन्दी': 'बोलें', 'ਪੰਜਾਬੀ': 'ਬੋਲੋ' },
      listening: { English: 'Listening...', 'हिन्दी': 'सुन रहा है...', 'ਪੰਜਾਬੀ': 'ਸੁਣ ਰਿਹਾ ਹੈ...' },
      attachBtn: { English: 'Attach Report (OCR)', 'हिन्दी': 'रिपोर्ट संलग्न करें (OCR)', 'ਪੰਜਾਬੀ': 'ਰਿਪੋਰਟ ਨੱਥੀ ਕਰੋ (OCR)' },
      scanning: { English: 'Scanning OCR...', 'हिन्दी': 'OCR स्कैन कर रहा है...', 'ਪੰਜਾਬੀ': 'OCR ਸਕੈਨ ਕਰ ਰਿਹਾ ਹੈ...' },
      emDetected: { English: '🚨 Emergency Detected', 'हिन्दी': '🚨 आपात स्थिति का पता चला', 'ਪੰਜਾਬੀ': '🚨 ਐਮਰਜੈਂਸੀ ਦਾ ਪਤਾ ਲੱਗਾ' },
      locating: { English: 'Locating nearest hospital and dispatching ambulance...', 'हिन्दी': 'निकटतम अस्पताल का पता लगा रहा है और एम्बुलेंस भेज रहा है...', 'ਪੰਜਾਬੀ': 'ਨਜ਼ਦੀਕੀ ਹਸਪਤਾਲ ਲੱਭ ਰਿਹਾ ਹੈ ਅਤੇ ਐਂਬੂਲੈਂਸ ਭੇਜ ਰਿਹਾ ਹੈ...' },
      redirectingTracking: { English: 'Please wait, you are being redirected to the live tracking dashboard.', 'हिन्दी': 'कृपया प्रतीक्षा करें, आपको लाइव ट्रैकिंग डैशबोर्ड पर अनुप्रेषित किया जा रहा है।', 'ਪੰਜਾਬੀ': 'ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ, ਤੁਹਾਨੂੰ ਲਾਈਵ ਟਰੈਕਿੰਗ ਡੈਸ਼ਬੋਰਡ \'ਤੇ ਰੀਡਾਇਰੈਕਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ।' },
      nonEm: { English: 'Non-Emergency Condition', 'हिन्दी': 'गैर-आपातकालीन स्थिति', 'ਪੰਜਾਬੀ': 'ਗੈਰ-ਐਮਰਜੈਂਸੀ ਸਥਿਤੀ' },
      notRequired: { English: 'Based on your symptoms, this does not require an immediate ambulance.', 'हिन्दी': 'आपके लक्षणों के आधार पर, इसके लिए तत्काल एम्बुलेंस की आवश्यकता नहीं है।', 'ਪੰਜਾਬੀ': 'ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਦੇ ਆਧਾਰ \'ਤੇ, ਇਸ ਲਈ ਤੁਰੰਤ ਐਂਬੂਲੈਂਸ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।' },
      redirectingNormal: { English: 'Redirecting you to the normal patient check-in flow...', 'हिन्दी': 'आपको सामान्य रोगी चेक-इन प्रवाह पर अनुप्रेषित किया जा रहा है...', 'ਪੰਜਾਬੀ': 'ਤੁਹਾਨੂੰ ਆਮ ਮਰੀਜ਼ ਚੈੱਕ-ਇਨ ਪ੍ਰਵਾਹ ਵੱਲ ਰੀਡਾਇਰੈਕਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...' }
    };
    return t[key][state.language] || t[key]['English'];
  };

  return (
    <KioskShell stepLabel={getTranslated('stepLabel')} title={getTranslated('title')} hideNav>
      <VoiceBar text={getTranslated('voice')} />
      
      {!result ? (
        <div className="card ui-3d-card" style={{ borderColor: '#ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#b91c1c', margin: 0 }}>{getTranslated('whatIs')}</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className={`btn btn-sm ${isListening ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={startListening}
                style={isListening ? { background: '#ef4444', borderColor: '#ef4444', color: 'white' } : {}}
              >
                🎤 {isListening ? getTranslated('listening') : getTranslated('speakBtn')}
              </button>
              <input 
                type="file" 
                accept="image/*,.pdf" 
                style={{ display: 'none' }} 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
              />
              <button 
                className="btn btn-sm btn-secondary" 
                onClick={() => fileInputRef.current.click()}
                disabled={isOcr}
              >
                📎 {isOcr ? getTranslated('scanning') : getTranslated('attachBtn')}
              </button>
            </div>
          </div>
          <p style={{ marginTop: '10px' }}>{getTranslated('example')}</p>
          <textarea 
            className="input" 
            style={{ minHeight: '120px', fontSize: '18px' }}
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
            placeholder={getTranslated('placeholder')}
            disabled={loading || isOcr}
          />
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-secondary btn-block" 
              onClick={() => nav('/')}
              disabled={loading}
            >
              {getTranslated('cancel')}
            </button>
            <button 
              className="btn btn-primary btn-block" 
              style={{ background: '#ef4444', borderColor: '#b91c1c' }}
              onClick={analyze}
              disabled={loading || isOcr}
            >
              {loading ? getTranslated('analyzing') : getTranslated('analyzeBtn')}
            </button>
          </div>
        </div>
      ) : result === 'emergency' ? (
        <div className="card ui-3d-card" style={{ background: '#fee2e2', border: '2px solid #ef4444', textAlign: 'center' }}>
          <h2 style={{ color: '#b91c1c' }}>{getTranslated('emDetected')}</h2>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{getTranslated('locating')}</p>
          <p>{getTranslated('redirectingTracking')}</p>
        </div>
      ) : (
        <div className="card ui-3d-card" style={{ background: '#dcfce7', border: '2px solid #22c55e', textAlign: 'center' }}>
          <h2 style={{ color: '#15803d' }}>{getTranslated('nonEm')}</h2>
          <p style={{ fontSize: '18px' }}>{getTranslated('notRequired')}</p>
          <p>{getTranslated('redirectingNormal')}</p>
        </div>
      )}
    </KioskShell>
  );
}
