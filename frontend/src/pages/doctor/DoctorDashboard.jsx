import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { PriorityTag, Kpi } from '../../components/ui';
import { MOCK_RED_FLAGS, MOCK_OCR_STACK, AVG_CONSULT_MIN, ROOM_LABEL, priorityLabel, aiStatusLabel } from '../../data/doctorMock';
import { doctorApi } from '../../data/doctorApi';
import { subscribeQueue, subscribeCalled, dashboardCounters, waitingInfo } from '../../data/queueStore';

function AiStatusBadge({ status, confidence }) {
  if (status === 'ready') {
    return (
      <span className="tag tag-info" title="AI-generated clinical information — verify before clinical decisions">
        ✓ {aiStatusLabel(status, confidence)}
      </span>
    );
  }
  if (status === 'processing') {
    return <span className="tag tag-neutral">⏳ {aiStatusLabel(status)}</span>;
  }
  return <span className="tag tag-neutral" style={{ opacity: 0.75 }}>{aiStatusLabel(status)}</span>;
}

function QueueItem({ t }) {
  const ageSex = `${t.age}${t.sex || ''}`;
  return (
    <div className={'queue-item' + (t.priority === 'P1' ? ' flash' : '')} style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
      <div style={{ minWidth: 0 }}>
        <div>
          <strong>{t.tokenNo}</strong> · {t.name} · {ageSex}
        </div>
        <div className="small muted" style={{ marginTop: 2 }}>
          Waiting: {t.status === 'in-chamber' ? 'In chamber' : t.waitMin === 0 ? 'Now' : `${t.waitMin ?? t.wait} ${typeof t.waitMin === 'number' ? 'min' : ''}`}
          {'  ·  '}{priorityLabel(t.priority)}
        </div>
        <div className="small muted" style={{ marginTop: 2 }}>{t.complaint || t.chiefComplaint}</div>
        <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <PriorityTag level={t.priority} />
          <AiStatusBadge status={t.aiStatus} confidence={t.aiConfidence} />
          {t.status === 'in-chamber' && <span className="tag tag-neutral">In Chamber</span>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <Link className="btn btn-blue btn-sm" to={`/doctor/case/${t.tokenNo}`}>Open Case</Link>
      </div>
    </div>
  );
}

function RedFlagCard({ flags }) {
  if (!flags.length) {
    return (
      <div className="alert-banner alert-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, background: 'var(--p3-bg)', borderColor: 'var(--p3)' }}>
        <div>
          <strong style={{ fontSize: 15, color: 'var(--p3-ink)' }}>✅ 0 Red Flags Active</strong>
          <div className="small" style={{ marginTop: 2, color: 'var(--p3-ink)' }}>All OPD queue patients are triaged stable.</div>
        </div>
        <Link className="btn btn-ghost btn-sm" to="/doctor/alerts">View Alerts</Link>
      </div>
    );
  }
  const top = flags[0];
  const isStat = top.severity === 'STAT' || top.priority === 'P1';
  return (
    <div className={'alert-banner ' + (isStat ? 'alert-p1' : 'alert-p2')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
      <div style={{ minWidth: 0 }}>
        <strong style={{ fontSize: 15 }}>🚨 RED FLAG ALERT{flags.length > 1 ? ` · ${flags.length} active` : ''}</strong>
        <div className="small" style={{ marginTop: 4, fontWeight: 700 }}>
          {top.tokenNo} · {top.patientName || top.name}
        </div>
        <div className="small" style={{ marginTop: 2 }}>{top.reason || top.message || top.complaint}</div>
        <div className="small" style={{ marginTop: 4 }}>
          Severity: <strong>{top.severity || (isStat ? 'STAT' : 'Urgent')}</strong>
          {'  ·  '}{top.kind || (isStat ? 'Emergency' : 'Urgent')}
          {flags.length > 1 && (
            <span className="muted">  ·  +{flags.length - 1} more ({flags.slice(1).map((f) => f.tokenNo).join(', ')})</span>
          )}
        </div>
      </div>
      <Link className="btn btn-danger btn-sm" to={`/doctor/case/${top.tokenNo}`}>Review STAT</Link>
    </div>
  );
}

function OcrStackCard({ docs }) {
  return (
    <div className="card" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>📄 OCR Stack</h3>
        <span className="tag tag-neutral">{docs.filter((d) => d.status !== 'complete').length} pending</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {docs.map((d) => (
          <Link key={d.id} to="/doctor/documents" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: 'var(--bg-rec)', padding: '10px 12px', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, marginBottom: 6, gap: 8 }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.fileName}</span>
                <span style={{ flexShrink: 0, color: d.status === 'complete' ? 'var(--p3-ink)' : d.status === 'processing' ? 'var(--blue)' : 'var(--muted)' }}>
                  {d.status === 'complete' ? `✓ ${d.label}` : d.status === 'processing' ? `⏳ ${d.label}` : d.label}
                </span>
              </div>
              <div className="ocr-bar"><div className="ocr-fill" style={{ width: `${d.progress}%` }} /></div>
              {d.confidence != null && (
                <div className="small muted" style={{ marginTop: 4 }}>Confidence {d.confidence}%</div>
              )}
            </div>
          </Link>
        ))}
      </div>
      <Link className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start', marginTop: 4 }} to="/doctor/documents">Open OCR Review →</Link>
    </div>
  );
}

