import { Link } from 'react-router-dom';
import KioskShell from '../../components/KioskShell';
import { useApp } from '../../context/AppContext';
import { VoiceBar, StatusTag } from '../../components/ui';

export default function ExitCompleted() {
  return (
    <KioskShell stepLabel="VISIT COMPLETE" title="Consultation Completed ✓" progress={100} hideNav>
      <VoiceBar text="Your consultation is complete. Here is your visit summary." />
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>✅</div>
        <h3>Thank you! Your visit is recorded.</h3>
        <p className="muted">Diagnosis, prescription and follow-up are ready below.</p>
        <Link className="btn btn-primary" to="/exit/summary">View Visit Summary</Link>
      </div>
    </KioskShell>
  );
}

export function VisitSummary() {
  const { state } = useApp();
  const p = state.patient || {};
  return (
    <KioskShell stepLabel="VISIT SUMMARY" title="Visit Summary" progress={100} hideNav>
      <div className="card">
        <StatusTag kind="info">ICD-11 · BA00 Essential hypertension</StatusTag>
        <div className="grid cols-2" style={{ marginTop: 10 }}>
          <div><b>Patient</b><br />{p.name} · {p.age} · {p.gender}</div>
          <div><b>Doctor</b><br />Dr. A. Verma · Room 104</div>
        </div>
        <p style={{ marginTop: 10 }}><b>Summary:</b> Severe chest discomfort evaluated; vitals show Stage-2 HTN. ECG sinus rhythm. Started on safer antibiotic per allergy; BP medicines continued. Lifestyle counselling done.</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" to="/exit/prescription">View Prescription</Link>
          <Link className="btn btn-ghost" to="/exit/completed">Back</Link>
        </div>
      </div>
    </KioskShell>
  );
}

export function PrescriptionDocs() {
  return (
    <KioskShell stepLabel="PRESCRIPTION" title="Prescription & Documents" progress={100} hideNav>
      <div className="alert-banner alert-p2" style={{ marginBottom: 12 }}>⚠️ <span><b>Amoxicillin AVOIDED</b> — patient allergy (Penicillin). Substituted with <b>Azithromycin</b>.</span></div>
      <div className="table-wrap">
        <table className="tbl">
          <thead><tr><th>Medicine</th><th>Dose</th><th>Days</th></tr></thead>
          <tbody>
            <tr><td>Azithromycin 500mg</td><td>1 OD</td><td>3</td></tr>
            <tr><td>Telmisartan 40mg</td><td>1 OD (morning)</td><td>30</td></tr>
            <tr><td>Metformin 500mg</td><td>1 BD (after food)</td><td>30</td></tr>
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={() => window.print()}>Print / Download</button>
        <Link className="btn btn-primary" to="/exit/followup">Follow-Up Plan</Link>
      </div>
    </KioskShell>
  );
}

export function FollowUp() {
  return (
    <KioskShell stepLabel="FOLLOW-UP" title="Follow-Up in 7 Days" progress={100} hideNav>
      <div className="grid cols-2">
        <div className="notice">✅ <b>Do</b><br /><span className="small">Take BP medicines daily · low salt · walk 20 min · return if chest pain/breathlessness.</span></div>
        <div className="notice">🚫 <b>Don&apos;t</b><br /><span className="small">No smoking/alcohol · don&apos;t stop medicines · avoid NSAIDs without asking.</span></div>
      </div>
      <div className="card" style={{ marginTop: 12 }}><b>Next visit:</b> 15 Sep 2026 · General Medicine · bring this slip + reports.<br /><div style={{ marginTop: 10 }}><Link className="btn btn-primary" to="/exit/done">Finish</Link></div></div>
    </KioskShell>
  );
}

export function FinalExit() {
  const { resetKiosk } = useApp();
  return (
    <KioskShell title="Thank You — Get Well Soon 🙏" progress={100} hideNav>
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>🙏</div>
        <h3>Your records are saved to ABHA.</h3>
        <p className="muted">SMS with prescription link sent. Kiosk will reset for the next patient.</p>
        <Link className="btn btn-primary" to="/" onClick={() => resetKiosk()}>Back to Home (Reset Kiosk)</Link>
      </div>
    </KioskShell>
  );
}
