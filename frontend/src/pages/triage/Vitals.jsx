import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';

const RANGES = { sys: [90, 140], dia: [60, 90], hr: [60, 100], spo2: [95, 100], temp: [97, 99.5], rr: [12, 20], pain: [0, 3] };
const bad = (k, v) => v < RANGES[k][0] || v > RANGES[k][1];

export default function Vitals() {
  const { id = 'A-142' } = useParams();
  const nav = useNavigate();
  const [v, setV] = useState({ sys: 150, dia: 94, hr: 88, spo2: 98, temp: 98.4, rr: 18, pain: 8 });
  const [bt, setBt] = useState(false);
  const set = (k, x) => setV(o => ({ ...o, [k]: Number(x) }));
  const remeasure = () => setV(o => ({ sys: o.sys + (Math.random() * 6 - 3), dia: o.dia + (Math.random() * 4 - 2), hr: Math.round(o.hr + (Math.random() * 6 - 3)), spo2: 97 + Math.round(Math.random() * 2), temp: +(o.temp + (Math.random() * 0.4 - 0.2)).toFixed(1), rr: Math.round(o.rr + (Math.random() * 2 - 1)), pain: o.pain }));
  const cells = [
    ['sys', `BP ${Math.round(v.sys)}/${Math.round(v.dia)}`, bad('sys', v.sys) || bad('dia', v.dia)],
    ['hr', `${v.hr} bpm`, bad('hr', v.hr)],
    ['spo2', `${v.spo2}%`, bad('spo2', v.spo2)],
    ['temp', `${v.temp} °F`, bad('temp', v.temp)],
    ['rr', `${v.rr} /min`, bad('rr', v.rr)],
    ['pain', `${v.pain} /10`, bad('pain', v.pain)],
  ];
  return (
    <StaffShell role="nurse" title={`Vitals · ${id}`} subtitle="Range-checked · NABH early-warning">
      <div className="card" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => { setBt(true); setTimeout(() => setBt(false), 1500); }}>{bt ? '… pairing' : '📶 Bluetooth Connect'}</button>
        {bt && <span className="small muted">Searching for Omron HEM / PulseOx…</span>}
        <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={remeasure}>↻ Re-measure</button>
      </div>
      <div className="card vital-grid" style={{ marginTop: 12 }}>
        <div className={`vital ${bad('sys', v.sys) ? 'warn' : ''}`}>BP Sys<input type="number" className="input staff" value={Math.round(v.sys)} onChange={e => set('sys', e.target.value)} /></div>
        <div className={`vital ${bad('dia', v.dia) ? 'warn' : ''}`}>BP Dia<input type="number" className="input staff" value={Math.round(v.dia)} onChange={e => set('dia', e.target.value)} /></div>
        <div className={`vital ${bad('hr', v.hr) ? 'warn' : ''}`}>HR<input type="number" className="input staff" value={v.hr} onChange={e => set('hr', e.target.value)} /></div>
        <div className={`vital ${bad('spo2', v.spo2) ? 'warn' : ''}`}>SpO2<input type="number" className="input staff" value={v.spo2} onChange={e => set('spo2', e.target.value)} /></div>
        <div className={`vital ${bad('temp', v.temp) ? 'warn' : ''}`}>Temp °F<input type="number" step="0.1" className="input staff" value={v.temp} onChange={e => set('temp', e.target.value)} /></div>
        <div className={`vital ${bad('rr', v.rr) ? 'warn2' : ''}`}>RR<input type="number" className="input staff" value={v.rr} onChange={e => set('rr', e.target.value)} /></div>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        {cells.filter(c => c[2]).map(c => <div key={c[0]} className="alert-banner alert-p2 small" style={{ marginBottom: 6 }}>⚠️ {c[1]} — outside range</div>)}
        {cells.every(c => !c[2]) && <div className="notice">✓ All vitals within range.</div>}
        <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => nav(`/triage/priority/${id}`)}>Save → Assign Priority</button>
      </div>
    </StaffShell>
  );
}
