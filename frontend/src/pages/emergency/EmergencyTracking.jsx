import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { VoiceBar } from '../../components/ui';
import { useApp } from '../../context/AppContext';

export default function EmergencyTracking() {
  const { state } = useApp();
  const [tracking, setTracking] = useState(null);
  const [eta, setEta] = useState(4);
  const [mapCoords, setMapCoords] = useState({ lat: 28.56, lng: 77.20 });
  const nav = useNavigate();
  const location = useLocation();
  const symptoms = location.state?.symptoms || '';

  useEffect(() => {
    const fetchDispatch = (lat, lng) => {
      setMapCoords({ lat, lng });
      fetch('/api/emergency/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lat, 
          lng, 
          symptoms,
          patientName: state.patient?.name,
          patientId: state.patient?.uhid
        })
      })
        .then(res => res.json())
        .then(data => setTracking(data));
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchDispatch(pos.coords.latitude, pos.coords.longitude),
        (err) => fetchDispatch(28.56, 77.20) // Fallback to Delhi
      );
    } else {
      fetchDispatch(28.56, 77.20);
    }

    const interval = setInterval(() => {
      setEta(e => (e <= 0 ? 0 : (e - 0.1).toFixed(1)));
    }, 1000);

    return () => clearInterval(interval);
  }, [symptoms]);

  const getTranslated = (key) => {
    const t = {
      stepLabel: { English: 'LIVE TRACKING', 'हिन्दी': 'लाइव ट्रैकिंग', 'ਪੰਜਾਬੀ': 'ਲਾਈਵ ਟਰੈਕਿੰਗ' },
      title: { English: '🚑 Ambulance Dispatched', 'हिन्दी': '🚑 एम्बुलेंस भेज दी गई', 'ਪੰਜਾਬੀ': '🚑 ਐਂਬੂਲੈਂਸ ਭੇਜੀ ਗਈ' },
      voice: { English: 'Ambulance assigned. Live tracking is active. Hospital has received your ETA.', 'हिन्दी': 'एम्बुलेंस असाइन की गई। लाइव ट्रैकिंग सक्रिय है। अस्पताल को आपका ईटीए मिल गया है।', 'ਪੰਜਾਬੀ': 'ਐਂਬੂਲੈਂਸ ਅਸਾਈਨ ਕੀਤੀ ਗਈ। ਲਾਈਵ ਟਰੈਕਿੰਗ ਸਰਗਰਮ ਹੈ। ਹਸਪਤਾਲ ਨੂੰ ਤੁਹਾਡਾ ETA ਮਿਲ ਗਿਆ ਹੈ।' },
      dispatching: { English: 'Dispatching Ambulance...', 'हिन्दी': 'एम्बुलेंस भेजी जा रही है...', 'ਪੰਜਾਬੀ': 'ਐਂਬੂਲੈਂਸ ਭੇਜੀ ਜਾ ਰਹੀ ਹੈ...' },
      detailsTitle: { English: 'Tracking Details', 'हिन्दी': 'ट्रैकिंग विवरण', 'ਪੰਜਾਬੀ': 'ਟਰੈਕਿੰਗ ਵੇਰਵੇ' },
      hospAssigned: { English: 'HOSPITAL ASSIGNED', 'हिन्दी': 'अस्पताल आवंटित', 'ਪੰਜਾਬੀ': 'ਹਸਪਤਾਲ ਨਿਰਧਾਰਤ ਕੀਤਾ ਗਿਆ' },
      isReserved: { English: 'is reserved', 'हिन्दी': 'आरक्षित है', 'ਪੰਜਾਬੀ': 'ਰਾਖਵਾਂ ਹੈ' },
      amb: { English: 'AMBULANCE', 'हिन्दी': 'एम्बुलेंस', 'ਪੰਜਾਬੀ': 'ਐਂਬੂਲੈਂਸ' },
      driver: { English: 'Driver', 'हिन्दी': 'चालक', 'ਪੰਜਾਬੀ': 'ਡਰਾਈਵਰ' },
      etaLabel: { English: 'ESTIMATED TIME OF ARRIVAL', 'हिन्दी': 'आगमन का अनुमानित समय', 'ਪੰਜਾਬੀ': 'ਆਉਣ ਦਾ ਅੰਦਾਜ਼ਨ ਸਮਾਂ' },
      minutes: { English: 'Minutes', 'हिन्दी': 'मिनट', 'ਪੰਜਾਬੀ': 'ਮਿੰਟ' },
      mapTitle: { English: 'Live GPS Map', 'हिन्दी': 'लाइव GPS मानचित्र', 'ਪੰਜਾਬੀ': 'ਲਾਈਵ GPS ਨਕਸ਼ਾ' },
      tipsTitle: { English: 'AI First-Aid Tips', 'हिन्दी': 'AI प्राथमिक चिकित्सा युक्तियाँ', 'ਪੰਜਾਬੀ': 'AI ਫਸਟ-ਏਡ ਸੁਝਾਅ' },
      endSim: { English: 'End Emergency Simulation', 'हिन्दी': 'आपातकालीन सिमुलेशन समाप्त करें', 'ਪੰਜਾਬੀ': 'ਐਮਰਜੈਂਸੀ ਸਿਮੂਲੇਸ਼ਨ ਸਮਾਪਤ ਕਰੋ' }
    };
    return t[key][state.language] || t[key]['English'];
  };

  if (!tracking) return <KioskShell hideNav><div style={{textAlign:'center', marginTop:'50px'}}><h2>{getTranslated('dispatching')}</h2></div></KioskShell>;

  const { hospital, ambulance, tips } = tracking;

  return (
    <KioskShell stepLabel={getTranslated('stepLabel')} title={getTranslated('title')} hideNav>
      <VoiceBar text={getTranslated('voice')} />
      
      <div className="grid cols-2" style={{ gap: '20px', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div className="card ui-3d-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ margin: 0, color: '#b91c1c' }}>{getTranslated('detailsTitle')}</h3>
            
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div className="small muted">{getTranslated('hospAssigned')}</div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{hospital.name}</div>
              <div style={{ color: '#15803d', fontWeight: 'bold' }}>✓ {hospital.ward} {getTranslated('isReserved')}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div className="small muted">{getTranslated('amb')}</div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{ambulance.plate}</div>
              <div>{getTranslated('driver')}: {ambulance.driver} · {ambulance.phone}</div>
            </div>

            <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '8px', border: '1px solid #ef4444' }}>
              <div className="small muted" style={{ color: '#991b1b' }}>{getTranslated('etaLabel')}</div>
              <div style={{ fontWeight: 'bold', fontSize: '32px', color: '#b91c1c' }}>{Math.max(0, Math.ceil(eta))} {getTranslated('minutes')}</div>
            </div>
          </div>

          <div className="card ui-3d-card" style={{ background: '#fffbeb', border: '2px solid #f59e0b' }}>
            <h3 style={{ margin: 0, color: '#b45309', marginBottom: '10px' }}>{getTranslated('tipsTitle')}</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#92400e', lineHeight: '1.5' }}>
              {tips?.map((tip, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>{tip}</li>
              ))}
            </ul>
          </div>

        </div>

        <div className="card ui-3d-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ margin: 0 }}>{getTranslated('mapTitle')}</h3>
          
          <div style={{ flex: 1, background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden', minHeight: '350px' }}>
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight="0" 
              marginWidth="0" 
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCoords.lng-0.03},${mapCoords.lat-0.03},${mapCoords.lng+0.03},${mapCoords.lat+0.03}&layer=mapnik&marker=${mapCoords.lat},${mapCoords.lng}`} 
              style={{ border: 0 }}
            ></iframe>
          </div>
          
          <button className="btn btn-secondary btn-block" onClick={() => nav('/')}>{getTranslated('endSim')}</button>
        </div>
      </div>
    </KioskShell>
  );
}
