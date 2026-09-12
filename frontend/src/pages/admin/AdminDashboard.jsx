import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { Kpi, StatusTag } from '../../components/ui';
import { MOCK_QUEUE } from '../../data/mock';
import { api } from '../../data/api';

const FALLBACK_KIOSKS = [
  { id: 'KSK-01', loc: 'OPD Main Gate', status: 'Online', battery: 92, latency: '180ms', paper: 78, step: 'Token' },
  { id: 'KSK-02', loc: 'Casualty Entry', status: 'Online', battery: 64, latency: '240ms', paper: 41, step: 'Vitals' },
  { id: 'KSK-03', loc: 'Pharmacy Wing', status: 'Degraded', battery: 38, latency: '610ms', paper: 18, step: 'History' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [kiosks, setKiosks] = useState(FALLBACK_KIOSKS);
  useEffect(() => {
    api.get('/analytics').then(d => setStats(d)).catch(() => {});
    api.get('/kiosks').then(d => {
      const list = Array.isArray(d) ? d : d.kiosks;
      if (list?.length) setKiosks(list);
    }).catch(() => {});
  }, []);
  return (
    <StaffShell role="admin" title="Facility LIVE · AIIMS New Delhi" subtitle="Hospital command center · ABDM synced · NABH audited">
      <div className="alert-banner alert-p1">🚨 P1 STAT — <strong>A-142 Ramesh K. Sharma</strong> · chest pain + HTN 150/94 · Room 104 · SLA 04:12 · <Link to="/admin/alerts" style={{ color: '#fff', fontWeight: 800 }}>Open Alert Center →</Link></div>
      <div className="kpi-row" style={{ marginTop: 12 }}>
        <Kpi v={stats?.kiosks || '8/8'} l="Kiosks Live" sub="fleet online" />
        <Kpi v={stats?.checkedIn || '642'} l="Checked-in" sub="today" />
        <Kpi v={stats?.waiting || '184'} l="Waiting" sub="all OPDs" />
        <Kpi v="32/36" l="Physicians" sub="on duty" />
        <Kpi v="3" l="STAT" sub="P1 active" />
        <Kpi v="99.98%" l="ABDM Sync" sub="FHIR R4" />
      </div>
      <div className="split split-2" style={{ marginTop: 12 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Kiosk Fleet <StatusTag kind="info">{kiosks.length} units</StatusTag></h3>
          <div className="table-wrap"><table className="tbl">
            <thead><tr><th>ID</th><th>Status</th><th>Battery</th><th>Latency</th><th>Paper</th></tr></thead>
            <tbody>{kiosks.slice(0, 3).map(k => (
              <tr key={k.id}><td><strong>{k.id}</strong><br /><span className="small muted">{k.loc || k.step}</span></td>
                <td><StatusTag kind={k.status === 'Online' ? 'info' : 'warn'}>{k.status}</StatusTag></td>
                <td>{k.battery}%</td><td>{k.latency}</td><td>{k.paper}%</td></tr>
            ))}</tbody></table></div>
          <Link className="btn btn-ghost btn-sm" to="/admin/kiosks" style={{ marginTop: 8 }}>Manage Fleet →</Link>
        </div>
        <div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Priority Queue <span className="tag tag-neutral">{MOCK_QUEUE.length} live</span></h3>
            {MOCK_QUEUE.slice(0, 4).map(t => (
              <div key={t.tokenNo} className="queue-item"><span><strong>{t.tokenNo}</strong> {t.name}<br /><span className="small muted">{t.complaint}</span></span><span className={`tag ${t.priority === 'P1' ? 'tag-p1' : t.priority === 'P2' ? 'tag-p2' : 'tag-neutral'}`}>{t.priority}</span></div>
            ))}
            <Link className="btn btn-blue btn-sm" to="/doctor/queue">Open Live OPD Queue →</Link>
          </div>
          <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Quick Links</h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Link className="btn btn-ghost btn-sm" to="/admin/opd">OPD Ops</Link>
              <Link className="btn btn-ghost btn-sm" to="/admin/kiosks">Kiosks</Link>
              <Link className="btn btn-ghost btn-sm" to="/admin/staff">Staff</Link>
              <Link className="btn btn-ghost btn-sm" to="/admin/analytics">Analytics</Link>
              <Link className="btn btn-ghost btn-sm" to="/admin/audit">Audit</Link>
              <Link className="btn btn-ghost btn-sm" to="/admin/settings">Settings</Link>
              <Link className="btn btn-ghost btn-sm" to="/admin/alerts">Alerts</Link>
            </div>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
