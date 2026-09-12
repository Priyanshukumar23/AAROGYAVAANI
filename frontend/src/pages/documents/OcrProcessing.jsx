import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';

const STEPS = ['Detecting document edges', 'Reading text (OCR)', 'Extracting medicines', 'Checking abnormal values'];

export default function OcrProcessing() {
  const [p, setP] = useState(0);
  const nav = useNavigate();
  useEffect(() => {
    const t = setInterval(() => setP((v) => Math.min(100, v + 8)), 250);
    const go = setTimeout(() => nav('/documents/review'), 3200);
    return () => { clearInterval(t); clearTimeout(go); };
  }, [nav]);
  const done = Math.floor((p / 100) * STEPS.length);
  return (
    <KioskShell stepLabel="STEP 4 · DOCUMENTS" title="Reading Your Document…" progress={95} hideNav>
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>🔍</div>
        <h3 className="mono">{p}%</h3>
        <div className="ocr-bar" style={{ margin: '12px 0' }}><div className="ocr-fill" style={{ width: p + '%' }} /></div>
        <div style={{ textAlign: 'left', maxWidth: 420, margin: '0 auto' }}>
          {STEPS.map((s, i2) => <div key={s} className="small" style={{ padding: '6px 0' }}>{i2 < done ? '✅' : i2 === done ? '⏳' : '○'} {s}</div>)}
        </div>
        <Link className="btn btn-ghost" style={{ marginTop: 12 }} to="/documents/scanner">Cancel</Link>
      </div>
    </KioskShell>
  );
}
