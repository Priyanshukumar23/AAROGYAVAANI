import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function PatientProfileModal({ isOpen, onClose }) {
  const { state, patchPatient, resetKiosk } = useApp();
  const nav = useNavigate();
  const p = state.patient || {};
  
  const [f, setF] = useState({ ...p });
  
  useEffect(() => {
    if (isOpen) setF({ ...state.patient });
  }, [isOpen, state.patient]);

  if (!isOpen) return null;

  const save = () => {
    patchPatient(f);
    onClose();
  };

  const logout = () => {
    resetKiosk();
    onClose();
    nav('/');
  };

  const getTranslated = (key) => {
    const t = {
      title: { English: 'Patient Profile', 'हिन्दी': 'मरीज प्रोफाइल', 'ਪੰਜਾਬੀ': 'ਮਰੀਜ਼ ਪ੍ਰੋਫਾਈਲ' },
      fullName: { English: 'Full Name', 'हिन्दी': 'पूरा नाम', 'ਪੰਜਾਬੀ': 'ਪੂਰਾ ਨਾਮ' },
      age: { English: 'Age', 'हिन्दी': 'आयु', 'ਪੰਜਾਬੀ': 'ਉਮਰ' },
      gender: { English: 'Gender', 'हिन्दी': 'लिंग', 'ਪੰਜਾਬੀ': 'ਲਿੰਗ' },
      bloodGroup: { English: 'Blood Group', 'हिन्दी': 'रक्त समूह', 'ਪੰਜਾਬੀ': 'ਬਲੱਡ ਗਰੁੱਪ' },
      mobile: { English: 'Mobile Number', 'हिन्दी': 'मोबाइल नंबर', 'ਪੰਜਾਬੀ': 'ਮੋਬਾਈਲ ਨੰਬਰ' },
      address: { English: 'Address / City', 'हिन्दी': 'पता / शहर', 'ਪੰਜਾਬੀ': 'ਪਤਾ / ਸ਼ਹਿਰ' },
      logoutBtn: { English: 'Logout & Exit', 'हिन्दी': 'लॉगआउट और बाहर निकलें', 'ਪੰਜਾਬੀ': 'ਲੌਗਆਉਟ ਅਤੇ ਬਾਹਰ ਜਾਓ' },
      cancelBtn: { English: 'Cancel', 'हिन्दी': 'रद्द करें', 'ਪੰਜਾਬੀ': 'ਰੱਦ ਕਰੋ' },
      saveBtn: { English: 'Save Changes', 'हिन्दी': 'बदलाव सहेजें', 'ਪੰਜਾਬੀ': 'ਬਦਲਾਅ ਸੇਵ ਕਰੋ' },
      male: { English: 'Male', 'हिन्दी': 'पुरुष', 'ਪੰਜਾਬੀ': 'ਪੁਰਸ਼' },
      female: { English: 'Female', 'हिन्दी': 'महिला', 'ਪੰਜਾਬੀ': 'ਮਹਿਲਾ' },
      other: { English: 'Other', 'हिन्दी': 'अन्य', 'ਪੰਜਾਬੀ': 'ਹੋਰ' },
      unknown: { English: 'Unknown', 'हिन्दी': 'अज्ञात', 'ਪੰਜਾਬੀ': 'ਅਗਿਆਤ' }
    };
    return t[key][state.language] || t[key]['English'];
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fade-in 0.2s ease-out' }}>
      <div className="card ui-3d-card" style={{ width: 480, maxWidth: '90vw', padding: 24, animation: 'slide-up 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: 'var(--blue-dark)' }}>👤 {getTranslated('title')}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '4px 8px' }}>✕</button>
        </div>
        
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="field">
            <label className="small" style={{ fontWeight: 600 }}>{getTranslated('fullName')}</label>
            <input className="input" value={f.name || ''} onChange={e => setF({...f, name: e.target.value})} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="field" style={{ flex: 1 }}>
              <label className="small" style={{ fontWeight: 600 }}>{getTranslated('age')}</label>
              <input className="input" type="number" value={f.age || ''} onChange={e => setF({...f, age: e.target.value})} />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="small" style={{ fontWeight: 600 }}>{getTranslated('gender')}</label>
              <select className="input" value={f.gender || ''} onChange={e => setF({...f, gender: e.target.value})}>
                <option value="Male">{getTranslated('male')}</option>
                <option value="Female">{getTranslated('female')}</option>
                <option value="Other">{getTranslated('other')}</option>
              </select>
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="small" style={{ fontWeight: 600 }}>{getTranslated('bloodGroup')}</label>
              <select className="input" value={f.bloodGroup || ''} onChange={e => setF({...f, bloodGroup: e.target.value})}>
                <option value="">{getTranslated('unknown')}</option>
                <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label className="small" style={{ fontWeight: 600 }}>{getTranslated('mobile')}</label>
            <input className="input" value={f.mobile || ''} onChange={e => setF({...f, mobile: e.target.value})} />
          </div>
          <div className="field">
            <label className="small" style={{ fontWeight: 600 }}>{getTranslated('address')}</label>
            <input className="input" value={f.city || ''} onChange={e => setF({...f, city: e.target.value})} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
          <button className="btn btn-ghost" style={{ color: 'var(--p1)' }} onClick={logout}>🚪 {getTranslated('logoutBtn')}</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={onClose}>{getTranslated('cancelBtn')}</button>
            <button className="btn btn-primary" onClick={save}>{getTranslated('saveBtn')}</button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
