import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar } from '../../components/ui';

export default function NewRegistration() {
  const { state, patchPatient } = useApp();
  const [f, setF] = useState({ name: state.patient?.name === 'Ramesh Kumar Sharma' ? '' : state.patient?.name || '', age: '', gender: 'Male', mobile: '', state: '', city: '' });
  const [errs, setErrs] = useState({});
  const nav = useNavigate();
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const save = async () => {
    const e = {};
    if (!f.name.trim()) e.name = 'Full name is required.';
    if (!f.age || +f.age < 0 || +f.age > 130) e.age = 'Enter a valid age.';
    if (!/^\d{10}$/.test(f.mobile.replace(/\D/g, '').slice(-10))) e.mobile = 'Enter a valid 10-digit mobile number.';
    if (!f.state.trim()) e.state = 'State is required.';
    if (!f.city.trim()) e.city = 'City is required.';
    setErrs(e);
    if (Object.keys(e).length) return;
    const payload = { name: f.name.trim(), age: +f.age, gender: f.gender, mobile: '+91 ' + f.mobile.replace(/\D/g, '').slice(-10), state: f.state.trim(), city: f.city.trim(), abha: state.patient?.abha || '91-' + Math.floor(1000 + Math.random() * 9000) + '-XXXX-XXXX', uhid: state.patient?.uhid || 'AIIMS-2025-' + Math.floor(1000 + Math.random() * 9000) };
    patchPatient(payload);
    try { await fetch('/api/patients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); } catch {}
    nav('/checkin/confirm');
  };
  return (
    <KioskShell stepLabel="STEP 1 · CHECK-IN" title="New Patient Registration" back="/checkin/identify" progress={40} onNext={save} nextLabel="Save & Continue">
      <VoiceBar text="Fill your details to register. All fields are required." />
      <div className="card">
        <div className="grid cols-2">
          <div className="field"><label>Full name</label><input className={`input ${errs.name ? 'invalid' : ''}`} value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Ramesh Kumar Sharma" />{errs.name && <div className="error">{errs.name}</div>}</div>
          <div className="field"><label>Age</label><input className={`input ${errs.age ? 'invalid' : ''}`} type="number" value={f.age} onChange={(e) => set('age', e.target.value)} placeholder="e.g. 48" />{errs.age && <div className="error">{errs.age}</div>}</div>
        </div>
        <div className="field"><label>Gender</label><div style={{ display: 'flex', gap: 8 }}>{['Male', 'Female', 'Other'].map((g) => <button key={g} type="button" className={`btn ${f.gender === g ? 'btn-primary' : 'btn-secondary'}`} onClick={() => set('gender', g)}>{g}</button>)}</div></div>
        <div className="grid cols-2">
          <div className="field"><label>Mobile (10-digit)</label><input className={`input ${errs.mobile ? 'invalid' : ''}`} value={f.mobile} onChange={(e) => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="98765 43210" inputMode="numeric" />{errs.mobile && <div className="error">{errs.mobile}</div>}</div>
          <div className="field"><label>State</label><input className={`input ${errs.state ? 'invalid' : ''}`} value={f.state} onChange={(e) => set('state', e.target.value)} placeholder="e.g. Delhi" />{errs.state && <div className="error">{errs.state}</div>}</div>
        </div>
        <div className="field"><label>City</label><input className={`input ${errs.city ? 'invalid' : ''}`} value={f.city} onChange={(e) => set('city', e.target.value)} placeholder="e.g. South Delhi" />{errs.city && <div className="error">{errs.city}</div>}</div>
        <button className="btn btn-primary btn-block" onClick={save}>Save & Continue</button>
      </div>
    </KioskShell>
  );
}
