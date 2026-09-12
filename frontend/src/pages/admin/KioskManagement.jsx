import { useEffect, useState } from 'react';
import StaffShell from '../../components/StaffShell';
import { Kpi, Progress, StatusTag } from '../../components/ui';
import { api } from '../../data/api';

const SEED = [
  { id: 'KSK-01', loc: 'OPD Main Gate', step: 'Token', battery: 92, latency: '180ms', paper: 78, status: 'Online' },
  { id: 'KSK-02', loc: 'Casualty Entry', step: 'Vitals', battery: 64, latency: '240ms', paper: 41, status: 'Online' },
  { id: 'KSK-03', loc: 'Pharmacy Wing', step: 'History', battery: 38, latency: '610ms', paper: 18, status: 'Degraded' },
];

export default function KioskManagement() {
  const [kiosks, setKiosks] = useState(SEED);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    api.get('/kiosks').then(d => {
      const list = Array.isArray(d) ? d : d.kiosks;
      if (list?.length) setKiosks(list);
    }).catch(() => {});
  }, []);
  const act = async (id, a) => {
    setMsg(`${a} → ${id} queued…`);
    try { await api.post(`/kiosks/${id}/${a.toLowerCase()}`, {}); setMsg(`${a} → ${id} OK`); } catch { setMsg(`${a} → ${id} (demo, offline OK)`); }
    if (a === 'Reboot') setKiosks(k => k.map(x => x.id === id ? { ...x, status: 'Online', latency: '200ms' } : x));
  };
  const add = () => setKiosks(k => [...k, { id: `KSK-0${k.length + 1}`, loc: 'New Wing · Bay ' + (k.length + 1), step: 'Idle', battery: 100, latency: '120ms', paper: 100, status: 'Online' }]);
  return (
    <StaffShell role="admin" title="Kiosk Fleet" subtitle="Hardware health · remote control · provisioning" actions={<button className="btn btn-blue btn-sm" onClick={add}>+ Add Kiosk</button>}>
      {msg && <div className="notice small" style={{ marginBottom: 10 }}>{msg}</div>}
      <div className="kpi-row"><Kpi v={String(kiosks.length)} l="Total" /><Kpi v={String(kiosks.filter(k => k.status === 'Online').length)} l="Online" /><Kpi v="38%" l="Lowest Battery" sub="KSK-03" /><Kpi v="99.1%" l="Uptime 7d" /></div>
      <div className="split split-2" style={{ marginTop: 12 }}>
        {kiosks.map(k => (
          <div key={k.id} className="card">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><h3 style={{ margin: 0 }}>{k.id}</h3><StatusTag kind={k.status === 'Online' ? 'info' : 'warn'}>{k.status}</StatusTag><span className="small muted" style={{ marginLeft: 'auto' }}>{k.loc} · step: {k.step}</span></div>
            <div className="small" style={{ marginTop: 8 }}>📹 videocam OK · 🎙 mic OK · 🖨 scanner OK</div>
            <div className="small muted" style={{ marginTop: 6 }}>🔋 {k.battery}% · 📶 {k.latency} · 🧾 paper {k.paper}%</div>
            <div style={{ marginTop: 6 }}><Progress value={k.paper} /></div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => act(k.id, 'Ping')}>Ping</button>
              <button className="btn btn-ghost btn-sm" onClick={() => act(k.id, 'Reboot')}>Reboot</button>
              <button className="btn btn-blue btn-sm" onClick={() => act(k.id, 'Control')}>Control</button>
            </div>
          </div>
        ))}
      </div>
    </StaffShell>
  );
}