export default function DoctorDashboard() {
  const nav = useNavigate();
  const [queue, setQueue] = useState([]);
  const [called, setCalled] = useState(null);
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');
  const [paused, setPaused] = useState(false);
  const [calling, setCalling] = useState(false);

  useEffect(() => {
    let live = true;
    doctorApi.getDashboard().then((d) => {
      if (!live) return;
      if (d?.queue?.length) setQueue(d.queue);
      if (d?.called) setCalled(d.called);
    }).catch(() => {});
    const offQ = subscribeQueue((list) => setQueue(list || []));
    const offC = subscribeCalled((c) => setCalled(c));
    return () => { live = false; offQ(); offC(); };
  }, []);

  const filtered = useMemo(() => queue.filter((t) => {
    if (filter === 'Priority' && t.priority === 'P3') return false;
    if (filter === 'Routine' && t.priority !== 'P3') return false;
    if (q) {
      const hay = `${t.name || ''} ${t.tokenNo || ''} ${t.complaint || t.chiefComplaint || ''}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  }), [queue, filter, q]);

  const counters = useMemo(() => dashboardCounters(queue), [queue]);
  const wait = useMemo(() => waitingInfo(queue, AVG_CONSULT_MIN), [queue]);
  const redFlags = useMemo(() => {
    const fromQueue = queue.filter((t) => t.priority === 'P1').map((t) => ({
      id: t.tokenNo, tokenNo: t.tokenNo, patientName: t.name,
      reason: t.complaint || 'Emergency symptoms detected', severity: 'STAT', priority: 'P1', kind: 'Emergency',
    }));
    const base = MOCK_RED_FLAGS.length ? MOCK_RED_FLAGS : fromQueue;
    // Prefer live queue P1s, fall back to curated mock reasons.
    if (fromQueue.length) {
      return fromQueue.map((f) => {
        const m = MOCK_RED_FLAGS.find((x) => x.tokenNo === f.tokenNo);
        return m ? { ...f, reason: m.reason } : f;
      });
    }
    return base;
  }, [queue]);

  const ocrDocs = MOCK_OCR_STACK;
  const readyCount = queue.filter((t) => t.aiStatus === 'ready').length;

  const callNext = async () => {
    if (paused || calling) return;
    setCalling(true);
    try {
      const res = await doctorApi.callNext(ROOM_LABEL);
      if (res?.queue) setQueue(res.queue);
      if (res?.called) setCalled(res.called);
    } finally {
      setCalling(false);
    }
  };

  return (
    <StaffShell role="doctor" title="Namaste, Dr. Sharma 🙏" subtitle="General Medicine · Tuesday OPD · ABDM linked">
      <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className="tag tag-info">🏥 {ROOM_LABEL}</span>
        <span className="muted small">{paused ? 'Session paused — queue held' : `Session live · avg ${AVG_CONSULT_MIN} min / patient · ${readyCount} AI summaries ready`}</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-primary btn-sm" onClick={callNext} disabled={paused || calling}>
            📢 {calling ? 'Calling…' : 'Call Next'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setPaused((p) => !p)}>{paused ? 'Resume' : 'Pause'}</button>
        </span>
      </div>

      {called && (
        <div className="notice" style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 28 }}>📢</span>
          <div>
            <div style={{ fontWeight: 800 }}>Calling {called.tokenNo} — {called.name}</div>
            <div className="small">Please proceed to {called.room || ROOM_LABEL}.</div>
          </div>
          <Link className="btn btn-blue btn-sm" style={{ marginLeft: 'auto' }} to={`/doctor/case/${called.tokenNo}`}>Open Case →</Link>
        </div>
      )}

      <div className="kpi-row" style={{ marginTop: 12 }}>
        <Kpi v={String(counters.scheduled)} l="Scheduled" sub="Today OPD" />
        <Kpi v={String(counters.inQueue)} l="In Queue" sub="Waiting now" />
        <Kpi v={String(counters.inChamber)} l="In Chamber" sub={counters.inChamberToken} />
        <Kpi v={String(counters.done)} l="Done" sub="Consulted today" />
      </div>

      <div className="split split-2" style={{ marginTop: 12 }}>
        <div className="card">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0 }}>OPD Queue</h3>
            {['All', 'Priority', 'Routine'].map((f) => (
              <button key={f} className={'btn btn-sm ' + (filter === f ? 'btn-blue' : 'btn-ghost')} onClick={() => setFilter(f)}>{f}</button>
            ))}
            <input className="input staff" placeholder="Search token / name…" value={q} onChange={(e) => setQ(e.target.value)} style={{ marginLeft: 'auto', maxWidth: 180 }} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); const val = e.target.elements.uhid.value.trim(); if(val) nav(`/doctor/case/${val}`); }} style={{ display: 'flex', gap: 8, marginBottom: 12, background: 'var(--bg-rec)', padding: '8px 12px', borderRadius: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 600 }}>🔍 Fetch Patient:</span>
            <input name="uhid" className="input staff" placeholder="Enter UHID..." style={{ flex: 1 }} required />
            <button type="submit" className="btn btn-secondary btn-sm">Search History</button>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((t) => (
              <QueueItem key={t.tokenNo} t={t} />
            ))}
          </div>
          {filtered.length === 0 && <div className="notice" style={{ marginTop: 12 }}>No patients match this filter.</div>}
          <div className="small muted" style={{ marginTop: 10 }}>
            AI-generated clinical information — verify before making clinical decisions.
          </div>
        </div>

        <div>
          <RedFlagCard flags={redFlags} />

          <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>⏱ Waiting Time</h3>
            <div className="small" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div>Current Token: <strong>{wait.currentToken}</strong></div>
              <div>Patients Waiting: <strong>{wait.patientsWaiting}</strong></div>
              <div>Average: <strong>{wait.avgMin} min/patient</strong></div>
              <div>Estimated Wait: <strong>~{wait.estimatedWaitMin} min</strong></div>
            </div>
          </div>

          <OcrStackCard docs={ocrDocs} />

          <div className="small muted" style={{ marginTop: 10, fontSize: 12, lineHeight: 1.5 }}>
            AI-generated information is for clinical assistance only. Verify before making clinical decisions.
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
