import StaffShell from '../../components/StaffShell';
import { Kpi, StatusTag } from '../../components/ui';

const WEEK = [
  { d: 'Mon', v: 420 }, { d: 'Tue', v: 642 }, { d: 'Wed', v: 580 }, { d: 'Thu', v: 510 }, { d: 'Fri', v: 600 }, { d: 'Sat', v: 380 }, { d: 'Sun', v: 210 },
];
const max = Math.max(...WEEK.map(w => w.v));
const DONUT = [{ l: 'P3 Routine', v: 68, c: 'var(--blue)' }, { l: 'P2 Urgent', v: 24, c: '#f59e0b' }, { l: 'P1 STAT', v: 8, c: '#dc2626' }];

export default function Analytics() {
  const csv = () => {
    const blob = new Blob([['day', 'checkins'].join(',') + '\n' + WEEK.map(w => [w.d, w.v].join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'weekly-checkins.csv'; a.click();
  };
  return (
    <StaffShell role="admin" title="Analytics & Reports" subtitle="Weekly trends · triage velocity · intake latency" actions={<><button className="btn btn-ghost btn-sm" onClick={csv}>Export CSV</button><button className="btn btn-blue btn-sm" onClick={() => window.print()}>Export PDF</button></>}>
      <div className="kpi-row"><Kpi v="3.3k" l="Check-ins" sub="this week" /><Kpi v="4.1m" l="Avg Triage" sub="assess time" /><Kpi v="2.8m" l="Intake Latency" sub="kiosk median" /><Kpi v="96%" l="SLA Met" /></div>
      <div className="split split-2" style={{ marginTop: 12 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Weekly Check-ins</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'end', height: 160 }}>
            {WEEK.map(w => (
              <div key={w.d} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: Math.round((w.v / max) * 120), background: 'var(--blue)', borderRadius: '6px 6px 0 0' }} title={w.v} />
                <div className="small muted">{w.d}<br /><strong>{w.v}</strong></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Priority Mix <StatusTag kind="info">donut</StatusTag></h3>
          <div style={{ display: 'flex', gap: 6, height: 22, borderRadius: 11, overflow: 'hidden' }}>
            {DONUT.map(d => <div key={d.l} style={{ width: d.v + '%', background: d.c }} title={`${d.l} ${d.v}%`} />)}
          </div>
          <div style={{ marginTop: 8 }}>{DONUT.map(d => <div key={d.l} className="small" style={{ padding: '3px 0' }}><span style={{ display: 'inline-block', width: 10, height: 10, background: d.c, borderRadius: 2, marginRight: 6 }} />{d.l} — <strong>{d.v}%</strong></div>)}</div>
          <h4 style={{ marginBottom: 4 }}>Intake latency (mock line)</h4>
          <div style={{ display: 'flex', gap: 4, alignItems: 'end', height: 60 }}>{[3.4, 3.1, 2.9, 2.8, 2.6, 2.8, 2.5].map((v, i) => <div key={i} style={{ flex: 1, height: v * 18, background: '#10b981', borderRadius: 4 }} title={v + 'm'} />)}</div>
          <div className="small muted">Median kiosk intake 2.8 min · ↓ 18% WoW · triage velocity 14.6/hr</div>
        </div>
      </div>
    </StaffShell>
  );
}
