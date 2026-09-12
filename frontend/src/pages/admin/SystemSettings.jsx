import { useState } from 'react';
import StaffShell from '../../components/StaffShell';
import { StatusTag } from '../../components/ui';

const KEY = 'medikiosk_admin_settings';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };

export default function SystemSettings() {
  const [s, setS] = useState({
    facility: 'AIIMS New Delhi', hfr: 'HFR-DEL-000142', shifts: 'Morning 8–2 · Evening 2–8',
    lang: 'English', timeout: '90', voice: true,
    abdm: true, fhir: true, esign: true,
    retention: '7 years (NABH)', p1sla: '5', spo2: '94', hr: '120', ...load(),
  });
  const set = (k, v) => setS(x => ({ ...x, [k]: v }));
  const save = () => { localStorage.setItem(KEY, JSON.stringify(s)); alert('Settings saved ✓ (localStorage)'); };
  const sync = () => alert('ABDM / FHIR sync triggered ✓ (demo)');
  return (
    <StaffShell role="admin" title="System & Compliance" subtitle="Institution · kiosk UX · ABDM/FHIR · thresholds" actions={<button className="btn btn-blue btn-sm" onClick={save}>Save All</button>}>
      <div className="split split-2">
        <div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Institutional Profile</h3>
            <div className="field"><label>Facility</label><input className="input staff" value={s.facility} onChange={e => set('facility', e.target.value)} /></div>
            <div className="field"><label>HFR ID</label><input className="input staff" value={s.hfr} onChange={e => set('hfr', e.target.value)} /></div>
            <div className="field"><label>OPD Shifts</label><input className="input staff" value={s.shifts} onChange={e => set('shifts', e.target.value)} /></div>
          </div>
          <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Kiosk UX Defaults</h3>
            <div className="field"><label>Default language</label><select className="input staff" value={s.lang} onChange={e => set('lang', e.target.value)}>{['English', 'हिन्दी', 'தமிழ்', 'తెలుగు', 'বাংলা'].map(l => <option key={l}>{l}</option>)}</select></div>
            <div className="field"><label>Session timeout (sec)</label><input className="input staff" value={s.timeout} onChange={e => set('timeout', e.target.value)} /></div>
            <label className="small"><input type="checkbox" checked={s.voice} onChange={e => set('voice', e.target.checked)} /> Voice guidance on by default</label>
          </div>
          <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Data Retention</h3>
            <div className="field"><label>Retention policy</label><select className="input staff" value={s.retention} onChange={e => set('retention', e.target.value)}><option>3 years</option><option>7 years (NABH)</option><option>10 years (MLC)</option></select></div>
          </div>
        </div>
        <div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>ABDM / FHIR <StatusTag kind="info">connected</StatusTag></h3>
            {[['abdm', 'ABDM gateway'], ['fhir', 'FHIR R4 sync'], ['esign', 'E-sign (doctors)']].map(([k, l]) => (
              <div key={k} style={{ padding: '4px 0' }}><label className="small"><input type="checkbox" checked={s[k]} onChange={e => set(k, e.target.checked)} /> {l}</label></div>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={sync} style={{ marginTop: 8 }}>🔄 Sync Now</button>
          </div>
          <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Emergency Thresholds</h3>
            <div className="field"><label>P1 SLA (mins)</label><input className="input staff" value={s.p1sla} onChange={e => set('p1sla', e.target.value)} /></div>
            <div className="field"><label>SpO2 cutoff (%)</label><input className="input staff" value={s.spo2} onChange={e => set('spo2', e.target.value)} /></div>
            <div className="field"><label>HR cutoff (bpm)</label><input className="input staff" value={s.hr} onChange={e => set('hr', e.target.value)} /></div>
            <button className="btn btn-blue btn-sm" onClick={save}>Save Thresholds</button>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
