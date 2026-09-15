import { Link, useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { StatusTag, VoiceBar, speakText } from '../../components/ui';

export default function PatientDashboard() {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const p = state.patient || {};

  const getTranslated = (key) => {
    const t = {
      stepLabel: { English: 'DASHBOARD', 'हिन्दी': 'डैशबोर्ड', 'ਪੰਜਾਬੀ': 'ਡੈਸ਼ਬੋਰਡ' },
      title: { English: `Welcome, ${p.name?.split(' ')[0] || 'Patient'}`, 'हिन्दी': `नमस्ते, ${p.name?.split(' ')[0] || 'मरीज'}`, 'ਪੰਜਾਬੀ': `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ, ${p.name?.split(' ')[0] || 'ਮਰੀਜ਼'}` },
      voice: { English: 'Welcome to your dashboard. Select a department, view bed availability, or talk to our AI Assistant for guidance.', 'हिन्दी': 'आपके डैशबोर्ड में आपका स्वागत है। कोई विभाग चुनें, बेड की उपलब्धता देखें, या मार्गदर्शन के लिए हमारे AI असिस्टेंट से बात करें।', 'ਪੰਜਾਬੀ': 'ਤੁਹਾਡੇ ਡੈਸ਼ਬੋਰਡ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਇੱਕ ਵਿਭਾਗ ਚੁਣੋ, ਬੈੱਡ ਦੀ ਉਪਲਬਧਤਾ ਦੇਖੋ, ਜਾਂ ਮਾਰਗਦਰਸ਼ਨ ਲਈ ਸਾਡੇ AI ਸਹਾਇਕ ਨਾਲ ਗੱਲ ਕਰੋ।' },
      aiBtn: { English: 'Talk to AI Assistant', 'हिन्दी': 'AI असिस्टेंट से बात करें', 'ਪੰਜਾਬੀ': 'AI ਸਹਾਇਕ ਨਾਲ ਗੱਲ ਕਰੋ' },
      aiDesc: { English: 'Not sure who to see? Let our AI diagnose your symptoms and guide you.', 'हिन्दी': 'सुनिश्चित नहीं हैं कि किससे मिलना है? हमारे AI को आपके लक्षणों का निदान करने दें।', 'ਪੰਜਾਬੀ': 'ਯਕੀਨ ਨਹੀਂ ਹੈ ਕਿ ਕਿਸਨੂੰ ਦੇਖਣਾ ਹੈ? ਸਾਡੇ AI ਨੂੰ ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਦਾ ਨਿਦਾਨ ਕਰਨ ਦਿਓ।' },
      emergencyBtn: { English: '🚨 EMERGENCY / RED FLAG', 'हिन्दी': '🚨 आपातकालीन', 'ਪੰਜਾਬੀ': '🚨 ਐਮਰਜੈਂਸੀ' },
      emergencyDesc: { English: 'Instant admission. 3 ICU Beds available.', 'हिन्दी': 'तत्काल प्रवेश। 3 ICU बेड उपलब्ध हैं।', 'ਪੰਜਾਬੀ': 'ਤੁਰੰਤ ਦਾਖਲਾ। 3 ICU ਬੈੱਡ ਉਪਲਬਧ ਹਨ।' },
      departments: { English: 'Departments & Doctors', 'हिन्दी': 'विभाग और डॉक्टर', 'ਪੰਜਾਬੀ': 'ਵਿਭਾਗ ਅਤੇ ਡਾਕਟਰ' },
      wards: { English: 'Wards & Bed Availability', 'हिन्दी': 'वार्ड और बेड की उपलब्धता', 'ਪੰਜਾਬੀ': 'ਵਾਰਡ ਅਤੇ ਬੈੱਡ ਦੀ ਉਪਲਬਧਤਾ' }
    };
    return t[key][state.language] || t[key]['English'];
  };

  const emergencyAdmit = () => {
    speakText('Emergency protocol activated. Please proceed to the emergency ward immediately.');
    nav('/history/red-flag');
  };

  return (
    <KioskShell stepLabel={getTranslated('stepLabel')} title={getTranslated('title')} hideNav>
      <VoiceBar text={getTranslated('voice')} />

      <div className="grid cols-2" style={{ gap: 20, marginBottom: 24 }}>
        <div className="card ui-3d-card" style={{ background: 'var(--saffron-soft)', border: '2px solid var(--saffron)' }}>
          <h3 style={{ margin: 0, color: '#9a3412', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🤖</span> {getTranslated('aiBtn')}
          </h3>
          <p style={{ marginTop: 8, marginBottom: 16 }}>{getTranslated('aiDesc')}</p>
          <Link to="/checkin/ai-assistant" className="btn btn-primary btn-block ui-3d-btn" style={{ background: 'var(--saffron)', color: '#fff', border: 'none' }}>
            {getTranslated('aiBtn')}
          </Link>
        </div>

        <div className="card ui-3d-card" style={{ background: 'var(--p1-bg)', border: '2px solid var(--p1)' }}>
          <h3 style={{ margin: 0, color: 'var(--p1-ink)' }}>{getTranslated('emergencyBtn')}</h3>
          <p style={{ marginTop: 8, marginBottom: 16 }}>{getTranslated('emergencyDesc')}</p>
          <button onClick={emergencyAdmit} className="btn btn-block ui-3d-btn" style={{ background: 'var(--p1)', color: '#fff' }}>
            Trigger Emergency
          </button>
        </div>
      </div>

      <div className="grid cols-2" style={{ gap: 20 }}>
        <div className="card ui-3d-card">
          <h4 style={{ margin: '0 0 12px 0' }}>🏥 {getTranslated('departments')}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <b>General Medicine</b><br/>
                <span className="small muted">Dr. Rajesh Sharma, Dr. A. Gupta</span>
              </div>
              <StatusTag kind="success">Available</StatusTag>
            </div>
            <div style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <b>Cardiology</b><br/>
                <span className="small muted">Dr. V. Sen</span>
              </div>
              <StatusTag kind="warning">Busy</StatusTag>
            </div>
            <div style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <b>Orthopedics</b><br/>
                <span className="small muted">Dr. M. Ali</span>
              </div>
              <StatusTag kind="success">Available</StatusTag>
            </div>
          </div>
        </div>

        <div className="card ui-3d-card">
          <h4 style={{ margin: '0 0 12px 0' }}>🛏️ {getTranslated('wards')}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <b>General Ward (Male)</b>
                <span style={{ color: 'var(--blue-dark)', fontWeight: 700 }}>45 / 50</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-rec)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', background: 'var(--blue)' }} />
              </div>
              <div className="small muted" style={{ marginTop: 4 }}>5 beds empty</div>
            </div>
            <div style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <b>General Ward (Female)</b>
                <span style={{ color: 'var(--p2)', fontWeight: 700 }}>48 / 50</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-rec)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '96%', height: '100%', background: 'var(--p2)' }} />
              </div>
              <div className="small muted" style={{ marginTop: 4 }}>2 beds empty</div>
            </div>
            <div style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <b>ICU</b>
                <span style={{ color: 'var(--p1)', fontWeight: 700 }}>18 / 20</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-rec)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', background: 'var(--p1)' }} />
              </div>
              <div className="small muted" style={{ marginTop: 4 }}>2 beds empty</div>
            </div>
          </div>
        </div>
      </div>
    </KioskShell>
  );
}
