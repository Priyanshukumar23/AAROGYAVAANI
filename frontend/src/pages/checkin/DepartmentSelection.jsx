import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar } from '../../components/ui';
import { DEPARTMENTS } from '../../data/mock';

export default function DepartmentSelection() {
  const { state, patch } = useApp();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(state.department?.id || 'general');
  const nav = useNavigate();
  const list = DEPARTMENTS.filter((d) => (d.name + d.hi + d.desc).toLowerCase().includes(q.toLowerCase()));
  const confirm = () => {
    const dept = DEPARTMENTS.find((d) => d.id === sel);
    if (dept) patch({ department: dept });
    nav('/checkin/token');
  };
  return (
    <KioskShell stepLabel="STEP 1 · PATIENT CHECK-IN" title="Select Department" back="/checkin/confirm" progress={55} onNext={confirm} nextLabel="Confirm Department">
      <VoiceBar text="Search and select the department for your visit." />
      <div className="field"><input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Search department, e.g. fever, bone, eye…" /></div>
      <div className="grid cols-3">
        {list.map((d) => (
          <div key={d.id} className={`card selectable ${sel === d.id ? 'selected' : ''}`} onClick={() => setSel(d.id)}>
            <div style={{ fontSize: 36 }}>{d.icon}</div>
            <h4>{d.name}</h4>
            <div className="small muted">{d.hi}</div>
            <div className="small">{d.desc}</div>
            <div className="small muted">{d.room}</div>
          </div>
        ))}
      </div>
      {list.length === 0 && <p className="muted">No departments match “{q}”.</p>}
      <div style={{ marginTop: 14 }}><button className="btn btn-primary btn-block" onClick={confirm}>Confirm Department</button></div>
    </KioskShell>
  );
}
