import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar } from '../../components/ui';

export default function AbhaMobile() {
  const { patchPatient } = useApp();
  const [val, setVal] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const digits = val.replace(/\D/g, '');
  const press = (d) => { setErr(''); setVal((v) => (v.replace(/\D/g, '') + d).slice(0, 14)); };
  const back = () => setVal((v) => v.replace(/\D/g, '').slice(0, -1));
  const clear = () => { setVal(''); setErr(''); };
  const submit = () => {
    if (digits.length !== 14 && digits.length !== 10) { setErr('Enter a valid 14-digit ABHA or 10-digit mobile number.'); return; }
    if (digits.length === 14) patchPatient({ abha: digits.replace(/(\d{2})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4') });
    else patchPatient({ mobile: '+91 ' + digits.slice(0, 5) + ' ' + digits.slice(5) });
    nav('/checkin/confirm');
  };
  return (
    <KioskShell stepLabel="STEP 1 · CHECK-IN" title="Enter ABHA / Mobile Number" back="/checkin/identify" progress={35} onNext={submit} nextLabel="Continue">
      <VoiceBar text="Type your 14 digit ABHA number or 10 digit mobile number." />
      <div className="grid cols-2">
        <div className="card">
          <div className="field">
            <label>ABHA (14-digit) or Mobile (10-digit)</label>
            <input className={`input mono ${err ? 'invalid' : ''}`} value={digits} onChange={(e) => setVal(e.target.value.replace(/\D/g, '').slice(0, 14))} placeholder="e.g. 91458290123456" inputMode="numeric" />
            {err ? <div className="error">{err}</div> : <div className="small muted" style={{ marginTop: 6 }}>{digits.length}/14 digits · 10 = mobile, 14 = ABHA</div>}
          </div>
          <button className="btn btn-primary btn-block" onClick={submit}>Continue</button>
        </div>
        <div className="card">
          <div className="keypad">
            {['1','2','3','4','5','6','7','8','9'].map((d) => <button key={d} className="key" onClick={() => press(d)}>{d}</button>)}
            <button className="key action" onClick={clear}>Clear</button>
            <button className="key" onClick={() => press('0')}>0</button>
            <button className="key action" onClick={back}>⌫</button>
          </div>
        </div>
      </div>
    </KioskShell>
  );
}
