import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';

export default function RedFlagAlert() {
  const [secs, setSecs] = useState(8 * 60 + 24);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return (
    <StaffShell role="doctor" title="Red Flag Alerts" subtitle="STAT P1 escalation · SNOMED-coded · NABH audit">
      <div className="alert-banner alert-p1">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <strong style={{ fontSize: 18 }}>🚨 STAT P1 · A-142 · Suspected ACS</strong>
          <span className="tag tag-neutral">⏱ T-minus response {mm}:{ss}</span>
        </div>
        <p className="small">Ramesh Kumar Sharma, 48M · exertional chest heaviness 24h + HTN 150/94 · SNOMED 53741008 (coronary ischemia) · HEART ~6</p>
        <p className="small">⛔ Drug contraindication: <strong>Penicillin / Amoxicillin — allergy (rash)</strong>. e-Rx engine will block.</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          <button className="btn btn-sm" style={{ background: '#fff', color: '#b91c1c' }} onClick={() => window.print()}>🖨 Print STAT</button>
          <button className="btn btn-sm" style={{ background: '#fff', color: '#b91c1c' }} onClick={() => alert('Chamber + ECG room paged.')}>📞 Call Chamber</button>
          <Link className="btn btn-sm" style={{ background: '#fff', color: '#b91c1c' }} to="/doctor/case/A-142">Review Alert →</Link>
        </div>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h3 style={{ marginTop: 0 }}>Priority Queue (P1 → P2)</h3>
        <div className="queue-item flash"><span><strong>A-142</strong> Ramesh K. Sharma · chest pain</span><span className="tag tag-p1">P1 STAT</span></div>
        <div className="queue-item"><span><strong>A-130</strong> Priya Patel · RLQ abdominal pain</span><span className="tag tag-p2">P2 Urgent</span></div>
      </div>
    </StaffShell>
  );
}
