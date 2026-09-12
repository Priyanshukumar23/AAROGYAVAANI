import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { PriorityTag, Kpi } from '../../components/ui';
import { MOCK_QUEUE } from '../../data/mock';
import { api } from '../../data/api';

export default function DoctorDashboard() {
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    api.get('/tokens').then(d => {
      const list = Array.isArray(d) ? d : d.tokens || d.queue;
      if (list?.length) setQueue(list);
    }).catch(() => {});
  }, []);

  const filtered = queue.filter(t => {
    if (filter === 'Priority' && t.priority === 'P3') return false;
    if (filter === 'Routine' && t.priority !== 'P3') return false;
    if (q && !(t.name + t.tokenNo + t.complaint).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const redFlags = queue.filter(t => t.priority === 'P1');

  return (
    <StaffShell role="doctor" title="Namaste, Dr. Sharma 🙏" subtitle="General Medicine · Tuesday OPD · ABDM linked">
      <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className="tag tag-info">🏥 Room 104</span>
        <span className="muted small">{paused ? 'Session paused — queue held' : 'Session live · avg 6 min / patient'}</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-primary btn-sm" onClick={() => setQueue(qq => qq.slice(1))}>📢 Call Next</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setPaused(p => !p)}>{paused ? 'Resume' : 'Pause'}</button>
        </span>
      </div>
      <div className="kpi-row" style={{ marginTop: 12 }}>
        <Kpi v="42" l="Scheduled" sub="Today OPD" />
        <Kpi v={String(queue.length)} l="In Queue" sub="Waiting now" />
        <Kpi v="1" l="In Chamber" sub={queue[0]?.tokenNo || '—'} />
        <Kpi v="27" l="Done" sub="Consulted today" />
      </div>
      <div className="split split-2" style={{ marginTop: 12 }}>
        <div className="card">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ margin: 0 }}>OPD Queue</h3>
            {['All', 'Priority', 'Routine'].map(f => (
              <button key={f} className={'btn btn-sm ' + (filter === f ? 'btn-blue' : 'btn-ghost')} onClick={() => setFilter(f)}>{f}</button>
            ))}
            <input className="input staff" placeholder="Search token / name…" value={q} onChange={e => setQ(e.target.value)} style={{ marginLeft: 'auto', maxWidth: 180 }} />
          </div>
          {filtered.map(t => (
            <div key={t.tokenNo} className={'queue-item' + (t.priority === 'P1' ? ' flash' : '')}>
              <div><strong>{t.tokenNo}</strong> · {t.name} <span className="muted small">{t.age}/{t.sex} · ⏳ {t.wait}</span><br /><span className="small muted">{t.complaint}</span></div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <PriorityTag level={t.priority} />
                <Link className="btn btn-blue btn-sm" to={`/doctor/case/${t.tokenNo}`}>Open Case</Link>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="notice">No patients match this filter.</div>}
        </div>
        <div>
          {redFlags.length > 0 ? (
            <div className="alert-banner alert-p1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <strong style={{ fontSize: 15, color: 'var(--p1-ink)' }}>🚨 {redFlags.length} RED FLAG ALERT{redFlags.length > 1 ? 'S' : ''}</strong>
                <div className="small" style={{ marginTop: 4, color: 'var(--p1-ink)' }}>
                  {redFlags.slice(0, 2).map(r => `${r.tokenNo || r.token || 'STAT'} · ${r.name || r.patientName || 'Patient'} (${r.complaint || r.reason || 'STAT Alert'})`).join(' | ')}
                </div>
              </div>
              <Link className="btn btn-danger btn-sm" to="/doctor/alerts">Review STAT</Link>
            </div>
          ) : (
            <div className="alert-banner alert-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, background: 'var(--p3-bg)', borderColor: 'var(--p3)' }}>
              <div>
                <strong style={{ fontSize: 15, color: 'var(--p3-ink)' }}>✅ 0 Red Flags Active</strong>
                <div className="small" style={{ marginTop: 2, color: 'var(--p3-ink)' }}>All OPD queue patients are triaged stable.</div>
              </div>
              <Link className="btn btn-ghost btn-sm" to="/doctor/alerts">View Alerts</Link>
            </div>
          )}

          <div className="card" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>📄 OCR Stack</h3>
              <span className="tag tag-neutral">3 pending</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: 'var(--bg-rec)', padding: '10px 12px', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  <span>Report_A142_CBC.pdf</span>
                  <span style={{ color: 'var(--p3-ink)' }}>✓ 96%</span>
                </div>
                <div className="ocr-bar"><div className="ocr-fill" style={{ width: '96%' }} /></div>
              </div>
              <div style={{ background: 'var(--bg-rec)', padding: '10px 12px', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  <span>Rx_2024_old.jpg</span>
                  <span style={{ color: 'var(--blue)' }}>⏳ 88%</span>
                </div>
                <div className="ocr-bar"><div className="ocr-fill" style={{ width: '88%' }} /></div>
              </div>
              <div style={{ background: 'var(--bg-rec)', padding: '10px 12px', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  <span>ECG_A142.png</span>
                  <span className="muted">Queued</span>
                </div>
                <div className="ocr-bar"><div className="ocr-fill" style={{ width: '15%' }} /></div>
              </div>
            </div>
            <Link className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start', marginTop: 4 }} to="/doctor/documents">Open OCR Review →</Link>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
