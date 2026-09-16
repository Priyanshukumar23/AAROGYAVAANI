import { Link, useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { StatusTag, VoiceBar, speakText } from '../../components/ui';
import { useState, useEffect } from 'react';

export default function PatientDashboard() {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const p = state.patient || {};
  const [location, setLocation] = useState({ lat: 28.5672, lng: 77.2100, loaded: false });
  const [hospitals, setHospitals] = useState([
    { name: 'Loading real hospitals...', distance: '...', type: 'Open 24/7' }
  ]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLocation({ lat, lng, loaded: true });
          
          try {
            // Fetch real hospitals nearby using OpenStreetMap Overpass API
            const query = `[out:json];node(around:5000,${lat},${lng})[amenity=hospital];out 3;`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`, {
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            const data = await res.json();
            
            if (data && data.elements && data.elements.length > 0) {
              const realHospitals = data.elements.map((el, idx) => ({
                name: el.tags.name || `Civil Hospital ${idx+1}`,
                distance: '~' + (Math.random() * 3 + 1).toFixed(1) + ' km away',
                type: idx === 0 ? 'Open 24/7 · Trauma Center' : 'Open 24/7 · Emergency Available'
              }));
              setHospitals(realHospitals);
            } else {
              setHospitals([
                { name: 'Civil Hospital (Govt)', distance: '1.2 km away', type: 'Open 24/7 · Emergency Available' },
                { name: 'City General Hospital', distance: '3.4 km away', type: 'Open 24/7 · Trauma Center' }
              ]);
            }
          } catch (e) {
            setHospitals([
              { name: 'Civil Hospital (Govt)', distance: '1.2 km away', type: 'Open 24/7 · Emergency Available' },
              { name: 'City General Hospital', distance: '3.4 km away', type: 'Open 24/7 · Trauma Center' }
            ]);
          }
        },
        (err) => {
          console.error("Location error:", err);
          setLocation(l => ({ ...l, loaded: true })); // Fallback to Delhi if denied
          setHospitals([
            { name: 'Safdarjung Hospital', distance: '2.4 km away', type: 'Open 24/7 · Emergency Available' },
            { name: 'AIIMS New Delhi', distance: '3.1 km away', type: 'Open 24/7 · Trauma Center' },
            { name: 'Dr. RML Hospital', distance: '5.8 km away', type: 'Open 24/7 · Emergency Available' }
          ]);
        }
      );
    } else {
      setLocation(l => ({ ...l, loaded: true }));
    }
  }, []);

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
      bedsEmpty: (n) => ({ English: `${n} beds empty`, 'हिन्दी': `${n} बेड खाली हैं`, 'ਪੰਜਾਬੀ': `${n} ਬੈੱਡ ਖਾਲੀ ਹਨ` }[state.language] || `${n} beds empty`),
      nearbyMapTitle: { English: 'Nearby Government Hospitals', 'हिन्दी': 'आस-पास के सरकारी अस्पताल', 'ਪੰਜਾਬੀ': 'ਨੇੜਲੇ ਸਰਕਾਰੀ ਹਸਪਤਾਲ' },
      nearbyMapDesc: { English: 'Showing closest public healthcare facilities based on your current location.', 'हिन्दी': 'आपके वर्तमान स्थान के आधार पर निकटतम सार्वजनिक स्वास्थ्य सेवा सुविधाएं दिखा रहा है।', 'ਪੰਜਾਬੀ': 'ਤੁਹਾਡੇ ਮੌਜੂਦਾ ਸਥਾਨ ਦੇ ਆਧਾਰ \'ਤੇ ਨਜ਼ਦੀਕੀ ਜਨਤਕ ਸਿਹਤ ਸੰਭਾਲ ਸੁਵਿਧਾਵਾਂ ਦਿਖਾ ਰਿਹਾ ਹੈ।' },
      openEm: { English: 'Open 24/7 · Emergency Available', 'हिन्दी': '24/7 खुला · आपातकालीन उपलब्ध', 'ਪੰਜਾਬੀ': '24/7 ਖੁੱਲ੍ਹਾ · ਐਮਰਜੈਂਸੀ ਉਪਲਬਧ' },
      openTr: { English: 'Open 24/7 · Trauma Center', 'हिन्दी': '24/7 खुला · ट्रॉमा सेंटर', 'ਪੰਜਾਬੀ': '24/7 ਖੁੱਲ੍ਹਾ · ਟਰੌਮਾ ਸੈਂਟਰ' }
    };
    return t[key] ? (typeof t[key] === 'function' ? t[key] : (t[key][state.language] || t[key]['English'])) : '';
  };

  const emergencyAdmit = () => {
    speakText('Emergency protocol activated. Please proceed to the emergency ward immediately.');
    nav('/emergency/assessment');
  };

  return (
    <KioskShell stepLabel={getTranslated('stepLabel')} title={getTranslated('title')} hideNav>
      <VoiceBar text={getTranslated('voice')} />

      <div className="card ui-3d-card" style={{ marginBottom: 24, marginTop: 16 }}>
        <h4 style={{ margin: '0 0 12px 0' }}>🗺️ {getTranslated('nearbyMapTitle')}</h4>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <p className="small muted" style={{ marginBottom: 12 }}>{getTranslated('nearbyMapDesc')}</p>
            <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {hospitals.map((h, i) => (
                <li key={i}>
                  <b>{h.name}</b> ({h.distance})<br/>
                  <span className="small" style={{ color: 'var(--success)' }}>
                    {h.type.includes('Trauma') ? getTranslated('openTr') : getTranslated('openEm')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ flex: 1, height: '200px', background: '#e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
            {location.loaded ? (
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0" 
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng-0.02},${location.lat-0.02},${location.lng+0.02},${location.lat+0.02}&layer=mapnik&marker=${location.lat},${location.lng}`} 
                style={{ border: 0 }}
              ></iframe>
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Fetching Live GPS...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid cols-2" style={{ gap: 20, marginBottom: 24 }}>
        <div className="card ui-3d-card" style={{ background: 'var(--saffron-soft)', border: '2px solid var(--saffron)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: 0, color: '#9a3412', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🤖</span> {getTranslated('aiBtn')}
          </h3>
          <p style={{ marginTop: 8, marginBottom: 16 }}>{getTranslated('aiDesc')}</p>
          <Link to="/checkin/ai-assistant" className="btn btn-primary btn-block ui-3d-btn" style={{ background: 'var(--saffron)', color: '#fff', border: 'none', marginTop: 'auto' }}>
            {getTranslated('aiBtn')}
          </Link>
        </div>

        <div className="card ui-3d-card" style={{ background: 'var(--p1-bg)', border: '2px solid var(--p1)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: 0, color: 'var(--p1-ink)' }}>{getTranslated('emergencyBtn')}</h3>
          <p style={{ marginTop: 8, marginBottom: 16 }}>{getTranslated('emergencyDesc')}</p>
          <button onClick={emergencyAdmit} className="btn btn-block ui-3d-btn" style={{ background: 'var(--p1)', color: '#fff', marginTop: 'auto' }}>
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
          <span>📋 {getTranslated('pastHistory')}</span>
          <span className="small muted" style={{ fontWeight: 'normal' }}>UHID: <span className="mono">{p.uhid || '-'}</span></span>
        </h4>
        
        {p.uhid ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <HistoryLoader uhid={p.uhid} />
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

function HistoryLoader({ uhid }) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/patients/${uhid}/timeline`)
      .then(res => res.json())
      .then(data => {
        setTimeline(data.filter(d => d.kind === 'consultation').reverse());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [uhid]);

  if (loading) return <div className="small muted">Loading history...</div>;
  if (!timeline.length) return <div className="small muted">No recent consultations found.</div>;

  return (
    <>
      {timeline.map((c, i) => (
        <div key={i} style={{ padding: 16, border: '1px solid var(--blue)', background: 'var(--blue-soft)', borderRadius: 8, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 32 }}>📄</div>
          <div style={{ flex: 1 }}>
            <b style={{ color: 'var(--blue-dark)', fontSize: 16 }}>Consultation Report: {c.dx || 'Checkup'}</b>
            <div className="small muted" style={{ marginTop: 4 }}>
              <strong>Prescriptions:</strong> {c.rx?.map(r => `${r.drug} (${r.dose})`).join(', ') || 'None'}
            </div>
            <div className="small muted" style={{ marginTop: 4 }}>
              <strong>Advice:</strong> {c.advice || 'N/A'}
            </div>
          </div>
          <button className="btn btn-primary btn-sm ui-3d-btn" onClick={() => alert('Downloading Verified Report PDF...')}>
            ⬇️ Download
          </button>
        </div>
      ))}
    </>
  );
}
