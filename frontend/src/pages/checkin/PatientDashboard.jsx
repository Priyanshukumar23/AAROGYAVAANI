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
      wards: { English: 'Wards & Bed Availability', 'हिन्दी': 'वार्ड और बेड की उपलब्धता', 'ਪੰਜਾਬੀ': 'ਵਾਰਡ ਅਤੇ ਬੈੱਡ ਦੀ ਉਪਲਬਧਤਾ' },
      triggerEmBtn: { English: 'Trigger Emergency', 'हिन्दी': 'आपातकालीन ट्रिगर करें', 'ਪੰਜਾਬੀ': 'ਐਮਰਜੈਂਸੀ ਟਰਿੱਗਰ ਕਰੋ' },
      deptGenMed: { English: 'General Medicine', 'हिन्दी': 'जनरल मेडिसिन', 'ਪੰਜਾਬੀ': 'ਜਨਰਲ ਮੈਡੀਸਨ' },
      drRajesh: { English: 'Dr. Rajesh Sharma, Dr. A. Gupta', 'हिन्दी': 'डॉ. राजेश शर्मा, डॉ. ए. गुप्ता', 'ਪੰਜਾਬੀ': 'ਡਾ. ਰਾਜੇਸ਼ ਸ਼ਰਮਾ, ਡਾ. ਏ. ਗੁਪਤਾ' },
      deptCardio: { English: 'Cardiology', 'हिन्दी': 'कार्डियोलॉजी', 'ਪੰਜਾਬੀ': 'ਕਾਰਡੀਓਲੋਜੀ' },
      drVSen: { English: 'Dr. V. Sen', 'हिन्दी': 'डॉ. वी. सेन', 'ਪੰਜਾਬੀ': 'ਡਾ. ਵੀ. ਸੇਨ' },
      deptOrtho: { English: 'Orthopedics', 'हिन्दी': 'ऑर्थोपेडिक्स', 'ਪੰਜਾਬੀ': 'ਆਰਥੋਪੈਡਿਕਸ' },
      drMAli: { English: 'Dr. M. Ali', 'हिन्दी': 'डॉ. एम. अली', 'ਪੰਜਾਬੀ': 'ਡਾ. ਐਮ. ਅਲੀ' },
      avail: { English: 'Available', 'हिन्दी': 'उपलब्ध', 'ਪੰਜਾਬੀ': 'ਉਪਲਬਧ' },
      busy: { English: 'Busy', 'हिन्दी': 'व्यस्त', 'ਪੰਜਾਬੀ': 'ਰੁੱਝਿਆ ਹੋਇਆ' },
      wardGenMale: { English: 'General Ward (Male)', 'हिन्दी': 'जनरल वार्ड (पुरुष)', 'ਪੰਜਾਬੀ': 'ਜਨਰਲ ਵਾਰਡ (ਪੁਰਸ਼)' },
      wardGenFemale: { English: 'General Ward (Female)', 'हिन्दी': 'जनरल वार्ड (महिला)', 'ਪੰਜਾਬੀ': 'ਜਨਰਲ ਵਾਰਡ (ਮਹਿਲਾ)' },
      wardIcu: { English: 'ICU', 'हिन्दी': 'आईसीयू', 'ਪੰਜਾਬੀ': 'ਆਈ.ਸੀ.ਯੂ.' },
      pastHistory: { English: 'Past Medical History & Reports', 'हिन्दी': 'पिछला चिकित्सा इतिहास और रिपोर्ट', 'ਪੰਜਾਬੀ': 'ਪਿਛਲਾ ਡਾਕਟਰੀ ਇਤਿਹਾਸ ਅਤੇ ਰਿਪੋਰਟਾਂ' },
      report1: { English: 'Blood Test Report - 12 Aug 2025', 'हिन्दी': 'रक्त परीक्षण रिपोर्ट - 12 अगस्त 2025', 'ਪੰਜਾਬੀ': 'ਖੂਨ ਦੀ ਜਾਂਚ ਦੀ ਰਿਪੋਰਟ - 12 ਅਗਸਤ 2025' },
      report2: { English: 'X-Ray (Chest) - 05 Jan 2025', 'हिन्दी': 'एक्स-रे (छाती) - 05 जनवरी 2025', 'ਪੰਜਾਬੀ': 'ਐਕਸ-ਰੇ (ਛਾਤੀ) - 05 ਜਨਵਰੀ 2025' },
      noHistory: { English: 'No past records found for this UHID.', 'हिन्दी': 'इस UHID के लिए कोई पिछला रिकॉर्ड नहीं मिला।', 'ਪੰਜਾਬੀ': 'ਇਸ UHID ਲਈ ਕੋਈ ਪਿਛਲਾ ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲਿਆ।' },
      bedsEmpty: (n) => ({ English: `${n} beds empty`, 'हिन्दी': `${n} बेड खाली हैं`, 'ਪੰਜਾਬੀ': `${n} ਬੈੱਡ ਖਾਲੀ ਹਨ` }[state.language] || `${n} beds empty`)
    };
    return t[key] ? (typeof t[key] === 'function' ? t[key] : (t[key][state.language] || t[key]['English'])) : '';
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
            {getTranslated('triggerEmBtn')}
          </button>
        </div>
      </div>

      <div className="grid cols-2" style={{ gap: 20 }}>
        <div className="card ui-3d-card">
          <h4 style={{ margin: '0 0 12px 0' }}>🏥 {getTranslated('departments')}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <b>{getTranslated('deptGenMed')}</b><br/>
                <span className="small muted">{getTranslated('drRajesh')}</span>
              </div>
              <StatusTag kind="success">{getTranslated('avail')}</StatusTag>
            </div>
            <div style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <b>{getTranslated('deptCardio')}</b><br/>
                <span className="small muted">{getTranslated('drVSen')}</span>
              </div>
              <StatusTag kind="warning">{getTranslated('busy')}</StatusTag>
            </div>
            <div style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <b>{getTranslated('deptOrtho')}</b><br/>
                <span className="small muted">{getTranslated('drMAli')}</span>
              </div>
              <StatusTag kind="success">{getTranslated('avail')}</StatusTag>
            </div>
          </div>
        </div>

        <div className="card ui-3d-card">
          <h4 style={{ margin: '0 0 12px 0' }}>🛏️ {getTranslated('wards')}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <b>{getTranslated('wardGenMale')}</b>
                <span style={{ color: 'var(--blue-dark)', fontWeight: 700 }}>45 / 50</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-rec)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', background: 'var(--blue)' }} />
              </div>
              <div className="small muted" style={{ marginTop: 4 }}>{getTranslated('bedsEmpty')(5)}</div>
            </div>
            <div style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <b>{getTranslated('wardGenFemale')}</b>
                <span style={{ color: 'var(--p2)', fontWeight: 700 }}>48 / 50</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-rec)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '96%', height: '100%', background: 'var(--p2)' }} />
              </div>
              <div className="small muted" style={{ marginTop: 4 }}>{getTranslated('bedsEmpty')(2)}</div>
            </div>
            <div style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <b>{getTranslated('wardIcu')}</b>
                <span style={{ color: 'var(--p1)', fontWeight: 700 }}>18 / 20</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-rec)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', background: 'var(--p1)' }} />
              </div>
              <div className="small muted" style={{ marginTop: 4 }}>{getTranslated('bedsEmpty')(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card ui-3d-card" style={{ marginTop: 24 }}>
        <h4 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>📄 {getTranslated('pastHistory')}</span>
          <span className="small muted" style={{ fontWeight: 'normal' }}>UHID: <span className="mono">{p.uhid || '—'}</span></span>
        </h4>
        
        {p.uhid ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: 12, border: '1px solid var(--blue)', background: 'var(--blue-soft)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div style={{ fontSize: 24 }}>🩸</div>
              <div>
                <b style={{ color: 'var(--blue-dark)' }}>{getTranslated('report1')}</b>
                <div className="small muted">View PDF Report</div>
              </div>
            </div>
            <div style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div style={{ fontSize: 24 }}>🩻</div>
              <div>
                <b>{getTranslated('report2')}</b>
                <div className="small muted">View Scans</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', background: 'var(--bg-rec)', borderRadius: 8 }}>
            {getTranslated('noHistory')}
          </div>
        )}
      </div>
    </KioskShell>
  );
}
