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
    nav('/checkin/patient-dashboard');
  };
  const getTranslated = (key) => {
    const t = {
      stepLabel: { English: 'STEP 1 · CHECK-IN', 'हिन्दी': 'चरण 1 · चेक-इन', 'ਪੰਜਾਬੀ': 'ਕਦਮ 1 · ਚੈੱਕ-ਇਨ' },
      title: { English: 'Confirm Your Details', 'हिन्दी': 'अपने विवरण की पुष्टि करें', 'ਪੰਜਾਬੀ': 'ਆਪਣੇ ਵੇਰਵਿਆਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ' },
      voice: { English: 'Please confirm your details are correct before we issue your token.', 'हिन्दी': 'टोकन जारी करने से पहले कृपया पुष्टि करें कि आपका विवरण सही है।', 'ਪੰਜਾਬੀ': 'ਟੋਕਨ ਜਾਰੀ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਕਿਰਪਾ ਕਰਕੇ ਪੁਸ਼ਟੀ ਕਰੋ ਕਿ ਤੁਹਾਡੇ ਵੇਰਵੇ ਸਹੀ ਹਨ।' },
      verified: { English: 'ABHA Verified', 'हिन्दी': 'ABHA सत्यापित', 'ਪੰਜਾਬੀ': 'ABHA ਪ੍ਰਮਾਣਿਤ' },
      pending: { English: 'UHID pending', 'हिन्दी': 'UHID लंबित', 'ਪੰਜਾਬੀ': 'UHID ਬਕਾਇਆ' },
      name: { English: 'Name', 'हिन्दी': 'नाम', 'ਪੰਜਾਬੀ': 'ਨਾਮ' },
      ageGen: { English: 'Age / Gender', 'हिन्दी': 'उम्र / लिंग', 'ਪੰਜਾਬੀ': 'ਉਮਰ / ਲਿੰਗ' },
      mob: { English: 'Mobile', 'हिन्दी': 'मोबाइल', 'ਪੰਜਾਬੀ': 'ਮੋਬਾਈਲ' },
      cityState: { English: 'City / State', 'हिन्दी': 'शहर / राज्य', 'ਪੰਜਾਬੀ': 'ਸ਼ਹਿਰ / ਰਾਜ' },
      makeChange: { English: 'Make Changes', 'हिन्दी': 'बदलाव करें', 'ਪੰਜਾਬੀ': 'ਬਦਲਾਅ ਕਰੋ' },
      issueBtn: { English: 'Yes, Issue Token', 'हिन्दी': 'हाँ, टोकन जारी करें', 'ਪੰਜਾਬੀ': 'ਹਾਂ, ਟੋਕਨ ਜਾਰੀ ਕਰੋ' }
    };
    return t[key][state.language] || t[key]['English'];
  };

  return (
    <KioskShell stepLabel={getTranslated('stepLabel')} title={getTranslated('title')} back="/checkin/identify" progress={48} hideNav>
      <VoiceBar text={getTranslated('voice')} />
      <div className="card">
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}><StatusTag kind="info">{getTranslated('verified')}</StatusTag><StatusTag kind="neutral">{p.uhid || getTranslated('pending')}</StatusTag></div>
        <div className="grid cols-2">
          <div><b>{getTranslated('name')}</b><br />{p.name || '—'}</div>
          <div><b>{getTranslated('ageGen')}</b><br />{p.age || '—'} · {p.gender || '—'}</div>
          <div><b>{getTranslated('mob')}</b><br />{p.mobile || '—'}</div>
          <div><b>{getTranslated('cityState')}</b><br />{p.city || '—'}, {p.state || '—'}</div>
          <div><b>ABHA</b><br /><span className="mono">{p.abha || '—'}</span></div>
          <div><b>UHID</b><br /><span className="mono">{p.uhid || '—'}</span></div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          <Link className="btn btn-secondary" to="/checkin/register">{getTranslated('makeChange')}</Link>
          <button className="btn btn-primary" onClick={issue}>{getTranslated('issueBtn')}</button>
        </div>
      </div>
    </KioskShell>
  );
}
