import { Link, useNavigate } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar, StatusTag } from '../../components/ui';
import { upsertQueuePatient } from '../../data/queueStore';

export default function InfoConfirmation() {
  const { state, patch } = useApp();
  const p = state.patient || {};
  const nav = useNavigate();
  const issue = async () => {
    const tokenNo = 'A-14' + Math.floor(Math.random() * 9 + 1);
    const token = { tokenNo, room: 'Room 104', position: 14, waitMin: 42, nowServing: 'A-127' };
    patch({ token });
    // Sync to shared staff queue (nurse + doctor see it instantly, same-tab + other tabs).
    const sex = p.gender ? String(p.gender)[0].toUpperCase() : '';
    upsertQueuePatient({
      tokenNo,
      name: p.name || 'New Patient',
      patientName: p.name || 'New Patient',
      age: p.age ?? 0,
      sex,
      gender: p.gender || '',
      uhid: p.uhid || '',
      mobile: p.mobile || '',
      abha: p.abha || p.abhaId || '',
      department: 'General Medicine',
      room: token.room,
      complaint: 'Registration complete · awaiting clinical history',
      chiefComplaint: 'Registration complete · awaiting clinical history',
      priority: 'P3',
      status: 'waiting',
      waitMin: token.waitMin,
      wait: `${token.waitMin} min`,
      aiStatus: 'processing',
      aiConfidence: null,
    });
    try {
      await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenNo,
          name: p.name,
          patientName: p.name,
          age: p.age,
          sex,
          gender: p.gender,
          uhid: p.uhid,
          mobile: p.mobile,
          abha: p.abha || p.abhaId,
          city: p.city,
          state: p.state,
          department: 'General Medicine',
          room: token.room,
          complaint: 'Registration complete · awaiting clinical history',
          chiefComplaint: 'Registration complete · awaiting clinical history',
          priority: 'P3',
          status: 'waiting',
          waitMin: token.waitMin,
          estimatedWaitMin: token.waitMin,
        }),
      });
    } catch {}
    nav('/checkin/department');
  };
  return (
    <KioskShell stepLabel="STEP 1 · CHECK-IN" title="Confirm Your Details" back="/checkin/identify" progress={48} hideNav>
      <VoiceBar text="Please confirm your details are correct before we issue your token." />
      <div className="card">
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}><StatusTag kind="info">ABHA Verified</StatusTag><StatusTag kind="neutral">{p.uhid || 'UHID pending'}</StatusTag></div>
        <div className="grid cols-2">
          <div><b>Name</b><br />{p.name || '—'}</div>
          <div><b>Age / Gender</b><br />{p.age || '—'} · {p.gender || '—'}</div>
          <div><b>Mobile</b><br />{p.mobile || '—'}</div>
          <div><b>City / State</b><br />{p.city || '—'}, {p.state || '—'}</div>
          <div><b>ABHA</b><br /><span className="mono">{p.abha || '—'}</span></div>
          <div><b>UHID</b><br /><span className="mono">{p.uhid || '—'}</span></div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          <Link className="btn btn-secondary" to="/checkin/register">Make Changes</Link>
          <button className="btn btn-primary" onClick={issue}>Yes, Issue Token</button>
        </div>
      </div>
    </KioskShell>
  );
}
