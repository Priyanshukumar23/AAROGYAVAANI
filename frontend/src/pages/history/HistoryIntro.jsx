import KioskShell from '../../components/KioskShell';
import { VoiceBar, Steps } from '../../components/ui';

export default function HistoryIntro() {
  return (
    <KioskShell stepLabel="STEP 2 · CLINICAL HISTORY" title="Tell Us About Your Health" back="/checkin/token" next="/history/chief-complaint" nextLabel="Start" progress={65}>
      <VoiceBar text="Our AI assistant will ask simple questions about your symptoms. This helps your doctor treat you faster." />
      <div className="card">
        <h3>How it works (4 quick steps)</h3>
        <Steps items={['Describe problem', 'Pick symptoms', 'AI questions', 'Review & done']} active={0} />
        <div className="grid cols-2" style={{ marginTop: 12 }}>
          <div className="notice">🗣️ <b>Speak or type</b><br /><span className="small">Use the mic or keypad — both work.</span></div>
          <div className="notice">🔒 <b>Private & secure</b><br /><span className="small">Only your care team sees this.</span></div>
          <div className="notice">⚡ <b>~3 minutes</b><br /><span className="small">Short questions, big time saved.</span></div>
          <div className="notice">🚨 <b>Emergency?</b><br /><span className="small">Red-flag symptoms alert staff instantly.</span></div>
        </div>
      </div>
    </KioskShell>
  );
}
